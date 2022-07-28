import cogoToast from "cogo-toast";
import React, { Component, createContext } from "react";
import Web3 from "web3";
import { abis, contracts } from "../smartContracts/contractInfo";
import { NETWORK_ID } from "../config";

export const WalletContext = createContext();

// Contracts
// const staking_contract_address = contracts.stakingContract;
// const stake_token_contract_address = contracts.stakeTokenContract;
// const reward_token_contract_address = contracts.rewardTokenContract;
// const airdrop_contract_address = "0x92c62dcd090e0DfbD87Fd327e49da9862F6884cC";
const airdrop_contract_address = contracts.airdropContract;


// Abis
const airdrop_contract_abi = abis.airdrop;

export class WalletContextProvider extends Component {
    constructor(props) {
        super(props);
       this.state = {
            web3Provider: null,
            accountId: null,
            airdropContract: null,
       }
    }

    componentDidMount() {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", function (networkId) {
                localStorage.setItem("MetaMask", "");
                // window.location.reload(true);
              });
            window.ethereum.on("accountsChanged", () => {
            // localStorage.setItem('MetaMask', '');
            // this.connectWallet();
            window.location.reload();
            });
            if (localStorage.getItem("MetaMask") === "true") {
                // console.log("Metamask true");
                // this.connectWallet();
            }
        }
    }

    connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });

                const accountID = accounts[0];
                const networdId = await web3.eth.net.getId();
                if (networdId === parseInt(NETWORK_ID)) {
                    localStorage.setItem("MetaMask", "true");
                    web3.eth.defaultAccount = accounts[0];
                    this.setState(
                        {
                          web3Provider: web3,
                          accountId: accountID,
                        }
                    );

                    return accountID;
                } else {
                    cogoToast.error("Please connect to Ropsten Testnet");
                }

            } catch(err) {
                console.log(err);
            }
        } else if (window.web3) {
            const web3 = new Web3(window.web3.currentProvider);
            this.setState({web3Provider: web3});
        } else {
            cogoToast.error("You have to install MetaMask !");
        }
    }

    connectAirdropContract = async() => {
        try{
            let web3;
            if (!this.state.web3Provider) {
                web3 = new Web3(window.ethereum);
            } else {
                web3 = new Web3(this.state.web3Provider);
            }
            const airdropContract = await new web3.eth.Contract(airdrop_contract_abi, airdrop_contract_address);
            this.setState({ airdropContract });

            return airdropContract;
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        const { children } = this.props;
        return (
            <WalletContext.Provider value={{ ...this, ...this.state }}>
                {children}
            </WalletContext.Provider>
        );
    }
}

export default WalletContextProvider;
