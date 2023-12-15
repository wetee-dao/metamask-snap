import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';
import { Balances, getBalances } from '../util/getBalance';
import { getGenesisHash } from '../chains';
import { getFormatted } from '../util/getFormatted';

const AccountDemo = (address: string, balances: Balances) => {
  const polkadotGenesishash = getGenesisHash('polkadot');
  const addressOnPolkadot = getFormatted(polkadotGenesishash, address);

  const kusamaGenesishash = getGenesisHash('kusama');
  const addressOnPKusama = getFormatted(kusamaGenesishash, address);

  return panel([
    heading('Your Account on Different Chains'),
    divider(),
    panel([
      text('Westend'),
      copyable(address),
      text(`Total Balance: **${balances.total.toHuman()}**`),
      text(`Transferable: **${balances.transferable.toHuman()}**`),
      divider(),
    ]),
    panel([text('Polkadot'), copyable(addressOnPolkadot), divider()]),
    panel([text('Kusama'), copyable(addressOnPKusama)]),
  ]);
};

export const getAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  showAddress(address);

  return address;
};

/**
 * To show address(es) in some main chains format to users for a short while
 *
 * @param address - the any chain address
 */
async function showAddress(address: string) {
  const genesisHash = getGenesisHash('westend'); // For testing purposes
  const balances = await getBalances(genesisHash, address);

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: AccountDemo(address, balances),
    },
  });
}
