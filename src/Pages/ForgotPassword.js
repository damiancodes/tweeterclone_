import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
//bootstrap
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
// Import your image
import homepageImage from '../images/homepage5.jpg';

function ForgotPassword() {
  const email = useRef();
  const [resetBtn, showResetBtn] = useState(true);
  const [loadingBtn, showLoadingBtn] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  function resetPassword() {
    const emailInput = email.current.value;

    // Basic validation
    if (!emailInput) {
      swal("Validation Error", "Please enter your email address", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailInput)) {
      swal("Validation Error", "Please enter a valid email address", "error");
      return;
    }

    console.log('=== PASSWORD RESET ATTEMPT ===');
    console.log('Email:', emailInput);
    console.log('Timestamp:', new Date().toISOString());
    console.log('==============================');

    // changing the state of the buttons
    showResetBtn(false);
    showLoadingBtn(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in our mock database
      const existingUsers = JSON.parse(localStorage.getItem('twitterUsers') || '[]');
      const userExists = existingUsers.find(user => user.email === emailInput);

      if (userExists) {
        console.log('✅ PASSWORD RESET EMAIL SENT');
        console.log('Reset link sent to:', emailInput);
        console.log('User found:', userExists.fullName);
        
        swal("Success!", "Password reset email sent! Check your inbox.", "success");
        setEmailSent(true);
      } else {
        console.log('⚠️ EMAIL NOT FOUND');
        console.log('No account found for:', emailInput);
        
        // For security, we still show success message even if email doesn't exist
        swal("Success!", "If an account with this email exists, a reset link has been sent.", "success");
        setEmailSent(true);
      }
      
      showResetBtn(true);
      showLoadingBtn(false);
    }, 1500); // Simulate network delay
  }

  function resendEmail() {
    const emailInput = email.current.value;
    
    console.log('=== RESENDING RESET EMAIL ===');
    console.log('Email:', emailInput);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=============================');
    
    showResetBtn(false);
    showLoadingBtn(true);
    
    setTimeout(() => {
      console.log('✅ RESET EMAIL RESENT');
      swal("Success!", "Reset email has been resent!", "success");
      showResetBtn(true);
      showLoadingBtn(false);
    }, 1000);
  }

  return (
    <div className='split-screen-auth'>
      <div className='auth-image-side'>
        <img src={homepageImage} alt="Twitter Clone" className="auth-background-image" />
        <div className="image-overlay">
          <div className="image-content">
            <h2>Forgot your password?</h2>
            <p>Don't worry! We'll help you get back to connecting with your friends.</p>
          </div>
        </div>
      </div>
      <div className='auth-form-side'>
        <div className="auth-form-container">
          <h1>Reset Password</h1>
          
          {!emailSent ? (
            <>
              <p className="reset-instruction">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <Form.Group className="mb-4" controlId="resetEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email address" 
                  ref={email}
                  required
                  className="modern-input"
                />
              </Form.Group>
              
              {resetBtn && 
                <Button 
                  variant="primary" 
                  onClick={resetPassword} 
                  className="w-100 mb-3 modern-button"
                  size="lg"
                >
                  Send Reset Link
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
                  Sending Reset Link...
                </Button>
              }
            </>
          ) : (
            <div className="email-sent-container text-center">
              <div className="mb-4">
                <span style={{fontSize: '64px'}}>📧</span>
              </div>
              <h3>Check Your Email</h3>
              <p className="mb-4">
                We've sent a password reset link to your email address. 
                Click the link in the email to reset your password.
              </p>
              <p className="text-muted mb-4">
                If you don't see the email, check your spam folder.
              </p>
              {resetBtn &&
                <Button 
                  variant="outline-primary" 
                  onClick={resendEmail} 
                  className="mb-3"
                  size="lg"
                >
                  Resend Email
                </Button>
              }
              {loadingBtn &&
                <Button 
                  variant="outline-primary" 
                  disabled 
                  className="mb-3"
                  size="lg"
                >
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> 
                  Resending...
                </Button>
              }
            </div>
          )}
          
          <div className='auth-links'>
            <Link to='/' className='auth-link'>
              Remember your password? Sign In
            </Link>
            <span className="link-separator">|</span>
            <Link to='/signup' className='auth-link'>
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;