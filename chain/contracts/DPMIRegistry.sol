// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.0;

import "./utils/ERC721.sol";
import "./utils/ERC721Metadata.sol";
import "./utils/ERC721Enumerable.sol";
import "./utils/ERC721TokenReceiver.sol";
import "./utils/SupportsInterface.sol";
import "./utils/AddressUtils.sol";
import "./utils/Ownable.sol";
import "./utils/ReferenceNFTokenEnumerable.sol";


// TODO: use reference implementation with minimal overriding
// (leave most of the real work to Moralis)
// (but let the owner of the contract collect some fees)

contract DPMIRegistry is
  Ownable,
  SupportsInterface,
  ERC721Metadata
{
  using AddressUtils for address;

  uint public last_completed_migration;

  function setCompleted(uint completed) public onlyOwner {
    last_completed_migration = completed;
  }

  string constant ZERO_ADDRESS = "E001";
  string constant NOT_VALID_NFT = "E002";
  string constant NOT_OWNER_OR_OPERATOR = "E003";
  string constant NOT_OWNER_APPROVED_OR_OPERATOR = "E004";
  string constant NOT_ABLE_TO_RECEIVE_NFT = "E005";
  string constant NFT_ALREADY_EXISTS = "E006";
  string constant NOT_TOKEN_OWNER = "E007";
  string constant IS_TOKEN_OWNER = "E008";

  string internal nftName = "tDPMI"; // t is to indicate testing contract
  string internal nftSymbol = unicode"📚⚠"; // ⚠ is to indicate testing contract

  mapping (uint256 => address) internal id2owner;
  mapping (uint256 => address) internal id2approval;
  mapping (address => uint256) private owner2NFTokenCount;
  mapping (address => mapping (address => bool)) internal owner2operators;
  mapping (uint256 => string) internal id2uri;

  uint256[] internal tokens;
  mapping(uint256 => uint256) internal id2index;
  mapping(address => uint256[]) internal owner2ids;

  constructor()
  {
    supportedInterfaces[0x80ac58cd] = true; // ERC721
    supportedInterfaces[0x780e9d63] = true; // ERC721Enumerable
    supportedInterfaces[0x5b5e139f] = true; // ERC721Metadata
  }

  // Guarantees that the msg.sender is an owner or operator of the given NFT.
  modifier canOperate(uint256 _tokenId) {
    address tokenOwner = id2owner[_tokenId];
    require(
      tokenOwner == msg.sender || owner2operators[tokenOwner][msg.sender],
      NOT_OWNER_OR_OPERATOR
    );
    _;
  }

  // Guarantees that the msg.sender is allowed to transfer NFT.
  modifier canTransfer(uint256 _tokenId) {
    address tokenOwner = id2owner[_tokenId];
    require(
      tokenOwner == msg.sender
      || id2approval[_tokenId] == msg.sender
      || owner2operators[tokenOwner][msg.sender],
      NOT_OWNER_APPROVED_OR_OPERATOR
    );
    _;
  }

  // Guarantees that _tokenId is a valid Token.
  modifier validNFToken(uint256 _tokenId) {
    require(id2owner[_tokenId] != address(0), NOT_VALID_NFT);
    _;
  }

  /**
   * ERC721 functions
   */

  // function _mint(address _to, uint256 _tokenId) internal virtual {
  //   require(_to != address(0), ZERO_ADDRESS);
  //   require(idToOwner[_tokenId] == address(0), NFT_ALREADY_EXISTS);

  //   _addNFToken(_to, _tokenId);

  //   emit Transfer(address(0), _to, _tokenId);
  // }

  /**
   * ERC721Enumerable functions
   */

  /**
   * ERC721Metadata functions
   */
  
  function name() external view returns (string memory _name) {
    _name = nftName;
  }

  function symbol() external view returns (string memory _symbol) {
    _symbol = nftSymbol;
  }

  function tokenURI(uint256 tokenId) external view validNFToken(tokenId) returns (string memory) {
    return id2uri[tokenId];
  }

  function setTokenUri(uint256 tokenId, string memory new_uri) public validNFToken(tokenId) canOperate(tokenId) {
    id2uri[tokenId] = new_uri;
  }


  /**
   * DPMI specific functions
   */

  function setNftNameAndSymbol(
    string memory new_name,
    string memory new_symbol
  )
    public
    onlyOwner
  {
    nftName = new_name;
    nftSymbol = new_symbol;
  }

  // function mint(address to, uint256 tokenId, string memory new_uri) public {
  //   // TODO: check if it is valid UUID?
  //   _mint(to, tokenId);
  // }
}
