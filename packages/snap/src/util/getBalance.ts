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
  console.log('getBalances api:', api);
  const formatted = getFormatted(genesisHash, address);
  console.log('formatted:', formatted);

  const balances = await api.derive.balances.all(formatted);
  // const balances = await fetchBalance(formatted, 'https://westend-rpc.polkadot.io');
  console.log('balances:', balances);

  return balances.availableBalance;
}

/**
 *
 */
async function fetchBalance(formatted: string, endpoint: string) {
  return new Promise((resolve) =>
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'system.account',
        params: [formatted],
        id: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data.result.data.free:', data.result.data.free);
        resolve(data.result.data.free);
      }),
  );
}
