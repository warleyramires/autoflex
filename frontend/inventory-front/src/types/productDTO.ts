export type ProductRawMaterialRquestDTO = {
    rawMaterialCode: string,
    quantity: number
}

export type ProductRequestDTO = {
    code: string,
    name: string,
    price: number,
    rawMaterial: ProductRawMaterialRquestDTO[];
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
    rawMaterials: ProductRawMaterialResponseDTO[];
}