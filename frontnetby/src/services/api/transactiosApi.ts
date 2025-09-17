import { axiosTx } from "../http/axiosClientsTransaction";
import type { Transaction, TransactionCreate, TransactionUpdate, TransactionType } from "../types/transaction";

export async function getTransactions(params?: { from?: string; to?: string; type?: TransactionType; productId?: number }) {
     const res = await axiosTx.get<Transaction[]>("/api/Transactions", { params });
     return res.data;
}

export async function getTransaction(id: number) {
     const res = await axiosTx.get<Transaction>(`/api/Transactions/${id}`);
     return res.data;
}

export async function createTransaction(payload: TransactionCreate) {
     const res = await axiosTx.post<Transaction>("/api/Transactions", payload);
     return res.data;
}

export async function updateTransaction(id: number, payload: TransactionUpdate) {
     const res = await axiosTx.put<Transaction>(`/api/Transactions/${id}`, payload);
     return res.data;
}

export async function deleteTransaction(id: number) {
     await axiosTx.delete<void>(`/api/Transactions/${id}`);
}
