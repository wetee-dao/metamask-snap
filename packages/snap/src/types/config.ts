export type UnitConfiguration = {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
};

export type SnapConfig = {
  chainName: string;
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
};
