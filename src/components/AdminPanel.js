import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Import CSS file

const AdminPanel = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [newSurveyName, setNewSurveyName] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [questionRatings, setQuestionRatings] = useState({});
  const [questionAverageRating, setQuestionAverageRating] = useState({});

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const token = getCookie('token');
      const response = await axios.get('http://localhost:8080/api/surveys/getAllSurveys', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSurveys(response.data.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Function to copy survey link to clipboard
  const copySurveyLink = (surveyLink) => {
    const link = `http://localhost:3000/surveys/${surveyLink}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        console.log('Survey link copied to clipboard:', surveyLink);
        // Show an alert to indicate that the link has been copied
        alert('Survey link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying survey link:', error);
      });
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      const token = getCookie('token');
      await axios.post(`http://localhost:8080/api/surveys/delete?id=${surveyId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove the deleted survey from the state
      setSurveys(prevSurveys => prevSurveys.filter(survey => survey.id !== surveyId));
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  const handleCreateSurvey = async () => {
    try {
      const token = getCookie('token');
      const response = await axios.post('http://localhost:8080/api/surveys/add', {
        name: newSurveyName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Add the newly created survey to the state
      setSurveys(prevSurveys => [...prevSurveys, response.data]);
      // Clear the new survey name input
      setNewSurveyName('');

      // Fetch surveys again to get updated list after adding
      fetchSurveys();
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = getCookie('token');
      await axios.post(`http://localhost:8080/api/questions/delete?id=${questionId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refetch the selected survey to get updated question list
      handleEditSurvey(selectedSurveyId);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditSurvey = async (surveyId) => {
    if (selectedSurveyId === surveyId) {
      setSelectedSurveyId(null);
    } else {
      try {
        const token = getCookie('token');
        const response = await axios.get(`http://localhost:8080/api/surveys/getSurveyById?id=${surveyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSelectedSurveyId(surveyId);
      } catch (error) {
        console.error('Error fetching survey questions:', error);
      }
    }
  };

  const handleAddQuestion = async () => {
    try {
      const token = getCookie('token');
      await axios.post(`http://localhost:8080/api/questions/add`, {
        surveyId: selectedSurveyId,
        content: newQuestionContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refetch the selected survey to get updated question list
      handleEditSurvey(selectedSurveyId);
      // Clear the new question content input
      setNewQuestionContent('');
      fetchSurveys();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleViewRatings = async (questionId) => {
    try {
      const token = getCookie('token');
      const response = await axios.get(`http://localhost:8080/api/ratings/getRatingsByQuestionId?questionId=${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const ratings = response.data.data;
  
      // Update ratings for the specific question
      setQuestionRatings({ ...questionRatings, [questionId]: ratings });
  
      // Fetch average rating
      const averageResponse = await axios.get(`http://localhost:8080/api/ratings/getAverageRatingByQuestionId?questionId=${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const averageRating = averageResponse.data.data;
  
      console.log('Average rating:', averageRating);
      // Update average rating for the specific question
      setQuestionAverageRating((prev) => ({
        ...prev,
        [questionId]: averageRating
      }));
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Code to handle logout, such as clearing tokens or session data
      // For example, if using JWT tokens, remove them from cookies
      const token = getCookie('token');
      document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      // Redirect to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-panel">
      <img src="https://i.ibb.co/PtL1n4K/Whats-App-Image-2024-03-16-at-23-16-39-removebg-preview.png" alt="Logo" className="logo" />
      <h2>Admin Panel</h2>
      <div className="survey-list">
        <button className='create-button' onClick={handleCreateSurvey}>Create Survey</button>
        <input type="text" value={newSurveyName} onChange={(e) => setNewSurveyName(e.target.value)} placeholder="Enter survey name" />
        {surveys && surveys.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(survey => (
                <React.Fragment key={survey.id}>
                  <tr>
                    <td>{survey.id}</td>
                    <td>{survey.name}</td>
                    <td>
                      <button className='expand' onClick={() => handleEditSurvey(survey.id)}>{selectedSurveyId === survey.id ? 'Collapse' : 'Expand'}</button>
                      <button className='delete' onClick={() => handleDeleteSurvey(survey.id)}>Delete</button>
                      <button className='copy-link' onClick={() => copySurveyLink(survey.surveyLink)}>Copy Link</button> {/* Copy Link Button */}
                    </td>
                  </tr>
                  {selectedSurveyId === survey.id && (
                    <>
                      {survey.questions.map(question => (
                        <tr key={question.id}>
                          <td colSpan="3">
                            <div className="question-list">
                              <div key={question.id} className="question-row">
                                <span>{question.content}</span>
                                <div className='buttons-row'>
                                  <button className='view-button' onClick={() => handleViewRatings(question.id)}>View Ratings</button>
                                  <button className='delete-question-button' onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                                </div>
                              </div>
                              {questionRatings[question.id] && questionRatings[question.id].map(rating => (
                                <div key={rating.id} className="rating-row">
                                  <span>Rating: {rating.rating}</span>
                                </div>
                              ))}
                              <div className="average-rating-row">
                                {questionAverageRating[question.id] && (
                                  <span>Average Rating: {questionAverageRating[question.id]}</span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3">
                          <div className="add-question-row">
                            <input type="text" value={newQuestionContent} onChange={(e) => setNewQuestionContent(e.target.value)} placeholder="Enter new question" />
                            <button onClick={handleAddQuestion}>Add Question</button>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No surveys found.</p>
        )}
      </div>
      <button className='logout-button' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPanel;
