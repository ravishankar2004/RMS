import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/firebase';
// import { useAuth } from '../AuthContext';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

const DownloadResults = () => {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

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

  const getFilteredMarks = () => {
    if (selectedSemester === 'all') {
      return marksData;
    } else {
      return marksData.filter(mark => mark.semester === selectedSemester);
    }
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const generatePDF = async () => {
    if (!studentData) return;
    
    setDownloading(true);
    
    try {
      const filteredMarks = getFilteredMarks();
      const doc = new jsPDF();
      
      // Add school logo or header
      // doc.addImage(logoImg, 'PNG', 10, 10, 40, 40);
      
      // Title
      doc.setFontSize(18);
      doc.text('Result Management System', 105, 15, { align: 'center' });
      
      // Semester Info
      doc.setFontSize(14);
      doc.text(
        selectedSemester === 'all' ? 'All Semesters Result' : `Semester ${selectedSemester} Result`, 
        105, 
        25, 
        { align: 'center' }
      );
      
      // Student Information
      doc.setFontSize(12);
      doc.text(`Name: ${studentData.name}`, 15, 40);
      doc.text(`Student ID: ${studentData.id}`, 15, 48);
      doc.text(`Department: ${studentData.department}`, 15, 56);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 64);
      
      // Marks Table
      const tableColumn = ["Subject", "Semester", "Marks", "Status"];
      const tableRows = [];
      
      filteredMarks.forEach(mark => {
        const status = mark.marks >= 40 ? 'Pass' : 'Fail';
        const marksRow = [
          mark.subject,
          mark.semester,
          mark.marks,
          status
        ];
        tableRows.push(marksRow);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'grid',
        styles: { fontSize: 10 }
      });
      
      // Summary
      const finalY = doc.lastAutoTable.finalY + 10;
      
      if (filteredMarks.length > 0) {
        const total = filteredMarks.reduce((sum, mark) => sum + mark.marks, 0);
        const average = total / filteredMarks.length;
        
        doc.text(`Total Marks: ${total}`, 15, finalY + 10);
        doc.text(`Average: ${average.toFixed(2)}`, 15, finalY + 18);
        doc.text(`Total Subjects: ${filteredMarks.length}`, 15, finalY + 26);
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          'This is a computer-generated document. No signature is required.',
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`${studentData.name}_${selectedSemester === 'all' ? 'All' : `Sem${selectedSemester}`}_Results.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading...</h3>
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
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Download Results</h2>
          
          {studentData && (
            <div className="mb-4">
              <h5>Student Information</h5>
              <p><strong>Name:</strong> {studentData.name}</p>
              <p><strong>Student ID:</strong> {studentData.id}</p>
              <p><strong>Department:</strong> {studentData.department}</p>
            </div>
          )}
          
          <Form className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Select Semester</Form.Label>
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
            </Form.Group>
          </Form>
          
          {getFilteredMarks().length > 0 ? (
            <div className="text-center">
              <p>
                You are about to download your{' '}
                {selectedSemester === 'all' ? 'complete results' : `Semester ${selectedSemester} results`}.
              </p>
              <Button 
                variant="success" 
                size="lg" 
                onClick={generatePDF} 
                disabled={downloading}
              >
                {downloading ? 'Generating PDF...' : 'Download as PDF'}
              </Button>
            </div>
          ) : (
            <Alert variant="info">
              No results found for the selected semester.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DownloadResults;
