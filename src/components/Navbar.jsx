import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavigationBar() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  
  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch {
      console.error("Failed to log out");
    }
  }
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Result Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!currentUser && (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav>
          )}
          
          {currentUser && userRole === 'student' && (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/student-dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/view-results">View Results</Nav.Link>
              <Nav.Link as={Link} to="/download-results">Download Results</Nav.Link>
              <Nav.Link as={Link} to="/student-profile">Profile</Nav.Link>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          )}
          
          {currentUser && userRole === 'teacher' && (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/teacher-dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/add-marks">Add Marks</Nav.Link>
              <Nav.Link as={Link} to="/edit-marks">Edit Marks</Nav.Link>
              <Nav.Link as={Link} to="/delete-marks">Delete Marks</Nav.Link>
              <Nav.Link as={Link} to="/search-student">Search Student</Nav.Link>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
