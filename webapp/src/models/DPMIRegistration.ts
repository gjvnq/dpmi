import { v4 as uuidv4 } from 'uuid';
import { Moralis } from "moralis/types";
import MoralisConfig from "../config/moralis";
import { BigNumber } from "@ethersproject/bignumber";
import { runAnyContractFunction, runContractFunctionPromise } from '../utils';
import { LocalizedString, DPMI_SmartContract, LINK_SmartContract } from '../utils';
import { TokenId, NullTokenId } from "./TokenId";

import { toRaw, isReactive } from 'vue';

interface ILength {
  length : number;
}

interface IDPMIMetadata {
  dcContributor?: Array<LocalizedString>;
  dcCoverage?: Array<LocalizedString>;
  dcCreator?: Array<LocalizedString>;
  dcDate?: string;
  dcDescription?: Array<LocalizedString>;
  dcFormat?: Array<LocalizedString>;
  dcIdentifier?: Array<LocalizedString>;
  dcLanguage?: Array<string>;
  dcPublisher?: Array<LocalizedString>;
  dcRelation?: Array<LocalizedString>;
  dcRights?: Array<LocalizedString>;
  dcSource?: Array<LocalizedString>;
  dcSubject?: Array<LocalizedString>;
  dcTitle?: Array<LocalizedString>;
  dcType?: Array<LocalizedString>;
};

export class DPMIMetadata {
  dcContributor: Array<LocalizedString> = [];
  dcCoverage: Array<LocalizedString> = [];
  dcCreator: Array<LocalizedString> = [];
  dcDate = "";
  dcDescription: Array<LocalizedString> = [];
  dcFormat: Array<LocalizedString> = [];
  dcIdentifier: Array<LocalizedString> = [];
  dcLanguage: Array<string> = [];
  dcPublisher: Array<LocalizedString> = [];
  dcRelation: Array<LocalizedString> = [];
  dcRights: Array<LocalizedString> = [];
  dcSource: Array<LocalizedString> = [];
  dcSubject: Array<LocalizedString> = [];
  dcTitle: Array<LocalizedString> = [];
  dcType: Array<LocalizedString> = [];

  constructor() {
    this.dcTitle = [];
  }

  static fromJSON(input: IDPMIMetadata): DPMIMetadata {
    const ans = new DPMIMetadata();
    ans.dcContributor = input.dcContributor || ans.dcContributor;
    ans.dcCoverage = input.dcCoverage || ans.dcCoverage;
    ans.dcCreator = input.dcCreator || ans.dcCreator;
    ans.dcDate = input.dcDate || ans.dcDate;
    ans.dcDescription = input.dcDescription || ans.dcDescription;
    ans.dcFormat = input.dcFormat || ans.dcFormat;
    ans.dcIdentifier = input.dcIdentifier || ans.dcIdentifier;
    ans.dcLanguage = input.dcLanguage || ans.dcLanguage;
    ans.dcPublisher = input.dcPublisher || ans.dcPublisher;
    ans.dcRelation = input.dcRelation || ans.dcRelation;
    ans.dcRights = input.dcRights || ans.dcRights;
    ans.dcSource = input.dcSource || ans.dcSource;
    ans.dcSubject = input.dcSubject || ans.dcSubject;
    ans.dcTitle = input.dcTitle || ans.dcTitle;
    ans.dcType = input.dcType || ans.dcType;
    return ans;
  }

