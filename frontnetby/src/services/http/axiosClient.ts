import axios from "axios";

const baseURL = import.meta.env.VITE_API_PRODUCTS_URL ;
if (!baseURL) {
     console.log("La VITE_API_PRODUCTS_URL no está definido en .env");
}

export const axiosClient = axios.create({
     baseURL: baseURL ?? "http://localhost:5153",
     timeout: 15000,
});

axiosClient.interceptors.response.use(
     (res) => res,
     (err) => {
          const msg = err?.response?.data?.message || err.message || "Error de red";
          return Promise.reject(new Error(msg));
     }
);
