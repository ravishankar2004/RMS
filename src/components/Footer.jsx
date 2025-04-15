import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <h5>Result Management System</h5>
            <p className="text-muted">
              A comprehensive platform for managing student results efficiently.
            </p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/student-login" className="text-white text-decoration-none">Student Login</a></li>
              <li><a href="/teacher-login" className="text-white text-decoration-none">Teacher Login</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: info@results.com</li>
              <li>Phone: +123-456-7890</li>
              <li>Address: 123 Education St.</li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-3 bg-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} Result Management System. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
