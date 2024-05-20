/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import {
  RowVariant,
  divider,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';
import { formatCamelCase } from '../util/formatCamelCase';
import { Decoded, getDecoded } from '../rpc';
import { txContent } from './txContent';
import { Chain } from '@polkadot/extension-chains/types';

const EMPTY_LOGO = `<svg width="100" height="100">
<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

const transactionContent = (
  api: Chain,
  origin: string,
  payload: SignerPayloadJSON,
  decoded: Decoded,
  maybeReceiverIdentity: string | null,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  const { args, callIndex } = api.registry.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);
  const action = `${section}_${method}`;
  const chainName = api.name;

  const header = [
    heading(headingText),
    divider(),
    row(
      'Action: ',
      text(`**${formatCamelCase(section)}** (**${formatCamelCase(method)}**)`),
    ),
    divider(),
  ];

  const footer = [
    divider(),
    divider(),
    row('Chain Name:', text(`**${formatCamelCase(chainName)}**`)),
    // divider(),
    // row('Chain Logo:', image(chainLogoSvg)), // uncomment when image size adjustment will be enabled by Metamask
    divider(),
    row(
      'More info:',
      text(`**${decoded.docs || 'Update metadata to view this!'}**`),
      RowVariant.Default,
    ),
    row(
      'Warning:',
      text(`${'proceed only if you understand the details above!'}`),
      RowVariant.Warning,
    ),
  ];

  return panel([
    ...header,
    ...txContent(api, args, action, decoded, maybeReceiverIdentity),
    ...footer,
  ]);
};

export async function showConfirmTx(
  api: Chain,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {
  const { genesisHash, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    payload.method,
    bnToBn(specVersion),
  );

  let maybeReceiverIdentity = null;

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: transactionContent(
        api,
        origin,
        payload,
        decoded,
        maybeReceiverIdentity,
      ),
      type: 'confirmation',
    },
  });

  return userResponse;
}
