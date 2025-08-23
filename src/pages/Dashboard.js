import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import { seedDatabase } from '../utils/seedData';
import './Dashboard.css';

const Dashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          customer_name,
          email,
          phone_primary,
          created_at,
          appliance_details(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredAndSortedQuotes = () => {
    let filtered = quotes;

    if (searchTerm) {
      filtered = quotes.filter(quote =>
        quote.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.phone_primary?.includes(searchTerm)
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Container>
          <div className="text-center">
            <Spinner animation="border" className="loading-spinner" />
            <p className="loading-text">Loading quotes...</p>
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
            Error loading data: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Hero Section */}
      <section className="dashboard-hero">
        <Container>
          <Row>
            <Col lg={8}>
              <h1 className="dashboard-title">
                <img
                  src="/images/img-logo.png"
                  alt="Pro Appliance Installation"
                  className="dashboard-logo me-3"
                />
              </h1>
              <h2 className="dashboard-subtitle">
                Admin Dashboard: Quote Management & Customer Overview
              </h2>
            </Col>
            <Col lg={4} className="d-flex align-items-center justify-content-lg-end justify-content-start">
              <div className="header-buttons">
                <Button
                  variant="light"
                  size="sm"
                  className="me-2"
                  onClick={async () => {
                    if (window.confirm('This will add test quotes to your database. Continue?')) {
                      try {
                        await seedDatabase();
                        await fetchQuotes();
                        alert('Successfully added test quotes!');
                      } catch (error) {
                        alert('Error seeding database: ' + error.message);
                      }
                    }
                  }}
                >
                  <i className="fas fa-database me-2"></i>
                  Seed Data
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={fetchQuotes}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="dashboard-content">
        <Container>


          {/* Stats Cards */}
          <div className="stats-container">
            <Row>
              <Col md={4}>
                <Card className="stats-card text-center">
                  <Card.Body>
                    <div className="stats-icon primary">
                      <i className="fas fa-quote-right"></i>
                    </div>
                    <div className="stats-number">{quotes.length}</div>
                    <div className="stats-label">Total Quotes</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card text-center">
                  <Card.Body>
                    <div className="stats-icon success">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="stats-number">
                      {quotes.filter(q => {
                        const today = new Date().toDateString();
                        const quoteDate = new Date(q.created_at).toDateString();
                        return today === quoteDate;
                      }).length}
                    </div>
                    <div className="stats-label">Today's Quotes</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card text-center">
                  <Card.Body>
                    <div className="stats-icon warning">
                      <i className="fas fa-filter"></i>
                    </div>
                    <div className="stats-number">{filteredAndSortedQuotes().length}</div>
                    <div className="stats-label">Filtered Results</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Search Controls */}
          <div className="search-container">
            <Row className="align-items-end">
              <Col md={6}>
                <label className="form-label fw-bold text-muted">Search Quotes</label>
                <div className="position-relative">
                  <i className="fas fa-search position-absolute search-icon"></i>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={3}>
                <label className="form-label fw-bold text-muted">Sort By</label>
                <select
                  className="form-select sort-select"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="created_at">Date Created</option>
                  <option value="customer_name">Customer Name</option>
                  <option value="email">Email Address</option>
                </select>
              </Col>
              <Col md={3}>
                <label className="form-label fw-bold text-muted">Order</label>
                <Button
                  variant="outline-primary"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="w-100 sort-button"
                >
                  <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} me-2`}></i>
                  {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </Col>
            </Row>
          </div>


          {/* Main Table */}
          <Card className="table-container">
            <Card.Header className="table-header">
              <h3 className="table-title">
                <i className="fas fa-list me-2"></i>
                Quote Requests ({filteredAndSortedQuotes().length}{searchTerm ? ` of ${quotes.length}` : ''})
              </h3>
            </Card.Header>
            <Card.Body className="p-0">
              {(() => {
                const displayQuotes = filteredAndSortedQuotes();
                return displayQuotes.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-inbox empty-icon"></i>
                    <p className="empty-text">
                      {quotes.length === 0 ? 'No quotes found in the database' : 'No quotes match your search criteria'}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="link"
                        onClick={() => setSearchTerm('')}
                        className="clear-search-btn"
                      >
                        Clear search and show all quotes
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table responsive hover className="quotes-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Appliances</th>
                        <th>Status</th>

                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayQuotes.map(quote => (
                        <tr key={quote.id}>
                          <td>
                            <div className="customer-name">{quote.customer_name}</div>
                            <div className="customer-email">{quote.email}</div>
                          </td>
                          <td className="contact-info">{quote.phone_primary}</td>
                          <td className="contact-info">{formatDate(quote.created_at)}</td>
                          <td>
                            <Badge className="appliance-badge">
                              {quote.appliance_details?.length || 0} items
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={quote.entered_status ? "success" : "secondary"} className="status-badge">
                              {quote.entered_status ? "Entered" : "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => window.location.href = `/quote/${quote.id}`}
                              className="view-details-btn"
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                );
              })()}
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Dashboard;