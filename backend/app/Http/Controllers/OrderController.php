<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    
    public function checkout(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'notes' => 'nullable|string|max:500'
            ]);

            $user = Auth::user();
            $notes = $request->input('notes');

            // Get user's cart items
            $cartItems = CartItem::with('product')
                ->where('user_id', $user->id)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cart is empty'
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Validate stock availability for all items
                $stockErrors = [];
                foreach ($cartItems as $cartItem) {
                    if (!$cartItem->product->is_active) {
                        $stockErrors[] = "Product '{$cartItem->product->name}' is no longer available";
                    } elseif (!$cartItem->product->hasStock($cartItem->quantity)) {
                        $stockErrors[] = "Insufficient stock for '{$cartItem->product->name}'. Available: {$cartItem->product->stock}, Required: {$cartItem->quantity}";
                    }
                }

                if (!empty($stockErrors)) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Stock validation failed',
                        'errors' => $stockErrors
                    ], 400);
                }

                // Calculate total amount
                $totalAmount = 0;
                foreach ($cartItems as $cartItem) {
                    $totalAmount += $cartItem->quantity * $cartItem->product->price;
                }

                // Create order
                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => Order::generateOrderNumber(),
                    'status' => Order::STATUS_PENDING,
                    'total_amount' => $totalAmount,
                    'notes' => $notes,
                ]);

                // Create order items and decrease stock
                foreach ($cartItems as $cartItem) {
                    // Create order item
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->product->price,
                        'product_name' => $cartItem->product->name,
                    ]);

                    // Decrease product stock
                    $cartItem->product->decreaseStock($cartItem->quantity);
                }

                // Clear user's cart
                CartItem::where('user_id', $user->id)->delete();

                // Update order status to processing
                $order->update(['status' => Order::STATUS_PROCESSING]);

                DB::commit();

                // Load order with items for response
                $order->load(['orderItems.product']);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Order placed successfully',
                    'data' => [
                        'order' => [
                            'id' => $order->id,
                            'order_number' => $order->order_number,
                            'status' => $order->status,
                            'total_amount' => $order->total_amount,
                            'total_items' => $order->orderItems->sum('quantity'),
                            'notes' => $order->notes,
                            'created_at' => $order->created_at,
                            'items' => $order->orderItems->map(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'product_id' => $item->product_id,
                                    'product_name' => $item->product_name,
                                    'quantity' => $item->quantity,
                                    'unit_price' => $item->price,
                                    'total_price' => $item->total_price,
                                ];
                            })
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
                'message' => 'Failed to process checkout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function history(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $query = Order::with(['orderItems'])
                ->where('user_id', $user->id);

            // Filter by status if provided
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Sort orders
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            if (in_array($sortBy, ['created_at', 'total_amount', 'order_number'])) {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Paginate results
            $perPage = min($request->get('per_page', 10), 50);
            $orders = $query->get($perPage);

            $ordersData = $orders->getCollection()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'total_items' => $order->orderItems->sum('quantity'),
                    'items_count' => $order->orderItems->count(),
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'orders' => $ordersData,
                    'pagination' => [
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage(),
                        'per_page' => $orders->perPage(),
                        'total' => $orders->total(),
                        'from' => $orders->firstItem(),
                        'to' => $orders->lastItem(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch order history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function show(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $order = Order::with(['orderItems.product'])
                ->where('user_id', $user->id)
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'order' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'status' => $order->status,
                        'total_amount' => $order->total_amount,
                        'total_items' => $order->orderItems->sum('quantity'),
                        'notes' => $order->notes,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->updated_at,
                        'items' => $order->orderItems->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'product_id' => $item->product_id,
                                'product_name' => $item->product_name,
                                'quantity' => $item->quantity,
                                'unit_price' => $item->price,
                                'total_price' => $item->total_price,
                                'product' => $item->product ? [
                                    'id' => $item->product->id,
                                    'name' => $item->product->name,
                                    'image' => $item->product->image,
                                    'current_price' => $item->product->price,
                                    'is_active' => $item->product->is_active,
                                ] : null
                            ];
                        })
                    ]
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch order details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function cancel(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $order = Order::where('user_id', $user->id)
                ->findOrFail($id);

            if ($order->status !== Order::STATUS_PENDING) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending orders can be cancelled'
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Restore stock for cancelled order
                foreach ($order->orderItems as $orderItem) {
                    $product = Product::find($orderItem->product_id);
                    if ($product) {
                        $product->increment('stock', $orderItem->quantity);
                    }
                }

                // Update order status
                $order->update(['status' => Order::STATUS_CANCELLED]);

                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Order cancelled successfully',
                    'data' => [
                        'order' => [
                            'id' => $order->id,
                            'order_number' => $order->order_number,
                            'status' => $order->status,
                            'updated_at' => $order->updated_at,
                        ]
                    ]
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
