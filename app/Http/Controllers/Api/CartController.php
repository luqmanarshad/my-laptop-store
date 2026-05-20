<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CartController extends Controller
{
    public function index()
    {
        return Cart::with(
            'product'
        )->get();
    }

    public function store(
        Request $request
    ) {

        $product =
            Product::findOrFail(
                $request->product_id
            );

        $cart =
            Cart::where(
                'product_id',
                $request->product_id
            )->first();

        if ($cart) {

            $cart->increment(
                'quantity'
            );

            return response()->json([
                'message' =>
                    'Quantity Updated'
            ]);
        }

        Cart::create([
            'product_id' =>
                $product->id,

            'quantity' => 1,

            'price' =>
                $product->sale_price
        ]);

        return response()->json([
            'message' =>
                'Added To Cart'
        ]);
    }

    public function destroy(
        $id
    ) {

        Cart::findOrFail(
            $id
        )->delete();

        return response()->json([
            'message' =>
                'Deleted'
        ]);
    }
}