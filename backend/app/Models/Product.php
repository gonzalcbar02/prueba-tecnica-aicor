<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function hasStock($quantity = 1)
    {
        return $this->stock >= $quantity;
    }

    public function decreaseStock($quantity)
    {
        if ($this->hasStock($quantity)) {
            $this->decrement('stock', $quantity);
            return true;
        }
        return false;
    }
}
