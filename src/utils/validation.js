/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  /**
   * Validates password strength
   * @param {string} password - Password to validate
   * @returns {boolean} - True if password is valid, false otherwise
   */
  export const validatePassword = (password) => {
    // Basic validation - at least 6 characters
    return password.length >= 6;
    
    // Enhanced validation (uncomment to use)
    // const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // return re.test(password);
  };
  
  /**
   * Validates student ID format (customize as needed)
   * @param {string} studentId - Student ID to validate
   * @returns {boolean} - True if student ID is valid, false otherwise
   */
  export const validateStudentId = (studentId) => {
    // Example: Ensure student ID is 6-10 digits/characters
    return /^[a-zA-Z0-9]{6,10}$/.test(studentId);
  };
  
  /**
   * Validates that marks are within a valid range
   * @param {number} marks - Marks to validate
   * @returns {boolean} - True if marks are valid, false otherwise
   */
  export const validateMarks = (marks) => {
    const marksNum = Number(marks);
    return !isNaN(marksNum) && marksNum >= 0 && marksNum <= 100;
  };
  
  /**
   * Validates form inputs for adding/editing marks
   * @param {Object} data - Form data object
   * @returns {Object} - Object with isValid flag and error message
   */
  export const validateMarksForm = (data) => {
    if (!data.studentId) {
      return { isValid: false, error: 'Student ID is required' };
    }
    
    if (!data.subject) {
      return { isValid: false, error: 'Subject is required' };
    }
    
    if (!data.semester) {
      return { isValid: false, error: 'Semester is required' };
    }
    
    if (!validateMarks(data.marks)) {
      return { isValid: false, error: 'Marks must be between 0 and 100' };
    }
    
    return { isValid: true, error: '' };
  };
  