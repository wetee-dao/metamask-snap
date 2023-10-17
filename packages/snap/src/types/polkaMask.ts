import type { SignerPayloadRaw } from '@polkadot/types/types/extrinsic';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import {
  getAddress,
  setConfiguration,
  signPayloadJSON,
  signPayloadRaw,
} from '../del-extension/methods';
import type { SnapConfig } from './config';

export type SnapApi = {
  getAddress(): Promise<string>;
  setConfiguration(configuration: SnapConfig): Promise<void>;
  signPayloadJSON(payload: SignerPayloadJSON): Promise<string>;
  signPayloadRaw(payload: SignerPayloadRaw): Promise<string>;
};

export class PolkaMask {
  protected readonly config: SnapConfig;

  protected readonly pluginOrigin: string; //url to package.json

  protected readonly snapId: string; //pluginOrigin prefixed with wallet_plugin_

  public constructor(pluginOrigin: string, config: SnapConfig) {
    this.pluginOrigin = pluginOrigin;
    this.snapId = `${this.pluginOrigin}`;
    this.config = config || { networkName: 'westend' };
  }

  public getMetamaskSnapApi = (): SnapApi => {
    return {
      getAddress: getAddress.bind(this),
      setConfiguration: setConfiguration.bind(this),
      signPayloadJSON: signPayloadJSON.bind(this),
      signPayloadRaw: signPayloadRaw.bind(this),
    };
  };
}
