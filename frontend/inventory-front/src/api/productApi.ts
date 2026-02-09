import {api} from "./axios"
import type { Product } from "../types/product";
import type { ProductRequestDTO, ProductResponseDTO } from "../types/productDTO";

export async function createProduct(data: ProductRequestDTO): Promise<ProductResponseDTO>{
    const response = await api.post<ProductResponseDTO>("/products", data)
    return response.data;
}

export async function getAllProducts(): Promise<ProductResponseDTO[]>{
    const response = await api.get<ProductResponseDTO[]>("/products");
    return response.data;
}

export async function getProductByCode(code: string): Promise<ProductResponseDTO>{
    const response = await api.get<ProductResponseDTO>(`products/code/${code}`)
    return response.data;
}