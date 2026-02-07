import {api} from "./axios";
import type{ RawMaterial } from "../types/rawMaterial";
import type { CreateRawMaterialDTO, UpdateRawMaterialDTO } from "../types/rawMaterialDTO";

export async function createRawMaterial(data: CreateRawMaterialDTO): Promise<RawMaterial>{
    const response = await api.post<RawMaterial>("/raw-materials", data);
    return response.data;
}

export async function getAllRawMaterials(): Promise<RawMaterial[]>{
    const response = await api.get<RawMaterial[]>("/raw-materials");
    return response.data;
}

export async function getRawMaterialByID(id: number): Promise<RawMaterial> {
    const response = await api.get<RawMaterial>(`/raw-materials/${id}`);
    return response.data;    
}

export async function getRawMaterialByCode(code: string): Promise<RawMaterial>{
    const response = await api.get<RawMaterial>(`/raw-materials/code/${code}`);     
    return response.data;
}

export async function updateRawMaterial(code: number, data: UpdateRawMaterialDTO): Promise<RawMaterial>{
    const response = await api.put<RawMaterial>(`/raw-materials/${code}`, data);
    return response.data;
}

export async function deleteRawMaterial(code: number): Promise<void>{
    const response = await api.delete<RawMaterial>(`/raw-materials/${code}`)
    
}