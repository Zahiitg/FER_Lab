export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    image: "/images/product-1.jpg",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    price: 89.99,
    category: "Audio",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    image: "/images/product-2.jpg",
    description:
      "Track your steps, heart rate, and workouts with this sleek smartwatch featuring a vibrant AMOLED display.",
    price: 199.99,
    category: "Wearables",
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    image: "/images/product-3.jpg",
    description:
      "Responsive mechanical switches with customizable RGB lighting, durable build, and full anti-ghosting support.",
    price: 129.99,
    category: "Accessories",
  },
  {
    id: 4,
    name: "Ergonomic Wireless Mouse",
    image: "/images/product-4.jpg",
    description:
      "Designed for all-day comfort with a contoured shape, silent clicks, and a high-precision optical sensor.",
    price: 49.99,
    category: "Accessories",
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    image: "/images/product-5.jpg",
    description:
      "Waterproof portable speaker with 360-degree sound, deep bass, and up to 12 hours of playtime on a single charge.",
    price: 59.99,
    category: "Audio",
  },
  {
    id: 6,
    name: "USB-C Hub Adapter",
    image: "/images/product-6.jpg",
    description:
      "Expand your connectivity with this 7-in-1 hub featuring HDMI, USB 3.0, SD card reader, and 100W PD charging.",
    price: 39.99,
    category: "Accessories",
  },
];

export function getProduct(id: string): Product | undefined {
  if (!/^\d+$/.test(id)) {
    return undefined;
  }
  const numericId = parseInt(id, 10);
  return products.find((p) => p.id === numericId);
}
