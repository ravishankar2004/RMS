import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/firebase';
// import { useAuth } from '../AuthContext';

const ViewResults = () => {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser) return;
      
      try {
        // Get student data
        const studentRef = collection(db, 'students');
        const studentQuery = query(studentRef, where('uid', '==', currentUser.uid));
        const studentSnapshot = await getDocs(studentQuery);
        
        if (studentSnapshot.empty) {
          setError('Student profile not found!');
          setLoading(false);
          return;
        }
        
        const student = studentSnapshot.docs[0].data();
        setStudentData(student);
        
        // Get marks data
        const marksRef = collection(db, 'marks');
        const marksQuery = query(marksRef, where('studentId', '==', student.id));
        const marksSnapshot = await getDocs(marksQuery);
        
        if (!marksSnapshot.empty) {
          const marks = marksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setMarksData(marks);
          setFilteredMarks(marks);
        }
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load your results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [currentUser]);

  useEffect(() => {
    if (selectedSemester === 'all') {
      setFilteredMarks(marksData);
    } else {
      const filtered = marksData.filter(mark => mark.semester === selectedSemester);
      setFilteredMarks(filtered);
    }
  }, [selectedSemester, marksData]);

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  // Calculate total, average, etc.
  const calculateStats = () => {
    if (filteredMarks.length === 0) return { total: 0, average: 0, highest: 0, lowest: 0 };
    
    const total = filteredMarks.reduce((sum, mark) => sum + mark.marks, 0);
    const average = total / filteredMarks.length;
    const highest = Math.max(...filteredMarks.map(mark => mark.marks));
    const lowest = Math.min(...filteredMarks.map(mark => mark.marks));
    
    return { total, average, highest, lowest };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading results...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">View Results</h2>
      
      {studentData && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={10}>
                <h4>{studentData.name}</h4>
                <p><strong>Student ID:</strong> {studentData.id}</p>
                <p><strong>Department:</strong> {studentData.department}</p>
              </Col>
              <Col md={2} className="text-end">
                {studentData.profilePicture && (
                  <img 
                    src={studentData.profilePicture} 
                    alt="Profile" 
                    style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Filter by Semester:</Form.Label>
              <Col sm={4}>
                <Form.Control 
                  as="select" 
                  value={selectedSemester} 
                  onChange={handleSemesterChange}
                >
                  <option value="all">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </Form.Control>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      {filteredMarks.length > 0 ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Results</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Semester</th>
                    <th>Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarks.map(mark => (
                    <tr key={mark.id}>
                      <td>{mark.subject}</td>
                      <td>{mark.semester}</td>
                      <td>{mark.marks}</td>
                      <td>{mark.marks >= 40 ? 
                        <span className="text-success">Pass</span> : 
                        <span className="text-danger">Fail</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <h4 className="mb-3">Performance Summary</h4>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>Total Marks</h6>
                      <h2>{stats.total}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>Average</h6>
                      <h2>{stats.average.toFixed(2)}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>Highest</h6>
                      <h2>{stats.highest}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>Lowest</h6>
                      <h2>{stats.lowest}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="text-center mt-3">
                <Button variant="primary" href="/download-results">
                  Download Results
                </Button>
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="info">
          No results found for the selected semester.
        </Alert>
      )}
    </Container>
  );
};

export default ViewResults;
