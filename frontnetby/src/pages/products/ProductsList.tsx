import { useNavigate } from "react-router-dom";
import { useDeleteProduct, useProducts } from "../../hooks/useProducts";
import { useMemo, useState } from "react";
import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, Typography } from "@mui/material";
import ProductFilters from "../../components/products/ProductFilters";
import ProductTable from "../../components/products/ProductTable";
import type { Product } from "../../services/types/product";

export default function ProductsList() {
     const [filters, setFilters] = useState<{ name?: string; category?: string }>({});
     const { data = [], isLoading, isError, error } = useProducts(filters);
     const nav = useNavigate();

     const [toDelete, setToDelete] = useState<Product | null>(null);
     const del = useDeleteProduct();

     const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({ open: false, msg: "", severity: "success" });

     const rows = useMemo(() => data, [data]);

     return (
          <Container maxWidth="lg" sx={{ py: 3 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Productos</Typography>
                    <Button variant="contained" onClick={() => nav("/productos/nuevo")}>Nuevo</Button>
               </Stack>

               <ProductFilters onFilter={setFilters} />

               {isLoading && <Typography sx={{ mt: 2 }}>Cargando...</Typography>}
               {isError && <Alert sx={{ mt: 2 }} severity="error">{(error as Error).message}</Alert>}

               {!isLoading && !isError && (
                    <ProductTable
                         rows={rows}
                         onEdit={(row) => nav(`/productos/${row.id}/editar`)}
                         onDelete={(row) => setToDelete(row)}
                    />
               )}

               <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
                    <DialogTitle>Eliminar producto</DialogTitle>
                    <DialogContent>¿Seguro que deseas eliminar "{toDelete?.name}"?</DialogContent>
                    <DialogActions>
                         <Button onClick={() => setToDelete(null)}>Cancelar</Button>
                         <Button
                              color="error"
                              onClick={async () => {
                                   if (!toDelete) return;
                                   try {
                                        await del.mutateAsync(toDelete.id);
                                        setSnack({ open: true, msg: "Producto eliminado", severity: "success" });
                                   } catch (e: any) {
                                        setSnack({ open: true, msg: e.message ?? "Error al eliminar", severity: "error" });
                                   } finally {
                                        setToDelete(null);
                                   }
                              }}
                         >
                              Eliminar
                         </Button>
                    </DialogActions>
               </Dialog>

               <Snackbar
                    open={snack.open}
                    autoHideDuration={2500}
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
               >
                    <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
                         {snack.msg}
                    </Alert>
               </Snackbar>
          </Container>
     );
}