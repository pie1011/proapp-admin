import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const Login = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-shield-alt text-primary" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3" style={{ color: 'var(--text-dark)' }}>
                    Pro Appliance Admin
                  </h3>
                  <p className="text-muted">Secure Portal Access</p>
                </div>
                
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" />
                  </Form.Group>
                  
                  <Button className="admin-button w-100">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login to Admin Panel
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