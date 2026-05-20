<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Apple',
            'ASUS',
            'Dell',
            'HP',
            'Lenovo',
            'MSI',
        ];

        foreach ($brands as $brand) {

            Brand::create([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'logo' => 'brand.png',
                'description' =>
                    $brand . ' premium laptops',
                'status' => true,
            ]);
        }
    }
}