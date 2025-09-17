import { axiosClient } from "../http/axiosClient";
import type { Product, ProductCreate, ProductUpdate } from "../types/product";

export async function getProducts(params?: { name?: string; category?: string }) {
     const res = await axiosClient.get<Product[]>("/api/Products", { params });
     return res.data;
}

export async function getProduct(id: number) {
     const res = await axiosClient.get<Product>(`/api/Products/${id}`);
     return res.data;
}

export async function createProduct(payload: ProductCreate) {
     const res = await axiosClient.post<Product>("/api/Products", payload);
     return res.data;
}

export async function updateProduct(id: number, payload: ProductUpdate) {
     const res = await axiosClient.put<Product>(`/api/Products/${id}`, payload);
     return res.data;
}

export async function deleteProduct(id: number) {
     await axiosClient.delete<void>(`/api/Products/${id}`);
}