  static toJSON(input: DPMIMetadata): string {
    console.log("DPMIMetadata.toJSON", input);
    const obj = {
      dcContributor: input.dcContributor.filter((val) => {return val.length > 0}),
      dcCoverage: input.dcCoverage.filter((val) => {return val.length > 0}),
      dcCreator: input.dcCreator.filter((val) => {return val.length > 0}),
      dcDate: input.dcDate,
      dcDescription: input.dcDescription.filter((val) => {return val.length > 0}),
      dcFormat: input.dcFormat.filter((val) => {return val.length > 0}),
      dcIdentifier: input.dcIdentifier.filter((val) => {return val.length > 0}),
      dcLanguage: input.dcLanguage.filter((val) => {return val.length > 0}),
      dcPublisher: input.dcPublisher.filter((val) => {return val.length > 0}),
      dcRelation: input.dcRelation.filter((val) => {return val.length > 0}),
      dcRights: input.dcRights.filter((val) => {return val.length > 0}),
      dcSource: input.dcSource.filter((val) => {return val.length > 0}),
      dcSubject: input.dcSubject.filter((val) => {return val.length > 0}),
      dcTitle: input.dcTitle.filter((val) => {return val.length > 0}),
      dcType: input.dcType.filter((val) => {return val.length > 0}),
    } as Record<string, ILength>;
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName].length === 0) {
        delete obj[propName];
      }
    }
    const ans = JSON.stringify(obj, null, 2);
    console.log("DPMIMetadata.toJSON", ans, input);
    return ans;
  }
}

export class DPMIRegistration {
  private _id: TokenId;
  private _owner: string;
  public metadata: DPMIMetadata;
  private _metadata_url: string;
  private _fwd_citations: Array<TokenId>;
  private _rev_citations: Array<TokenId>;

  get id() { return this._id }
  get uuid() { return this._id.toString() }
  get owner() { return this._owner }
  get metadata_url() { return this._metadata_url }
  get fwd_citations() { return this._fwd_citations }
  get rev_citations() { return this._rev_citations }

  constructor(id: TokenId, owner: string, metadata_url: string, fwd_citations: Array<TokenId>, rev_citations: Array<TokenId>) {
    this._id = id;
    this._owner = owner;
    this._metadata_url = metadata_url;
    this._fwd_citations = fwd_citations;
    this._rev_citations = rev_citations;
    this.metadata = new DPMIMetadata();
  }

  static async mint(owner: string, uri: string, moralis: typeof MoralisConfig) {
    const tokenId = TokenId.parse(uuidv4());
    const transaction = await runContractFunctionPromise(moralis, "safeMint", {
      to: owner,
      tokenId: tokenId,
      uri: uri,
    });
    console.log("[DPMIRegistration:mint] transaction =", transaction);
    const result = await transaction.wait();
    console.log("[DPMIRegistration:mint] result =", result);
    return tokenId;
  }

  static async load_or_new(uuid: string, owner: string, include_metadata: boolean, moralis: typeof MoralisConfig) {
    if (uuid == "new") {
      return Promise.resolve(new DPMIRegistration(NullTokenId, owner, "", [], []));
    }
    return await DPMIRegistration.load_by_uuid(uuid, include_metadata, moralis);
  }

  static async load(tokenId: TokenId, include_metadata: boolean, moralis: typeof MoralisConfig): Promise<DPMIRegistration> {
    const p_owner = runAnyContractFunction(moralis, "ownerOf", {tokenId: tokenId.wire}) as Promise<string>;
    const p_metadata_url = runAnyContractFunction(moralis, "tokenURI", {tokenId: tokenId.wire}) as Promise<string>;
    const p_fwd_citations = runAnyContractFunction(moralis, "getCites", {tokenId: tokenId.wire}) as Promise<Array<BigNumber>>;
    const p_rev_citations = runAnyContractFunction(moralis, "getCitedBy", {tokenId: tokenId.wire}) as Promise<Array<BigNumber>>;
    const [owner, metadata_url, fwd_citations_raw, rev_citations_raw] = [await p_owner, await p_metadata_url, await p_fwd_citations, await p_rev_citations];
    const fwd_citations = fwd_citations_raw.map((val) => TokenId.from_bn(val));
    const rev_citations = rev_citations_raw.map((val) => TokenId.from_bn(val));

    const ans = new DPMIRegistration(tokenId,  owner,  metadata_url,  fwd_citations,  rev_citations);
    if (include_metadata) {
      try {
        await ans.load_metadata();
      } catch (e) {
        console.log(e);
      }
    }
    return ans;
  }

  static async load_by_uuid(uuid: string, include_metadata: boolean, moralis: typeof MoralisConfig): Promise<DPMIRegistration> {
    const tokenId = TokenId.parse(uuid);
    return await DPMIRegistration.load(tokenId, include_metadata, moralis);
  }

