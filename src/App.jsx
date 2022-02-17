import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";
import { ethers } from "ethers";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const App = () => {
  /*Store user's public wallet*/
  const [currentAccount, setCurrentAccount] = useState("");
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x857300D5aa5F533C5d9872fdFE05a9f08dbBa348";
  const [allWaves, setAllWaves] = useState([]);

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log(`Make sure you have Metamask!`);
      return;
    } else {
      console.log(`We have the ethereum object`, ethereum);
    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log(`Found an authorised account : ${account}`)
          setCurrentAccount(account)
          getAllWaves();
        } else {
          console.log(`No authorised account found`)
        }
      })
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

        const waveTxn = await wavePortalContract.wave("Message for you");
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const getAllWaves = async () => {
     try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      /* Call getAllWaves method from SC */
      const waves = await wavePortalContract.getAllWaves();
      setAllWaves(waves)
    /*Address timestamp and message to be displayed on UI*/
   let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
    /*Storing data in React*/
     setAllWaves(wavesCleaned);
    console.log("test");
      } else {
       console.log("Ethereum object doesn't exist!")
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
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        
      </div>

    </div>
  );

}

export default App