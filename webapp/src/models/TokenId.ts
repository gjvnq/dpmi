import { BigNumber } from "@ethersproject/bignumber";
import { arrayify } from "@ethersproject/bytes";
import { parse as uuidParse, stringify as uuidStringify, NIL as NIL_UUID } from 'uuid';

export class TokenId {
  private _bytes: Uint8Array;
  
  get bytes() { return this._bytes }
  get uuid() { return uuidStringify(this._bytes) }
  get wire() { return BigNumber.from(this._bytes) }

  toString() {
    return this.uuid;
  }

  constructor(raw: ArrayLike<number>) {
    if (raw.length != 16) {
      throw "UUID must be 16 bytes long";
    }
    this._bytes = Uint8Array.from(raw);
  }

  static parse(uuid: string): TokenId {
    return new TokenId(uuidParse(uuid));
  }

  static from_bn(bn: BigNumber): TokenId {
    return new TokenId(arrayify(bn));
  }
}

export const NullTokenId = new TokenId([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);