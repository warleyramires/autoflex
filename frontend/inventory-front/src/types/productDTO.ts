export type ProductRawMaterialRequestDTO = {
    rawMaterialCode: string,
    quantity: number
}

export type ProductRequestDTO = {
    code: string,
    name: string,
    price: number,
    rawMaterials: ProductRawMaterialRequestDTO[];
}

export type ProductRawMaterialResponseDTO = {
    code: string,
    name: string,
    quantity: number,
}

export type ProductResponseDTO = {
    id: number, 
    code: string,
    name: string,
    price: number,
    rawMaterials: ProductRawMaterialResponseDTO[];
}