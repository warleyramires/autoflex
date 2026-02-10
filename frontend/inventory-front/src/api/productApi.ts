import {api} from "./axios"
import type { ProductionPlanResponseDTO } from "../types/product";
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

// não to usando, caso depois eu mude a busca por id e não code
export async function getProductById(id: number): Promise<ProductResponseDTO>{
    const response = await api.get<ProductResponseDTO>(`products/${id}`)
    return response.data;
}

export async function updateProduct(code: string, data: ProductRequestDTO): Promise<ProductResponseDTO>{
    const response = await api.put<ProductResponseDTO>(`products/${code}`, data)
    return response.data;
}

export async function deleteProduct(code:string): Promise<void> {
    await api.delete(`/products/${code}`);
}

export async function getProductionPlan(): Promise<ProductionPlanResponseDTO> {
    const response = await api.get<ProductionPlanResponseDTO>("/production");
    return response.data;
}