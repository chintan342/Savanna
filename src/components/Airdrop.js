import React, { useContext, useEffect } from 'react'
import { NftDataContext } from '../context/NftDataContext';
import AirdropChild from './AirdropChild';
import Header from './Header';

function Airdrop() {

  const {getNftData} = useContext(NftDataContext);

  useEffect(() => {
    getNftData();
  }, []);
  return (
    <>
        <Header />
        <div className='airdrop'>
            <div className='row mx-0'>
                <AirdropChild title="LAUNCH PUBLIC NFTs" type={0} />
                <AirdropChild title="MEDIA NFTs" type={1} />
            </div>
        </div>
    </>
  )
}

export default Airdrop;