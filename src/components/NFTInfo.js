import React, { useContext, useEffect } from "react";
import { SpinnerCircular } from "spinners-react";
import { NftDataContext } from "../context/NftDataContext";
import Header from "./Header";
import NFTInfoChild from "./NFTInfoChild";

function NFTInfo() {
    const { getNftData, loading } = useContext(NftDataContext);

    useEffect(() => {
        getNftData();
    }, []);
    return (
        <>
            <Header />
            <div className="airdrop">
                {loading ? (
                    <>
                        <div className="d-flex justify-content-center align-items-center h-100 display-4 flex-wrap">
                            <p
                                className="display-block w-100 m-0 p-0 text-center align-self-end"
                                style={{ fontSize: "30px", fontWeight: "600" }}
                            >
                                Please wait while we fetch the latest data...
                            </p>
                            <SpinnerCircular
                                size={100}
                                color="yellow"
                                className="align-self-start"
                            />
                        </div>
                    </>
                ) : (
                    <div className="row mx-0">
                        <NFTInfoChild
                            title="PUBLIC-NFTs"
                            state={true}
                            type={0}
                        />
                        <NFTInfoChild
                            title="MEDIA-NFTs"
                            state={false}
                            type={1}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default NFTInfo;
