import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../../firebase/firebase';
// import { useAuth } from '../AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        const studentDocRef = doc(db, 'students', currentUser.uid);
        const studentDoc = await getDoc(studentDocRef);
        
        if (studentDoc.exists()) {
          const data = studentDoc.data();
          setName(data.name || '');
          setEmail(data.email || '');
          setDepartment(data.department || '');
          setStudentId(data.id || '');
          setProfilePictureURL(data.profilePicture || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ text: 'Failed to load profile!', type: 'danger' });
      } finally {
        setInitialLoad(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const studentDocRef = doc(db, 'students', currentUser.uid);
      let updatedData = {
        name,
        department
      };
      
      // Handle profile picture upload if a new one is selected
      if (profilePicture) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
        await uploadBytes(storageRef, profilePicture);
        const downloadURL = await getDownloadURL(storageRef);
        
        updatedData.profilePicture = downloadURL;
        setProfilePictureURL(downloadURL);
      }
      
      await updateDoc(studentDocRef, updatedData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile!', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading profile...</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Your Profile</h2>
          
          {message.text && (
            <Alert variant={message.type} className="text-center">
              {message.text}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email} 
                    readOnly 
                    disabled 
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={studentId} 
                    readOnly 
                    disabled 
                  />
                  <Form.Text className="text-muted">
                    Student ID cannot be changed.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                  />
                </Form.Group>
              </Col>
              
              <Col md={4} className="text-center">
                <div className="mb-3">
                  {profilePictureURL ? (
                    <img 
                      src={profilePictureURL} 
                      alt="Profile" 
                      style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover'}}
                    />
                  ) : (
                    <div 
                      style={{
                        width: '150px', 
                        height: '150px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto'
                      }}
                    >
                      <span className="text-secondary">No Photo</span>
                    </div>
                  )}
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
