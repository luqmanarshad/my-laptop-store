<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\Specification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            [
                'title' => 'ASUS ROG Zephyrus G14',
                'price' => 1499,
                'brand' => 'ASUS',
                'category' => 'Gaming Laptops',
                'image' =>
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60',
            ],

            [
                'title' => 'MacBook Pro M3',
                'price' => 1999,
                'brand' => 'Apple',
                'category' => 'MacBooks',
                'image' =>
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
            ],

            [
                'title' => 'Dell XPS 13',
                'price' => 1299,
                'brand' => 'Dell',
                'category' => 'Business Laptops',
                'image' =>
                    'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=60',
            ],

            [
                'title' => 'HP Victus 15',
                'price' => 999,
                'brand' => 'HP',
                'category' => 'Gaming Laptops',
                'image' =>
                    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60',
            ],

            [
                'title' => 'Lenovo ThinkPad X1',
                'price' => 1399,
                'brand' => 'Lenovo',
                'category' => 'Business Laptops',
                'image' =>
                    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60',
            ],
        ];

        foreach ($products as $item) {

            $brand = Brand::where(
                'name',
                $item['brand']
            )->first();

            $category = Category::where(
                'name',
                $item['category']
            )->first();

            $product = Product::create([
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'title' => $item['title'],
                'slug' => Str::slug($item['title']),
                'description' =>
                    $item['title'] . ' premium laptop',
                'price' => $item['price'],
                'sale_price' =>
                    $item['price'] - 100,
                'stock' => rand(5, 20),
                'sku' => 'SKU-' . rand(1000,9999),
                'thumbnail' =>
                    $item['image'],
                'featured' => true,
                'status' => true,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'image' => $item['image'],
            ]);

            Specification::create([
                'product_id' => $product->id,
                'processor' => 'Intel Core i7',
                'ram' => '16GB',
                'storage' => '512GB SSD',
                'graphics' => 'RTX 4060',
                'display' => '15.6 Inch FHD',
                'battery' => '6 Hours',
                'os' => 'Windows 11',
                'weight' => '1.8kg',
            ]);
        }
    }
}