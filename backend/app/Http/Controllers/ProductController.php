<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::all();

        return response()->json($products);
    }


    public function show(int $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'product' => $product
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
