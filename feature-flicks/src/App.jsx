import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MovieList from './components/MovieList';
import Header from './components/Header';
import MovieBookingPage from './components/MovieBookingPage';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/bookings/:id" element={<MovieBookingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
