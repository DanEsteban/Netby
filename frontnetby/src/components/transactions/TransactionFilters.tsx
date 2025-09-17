import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";

type Props = {
     onFilter: (f: { from?: string; to?: string; type?: "Purchase" | "Sale"; productId?: number }) => void;
     products: { id: number; name: string }[];
     initial?: { from?: string; to?: string; type?: "Purchase" | "Sale"; productId?: number };
};

export default function TransactionFilters({ onFilter, products, initial }: Props) {
     const [from, setFrom] = React.useState(initial?.from ?? "");
     const [to, setTo] = React.useState(initial?.to ?? "");
     const [type, setType] = React.useState<string>(initial?.type ?? "");
     const [productId, setProductId] = React.useState<number>(initial?.productId ?? 0);

     return (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); onFilter({ from, to, type: type as any || undefined, productId: productId || undefined }); }}>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Desde" type="date" size="small" InputLabelProps={{ shrink: true }} value={from} onChange={e => setFrom(e.target.value)} />
                    <TextField label="Hasta" type="date" size="small" InputLabelProps={{ shrink: true }} value={to} onChange={e => setTo(e.target.value)} />
                    <TextField select label="Tipo" size="small" value={type} onChange={e => setType(e.target.value)}>
                         <MenuItem value="">Todos</MenuItem>
                         <MenuItem value="Purchase">Compra</MenuItem>
                         <MenuItem value="Sale">Venta</MenuItem>
                    </TextField>
                    <TextField select label="Producto" size="small" value={productId} onChange={e => setProductId(Number(e.target.value))}>
                         <MenuItem value={0}>Todos</MenuItem>
                         {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </TextField>
                    <Button type="submit" variant="contained">Filtrar</Button>
                    <Button variant="text" onClick={() => { setFrom(""); setTo(""); setType(""); setProductId(0); onFilter({}); }}>Limpiar</Button>
               </Stack>
          </Box>
     );
}
