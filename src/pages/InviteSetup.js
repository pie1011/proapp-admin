import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const InviteSetup = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidInvite, setIsValidInvite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInviteValidity = async () => {
      // Check if user has a valid session from invite
      const { data } = await supabase.auth.getSession();
      
      if (!data?.session) {
        setError('Invalid or expired invite link. Please request a new invitation.');
        return;
      }

      // Check if user already has a password set
      if (data.session.user.user_metadata?.password_set) {
        // User already completed setup, redirect to dashboard
        onLogin && onLogin(data.session);
        navigate('/dashboard');
        return;
      }

      setIsValidInvite(true);
      setEmail(data.session.user.email);
    };

    checkInviteValidity();
  }, [navigate, onLogin]);

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Update user password and mark as setup complete
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: { password_set: true }
      });

      if (updateError) throw updateError;
      
      // Get the updated session
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        onLogin && onLogin(data.session);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isValidInvite && !error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Validating invite...</span>
        </div>
      </div>
    );
  }

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
                    Complete Your Account Setup
                  </h3>
                  <p className="text-muted">
                    Set your password to access the admin portal
                  </p>
                </div>
                
                {error && (
                  <Alert variant={error.includes('expired') || error.includes('Invalid') ? 'warning' : 'danger'}>
                    <i className={`fas ${error.includes('expired') || error.includes('Invalid') ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'} me-2`}></i>
                    {error}
                  </Alert>
                )}
                
                {isValidInvite && (
                  <Form onSubmit={handlePasswordSetup}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={email}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Create Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <Form.Text className="text-muted">
                        Must be at least 8 characters long
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit"
                      className="admin-button w-100"
                      disabled={loading}
                    >
                      <i className="fas fa-key me-2"></i>
                      {loading ? 'Setting up account...' : 'Complete Setup & Login'}
                    </Button>
                  </Form>
                )}

                {error && (error.includes('expired') || error.includes('Invalid')) && (
                  <div className="text-center mt-3">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Login
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default InviteSetup;