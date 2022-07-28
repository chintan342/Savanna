import cogoToast from 'cogo-toast';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Savanna from '../assets/images/savanna.png';
import User from '../assets/images/user.png';
import api from '../lib/api';

function Login() {

    const navigate = useNavigate();

    const handleLogin = async() => {
        try{
            const username = document.getElementById('name').value;
            const password = document.getElementById('password').value;

            const response = await api.post('/auth/login', {
                username,
                password
            });

            localStorage.setItem("token", response.data.token);

            navigate('/dashboard');

        } catch(err) {
            cogoToast.error("Error");   
            console.log(err);
        }
    }
  return (
    <div className='login'>
        <div className='container d-flex justify-content-center align-items-center h-100'>
            <div className='col-8 form-box text-center'>
                <img className='mt-4' src={Savanna} alt='savanna' />
                <h3 className='heading mt-3'>COMEDY TOUR NFT DASHBOARD</h3>
                <div className='user-icon mt-5 position-absolute'>
                    <img className='mt-4' src={User} alt='User' />
                </div>
                <div className='input-area position-absolute'>
                    <input 
                        className='d-inline-block mb-3' 
                        type="text" 
                        id='name' 
                        name='name'
                        placeholder='Username'
                    />
                    <br />
                    <input
                        type="password" 
                        id='password' 
                        name='password' 
                        placeholder='Password'
                    />
                </div>

                <span className='sign-in position-absolute' onClick={handleLogin}>SIGN IN</span>
            </div>
        </div>
    </div>
  )
}

export default Login;