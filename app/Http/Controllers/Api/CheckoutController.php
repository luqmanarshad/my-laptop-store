<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string|max:1000',
            'phone' => 'required|string|max:50',
            'payment_method' => 'required|string|max:50',
        ]);

        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Check stock levels first
        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Product '{$item->product->title}' has insufficient stock. Only {$item->product->stock} available."
                ], 400);
            }
        }

        return DB::transaction(function () use ($user, $cartItems, $request) {
            $total = $cartItems->sum(fn($item) => $item->price * $item->quantity);

            // 1. Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $total,
                'status' => 'completed', // Since it's demo, mark it completed or pending
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'payment_method' => $request->payment_method,
            ]);

            // 2. Attach Products and Reduce Stock
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ]);

                // Stock Management
                $item->product->decrement('stock', $item->quantity);
            }

            // 3. Clear Cart
            $user->cartItems()->delete();

            // 4. Send Notifications (Email and SMS)
            try {
                $emailBody = "Dear {$user->name},\n\n"
                    . "Your order has been placed successfully!\n\n"
                    . "Order Details:\n"
                    . "----------------------------------------\n"
                    . "Order ID: #LPZ-{$order->id}\n"
                    . "Total Amount: \${$order->total_amount}\n"
                    . "Payment Method: {$order->payment_method}\n"
                    . "Shipping Address: {$order->shipping_address}\n"
                    . "Contact Phone: {$order->phone}\n"
                    . "----------------------------------------\n\n"
                    . "We are processing your order and will dispatch it shortly.\n"
                    . "Thank you for choosing Lapzo!\n";

                Mail::raw($emailBody, function ($message) use ($user, $order) {
                    $message->to($user->email)
                        ->subject("Order Confirmation - #LPZ-{$order->id}");
                });

                $smsBody = "Dear {$user->name}, your Lapzo Order #LPZ-{$order->id} of total \${$order->total_amount} has been placed successfully. Payment Method: {$order->payment_method}.";
                Log::info("[SMS Notification] Sent to {$order->phone}: {$smsBody}");
            } catch (\Exception $e) {
                Log::error("Failed to send order notifications: " . $e->getMessage());
            }

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product')
            ], 201);
        });
    }

    public function orders()
    {
        $orders = Auth::user()->orders()
            ->with(['items.product.brand'])
            ->get();
        return response()->json($orders);
    }
}