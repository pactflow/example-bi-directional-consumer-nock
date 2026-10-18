import axios from "axios";
import { Product, type ProductData } from "./product.ts";

export class Api {
  private readonly url: string;

  constructor(url?: string) {
    const base = url || import.meta.env.VITE_API_BASE_URL || "";
    this.url = base.endsWith("/") ? base.slice(0, -1) : base;
  }

  withPath(path: string): string {
    return path.startsWith("/") ? `${this.url}${path}` : `${this.url}/${path}`;
  }

  generateAuthToken(): string {
    return `Bearer ${new Date().toISOString()}`;
  }

  getAllProducts(): Promise<Product[]> {
    return axios
      .get<ProductData[]>(this.withPath("/products"), {
        headers: { authorization: this.generateAuthToken() },
      })
      .then((r) => r.data.map((p) => new Product(p)));
  }

  getProduct(id: string): Promise<Product> {
    return axios
      .get<ProductData>(this.withPath(`/product/${id}`), {
        headers: { authorization: this.generateAuthToken() },
      })
      .then((r) => new Product(r.data));
  }
}

export const api = new Api(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
);
