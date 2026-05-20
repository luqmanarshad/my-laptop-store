# My Laptop Store

A Laravel 13 + Vue 3 laptop store project with product listing, search, filtering, pagination, cart API, and a Vue Router SPA frontend.

## Setup

1. Install PHP 8.3 or newer.
2. Install Composer dependencies:
   ```bash
   composer install
   ```
3. Install npm dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file and set your database:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the app:
   ```bash
   php artisan serve
   npm run dev
   ```

## Features

- Laravel 13 backend with REST API routes under `routes/api.php`
- Vue 3 frontend with Vue Router in `resources/js`
- Product listing with server-side search, brand/category filtering, price range, sorting, and pagination
- Product details page with add-to-cart support
- Cart API with add/delete operations

## Important files

- `app/Models/Product.php`
- `app/Http/Controllers/Api/ProductController.php`
- `app/Http/Controllers/Api/CartController.php`
- `resources/js/pages/Laptops.vue`
- `resources/js/pages/ProductDetails.vue`
- `resources/js/pages/Cart.vue`
- `routes/api.php`
- `routes/web.php`

## Notes

- The app currently uses a standard Vue Router SPA setup, not Inertia.
- The backend requires PHP 8.3 and Laravel 13.
- If you want, the next step is to add cart persistence and a checkout flow.

