<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get(
    '/products',
    [ProductController::class, 'index']
);

Route::get(
    '/products/filters',
    [ProductController::class, 'filters']
);

Route::get(
    '/products/{id}',
    [ProductController::class, 'show']
);

Route::get('/categories', function() {
    return response()->json(\App\Models\Category::all());
});

Route::get('/brands', function() {
    return response()->json(\App\Models\Brand::all());
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Cart & Checkout (Protected)
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'store']);
    Route::post('/cart/merge', [CartController::class, 'merge']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    
    Route::post('/checkout', [CheckoutController::class, 'process']);
    Route::get('/orders', [CheckoutController::class, 'orders']);
});