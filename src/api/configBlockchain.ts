import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

const apiBlockchain = async () => {
  const provider = new WsProvider(process.env.REACT_APP_API_BC || '');
  const api = await ApiPromise.create({ provider });
  const allInjected = await web3Enable(process.env.REACT_APP_BC_NAME || '');
  const allAccounts = await web3Accounts();
  const account = allAccounts[0];
  const injector = await web3FromAddress(account.address);
  return { provider, api, allInjected, allAccounts, account, injector };
};
export default apiBlockchain;
