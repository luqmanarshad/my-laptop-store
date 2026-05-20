<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Specification extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'processor',
        'ram',
        'storage',
        'graphics',
        'display',
        'battery',
        'os',
        'weight',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}