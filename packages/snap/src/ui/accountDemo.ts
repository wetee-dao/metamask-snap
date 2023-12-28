import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import { Balances } from '../util/getBalance';
import { getGenesisHash } from '../chains';
import { getFormatted } from '../util/getFormatted';

type tokenBalance = Record<string, Balances>;

export const accountDemo = (address: string, balances: tokenBalance) => {
  const polkadotGenesishash = getGenesisHash('polkadot');
  const addressOnPolkadot = getFormatted(polkadotGenesishash, address);

  const kusamaGenesishash = getGenesisHash('kusama');
  const addressOnPKusama = getFormatted(kusamaGenesishash, address);

  const { polkadotBalances, kusamaBalances, westendBalances } = balances;

  return panel([
    heading('Your Account on Different Chains'),
    divider(),
    panel([
      text('**Polkadot**'),
      copyable(addressOnPolkadot),
      text(
        `Transferable: **${polkadotBalances.transferable
          .toHuman()
          .replace(polkadotBalances.token, '')
          .trim()}** / ${polkadotBalances.total.toHuman()}`,
      ),
      divider(),
    ]),
    panel([
      text('**Kusama**'),
      copyable(addressOnPKusama),
      text(
        `Transferable: **${kusamaBalances.transferable
          .toHuman()
          .replace(kusamaBalances.token, '')
          .trim()}** / ${kusamaBalances.total.toHuman(true)}`,
      ),
      divider(),
    ]),
    panel([
      text('**Westend**'),
      copyable(address),
      text(
        `Transferable: **${westendBalances.transferable
          .toHuman()
          .replace(westendBalances.token, '')
          .trim()}** / ${westendBalances.total.toHuman(true)}`,
      ),
    ]),
  ]);
};
