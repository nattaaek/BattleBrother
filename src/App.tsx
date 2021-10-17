import React from 'react';
import { useDispatch } from 'react-redux'
import './App.css';
import { useAppSelector } from './redux/hooks';
import { connectionFailed, connectionRequest, connectionSuccess, updateAccount } from './redux/states/blockchain';
import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import BattleBrotherToken from "./contracts/BattleBrotherToken.json";
import { checkDataFailed, checkDataRequest, checkDataSuccess } from './redux/states/battleBrotherData';
import { store } from './redux/store';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { Grid, Typography, Button, Box, Card } from '@mui/material';

declare let window: any;

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};



const App = () => {
  const dispatch = useDispatch();
  const blockChain = useAppSelector((state) => state.blockchain);
  const data = useAppSelector((state) => state.battleBrotherData);
  const [loading, setLoading] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);

  console.table(blockChain);
  console.table(data);

  React.useEffect(() => {
    async function fetchMyAPI() {
      await fetchData()
    }
    if (blockChain.account != "" && blockChain.battleBrotherToken != null) {
      fetchMyAPI()
    }
  }, [blockChain.battleBrotherToken]);

  const mintNFT = () => {
    setLoading(true);
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals]
    });
    blockChain.battleBrotherToken.methods.createRandomDemon(randomName).send({
      from: blockChain.account,
      value: blockChain.web3.utils.toWei("0.001", "ether")
    }).once("error", (err: any) => {
      setLoading(false);
      console.log(err);
    }).then((receipt: any) => {
      setLoading(false);
      setShowAnimation(true);
      setTimeout(function(){ setShowAnimation(false) }, 6000);
      fetchData();
    })

  }

  const handleConnect = async () => {
      dispatch(connectionRequest());
      if (window.ethereum) {
        let web3 = new Web3(window.ethereum);
        try {    
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })
          console.log("Account " + accounts[0]);
          const networkId: string = await window.ethereum.request({
            method: "net_version",
          });
          console.log("netowkrId " + networkId);
          if (networkId === "1634457851088") {
            const battleBrotherToken = new web3.eth.Contract(
              BattleBrotherToken.abi as AbiItem[],
              "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e"
            )
            dispatch(connectionSuccess({
              account: accounts[0],
              battleBrotherToken,
              web3
            }));
            window.ethereum.on("accountsChanged", (accounts: any[]) => {
              dispatch(updateUserAccount(accounts[0]));
            });
            window.ethereum.on("chainChanged", () => {
              window.location.reload();
            });
          } else {
            dispatch(connectionFailed("Change network to Polygon."));
          }
        } catch (err) {
          dispatch(connectionFailed("Something went wrong."));
        }
      } else {
        dispatch(connectionFailed("Install Metamask."));
      }
  }

  const fetchData = async () => {
    dispatch(checkDataRequest);
    try {
      let allDemons = await blockChain.battleBrotherToken.methods.getDemons().call();
      let allOwnerDemons = await store.getState().blockchain.battleBrotherToken.methods.getOwnerDemons(blockChain.account).call();
      dispatch(checkDataSuccess({ allDemons, allOwnerDemons }));
    } 
    catch (err) {
      console.log(err);
      dispatch(checkDataFailed("Could not load data from contract."));
    }
  }

  const updateUserAccount = (account: any) => {
    return async () => {
      dispatch(updateAccount({ account: account }));
      //dispatch(fetchData(account));
    };
  };

  return (
    <div className="App">
      {blockChain.account === '' || blockChain.battleBrotherToken === null ? (
        <React.Fragment>
                <p>Battle Brother game</p>
      <button onClick={() => handleConnect()}>connecto !!</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3">Welcome to the game {blockChain.account}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={() => mintNFT()}>Open Gacha !!!</Button>
            </Grid>
            {showAnimation ? <Box position="absolute" top="0" left="0">
              <img style={{position: "fixed", top: "0", left: 0, width: "100%", height: "auto"}} alt="gacha" src="https://media2.giphy.com/media/1X7hvOSmch1q0cXd7W/giphy.gif?cid=ecf05e47m7zzfoc85bl1gsnmy032z29mtpwe8z8smg6detxb&rid=giphy.gif&ct=g" />
              </Box>: 
            <>
            <Grid item xs={12}>
              <Typography variant="h4">Your demons list</Typography>
            </Grid>
            {data.allOwnerDemons.map((demon) => (
            <Box style={{display: 'flex'}} key={demon.id}>
              <Card>
                <img src="https://media1.giphy.com/media/RHHRiuo1Q79IULEMO8/giphy.gif?cid=ecf05e47d1wwvcaj5xwo5fdiksvq2khs3xc4pgkt79jp3uve&rid=giphy.gif&ct=g" alt="img"/>
                <Typography>Demon ID: {demon.id}</Typography>
                <Typography>Demon Name: {demon.name}</Typography>
                <Typography>Demon DNA: {demon.dna}</Typography>
                <Typography>Demon Level: {demon.level}</Typography>
                <Typography>Demon Rarity: {demon.rariry}</Typography>
              </Card>
            </Box>
          ))}
            </>
            }
            
          </Grid>
        </React.Fragment>
      )}

    </div>
  );
}

export default App;
