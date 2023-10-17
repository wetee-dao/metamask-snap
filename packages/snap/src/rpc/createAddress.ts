import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';

const AccountsDemo = (addr: string) => {
  return panel([
    heading('Accounts'),
    divider(),
    panel([text('Metamask Address 1'), copyable(addr), divider()]),
  ]);
};

export const createAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const _address = account.address;

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: AccountsDemo(_address),
    },
  });

  return _address;
};
