import {
     Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";


import type { Product } from "../../services/types/product";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
     rows: Product[];
     onEdit: (row: Product) => void;
     onDelete: (row: Product) => void;
};

export default function ProductTable({ rows, onEdit, onDelete }: Props) {
     return (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
               <Table size="small">
                    <TableHead>
                         <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Descripción</TableCell>
                              <TableCell>Categoría</TableCell>
                              <TableCell align="right">Precio</TableCell>
                              <TableCell align="right">Stock</TableCell>
                              <TableCell>Imagen</TableCell>
                              <TableCell align="center">Acciones</TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                         {rows.map((r) => (
                              <TableRow key={r.id}>
                                   <TableCell>{r.name}</TableCell>
                                   <TableCell>{r.description}</TableCell>
                                   <TableCell>{r.category}</TableCell>
                                   <TableCell align="right">{r.price.toFixed(2)}</TableCell>
                                   <TableCell align="right">{r.stock}</TableCell>
                                   <TableCell>
                                        {r.image ? (
                                             <Box component="img" src={r.image} alt={r.name} sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }} />
                                        ) : "—"}
                                   </TableCell>
                                   <TableCell align="center">
                                        <IconButton onClick={() => onEdit(r)} aria-label="editar"><EditIcon /></IconButton>
                                        <IconButton onClick={() => onDelete(r)} color="error" aria-label="borrar"><DeleteIcon /></IconButton>
                                   </TableCell>
                              </TableRow>
                         ))}
                         {rows.length === 0 && (
                              <TableRow>
                                   <TableCell colSpan={7} align="center">Sin resultados</TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
          </TableContainer>
     );
}