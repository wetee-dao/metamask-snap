import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { Balance } from '@polkadot/types/interfaces';
import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';
import { getBalances } from '../util/getBalance';
import { getGenesisHash } from '../chains';

const AccountsDemo = (address: string) => {
  return panel([
    heading('Accounts'),
    divider(),
    panel([text('Metamask Address 1'), copyable(address), divider()]),
  ]);
};

export const createAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  const genesisHash = getGenesisHash('westend');
  // const balance = await getBalances(genesisHash, address);
  // console.log('balance:', balance)

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: AccountsDemo(address),
    },
  });

  return address;
};
