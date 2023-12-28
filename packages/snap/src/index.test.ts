/* eslint-disable prettier/prettier */
/* eslint-disable jest/no-restricted-matchers */
/* eslint-disable jest/prefer-strict-equal */

import { installSnap } from '@metamask/snaps-jest';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import { Json } from '@metamask/utils';
import { hexToU8a, isHex } from '@polkadot/util';
// import { expect } from '@jest/globals';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

jest.setTimeout(60000);

/**
 * Verifies the validity of a substrate-based address.
 *
 * @param _address - The address to be checked for being a valid address.
 * @returns boolean - True if the address is a valid substrate address.
 */
function isValidAddress(_address: string | undefined): boolean {
  try {
    encodeAddress(
      isHex(_address)
        ? hexToU8a(_address)
        : decodeAddress(_address)
    );

    return true;
  } catch (error) {
    return false;
  }
}

const origin = 'Jest Test';
const sampleAccountAddress = '5GHSA3fJCRqLZhwgo6ezTjjQgBrBoLWTbznWPunH6wEzJ7vm';

describe('onRpcRequest', () => {
  it('throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found in the snap onRpcRequest.',
      stack: expect.any(String),
    });

    await close();
  });

  it('"getAddress" RPC request method', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'getAddress',
      origin
    });

    let accountAddr: string | undefined;

    if ('result' in response.response) {
      accountAddr = response.response.result?.toString();
    } else {
      accountAddr = undefined;
    }

    expect(response).toBeTruthy();
    expect(accountAddr).toBeTruthy();
    expect(isValidAddress(accountAddr)).toBe(true);

    await close();
  });

  it('"getMetadataList" RPC request method, when the list is empty!', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'getMetadataList',
      origin
    });

    let returnedResult: Json | undefined;
    const expectedResult = [{ "genesisHash": "0x", "specVersion": 0 }];

    if ('result' in response.response && response.response.result) {
      returnedResult = response.response.result;
    } else {
      returnedResult = undefined;
    }

    expect(response).toBeTruthy();
    expect(returnedResult).toBeTruthy();
    expect(returnedResult).toEqual(expectedResult);

    await close();
  });

  it('"signRaw" RPC request method', async () => {
    const signRawParams = {
      raw: {
        data: 'Sign me!',
        address: sampleAccountAddress
      }
    };

    const expectedInterface = (
      panel([
        heading(`A signature request is received from ${origin}`),
        divider(),
        text('Data to sign:'),
        divider(),
        panel([copyable(signRawParams.raw.data), divider()]),
      ])
    );

    const { request, close } = await installSnap();

    const response = request({
      method: 'signRaw',
      origin,
      params: signRawParams
    });

    const ui = await response.getInterface();
    expect(ui.type).toBe('confirmation');
    expect(ui).toRender(expectedInterface);
    await ui.ok();

    const result = await response;
    expect(result).toBeTruthy();

    await close();
  });
});
