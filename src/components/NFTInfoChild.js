import cogoToast from "cogo-toast";
import React, { useContext, useEffect, useState } from "react";
import NFT from "../assets/images/NFT.png";
import { NftDataContext } from "../context/NftDataContext";
import { WalletContext } from "../context/Wallet";
import api from "../lib/api";

function NFTInfoChild({ state, type, title }) {
    const [medalType, setMedalType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState("");
    const [addresses, setAddresses] = useState([]);
    const { connectWallet, connectAirdropContract, accountId } =
        useContext(WalletContext);
    const { data, getNftData } = useContext(NftDataContext);

    console.log("data = ", data);

    const handleUri = async (claim) => {
        try {
            if (!medalType && claim !== "claim") {
                return cogoToast.error("Please select any type");
            }

            setLoading(true);
            const accountID = await connectWallet();
            const contract = await connectAirdropContract();

            let uri;

            if (medalType === 1) {
                uri = data[type].gold_uri;
            } else if (medalType === 2) {
                uri = data[type].silver_uri;
            } else if (medalType === 3) {
                uri = data[type].bronze_uri;
            } else if (medalType === 4 || claim === 'claim') {
                uri = data[type].claim_uri;
            }

            if (claim !== "claim" || (claim === "claim" && data[type].state.toLowerCase() === "unclaimed")) {
                const response = await contract.methods.setPubNftUri(uri).send({
                    from: accountID
                });
            }


            console.log({ ...data[type], rank: selected.toUpperCase() });

            if (medalType === 4 || claim === 'claim') {
                await api.post(`/nft/${data[type]._id}/update`, {
                    ...data[type],
                    rank:
                        data[type].state.toLowerCase() === "claimed"
                            ? type === 1 ? "MEDIA" : "N/A"
                            : "CLAIMED",
                    state:
                        data[type].state.toLowerCase() === "claimed"
                            ? "UNCLAIMED"
                            : "CLAIMED",
                });
            } else {
                const updateData = await api.post(
                    `/nft/${data[type]._id}/update`,
                    {
                        ...data[type],
                        rank: selected.toUpperCase(),
                    }
                );
            }

            await getNftData();

            // console.log("data updated = ", updateData);

            cogoToast.success("Transaction successful");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(
                    `/nft/assignee/${data[type]._id}`
                );

                setAddresses(response.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (data.length > 0 && data[type].nft_name) {
            getData();
        }
    }, [data]);
    return (
        <>
            <div className="col-6 ">
                <div className="nft-info">
                    <div className="nft-type">
                        {data.length > 0 ? data[type].nft_name : "Loading"}
                    </div>
                    <div className="row">
                        <div className="col-7 d-flex flex-wrap">
                            <div>
                                <img src={NFT} alt="NFT" className="mt-3" />
                                <p className="quantity mt-3">
                                    Quantity:{" "}
                                    {data.length > 0 ? data[type].quantity : "Loading"}
                                </p>
                            </div>
                            <div className="nft-info-meta">
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

                            <div className="owned">
                                <div className="nft-type mt-5 mb-3">
                                    OWNED-BY
                                </div>
                                <p className="address-sequence">
                                    {addresses.length > 0 &&
                                        addresses.map((address, index) => (
                                            <p key={`${title}-${index}`}>
                                                <span>#{index} - </span>
                                                {
                                                    address.assignee_wallet_address
                                                }
                                            </p>
                                        ))}
                                </p>
                            </div>
                        </div>

                        <div className="col-5 position-relative">
                            <span
                                className="common-button claimed"
                                onClick={async () => {
                                    await setMedalType(4);
                                    const answer = window.confirm("Are you sure?");
                                    console.log(answer);
                                    if(answer) {
                                        handleUri("claim");
                                    }
                                }}
                            >
                                {data.length > 0 &&
                                data[type].state.toLowerCase() === "claimed"
                                    ? loading && type === 1 ? "Please wait..." : "Unclaim"
                                    : loading && type === 1 ? "Please wait..." : "Claim"}
                            </span>
                            {state &&
                            data.length > 0 &&
                            data[type].state.toLowerCase() !== "claimed" ? (
                                <>
                                    <span
                                        className={`common-button medal ${
                                            selected === "silver"
                                                ? "yellow-bg"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setMedalType(2);
                                            setSelected("silver");
                                        }}
                                    >
                                        SILVER
                                    </span>
                                    <span
                                        className={`common-button medal ${
                                            selected === "gold"
                                                ? "yellow-bg"
                                                : ""
                                        }`}
                                        medal
                                        onClick={() => {
                                            setMedalType(1);
                                            setSelected("gold");
                                        }}
                                    >
                                        GOLD
                                    </span>
                                    <span
                                        className={`common-button medal ${
                                            selected === "bronze"
                                                ? "yellow-bg"
                                                : ""
                                        }`}
                                        medal
                                        onClick={() => {
                                            setMedalType(3);
                                            setSelected("bronze");
                                        }}
                                    >
                                        BRONZE
                                    </span>

                                    <span
                                        className="common-button update"
                                        onClick={() => handleUri("")}
                                    >
                                        {loading ? "Please Wait..." : "UPDATE"}
                                    </span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="nft-modal">
                <div className="form">
                    <h3>DO ulklkjlkjlajdslkjdf</h3>
                    <button>YES</button>
                    <button>NO</button>
                </div>
            </div>
        </>
    );
}

export default NFTInfoChild;
