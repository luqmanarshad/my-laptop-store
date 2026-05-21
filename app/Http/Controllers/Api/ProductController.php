<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $brands = Arr::wrap($request->query('brand'));
        $categories = Arr::wrap($request->query('category'));
        $search = $request->query('search');
        $maxPrice = $request->query('max_price');
        $sort = $request->query('sort', 'latest');
        $perPage = max((int) $request->query('per_page', 12), 1);

        $query = Product::with([
            'brand',
            'category',
            'images',
            'specification'
        ]);

        if (!empty($brands)) {
            $query->whereHas('brand', function ($q) use ($brands) {
                $q->whereIn('name', $brands);
            });
        }

        if (!empty($categories)) {
            $query->whereHas('category', function ($q) use ($categories) {
                $q->whereIn('name', $categories);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($maxPrice) {
            $query->where(function ($q) use ($maxPrice) {
                $q->where('sale_price', '<=', $maxPrice)
                    ->orWhere(function ($q2) use ($maxPrice) {
                        $q2->whereNull('sale_price')
                            ->where('price', '<=', $maxPrice);
                    });
            });
        }

        if ($sort === 'low') {
            $query->orderByRaw('COALESCE(sale_price, price) asc');
        } elseif ($sort === 'high') {
            $query->orderByRaw('COALESCE(sale_price, price) desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        if ($request->boolean('all')) {
            return response()->json($query->get());
        }

        return response()->json($query->paginate($perPage));
    }

    public function filters(Request $request)
    {
        $search = $request->query('search');
        $maxPrice = $request->query('max_price');
        $selectedBrands = Arr::wrap($request->query('brand'));
        $selectedCategories = Arr::wrap($request->query('category'));

        $brandQuery = Product::query()
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('brands.name', DB::raw('COUNT(*) as count'))
            ->groupBy('brands.name')
            ->orderBy('brands.name');

        $categoryQuery = Product::query()
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('brands', 'products.brand_id', '=', 'brands.id')
            ->select('categories.name', DB::raw('COUNT(*) as count'))
            ->groupBy('categories.name')
            ->orderBy('categories.name');

        $rangeQuery = Product::query();

        if ($search) {
            $brandQuery->where(function ($q) use ($search) {
                $q->where('products.title', 'like', "%{$search}%")
                    ->orWhere('products.description', 'like', "%{$search}%");
            });
            $categoryQuery->where(function ($q) use ($search) {
                $q->where('products.title', 'like', "%{$search}%")
                    ->orWhere('products.description', 'like', "%{$search}%");
            });
            $rangeQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($maxPrice) {
            $brandQuery->where(function ($q) use ($maxPrice) {
                $q->where('products.sale_price', '<=', $maxPrice)
                    ->orWhere(function ($q2) use ($maxPrice) {
                        $q2->whereNull('products.sale_price')
                            ->where('products.price', '<=', $maxPrice);
                    });
            });
            $categoryQuery->where(function ($q) use ($maxPrice) {
                $q->where('products.sale_price', '<=', $maxPrice)
                    ->orWhere(function ($q2) use ($maxPrice) {
                        $q2->whereNull('products.sale_price')
                            ->where('products.price', '<=', $maxPrice);
                    });
            });
        }

        if (!empty($selectedCategories)) {
            $brandQuery->whereIn('categories.name', $selectedCategories);
            $rangeQuery->whereHas('category', function ($q) use ($selectedCategories) {
                $q->whereIn('name', $selectedCategories);
            });
        }

        if (!empty($selectedBrands)) {
            $categoryQuery->whereIn('brands.name', $selectedBrands);
            $rangeQuery->whereHas('brand', function ($q) use ($selectedBrands) {
                $q->whereIn('name', $selectedBrands);
            });
        }

        $brands = $brandQuery->get()->map(function ($item) {
            return [
                'name' => $item->name,
                'count' => $item->count,
            ];
        });

        $categories = $categoryQuery->get()->map(function ($item) {
            return [
                'name' => $item->name,
                'count' => $item->count,
            ];
        });

        $priceRange = $rangeQuery
            ->selectRaw('MIN(COALESCE(sale_price, price)) as min_price, MAX(COALESCE(sale_price, price)) as max_price')
            ->first();

        return response()->json([
            'brands' => $brands,
            'categories' => $categories,
            'price_range' => [
                'min' => $priceRange->min_price ?? 0,
                'max' => $priceRange->max_price ?? 0,
            ],
        ]);
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

    public function store(Request $request)
    {
        if (Auth::user()->email !== 'admin@example.com') {
            return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
        }

        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'sale_price' => ['nullable', 'numeric'],
            'stock' => ['required', 'integer'],
            'sku' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
            'status' => ['boolean'],
            // Specifications
            'processor' => ['nullable', 'string', 'max:255'],
            'ram' => ['nullable', 'string', 'max:255'],
            'storage' => ['nullable', 'string', 'max:255'],
            'graphics' => ['nullable', 'string', 'max:255'],
            'display' => ['nullable', 'string', 'max:255'],
            'battery' => ['nullable', 'string', 'max:255'],
            'os' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'string', 'max:255'],
            'custom_specs' => ['nullable', 'array'],
        ]);

        $productData = Arr::except($data, ['processor', 'ram', 'storage', 'graphics', 'display', 'battery', 'os', 'weight', 'custom_specs']);
        $specData = Arr::only($data, ['processor', 'ram', 'storage', 'graphics', 'display', 'battery', 'os', 'weight', 'custom_specs']);

        $productData['slug'] = Str::slug($productData['title']) . '-' . substr(uniqid(), -6);

        $product = DB::transaction(function () use ($productData, $specData) {
            $product = Product::create($productData);
            $product->specification()->create($specData);
            return $product;
        });

        return response()->json($product->load('specification'), 201);
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->email !== 'admin@example.com') {
            return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
        }

        $product = Product::findOrFail($id);

        $data = $request->validate([
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'brand_id' => ['sometimes', 'required', 'integer', 'exists:brands,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric'],
            'sale_price' => ['nullable', 'numeric'],
            'stock' => ['sometimes', 'required', 'integer'],
            'sku' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
            'status' => ['boolean'],
            // Specifications
            'processor' => ['nullable', 'string', 'max:255'],
            'ram' => ['nullable', 'string', 'max:255'],
            'storage' => ['nullable', 'string', 'max:255'],
            'graphics' => ['nullable', 'string', 'max:255'],
            'display' => ['nullable', 'string', 'max:255'],
            'battery' => ['nullable', 'string', 'max:255'],
            'os' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'string', 'max:255'],
            'custom_specs' => ['nullable', 'array'],
        ]);

        $productData = Arr::except($data, ['processor', 'ram', 'storage', 'graphics', 'display', 'battery', 'os', 'weight', 'custom_specs']);
        $specData = Arr::only($data, ['processor', 'ram', 'storage', 'graphics', 'display', 'battery', 'os', 'weight', 'custom_specs']);

        if (isset($productData['title'])) {
            $productData['slug'] = Str::slug($productData['title']) . '-' . substr(uniqid(), -6);
        }

        DB::transaction(function () use ($product, $productData, $specData) {
            $product->update($productData);
            if (!empty($specData)) {
                $product->specification()->updateOrCreate([], $specData);
            }
        });

        return response()->json($product->load('specification'));
    }

    public function destroy($id)
    {
        if (Auth::user()->email !== 'admin@example.com') {
            return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
        }

        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}