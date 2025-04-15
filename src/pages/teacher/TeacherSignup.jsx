import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
// import { auth, db, storage } from '../firebase';
// import { validateEmail, validatePassword } from '../utils/validation';

function TeacherSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !password || !confirmPassword || !subject) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Upload profile picture if provided
      let profilePictureURL = '';
      if (profilePicture) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePictureURL = await getDownloadURL(storageRef);
      }
      
      // Save additional teacher data to Firestore
      await setDoc(doc(db, 'teachers', user.uid), {
        uid: user.uid,
        name,
        email,
        subject,
        profilePicture: profilePictureURL,
        createdAt: new Date()
      });
      
      // Sign out the user after successful signup
      await auth.signOut();
      
      // Redirect to login page
      navigate('/teacher-login');
      
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to create an account: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Teacher Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="subject">
              <Form.Label>Subject Taught</Form.Label>
              <Form.Control 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject you teach"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="profilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
            
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p>Already have an account? <Link to="/teacher-login">Log In</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TeacherSignup;
