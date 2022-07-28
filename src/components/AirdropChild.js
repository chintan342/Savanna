import cogoToast from "cogo-toast";
import React, { useContext, useState } from "react";
import NFT from "../assets/images/NFT.png";
import { NftDataContext } from "../context/NftDataContext";
import { WalletContext } from "../context/Wallet";
import api from "../lib/api";

function AirdropChild({ type }) {
    const { connectWallet, connectAirdropContract, accountId } =
        useContext(WalletContext);
    const { data } = useContext(NftDataContext);
    const [loading, setLoading] = useState(false);

    const handleAirdrop = async () => {
        try {
            setLoading(true);
            const accountID = await connectWallet();
            console.log("connected");
            const contract = await connectAirdropContract();
            console.log("contract connected");

            let addresses = document.getElementById(
                `addresses${type === 0 ? 1 : 0}`
            ).value;
            if (addresses.length === 0) {
                return cogoToast.error("Please enter the valid addresses");
            }
            addresses = addresses.replaceAll(" ", "");
            let addressesArr = addresses.split(",");
            const response = await contract.methods
                .airdropBatch(addressesArr, type === 0 ? 1 : 0)
                .send({
                    from: accountID,
                });

            const apiResponse = await api.post(
                `/nft/assignee/${data[type]._id}`,
                {
                    assignee: addresses,
                }
            );

            cogoToast.success("Transaction completed successfully");
        } catch (err) {
            console.log(err);
            cogoToast.error("Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="col-6 ">
                <div className="nft-info">
                    <div className="nft-type">
                        {data.length > 0 ? data[type].nft_name : "Loading"}
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <img src={NFT} alt="NFT" className="mt-3" />
                            <p className="quantity mt-3">
                                Quantity:{" "}
                                {data.length > 0 ? data[type].quantity : "Loading"}
                            </p>
                            <div className="nft-meta">
                                <p>
                                    Type: {data.length > 0 ? data[type].type : "Loading"}
                                </p>
                                <p>
                                    Rank: {data.length > 0 ? data[type].rank : "Loading"}
                                </p>
                                <p>
                                    State: {data.length > 0 ? data[type].state : "Loading"}
                                </p>
                            </div>
                        </div>
                        <div className="col-8 input-address">
                            <textarea
                                className="ml-4 mt-3"
                                id={`addresses${type === 0 ? 1 : 0}`}
                                placeholder="Paste addresses here. Please be certain that they are all on the Polygon Network."
                            ></textarea>
                            <span
                                className="airdrop-button"
                                onClick={handleAirdrop}
                            >
                                {loading ? "Please Wait..." : "AIRDROP"}
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default AirdropChild;
