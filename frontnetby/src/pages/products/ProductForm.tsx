import React from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateProduct, useProduct, useUpdateProduct } from "../../hooks/useProducts";

type FormData = {
     name: string;
     description: string;
     category: string;
     image: string;
     price: number;
     stock: number;
};

export default function ProductForm({ mode }: { mode: "create" | "edit" }) {
     const nav = useNavigate();
     const { id } = useParams();
     const productId = mode === "edit" ? Number(id) : undefined;

     const { data, isLoading, isError, error } = useProduct(productId);
     const createMut = useCreateProduct();
     const updateMut = useUpdateProduct(productId ?? 0);

     const { register, handleSubmit, reset, formState: { errors }, setError } = useForm<FormData>({
          defaultValues: {
               name: "",
               description: "",
               category: "",
               image: "",
               price: 0,
               stock: 0,
          },
     });

     const isEdit = mode === "edit";

     // cargar datos al editar
     React.useEffect(() => {
          if (isEdit && data) {
               reset({
                    name: data.name,
                    description: data.description ?? "",
                    category: data.category,
                    image: data.image ?? "",
                    price: data.price,
                    stock: data.stock,
               });
          }
     }, [isEdit, data, reset]);

     const [snack, setSnack] = React.useState<{ open: boolean; msg: string; severity: "success" | "error" }>({ 
          open: false, 
          msg: "", 
          severity: "success" 
     });

     const validateForm = (form: FormData): boolean => {
          let isValid = true;

          if (!form.name.trim()) {
               setError("name", { message: "Nombre requerido" });
               isValid = false;
          }

          if (!form.category.trim()) {
               setError("category", { message: "Categoría requerida" });
               isValid = false;
          }

          if (form.price < 0) {
               setError("price", { message: "Precio debe ser >= 0" });
               isValid = false;
          }

          if (form.stock < 0) {
               setError("stock", { message: "Stock debe ser >= 0" });
               isValid = false;
          }

          if (form.image && form.image.trim() && !isValidUrl(form.image)) {
               setError("image", { message: "Debe ser una URL válida" });
               isValid = false;
          }

          return isValid;
     };

     const isValidUrl = (string: string): boolean => {
          try {
               new URL(string);
               return true;
          } catch (_) {
               return false;
          }
     };

     const onSubmit = async (form: FormData) => {
          if (!validateForm(form)) return;

          try {
               const payload = {
                    name: form.name,
                    description: form.description || null,
                    category: form.category,
                    image: form.image || null,
                    price: Number(form.price),
                    stock: Number(form.stock),
               };

               if (isEdit) {
                    await updateMut.mutateAsync(payload);
                    setSnack({ open: true, msg: "Producto actualizado", severity: "success" });
               } else {
                    await createMut.mutateAsync(payload);
                    setSnack({ open: true, msg: "Producto creado", severity: "success" });
               }
               setTimeout(() => nav("/productos"), 600);
          } catch (e: any) {
               setSnack({ open: true, msg: e.message ?? "Error al guardar", severity: "error" });
          }
     };

     if (isEdit && isLoading) return <Container sx={{ py: 3 }}><Typography>Cargando...</Typography></Container>;
     if (isEdit && isError) return <Container sx={{ py: 3 }}><Alert severity="error">{(error as Error).message}</Alert></Container>;

     return (
          <Container maxWidth="md" sx={{ py: 3 }}>
               <Typography variant="h5" mb={2}>{isEdit ? "Editar producto" : "Nuevo producto"}</Typography>

               <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                         <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                              <TextField 
                                   label="Nombre" 
                                   fullWidth 
                                   {...register("name", { required: "Nombre requerido" })} 
                                   error={!!errors.name} 
                                   helperText={errors.name?.message} 
                              />
                              <TextField 
                                   label="Categoría" 
                                   fullWidth 
                                   {...register("category", { required: "Categoría requerida" })} 
                                   error={!!errors.category} 
                                   helperText={errors.category?.message} 
                              />
                         </Box>
                         
                         <TextField 
                              label="Descripción" 
                              fullWidth 
                              multiline 
                              minRows={2} 
                              {...register("description")} 
                              error={!!errors.description} 
                              helperText={errors.description?.message} 
                         />
                         
                         <TextField 
                              label="URL de imagen" 
                              fullWidth 
                              {...register("image")} 
                              error={!!errors.image} 
                              helperText={errors.image?.message} 
                         />
                         
                         <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                              <TextField 
                                   label="Precio" 
                                   type="number" 
                                   fullWidth 
                                   inputProps={{ step: "0.01", min: "0" }} 
                                   {...register("price", { 
                                        required: "Precio requerido",
                                        min: { value: 0, message: "Precio debe ser >= 0" },
                                        valueAsNumber: true
                                   })} 
                                   error={!!errors.price} 
                                   helperText={errors.price?.message} 
                              />
                              <TextField 
                                   label="Stock" 
                                   type="number" 
                                   fullWidth 
                                   inputProps={{ min: "0" }}
                                   {...register("stock", { 
                                        required: "Stock requerido",
                                        min: { value: 0, message: "Stock debe ser >= 0" },
                                        valueAsNumber: true
                                   })} 
                                   error={!!errors.stock} 
                                   helperText={errors.stock?.message} 
                              />
                         </Box>
                    </Box>

                    <Box mt={3} display="flex" gap={2}>
                         <Button type="submit" variant="contained">
                              {isEdit ? "Guardar" : "Crear"}
                         </Button>
                         <Button variant="outlined" onClick={() => nav("/productos")}>
                              Cancelar
                         </Button>
                    </Box>
               </Box>

               <Snackbar
                    open={snack.open}
                    autoHideDuration={2500}
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    message={snack.msg}
               />
          </Container>
     );
}