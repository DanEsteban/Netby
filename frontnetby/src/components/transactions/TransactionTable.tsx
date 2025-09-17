import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Transaction } from "../../services/types/transaction";

type Props = {
     rows: Transaction[];
     onEdit: (row: Transaction) => void;
     onDelete: (row: Transaction) => void;
};

export default function TransactionTable({ rows, onEdit, onDelete }: Props) {
     return (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
               <Table size="small">
                    <TableHead>
                         <TableRow>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Tipo</TableCell>
                              <TableCell>ProductoId</TableCell>
                              <TableCell align="right">Cantidad</TableCell>
                              <TableCell align="right">Precio Unit.</TableCell>
                              <TableCell align="right">Total</TableCell>
                              <TableCell>Detalle</TableCell>
                              <TableCell align="center">Acciones</TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                         {rows.map((r) => (
                              <TableRow key={r.id}>
                                   <TableCell>{new Date(r.date).toLocaleString()}</TableCell>
                                   <TableCell>{r.type === "Purchase" ? "Compra" : "Venta"}</TableCell>
                                   <TableCell>{r.productId}</TableCell>
                                   <TableCell align="right">{r.quantity}</TableCell>
                                   <TableCell align="right">{r.unitPrice.toFixed(2)}</TableCell>
                                   <TableCell align="right">{r.totalPrice.toFixed(2)}</TableCell>
                                   <TableCell>{r.detail ?? "—"}</TableCell>
                                   <TableCell align="center">
                                        <IconButton onClick={() => onEdit(r)} aria-label="editar"><EditIcon /></IconButton>
                                        <IconButton onClick={() => onDelete(r)} color="error" aria-label="borrar"><DeleteIcon /></IconButton>
                                   </TableCell>
                              </TableRow>
                         ))}
                         {rows.length === 0 && (
                              <TableRow><TableCell colSpan={8} align="center">Sin resultados</TableCell></TableRow>
                         )}
                    </TableBody>
               </Table>
          </TableContainer>
     );
}
