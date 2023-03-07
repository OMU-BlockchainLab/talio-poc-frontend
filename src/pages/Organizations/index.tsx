import apiBlockchain from 'api/configBlockchain';
import ModalConfirm from 'components/ModalConfirm';
import OrganizationsTable from 'components/Tables/OrganizationsTable';
import SysmanTable from 'components/Tables/SysmanTable';
import { HEAD_CELL_SYSMAN } from 'constant/head-table';
import { HeadCellOrg, HEAD_CELL_ORGNA } from 'constant/head-table/headCellOrgna';
import { HeadCellSys } from 'constant/head-table/headCellSys';
import { ApiContext } from 'contexts/apiProviderContext';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_LIST_USER, UPDATE_STATUS_USERS } from 'service/auth';
import { GET_LIST_CERTIFICATES, UPDATE_CERTIFICATES } from 'service/certificate';
import { useMutation, useQuery } from 'urql';
import { stringToByte } from 'utils/function';
import LayoutAdmin from '../../layout/LayoutAdmin';

export interface IUsersProps {}
interface EventReturn {
  result: string;
  message: string;
  value: string | null;
}
export const paging = {
  page: 0,
  limit: 10,
  sortBy: 'createdAt',
  sortType: 'asc',
  status: 'active',
};

type Status = 'active' | 'inactive' | 'blocked';

export default function Organizations(props: IUsersProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [page, setPage] = React.useState(0);
  const [filter, setFilter] = React.useState(paging);
  const [open, setOpen] = React.useState(false);
  const [idVerify, setIdVerify] = React.useState<string>();
  const [idCert, setIdCert] = React.useState<string[]>();
  const [typeConfirm, setTypeConfirm] = React.useState<'org' | 'cert' | null>(null);
  const { userDetail } = React.useContext(ApiContext);
  const navigate = useNavigate();
  const [{}, updateStatusUser] = useMutation(UPDATE_STATUS_USERS);
  const [{}, updateCertificate] = useMutation(UPDATE_CERTIFICATES);

  const [listCertIssuer, getListCertIssuer] = useQuery({
    query: GET_LIST_CERTIFICATES,
    variables: { page, issuer: userDetail?.id },
    requestPolicy: 'network-only',
  });

  const [{ data, error, fetching }, getListUser] = useQuery({
    query: GET_LIST_USER,
    variables: { page, outputRoleCode: 'Organization' },
    requestPolicy: 'network-only',
  });

  const dispatchChangePage = React.useCallback((newPage: any) => {
    navigate(`/organizations?page=${newPage}`);
  }, []);

  React.useEffect(() => {
    if (userDetail?.roleObj.code.toLocaleLowerCase() === 'organization') {
      getListCertIssuer();
    } else {
      getListUser();
    }
  }, [page]);

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
      let infos = new Array();
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
    if (typeConfirm === 'org') {
      const events = new Promise(async (resolve, reject) => {
        await api.tx.hierarchy
          .approveOrg(userDetail?.id, idVerify)
          .signAndSend(
            account.address,
            { signer: injector.signer },
            ({ status, events, dispatchError }) => {
              if (dispatchError) {
                if (dispatchError.isModule) {
                  // for module errors, we have the section indexed, lookup
                  const decoded = api.registry.findMetaError(dispatchError.asModule);
                  const { docs, name, section } = decoded;
                  const res = 'Error'.concat(':', section, '.', name);
                  //console.log(`${section}.${name}: ${docs.join(' ')}`);
                  resolve(res);
                } else {
                  // Other, CannotLookup, BadOrigin, no extra info
                  //console.log(dispatchError.toString());
                  resolve(dispatchError.toString());
                }
              } else {
                events.forEach(({ event, phase }) => {
                  const { data, method, section } = event;
                  //console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                  if (section == 'hierarchy') {
                    const res = 'Success'.concat(':', section, '.', method);
                    resolve(res);
                  }
                });
              }
            }
          );
      });
      enqueueSnackbar((await events) as string);
      const resBlockchain: string = (await events) as string;

      if (resBlockchain.toString().includes('Success')) {
        const updated = await updateStatusUser({ ids: idVerify, isVerified: true });
        if (updated.data) {
          getListUser();
        } else {
          alert('Update status user fail, please check again!');
        }
      }
    } else {
      const events = new Promise(async (resolve, _) => {
        await api.tx.certificate
          .validateCertificate(userDetail?.id, idCert?.toString())
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
                  let err: EventReturn = {
                    result: 'Error',
                    message: dispatchError.toString(),
                    value: null,
                  };
                  resolve(err);
                }
              } else {
                events.forEach(({ event }: any) => {
                  const { data, method, section } = event;
                  //console.log(`: ${section}.${method}`, data.toString());
                  if (section == 'certificate') {
                    let res: EventReturn = {
                      result: 'Success',
                      message: ''.concat(section, '.', method),
                      value: data.toHuman()[0],
                    };
                    //const res = 'Success'.concat(':',section,'.',method,':',data);
                    resolve(res);
                  }
                });
              }
            }
          );
      });
      const resBlockchain: EventReturn = (await events) as EventReturn;
      enqueueSnackbar(resBlockchain.message);

      if (resBlockchain?.result?.toString().includes('Success')) {
        const params = {
          ids: [idVerify],
          isVerified: true,
          blockchainId: resBlockchain?.value ?? '',
        };
        console.log('🚀 ~ file: index.tsx ~ line 213 ~ handleConfirm ~ idCert', idCert);
        const updated = await updateCertificate(params);
        if (updated.data) {
          getListCertIssuer();
        } else {
          alert('Update status user fail, please check again!');
        }
      }
    }
    setOpen(false);
  };
  const handleVerifi = (id: string, isVerified: boolean) => {
    if (isVerified) {
      alert("Can't cancel user verification");
      return;
    }
    setTypeConfirm('org');
    setIdVerify(id);
    setOpen(true);
  };
  const changePageCertificate = () => {};
  const handleVerifyCer = (idBC: string[], ids: string, isVerified: boolean) => {
    console.log('🚀 ~ file: index.tsx ~ line 235 ~ handleVerifyCer ~ ids', ids);
    if (isVerified) {
      alert("Can't cancel user verification");
      return;
    }
    setIdCert(idBC);
    setIdVerify(ids);
    setTypeConfirm('cert');
    setOpen(true);
  };

  return (
    <LayoutAdmin>
      {userDetail?.roleObj.code === 'superAdmin' || userDetail?.roleObj.code === 'SysMan' ? (
        <SysmanTable
          data={data?.users.rows ?? []}
          dispatchChangePage={dispatchChangePage}
          total={data?.users.count ?? 0}
          handleVerifi={handleVerifi}
          typeTable="org"
          headerCell={HEAD_CELL_SYSMAN as HeadCellSys[]}
        />
      ) : (
        <>
          {!!listCertIssuer.data?.Certs.rows.length && (
            <OrganizationsTable
              data={listCertIssuer.data?.Certs.rows ?? []}
              dispatchChangePage={changePageCertificate}
              handleVerifi={handleVerifyCer}
              headerCell={HEAD_CELL_ORGNA as HeadCellOrg[]}
              total={listCertIssuer.data?.Certs?.count}
              title="List Certificates Issuer"
            />
          )}
        </>
      )}
      <ModalConfirm
        title="Are you sure verify user?"
        handleConfirm={handleConfirm}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </LayoutAdmin>
  );
}
