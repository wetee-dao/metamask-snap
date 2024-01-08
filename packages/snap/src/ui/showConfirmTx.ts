/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import { RowVariant, divider, heading, image, panel, row, text } from '@metamask/snaps-sdk';
import { ApiPromise } from '@polkadot/api';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';
import { Balance } from '@polkadot/types/interfaces';
import getLogo from '../util/getLogo';
import getChainName from '../util/getChainName';
import { formatCamelCase } from '../util/formatCamelCase';
import { getIdentity } from '../util/getIdentity';
import { Decoded, getDecoded } from '../rpc';
import { txContent } from './txContent';

const EMPTY_LOGO = `<svg width="100" height="100">
<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

const transactionContent = (
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
  partialFee: Balance,
  decoded: Decoded,
  maybeReceiverIdentity: string | null,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const action = `${section}_${method}`;
  const chainName = getChainName(payload.genesisHash);

  const dataURI = getLogo(payload.genesisHash);
  const maybeSvgString = atob(
    dataURI.replace(/data:image\/svg\+xml;base64,/u, ''),
  );
  const indexOfFirstSvgTag = maybeSvgString.indexOf('<svg');
  let chainLogoSvg = EMPTY_LOGO;
  if (indexOfFirstSvgTag !== -1) {
    chainLogoSvg = maybeSvgString.substring(indexOfFirstSvgTag);
  }

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
    row('Estimated Fee:', text(`**${partialFee.toHuman()}**`)),
    divider(),
    row('Chain Name:', text(`**${formatCamelCase(chainName)}**`)),
    // divider(),
    // row('Chain Logo:', image(chainLogoSvg)), // uncomment when image size adjustment will be enable by Metamask
    divider(),
    row(
      'More info:',
      text(`**${decoded.docs || 'Update metadata to view this!'}**`),
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
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {
  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const { partialFee } = await api.tx[section][method](...args).paymentInfo(
    payload.address,
  );

  const { genesisHash, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    payload.method,
    bnToBn(specVersion),
  );

  let maybeReceiverIdentity = null;
  if (['transfer', 'transferKeepAlive', 'transferAll'].includes(method)) {
    maybeReceiverIdentity = await getIdentity(api, String(args[0]));
  }

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: transactionContent(
        api,
        origin,
        payload,
        partialFee,
        decoded,
        maybeReceiverIdentity,
      ),
      type: 'confirmation',
    },
  });

  return userResponse;
}
