import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function StudentDashboard() {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [recentMarks, setRecentMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        // Fetch student profile data
        const studentRef = collection(db, 'students');
        const studentQuery = query(studentRef, where('uid', '==', currentUser.uid));
        const studentSnapshot = await getDocs(studentQuery);
        
        if (!studentSnapshot.empty) {
          setStudentData(studentSnapshot.docs[0].data());
          
          // Fetch recent marks
          const marksRef = collection(db, 'marks');
          const marksQuery = query(marksRef, where('studentId', '==', studentSnapshot.docs[0].data().id));
          const marksSnapshot = await getDocs(marksQuery);
          
          const marksData = marksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort by timestamp or date if available
          setRecentMarks(marksData.slice(0, 5)); // Show only 5 recent marks
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchStudentData();
    }
  }, [currentUser]);

  if (loading) {
    return <Container className="text-center py-5"><h3>Loading...</h3></Container>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Student Dashboard</h1>
      
      {studentData && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={9}>
                <Card.Title>Welcome, {studentData.name}</Card.Title>
                <Card.Text>Student ID: {studentData.id}</Card.Text>
                <Card.Text>Department: {studentData.department || 'Not specified'}</Card.Text>
              </Col>
              <Col md={3} className="text-end">
                {studentData.profilePicture && (
                  <img 
                    src={studentData.profilePicture} 
                    alt="Profile" 
                    style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Results</Card.Title>
              {recentMarks.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Semester</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMarks.map(mark => (
                      <tr key={mark.id}>
                        <td>{mark.subject}</td>
                        <td>{mark.semester}</td>
                        <td>{mark.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center mt-3">No marks available yet.</p>
              )}
              
              <div className="text-center mt-3">
                <Link to="/view-results">
                  <Button variant="primary">View All Results</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Links</Card.Title>
              <div className="d-grid gap-2">
                <Link to="/view-results">
                  <Button variant="outline-primary" className="w-100">View Results</Button>
                </Link>
                <Link to="/download-results">
                  <Button variant="outline-success" className="w-100">Download Results</Button>
                </Link>
                <Link to="/student-profile">
                  <Button variant="outline-info" className="w-100">Update Profile</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDashboard;
