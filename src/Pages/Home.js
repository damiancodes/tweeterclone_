import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('twitterUser');
    
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      console.log('=== USER SESSION ===');
      console.log('Logged in user:', userData);
      console.log('==================');
      
      // Load all users for display
      const allUsersData = JSON.parse(localStorage.getItem('twitterUsers') || '[]');
      setAllUsers(allUsersData);
      console.log('All registered users:', allUsersData.length);
    } else {
      console.log('❌ No user session found, redirecting to login');
      navigate('/');
    }
    
    setLoading(false);
  }, [navigate]);

  const handleSignOut = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to sign out?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willSignOut) => {
      if (willSignOut) {
        console.log('=== USER SIGN OUT ===');
        console.log('User signed out:', user?.email);
        console.log('Sign out time:', new Date().toISOString());
        console.log('====================');
        
        localStorage.removeItem('twitterUser');
        swal("Success!", "You have been signed out!", "success");
        navigate('/');
      }
    });
  };

  const clearAllData = () => {
    swal({
      title: "Clear All Data?",
      text: "This will remove all registered users and sign you out. This action cannot be undone!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willClear) => {
      if (willClear) {
        localStorage.removeItem('twitterUsers');
        localStorage.removeItem('twitterUser');
        console.log('🗑️ All user data cleared');
        swal("Cleared!", "All data has been cleared!", "success");
        navigate('/');
      }
    });
  };

  const logDataToConsole = () => {
    console.log('=== CURRENT SESSION DATA ===');
    console.log('Current user:', user);
    console.log('All registered users:', allUsers);
    console.log('Session timestamp:', new Date().toISOString());
    console.log('Local storage data:');
    console.log('- twitterUser:', localStorage.getItem('twitterUser'));
    console.log('- twitterUsers:', localStorage.getItem('twitterUsers'));
    console.log('============================');
    swal("Console Logged!", "Check your browser console for detailed data", "info");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh', backgroundColor: '#f7f9fa'}}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{color: '#1d9bf0'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{color: '#536471'}}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Bar */}
      <Navbar expand="lg" className="modern-navbar">
        <Container>
          <Navbar.Brand className="navbar-brand-modern">
            🐦 Twitter Clone
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link className="welcome-text">
                👋 Welcome, {user?.fullName || user?.username || user?.email}
              </Nav.Link>
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleSignOut} 
                className="ms-3 logout-btn"
              >
                Sign Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="home-background">
        <Container className="py-5">
          {/* Welcome Section */}
          <Row className="mb-5">
            <Col>
              <Card className="welcome-card">
                <Card.Body className="text-center p-5">
                  <div className="welcome-icon mb-4">🎉</div>
                  <h1 className="welcome-title">Welcome to Twitter Clone!</h1>
                  <p className="welcome-subtitle">
                    You've successfully logged into your dashboard. Start exploring and connecting!
                  </p>
                  <Badge bg="success" className="status-badge">
                    ✅ Authenticated & Active
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Info Section */}
          <Row className="mb-5">
            <Col>
              <Card className="info-card">
                <Card.Header className="card-header-modern">
                  <h3>👤 Your Account Information</h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="info-item">
                        <strong>Full Name:</strong>
                        <span>{user?.fullName || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Username:</strong>
                        <span>@{user?.username || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong>
                        <span>{user?.email}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <strong>Login Time:</strong>
                        <span>{user?.loginTime ? new Date(user.loginTime).toLocaleString() : 'Unknown'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Status:</strong>
                        <Badge bg="success">Online</Badge>
                      </div>
                      <div className="info-item">
                        <strong>Account Type:</strong>
                        <Badge bg="primary">Standard User</Badge>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* All Users Section */}
          {allUsers.length > 0 && (
            <Row className="mb-5">
              <Col>
                <Card className="users-card">
                  <Card.Header className="card-header-modern">
                    <h3>👥 Community Members ({allUsers.length})</h3>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {allUsers.map((registeredUser, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <Card className={`user-item-card ${registeredUser.email === user?.email ? 'current-user' : ''}`}>
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-center">
                                <div className="user-avatar">
                                  {registeredUser.fullName?.charAt(0) || registeredUser.username?.charAt(0) || '👤'}
                                </div>
                                <div className="ms-3 flex-grow-1">
                                  <h6 className="mb-1">{registeredUser.fullName}</h6>
                                  <p className="mb-1 text-muted small">@{registeredUser.username}</p>
                                  <p className="mb-0 text-muted small">{registeredUser.email}</p>
                                  {registeredUser.email === user?.email && (
                                    <Badge bg="info" size="sm" className="mt-1">You</Badge>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Features Section */}
          <Row className="mb-5">
            <Col>
              <Card className="features-card">
                <Card.Header className="card-header-modern">
                  <h3>🚀 Coming Soon Features</h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="feature-list">
                        <div className="feature-item">📝 Tweet composition and posting</div>
                        <div className="feature-item">📰 Personalized timeline feed</div>
                        <div className="feature-item">👤 Enhanced user profiles</div>
                        <div className="feature-item">🔄 Follow/Unfollow system</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="feature-list">
                        <div className="feature-item">🔍 Advanced search functionality</div>
                        <div className="feature-item">❤️ Like and retweet features</div>
                        <div className="feature-item">💬 Comments and replies</div>
                        <div className="feature-item">📱 Real-time notifications</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Developer Tools Section */}
          <Row>
            <Col>
              <Card className="tools-card">
                <Card.Header className="card-header-modern">
                  <h3>🔧 Developer Tools</h3>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex gap-3 flex-wrap">
                    <Button 
                      variant="info" 
                      onClick={logDataToConsole}
                      className="tool-btn"
                    >
                      📊 Log Data to Console
                    </Button>
                    <Button 
                      variant="warning" 
                      onClick={clearAllData}
                      className="tool-btn"
                    >
                      🗑️ Clear All Data
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => window.location.reload()}
                      className="tool-btn"
                    >
                      🔄 Refresh Dashboard
                    </Button>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">
                      💡 Use these tools to test functionality and debug your application
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Home;