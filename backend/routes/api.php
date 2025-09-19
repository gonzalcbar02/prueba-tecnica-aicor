<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PurchaseHistoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'loginWithGoogle']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Public Routes
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Protected Routes (require authentication)
Route::middleware('auth:api')->group(function () {
    
    // Cart Management
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/update/{productId}', [CartController::class, 'updateQuantity']);
        Route::delete('/remove/{productId}', [CartController::class, 'remove']);
        Route::delete('/clear', [CartController::class, 'clear']);
    });

    // Order Management
    Route::prefix('orders')->group(function () {
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::get('/history', [OrderController::class, 'history']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::patch('/{id}/cancel', [OrderController::class, 'cancel']);
    });

    
});


?>
