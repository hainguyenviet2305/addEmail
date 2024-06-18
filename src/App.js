import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const url = 'http://66.23.232.230/api/email';

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      });
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  // const handleSave = () => {
  //   const url = `https://66.23.232.230/api/email/${currentUser.id}`;
    
  //   const updatedUser = {
  //     id: currentUser.id,
  //     userName: currentUser.userName,
  //     password: currentUser.password,
  //     webhook: currentUser.webhook
  //   };

    const handleSave = () => {
      const url = `${process.env.REACT_APP_API_URL}/${currentUser.id}`;
      
      const updatedUser = {
        id: currentUser.id,
        userName: currentUser.userName,
        password: currentUser.password,
        webhook: currentUser.webhook
      };

    axios.post(url, updatedUser)
      .then(response => {
        const updatedData = data.map(user => 
          user.id === currentUser.id ? currentUser : user
        );
        setData(updatedData);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error updating data:', error);
        setError(error.message);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Email Table</h2>
      {error ? (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Webhook</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.userName}</td>
                <td>{item.password}</td>
                <td>{item.webhook}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-danger btn-sm ml-2">Delete</button>
                  <button className="btn btn-info btn-sm ml-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form>
              <Form.Group controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={currentUser.id} readOnly />
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentUser.userName} 
                  onChange={(e) => setCurrentUser({ ...currentUser, userName: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentUser.password} 
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formWebhook">
                <Form.Label>Webhook</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentUser.webhook} 
                  onChange={(e) => setCurrentUser({ ...currentUser, webhook: e.target.value })} 
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
