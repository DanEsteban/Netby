export type Product = {
     id: number;
     name: string;
     description: string | null;
     category: string;
     image: string | null;
     price: number;
     stock: number;
};

export type ProductCreate = {
     name: string;
     description: string | null;
     category: string;
     image: string | null;
     price: number;
     stock: number;
};

export type ProductUpdate = {
     name: string;
     description: string | null;
     category: string;
     image: string | null;
     price: number;
     stock: number;
};