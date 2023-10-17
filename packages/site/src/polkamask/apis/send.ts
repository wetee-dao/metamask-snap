import type { AccountId, ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

export async function send(
  from: string | AccountId,
  api: ApiPromise,
  ptx: SubmittableExtrinsic<'promise', ISubmittableResult>,
  payload: ExtrinsicPayload,
  signature: HexString,
): Promise<TxResult> {
  return new Promise((resolve) => {
    console.log('sending a tx ...');

    ptx.addSignature(from, signature, payload);

    // eslint-disable-next-line no-void
    void ptx
      .send(async (result) => {
        let success = true;
        let failureText = '';
        const parsedRes = JSON.parse(JSON.stringify(result));
        const event = new CustomEvent('transactionState', {
          detail: parsedRes.status,
        });

        window.dispatchEvent(event);
        console.log(parsedRes);

        if (result.dispatchError) {
          if (result.dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(
              result.dispatchError.asModule,
            );
            const { docs, name, section } = decoded;

            success = false;
            failureText = `${docs.join(' ')}`;

            console.log(
              `dispatchError module: ${section}.${name}: ${docs.join(' ')}`,
            );
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            console.log(
              `dispatchError other reason: ${result.dispatchError.toString()}`,
            );
          }
        }

        if (result.status.isFinalized || result.status.isInBlock) {
          console.log('Tx. Status: ', result.status);
          const hash = result.status.isFinalized
            ? result.status.asFinalized
            : result.status.asInBlock;

          const signedBlock = await api.rpc.chain.getBlock(hash);
          const blockNumber = signedBlock.block.header.number;
          const txHash = result.txHash.toString();

          const fee = undefined;

          console.log(`Transaction success:${success}`);

          resolve({
            block: Number(blockNumber),
            failureText,
            fee,
            success,
            txHash,
          });
        }
      })
      .catch((e) => {
        console.log('catch error', e);
        resolve({
          block: 0,
          failureText: String(e),
          fee: '',
          success: false,
          txHash: '',
        });
      });
  });
}
