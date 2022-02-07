// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/// @custom:security-contact gabrieljvnq@gmail.com
contract DPMIRegistry is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  Pausable,
  Ownable,
  ERC721Burnable
{
  string constant defaultNftName = "tDPMI"; // t is to indicate testing contract
  string constant defaultNftSymbol = unicode"📚⚠"; // ⚠ is to indicate testing contract
  uint internal minting_fee = 0;

  event ChangedTokenMetadata(uint256);
  event NewCitation(uint256, uint256);
  event DelCitation(uint256, uint256);

  constructor() ERC721(defaultNftName, defaultNftSymbol) {
  }

  modifier onlyOperator(uint _tokenId) {
    require(_isApprovedOrOwner(msg.sender, _tokenId), NOT_OWNER_OR_OPERATOR);
    _;
  }

  modifier validToken(uint _tokenId) {
    require(_exists(_tokenId), TOKEN_DOESNT_EXIST);
    _;
  }

  // Not sure if this is needed
  // uint public last_completed_migration;
  // function setCompleted(uint completed) public onlyOwner {
  //   last_completed_migration = completed;
  // }

  string constant INSUFICIENT_FUNDS_FOR_MINTING = "E001";
  string constant NOT_OWNER_OR_OPERATOR = "E002";
  string constant NO_CIRCULAR_CITATIONS = "E003";
  string constant INCONSISTENT_INDEXES = "E004";
  string constant TOKEN_DOESNT_EXIST = "E005";
  // string constant NFT_ALREADY_EXISTS = "E006";
  // string constant NOT_TOKEN_OWNER = "E007";
  // string constant IS_TOKEN_OWNER = "E008";

  function setMintingFee(uint new_fee)
    public
    onlyOwner
  {
    minting_fee = new_fee;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function getMintFee() public view returns (uint fee) {
    fee = minting_fee;
  }

  function safeMint(address to, uint256 tokenId, string memory uri)
    public
    payable
  {
    require(msg.value >= getMintFee(), INSUFICIENT_FUNDS_FOR_MINTING);
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function withdrawEth(address payable to) public payable onlyOwner {
    to.transfer(address(this).balance);
  }

  mapping(uint256 => uint256[]) private tokenCites;
  mapping(uint256 => uint256[]) private tokenCitedBy;

  function getCites(uint256 tokenId)
    public view validToken(tokenId) returns (uint256[] memory tokens)
  {
    tokens = tokenCites[tokenId];
  }

  function getCitedBy(uint256 tokenId)
    public view validToken(tokenId) returns (uint256[] memory tokens)
  {
    tokens = tokenCitedBy[tokenId];
  }

  function addCitation(uint256 fromToken, uint256 toToken)
    public
    onlyOperator(fromToken)
  {
    require(fromToken != toToken, NO_CIRCULAR_CITATIONS);
    tokenCites[fromToken].push(toToken);
    tokenCitedBy[toToken].push(fromToken);
    emit NewCitation(fromToken, toToken);
  }

  // the parameters are somewhat redundant but they were chosen to minimize costs
  function delCitation(uint256 fromToken, uint256 toToken, uint index_fwd, uint index_rev)
    public
    onlyOperator(fromToken)
  {
    uint256 toToken2 = tokenCites[fromToken][index_fwd];
    uint256 fromToken2 = tokenCitedBy[toToken][index_rev];

    require(toToken == toToken2, INCONSISTENT_INDEXES);
    require(fromToken == fromToken2, INCONSISTENT_INDEXES);

    uint last_fwd = tokenCites[fromToken].length-1;
    tokenCites[fromToken][index_fwd] = tokenCites[fromToken][last_fwd];
    tokenCites[fromToken].pop();

    uint last_rev = tokenCitedBy[toToken].length-1;
    tokenCitedBy[toToken][index_rev] = tokenCitedBy[toToken][last_rev];
    tokenCitedBy[toToken].pop();
   
    emit DelCitation(fromToken, toToken);
  }

  function setTokenURI(uint256 tokenId, string memory uri)
    public
    onlyOperator(tokenId)
  {
    _setTokenURI(tokenId, uri);
    emit ChangedTokenMetadata(tokenId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

}
