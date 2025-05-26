import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
//bootstrap
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState('');

  // Simple hash function for password (basic security improvement)
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    let text = 'Very Weak';
    
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    if (strength <= 20) text = 'Very Weak';
    else if (strength <= 40) text = 'Weak';
    else if (strength <= 60) text = 'Fair';
    else if (strength <= 80) text = 'Good';
    else text = 'Strong';
    
    return { strength, text };
  };

  // Handle password input change
  const handlePasswordChange = () => {
    const passValue = password.current?.value || '';
    const { strength, text } = calculatePasswordStrength(passValue);
    setPasswordStrength(strength);
    setPasswordStrengthText(text);
  };

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return { valid: false, message: "Full name is required" };
    if (name.trim().length < 2) return { valid: false, message: "Full name must be at least 2 characters" };
    return { valid: true };
  };

  const validateUsername = (username) => {
    if (!username) return { valid: false, message: "Username is required" };
    if (username.length < 3) return { valid: false, message: "Username must be at least 3 characters long" };
    if (username.length > 20) return { valid: false, message: "Username must be less than 20 characters" };
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { valid: false, message: "Username can only contain letters, numbers, underscores, and hyphens" };
    return { valid: true };
  };

  const validateEmail = (email) => {
    if (!email) return { valid: false, message: "Email is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, message: "Please enter a valid email address" };
    return { valid: true };
  };

  const validatePassword = (password) => {
    if (!password) return { valid: false, message: "Password is required" };
    if (password.length < 6) return { valid: false, message: "Password must be at least 6 characters long" };
    return { valid: true };
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return { valid: false, message: "Please confirm your password" };
    if (password !== confirmPassword) return { valid: false, message: "Passwords do not match" };
    return { valid: true };
  };

  // Main validation function
  const validateForm = (formData) => {
    const validations = [
      validateFullName(formData.fullName),
      validateUsername(formData.username),
      validateEmail(formData.email),
      validatePassword(formData.password),
      validateConfirmPassword(formData.password, formData.confirmPassword)
    ];

    const firstError = validations.find(v => !v.valid);
    return firstError || { valid: true };
  };

  // Safe localStorage operations
  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('twitterUsers') || '[]');
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  };

  const saveUser = (users) => {
    try {
      localStorage.setItem('twitterUsers', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      swal("Storage Error", "Unable to save user data. Please try again.", "error");
      return false;
    }
  };

  const saveUserSession = (userData) => {
    try {
      localStorage.setItem('twitterUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user session:', error);
      return false;
    }
  };

  function signUpUser() {
    const formData = {
      fullName: fullName.current.value.trim(),
      username: username.current.value.trim(),
      email: email.current.value.trim(),
      password: password.current.value,
      confirmPassword: confirmPassword.current.value
    };

    // Validate form
    const validation = validateForm(formData);
    if (!validation.valid) {
      swal("Validation Error", validation.message, "error");
      return;
    }

    // Development logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Full Name:', formData.fullName);
      console.log('Username:', formData.username);
      console.log('Email:', formData.email);
      console.log('Timestamp:', new Date().toISOString());
      console.log('============================');
    }

    // Show loading state
    showSignUpBtn(false);
    showLoadingBtn(true);

    // Simulate API call with shorter delay
    setTimeout(() => {
      try {
        const existingUsers = getStoredUsers();
        const userExists = existingUsers.find(user => 
          user.email.toLowerCase() === formData.email.toLowerCase() || 
          user.username.toLowerCase() === formData.username.toLowerCase()
        );

        if (userExists) {
          const conflictType = userExists.email.toLowerCase() === formData.email.toLowerCase() ? 'Email' : 'Username';
          
          if (process.env.NODE_ENV === 'development') {
            console.log('❌ REGISTRATION FAILED - User already exists:', conflictType);
          }
          
          swal("Registration Failed", 
            conflictType === 'Email' ? 
            "An account with this email already exists" : 
            "This username is already taken", 
            "error"
          );
          
          // Reset buttons
          showSignUpBtn(true);
          showLoadingBtn(false);
        } else {
          // Create new user object with hashed password
          const newUser = {
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: simpleHash(formData.password), // Basic hashing
            createdAt: new Date().toISOString(),
            id: Date.now().toString(),
            profileComplete: false
          };

          // Save to localStorage
          existingUsers.push(newUser);
          const saved = saveUser(existingUsers);
          
          if (saved) {
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ REGISTRATION SUCCESSFUL');
              console.log('New user created with ID:', newUser.id);
              console.log('Total users in system:', existingUsers.length);
            }

            swal("Welcome!", "Account created successfully! Welcome to Twitter Clone!", "success")
              .then(() => {
                // Auto-login the user
                const sessionData = {
                  fullName: formData.fullName,
                  username: formData.username,
                  email: formData.email,
                  id: newUser.id,
                  loginTime: new Date().toISOString(),
                  isAuthenticated: true
                };
                
                if (saveUserSession(sessionData)) {
                  navigate('/home');
                } else {
                  // If session save fails, still redirect but show warning
                  swal("Warning", "Account created but login session may not persist. Please sign in manually if needed.", "warning");
                  navigate('/');
                }
              });
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        swal("Error", "An unexpected error occurred. Please try again.", "error");
        showSignUpBtn(true);
        showLoadingBtn(false);
      }
    }, 1000); // Reduced from 2000ms to 1000ms
  }

  const getPasswordStrengthVariant = () => {
    if (passwordStrength <= 20) return 'danger';
    if (passwordStrength <= 40) return 'warning';
    if (passwordStrength <= 60) return 'info';
    if (passwordStrength <= 80) return 'primary';
    return 'success';
  };

  return (
    <div className='split-screen-auth'>
      <div className='auth-image-side'>
        <img src={homepageImage} alt="Twitter Clone - Join the conversation" className="auth-background-image" />
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
              aria-describedby="fullNameHelp"
              maxLength="50"
            />
            <Form.Text id="fullNameHelp" className="text-muted">
              Your display name (2-50 characters)
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Choose a username" 
              ref={username}
              required
              className="modern-input"
              aria-describedby="usernameHelp"
              maxLength="20"
            />
            <Form.Text id="usernameHelp" className="text-muted">
              3-20 characters, letters, numbers, underscores, and hyphens only
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              ref={email}
              required
              className="modern-input"
              aria-describedby="emailHelp"
            />
            <Form.Text id="emailHelp" className="text-muted">
              We'll never share your email with anyone else
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Create a password (min 6 characters)" 
              ref={password}
              required
              className="modern-input"
              onChange={handlePasswordChange}
              aria-describedby="passwordHelp"
            />
            {password.current?.value && (
              <>
                <div className="mt-2 mb-1">
                  <small className="text-muted">Password strength: {passwordStrengthText}</small>
                </div>
                <ProgressBar 
                  now={passwordStrength} 
                  variant={getPasswordStrengthVariant()}
                  style={{ height: '4px' }}
                  aria-label={`Password strength: ${passwordStrengthText}`}
                />
              </>
            )}
            <Form.Text id="passwordHelp" className="text-muted">
              Use a mix of letters, numbers, and symbols for better security
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="registerConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm your password" 
              ref={confirmPassword}
              required
              className="modern-input"
              aria-describedby="confirmPasswordHelp"
            />
            <Form.Text id="confirmPasswordHelp" className="text-muted">
              Re-enter your password to confirm
            </Form.Text>
          </Form.Group>
          
          {signUpBtn && 
            <Button 
              variant="primary" 
              onClick={signUpUser} 
              className="w-100 mb-3 modern-button"
              size="lg"
              aria-label="Create your account"
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
              aria-label="Creating account, please wait"
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