import { Balance } from '@polkadot/types/interfaces';
import type { AccountData } from '@polkadot/types/interfaces/balances/types';
import { getApi } from './getApi';
import { getFormatted } from './getFormatted';

export type Balances = {
  total: Balance;
  transferable: Balance;
};
/**
 * To get the balance of an address
 *
 * @param genesisHash - teh genesisHash of the chain will be used to find an endpoint to use
 * @param address
 */
export async function getBalances(
  genesisHash: string,
  address: string,
): Promise<Balances> {
  const api = await getApi(genesisHash);
  const formatted = getFormatted(genesisHash, address);

  const balances = (await api.query.system.account(formatted)) as unknown as {
    data: AccountData;
  };
  console.log('balances:', balances.data);

  const transferable = api.createType('Balance', balances.data.free.sub(balances.data.frozen),) as Balance;
  const total = api.createType('Balance', balances.data.free.add(balances.data.reserved),) as Balance;

  return { total, transferable };
}
