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