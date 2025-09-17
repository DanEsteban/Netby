import axios from "axios";

const baseURL = import.meta.env.VITE_API_TRANSACTIONS_URL as string | undefined;
if (!baseURL) console.warn("VITE_API_TRANSACTIONS_URL no está definido en .env");

export const axiosTx = axios.create({
     baseURL: baseURL ?? "http://localhost:5155",
     timeout: 15000,
});

axiosTx.interceptors.response.use(
     (res) => res,
     (err) => Promise.reject(new Error(err?.response?.data?.message || err.message || "Error de red"))
);
