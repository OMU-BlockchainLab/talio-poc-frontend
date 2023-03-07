import { UserType } from 'utils/types';

export interface HeadCellSys {
  disablePadding: boolean;
  id: keyof UserType;
  label: string;
  numeric: boolean;
}

export const HEAD_CELL_ORGNA: readonly HeadCellSys[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'isVerified',
    numeric: true,
    disablePadding: false,
    label: 'Verify',
  },
  {
    id: 'wallets',
    numeric: false,
    disablePadding: false,
    label: 'Wallet',
  },
];
