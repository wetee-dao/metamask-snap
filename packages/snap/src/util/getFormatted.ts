import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { getChain } from '../chains';

/**
 * To get the formatted address of an address
 *
 * @param genesisHash - the genesisHash of the chain will be used to find an endpoint to use
 * @param address - the substrate format of an address
 * @returns - the formatted address
 */
export function getFormatted(genesisHash: string, address: string): string {
  console.log('getFormatted genesisHash:', genesisHash)

  const { prefix } = getChain(genesisHash as string);
  console.log('getFormatted prefix:', prefix)

  const publicKey = decodeAddress(address);
  return encodeAddress(publicKey, prefix);
}
