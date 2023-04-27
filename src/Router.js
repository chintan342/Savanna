import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Airdrop from './components/Airdrop';
import Datatable from './components/DataTable';
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
                <Route path='/' element={<PublicRoutes component={Login} />}></Route>
                <Route path='/dashboard' element={<ProtectedRoute component={NFTInfo} />}></Route>
                <Route path='/dashboard-burn' element={<ProtectedRoute component={Datatable} />}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Router;