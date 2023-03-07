import { Avatar, Box, Button, Rating, Stack, Typography } from '@mui/material';
import BasicTable from 'components/Tables/BasicTable';
import OrganizationsTable from 'components/Tables/OrganizationsTable';
import { HeadCellOrg, HEAD_CELL_ORGNA } from 'constant/head-table';
import { ApiContext } from 'contexts/apiProviderContext';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_LIST_USER } from 'service/auth';
import { GET_LIST_CERTIFICATES } from 'service/certificate';
import { useQuery } from 'urql';
import { CVDetail, UserType } from 'utils/types';
import ItemCV from './ItemCV';

export interface IListCVProps {
  dataCVs: CVDetail[];
}

export default function ListCV({ dataCVs }: IListCVProps) {
  const [dataUsers, setDataUsers] = React.useState<UserType[]>([]);
  const [page, setPage] = React.useState(0);
  const navigate = useNavigate();
  const { userDetail } = React.useContext(ApiContext);
  const [listCert, getListCert] = useQuery({
    query: GET_LIST_CERTIFICATES,
    variables: { page, userId: userDetail?.id },
    requestPolicy: 'network-only',
  });
  const role = userDetail?.roleObj.code;
  const condition = role !== 'SysMan' && role !== 'superAdmin';

  const [users, getListUser] = useQuery({
    query: GET_LIST_USER,
    variables: { page: 0, outputRoleCode: 'user' },
    requestPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (condition) getListUser();
  }, [condition]);

  React.useEffect(() => {
    if (userDetail?.roleObj.code.toLocaleLowerCase() === 'organization') {
      getListCert();
    } else {
      getListUser();
    }
  }, [page]);

  React.useEffect(() => {
    if (users?.data?.users) setDataUsers(users?.data?.users?.rows);
  }, [users.data]);

  const changePageCertificate = () => {};
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" gutterBottom component="div" textAlign={'left'}>
          {condition ? 'List Certificates You Created' : 'List user'}
        </Typography>
        {condition && (
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="contained"
              sx={{ height: '45px' }}
              onClick={() => navigate('/create-cv')}
            >
              Create new CV
            </Button>
            <Button
              variant="contained"
              sx={{ height: '45px', marginLeft: '10px' }}
              onClick={() => navigate('/create-certificate')}
            >
              Create certificate
            </Button>
          </Box>
        )}
      </Box>
      {
        <OrganizationsTable
          data={listCert.data?.Certs.rows ?? []}
          dispatchChangePage={changePageCertificate}
          handleVerifi={() => {}}
          headerCell={HEAD_CELL_ORGNA as HeadCellOrg[]}
          total={listCert.data?.Certs?.count}
          title="List Certificates Created"
        />
      }
      {dataCVs && condition && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {dataCVs?.map((cv: CVDetail, index: number) => (
            <ItemCV dataDetail={cv} />
          ))}
        </Box>
      )}

      {!condition && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <BasicTable data={dataUsers} />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {!dataCVs && <div>Data not found...</div>}
      </Box>
    </Box>
  );
}
