import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('error');

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/backend/allusers');
      setUsers(response.data);
    } catch (error) {
      togglePopup('Error fetching users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.post('/backend/deleteuser', { id: userId });
      setUsers(users.filter(user => user.id !== userId));
      togglePopup('User deleted successfully.', 'success');
    } catch (error) {
      togglePopup('Error deleting user.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Alert variant="info" className="m-3">
        No users found.
      </Alert>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', minHeight: 'calc(100vh - 160px)' }}>
        <h5>Users ({users.length})</h5>
        {users.map(user => (
          <div key={user.id} style={{ marginBottom: '20px' }}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{user.name}</span>
                    <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                  </div>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">ID: {user.id}</Card.Subtitle>
                <Card.Text>Email: {user.email}</Card.Text>
                <Card.Text>Age: {user.age}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
        {showPopup && (
          <Popup variant={popupType} onClick={() => setShowPopup(false)}>
            {popupMessage}
          </Popup>
        )}
      </div>
    </div>
  );
};

const Popup = styled(Alert)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  cursor: pointer;
  text-align: center;
  max-width: 400px;
  color: red;
`;

export default AdminDashboard;
