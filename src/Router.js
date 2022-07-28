import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Airdrop from './components/Airdrop';
import Login from './components/Login';
import NFTInfo from './components/NFTInfo';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoutes from './router/PublicRoutes';


function Router() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/airdrop' element={<ProtectedRoute component={Airdrop} />}></Route>
                <Route path='/login' element={<PublicRoutes component={Login} />}></Route>
                <Route path='/dashboard' element={<ProtectedRoute component={NFTInfo} />}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Router;