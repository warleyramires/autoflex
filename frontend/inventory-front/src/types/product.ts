export type ProductRawMaterial = {
    code: string,
    name: string,
    quantity: number;
}

export type Product = {
    id: number;
    code: string,
    price: string,
    rawMaterials: ProductRawMaterial[]
}

export type ProductionItemResponseDTO = {
    productId: number;
    productCode: string;
    productName: string;
    quantityProssible: number; 
    unitValue: number; 
    totalValue: number;
}

export type ProductionPlanResponseDTO = {
    items: ProductionItemResponseDTO[];
    grandTotalValue: number;
}