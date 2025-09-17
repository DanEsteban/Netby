export type TransactionType = "Purchase" | "Sale";

export type Transaction = {
     id: number;
     date: string;          
     type: TransactionType; 
     productId: number;
     quantity: number;
     unitPrice: number;
     totalPrice: number;
     detail: string | null;
};

export type TransactionCreate = {
     date: string;
     type: TransactionType;
     productId: number;
     quantity: number;
     unitPrice: number;
     detail?: string | null;
};

export type TransactionUpdate = {
     date: string;
     type: TransactionType;
     productId: number;
     quantity: number;
     unitPrice: number;
     detail?: string | null;
};