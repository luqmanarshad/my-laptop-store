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
                    'https://dlcdnwebimgs.asus.com/gain/90C2C48B-AB4A-4975-A77A-C1E1A7701F92/w717/h525',
            ],

            [
                'title' => 'MacBook Pro M3',
                'price' => 1999,
                'brand' => 'Apple',
                'category' => 'MacBooks',
                'image' =>
                    'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-midnight-gallery1-202206',
            ],

            [
                'title' => 'Dell XPS 13',
                'price' => 1299,
                'brand' => 'Dell',
                'category' => 'Business Laptops',
                'image' =>
                    'https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/xps/13-9340/media-gallery/laptop-xps-13-9340-gray-gallery-2.psd',
            ],

            [
                'title' => 'HP Victus 15',
                'price' => 999,
                'brand' => 'HP',
                'category' => 'Gaming Laptops',
                'image' =>
                    'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08470648.png',
            ],

            [
                'title' => 'Lenovo ThinkPad X1',
                'price' => 1399,
                'brand' => 'Lenovo',
                'category' => 'Business Laptops',
                'image' =>
                    'https://p4-ofp.static.pub/fes/cms/2023/05/18/rx2r4iv0y9zkhkq4v4s5v2nlf4s3g551.png',
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