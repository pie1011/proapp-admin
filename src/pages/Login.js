import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
const [isInviteFlow, setIsInviteFlow] = useState(false);
const [inviteError, setInviteError] = useState('');


  // Handle invitation tokens and auth callbacks
  useEffect(() => {
  const handleAuthCallback = async () => {
    // Check for invite-related URL parameters
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    const errorCode = searchParams.get('error_code');

    if (errorCode === 'otp_expired') {
      setInviteError('This invitation link has expired. Please request a new invitation from your administrator.');
      return;
    }

    // If this is an invite link, show password setup form instead of auto-login
    if (accessToken && type === 'invite') {
      setIsInviteFlow(true);
      // DON'T auto-login here - let them set their password first
      return;
    }

    // Only auto-login for non-invite callbacks
    if (accessToken && type !== 'invite') {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        onLogin && onLogin(data.session);
        navigate('/dashboard');
      }
    }
  };



  handleAuthCallback();
}, [searchParams, navigate, onLogin]);


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (isInviteFlow) {
      // This is password setup for an invited user
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      // After setting password, they should be automatically logged in
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        onLogin && onLogin(data.session);
        navigate('/dashboard');
      }
    } else {
      // Regular login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      onLogin && onLogin(data.session);
      navigate('/dashboard');
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--light-gray)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="shadow-lg border-0">
              <Card.Header
                className="text-center py-4"
                style={{
                  background: 'linear-gradient(135deg, var(--dark-gray) 0%, var(--primary-blue-dark) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem 0.375rem 0 0'
                }}
              >
                <img
                  src="/images/img-logo.png"
                  alt="Pro Appliance Installation"
                  style={{ height: '60px' }}
                />
              </Card.Header>

              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h3 style={{ color: 'var(--dark-gray)' }}>
                    {isInviteFlow ? 'Set Your Password' : 'Pro Appliance Admin'}
                  </h3>
                  <p className="text-muted">
                    {isInviteFlow ? 'Complete your account setup' : 'Secure Portal Access'}
                  </p>
                </div>

                {/* Show expired invite error */}
                {inviteError && (
                  <Alert variant="warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {inviteError}
                  </Alert>
                )}

                {/* Show regular login error */}
                {error && !inviteError && <Alert variant="danger">{error}</Alert>}

                {/* Regular Login Form OR Password Setup Form */}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isInviteFlow}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      {isInviteFlow ? 'Create Password' : 'Password'}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={isInviteFlow ? 'Enter your new password' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {isInviteFlow && (
                      <Form.Text className="text-muted">
                        Choose a secure password with at least 8 characters
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    className="admin-button w-100"
                    disabled={loading || !!inviteError}
                  >
                    <i className={`fas ${isInviteFlow ? 'fa-key' : 'fa-sign-in-alt'} me-2`}></i>
                    {loading ?
                      (isInviteFlow ? 'Setting up account...' : 'Signing in...') :
                      (isInviteFlow ? 'Complete Setup' : 'Login to Admin Panel')
                    }
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;