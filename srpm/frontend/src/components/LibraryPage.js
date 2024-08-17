import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert } from 'react-bootstrap'; // Import Card, Spinner, and Alert from react-bootstrap

const LibraryPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('error');

  useEffect(() => {
    fetchPapers();
  }, []);

  const togglePopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const fetchPapers = async () => {
    try {
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        const response = await axios.get('/backend/library', {
          params: { email: currentUser },
        });
        setPapers(response.data);
      } else {
        togglePopup('User email not found in localStorage.', 'error');
      }
    } catch (error) {
      togglePopup('Error fetching library.', 'error');
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
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

  if (!papers || papers.length === 0) {
    return (
      <Alert variant="info" className="m-3">
        No papers found in library.
      </Alert>
    );
  }

  // Convert authors JSON object to array and apply join(", ") to display author names
  const renderAuthors = (authors) => {
    const authorArray = JSON.parse(authors);
  
    const filteredAuthors = authorArray.filter(author => author.trim() !== "");
  
    return filteredAuthors.join(", ");
  };

  return (
    <div className="container">
      
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginBottom: '80px' , minHeight: 'calc(100vh - 160px)' }}>
      <h5>Library({papers.length})</h5>
        {papers.map((paper, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{paper.title}</span>
                  </div>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Authors: {renderAuthors(paper.authors)}</Card.Subtitle>
                <Card.Text>...{paper.abstract}...</Card.Text>
                <Card.Text>Citations: {paper.citation_count}</Card.Text>
                <Card.Text>
                    Full Text Type: 
                    {paper.full_text_link !== 'N/A' ? (
                  <a href={paper.full_text_link} target="_blank">{paper.full_text_type}</a>
                ) : (
                  <span>{paper.full_text_type}</span>
                )}
                </Card.Text>  
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
