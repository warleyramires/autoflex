import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { HomePage } from "../page/home/HomePage";
import { RawMaterialListPage } from "../page/raw-materials/RawMaterialsListPage";
import { ProductsListPage } from "../page/products/ProductsListPage";
import { ProductionPlanPage } from "../page/production/ProductionPlanPage";

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/raw-materials" element={<RawMaterialListPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/production" element={<ProductionPlanPage />} />
      </Routes>
    </MainLayout>
  );
}