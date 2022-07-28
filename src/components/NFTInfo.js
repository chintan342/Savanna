import React, { useContext, useEffect } from 'react'
import { NftDataContext } from '../context/NftDataContext';
import Header from './Header'
import NFTInfoChild from './NFTInfoChild'

function NFTInfo() {

  const {getNftData} = useContext(NftDataContext);

  useEffect(() => {
    getNftData();
  }, []);
  return (
    <>
        <Header />
        <div className='airdrop'>
            <div className='row mx-0'>
                <NFTInfoChild title="PUBLIC-NFTs" state={true} type={0}/>
                <NFTInfoChild title="MEDIA-NFTs" state={false} type={1}/>
            </div>
        </div>
    </>
  )
}

export default NFTInfo