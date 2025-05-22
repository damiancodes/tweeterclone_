import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import homepageImage from '../images/homepage5.jpg';

function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [signInBtn, showsignInBtn] = useState(true);
  const [loadingBtn, showloadingBtn] = useState(false);
  
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

    // Simulate API call
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
            <Form.Control 
              type="password" 
              placeholder="password" 
              ref={password}
              required
              className="modern-input"
            />
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
              Signing In...
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