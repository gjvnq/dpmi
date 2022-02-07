import { BigNumber } from "@ethersproject/bignumber";
import { arrayify, hexlify } from "@ethersproject/bytes";

export class TokenId {
  private _bytes: Uint8Array;
  
  get bytes() { return this._bytes }
  get wire() { return BigNumber.from(this._bytes) }
  get uuid() { 
    const str = hexlify(this._bytes).substr(2, 32);
    const block1 = str.substr( 0,  8);
    const block2 = str.substr( 8,  4);
    const block3 = str.substr(12,  4);
    const block4 = str.substr(16,  4);
    const block5 = str.substr(20, 32);
    const ans = block1+"-"+block2+"-"+block3+"-"+block4+"-"+block5;
    return ans;
  }

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
    uuid = "0x"+uuid.replaceAll("-", "");
    return new TokenId(arrayify(uuid));
  }

  static from_bn(bn: BigNumber): TokenId {
    return new TokenId(arrayify(bn));
  }
}

export const NullTokenId = new TokenId([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);