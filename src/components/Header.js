import React from 'react';
import Savanna from '../assets/images/savanna.png';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <>
        <div className='header'>
            <NavLink to='/dashboard'>
                <img className='my-3 ml-5' src={Savanna} alt='savanna' />
            </NavLink>
            <NavLink to='/airdrop' className="navlink ml-5">Airdrop</NavLink>
            <NavLink to='/dashboard' className="navlink">Dashboard</NavLink>
            <span className='header-text position-absolute'>COMEDY TOUR NFT DASHBOARD</span>
        </div>
    </>
  )
}

export default Header;