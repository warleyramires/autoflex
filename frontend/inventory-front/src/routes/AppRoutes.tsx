import { Routes, Route, Navigate } from "react-router-dom";
import { RawMaterialListPage } from "../page/raw-materials/RawMaterialsListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/raw-materials" />} />
      <Route path="/raw-materials" element={<RawMaterialListPage />} />
    </Routes>
  );
}