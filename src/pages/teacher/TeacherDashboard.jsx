import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { useAuth } from '../../AuthContext';
// import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function TeacherDashboard() {
  const { currentUser } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherData() {
      try {
        const teacherRef = collection(db, 'teachers');
        const q = query(teacherRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setTeacherData(querySnapshot.docs[0].data());
        }
        
        // Count total students
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        setStudentsCount(studentsSnapshot.size);
        
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchTeacherData();
    }
  }, [currentUser]);

  if (loading) {
    return <Container className="text-center py-5"><h3>Loading...</h3></Container>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Teacher Dashboard</h1>
      
      {teacherData && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={9}>
                <Card.Title>Welcome, {teacherData.name}</Card.Title>
                <Card.Text>Email: {teacherData.email}</Card.Text>
                <Card.Text>Subject: {teacherData.subject || 'Not specified'}</Card.Text>
              </Col>
              <Col md={3} className="text-end">
                {teacherData.profilePicture && (
                  <img 
                    src={teacherData.profilePicture} 
                    alt="Profile" 
                    style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <h3 className="mb-3">Quick Actions</h3>
      <Row>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Manage Marks</Card.Title>
              <Card.Text>Add, edit, or delete student marks</Card.Text>
              <div className="d-flex flex-column gap-2">
                <Link to="/add-marks">
                  <Button variant="success" className="w-100">Add Marks</Button>
                </Link>
                <Link to="/edit-marks">
                  <Button variant="warning" className="w-100">Edit Marks</Button>
                </Link>
                <Link to="/delete-marks">
                  <Button variant="danger" className="w-100">Delete Marks</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Search Students</Card.Title>
              <Card.Text>Find and view student details and marks</Card.Text>
              <Link to="/search-student">
                <Button variant="primary" className="w-100">Search Students</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Students Overview</Card.Title>
              <Card.Text>Total Students: {studentsCount}</Card.Text>
              <Link to="/search-student">
                <Button variant="info" className="w-100">View All Students</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherDashboard;
