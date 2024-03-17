  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './SurveyApp.css'; // Import CSS file
  import { useParams } from 'react-router-dom';

  const SurveyApp = () => {
    const { surveyLink } = useParams(); // Get the surveyLink parameter from the URL
    const [survey, setSurvey] = useState(null);
    const [ratings, setRatings] = useState({}); // Store ratings for each question
    const [isSubmitting, setIsSubmitting] = useState(false); // Flag for submitting state

    useEffect(() => {
      fetchSurvey();
    }, [surveyLink]);

    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/surveys/getSurveyByLink?surveyLink=${surveyLink}`);
        setSurvey(response.data.data);
        const initialRatings = response.data.data.questions.reduce((acc, question) => {
          acc[question.id] = 0;
          return acc;
        }, {});
        setRatings(initialRatings);
      } catch (error) {
        console.error('Error fetching survey:', error);
      }
    };

    const handleRatingChange = (questionId, rating) => {
      setRatings(prevRatings => ({
        ...prevRatings,
        [questionId]: rating
      }));
    };

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true);
        // Prepare ratings data to send to the backend
        const ratingsData = Object.keys(ratings).map(questionId => ({
          questionId,
          rating: ratings[questionId]
        }));
        // Send ratings data to the backend
        await axios.post('http://localhost:8080/api/ratings/addRatingList', ratingsData);
        console.log('Ratings submitted successfully:', ratingsData);
        // Reset ratings to 0 after submission
        setRatings(Object.fromEntries(Object.keys(ratings).map(questionId => [questionId, 0])));
      } catch (error) {
        console.error('Error submitting ratings:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!survey) {
      return <div>Loading...</div>;
    }

    return (
      <div className="container">
        <img src="https://i.ibb.co/PtL1n4K/Whats-App-Image-2024-03-16-at-23-16-39-removebg-preview.png" alt="Logo" />
        <h1 className='survey-name'>{survey.name}</h1>
        {survey.questions.map(question => (
          <div key={question.id} className="card">
            <div className="card-body">
              <div className="question">
                <p className="question-text">{question.content}</p>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map(starRating => (
                    <span
                      key={starRating}
                      className={`star ${ratings[question.id] >= starRating ? 'selected' : ''}`}
                      onClick={() => handleRatingChange(question.id, starRating)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Ratings'}
        </button>
      </div>
    );
  };

  export default SurveyApp;