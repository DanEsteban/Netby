import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TransactionCreate, TransactionUpdate } from "../services/types/transaction";
import { createTransaction, deleteTransaction, getTransaction, getTransactions, updateTransaction } from "../services/api/transactiosApi";

export function useTransactions(filters?: { from?: string; to?: string; type?: "Purchase" | "Sale"; productId?: number }) {
     return useQuery({
          queryKey: ["transactions", filters],
          queryFn: () => getTransactions(filters),
     });
}

export function useTransaction(id?: number) {
     return useQuery({
          queryKey: ["transaction", id],
          queryFn: () => {
               if (!id) throw new Error("id requerido");
               return getTransaction(id);
          },
          enabled: !!id,
     });
}

export function useCreateTransaction() {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: (payload: TransactionCreate) => createTransaction(payload),
          onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
     });
}

export function useUpdateTransaction(id: number) {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: (payload: TransactionUpdate) => updateTransaction(id, payload),
          onSuccess: () => {
               qc.invalidateQueries({ queryKey: ["transactions"] });
               qc.invalidateQueries({ queryKey: ["transaction", id] });
          },
     });
}

export function useDeleteTransaction() {
     const qc = useQueryClient();
     return useMutation({
          mutationFn: (id: number) => deleteTransaction(id),
          onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
     });
}
