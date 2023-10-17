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
  const headingText = 'A signature request is received';

  const extrinsicCall = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(
    extrinsicCall.callIndex,
  );

  const action = `${section}_${method}`;

  const dataURI = getLogo(payload.genesisHash);
  const svg = atob(dataURI.replace(/data:image\/svg\+xml;base64,/, ''));

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];
  let amount;

  const isNoArgsMethod = extrinsicCall.args?.length === 0 && 'noArgsMethods';

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      const to = `${extrinsicCall.args[0]}`;
      amount = String(extrinsicCall.args[1]);

      return panel([
        heading(headingText),
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
    case 'staking_bond':
      amount = `${extrinsicCall.args[0]}`;
      const payee = String(extrinsicCall.args[1]);

      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${method}`),
          divider(),
          text(`Amount: ${amountToHuman(amount, decimal)} ${token}`),
          divider(),
          text(`Payee: ${payee}`),
        ]),
      ]);
    case 'staking_nominate':
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${method}`),
          divider(),
          text(`Validators: ${extrinsicCall.args[0]}`),
        ]),
      ]);
    case 'staking_unbond':
    case 'staking_bondExtra':
      amount = `${extrinsicCall.args[0]}`;

      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${method}`),
          divider(),
          text(`Amount: ${amountToHuman(amount, decimal)} ${token}`),
        ]),
      ]);
    case 'staking_setPayee':
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${method}`),
          divider(),
          text(`Payee: ${extrinsicCall.args[0]}`),
        ]),
      ]);
    case 'nominationPools_join':
      amount = `${extrinsicCall.args[0]}`;
      const poolId = String(extrinsicCall.args[1]);

      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${method}`),
          divider(),
          text(`Amount: ${amountToHuman(amount, decimal)} ${token}`),
          divider(),
          text(`Pool Id: ${poolId}`),
        ]),
      ]);
    case 'noArgsMethods':
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Section: ${section}`),
          divider(),
          text(`Method: ${method}`),
          divider(),
        ]),
      ]);
    default:
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${section}_${method}`),
          divider(),
          text(`Call details:`),
          divider(),
          text(JSON.stringify(extrinsicCall)),
        ]),
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
