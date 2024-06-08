import React, { useState } from 'react';
import twitterImage from '../../assets/images/TwitterNew.jpg';
import  {useSignInWithEmailAndPassword ,useSignInWithGoogle, useSignInWithMicrosoft} from 'react-firebase-hooks/auth'
import TwitterIcon from '@mui/icons-material/Twitter';
import auth from '../../firebase.init';
import GoogleButton from 'react-google-button'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css' 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [error, setError] = useState('');
    const navigate=useNavigate();

    const[
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ]= useSignInWithEmailAndPassword(auth);

    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

    if(user || googleUser){
        navigate('/');
        console.log(user);
        console.log(googleUser)
    }
    if(error || googleError){
        console.log(error.message);
        console.log(googleError.message);
    }
    if(loading || googleLoading){
        console.log(loading);
        console.log(googleLoading);
    }


    const handleSubmit = e => {
        e.preventDefault();
        console.log(email, password);
        signInWithEmailAndPassword(email,password);
    }

    const handleGoogleSignIn = () =>{
        signInWithGoogle();
    }
    

    return (
        <div className='login-container'>
            <div className='image-container'>
               <img className='image' src={twitterImage} alt='' />
            </div>
            <div className='form-container'>
            <div className='form-box'>
            <TwitterIcon style={{color:'skyblue'}} />
               <h2 className='heading'>Happening Now</h2>
               <h3 className='heading1'>What happening today?</h3>
               <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder='Email-Address' 
                    className='email' 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder='Password' 
                    className='password' 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <div className='btn-login'>
                    <button type='submit' className='btn'>Login</button>
                </div>
               </form>
            </div>
               
               <hr/>
               <div className='google-button'>
                <GoogleButton
                    className='g-btn'
                    type='light'
                    onClick={handleGoogleSignIn}
                />
               </div>
               <div>
                Don't have an account?
                <Link to='/signup' 
                style={{textDecoration:'none', color:'skyblue', fontWeight:'600', marginLeft:'5px'}}
                >
                    Sign-Up
                </Link>
               </div>
            </div>


        </div>
    );
};

export default Login;

