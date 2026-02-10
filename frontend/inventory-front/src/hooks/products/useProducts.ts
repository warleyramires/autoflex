import { useEffect, useState } from "react";
import type { ProductRequestDTO, ProductResponseDTO } from "../../types/productDTO";
import { createProduct, getAllProducts, getProductByCode, updateProduct, deleteProduct } from "../../api/productApi";


export function useProducts(){

    const[products, setProducts] = useState<ProductResponseDTO[]>([]);
    const[product, setProduct] = useState<ProductResponseDTO>();
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);

    const[saving, setSaving] = useState<boolean>(false);

    async function loadProducts() {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            setError("Error loading products");
        } finally {
            setLoading(false);
        }
    }

    async function addProduct(data: ProductRequestDTO) {
        try {
            setSaving(true);
            setError(null);

            await createProduct(data);
            await loadProducts();
        } catch (err: any) {
            setError(err?.response?.data || "Error creating product");
            throw err;
        } finally {
            setSaving(false);
        }
    }

    async function editProduct(code: string, data: ProductRequestDTO){
        try{
            setSaving(true);
            setError(null);

            await updateProduct(code, data)
            await loadProducts();
        }catch(err: any){
            setError(err?.responde?.data || "Error updating product")
            throw err;
        } finally{
            setSaving(false);
        }
    }

    async function loadProductByCode(code: string) {
        try {
            setSaving(true);
            setError(null);

            const data = await getProductByCode(code);
            setProduct(data);

            return data;
        } catch (err: any) {
            setError(err?.response?.data || "Error loading Product by code " + code);
            throw err;
        } finally {
            setSaving(false);
        }
    }

    async function removeProduct(code: string){
        try{
            setSaving(true);
            setError(null);

            await deleteProduct(code);
            await loadProducts();
        }catch(err: any){
            setError(err?.response?.data || "Error deleting product");
            throw err;
        }finally{
            setSaving(false)
        }
    }

    useEffect(()=>{
        loadProducts();
    },[])


    return{
        product,
        products,
        loading,
        saving,
        error,

        loadProducts,
        reload: loadProducts,

        addProduct,
        editProduct,
        loadProductByCode,
        removeProduct
    }
    
}