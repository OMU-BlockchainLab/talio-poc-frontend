import apiBlockchain from 'api/configBlockchain';
import client from 'api/configClient';
import ModalConfirm from 'components/ModalConfirm';
import SysmanTable from 'components/Tables/SysmanTable';
import { HEAD_CELL_SYSMAN } from 'constant/head-table';
import { HeadCellSys } from 'constant/head-table/headCellSys';
import { ApiContext } from 'contexts/apiProviderContext';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GET_LIST_USER, UPDATE_STATUS_USERS } from 'service/auth';
import { useMutation, useQuery } from 'urql';
import LayoutAdmin from '../../layout/LayoutAdmin';

export interface IUsersProps {}
export const paging = {
  page: 0,
  limit: 10,
  sortBy: 'createdAt',
  sortType: 'asc',
  status: 'active',
};

interface EventReturn {
  result?: string;
  message?: string;
  value?: string | null;
}
type Status = 'active' | 'inactive' | 'blocked';

export default function SysMan(props: IUsersProps) {
  const { userDetail } = React.useContext(ApiContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filter, setFilter] = React.useState(paging);
  const [open, setOpen] = React.useState(false);
  const [idVerify, setIdVerify] = React.useState<string[]>([]);
  const [listUser, setListUser] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [totalUser, setTotalUser] = React.useState<number>(0);
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [{}, updateStatusUser] = useMutation(UPDATE_STATUS_USERS);

  const [{ data, error, fetching }, getListUser] = useQuery({
    query: GET_LIST_USER,
    variables: { page, outputRoleCode: 'SysMan' },
    requestPolicy: 'network-only',
  });

  const dispatchChangePage = React.useCallback((newPage: any) => {
    navigate(`/sysman?page=${newPage}`);
  }, []);

  React.useEffect(() => {
    getListUser();
    // getData(page);
  }, [page]);

  React.useEffect(() => {
    const pageParam = Number(searchParams.get('page')) ?? 0;
    setPage(pageParam > 0 ? pageParam - 1 : pageParam);
  }, [searchParams]);

  React.useEffect(() => {
    if (data) {
      setListUser(data.users?.rows);
      setTotalUser(data.users.count);
    }
  }, [data]);

  React.useEffect(() => {
    const getApi = async () => {
      const { api } = await apiBlockchain();
      const accountKeys = await api.query.account.accountStorage.keys();
      const accountIds = new Array();
      for (const key in accountKeys) {
        let accountKeyAccess: any = accountKeys[key];
        if (accountKeys) accountIds.push(accountKeyAccess.toHuman().toString());
      }
      const infoAccounts = new Promise(async (resolve, reject) => {
        try {
          await api.query.account.accountStorage.multi(accountIds, (accountStorage) => {
            resolve(accountStorage);
          });
        } catch (error) {
          reject(error);
        }
      });
      let infos = new Array(); // daj dung roi a,phai cho a quang tra ve status cua cai user do
      const infoAccountResult: any = await infoAccounts;

      infoAccountResult.map((info: any) => {
        infos.push(info.toHuman());
      });

      let accounts: any = {};
      accountIds.forEach((value, index) => {
        accounts[value] = infos[index];
      });

      const listValidatedOrg = Object.entries(accounts).filter(
        ([key, value]: any) => value.status == 'Active' && value.role == 'Organization'
      );
    };
    getApi();
  }, []);

  const handleConfirm = async () => {
    const { account, allAccounts, allInjected, api, injector, provider } = await apiBlockchain();
    const events = new Promise(async (resolve, reject) => {
      await api.tx.hierarchy
        .approveSysman(userDetail?.id, idVerify)
        .signAndSend(
          account.address,
          { signer: injector.signer },
          ({ status, events, dispatchError }) => {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                const err = 'Error'.concat(':', section, '.', name);
                let res: EventReturn = {
                  result: 'Error',
                  message: err,
                  value: null,
                };
                //console.log(`${section}.${name}: ${docs.join(' ')}`);
                resolve(res);
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                //console.log(dispatchError.toString());
                resolve(dispatchError.toString());
              }
            } else {
              events.forEach(({ event, phase }) => {
                const { data, method, section }: any = event;
                //console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                if (section == 'hierarchy') {
                  let res: EventReturn = {
                    result: 'Success',
                    message: ''.concat(section, '.', method),
                    value: data?.toHuman()[0],
                  };
                  resolve(res);
                }
              });
            }
          }
        );
    });
    const resBlockchain: EventReturn = (await events) as EventReturn;
    enqueueSnackbar(resBlockchain.message);
    // const resBlockchain: string = (await events) as string;
    if (resBlockchain?.result?.toString().includes('Success')) {
      const updateWeight = await api.query.hierarchy.roleLayer(idVerify[0]);
      console.log(
        '🚀 ~ file: index.tsx ~ line 158 ~ handleConfirm ~ updateWeight',
        Number(updateWeight),
        typeof Number(updateWeight)
      );
      const updated = await updateStatusUser({
        ids: idVerify,
        isVerified: true,
        weight: Number(updateWeight),
      });
      if (updated.data) {
        getListUser();
      } else {
        alert('Update status user fail, please check again!');
      }
    }
    setOpen(false);
  };
  const handleVerifi = (ids: string[], isVerified: boolean) => {
    if (isVerified) {
      alert("Can't cancel user verification");
      return;
    }
    const newId: string[] = ids.map((item) => {
      return item;
    });
    setIdVerify(newId);
    setOpen(true);
  };

  return (
    <LayoutAdmin>
      {fetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <SysmanTable
            data={listUser}
            pages={data?.users?.pages ?? 1}
            pageCurrent={page + 1 ?? 0}
            dispatchChangePage={dispatchChangePage}
            total={totalUser}
            handleVerifi={handleVerifi}
            typeTable="sysman"
            headerCell={HEAD_CELL_SYSMAN as HeadCellSys[]}
          />
          <ModalConfirm
            title="Are you sure verify users?"
            handleConfirm={handleConfirm}
            open={open}
            handleClose={() => setOpen(false)}
          />
        </>
      )}
    </LayoutAdmin>
  );
}
