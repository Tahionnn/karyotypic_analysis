import React from 'react';
import { Routes, Route } from "react-router-dom";
import ImageUploader from './components/ImageUploader';
import Login from "./components/Login";
import Registration from "./components/Registration";
import { RequireToken } from "./components/Auth";
import SavedNotebooks from './components/SavedNotebooks';
import NotebookDetail from './components/NotebookDetail';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/app/*"
        element={
          <RequireToken>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="app-content">
                    <div className="sidebar">
                      <SavedNotebooks />
                    </div>
                    <div className="main-content">
                      <ImageUploader />
                    </div>
                  </div>
                }
              />
              <Route path="notebook/:notebook_id" element={<NotebookDetail />} />
              <Route path="upload" element={<ImageUploader />} />
            </Routes>
          </RequireToken>
        }
      />
    </Routes>
  );
};

export default App;
