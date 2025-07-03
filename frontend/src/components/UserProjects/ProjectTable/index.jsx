// Table.js
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ProjectTable = ({ data, columns }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{background:'grey'}}>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col}>{row[col.toLowerCase().replace(/ /g, "_")]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;
