<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with([
            'brand',
            'category',
            'images',
            'specification'
        ])->get();

        return response()->json($products);
    }
    public function show($id)
    {
        $product = Product::with([
            'brand',
            'category',
            'images',
            'specification',
        ])->findOrFail($id);

        return response()->json(
            $product
        );
    }
}