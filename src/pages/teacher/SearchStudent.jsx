import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Table, Alert } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from './src/firebase/firebase';

const SearchStudent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('id');
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setMessage({ text: 'Please enter a search term', type: 'danger' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // Create query based on search option
      const studentsRef = collection(db, 'students');
      let studentQuery;
      
      if (searchOption === 'id') {
        studentQuery = query(studentsRef, where('id', '==', searchTerm));
      } else if (searchOption === 'name') {
        // For name search, we do a simple equality check
        // In a real app, you might want to use a more sophisticated search mechanism
        studentQuery = query(studentsRef, where('name', '==', searchTerm));
      } else {
        studentQuery = query(studentsRef, where('department', '==', searchTerm));
      }
      
      const studentSnapshot = await getDocs(studentQuery);
      
      if (studentSnapshot.empty) {
        setMessage({ text: 'No student found with the given criteria', type: 'info' });
        setStudentData(null);
        setMarksData([]);
        return;
      }
      
      // For simplicity, take the first match
      // In a real app, you might want to display multiple results
      const student = {
        id: studentSnapshot.docs[0].id,
        ...studentSnapshot.docs[0].data()
      };
      
      setStudentData(student);
      
      // Fetch marks for the student
      const marksRef = collection(db, 'marks');
      const marksQuery = query(marksRef, where('studentId', '==', student.id));
      const marksSnapshot = await getDocs(marksQuery);
      
      if (marksSnapshot.empty) {
        setMarksData([]);
      } else {
        const marks = marksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setMarksData(marks);
      }
      
    } catch (error) {
      console.error('Error searching for student:', error);
      setMessage({ text: 'Error searching for student!', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mb-4">
        <Card.Body>
          <h2 className="text-center mb-4">Search Student</h2>
          
          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}
          
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search By</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={searchOption} 
                    onChange={(e) => setSearchOption(e.target.value)}
                  >
                    <option value="id">Student ID</option>
                    <option value="name">Name</option>
                    <option value="department">Department</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Search Term</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder={`Enter student ${searchOption}`} 
                    required 
                  />
                </Form.Group>
              </Col>
              
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3" 
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {studentData && (
        <Card className="mb-4">
          <Card.Body>
            <h3 className="mb-3">Student Information</h3>
            <Row>
              <Col md={9}>
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>Student ID:</strong> {studentData.id}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>Department:</strong> {studentData.department}</p>
              </Col>
              <Col md={3} className="text-end">
                {studentData.profilePicture && (
                  <img 
                    src={studentData.profilePicture} 
                    alt="Profile" 
                    style={{width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover'}}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      {studentData && (
        <Card>
          <Card.Body>
            <h3 className="mb-3">Student Marks</h3>
            
            {marksData.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Semester</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {marksData.map(mark => (
                    <tr key={mark.id}>
                      <td>{mark.subject}</td>
                      <td>{mark.semester}</td>
                      <td>{mark.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No marks available for this student.</Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SearchStudent;
