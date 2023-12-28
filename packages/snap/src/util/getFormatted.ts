import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { getChain } from '../chains';

/**
 * To get the formatted address of an address.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 * @param address - The substrate format of an address.
 * @returns The formatted address.
 */
export function getFormatted(genesisHash: string, address: string): string {
  const { prefix } = getChain(genesisHash as string);
  const publicKey = decodeAddress(address);

  return encodeAddress(publicKey, prefix);
}
