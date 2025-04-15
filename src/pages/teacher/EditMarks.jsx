import React, { useState } from 'react';
import { Container, Form, Button, Table, Card, Alert, Modal } from 'react-bootstrap';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';

const EditMarks = () => {
  const [studentId, setStudentId] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMark, setCurrentMark] = useState(null);
  const [newMarks, setNewMarks] = useState('');
  const [studentName, setStudentName] = useState('');

  const fetchMarks = async (e) => {
    e.preventDefault();
    
    if (!studentId) {
      setMessage({ text: 'Please enter a student ID', type: 'danger' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // First verify student exists
      const studentsRef = collection(db, 'students');
      const studentQuery = query(studentsRef, where('id', '==', studentId));
      const studentSnapshot = await getDocs(studentQuery);
      
      if (studentSnapshot.empty) {
        setMessage({ text: 'Student ID not found!', type: 'danger' });
        setMarksData([]);
        setStudentName('');
        return;
      }
      
      // Set student name
      setStudentName(studentSnapshot.docs[0].data().name);
      
      // Fetch marks
      const marksRef = collection(db, 'marks');
      const q = query(marksRef, where('studentId', '==', studentId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setMessage({ text: 'No marks found for this student', type: 'info' });
        setMarksData([]);
        return;
      }
      
      const marks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMarksData(marks);
      
    } catch (error) {
      console.error('Error fetching marks:', error);
      setMessage({ text: 'Error fetching marks!', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (mark) => {
    setCurrentMark(mark);
    setNewMarks(mark.marks.toString());
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!currentMark) return;
    
    try {
      setLoading(true);
      
      // Update document in Firestore
      const markRef = doc(db, 'marks', currentMark.id);
      await updateDoc(markRef, {
        marks: Number(newMarks),
        updatedAt: new Date()
      });
      
      // Update the local state to reflect changes
      const updatedMarks = marksData.map(mark => 
        mark.id === currentMark.id 
          ? { ...mark, marks: Number(newMarks) } 
          : mark
      );
      
      setMarksData(updatedMarks);
      setMessage({ text: 'Marks updated successfully!', type: 'success' });
      
    } catch (error) {
      console.error('Error updating marks:', error);
      setMessage({ text: 'Error updating marks!', type: 'danger' });
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Edit Student Marks</h2>
          
          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}
          
          <Form onSubmit={fetchMarks}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control 
                type="text" 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                placeholder="Enter student ID" 
                required 
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-4" 
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Marks'}
            </Button>
          </Form>
          
          {studentName && (
            <Alert variant="info">
              Student Name: {studentName}
            </Alert>
          )}
          
          {marksData.length > 0 && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map(mark => (
                  <tr key={mark.id}>
                    <td>{mark.subject}</td>
                    <td>{mark.semester}</td>
                    <td>{mark.marks}</td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => openEditModal(mark)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Subject: {currentMark?.subject}</Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Label>Semester: {currentMark?.semester}</Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Label>Marks</Form.Label>
              <Form.Control 
                type="number" 
                value={newMarks} 
                onChange={(e) => setNewMarks(e.target.value)} 
                min="0" 
                max="100" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditMarks;
