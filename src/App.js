import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import SurveyApp from './components/SurveyApp'; // Import SurveyApp component
import { useParams } from 'react-router-dom';

const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={token ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/surveys/:surveyLink" element={<SurveyApp />} /> {/* Add route for the survey link */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
