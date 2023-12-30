import { getGenesisHash } from '../chains';
import { getBalances } from './getBalance';

/**
 * To get balances on the tree default chains, Polkadot, Kusama, and Westend.
 *
 * @param address - The any chain address.
 */
export async function getDefaultTokenBalances(address: string) {
  const westendGenesisHash = getGenesisHash('westend'); // These will be changed when dropdown component will be available
  const westendBalances = await getBalances(westendGenesisHash, address);

  const polkadotGenesisHash = getGenesisHash('polkadot'); // These will be changed when dropdown component will be available
  const polkadotBalances = await getBalances(polkadotGenesisHash, address);

  const kusamaGenesisHash = getGenesisHash('kusama'); // These will be changed when dropdown component will be available
  const kusamaBalances = await getBalances(kusamaGenesisHash, address);

  return {
    westendBalances,
    polkadotBalances,
    kusamaBalances,
  };
}
