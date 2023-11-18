import { Balance } from '@polkadot/types/interfaces';
import { getApi } from './getApi';
import { getFormatted } from './getFormatted';

/**
 * To get the balance of an address
 *
 * @param genesisHash - teh genesisHash of the chain will be used to find an endpoint to use
 * @param address
 */
export async function getBalances(
  genesisHash: string,
  address: string,
): Promise<Balance> {
  const api = await getApi(genesisHash);
  console.log('getBalances api:', api)
  const formatted = getFormatted(genesisHash, address);
  console.log('formatted:', formatted)

  const balances = await api.derive.balances.all(formatted);

  return balances.availableBalance;
}
