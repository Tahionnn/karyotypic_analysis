import React from 'react';
import { Routes, Route } from "react-router-dom";
import ImageUploader from './components/ImageUploader';
import Login from "./components/Login";
import Registration from "./components/Registration";
import { RequireToken } from "./components/Auth";
import SavedNotebooks from './components/SavedNotebooks';
import NotebookDetail from './components/NotebookDetail';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route 
          path="/app/*" 
          element={
            <RequireToken>
              <Routes>
                <Route path="/" element={
                  <div>
                    <SavedNotebooks />
                    <ImageUploader />
                  </div>
                } />
                <Route path="notebook/:notebook_id" element={<NotebookDetail />} />
                <Route path="upload" element={<ImageUploader />} />
              </Routes>
            </RequireToken>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
