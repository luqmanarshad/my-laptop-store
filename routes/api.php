<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
Route::get(
    '/products',
    [ProductController::class, 'index']
);

Route::get(
    '/products/{id}',
    [ProductController::class, 'show']
);
Route::get(
    '/cart',
    [CartController::class, 'index']
);

Route::post(
    '/cart/add',
    [CartController::class, 'store']
);

Route::delete(
    '/cart/{id}',
    [CartController::class, 'destroy']
);