import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is a teacher
      const teacherRef = doc(db, 'teachers', userCredential.user.uid);
      const teacherSnap = await getDoc(teacherRef);
      
      if (teacherSnap.exists()) {
        navigate('/teacher-dashboard');
      } else {
        await auth.signOut();
        setError('This account is not registered as a teacher');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in: ' + error.message);
    }
    
    setLoading(false);
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Teacher Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </Form.Group>
            
            <Button disabled={loading} className="w-100" type="submit">
              Login
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p>Don't have an account? <Link to="/teacher-signup">Sign Up</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TeacherLogin;
