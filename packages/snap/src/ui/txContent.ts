/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import { copyable, panel, row, text } from '@metamask/snaps-sdk';
import { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../util/amountToHuman';
import { Decoded } from '../util/decodeTxMethod';
import { Chain } from '@polkadot/extension-chains/types';

export const txContent = (
  api: Chain,
  args: AnyTuple,
  action: string,
  decoded: Decoded,
  maybeReceiverIdentity: string | null,
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
        row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}** `)),
        text(
          `To: ${maybeReceiverIdentity ? `**${maybeReceiverIdentity}**` : ''} `,
        ),
        copyable(to),
      ];
    case 'staking_bond':
      amount = `${args[0]}`;
      const payee = String(args[1]);

      return [
        row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}** `)),
        row('Payee:', text(`**${payee}** `)),
      ];
    case 'staking_nominate':
      return [row('Validators:', text(`**${args[0]}**`))];

    case 'nominationPools_unbond':
    case 'staking_unbond':
    case 'staking_bondExtra':
      amount = `${args[action === 'nominationPools_unbond' ? 1 : 0]}`;

      return [
        row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}**`)),
      ];

    case 'staking_setPayee':
      return [row('Payee:', text(`**${args[0]}**`))];
    case 'nominationPools_join':
      amount = `${args[0]}`;
      const poolId = String(args[1]);

      return [
        panel([
          row(
            'Amount:',
            text(`**${amountToHuman(amount, decimal)} ${token}**`),
          ),
          row('Pool Id:', text(`**${poolId}** `)),
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

      return [row('Extra:', text(`**${extra}**`))];
    case 'noArgsMethods':
      return [];

    default:
      return [
        text(`_Details_: `),
        text(JSON.stringify(decodedArgs || args, null, 2)), // decodedArgs show the args' labels as well
      ];
  }
};
