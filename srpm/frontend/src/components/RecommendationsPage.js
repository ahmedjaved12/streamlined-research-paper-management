import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import axios from 'axios';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'; 

const RecommendationsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [summarizePaper, setSummarizePaper] = useState(null);
  const [authorRelevanceLoading, setAuthorRelevanceLoading] = useState(false);
  const [authorRelevancePaper, setAuthorRelevancePaper] = useState(null);
  const [authorsRelevanceList, setAuthorsRelevanceList] = useState([]);
  const [showHecRatingModal, setShowHecRatingModal] = useState(false);
  const [hecRatingLoading, setHecRatingLoading] = useState(false);
  const [hecRatingData, setHecRatingData] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('error');
  const [impactFactorData, setImpactFactorData] = useState(null);
  const [impactFactorLoading, setImpactFactorLoading] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [impactFactorError, setImpactFactorError] = useState(null);

  useEffect(() => {
    const checkLogin = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(checkLogin);

    if (checkLogin) {
      const user = localStorage.getItem('current_user');
      const recent_searches = JSON.parse(localStorage.getItem('recentSearches'));
      const storedRecommendations = JSON.parse(localStorage.getItem('recommendations'));

      console.log(user);
      console.log(recent_searches);
      
      setCurrentUser(user);
      setRecentSearches(recent_searches);

      if (storedRecommendations) {
        setRecommendations(storedRecommendations);
        setLoading(false);
      } else {
        fetchRecommendations(user, recent_searches);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRecommendations = async (user, recent_searches) => {
    setLoading(true);
    try {
      const response = await axios.get('/backend/recommendations', {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: {
          email: user,
          rs: JSON.stringify(recent_searches),
        },
      });
      setRecommendations(response.data);
      localStorage.setItem('recommendations', JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      setError('Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadNewRecommendations = () => {
    if (currentUser) {
      fetchRecommendations(currentUser, recentSearches);
    } else {
      setError('You must be logged in to load new recommendations.');
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleTranslateTitle = (paper) => {
    setSelectedPaper(paper);
    setTranslatedTitle("");
    setShowModal(true);
  };

  const handleSummarize = () => {
    window.location.href = 'summarize';
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleTranslate = async () => {
    setTranslationLoading(true);
    try {
      const response = await axios.get('/backend/translate', {
        params: {
          text: selectedPaper.title,
          to: selectedLanguage,
        },
      });
      setTranslatedTitle(response.data);
    } catch (error) {
      setError('Error translating data. Please try again.');
      console.error('Error fetching data: ', error);
    } finally {
      setTranslationLoading(false);
    }
  };

  const handleCalculateAuthorRelevance = async (paper) => {
    setAuthorRelevanceLoading(true);
    setAuthorRelevancePaper(paper);
    try {
      const response = await axios.get('/backend/authorrelevance', {
        params: {
          title: paper.title,
          authors: JSON.stringify(paper.author),
          author_profile_links: JSON.stringify(paper.author_profile_links),
        },
      });
      setAuthorsRelevanceList(response.data);
    } catch (error) {
      setError('Error calculating author relevance. Please try again.');
      console.error('Error calculating author relevance: ', error);
    } finally {
      setAuthorRelevanceLoading(false);
    }
  };

  const handleHecRating = async (paper) => {
    setHecRatingLoading(true);
    setSelectedPaper(paper);
    try {
      const response = await axios.get('/backend/hecrating', {
        params: { journal: paper.journal_name, bibtex: paper.bibtex_link },
      });
      const data = response.data;
      if (Array.isArray(data) && data.length > 0 && !data[0].error) {
        setHecRatingData(data[0]);
        setError(null);
      } else {
        setError(data[0]?.error || "Journal not recognized by HEC.");
        setShowHecRatingModal(true);
        setHecRatingData(null);
      }
    } catch (error) {
      console.error('Error fetching HEC rating: ', error);
      setError('Error fetching HEC rating. Please try again.');
      setHecRatingData(null);
    } finally {
      setHecRatingLoading(false);
      setShowHecRatingModal(true);
    }
  };

  const handleAddToLibrary = async (paper) => {
    try {
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        await axios.post('/backend/addtolibrary', {
          user: currentUser,
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.author,
          apl: paper.author_profile_links,
          bibtex: paper.bibtex_link,
          related: paper.related_articles,
          journal: paper.journal_name,
          citation_count: paper.citation_count,
          ftt: paper.full_text_type,
          ftl: paper.full_text_link,
        });
        togglePopup('Paper added to library successfully.', 'success');
      } else {
        togglePopup('User email not found in localStorage.', 'error');
      }
    } catch (error) {
      togglePopup('Error adding paper to library. Please try again.', 'error');
    }
  };

  const togglePopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const handleImpactFactor = async (paper) => {
    setImpactFactorLoading(true);
    setSelectedJournal(paper.journal_name);
    try {
      const response = await axios.get('/backend/impactfactor', {
        params: { journal: paper.journal_name, bibtex: paper.bibtex_link },
      });
      setImpactFactorData(response.data);
    } catch (error) {
      console.error('Error fetching impact factor: ', error);
      setImpactFactorError('Error fetching impact factor. Please try again.');
      setImpactFactorData(null);
    } finally {
      setImpactFactorLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', marginTop: '100px' }}>
        <p>Please login to see recommendations</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Button onClick={() => window.location.href = '/login'} style={{ marginLeft: '10px', minWidth: '100px' }}>
            Proceed To Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginTop: '80px', minHeight: 'calc(100vh - 60px)' }}>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" />
          <h2>Loading recommendations. This will take few minutes...</h2>
        </div>
      ) : (
        <div>
          {recommendations.slice(currentPage * 10, (currentPage + 1) * 10).map((paper, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{paper.title}</span>
                      <div>
                        <Button variant="primary" onClick={() => handleTranslateTitle(paper)}>Translate Title</Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Authors: {paper.author.join(', ')}</Card.Subtitle>
                  <Card.Text>...{paper.abstract}...</Card.Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="primary" size="sm" onClick={() => handleSummarize()} disabled={summarizing && summarizePaper === paper} style={{ marginRight: '10px' }}>
                      {summarizing && summarizePaper === paper ? 'Summarizing...' : 'Summarize'}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleCalculateAuthorRelevance(paper)} disabled={authorRelevanceLoading && authorRelevancePaper === paper} style={{ marginRight: '10px' }}>
                      {authorRelevanceLoading && authorRelevancePaper === paper ? 'Calculating...' : 'Author(s) Relevance'}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleHecRating(paper)} disabled={hecRatingLoading && selectedPaper === paper}>
                      {hecRatingLoading && selectedPaper === paper ? 'Calculating...' : 'HEC Rating'}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleImpactFactor(paper)} disabled={impactFactorLoading && selectedJournal === paper.journal_name} style={{ marginLeft: '10px' }}>
                      {impactFactorLoading && selectedJournal === paper.journal_name ? 'Calculating...' : 'Impact Factor'}
                    </Button>
                    <Button variant="info" size="sm" onClick={() => handleAddToLibrary(paper)} style={{ marginLeft: '10px' }}>
                      <AddToPhotosIcon />
                    </Button>
                  </div>
                  <Card.Text>Citations: {paper.citation_count}</Card.Text>
                  <Card.Text>
                    Full Text Type: 
                    {paper.full_text_link !== 'N/A' ? (
                      <a href={paper.full_text_link} target="_blank" rel="noopener noreferrer">{paper.full_text_type}</a>
                    ) : (
                      <span>{paper.full_text_type}</span>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
            <Button onClick={handleLoadNewRecommendations} style={{ marginLeft: '10px', minWidth: '100px' }}>
              Load New Recommendations
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '50px' }}>
            <Button onClick={handlePreviousPage} disabled={currentPage === 0} style={{ marginLeft: '10px', minWidth: '100px' }}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              style={{ marginLeft: '10px', minWidth: '100px' }}
              disabled={(currentPage + 1) * 10 >= recommendations.length}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Translate Title Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Translate Paper Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton title="Select Language" variant="info" style={{ marginBottom: '10px' }}>
            <Dropdown.Item onClick={() => handleLanguageSelect("en")}>English</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageSelect("ur")}>Urdu</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageSelect("ar")}>Arabic</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageSelect("it")}>Italian</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageSelect("zh-CN")}>Chinese</Dropdown.Item>
          </DropdownButton>
          <Button variant="primary" onClick={handleTranslate} disabled={translationLoading} style={{ marginRight: '10px' }}>
            {translationLoading ? 'Translating...' : 'Translate'}
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <div>Translated Title: {translatedTitle}</div>
        </Modal.Body>
      </Modal>
      {/* Authors Relevance Modal */}
      <Modal show={!!authorsRelevanceList.length} onHide={() => setAuthorsRelevanceList([])}>
        <Modal.Header closeButton>
          <Modal.Title>Authors Relevance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {authorRelevanceLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="container">
              {authorsRelevanceList.map((authorRelevance, index) => (
                <div key={index} className="mb-3">
                  <div className="row">
                    <div className="col-md-15">Author: <strong>{authorRelevance.author}</strong></div>
                  </div>
                  <div className="row">
                    <div className="col-md-15">Relevance(max 100): <strong>{authorRelevance.relevance}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* HEC Rating Modal */}
      <Modal show={showHecRatingModal} onHide={() => { setShowHecRatingModal(false); setError(null); setHecRatingData(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>HEC Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hecRatingLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <div>
              <p>ISSN: <b>{hecRatingData?.ISSN || 'N/A'}</b></p>
              <p>Country: <b>{hecRatingData?.Country || 'N/A'}</b></p>
              <p>Scopus: <b>{hecRatingData?.Scopus || 'N/A'}</b></p>
              <p>WoS: <b>{hecRatingData?.WoS || 'N/A'}</b></p>
              <p>Category: <b>{hecRatingData?.Category || 'N/A'}</b></p>
              <p>Medallion: <b>{hecRatingData?.Medallion || 'N/A'}</b></p>
              <p>JPI: <b>{hecRatingData?.JPI || 'N/A'}</b></p>
              <p>Subject Area Position: <b>{hecRatingData?.SAP || 'N/A'}</b></p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Summarized Text Modal */}
      <Modal show={!!summarizedText} onHide={() => setSummarizedText("")}>
        <Modal.Header closeButton>
          <Modal.Title>Summarized Text</Modal.Title>
        </Modal.Header>
        <Modal.Body>{summarizedText}</Modal.Body>
      </Modal>

      {/* Popup */}
      {showPopup && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <div style={{ backgroundColor: popupType === 'error' ? '#ff0000' : '#4caf50', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}>
            {popupMessage}
          </div>
        </div>
      )}
      <Modal show={impactFactorData !== null || impactFactorError !== null} onHide={() => { setImpactFactorData(null); setImpactFactorError(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>Impact Factor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {impactFactorError ? (
            <p style={{ color: 'red' }}>{impactFactorError}</p>
          ) : impactFactorData && Array.isArray(impactFactorData.table_data) && impactFactorData.table_data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {impactFactorData.table_data[0].map((header, index) => (
                    <th key={index} style={{ padding: '8px', margin: '4px' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {impactFactorData.table_data.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ padding: '8px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
