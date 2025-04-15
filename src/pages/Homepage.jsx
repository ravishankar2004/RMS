import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

function Homepage() {
  const { currentUser, userRole } = useAuth();

  const renderAuthorizedContent = () => {
    if (currentUser && userRole === 'student') {
      return (
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Welcome back, Student!</Card.Title>
            <Card.Text>
              You are already logged in. Go to your dashboard to view your results.
            </Card.Text>
            <Link to="/student-dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </Card.Body>
        </Card>
      );
    } else if (currentUser && userRole === 'teacher') {
      return (
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Welcome back, Teacher!</Card.Title>
            <Card.Text>
              You are already logged in. Go to your dashboard to manage student results.
            </Card.Text>
            <Link to="/teacher-dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <>
          <h1 className="text-center mb-5">Result Management System</h1>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4">
              <Card className="text-center">
                <Card.Header as="h5">For Students</Card.Header>
                <Card.Body>
                  <Card.Text>
                    View your semester results, download mark sheets, and manage your profile.
                  </Card.Text>
                  <Link to="/student-login">
                    <Button variant="primary" className="me-2">Login</Button>
                  </Link>
                  <Link to="/student-signup">
                    <Button variant="outline-primary">Sign Up</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5} className="mb-4">
              <Card className="text-center">
                <Card.Header as="h5">For Teachers</Card.Header>
                <Card.Body>
                  <Card.Text>
                    Manage student marks, generate reports, and oversee academic performance.
                  </Card.Text>
                  <Link to="/teacher-login">
                    <Button variant="success" className="me-2">Login</Button>
                  </Link>
                  <Link to="/teacher-signup">
                    <Button variant="outline-success">Sign Up</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      );
    }
  };

  return (
    <Container className="py-5">
      {renderAuthorizedContent()}
    </Container>
  );
}

export default Homepage;
