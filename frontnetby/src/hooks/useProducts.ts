import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
     createProduct,
     deleteProduct,
     getProduct,
     getProducts,
     updateProduct,
} from "../services/api/productsApi";
import type { ProductUpdate } from "../services/types/product";

export function useProducts(filters?: { name?: string; category?: string }) {
     return useQuery({
          queryKey: ["products", filters],
          queryFn: async () => {
               const data = await getProducts(filters);
               // Filtro en cliente si el backend ignora params:
               const name = filters?.name?.toLowerCase().trim();
               const category = filters?.category?.toLowerCase().trim();

               return data.filter((p: any) => {
                    const okName = name ? p.name.toLowerCase().includes(name) : true;
                    const okCat = category ? p.category.toLowerCase().includes(category) : true;
                    return okName && okCat;
               });
          },
     });
}


export function useProduct(id?: number) {
     return useQuery({
          queryKey: ["product", id],
          queryFn: () => {
               if (!id) throw new Error("id requerido");
               return getProduct(id);
          },
          enabled: !!id,
     });
}

export function useCreateProduct() {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: createProduct,
          onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
     });
}

export function useUpdateProduct(id: number) {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: (payload: ProductUpdate) => updateProduct(id, payload),
          onSuccess: () => {
               qc.invalidateQueries({ queryKey: ["products"] });
               qc.invalidateQueries({ queryKey: ["product", id] });
          },
     });
}

export function useDeleteProduct() {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: deleteProduct,
          onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
     });
}