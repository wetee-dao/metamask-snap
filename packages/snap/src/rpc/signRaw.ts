/* eslint-disable jsdoc/require-jsdoc */
import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import { SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
import { isAscii, u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { getKeyPair } from '../util/getKeyPair';

const contentSignRaw = (origin: string, hexString: string) => {
  const data = isAscii(hexString)
    ? u8aToString(u8aUnwrapBytes(hexString))
    : hexString;

  return panel([
    heading(`A signature request is received from ${origin}`),
    divider(),
    text('Data to sign:'),
    panel([copyable(data), divider()]),
  ]);
};

async function showConfirmSignRaw(
  origin: string,
  data: string,
): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: contentSignRaw(origin, data),
      type: 'confirmation',
    },
  });

  return userResponse;
}

export const signRaw = async (
  origin: string,
  raw: SignerPayloadRaw,
): Promise<SignerResult> => {
  const { address, data } = raw; // polkadot js sends the address of the requester along with the sign request
  const isConfirmed = await showConfirmSignRaw(origin, data);

  if (!isConfirmed) {
    throw new Error(`User ${address} declined the signing request.`);
  }
  const keypair = await getKeyPair();

  const signature = keypair.sign(data);
  const hexSignature = Buffer.from(signature).toString('hex');

  return { id: 1, signature: `0x${hexSignature}` }; // polkadot js apps, assigns id to its requests
};
