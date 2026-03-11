export type CategoryId = "mountain" | "street" | "sport" | "kids";

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "mountain",
    name: "Xe đạp địa hình",
    slug: "xe-dap-dia-hinh",
    description: "Xe đạp leo núi, địa hình gồ ghề",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop",
  },
  {
    id: "street",
    name: "Xe đạp đường phố",
    slug: "xe-dap-duong-pho",
    description: "Xe đạp đi lại hàng ngày",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
  },
  {
    id: "sport",
    name: "Xe đạp thể thao",
    slug: "xe-dap-the-thao",
    description: "Xe đạp đua, thể thao cao cấp",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop",
  },
  {
    id: "kids",
    name: "Xe đạp trẻ em",
    slug: "xe-dap-tre-em",
    description: "Xe đạp an toàn cho bé",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];
