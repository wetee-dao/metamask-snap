/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import {
  copyable,
  divider,
  heading,
  image,
  panel,
  text,
} from '@metamask/snaps-ui';
import { ApiPromise } from '@polkadot/api';
import { Compact, u128 } from '@polkadot/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { BN } from '@polkadot/util';
import getLogo from '../util/getLogo';
import { convertToSVG } from './createAddress';

const FLOATING_POINT_DIGIT = 4;

export function fixFloatingPoint(
  _number: number | string,
  decimalDigit = FLOATING_POINT_DIGIT,
  commify?: boolean,
): string {
  // make number positive if it is negative
  const sNumber =
    Number(_number) < 0 ? String(-Number(_number)) : String(_number);

  const dotIndex = sNumber.indexOf('.');

  if (dotIndex < 0) {
    return sNumber;
  }

  let integerDigits = sNumber.slice(0, dotIndex);

  integerDigits = commify
    ? Number(integerDigits).toLocaleString()
    : integerDigits;
  const fractionalDigits = sNumber.slice(dotIndex, dotIndex + decimalDigit + 1);

  return integerDigits + fractionalDigits;
}

export function amountToHuman(
  _amount: string | number | BN | bigint | Compact<u128> | undefined,
  _decimals: number | undefined,
  decimalDigits?: number,
  commify?: boolean,
): string {
  if (!_amount || !_decimals) {
    return '';
  }

  // eslint-disable-next-line no-param-reassign
  _amount = String(_amount).replace(/,/g, '');

  const x = 10 ** _decimals;

  return fixFloatingPoint(Number(_amount) / x, decimalDigits, commify);
}

const confirmation = (api: ApiPromise, payload: SignerPayloadJSON) => {
  const extrinsicCall = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(
    extrinsicCall.callIndex,
  );

  switch (method) {
    case 'transfer':
    case 'transferKeepAlive':
    case 'transferAll':
      const to = `${extrinsicCall.args[0]}`;
      const amount = String(extrinsicCall.args[1]);
      const decimal = api.registry.chainDecimals[0];
      const token = api.registry.chainTokens[0];

      const dataURI = getLogo(payload.genesisHash);
      const svg = atob(dataURI.replace(/data:image\/svg\+xml;base64,/, ''));

      return panel([
        heading('A signature request is received'),
        divider(),
        panel([
          // image(svg),
          text(`Method: ${method}`),
          divider(),
          copyable(`To: ${to}`),
          divider(),
          text(`Amount: ${amountToHuman(amount, decimal)} ${token}`),
        ]),
      ]);
    default:
      return panel([
        text('A signature request is received'),
        text('You requested to sing this transaction:'),
        text(JSON.stringify(extrinsicCall)),
      ]);
  }
};

export async function showConfirmTx(
  api: ApiPromise,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: confirmation(api, payload),
      type: 'confirmation',
    },
  });

  return userResponse;
}
