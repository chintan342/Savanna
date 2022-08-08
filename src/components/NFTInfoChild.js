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
    const { connectWallet, connectAirdropContract } =
        useContext(WalletContext);
    const { data, getNftData, handleLoading } = useContext(NftDataContext);

    // console.log("data = ", data);

    const handleUri = async (nftType) => {
        try {

            if (!medalType && (nftType !== "public" && nftType !== "media")) {
                return cogoToast.error("Please select any type");
            }

            setLoading(true);
            const {accountID, web3} = await connectWallet();
            const contract = await connectAirdropContract();

            let uri;

            if (medalType === 1 && nftType === "") {
                uri = data[type].gold_uri;
            } else if (medalType === 2 && nftType === "") {
                uri = data[type].silver_uri;
            } else if (medalType === 3 && nftType === "") {
                uri = data[type].bronze_uri;
            } else if (medalType === 4 || nftType === 'public') {
                uri = data[type].claim_uri;
            }

            // console.log("public uri = ", uri, " ", web3.utils.toWei("50", "gwei"));

            if (nftType === "" || (nftType === "public" && data[type].state.toLowerCase() === "unclaimed")) {
                const response = await contract.methods.setPubNftUri(uri).send({
                    from: accountID,
                    gasPrice:web3.utils.toWei("50", "gwei")
                });
            }

            if (type === 1) {
                if (data[1].state.toLowerCase() === "unclaimed") {
                    const response = await contract.methods.setMediaNftUri(data[1].claim_uri).send({
                        from: accountID,
                        gasPrice: web3.utils.toWei("50", "gwei")
                    });
                } else if (data[1].state.toLowerCase() === "claimed") {
                    const response = await contract.methods.setMediaNftUri(data[1].media_uri).send({
                        from: accountID,
                        gasPrice: web3.utils.toWei("50", "gwei")
                    });
                }
            }

            // console.log({ ...data[type], rank: selected.toUpperCase() });

            if (medalType === 4 || nftType === 'public' || nftType === "media") {
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

    const handleRefresh = async() => {
        try{
            handleLoading();
            const accountID = await connectWallet();
            const contract = await connectAirdropContract();

            // console.log("contract = ", contract);

            let tempAddresses = [];

            let totalNft;

            if (type === 0) {
                // console.log("type public");
                totalNft = await contract.methods.totalPubNft().call();
            } else if (type === 1) {
                totalNft = await contract.methods.totalMediaNft().call();
            }

            // console.log("total = ", totalNft);

            for (let i = 0; i < totalNft; i++) {
                const address = await contract.methods.ownerOf(i).call();
                // console.log("address = ", address);
                tempAddresses = [...tempAddresses, address];
            }

            // console.log("temp = ", tempAddresses.join(','));

            const response = await api.post(`/nft/assignee/${data[type]._id}`, {
                assignee: tempAddresses.join(',')
            })

            // setAddresses(tempAddresses);

        } catch(err) {
            console.log(err);
        } finally {
            handleLoading();
        }
    }

    // console.log("address  outsd = ", addresses);

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

    // console.log("addresses = ", addresses);
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
                                <div className="d-flex justify-content-between">
                                <div className="nft-type mt-5 mb-3 display-inline-block">
                                    OWNED-BY
                                </div>

                                <span
                                    className={`common-button medal`}
                                    medal
                                    onClick={() => {
                                        handleRefresh();
                                    }}
                                >
                                    REFRESH OWNER
                                </span>
                                </div>
                                <p className="address-sequence">
                                    {addresses.length > 0 ?
                                        addresses.map((address, index) => (
                                            <p key={`${title}-${index}`}>
                                                <span>#{index} - </span>
                                                {
                                                    address.assignee_wallet_address
                                                }
                                            </p>
                                        ))
                                        :
                                        null
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="col-5 position-relative">
                            <span
                                className="common-button claimed"
                                onClick={async () => {
                                    await setMedalType(4);
                                    const answer = window.confirm("Are you sure?");
                                    // console.log(answer);
                                    if(answer) {
                                        if(type === 0) {
                                            handleUri("public");
                                        } else {
                                            handleUri("media");
                                        }
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
                                        className={`common-button update ${loading ? 'disable-pointer' : ""}`}
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
