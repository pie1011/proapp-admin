import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import './QuoteView.css';
import CopyButton from '../components/CopyButton';
import FilePreview from '../components/FilePreview';

const QuoteViewNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEntered, setIsEntered] = useState(false);

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
      setIsEntered(quoteData.entered_status || false); 

      setAppliances(applianceData || []);
      setFiles(fileData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


const toggleEnteredStatus = async () => {
  try {
    const newStatus = !isEntered;
    console.log('Attempting to update quote:', id, 'to status:', newStatus);
    
    // Update in database
    const { data, error } = await supabase
      .from('quotes')
      .update({ entered_status: newStatus })
      .eq('id', id);
    
    console.log('Supabase response - data:', data, 'error:', error);
    
    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
      return;
    }
    
    // Update local state
    setIsEntered(newStatus);
    console.log('Successfully updated status to:', newStatus);
  } catch (error) {
    console.error('Catch block error:', error);
    alert('Failed to update status: ' + error.message);
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
    <div className="quote-view-new-page">

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

                  <div className="d-flex align-items-center justify-content-between">
                    <p className="quote-subtitle mb-0">
                      <strong>Submitted:</strong> <i className="small">{formatDate(quote.created_at)}</i>  • <strong>ID:</strong> <i className="small">{quote.id.slice(0, 8)}</i>
                    </p>
                    <Button
                      variant={isEntered ? "success" : "warning"}
                      size="sm"
                      onClick={toggleEnteredStatus}
                      className="status-toggle-btn ms-3"
                    >
                      {isEntered ? (
                        <>
                          <i className="fas fa-check me-1"></i>
                          Entered
                        </>
                      ) : (
                        <>
                          <i className="fas fa-clock me-1"></i>
                          Not Entered
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content */}
      <section className="quote-content py-4">
        <Container>

          {/* Top Row */}
          <Row className="mb-3">
            {/* Column 1: Customer Information */}
            <Col lg={6} className="mb-3 d-flex flex-column">

              {/* Customer Information */}
              <Card className="info-card">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-user me-2"></i>
                  Customer Information
                </Card.Header>
                <Card.Body>
                  <div className="info-item">
                    <strong>Name:</strong>
                    <span>{quote.customer_name}</span>
                    <CopyButton text={quote.customer_name} label="customer name" />
                  </div>
                  <div className="info-item">
                    <strong>Primary phone:</strong>
                    <span>{quote.phone_primary}</span>
                    <CopyButton text={quote.phone_primary} label="phone number" />
                  </div>
                  {quote.phone_secondary && (
                    <div className="info-item">
                      <strong>Secondary phone:</strong>
                      <span>{quote.phone_secondary}</span>
                      <CopyButton text={quote.phone_secondary} label="secondary phone" />
                    </div>
                  )}
                  <div className="info-item">
                    <strong>Email:</strong>
                    <span>{quote.email}</span>
                    <CopyButton text={quote.email} label="email" />
                  </div>

                  {/* Installation Address Subtitle */}
                  <h6 className="section-subtitle mt-3 mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Installation Address
                  </h6>
                  <div className="info-item">
                    <strong>Address:</strong>
                    <span>{quote.street}</span>
                    <CopyButton text={quote.street} label="address" />
                  </div>
                  <div className="info-item">
                    <strong>City:</strong>
                    <span>{quote.city}</span>
                    <CopyButton text={quote.city} label="city" />
                  </div>
                  <div className="info-item">
                    <strong>Zip:</strong>
                    <span>{quote.zip}</span>
                    <CopyButton text={quote.zip} label="ZIP code" />
                  </div>

                  {/* Company Information Subtitle */}
                  <h6 className="section-subtitle mt-3 mb-2">
                    <i className="fas fa-building me-2"></i>
                    Company Information
                  </h6>
                  <div className="info-item">
                    <strong>Company name:</strong>
                    <span>{quote.company_name || 'Not provided'}</span>
                    {quote.company_name && <CopyButton text={quote.company_name} label="company name" />}
                  </div>
                  <div className="info-item">
                    <strong>Company address:</strong>
                    <span>{quote.company_address || 'Not provided'}</span>
                    {quote.company_address && <CopyButton text={quote.company_address} label="company address" />}
                  </div>
                  <div className="info-item">
                    <strong>Company phone:</strong>
                    <span>{quote.company_phone || 'Not provided'}</span>
                    {quote.company_phone && <CopyButton text={quote.company_phone} label="company phone" />}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Column 2: Project Specs */}
            <Col lg={6} className="mb-3">
              <Card className="info-card h-100">
                <Card.Header className="card-header-custom">
                  <i className="fas fa-clipboard-list me-2"></i>
                  Project Specs
                </Card.Header>
                <Card.Body>
                  <div className="info-item">
                    <strong>Customer type:</strong>
                    <Badge bg="primary" className="badge">{quote.client_type}</Badge>
                  </div>
                  <div className="info-item">
                    <strong>Uninstall old unit(s)?</strong>
                    <Badge bg={quote.uninstall_old === 'Yes' ? 'success' : 'secondary'} className="badge">
                      {quote.uninstall_old || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  <div className="info-item">
                    <strong>Haul away old unit(s)?</strong>
                    <Badge bg={quote.haul_away === 'Yes' ? 'success' : 'secondary'} className="badge">
                      {quote.haul_away || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  <div className="info-item">
                    <strong>Delivery required?</strong>
                    <Badge bg={quote.delivery === 'Yes' ? 'success' : 'secondary'} className="badge">
                      {quote.delivery || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  {quote.pickup_location && (
                    <div className="info-item">
                      <strong>Pickup location:</strong>
                      <span>{quote.pickup_location}</span>
                      <CopyButton text={quote.pickup_location} label="pickup location" />
                    </div>
                  )}
                  {quote.home_type && (
                    <div className="info-item">
                      <strong>Type of home:</strong>
                      <span>{quote.home_type}</span>
                      <CopyButton text={quote.home_type} label="home type" />
                    </div>
                  )}
                  {quote.floor && (
                    <div className="info-item">
                      <strong>Installation floor/level:</strong>
                      <span>{quote.floor}</span>
                      <CopyButton text={quote.floor} label="floor" />
                    </div>
                  )}
                  <div className="info-item">
                    <strong>Stairs?</strong>
                    <Badge bg={quote.stairs === 'Yes' ? 'warning' : 'secondary'} className="badge">
                      {quote.stairs || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  {quote.parking_notes && (
                    <div className="info-item">
                      <strong>Parking notes:</strong>
                      <span>{quote.parking_notes}</span>
                      <CopyButton text={quote.parking_notes} label="parking notes" />
                    </div>
                  )}

                  <div className="info-item">
                    <strong>Field measure?</strong>
                    <Badge bg={quote.field_measure === 'Yes' ? 'success' : 'warning'} className="badge">
                      {quote.field_measure || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  <div className="info-item">
                    <strong>Appliances purchased?</strong>
                    <Badge bg={quote.purchased === 'Yes' ? 'success' : 'warning'} className="badge">
                      {quote.purchased || 'No'}
                    </Badge>
                    <div className="spacer"></div>
                  </div>
                  {quote.preferred_date && (
                    <div className="info-item">
                      <strong>Requested date:</strong>
                      <span>{quote.preferred_date}</span>
                      <CopyButton text={quote.preferred_date} label="preferred date" />
                    </div>
                  )}
                  {quote.preferred_time && quote.preferred_time.length > 0 && (
                    <div className="info-item">
                      <strong>Requested time:</strong>
                      <div className="time-badges mt-1">
                        {quote.preferred_time.map((time, index) => (
                          <Badge key={index} bg="info" className="me-1 mb-1">
                            {time}
                          </Badge>
                        ))}
                      </div>
                      <CopyButton text={quote.preferred_time.join(', ')} label="preferred time" />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Middle Row - Appliances */}
          {appliances.length > 0 && (
            <Row className="mb-3">
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
                                  <strong>Brand:</strong>
                                  <span>{appliance.brand}</span>
                                  <CopyButton text={appliance.brand} label="brand" />
                                </div>
                              )}
                              {appliance.model && (
                                <div className="appliance-detail">
                                  <strong>Model:</strong>
                                  <span>{appliance.model}</span>
                                  <CopyButton text={appliance.model} label="model number" />
                                </div>
                              )}
                              {appliance.notes && (
                                <div className="appliance-detail">
                                  <strong>Notes:</strong>
                                  <span>{appliance.notes}</span>
                                  <CopyButton text={appliance.notes} label="notes" />
                                </div>
                              )}
                              {appliance.specifics && (
                                <div className="appliance-detail">
                                  <strong>Specifics:</strong>
                                  <span>{appliance.specifics}</span>
                                  <CopyButton text={appliance.specifics} label="specifics" />
                                </div>
                              )}
                              {appliance.special_requirements && (
                                <div className="appliance-detail">
                                  <strong>Special requirements:</strong>
                                  <span>{appliance.special_requirements}</span>
                                  <CopyButton text={appliance.special_requirements} label="special requirements" />
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

          {/* Bottom Row */}
          <Row className="mb-3">
            <Col lg={12}>
              {/* Additional details */}
              {quote.additional_details && (
                <Card className="info-card mb-3">
                  <Card.Header className="card-header-custom">
                    <i className="fas fa-clipboard me-2"></i>
                    Additional details
                  </Card.Header>
                  <Card.Body>
                    <p className="details-text">
                      {quote.additional_details}
                      <CopyButton text={quote.additional_details} label="additional details" />
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Uploaded files */}
              {files.length > 0 && (
                <Card className="info-card">
                  <Card.Header className="card-header-custom">
                    <i className="fas fa-paperclip me-2"></i>
                    Uploaded files ({files.length})
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {files.map((file, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <FilePreview file={file} />
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

        </Container>
      </section>
    </div>
  );
};

export default QuoteViewNew;