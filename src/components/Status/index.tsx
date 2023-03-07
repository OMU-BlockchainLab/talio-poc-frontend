import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type Status = 'active' | 'inactive' | 'blocked';

export interface IStatusTableProps {
  status: boolean;
}

export default function ColorChips({ status }: IStatusTableProps) {
  return (
    <Stack spacing={1} alignItems="center">
      {status && <Chip label="Active" color="success" />}
      {!status && <Chip label="Inactive" color="warning" />}
    </Stack>
  );
}
