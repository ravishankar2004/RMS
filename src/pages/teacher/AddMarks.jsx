import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';

const AddMarks = () => {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [studentName, setStudentName] = useState('');

  const verifyStudent = async () => {
    if (!studentId) return false;
    
    try {
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('id', '==', studentId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        setStudentName(studentData.name);
        return true;
      } else {
        setMessage({ text: 'Student ID not found!', type: 'danger' });
        setStudentName('');
        return false;
      }
    } catch (error) {
      console.error('Error verifying student:', error);
      setMessage({ text: 'Error verifying student!', type: 'danger' });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!studentId || !subject || !semester || !marks) {
      setMessage({ text: 'All fields are required!', type: 'danger' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Verify student exists
      const studentExists = await verifyStudent();
      if (!studentExists) {
        setLoading(false);
        return;
      }
      
      // Add marks to database
      await addDoc(collection(db, 'marks'), {
        studentId,
        subject,
        semester,
        marks: Number(marks),
        createdAt: new Date()
      });
      
      setMessage({ text: 'Marks added successfully!', type: 'success' });
      
      // Reset form
      setSubject('');
      setMarks('');
      
    } catch (error) {
      console.error('Error adding marks:', error);
      setMessage({ text: 'Failed to add marks!', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Add Student Marks</h2>
          
          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control 
                type="text" 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                placeholder="Enter student ID" 
                required
              />
              {studentName && (
                <Form.Text className="text-success">
                  Student Name: {studentName}
                </Form.Text>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control 
                as="select" 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </Form.Control>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Enter subject name" 
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Marks</Form.Label>
              <Form.Control 
                type="number" 
                value={marks} 
                onChange={(e) => setMarks(e.target.value)} 
                placeholder="Enter marks (0-100)" 
                min="0" 
                max="100" 
                required
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Marks'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddMarks;