  static async load_by_owner_and_index(owner: string, index: number, include_metadata: boolean, moralis: typeof MoralisConfig): Promise<DPMIRegistration> {
    const transaction = await runContractFunctionPromise(moralis, "tokenOfOwnerByIndex", {
        owner: owner,
        index: index
      }) as Moralis.ExecuteFunctionCallResult;
    const tokenId = TokenId.from_bn(transaction as unknown as BigNumber);
    return await DPMIRegistration.load(tokenId, include_metadata, moralis);
  }

  static async load_by_owner(owner: string, include_metadata: boolean, moralis: typeof MoralisConfig): Promise<Array<DPMIRegistration>> {
    const transaction = await runContractFunctionPromise(moralis, "balanceOf", {
        owner: owner,
      }) as Moralis.ExecuteFunctionCallResult;
    console.log("transaction", transaction);
    const totalRegistrations = (transaction as unknown as BigNumber).toNumber();
    const promises = [];
    const promises2 = [];
    for (let i = 0; i < totalRegistrations; i += 1) {
      promises.push(DPMIRegistration.load_by_owner_and_index(owner, i, include_metadata, moralis));
    }
    console.log("promises", promises);
    return Promise.all(promises);
  }

  async load_metadata(): Promise<DPMIMetadata> {
    if (this._metadata_url == "") {
      return Promise.resolve(this.metadata);
    }

    const response = await fetch(this.metadata_url);
    this.metadata = DPMIMetadata.fromJSON(await response.json());
    return this.metadata;
  }

  async save_metadata(moralis: typeof MoralisConfig): Promise<string> {
    if (this.id == NullTokenId) {
      throw "Can't do this to an unmint token";
    }

    const isNew = this.id.bytes == NullTokenId.bytes;
    console.log("save_metadata:isNew", isNew);
    if (isNew) {
      this._id = TokenId.parse(uuidv4());
    }

    const filename = this.uuid+".json";
    console.log("save_metadata", filename);
    console.log("save_metadata", this.metadata);
    const filedata = btoa(DPMIMetadata.toJSON(this.metadata));
    console.log("save_metadata", filedata);
    const file = new moralis.File(filename, {base64 : filedata});
    console.log("save_metadata", file);
    await file.saveIPFS();
    const new_metadata_url = file.url();
    console.log("save_metadata", new_metadata_url);

    let transaction;
    if (isNew) {
      // Old way
      transaction = await runContractFunctionPromise(moralis, "safeMint", {
        to: this._owner,
        tokenId: this._id.wire,
        uri: new_metadata_url,
      }) as Moralis.ExecuteFunctionCallResult;

      // New way I could not finish
      // const fee = await DPMI_SmartContract.runFunction(moralis, "getLinkMintFee", {}) as Promise<BigNumber>;
      // console.log("fee", fee);
      // console.log({receiver: DPMI_SmartContract.addr, value: fee, data: new_metadata_url});
      // const transaction_p = LINK_SmartContract.runFunctionAsPromise(moralis, "transferAndCall", {to: DPMI_SmartContract.addr, value: fee, data: new_metadata_url});// as Moralis.ExecuteFunctionCallResult;
      // console.log("transaction_p", transaction_p);
      // transaction = await transaction_p;
      // console.log("transaction", transaction);
      // console.log("transaction", transaction.prototype);
    } else {
      transaction = await runAnyContractFunction(moralis, "setTokenURI", {tokenId: this.id.wire, uri: new_metadata_url}) as Moralis.ExecuteFunctionCallResult;
    }
    await transaction.wait();

    this._metadata_url = new_metadata_url;
    return this.metadata_url;
  }

  async addCitation(to: string, moralis: typeof MoralisConfig): Promise<boolean> {
    const toToken = TokenId.parse(to);

    const transaction = await runAnyContractFunction(moralis, "addCitation", {fromToken: this.id.wire, toToken: toToken.wire}) as Moralis.ExecuteFunctionCallResult;
    console.log("addCitation->transaction", transaction);
    this._fwd_citations.push(toToken);
    return true;
  }
}

export const NullDPMIRegistration = new DPMIRegistration(NullTokenId, "", "", [], []);
