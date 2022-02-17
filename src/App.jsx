import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";
import { ethers } from "ethers";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const App = () => {

const [count, setCount] = React.useState(18);

  /*Store user's public wallet*/
  const [currentAccount, setCurrentAccount] = useState("");
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x98Cad3dB3851aC11edB14eBA70faf4e1B24f246e";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
  const checkIfWalletIsConnected = () => {
    const checkIfWalletIsConnected = async () => {
      try {
        /*
        * First make sure we have access to window.ethereum
        */
        const { ethereum } = window;

        if (!ethereum) {
          console.log("Make sure you have metamask!");
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        /* Check for authorization to access the user's wallet */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account : ", account);
          setCurrentAccount(account);

        }
        else {
          console.log("No authorized account found");

        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }

  }

  const wave = async () => {

     try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /* Execute the actual wave from your smart contract
        */

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected(); 
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
           Hello !
        </div>

        <div className="bio">
          My name is Hugo, working on this webapp to improve my skills in Blockchain technologies. Connect your Ethereum wallet and say hi to me!
        </div>
        {!currentAccount && (
          <button className="walletButton" onClick={connectWallet} color="#ff5c5c">
            Please connect your wallet to say Hi
          </button>
        )}

        <button className="waveButton" onClick={wave}>
          Say Hi to me ☕️️️
        </button>
        <div style={{ width: 200, height: 200 }}>
      </div>
        <div className="header"> {count} people said hi ! </div>
      </div>

    </div>
  );

}

export default App