import ModalConfirm from 'components/ModalConfirm';
import UsersTable from 'components/Tables/UsersTable';
import { ApiContext } from 'contexts/apiProviderContext';
import * as React from 'react';
import { GET_USER_DETAIL } from 'service/auth';
import { GET_LIST_CV } from 'service/cv';
import { useQuery } from 'urql';
import LayoutAdmin from '../../layout/LayoutAdmin';
import ListCV from './components/ListCV';

export interface IUsersProps {}
export const paging = {
  page: 0,
  limit: 10,
  sortBy: 'createdAt',
  sortType: 'asc',
  status: 'active',
};

type Status = 'active' | 'inactive' | 'blocked';

const data = [
  {
    id: '12345',
    email: 'phuong.vv@test.vn',
    status: 'active' as Status,
    wallet: '12123dadad12312312',
    verifi: true,
  },
  {
    id: '12347',
    email: 'phuong1.vv@test.vn',
    status: 'blocked' as Status,
    wallet: '12123dadad12312312',
    verifi: false,
  },
  {
    id: '12346',
    email: 'phuong2.vv@test.vn',
    status: 'inactive' as Status,
    wallet: '12123dadad12312312',
    verifi: false,
  },
];

export default function Users(props: IUsersProps) {
  const [list, getListCVs] = useQuery({ query: GET_LIST_CV });

  const { setUserDetail } = React.useContext(ApiContext);
  React.useEffect(() => {
    getListCVs();
  }, []);

  return <LayoutAdmin>{<ListCV dataCVs={list?.data?.CVs.rows} />}</LayoutAdmin>;
}
