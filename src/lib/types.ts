export type ProductStatus = "in_stock" | "pre_order";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  full_description: string | null;
  price: number | null;
  currency: string;
  status: ProductStatus;
  code: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images: ProductImage[];
};

export type SiteSettings = {
  id: boolean;
  company_name: string;
  whatsapp: string;
  email: string;
  instagram: string;
  institutional_text: string;
  hero_title: string;
  hero_subtitle: string;
  featured_headline: string;
  banners: Array<Record<string, unknown>>;
  highlights: Array<Record<string, unknown>>;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "manager";
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
};

export type FavoriteItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
};

export type AdminStats = {
  categories: number;
  products: number;
  featured: number;
  inStock: number;
  preOrder: number;
};

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser;
        Insert: Partial<AdminUser> & Pick<AdminUser, "id" | "email">;
        Update: Partial<AdminUser>;
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & Pick<Category, "name" | "slug">;
        Update: Partial<Category>;
      };
      products: {
        Row: Omit<Product, "category" | "images">;
        Insert: Partial<Omit<Product, "category" | "images">> &
          Pick<Product, "name" | "slug" | "description" | "status">;
        Update: Partial<Omit<Product, "category" | "images">>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Partial<ProductImage> & Pick<ProductImage, "product_id" | "url">;
        Update: Partial<ProductImage>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
      };
      customer_profiles: {
        Row: CustomerProfile;
        Insert: Partial<CustomerProfile> & Pick<CustomerProfile, "id" | "email">;
        Update: Partial<CustomerProfile>;
      };
      cart_items: {
        Row: Omit<CartItem, "product">;
        Insert: Partial<Omit<CartItem, "product">> &
          Pick<CartItem, "user_id" | "product_id">;
        Update: Partial<Omit<CartItem, "product">>;
      };
      favorite_products: {
        Row: Omit<FavoriteItem, "product">;
        Insert: Partial<Omit<FavoriteItem, "product">> &
          Pick<FavoriteItem, "user_id" | "product_id">;
        Update: Partial<Omit<FavoriteItem, "product">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: ProductStatus;
      admin_role: "owner" | "manager";
    };
  };
};
