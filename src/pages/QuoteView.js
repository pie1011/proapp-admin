import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import './QuoteView.css';
import CopyButton from '../components/CopyButton';

const QuoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuoteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchQuoteDetails = async () => {
    try {
      setLoading(true);

      // Fetch quote data
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (quoteError) throw quoteError;

      // Fetch appliance details
      const { data: applianceData, error: applianceError } = await supabase
        .from('appliance_details')
        .select('*')
        .eq('quote_id', id);

      if (applianceError) throw applianceError;

      // Fetch file details
      const { data: fileData, error: fileError } = await supabase
        .from('quote_files')
        .select('*')
        .eq('quote_id', id)
        .order('upload_order');

      if (fileError) throw fileError;

      setQuote(quoteData);
      setAppliances(applianceData || []);
      setFiles(fileData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Container>
          <div className="text-center">
            <Spinner animation="border" className="loading-spinner" />
            <p className="loading-text">Loading quote details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Container>
          <Alert variant="danger" className="error-alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error loading quote: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="quote-view-page">

      {/* Header */}
      <section className="quote-header">
        <Container>
          <Row>
            <Col lg={8}>
              <Button
                variant="outline-light"
                className="mb-3"
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </Button>
              <div className="d-flex justify-content-between align-items-center">
                <img
                  src="/images/img-logo.png"
                  alt="Pro Appliance Installation"
                  className="quote-logo"
                />
                <div className="text-end">
                  <h1 className="quote-title mb-2">Quote Details</h1>
                  <p className="quote-subtitle mb-0">
                    Submitted {formatDate(quote.created_at)} • Quote ID: {quote.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content */}
      <section className="quote-content py-5">
        <Container>
          <Row>

            {/* Customer Information */}
            <Col lg={6} className="mb-4">
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-user me-2"></i>
                  Customer Information
                </Card.Header>
                <Card.Body>
                  <div className="info-item">
                    <strong>Name:</strong> {quote.customer_name}
                    <CopyButton text={quote.customer_name} label="customer name" />
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {quote.email}
                    <CopyButton text={quote.email} label="email" />
                  </div>
                  <div className="info-item">
                    <strong>Primary Phone:</strong> {quote.phone_primary}
                    <CopyButton text={quote.phone_primary} label="phone number" />
                  </div>
                  {quote.phone_secondary && (
                    <div className="info-item">
                      <strong>Secondary Phone:</strong> {quote.phone_secondary}
                      <CopyButton text={quote.phone_secondary} label="secondary phone" />
                    </div>
                  )}
                  <div className="info-item">
                    <strong>Customer Type:</strong>
                    <Badge bg="primary" className="ms-2">{quote.client_type}</Badge>
                    <CopyButton text={quote.client_type} label="customer type" />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Installation Address */}
            <Col lg={6} className="mb-4">
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Installation Address
                </Card.Header>
                <Card.Body>
                  <div className="info-item">
                    <strong>Address:</strong> {quote.street}
                    <CopyButton text={quote.street} label="address" />
                  </div>
                  <div className="info-item">
                    <strong>City:</strong> {quote.city}
                    <CopyButton text={quote.city} label="city" />
                  </div>
                  <div className="info-item">
                    <strong>ZIP Code:</strong> {quote.zip}
                    <CopyButton text={quote.zip} label="ZIP code" />
                  </div>
                  {quote.home_type && (
                    <div className="info-item">
                      <strong>Home Type:</strong> {quote.home_type}
                      <CopyButton text={quote.home_type} label="home type" />
                    </div>
                  )}
                  {quote.floor && (
                    <div className="info-item">
                      <strong>Floor:</strong> {quote.floor}
                      <CopyButton text={quote.floor} label="floor" />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Appliances Section */}
          {appliances.length > 0 && (
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="info-card">
                  <Card.Header className="card-header-custom">
                    <i className="fas fa-tv me-2"></i>
                    Appliances ({appliances.length})
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {appliances.map((appliance, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <Card className="appliance-card">
                            <Card.Body>
                              <h6 className="appliance-type">{appliance.appliance_type}</h6>
                              {appliance.brand && (
                                <div className="appliance-detail">
                                  <strong>Brand:</strong> {appliance.brand}
                                  <CopyButton text={appliance.brand} label="brand" />
                                </div>
                              )}
                              {appliance.model && (
                                <div className="appliance-detail">
                                  <strong>Model:</strong> {appliance.model}
                                  <CopyButton text={appliance.model} label="model number" />
                                </div>
                              )}
                              {appliance.notes && (
                                <div className="appliance-detail">
                                  <strong>Notes:</strong> {appliance.notes}
                                  <CopyButton text={appliance.notes} label="notes" />
                                </div>
                              )}
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

          {/* Services Section */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-truck me-2"></i>
                  Services & Options
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="service-item">
                        <i className="fas fa-shipping-fast me-2"></i>
                        <strong>Delivery:</strong>
                        <Badge bg={quote.delivery === 'Yes' ? 'success' : 'secondary'} className="ms-2">
                          {quote.delivery}
                        </Badge>
                        <CopyButton text={quote.delivery} label="delivery preference" />
                      </div>
                      <div className="service-item">
                        <i className="fas fa-tools me-2"></i>
                        <strong>Uninstall Old:</strong>
                        <Badge bg={quote.uninstall_old === 'Yes' ? 'success' : 'secondary'} className="ms-2">
                          {quote.uninstall_old}
                        </Badge>
                        <CopyButton text={quote.uninstall_old} label="uninstall preference" />
                      </div>
                      <div className="service-item">
                        <i className="fas fa-trash me-2"></i>
                        <strong>Haul Away:</strong>
                        <Badge bg={quote.haul_away === 'Yes' ? 'success' : 'secondary'} className="ms-2">
                          {quote.haul_away}
                        </Badge>
                        <CopyButton text={quote.haul_away} label="haul away preference" />
                      </div>
                    </Col>
                    <Col md={6}>
                      {quote.field_measure && (
                        <div className="service-item">
                          <i className="fas fa-ruler me-2"></i>
                          <strong>Field Measure:</strong>
                          <Badge bg={quote.field_measure === 'Yes' ? 'info' : 'secondary'} className="ms-2">
                            {quote.field_measure}
                          </Badge>
                          <CopyButton text={quote.field_measure} label="field measure preference" />
                        </div>
                      )}
                      {quote.purchased && (
                        <div className="service-item">
                          <i className="fas fa-shopping-cart me-2"></i>
                          <strong>Appliances Purchased:</strong>
                          <Badge bg={quote.purchased === 'Yes' ? 'info' : 'warning'} className="ms-2">
                            {quote.purchased}
                          </Badge>
                          <CopyButton text={quote.purchased} label="purchase status" />
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Site Details Section */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-home me-2"></i>
                  Site Details
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      {quote.stairs && (
                        <div className="info-item">
                          <strong>Stairs:</strong> {quote.stairs}
                        </div>
                      )}
                      {quote.stairs_number && (
                        <div className="info-item">
                          <strong>Number of Stairs:</strong> {quote.stairs_number}
                        </div>
                      )}
                      {quote.stairs_turns && (
                        <div className="info-item">
                          <strong>Turns in Stairs:</strong> {quote.stairs_turns}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      {quote.parking && (
                        <div className="info-item">
                          <strong>Parking:</strong> {quote.parking}
                        </div>
                      )}
                      {quote.parking_notes && (
                        <div className="info-item">
                          <strong>Parking Notes:</strong> {quote.parking_notes}
                          <CopyButton text={quote.parking_notes} label="parking notes" />
                        </div>
                      )}
                      {quote.gate_code && (
                        <div className="info-item">
                          <strong>Gate Code:</strong> {quote.gate_code}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Project Timeline Section */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Project Timeline
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      {quote.preferred_date && (
                        <div className="info-item">
                          <strong>Preferred Date:</strong> {quote.preferred_date}
                        </div>
                      )}
                      {quote.preferred_time && quote.preferred_time.length > 0 && (
                        <div className="info-item">
                          <strong>Preferred Time:</strong>
                          <div className="time-badges mt-2">
                            {quote.preferred_time.map((time, index) => (
                              <Badge key={index} bg="info" className="me-2 mb-1">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      {quote.purchased && (
                        <div className="info-item">
                          <strong>Appliances Purchased:</strong>
                          <Badge bg={quote.purchased === 'Yes' ? 'success' : 'warning'} className="ms-2">
                            {quote.purchased}
                          </Badge>
                        </div>
                      )}
                      {quote.field_measure && (
                        <div className="info-item">
                          <strong>Field Measure Needed:</strong>
                          <Badge bg={quote.field_measure === 'Yes' ? 'warning' : 'success'} className="ms-2">
                            {quote.field_measure}
                          </Badge>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Files Section */}
          {files.length > 0 && (
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="info-card">
                  <Card.Header className="card-header-custom">
                    <i className="fas fa-paperclip me-2"></i>
                    Uploaded Files ({files.length})
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {files.map((file, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <Card className="file-card">
                            <Card.Body className="text-center">
                              <i className="fas fa-file-alt file-icon mb-2"></i>
                              <h6 className="file-name">{file.file_name}</h6>
                              <small className="file-info text-muted">
                                {(file.file_size / 1024 / 1024).toFixed(2)} MB
                              </small>
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

          {/* Additional Details */}
          {quote.additional_details && (
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="info-card">
                  <Card.Header className="card-header-custom">
                    <i className="fas fa-clipboard me-2"></i>
                    Additional Details
                    <CopyButton text={quote.additional_details} label="additional details" />
                  </Card.Header>
                  <Card.Body>
                    <p className="details-text">{quote.additional_details}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default QuoteView;