import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import homepageImage from '../images/homepage5.jpg';

function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [signInBtn, showsignInBtn] = useState(true);
  const [loadingBtn, showloadingBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function signInUser() {
    const emailInput = email.current.value;
    const passInput = password.current.value;

  
    if (!emailInput || !passInput) {
      swal("Validation Error", "Please fill in all fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailInput)) {
      swal("Validation Error", "Please enter a valid email address", "error");
      return;
    }

    if (passInput.length < 6) {
      swal("Validation Error", "Password must be at least 6 characters long", "error");
      return;
    }

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', emailInput);
    console.log('Password:', passInput);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=====================');

    // changing the state of the buttons
    showsignInBtn(false);
    showloadingBtn(true);

    setTimeout(() => {
      // Simulate successful login (you can change this logic)
      const mockUsers = [
        { email: 'test@example.com', password: '123456' },
        { email: 'user@test.com', password: 'password' }
      ];

      const userExists = mockUsers.find(user => 
        user.email === emailInput && user.password === passInput
      );

      if (userExists || emailInput === 'admin@twitter.com') {
        console.log('✅ LOGIN SUCCESSFUL');
        console.log('User authenticated:', emailInput);
        
        // Store user info in localStorage for demo purposes
        localStorage.setItem('twitterUser', JSON.stringify({
          email: emailInput,
          loginTime: new Date().toISOString(),
          isAuthenticated: true
        }));

        swal("Success!", "You have successfully logged in!", "success")
          .then(() => {
            navigate('/home');
          });
      } else {
        console.log('❌ LOGIN FAILED');
        console.log('Invalid credentials for:', emailInput);
        
        swal("Login Failed", "Invalid email or password.", "error");
        
        
        showsignInBtn(true);
        showloadingBtn(false);
      }
    }, 1500); 
  }

  return (
    <div className='split-screen-auth'>
      <div className='auth-image-side'>
        <img src={homepageImage} alt="Twitter Clone" className="auth-background-image" />
        <div className="image-overlay">
          <div className="image-content">
            <h2>Connect with the world</h2>
            <p>Join millions of people sharing their thoughts and connecting with friends.</p>
          </div>
        </div>
      </div>
      <div className='auth-form-side'>
        <div className="auth-form-container">
          <h1>Login</h1>
          
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              ref={email}
              required
              className="modern-input"
            />
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"}
                placeholder="password" 
                ref={password}
                required
                className="modern-input"
              />
              <Button 
                variant="outline-secondary" 
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          
          {signInBtn && 
            <Button 
              variant="primary" 
              onClick={signInUser} 
              className="w-100 mb-3 modern-button"
              size="lg"
            >
              Sign In
            </Button>
          }
          {loadingBtn &&
            <Button 
              variant="primary" 
              disabled 
              className="w-100 mb-3 modern-button"
              size="lg"
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> 
              Signing In..
            </Button>
          }
          
          <div className='auth-links'>
            <Link to='/signup' className='auth-link'>
              Don't have an account? Sign Up
            </Link> 
            <span className="link-separator">|</span>
            <Link to='/reset-password' className='auth-link'>
              Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;