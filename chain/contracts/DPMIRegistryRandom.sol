// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.0;

import "./DPMIRegistry.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/// @custom:security-contact gabrieljvnq@gmail.com
contract DPMIRegistryRandom is
  DPMIRegistry,
  VRFConsumerBase
{
  bytes32 internal keyHash;
  uint256 public randomResult;
  uint256 internal link_minting_fee;
  address internal link_token_sender;

  event ReadyToMint(address, bytes32);

  constructor(address vfr_coordinator, address link_token, bytes32 key_hash)
    DPMIRegistry()
    VRFConsumerBase(vfr_coordinator, link_token) {
    keyHash = key_hash;
    minting_fee = 0;
    link_minting_fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    link_token_sender = link_token;
  }

  modifier onlyLink() {
    require(msg.sender == link_token_sender, "unrecognized token");
    _;
  }

  function setLinkMintingFee(uint new_fee)
    public
    onlyOwner
  {
    link_minting_fee = new_fee;
  }

  function getLinkMintFee() public view returns (uint fee) {
    fee = link_minting_fee;
  }

  mapping(bytes32 => address) mintRequestToAddress;
  mapping(bytes32 => string)  mintRequestToUri;

  function mintRequest(address to, string memory uri)
    public
    payable
    returns (bytes32 requestId)
  {
    require(LINK.transferFrom(msg.sender, address(this), getLinkMintFee()), INSUFICIENT_FUNDS_FOR_MINTING);
    return _mintRequest(to, uri);
  }

  function _mintRequest(address to, string memory uri)
    internal
    returns (bytes32 requestId)
  {
    require(to != address(0), "ERC721: transfer to the zero address");
    requestId = requestRandomness(keyHash, link_minting_fee);
    mintRequestToAddress[requestId] = to;
    mintRequestToUri[requestId] = uri;
    return requestId;
  }


  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint128 tokenId = randomness2uuid(uint128(randomness));
    address to = mintRequestToAddress[requestId];
    string memory uri = mintRequestToUri[requestId];
    
    _mint(to, tokenId);
    _setTokenURI(tokenId, uri);
    
    delete mintRequestToUri[requestId];
    delete mintRequestToAddress[requestId];
  }

  // This is still giving wrong answers
  function randomness2uuid(uint128 val) pure internal returns (uint128 uuid) {
    // 0b0011 = 3 (we need this nibble to read 0b10xx where x is don't care)
    // 0b1000 = 8
    // 0b0100 = 4
    // val &   123e4567-e89b-12d3-a456-426614174000 |   xxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
    // val & 0xffffffff-ffff-3fff-0fff-ffffffffffff | 0x000000-0000-8000-4000-000000000000
    uuid = (val & 0xffffffffffff3fff0fffffffffffffff) | 0x000000000080004000000000000000;
  }

  function onTokenTransfer(address sender, uint256 amount, bytes memory _data) public onlyLink {
    uint change = amount - getLinkMintFee();
    require(change >= 0, INSUFICIENT_FUNDS_FOR_MINTING);
    _mintRequest(sender, string(_data));
    if (change > 0) {
      LINK.transfer(msg.sender, change);
    }
  }
}
