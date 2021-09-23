import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Color from '../abis/Color.json';
import logo from '../logo.png';
import './App.css';

export default function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  },[])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if(networkData){
      const abi = Color.abi;
      const contractAddress = networkData.address;
      console.log(contractAddress)
      const receivedContract = new web3.eth.Contract(abi, contractAddress);
      setContract(receivedContract);
      console.log(receivedContract)
      const contractTotalSupply = await receivedContract.methods.totalSupply().call();
      setTotalSupply(contractTotalSupply);
      console.log(contractTotalSupply);
      const contractTokens = [];
      for(var i = 0; i < contractTotalSupply; i++){
        const color = await receivedContract.methods.colors(i).call();
        contractTokens.push(color)
      }
      setTokens(contractTokens);

      console.log(contractTokens)
    } else {
      window.alert('Are you sure you are in the right network?')
    }
    
  }

  const mint = (color) => {
    console.log(color)
    contract.methods.mint(color).send({from: account})
      .once('receipt', (receipt) => {
        setTokens([...tokens, color])
      })
  }
  
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color NFTs
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  mint(colorInput)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    onChange={(e) => setColorInput(e.target.value)}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { tokens.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }


