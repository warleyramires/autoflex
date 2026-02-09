import { useEffect, useState } from "react";
import { createRawMaterial, deleteRawMaterial, getAllRawMaterials, getRawMaterialByCode, getRawMaterialByID, updateRawMaterial } from "../../api/rawMaterialApi";

import type { RawMaterial } from "../../types/rawMaterial";
import type { CreateRawMaterialDTO, UpdateRawMaterialDTO } from "../../types/rawMaterialDTO";

export function useRawMaterials(){
    const[rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const[rawMaterial, setRawMaterial] = useState<RawMaterial>();
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);

    const[saving, setSaving] = useState<boolean>(false);


    async function loadRawMaterials(){

        try{
            setLoading(true);
            setError(null);

            const data = await getAllRawMaterials();
            setRawMaterials(data);
        }catch(err){
            setError("Error loading raw materials");
        }finally{
            setLoading(false);
        }
        
    }

    async function addRawMaterial(data: CreateRawMaterialDTO){
        try{
            setSaving(true)
            setError(null)

            await createRawMaterial(data)
            await loadRawMaterials();
        }catch(err: any){
            setError(err?.response?.data || "Error creating raw material");
            throw err;
        }finally{
            setSaving(false);
        }
    }

    async function editRawMaterial(code: string, data: UpdateRawMaterialDTO) {
        try{
            setSaving(true);
            setError(null);

            await updateRawMaterial(code, data);
            await loadRawMaterials();
        }catch(err:any){
            setError(err?.response?.data || "Error updating war material");
            throw err;
        }finally{
            setSaving(false);
        }
    }

    async function removeRawMaterial(code: string) {
        try{
            setSaving(true);
            setError(null);

            await deleteRawMaterial(code);
            await loadRawMaterials();
        }catch(err:any){
            setError(err?.response?.data || "Error deleting raw material")
            throw err;
        }finally{
            setSaving(false);
        }
    }

    async function loadRawMaterialByCode(code: string) {
        try {
          setSaving(true);
          setError(null);
      
          const data = await getRawMaterialByCode(code);
          setRawMaterial(data);
      
          return data; // ✅ importante
        } catch (err: any) {
          setError(err?.response?.data || "Error loading Raw Material by code " + code);
          throw err;
        } finally {
          setSaving(false);
        }
      }

      async function loadRawMaterialById(id: number) {
        try {
          setSaving(true);
          setError(null);
      
          const data = await getRawMaterialByID(id);
          setRawMaterial(data);
      
          return data; // ✅ importante
        } catch (err: any) {
          setError(err?.response?.data || "Error loading Raw Material by id " + id);
          throw err;
        } finally {
          setSaving(false);
        }
      }

    useEffect(() => {
        loadRawMaterials();
    },[]);

    return {
        rawMaterials,
        rawMaterial,
        loading,
        saving,
        error,
      
        loadRawMaterials,
        reload: loadRawMaterials,
        loadRawMaterialByCode,
        loadRawMaterialById,
      
        addRawMaterial,
        editRawMaterial,
        removeRawMaterial,
    }
}