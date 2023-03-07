import VerifiedIcon from '@mui/icons-material/Verified';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ColorChips from 'components/Status';
import * as React from 'react';

type Status = 'active' | 'inactive' | 'blocked';

export interface UserType {
  id: string;
  email: string;
  status: Status;
  wallet: string;
  verifi: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  center: boolean;
}
interface IPropsData {
  data?: UserType[];
  total: number;
  headCells: HeadCell[];
  handleVerifi: Function;
  dispatchChangePage: Function;
}
interface EnhancedTableProps {
  headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells } = props;
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.center ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'normal' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="center"></TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable({
  data,
  total,
  headCells,
  handleVerifi,
  dispatchChangePage,
}: IPropsData) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  if (!data) {
    return <div>Data Empty</div>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatchChangePage(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead headCells={headCells} />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {data &&
                data.map((row: UserType) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="left" key={Math.random()}>
                        {row.email}
                      </TableCell>
                      <TableCell align="left" key={Math.random()}>
                        <ColorChips status={row.status as any} />
                      </TableCell>
                      <TableCell align="left" key={Math.random()}>
                        {row.wallet}
                      </TableCell>
                      {/* <TableCell align="center" key={Math.random()} sx={{ cursor: 'pointer' }}>
                        <VerifiedIcon
                          onClick={() => handleVerifi(row.id)}
                          color={row.verifi ? 'primary' : 'action'}
                        />
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
