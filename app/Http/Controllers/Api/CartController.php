<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Cart; // Assuming a Cart model exists
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        // Return cart items for the logged-in user
        return response()->json(Auth::user()->cartItems()->with('product')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        $quantity = $request->input('quantity', 1);
        $price = $product->sale_price ?? $product->price;

        $cartItem = Auth::user()->cartItems()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;
            if ($product->stock < $newQuantity) {
                return response()->json(['message' => "Only {$product->stock} items available in stock."], 400);
            }
            $cartItem->update([
                'quantity' => $newQuantity,
                'price' => $price,
            ]);
        } else {
            if ($product->stock < $quantity) {
                return response()->json(['message' => "Only {$product->stock} items available in stock."], 400);
            }
            $cartItem = Auth::user()->cartItems()->create([
                'product_id' => $request->product_id,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }

        return response()->json([
            'message' => 'Added to cart!',
            'cart_item' => $cartItem->load('product')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $cartItem = Auth::user()->cartItems()->findOrFail($id);
        $product = $cartItem->product;

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => "Only {$product->stock} items available in stock."], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        return response()->json($cartItem);
    }

    public function destroy($id)
    {
        $cartItem = Auth::user()->cartItems()->findOrFail($id);
        $cartItem->delete();

        return response()->json(['message' => 'Removed from cart']);
    }

    public function merge(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        foreach ($request->items as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            if (!$product) continue;

            $cartItem = $user->cartItems()->where('product_id', $item['product_id'])->first();
            $price = $product->sale_price ?? $product->price;

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $item['quantity'];
                if ($product->stock < $newQuantity) {
                    $newQuantity = $product->stock;
                }
                $cartItem->update([
                    'quantity' => $newQuantity,
                    'price' => $price,
                ]);
            } else {
                $qty = $item['quantity'];
                if ($product->stock < $qty) {
                    $qty = $product->stock;
                }
                if ($qty > 0) {
                    $user->cartItems()->create([
                        'product_id' => $item['product_id'],
                        'quantity' => $qty,
                        'price' => $price,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Cart merged successfully',
            'cart' => $user->cartItems()->with('product')->get()
        ]);
    }
}