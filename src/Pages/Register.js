import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
//bootstrap
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
// Import your image
import homepageImage from '../images/test5.jpg';

function Register() {
  const fullName = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();
  const [signUpBtn, showSignUpBtn] = useState(true);
  const [loadingBtn, showLoadingBtn] = useState(false);
  
  function signUpUser() {
    const fullNameInput = fullName.current.value;
    const usernameInput = username.current.value;
    const emailInput = email.current.value;
    const passInput = password.current.value;
    const confirmPassInput = confirmPassword.current.value;

    // Basic validation
    if (!fullNameInput || !usernameInput || !emailInput || !passInput || !confirmPassInput) {
      swal("Validation Error", "Please fill in all fields", "error");
      return;
    }

    if (passInput !== confirmPassInput) {
      swal("Password Error", "Passwords do not match", "error");
      return;
    }

    if (passInput.length < 6) {
      swal("Password Error", "Password must be at least 6 characters long", "error");
      return;
    }

    if (usernameInput.length < 3) {
      swal("Username Error", "Username must be at least 3 characters long", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailInput)) {
      swal("Email Error", "Please enter a valid email address", "error");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernameInput)) {
      swal("Username Error", "Username can only contain letters, numbers, and underscores", "error");
      return;
    }

    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Full Name:', fullNameInput);
    console.log('Username:', usernameInput);
    console.log('Email:', emailInput);
    console.log('Password:', passInput);
    console.log('Timestamp:', new Date().toISOString());
    console.log('============================');

    // changing the state of the buttons
    showSignUpBtn(false);
    showLoadingBtn(true);

    // Simulate API call
    setTimeout(() => {
      // Simulate checking if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('twitterUsers') || '[]');
      const userExists = existingUsers.find(user => 
        user.email === emailInput || user.username === usernameInput
      );

      if (userExists) {
        console.log('❌ REGISTRATION FAILED');
        console.log('User already exists:', userExists.email === emailInput ? 'Email' : 'Username');
        
        swal("Registration Failed", 
          userExists.email === emailInput ? 
          "An account with this email already exists" : 
          "This username is already taken", 
          "error"
        );
        
        // Reset buttons
        showSignUpBtn(true);
        showLoadingBtn(false);
      } else {
        console.log('✅ REGISTRATION SUCCESSFUL');
        
        // Create new user object
        const newUser = {
          fullName: fullNameInput,
          username: usernameInput,
          email: emailInput,
          password: passInput, // In real app, this would be hashed
          createdAt: new Date().toISOString(),
          id: Date.now().toString()
        };

        // Save to localStorage (simulating database)
        existingUsers.push(newUser);
        localStorage.setItem('twitterUsers', JSON.stringify(existingUsers));
        
        console.log('New user created:', newUser);
        console.log('Total users in system:', existingUsers.length);

        swal("Success!", "Account created successfully! Welcome to Twitter Clone!", "success")
          .then(() => {
            // Auto-login the user
            localStorage.setItem('twitterUser', JSON.stringify({
              fullName: fullNameInput,
              username: usernameInput,
              email: emailInput,
              loginTime: new Date().toISOString(),
              isAuthenticated: true
            }));
            navigate('/home');
          });
      }
    }, 2000); // Simulate network delay
  }

  return (
    <div className='split-screen-auth'>
      <div className='auth-image-side'>
        <img src={homepageImage} alt="Twitter Clone" className="auth-background-image" />
        <div className="image-overlay">
          <div className="image-content">
            <h2>Join the conversation</h2>
            <p>Create your account and start connecting with people around the world.</p>
          </div>
        </div>
      </div>
      <div className='auth-form-side'>
        <div className="auth-form-container">
          <h1>Sign Up</h1>
          
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your full name" 
              ref={fullName}
              required
              className="modern-input"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Choose a username" 
              ref={username}
              required
              className="modern-input"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              ref={email}
              required
              className="modern-input"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Create a password (min 6 characters)" 
              ref={password}
              required
              className="modern-input"
            />
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="registerConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm your password" 
              ref={confirmPassword}
              required
              className="modern-input"
            />
          </Form.Group>
          
          {signUpBtn && 
            <Button 
              variant="primary" 
              onClick={signUpUser} 
              className="w-100 mb-3 modern-button"
              size="lg"
            >
              Sign Up
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
              Creating Account...
            </Button>
          }
          
          <div className='auth-links'>
            <Link to='/' className='auth-link'>
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;