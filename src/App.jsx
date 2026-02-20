import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import LinkedInAnalysis from "./pages/LinkedInAnalysis";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import ResumeView from "./pages/ResumeView";

import JobMatches from "./pages/JobMatches";
import Profile from "./pages/Profile";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* FRONT PAGE */}
        <Route path="/" element={<Landing />} />


        {/* AUTHENTICATION */}
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forgot" element={<ForgotPassword />} />


        {/* MAIN PROJECT FLOW */}

        {/* 1. LinkedIn Analysis FIRST */}
        <Route
          path="/linkedin-analysis"
          element={<LinkedInAnalysis />}
        />

        {/* 2. Resume Analysis */}
        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />

        {/* 3. Resume View Page */}
        <Route
          path="/resume-view"
          element={<ResumeView />}
        />

        {/* 4. Job Matches */}
        <Route
          path="/jobs"
          element={<JobMatches />}
        />

        {/* 5. Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />


      </Routes>

    </BrowserRouter>

  );

}

export default App;
