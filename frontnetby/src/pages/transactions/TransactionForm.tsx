import { useForm } from "react-hook-form";
import { Alert, Box, Button, Container, MenuItem, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import React from "react";
import { useCreateTransaction, useTransaction, useUpdateTransaction } from "../../hooks/useTransaction";

type TxType = "Purchase" | "Sale";
type FormData = {
     date: string;          // YYYY-MM-DDTHH:mm (datetime-local)
     type: TxType;
     productId: number;
     quantity: number;
     unitPrice: number;
     detail?: string | null;
};

export default function TransactionForm({ mode }: { mode: "create" | "edit" }) {
     const nav = useNavigate();
     const { id } = useParams();
     const [sp] = useSearchParams();
     const productQS = sp.get("productId");
     const typeQS = (sp.get("type") as TxType | null) ?? null;

     const isEdit = mode === "edit";
     const txId = isEdit ? Number(id) : undefined;

     const { data: products = [], isLoading: loadingProducts, isError: errorProducts, error: productsErr } = useProducts();
     const { data: tx, isLoading: loadingTx, isError: errorTx, error: txErr } = useTransaction(txId);

     const createMut = useCreateTransaction();
     const updateMut = useUpdateTransaction(txId ?? 0);

     const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
          defaultValues: {
               date: new Date().toISOString().slice(0, 16), 
               type: typeQS ?? "Sale",
               productId: productQS ? Number(productQS) : 0,
               quantity: 1,
               unitPrice: 0,
               detail: "",
          },
     });

     React.useEffect(() => {
          if (isEdit && tx) {
               const local = new Date(tx.date);
               const dtLocal = new Date(local.getTime() - local.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
               reset({
                    date: dtLocal,
                    type: tx.type as TxType,
                    productId: tx.productId,
                    quantity: tx.quantity,
                    unitPrice: tx.unitPrice,
                    detail: tx.detail ?? "",
               });
          }
     }, [isEdit, tx, reset]);

     const selProductId = watch("productId");
     const selType = watch("type");
     const selQty = watch("quantity");
     const selPrice = watch("unitPrice");
     const selected = products.find(p => p.id === Number(selProductId));
     const previewTotal = Math.max(0, Number(selQty) * Number(selPrice));

     const [snack, setSnack] = React.useState<{ open: boolean; msg: string; severity: "success" | "error" }>({
          open: false,
          msg: "",
          severity: "success",
     });

     const onSubmit = async (form: FormData) => {
          if (form.type === "Sale" && selected && form.quantity > selected.stock) {
               setSnack({ open: true, msg: `No puedes vender ${form.quantity}. Stock disponible: ${selected.stock}.`, severity: "error" });
               return;
          }

          const iso = new Date(form.date).toISOString();

          const payload = {
               date: iso,
               type: form.type,
               productId: Number(form.productId),
               quantity: Number(form.quantity),
               unitPrice: Number(form.unitPrice),
               detail: form.detail ?? null,
          };

          try {
               if (isEdit) {
                    await updateMut.mutateAsync(payload);
                    setSnack({ open: true, msg: "Transacción actualizada", severity: "success" });
               } else {
                    await createMut.mutateAsync(payload);
                    setSnack({ open: true, msg: "Transacción creada", severity: "success" });
               }
               setTimeout(() => nav("/transacciones"), 600);
          } catch (e: any) {
               setSnack({ open: true, msg: e?.message ?? "Error al guardar", severity: "error" });
          }
     };

     if (isEdit && loadingTx) return <Container sx={{ py: 3 }}><Typography>Cargando...</Typography></Container>;
     if (isEdit && errorTx) return <Container sx={{ py: 3 }}><Alert severity="error">{(txErr as Error).message}</Alert></Container>;
     if (loadingProducts) return <Container sx={{ py: 3 }}><Typography>Cargando productos...</Typography></Container>;
     if (errorProducts) return <Container sx={{ py: 3 }}><Alert severity="error">{(productsErr as Error).message}</Alert></Container>;

     return (
          <Container maxWidth="md" sx={{ py: 3 }}>
               <Typography variant="h5" mb={2}>{isEdit ? "Editar transacción" : "Nueva transacción"}</Typography>

               <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                         <TextField
                              label="Fecha"
                              type="datetime-local"
                              InputLabelProps={{ shrink: true }}
                              {...register("date", { required: "Fecha requerida" })}
                              error={!!errors.date}
                              helperText={errors.date?.message}
                         />

                         <TextField
                              select
                              label="Tipo"
                              {...register("type", { required: "Tipo requerido" })}
                              error={!!errors.type}
                              helperText={errors.type?.message}
                         >
                              <MenuItem value="Purchase">Compra</MenuItem>
                              <MenuItem value="Sale">Venta</MenuItem>
                         </TextField>

                         <TextField
                              select
                              label="Producto"
                              {...register("productId", {
                                   required: "Producto requerido",
                                   setValueAs: (v) => parseInt(v as string, 10) || 0,
                                   validate: (v) => (v > 0 ? true : "Producto requerido"),
                              })}
                              error={!!errors.productId}
                              helperText={errors.productId?.message}
                         >
                              <MenuItem value={0} disabled>Selecciona un producto</MenuItem>
                              {products.map(p => (
                                   <MenuItem key={p.id} value={p.id}>
                                        {p.name} — stock: {p.stock}
                                   </MenuItem>
                              ))}
                         </TextField>

                         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                              <TextField
                                   label="Cantidad"
                                   type="number"
                                   inputProps={{ min: 1, step: 1 }}
                                   {...register("quantity", {
                                        required: "Cantidad requerida",
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Cantidad mínima 1" },
                                   })}
                                   error={!!errors.quantity}
                                   helperText={errors.quantity?.message ?? (selType === "Sale" && selected ? `Stock disp.: ${selected.stock}` : "")}
                              />

                              <TextField
                                   label="Precio unitario"
                                   type="number"
                                   inputProps={{ min: 0, step: "0.01" }}
                                   {...register("unitPrice", {
                                        required: "Precio requerido",
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Precio >= 0" },
                                   })}
                                   error={!!errors.unitPrice}
                                   helperText={errors.unitPrice?.message}
                              />
                         </Stack>

                         <TextField
                              label="Detalle"
                              multiline
                              minRows={2}
                              {...register("detail")}
                              error={!!errors.detail}
                              helperText={errors.detail?.message}
                         />

                         <Typography variant="body2">Total (preview): <b>{previewTotal.toFixed(2)}</b></Typography>

                         <Stack direction="row" spacing={2}>
                              <Button type="submit" variant="contained">{isEdit ? "Guardar" : "Crear"}</Button>
                              <Button variant="outlined" onClick={() => nav("/transacciones")}>Cancelar</Button>
                         </Stack>
                    </Stack>
               </Box>

               <Snackbar
                    open={snack.open}
                    autoHideDuration={2500}
                    onClose={() => setSnack(s => ({ ...s, open: false }))}
                    message={snack.msg}
               />
          </Container>
     );
}
