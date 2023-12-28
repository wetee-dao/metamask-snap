import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';
import { getBalances } from '../util/getBalance';
import { getGenesisHash } from '../chains';
import { accountDemo } from '../ui/accountDemo';

export const getAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  showAccount(address); // This can be removed in favour of new home page

  return address;
};

/**
 * To show address(es) in some main chains format to users for a short while.
 *
 * @param address - The any chain address.
 */
async function showAccount(address: string) {
  const westendGenesisHash = getGenesisHash('westend'); // These will be changed when dropdown component will be available
  const westendBalances = await getBalances(westendGenesisHash, address);

  const polkadotGenesisHash = getGenesisHash('polkadot'); // These will be changed when dropdown component will be available
  const polkadotBalances = await getBalances(polkadotGenesisHash, address);

  const kusamaGenesisHash = getGenesisHash('kusama'); // These will be changed when dropdown component will be available
  const kusamaBalances = await getBalances(kusamaGenesisHash, address);

  const balances = {
    westendBalances,
    polkadotBalances,
    kusamaBalances,
  };

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: accountDemo(address, balances),
    },
  });
}
