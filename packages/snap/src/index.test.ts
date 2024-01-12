/* eslint-disable jest/no-conditional-expect */
/* eslint-disable prettier/prettier */
/* eslint-disable jest/no-restricted-matchers */
/* eslint-disable jest/prefer-strict-equal */

import { installSnap } from '@metamask/snaps-jest';
import { copyable, divider, heading, panel, text, row, RowVariant } from '@metamask/snaps-sdk';
import { Json, JsonRpcParams } from '@metamask/utils';
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { ApiPromise, HttpProvider } from '@polkadot/api';
import isValidAddress from '../../dapp/src/util/isValidAddress';
import { buildPayload } from '../../dapp/src/util/buildPayload';
import { getGenesisHash } from './chains';
import { getFormatted } from './util/getFormatted';
import { formatCamelCase } from './util/formatCamelCase';

const getApi = async () => {
  const httpEndpointURL = 'https://wnd-rpc.stakeworld.io';
  const httpProvider = new HttpProvider(httpEndpointURL);

  const api = await ApiPromise.create({ provider: httpProvider });

  return api;
}

jest.setTimeout(200000);

const isValidSignature = (signedMessage: string | Uint8Array, signature: string, address: string | Uint8Array) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

const origin = 'Jest Test';
const sampleWestendAccountAddress = '5Cc8FwTx2nGbM26BdJqdseQBF8C1JeF1tbiabwPHa2UhB4fv';
let metamaskAccountAddr: string | undefined;

describe('onRpcRequest', () => {
  beforeAll(async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'getAddress',
      origin
    });

    if ('result' in response.response) {
      metamaskAccountAddr = response.response.result?.toString();
    }

    await close();
  });

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
    let samplePolkadotAccountAddress = '';
    let sampleKusamaAccountAddress = '';

    const { request, close } = await installSnap();

    const response = request({
      method: 'getAddress',
      origin
    });

    const ui = await response.getInterface({ timeout: 60000 });

    let accountAddr: string | undefined;

    const returnedValue = await response;

    if ('result' in returnedValue.response) {
      accountAddr = returnedValue.response.result?.toString();
      samplePolkadotAccountAddress = getFormatted(getGenesisHash('polkadot'), accountAddr ?? '');
      sampleKusamaAccountAddress = getFormatted(getGenesisHash('kusama'), accountAddr ?? '');
    } else {
      accountAddr = undefined;
    }

    const expectedInterface = (panel([
      heading('Your Account on Different Chains'),
      divider(),
      panel([
        text('**Polkadot**'),
        copyable(samplePolkadotAccountAddress),
        text(
          `Transferable: **0** / 0`,
        ),
        divider(),
      ]),
      panel([
        text('**Kusama**'),
        copyable(sampleKusamaAccountAddress),
        text(
          `Transferable: **0** / 0`,
        ),
        divider(),
      ]),
      panel([
        text('**Westend**'),
        copyable(accountAddr),
        text(
          `Transferable: **0** / 0`,
        ),
      ]),
    ]));

    expect(response).toBeTruthy();
    expect(accountAddr).toBeTruthy();
    expect(isValidAddress(accountAddr)).toBe(true);

    expect(ui.type).toBe('alert');
    samplePolkadotAccountAddress && sampleKusamaAccountAddress && expect(ui.content).toEqual(expectedInterface);

    await ui.ok();

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
        address: sampleWestendAccountAddress
      }
    };

    const expectedInterface = (
      panel([
        heading(`A signature request is received from ${origin}`),
        divider(),
        text('Data to sign:'),
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

    const returnedValue = await response;

    if ('result' in returnedValue.response) {
      const signature = returnedValue.response.result;
      const sign = JSON.parse(JSON.stringify(signature));

      expect(isValidSignature(signRawParams.raw.data, sign.signature, sampleWestendAccountAddress)).toBeTruthy();
    }

    await close();
  });

  it('"signJSON" RPC request method', async () => {
    const api = await getApi();

    const params = [sampleWestendAccountAddress, '5000000000000'];
    const tx = api.tx.balances.transferKeepAlive(...params);
    const fee = await (await tx.paymentInfo(sampleWestendAccountAddress)).partialFee;
    const payload = await buildPayload(api, tx, sampleWestendAccountAddress);

    const expectedInterface = (
      panel([
        heading(`Transaction Approval Request from ${origin}`),
        divider(),
        row('Action: ', text(`**${formatCamelCase('balances')}** (**${formatCamelCase('transferKeepAlive')}**)`)),
        divider(),
        row('Amount:', text(`**5 WND** `)),
        text(
          'To:  ',
        ),
        copyable(metamaskAccountAddr),
        divider(),
        row('Estimated Fee:', text(`**${fee.toHuman()}**`)),
        divider(),
        row('Chain Name:', text(`**${formatCamelCase('westend')}**`)),
        divider(),
        row(
          'More info:',
          text('**See [Pallet::transfer_keep_alive].**'),
          RowVariant.Warning,
        )
      ])
    );

    const { request, close } = await installSnap();

    const response = request({
      method: 'signJSON',
      origin,
      params: { payload: payload as unknown as JsonRpcParams }
    });

    const ui = await response.getInterface({ timeout: 120000 });
    expect(ui.type).toBe('confirmation');
    await ui.ok();

    // const returnedValue = await response;

    // if ('result' in returnedValue.response) {
    //   const signature = returnedValue.response.result;
    //   const sign = JSON.parse(JSON.stringify(signature));
    //   const pay = JSON.stringify(payload);

    //   expect(isValidSignature(payload as unknown as string, sign.signature, sampleWestendAccountAddress)).toBeTruthy();
    // }

    expect(ui.content).toEqual(expectedInterface);

    await close();
  });

  it('"signJSON" RPC request method invalid payload', async () => {
    const { request, close } = await installSnap();

    const response = request({
      method: 'signJSON',
      origin,
      params: { payload: {} }
    });

    const getUI = async () => {
      try {
        await response.getInterface({ timeout: 20000 });

        return true;
      } catch (error) {
        return false;
      }
    };

    expect(await getUI()).toBeFalsy();

    const returnedValue = await response;

    if ('result' in returnedValue.response) {
      expect(returnedValue.response.result).toBeFalsy();
    }

    await close();
  });
});
