const { assert } = require("chai");

const Color = artifacts.require("./Color.sol");

require("chai").use(require('chai-as-promised')).should();

contract('Color', (accounts) => {

  before(async () => {
    contract = await Color.deployed();
  })
  
  describe('Deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address;
      assert.notEqual(address, '')
      assert.notEqual(address, undefined)
      assert.notEqual(address, null)
      assert.notEqual(address, 0x0)
    })

    it('has a name', async () => {
      const name = await contract.name();
      assert.equal(name, 'Color');
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'CLR');
    })
  })

  describe('Minting', async () => {
    it('creates new token', async () => {
      const result = await contract.mint('#C0C0C0');
      const totalSupply = await contract.totalSupply();
      //const exists = contract._exists()
      //SUCCESS
      assert.equal(totalSupply, 1);

      const event = result.logs[0].args;
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
      assert.equal(event.to, accounts[0], 'to is correct')
      
      //FAILURE
      await contract.mint('#C0C0C0').should.be.rejected;
    })
    
  })

  describe('Indexing', async () => {
    it('lists all colors', async () => {
      await contract.mint('#FFFFFF');
      await contract.mint('#FF0000');
      await contract.mint('#00FF00');

      const totalSupply = await contract.totalSupply();
      let color,
        result = [];
      
      for(var i = 0; i < totalSupply; i++){
        color = await contract.colors(i);
        result.push(color)
      }

      let expected = ['#C0C0C0', '#FFFFFF', '#FF0000', '#00FF00'];
      assert.equal(result.join(','), expected.join(','));
    })
  })
})

