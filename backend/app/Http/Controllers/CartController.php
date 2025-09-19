<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $cartItems = CartItem::with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'image', 'stock');
            }])
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                        'stock' => $item->product->stock,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->product->price,
                    'total_price' => $item->quantity * $item->product->price,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            $totalItems = $cartItems->sum('quantity');
            $totalAmount = $cartItems->sum('total_price');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'cart_items' => $cartItems,
                    'summary' => [
                        'total_items' => $totalItems,
                        'total_amount' => round($totalAmount, 2),
                        'items_count' => $cartItems->count(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch cart items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function add(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $user = Auth::user();
            $productId = $request->product_id;
            $quantity = $request->quantity;

            // Check if product exists and is active
            $product = Product::where('id', $productId)
                ->first();

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found or inactive'
                ], 404);
            }

            // Check if product has enough stock
            if (!$product->hasStock($quantity)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient stock available',
                    'data' => [
                        'available_stock' => $product->stock,
                        'requested_quantity' => $quantity
                    ]
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Check if item already exists in cart
                $existingCartItem = CartItem::where('user_id', $user->id)
                    ->where('product_id', $productId)
                    ->first();

                if ($existingCartItem) {
                    $newQuantity = $existingCartItem->quantity + $quantity;
                    
                    // Check if new quantity exceeds stock
                    if (!$product->hasStock($newQuantity)) {
                        DB::rollBack();
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Cannot add more items. Insufficient stock available',
                            'data' => [
                                'current_cart_quantity' => $existingCartItem->quantity,
                                'available_stock' => $product->stock,
                                'requested_additional' => $quantity
                            ]
                        ], 400);
                    }

                    $existingCartItem->update(['quantity' => $newQuantity]);
                    $cartItem = $existingCartItem;
                } else {
                    $cartItem = CartItem::create([
                        'user_id' => $user->id,
                        'product_id' => $productId,
                        'quantity' => $quantity,
                    ]);
                }

                DB::commit();

                // Load product relationship
                $cartItem->load('product');

                return response()->json([
                    'status' => 'success',
                    'message' => 'Product added to cart successfully',
                    'data' => [
                        'cart_item' => [
                            'id' => $cartItem->id,
                            'product_id' => $cartItem->product_id,
                            'product' => [
                                'id' => $cartItem->product->id,
                                'name' => $cartItem->product->name,
                                'price' => $cartItem->product->price,
                                'image' => $cartItem->product->image,
                            ],
                            'quantity' => $cartItem->quantity,
                            'total_price' => $cartItem->quantity * $cartItem->product->price,
                        ]
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add product to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function remove(int $productId): JsonResponse
    {
        try {
            $user = Auth::user();

            $cartItem = CartItem::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found in cart'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product removed from cart successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to remove product from cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateQuantity(Request $request, int $productId): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $user = Auth::user();
            $quantity = $request->quantity;

            $cartItem = CartItem::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->with('product')
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found in cart'
                ], 404);
            }

            // Check if product has enough stock
            if (!$cartItem->product->hasStock($quantity)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient stock available',
                    'data' => [
                        'available_stock' => $cartItem->product->stock,
                        'requested_quantity' => $quantity
                    ]
                ], 400);
            }

            $cartItem->update(['quantity' => $quantity]);

            return response()->json([
                'status' => 'success',
                'message' => 'Cart item quantity updated successfully',
                'data' => [
                    'cart_item' => [
                        'id' => $cartItem->id,
                        'product_id' => $cartItem->product_id,
                        'quantity' => $cartItem->quantity,
                        'total_price' => $cartItem->quantity * $cartItem->product->price,
                    ]
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update cart item quantity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function clear(): JsonResponse
    {
        try {
            $user = Auth::user();

            $deletedCount = CartItem::where('user_id', $user->id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Cart cleared successfully',
                'data' => [
                    'deleted_items_count' => $deletedCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
