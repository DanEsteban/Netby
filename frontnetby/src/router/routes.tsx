import { Navigate, Route, Routes } from "react-router-dom";
import ProductForm from "../pages/products/ProductForm";
import ProductsList from "../pages/products/ProductsList";
import TransactionsList from "../pages/transactions/TransactionsList";
import TransactionForm from "../pages/transactions/TransactionForm";


export const AppRoutes = () => {
     return (
          <Routes>
               <Route path="/" element={<Navigate to="/productos" replace />} />
               <Route path="/productos" element={<ProductsList />} />
               <Route path="/productos/nuevo" element={<ProductForm mode="create" />} />
               <Route
                    path="/productos/:id/editar"
                    element={<ProductForm mode="edit" />}
               />
               <Route path="/transacciones" element={<TransactionsList  />} />
               <Route path="/transacciones/nueva" element={<TransactionForm mode="create" />} />
               <Route
                    path="/transacciones/:id/editar"
                    element={<TransactionForm mode="edit" />}
               />
          </Routes>
     );
};