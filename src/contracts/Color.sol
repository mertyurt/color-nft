pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Color is ERC721URIStorage {
  string[] public colors;

  mapping(string => bool) _colorExists;

  constructor() ERC721("Color", "CLR") {}

  function mint(string memory _color) public {
    require(!_colorExists[_color]);
    colors.push(_color);
    uint _tokenId = colors.length;
    _mint(msg.sender, _tokenId);
    _colorExists[_color] = true;
  }

  function totalSupply() public view virtual returns (uint256) {
    return colors.length;
  }

}