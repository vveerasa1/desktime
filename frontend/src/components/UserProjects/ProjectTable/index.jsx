// Table.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ProjectTable = ({
  data = [],
  columns = [],
  selected,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
}) => {
  console.log(selected,"SELECTED")
  const selectedCount = selected.length;
  const rowCount = data.length;

  return (
    <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0", boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* "Select All" Checkbox */}
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={selectedCount > 0 && selectedCount < rowCount}
                checked={rowCount > 0 && selectedCount === rowCount}
                onChange={onSelectAll}
                inputProps={{ "aria-label": "select all items" }}
              />
            </TableCell>

            {/* Dynamic Column Headers */}
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: "bold" }}>
                {col}
              </TableCell>
            ))}

            {/* Actions Column Header */}
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            const isItemSelected = selected.indexOf(row._id) !== -1;
            return (
              <TableRow
                key={row._id}
                hover
                onClick={(event) => onSelectOne(event, row._id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                sx={{ cursor: "pointer" }}
              >
                {/* Row Checkbox */}
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    // FIX: Added onChange handler to the row checkbox
                    onChange={(event) => onSelectOne(event, row._id)}
                    inputProps={{
                      "aria-labelledby": `table-checkbox-${row._id}`,
                    }}
                  />
                </TableCell>

                {/* Dynamic Row Cells */}
                {columns.map((col) => {
                  const dataKey = col.toLowerCase().replace(/ /g, "_");
                  return <TableCell key={col}>{row[dataKey]}</TableCell>;
                })}

                {/* Actions Cell with Edit and Delete Icons */}
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={0.5}>
                    <IconButton
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row selection
                        if (onEdit) onEdit(row._id);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row selection
                        if (onDelete) onDelete(row._id);
                      }}
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;