export type Cart = {
    id: number;
    id_user: number;
    id_product: number;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number
    name: string
    price: number
    image?: string
    stock: number
    description?: string
}

export interface CartItem {
    id: number;
    product_id: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        stock: number;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
}

export interface CartSummary {
    total_items: number
    total_amount: number
    items_count: number
}

export interface CartResponse {
    status: "success" | "error"
    data: {
        cart_items: CartItem[]
        summary: CartSummary
    }
}

