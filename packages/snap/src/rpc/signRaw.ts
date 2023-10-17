/* eslint-disable jsdoc/require-jsdoc */
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
import { isAscii, u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { getKeyPair } from '../util/getKeyPair';

const confirmation = (hexString: string) => {
  const data = isAscii(hexString)
    ? u8aToString(u8aUnwrapBytes(hexString))
    : hexString;

  return panel([
    heading('A signature request is received'),
    divider(),
    text('Data to sign:'),
    divider(),
    panel([copyable(data), divider()]),
  ]);
};

async function showConfirmSignRaw(
  data: string,
): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: confirmation(data),
      type: 'confirmation',
    },
  });

  return userResponse;
}

export const signRaw = async (raw: SignerPayloadRaw): Promise<SignerResult> => {
  const { address, data } = raw;
  const isConfirmed = await showConfirmSignRaw(data);

  if (!isConfirmed) {
    throw new Error('User declined the signing request.');
  }
  const keypair = await getKeyPair();

  const signature = keypair.sign(data);
  const hexSignature = Buffer.from(signature).toString('hex');

  return { id: 1, signature: `0x${hexSignature}` };
};
