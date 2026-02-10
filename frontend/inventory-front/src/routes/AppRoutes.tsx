import { Routes, Route, Navigate } from "react-router-dom";
import { RawMaterialListPage } from "../page/raw-materials/RawMaterialsListPage";
import { ProductsListPage } from "../page/products/ProductsListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/raw-materials" />} />
      <Route path="/raw-materials" element={<RawMaterialListPage />} />
      <Route path="/products" element={<ProductsListPage />} />
    </Routes>
  );
}