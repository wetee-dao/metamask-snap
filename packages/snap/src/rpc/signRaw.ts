import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { SignerPayloadRaw } from '@polkadot/types/types';

const showConfirm = (data: string) => {
  return panel([
    heading('A signature request is received'),
    divider(),
    panel([copyable(data), text(data), divider()]),
  ]);
};

export const signRaw = async (raw: SignerPayloadRaw): Promise<string> => {
  const { address, data } = raw;
  const isConfirmed = showConfirm(data);

  if (!isConfirmed) {
    throw new Error('User rejects the signing!');
  }

  // TODO

  return 'signature';
};
