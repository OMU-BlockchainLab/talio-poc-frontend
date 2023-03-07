export interface Data {
  id: string;
  name: string;
  issuer: string;
  isPublic: boolean;
}
export interface HeadCellOrg {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

export const HEAD_CELL_ORGNA: readonly HeadCellOrg[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'issuer',
    numeric: false,
    disablePadding: false,
    label: 'Issuer',
  },
  {
    id: 'isPublic',
    numeric: true,
    disablePadding: false,
    label: 'Validate',
  },
];
