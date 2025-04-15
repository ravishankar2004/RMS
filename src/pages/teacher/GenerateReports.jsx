import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Table, Alert, Row, Col } from 'react-bootstrap';
import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from './src/firebase/firebase'; // ✅ Corrected path
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// Conet\src\firebase\firebase.js

function GenerateReports() {
  const [reportType, setReportType] = useState('class');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  const [subject, setSubject] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch departments and subjects on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Get unique departments
        const studentsRef = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsRef);
        const deptSet = new Set();
        
        studentsSnapshot.forEach(doc => {
          const student = doc.data();
          if (student.department) {
            deptSet.add(student.department);
          }
        });
        
        setDepartments([...deptSet]);
        
        // Get unique subjects
        const marksRef = collection(db, 'marks');
        const marksSnapshot = await getDocs(marksRef);
        const subjectSet = new Set();
        
        marksSnapshot.forEach(doc => {
          const mark = doc.data();
          if (mark.subject) {
            subjectSet.add(mark.subject);
          }
        });
        
        setSubjects([...subjectSet]);
        
      } catch (error) {
        console.error('Error fetching filters:', error);
        setError('Failed to load filter options');
      }
    };
    
    fetchFilters();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setReportData([]);
    
    try {
      if (reportType === 'class') {
        if (!department || !semester) {
          setError('Please select both department and semester');
          setLoading(false);
          return;
        }
        
        // First get all students in this department
        const studentsRef = collection(db, 'students');
        const studentsQuery = query(studentsRef, where('department', '==', department));
        const studentsSnapshot = await getDocs(studentsQuery);
        
        const students = [];
        studentsSnapshot.forEach(doc => {
          students.push({
            id: doc.data().id,
            name: doc.data().name,
            marks: []
          });
        });
        
        if (students.length === 0) {
          setError('No students found in this department');
          setLoading(false);
          return;
        }
        
        // Then get marks for these students for the selected semester
        const marksRef = collection(db, 'marks');
        
        for (const student of students) {
          const marksQuery = query(
            marksRef, 
            where('studentId', '==', student.id),
            where('semester', '==', semester)
          );
          
          const marksSnapshot = await getDocs(marksQuery);
          const studentMarks = [];
          
          marksSnapshot.forEach(doc => {
            studentMarks.push(doc.data());
          });
          
          student.marks = studentMarks;
        }
        
        setReportData(students);
        setSuccess('Class report generated successfully');
        
      } else if (reportType === 'subject') {
        if (!subject || !semester) {
          setError('Please select both subject and semester');
          setLoading(false);
          return;
        }
        
        // Get all marks for this subject and semester
        const marksRef = collection(db, 'marks');
        const marksQuery = query(
          marksRef, 
          where('subject', '==', subject),
          where('semester', '==', semester)
        );
        
        const marksSnapshot = await getDocs(marksQuery);
        const marksData = [];
        
        marksSnapshot.forEach(doc => {
          marksData.push(doc.data());
        });
        
        if (marksData.length === 0) {
          setError('No data found for this subject and semester');
          setLoading(false);
          return;
        }
        
        // Get student details for each mark entry
        const enhancedData = [];
        
        for (const mark of marksData) {
          const studentId = mark.studentId;
          const studentsRef = collection(db, 'students');
          const studentQuery = query(studentsRef, where('id', '==', studentId));
          const studentSnapshot = await getDocs(studentQuery);
          
          if (!studentSnapshot.empty) {
            const student = studentSnapshot.docs[0].data();
            enhancedData.push({
              id: student.id,
              name: student.name,
              department: student.department,
              marks: mark.marks
            });
          }
        }
        
        setReportData(enhancedData);
        setSuccess('Subject report generated successfully');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(16);
      doc.text(
        reportType === 'class' 
          ? `Class Report: ${department} - Semester ${semester}`
          : `Subject Report: ${subject} - Semester ${semester}`,
        15,
        15
      );
      
      // Generate table based on report type
      if (reportType === 'class') {
        // Get all unique subjects
        const allSubjects = new Set();
        reportData.forEach(student => {
          student.marks.forEach(mark => {
            allSubjects.add(mark.subject);
          });
        });
        
        const subjects = [...allSubjects];
        
        // Headers for the table
        const headers = ['Student ID', 'Name', ...subjects, 'Average'];
        
        // Data rows
        const rows = reportData.map(student => {
          const row = [student.id, student.name];
          
          // Add marks for each subject
          let totalMarks = 0;
          let subjectCount = 0;
          
          subjects.forEach(subject => {
            const mark = student.marks.find(m => m.subject === subject);
            if (mark) {
              row.push(mark.marks);
              totalMarks += mark.marks;
              subjectCount++;
            } else {
              row.push('-');
            }
          });
          
          // Add average marks
          const average = subjectCount > 0 ? (totalMarks / subjectCount).toFixed(2) : '-';
          row.push(average);
          
          return row;
        });
        
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 25
        });
        
      } else {
        // Headers for subject-wise report
        const headers = ['Student ID', 'Name', 'Department', 'Marks'];
        
        // Data rows
        const rows = reportData.map(student => [
          student.id,
          student.name,
          student.department,
          student.marks
        ]);
        
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 25
        });
        
        // Add statistics
        if (reportData.length > 0) {
          const marks = reportData.map(s => s.marks);
          const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
          const max = Math.max(...marks);
          const min = Math.min(...marks);
          
          const finalY = doc.lastAutoTable.finalY + 10;
          
          doc.text(`Statistics for ${subject} - Semester ${semester}:`, 15, finalY);
          doc.text(`Average: ${avg.toFixed(2)}`, 15, finalY + 10);
          doc.text(`Highest: ${max}`, 15, finalY + 20);
          doc.text(`Lowest: ${min}`, 15, finalY + 30);
        }
      }
      
      doc.save(
        reportType === 'class'
          ? `class_report_${department}_sem${semester}.pdf`
          : `subject_report_${subject}_sem${semester}.pdf`
      );
      
      setSuccess('Report downloaded successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download report');
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Generate Reports</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Report Type</Form.Label>
              <Form.Control 
                as="select" 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="class">Class-wise Report</option>
                <option value="subject">Subject-wise Report</option>
              </Form.Control>
            </Form.Group>
            
            {reportType === 'class' && (
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control 
                  as="select" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            
            {reportType === 'subject' && (
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control 
                  as="select" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subj, index) => (
                    <option key={index} value={subj}>{subj}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control 
                as="select" 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                required
              >
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
            
            <Button 
              variant="primary" 
              onClick={generateReport} 
              disabled={loading}
              className="w-100"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Form>
          
          {reportData.length > 0 && (
            <div className="mt-4">
              <Row className="align-items-center mb-3">
                <Col>
                  <h4>
                    {reportType === 'class' 
                      ? `Class Report: ${department} - Semester ${semester}` 
                      : `Subject Report: ${subject} - Semester ${semester}`}
                  </h4>
                </Col>
                <Col xs="auto">
                  <Button variant="success" onClick={downloadPDF}>
                    Download as PDF
                  </Button>
                </Col>
              </Row>
              
              {reportType === 'class' ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Total Subjects</th>
                      <th>Average Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((student, index) => {
                      const totalMarks = student.marks.reduce((sum, mark) => sum + mark.marks, 0);
                      const averageMarks = student.marks.length > 0 
                        ? (totalMarks / student.marks.length).toFixed(2)
                        : '-';
                        
                      return (
                        <tr key={index}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.marks.length}</td>
                          <td>{averageMarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((student, index) => (
                      <tr key={index}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default GenerateReports;
