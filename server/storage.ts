import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, users, categories, products, cartItems, orders } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product methods
  getProducts(categoryId?: string, search?: string, limit?: number, offset?: number): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductByAliexpressId(aliexpressId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;

  // Cart methods
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Order methods
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if categories already exist
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        return; // Data already initialized
      }

      // Initialize categories
      const categoriesData = [
        { name: "Top deals", slug: "top-deals", icon: "fas fa-fire" },
        { name: "Local", slug: "local", icon: "fas fa-map-marker-alt" },
        { name: "Electronics", slug: "electronics", icon: "fas fa-laptop" },
        { name: "Fashion", slug: "fashion", icon: "fas fa-tshirt" },
        { name: "Beauty", slug: "beauty", icon: "fas fa-spa" },
        { name: "Home", slug: "home", icon: "fas fa-home" },
      ];

      const insertedCategories = await db.insert(categories).values(categoriesData).returning();

      // Initialize products with category references
      const productsData = [
        {
          title: "Wireless Earbuds",
          description: "High-quality wireless earbuds with noise cancellation",
          price: "12.34",
          originalPrice: "16.99",
          rating: "4.5",
          ratingCount: 127,
          imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[2].id, // Electronics
          aliexpressId: "1005001234567890",
          inStock: true,
        },
        {
          title: "Mini Camera 4K",
          description: "Compact 4K action camera with waterproof housing",
          price: "33.60",
          originalPrice: null,
          rating: "4.8",
          ratingCount: 89,
          imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[2].id, // Electronics
          aliexpressId: "1005001234567891",
          inStock: true,
        },
        {
          title: "Men's Sports Watch",
          description: "Digital sports watch with fitness tracking features",
          price: "21.10",
          originalPrice: "26.00",
          rating: "4.3",
          ratingCount: 156,
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[3].id, // Fashion
          aliexpressId: "1005001234567892",
          inStock: true,
        },
        {
          title: "Argan Oil for Hair",
          description: "Organic argan oil for hair nourishment and repair",
          price: "7.80",
          originalPrice: "13.00",
          rating: "4.7",
          ratingCount: 203,
          imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[4].id, // Beauty
          aliexpressId: "1005001234567893",
          inStock: true,
        },
        {
          title: "Robot Vacuum Cleaner",
          description: "Smart robot vacuum with app control and mapping",
          price: "87.50",
          originalPrice: "120.99",
          rating: "4.6",
          ratingCount: 74,
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[5].id, // Home
          aliexpressId: "1005001234567894",
          inStock: true,
        },
        {
          title: "Bluetooth Car Kit",
          description: "Hands-free Bluetooth adapter for car audio systems",
          price: "15.95",
          originalPrice: null,
          rating: "4.2",
          ratingCount: 98,
          imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[2].id, // Electronics
          aliexpressId: "1005001234567895",
          inStock: true,
        },
        {
          title: "Yoga Leggings",
          description: "High-waisted yoga leggings with moisture-wicking fabric",
          price: "9.50",
          originalPrice: null,
          rating: "4.4",
          ratingCount: 167,
          imageUrl: "https://images.unsplash.com/photo-1506629905607-c7dcd42c4f5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[3].id, // Fashion
          aliexpressId: "1005001234567896",
          inStock: true,
        },
        {
          title: "LED Makeup Mirror",
          description: "Illuminated makeup mirror with adjustable brightness",
          price: "14.99",
          originalPrice: null,
          rating: "4.5",
          ratingCount: 134,
          imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          categoryId: insertedCategories[4].id, // Beauty
          aliexpressId: "1005001234567897",
          inStock: true,
        },
      ];

      await db.insert(products).values(productsData);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Product methods
  async getProducts(categoryId?: string, search?: string, limit = 50, offset = 0): Promise<Product[]> {
    const conditions = [];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    
    if (search) {
      conditions.push(
        or(
          like(products.title, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      return await db.select().from(products).where(whereCondition).limit(limit).offset(offset).orderBy(desc(products.createdAt));
    }
    
    return await db.select().from(products).limit(limit).offset(offset).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductByAliexpressId(aliexpressId: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.aliexpressId, aliexpressId));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product || undefined;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return (result.rowCount || 0) >= 0;
  }

  // Order methods
  async getOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return order || undefined;
  }
}

export const storage = new DatabaseStorage();
