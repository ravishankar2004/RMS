import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download a PDF with student results
 * @param {Object} studentData - Student information (name, id, department)
 * @param {String} semester - Semester for which results are being generated
 * @param {Array} marks - Array of mark objects with subject and score
 */
export const generateResultPDF = (studentData, semester, marks) => {
  try {
    const doc = new jsPDF();
    
    // Add title and header
    doc.setFontSize(18);
    doc.text('Result Management System', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(
      semester === 'all' ? 'All Semesters Result' : `Semester ${semester} Result`, 
      105, 
      25, 
      { align: 'center' }
    );
    
    // Add student information
    doc.setFontSize(12);
    doc.text(`Name: ${studentData.name}`, 15, 40);
    doc.text(`Student ID: ${studentData.id}`, 15, 48);
    doc.text(`Department: ${studentData.department}`, 15, 56);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 64);
    
    // Create table for marks
    const tableColumn = ["Subject", "Semester", "Marks", "Status"];
    const tableRows = [];
    
    marks.forEach(mark => {
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
    
    // Add summary information
    const finalY = doc.lastAutoTable.finalY + 10;
    
    if (marks.length > 0) {
      const total = marks.reduce((sum, mark) => sum + mark.marks, 0);
      const average = total / marks.length;
      
      doc.text(`Total Marks: ${total}`, 15, finalY + 10);
      doc.text(`Average: ${average.toFixed(2)}`, 15, finalY + 18);
      doc.text(`Total Subjects: ${marks.length}`, 15, finalY + 26);
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
    doc.save(`${studentData.name}_${semester === 'all' ? 'All' : `Sem${semester}`}_Results.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generate and download a class-wise report as PDF
 * @param {String} department - Department name
 * @param {String} semester - Semester number
 * @param {Array} students - Array of student objects with marks
 */
export const generateClassReportPDF = (department, semester, students) => {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text(`Class Report: ${department} - Semester ${semester}`, 15, 15);
    
    // Get all unique subjects
    const allSubjects = new Set();
    students.forEach(student => {
      student.marks.forEach(mark => {
        allSubjects.add(mark.subject);
      });
    });
    
    const subjects = [...allSubjects];
    
    // Headers for the table
    const headers = ['Student ID', 'Name', ...subjects, 'Average'];
    
    // Data rows
    const rows = students.map(student => {
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
    
    doc.save(`class_report_${department}_sem${semester}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating class report PDF:', error);
    return false;
  }
};

/**
 * Generate and download a subject-wise report as PDF
 * @param {String} subject - Subject name
 * @param {String} semester - Semester number
 * @param {Array} students - Array of student objects with marks
 */
export const generateSubjectReportPDF = (subject, semester, students) => {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text(`Subject Report: ${subject} - Semester ${semester}`, 15, 15);
    
    // Headers for subject-wise report
    const headers = ['Student ID', 'Name', 'Department', 'Marks'];
    
    // Data rows
    const rows = students.map(student => [
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
    if (students.length > 0) {
      const marks = students.map(s => s.marks);
      const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
      const max = Math.max(...marks);
      const min = Math.min(...marks);
      
      const finalY = doc.lastAutoTable.finalY + 10;
      
      doc.text(`Statistics for ${subject} - Semester ${semester}:`, 15, finalY);
      doc.text(`Average: ${avg.toFixed(2)}`, 15, finalY + 10);
      doc.text(`Highest: ${max}`, 15, finalY + 20);
      doc.text(`Lowest: ${min}`, 15, finalY + 30);
    }
    
    doc.save(`subject_report_${subject}_sem${semester}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating subject report PDF:', error);
    return false;
  }
};
