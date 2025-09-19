<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and tech enthusiasts.',
                'price' => 999.99,
                'stock' => 50,
                'image' => 'https://m.media-amazon.com/images/G/30/img15/MarchEye/Compchart/iPhone_15_Pro._CB578184765_.png?height=400&width=400',
            ],
            [
                'name' => 'MacBook Air M3',
                'description' => 'Ultra-thin laptop with M3 chip, 13-inch Liquid Retina display, and all-day battery life. Ideal for students and professionals.',
                'price' => 1299.99,
                'stock' => 30,
                'image' => 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mba_13_m3_2024_hero.png?height=400&width=400',
            ],
            [
                'name' => 'AirPods Pro (3rd Gen)',
                'description' => 'Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency.',
                'price' => 249.99,
                'stock' => 100,
                'image' => 'https://www.onlygainns.com/wp-content/uploads/2024/12/C4fA53fDD8rnky_1vbgCT-transformed.png?height=400&width=400',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Flagship Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity.',
                'price' => 1199.99,
                'stock' => 25,
                'image' => 'https://imageservice.asgoodasnew.com/540/21759/71/title-0000.jpg?height=400&width=400',
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
                'price' => 399.99,
                'stock' => 40,
                'image' => 'https://www.sony.com/is/image/gwtprod/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=png-alpha&wid=515&hei=515&trf=trim?height=400&width=400',
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'description' => 'Professional tablet with M2 chip, Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.',
                'price' => 1099.99,
                'stock' => 20,
                'image' => 'https://m.media-amazon.com/images/G/30/img15/MarchEye/compcharts/AMZ_FamilyStripe_iPad_Pro_12.9_Gen._CB606131327_.png?height=400&width=400',
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'description' => 'Hybrid gaming console with vibrant OLED screen, enhanced audio, and versatile play modes.',
                'price' => 349.99,
                'stock' => 60,
                'image' => 'https://media.game.es/COVERV2/3D_L/222/222519.png?height=400&width=400',
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Advanced smartwatch with health monitoring, fitness tracking, and seamless iPhone integration.',
                'price' => 429.99,
                'stock' => 35,
                'image' => 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/apple-watch-series-9.png?height=400&width=400',
            ],
            [
                'name' => 'Dell XPS 13',
                'description' => 'Premium ultrabook with Intel Core i7, 13.4-inch InfinityEdge display, and sleek carbon fiber design.',
                'price' => 1199.99,
                'stock' => 15,
                'image' => 'https://www.tecnozero.com/wp-content/uploads/2014/02/Dell-XPS-13.png?height=400&width=400',
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'description' => 'AI-powered Android phone with advanced computational photography and pure Google experience.',
                'price' => 899.99,
                'stock' => 45,
                'image' => 'https://storage.googleapis.com/w6j8n2p4d_r5g9x1m3b7c2z0k1y8v5h/240201/image/general_image/device-page/en/01_Pixel_Sim_Desktop_Header_Pixel_8_Device.png?height=400&width=400',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
