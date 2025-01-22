import React from 'react';
import { Routes, Route } from "react-router-dom";
import ImageUploader from './components/ImageUploader';
import Login from "./components/Login";
import Registration from "./components/Registration";
import { RequireToken } from "./components/Auth";



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element = {<Login />}/>
        <Route path="/registration" element = {<Registration />}/>
        <Route 
          path="/app" 
          element={
            <RequireToken>
              <ImageUploader />
            </RequireToken>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
