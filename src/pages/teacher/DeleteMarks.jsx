import React, { useState } from 'react';
import { Container, Form, Button, Table, Card, Alert, Modal } from 'react-bootstrap';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase';

const DeleteMarks = () => {
  const [studentId, setStudentId] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [markToDelete, setMarkToDelete] = useState(null);
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

  const confirmDelete = (mark) => {
    setMarkToDelete(mark);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!markToDelete) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'marks', markToDelete.id));
      
      // Update the UI by removing the deleted mark
      setMarksData(marksData.filter(mark => mark.id !== markToDelete.id));
      setMessage({ text: 'Mark deleted successfully!', type: 'success' });
      
    } catch (error) {
      console.error('Error deleting mark:', error);
      setMessage({ text: 'Error deleting mark!', type: 'danger' });
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setMarkToDelete(null);
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Delete Student Marks</h2>
          
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
                        variant="danger" 
                        size="sm" 
                        onClick={() => confirmDelete(mark)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete marks for {markToDelete?.subject} (Semester {markToDelete?.semester})?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteMarks;
