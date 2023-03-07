import GradingSharpIcon from '@mui/icons-material/GradingSharp';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Pagination } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ColorChips from 'components/Status';
import { HeadCellSys } from 'constant/head-table/headCellSys';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from 'utils/types';

type Status = 'active' | 'inactive' | 'blocked';
type TableType = 'sysman' | 'org';

export interface ProfileUser {
  id: string;
  email: string;
  status: Status;
  wallet: string;
  verifi: boolean;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface IPropsData {
  data: UserType[];
  total: number;
  pages?: number;
  pageCurrent?: number;
  handleVerifi: Function;
  dispatchChangePage: Function;
  headerCell: readonly HeadCellSys[];
  typeTable: TableType;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof UserType) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: readonly HeadCellSys[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property: keyof UserType) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleVerifiSelected: Function;
  typeTable: TableType;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {props.typeTable === 'org' ? 'List Orgnazitions' : 'List Sysman'}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Verify items selected">
          <IconButton onClick={() => props.handleVerifiSelected()}>
            <GradingSharpIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function SysmanTable({
  data,
  pages,
  total,
  pageCurrent,
  handleVerifi,
  dispatchChangePage,
  headerCell,
  typeTable,
}: IPropsData) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof UserType>(headerCell[0].id);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(pageCurrent ?? 0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();

  React.useEffect(() => {
    setPage(pageCurrent ?? 0);
  }, [pageCurrent]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof UserType) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatchChangePage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const clickVerify = (e: any, ids: string[], isVerified: boolean) => {
    e.stopPropagation();
    handleVerifi(ids, isVerified);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, pb: '40px' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          typeTable={typeTable}
          handleVerifiSelected={() => handleVerifi(selected)}
        />
        {!data || data.length < 1 ? (
          <div>No data...</div>
        ) : (
          <>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                  headCells={headerCell}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(data as any, getComparator(order, orderBy)).map(
                    (row: UserType | any, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell align="left" key={Math.random()}>
                            {row.emailCredentials?.length > 0 && row.emailCredentials[0]?.email}
                          </TableCell>
                          <TableCell align="left" key={Math.random()}>
                            <ColorChips status={row.isVerified} />
                          </TableCell>
                          <TableCell align="left" key={Math.random()}>
                            {row.weight ?? 0}
                          </TableCell>
                          <TableCell align="left" key={Math.random()}>
                            {row.wallets?.length > 0 && row.wallets[0].address}
                          </TableCell>
                          <TableCell align="center" key={Math.random()} sx={{ cursor: 'pointer' }}>
                            <VerifiedIcon
                              onClick={(e) => clickVerify(e, [row.id], row.isVerified)}
                              color={row.isVerified ? 'primary' : 'action'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={pages}
              page={page}
              color="primary"
              onChange={handleChangePage}
              sx={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
