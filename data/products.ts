import type { CategoryId } from "./categories";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: CategoryId;
  brand: string;
  description: string;
  specs?: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Giant Talon 29 2024",
    price: 12500000,
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop",
    ],
    category: "mountain",
    brand: "Giant",
    description: "Xe đạp địa hình Giant Talon 29 với khung nhôm ALUXX, phù hợp địa hình gồ ghề, đường rừng. Lốp 29 inch giúp vượt chướng ngại vật dễ dàng.",
    specs: [
      { label: "Kích thước vành", value: "29 inch" },
      { label: "Chất liệu khung", value: "Nhôm ALUXX" },
      { label: "Số tốc độ", value: "21" },
      { label: "Trọng lượng", value: "13.2 kg" },
    ],
  },
  {
    id: "2",
    name: "Trek Marlin 7",
    price: 18900000,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop",
    ],
    category: "mountain",
    brand: "Trek",
    description: "Trek Marlin 7 - xe đạp địa hình entry-level chất lượng cao. Khung Alpha Silver Aluminum, hệ thống truyền động Shimano 2x9.",
    specs: [
      { label: "Kích thước vành", value: "29 inch" },
      { label: "Chất liệu khung", value: "Alpha Silver Aluminum" },
      { label: "Số tốc độ", value: "18" },
      { label: "Trọng lượng", value: "13.5 kg" },
    ],
  },
  {
    id: "3",
    name: "Specialized Rockhopper",
    price: 15900000,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
    ],
    category: "mountain",
    brand: "Specialized",
    description: "Specialized Rockhopper - xe đạp leo núi đa dụng, thiết kế cân bằng cho cả đường nhựa và đường đất.",
    specs: [
      { label: "Kích thước vành", value: "27.5 inch" },
      { label: "Chất liệu khung", value: "A1 Premium Aluminum" },
      { label: "Số tốc độ", value: "21" },
      { label: "Trọng lượng", value: "12.8 kg" },
    ],
  },
  {
    id: "4",
    name: "Giant Escape 3",
    price: 7900000,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop",
    ],
    category: "street",
    brand: "Giant",
    description: "Xe đạp đường phố Giant Escape 3 - lý tưởng cho di chuyển đô thị, đi học, đi làm. Thiết kế thoải mái.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "ALUXX Aluminum" },
      { label: "Số tốc độ", value: "21" },
      { label: "Trọng lượng", value: "11.5 kg" },
    ],
  },
  {
    id: "5",
    name: "Trek FX 2",
    price: 11900000,
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&h=600&fit=crop",
    ],
    category: "street",
    brand: "Trek",
    description: "Trek FX 2 - xe đạp fitness/commuter đa năng. Tư thế ngồi thẳng, phù hợp quãng đường trung bình.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "Alpha Gold Aluminum" },
      { label: "Số tốc độ", value: "18" },
      { label: "Trọng lượng", value: "11.2 kg" },
    ],
  },
  {
    id: "6",
    name: "Marin Fairfax 1",
    price: 8900000,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
    ],
    category: "street",
    brand: "Marin",
    description: "Marin Fairfax 1 - xe đạp đường phố giá rẻ, bền bỉ. Phù hợp sinh viên, người mới bắt đầu.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "6061 Aluminum" },
      { label: "Số tốc độ", value: "21" },
      { label: "Trọng lượng", value: "12 kg" },
    ],
  },
  {
    id: "7",
    name: "Cannondale Synapse Carbon",
    price: 45000000,
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop",
    ],
    category: "sport",
    brand: "Cannondale",
    description: "Cannondale Synapse Carbon - xe đạp đường trường cao cấp. Khung carbon nhẹ, geometry thoải mái cho quãng đường dài.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "BallisTec Carbon" },
      { label: "Số tốc độ", value: "22" },
      { label: "Trọng lượng", value: "8.2 kg" },
    ],
  },
  {
    id: "8",
    name: "Specialized Tarmac SL7",
    price: 89000000,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop",
    ],
    category: "sport",
    brand: "Specialized",
    description: "Specialized Tarmac SL7 - xe đạp đua chuyên nghiệp. Được sử dụng bởi đội World Tour.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "FACT 12r Carbon" },
      { label: "Số tốc độ", value: "24" },
      { label: "Trọng lượng", value: "6.9 kg" },
    ],
  },
  {
    id: "9",
    name: "Giant TCR Advanced",
    price: 52000000,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
    ],
    category: "sport",
    brand: "Giant",
    description: "Giant TCR Advanced - xe đạp thể thao carbon, cân bằng giữa trọng lượng và độ cứng.",
    specs: [
      { label: "Kích thước vành", value: "700C" },
      { label: "Chất liệu khung", value: "Advanced-Grade Composite" },
      { label: "Số tốc độ", value: "22" },
      { label: "Trọng lượng", value: "7.5 kg" },
    ],
  },
  {
    id: "10",
    name: "Trek Precaliber 24",
    price: 6500000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    category: "kids",
    brand: "Trek",
    description: "Trek Precaliber 24 - xe đạp trẻ em 24 inch, phù hợp 8-12 tuổi. Có phanh tay an toàn.",
    specs: [
      { label: "Kích thước vành", value: "24 inch" },
      { label: "Chất liệu khung", value: "Alpha Silver Aluminum" },
      { label: "Số tốc độ", value: "7" },
      { label: "Độ tuổi", value: "8-12 tuổi" },
    ],
  },
  {
    id: "11",
    name: "Giant Animator 20",
    price: 4200000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    category: "kids",
    brand: "Giant",
    description: "Giant Animator 20 - xe đạp trẻ em 20 inch cho bé 5-8 tuổi. Bánh phụ tháo rời.",
    specs: [
      { label: "Kích thước vành", value: "20 inch" },
      { label: "Chất liệu khung", value: "High-tensile Steel" },
      { label: "Số tốc độ", value: "1" },
      { label: "Độ tuổi", value: "5-8 tuổi" },
    ],
  },
  {
    id: "12",
    name: "Specialized Riprock 20",
    price: 7500000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    category: "kids",
    brand: "Specialized",
    description: "Specialized Riprock 20 - xe đạp trẻ em địa hình nhỏ. Lốp to, dễ đi trên nhiều địa hình.",
    specs: [
      { label: "Kích thước vành", value: "20 inch" },
      { label: "Chất liệu khung", value: "A1 Aluminum" },
      { label: "Số tốc độ", value: "6" },
      { label: "Độ tuổi", value: "5-8 tuổi" },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
