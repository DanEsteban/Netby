import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import { useState, useMemo } from "react";
import type { Transaction } from "../../services/types/transaction";
import { useProducts } from "../../hooks/useProducts";
import { useDeleteTransaction, useTransactions } from "../../hooks/useTransaction";

export default function TransactionsList() {
     const nav = useNavigate();
     const [sp, setSp] = useSearchParams();
     const initial = {
          from: sp.get("from") ?? undefined,
          to: sp.get("to") ?? undefined,
          type: (sp.get("type") as "Purchase" | "Sale" | null) ?? undefined,
          productId: sp.get("productId") ? Number(sp.get("productId")) : undefined,
     };

     const { data: products = [] } = useProducts(); 
     const { data = [], isLoading, isError, error } = useTransactions(initial);
     const del = useDeleteTransaction();

     const [toDelete, setToDelete] = useState<Transaction | null>(null);
     const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({ open: false, msg: "", severity: "success" });

     const rows = useMemo(() => data, [data]);

     return (
          <Container maxWidth="lg" sx={{ py: 3 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Transacciones</Typography>
                    <Button variant="contained" onClick={() => nav("/transacciones/nueva")}>Nueva transacción</Button>
               </Stack>

               <TransactionFilters
                    products={products.map(p => ({ id: p.id, name: p.name }))}
                    initial={initial}
                    onFilter={(f) => {
                         const params = new URLSearchParams();
                         if (f.from) params.set("from", f.from);
                         if (f.to) params.set("to", f.to);
                         if (f.type) params.set("type", f.type);
                         if (f.productId) params.set("productId", String(f.productId));
                         setSp(params);
                    }}
               />

               {isLoading && <Typography sx={{ mt: 2 }}>Cargando...</Typography>}
               {isError && <Alert sx={{ mt: 2 }} severity="error">{(error as Error).message}</Alert>}

               {!isLoading && !isError && (
                    <TransactionTable
                         rows={rows}
                         onEdit={(row) => nav(`/transacciones/${row.id}/editar`)}
                         onDelete={(row) => setToDelete(row)}
                    />
               )}

               <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
                    <DialogTitle>Eliminar transacción</DialogTitle>
                    <DialogContent>¿Seguro que deseas eliminar la transacción #{toDelete?.id}?</DialogContent>
                    <DialogActions>
                         <Button onClick={() => setToDelete(null)}>Cancelar</Button>
                         <Button
                              color="error"
                              onClick={async () => {
                                   if (!toDelete) return;
                                   try {
                                        await del.mutateAsync(toDelete.id);
                                        setSnack({ open: true, msg: "Transacción eliminada", severity: "success" });
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

               <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack(s => ({ ...s, open: false }))} message={snack.msg} />
          </Container>
     );
}
