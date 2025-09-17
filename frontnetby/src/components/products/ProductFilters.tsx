import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

type Props = {
     onFilter: (filters: { name?: string; category?: string }) => void;
};

export default function ProductFilters({ onFilter }: Props) {
     const [name, setName] = useState("");
     const [category, setCategory] = useState("");

     return (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); onFilter({ name, category }); }}>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <TextField
                         label="Nombre"
                         size="small"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                         label="Categoría"
                         size="small"
                         value={category}
                         onChange={(e) => setCategory(e.target.value)}
                    />
                    <Button type="submit" variant="contained">Buscar</Button>
                    <Button
                         variant="text"
                         onClick={() => {
                              setName(""); setCategory("");
                              onFilter({ name: "", category: "" });
                         }}
                    >
                         Limpiar
                    </Button>
               </Stack>
          </Box>
     );
}