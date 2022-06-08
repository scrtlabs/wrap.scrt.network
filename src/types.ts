export enum Tokens {
  scrt = "scrt",
  atom = "atom",
  luna = "luna",
  ust = "ust",
  osmo = "osmo",
  dvpn = "dvpn",
  huahua = "huahua",
  juno = "juno",
  akt = "akt",
}

export interface TokenOptions {
  title: Tokens,
  src: string
}

type ValueOf<T> = T[keyof T];

export type mergeStateType = (data: keyof TokenOptions | Record<keyof TokenOptions, ValueOf<TokenOptions>>, value?: any) => void