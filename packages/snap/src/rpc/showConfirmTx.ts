/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import {
  copyable,
  divider,
  heading,
  image,
  panel,
  text,
} from '@metamask/snaps-sdk';
import { ApiPromise } from '@polkadot/api';
import { Compact, u128 } from '@polkadot/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { BN } from '@polkadot/util';
import getLogo from '../util/getLogo';

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

function formatCamelCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/\b(\w)/, (char) => char.toUpperCase()); // Capitalize the first letter
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

const confirmation = (
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const action = `${section}_${method}`;

  const dataURI = getLogo(payload.genesisHash);
  const svgString = atob(dataURI.replace(/data:image\/svg\+xml;base64,/, ''));

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];
  let amount;

  const isNoArgsMethod = args?.length === 0 && 'noArgsMethods';

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      const to = `${args[0]}`;
      amount = String(args[1]);

      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${formatCamelCase(method)}`),
          divider(),
          text(`To:`),
          copyable(to),
          divider(),
          text(`Amount: ${amountToHuman(amount, decimal)} ${token}`),
          divider(),
          panel([text('Chain logo:'), image(svgString)]),
        ]),
      ]);
    case 'staking_bond':
      amount = `${args[0]}`;
      const payee = String(args[1]);

      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${formatCamelCase(method)}`),
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
          text(`Validators: ${args[0]}`),
        ]),
      ]);
    case 'nominationPools_unbond':
    case 'staking_unbond':
    case 'staking_bondExtra':
      amount = `${args[action === 'nominationPools_unbond' ? 1 : 0]}`;

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
          text(`Payee: ${args[0]}`),
        ]),
      ]);
    case 'nominationPools_join':
      amount = `${args[0]}`;
      const poolId = String(args[1]);

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
    case 'nominationPools_bondExtra':
      let extra = String(args[0]);
      if (extra === 'Rewards') {
        extra = 'Rewards';
      } else {
        const { freeBalance } = JSON.parse(extra);
        extra = `${amountToHuman(freeBalance, decimal)} ${token}`;
      }

      return panel([
        heading(headingText),
        divider(),
        panel([text(`Method: ${method}`), divider(), text(`Extra: ${extra}`)]),
      ]);
    case 'noArgsMethods':
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Section: ${section}`),
          divider(),
          text(`Method: ${method}`),
        ]),
      ]);
    default:
      return panel([
        heading(headingText),
        divider(),
        panel([
          text(`Method: ${action}`),
          divider(),
          text(`Args:`),
          divider(),
          text(JSON.stringify(args, null, 2)),
        ]),
      ]);
  }
};

export async function showConfirmTx(
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: confirmation(api, origin, payload),
      type: 'confirmation',
    },
  });

  return userResponse;
}
