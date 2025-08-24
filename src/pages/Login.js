import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for existing session (non-invite callbacks)
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        onLogin && onLogin(data.session);
        navigate('/dashboard');
      }
    };

    handleAuthCallback();
  }, [navigate, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      onLogin && onLogin(data.session);
      navigate('/dashboard');
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
                    Pro Appliance Admin
                  </h3>
                  <p className="text-muted">
                    Secure Portal Access
                  </p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Button 
                    type="submit"
                    className="admin-button w-100"
                    disabled={loading}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    {loading ? 'Signing in...' : 'Login to Admin Panel'}
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