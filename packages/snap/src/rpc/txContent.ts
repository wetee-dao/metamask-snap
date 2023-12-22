/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import { copyable, divider, panel, text } from '@metamask/snaps-sdk';
import { ApiPromise } from '@polkadot/api';
import { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../util/amountToHuman';
import { Decoded } from './decodeTxMethod';

export const txContent = (
  api: ApiPromise,
  args: AnyTuple,
  action: string,
  decoded: Decoded,
  maybeReceiverIdentity: string,
): any[] => {
  let amount;
  const isNoArgsMethod = args?.length === 0 && 'noArgsMethods';
  const decodedArgs = decoded?.args;

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      const to = `${args[0]}`;
      amount = String(args[1]);

      return [
        text(`_To_: **${maybeReceiverIdentity}**`),
        copyable(to),
        divider(),
        text(`_Amount_: **${amountToHuman(amount, decimal)} ${token}**`),
      ];
    case 'staking_bond':
      amount = `${args[0]}`;
      const payee = String(args[1]);

      return [
        text(`_Amount_: **${amountToHuman(amount, decimal)} ${token}**`),
        divider(),
        text(`_Payee_: ${payee}`),
      ];
    case 'staking_nominate':
      return [text(`_Validators_: **${args[0]}**`)];

    case 'nominationPools_unbond':
    case 'staking_unbond':
    case 'staking_bondExtra':
      amount = `${args[action === 'nominationPools_unbond' ? 1 : 0]}`;

      return [text(`_Amount_: **${amountToHuman(amount, decimal)} ${token}**`)];

    case 'staking_setPayee':
      return [text(`_Payee_: **${args[0]}**`)];
    case 'nominationPools_join':
      amount = `${args[0]}`;
      const poolId = String(args[1]);

      return [
        panel([
          text(`_Amount_: **${amountToHuman(amount, decimal)} ${token}**`),
          divider(),
          text(`_Pool Id_: **${poolId}**`),
        ]),
      ];
    case 'nominationPools_bondExtra':
      let extra = String(args[0]);
      if (extra === 'Rewards') {
        extra = 'Rewards';
      } else {
        const { freeBalance } = JSON.parse(extra);
        extra = `${amountToHuman(freeBalance, decimal)} ${token}`;
      }

      return [text(`_Extra_: **${extra}**`)];
    case 'noArgsMethods':
      return [];
    default:
      return [
        text(`_Details_:`),
        text(JSON.stringify(decodedArgs || args, null, 2)), // decodedArgs show the args' labels as well
      ];
  }
};
