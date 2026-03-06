import './App.css';
import { Nav } from './Components/01_Nav';
import { Home } from './Components/01a_Home';
import { About } from './Components/01c_About';
import { Contact } from './Components/01d_Contact';
import { Help } from './Components/01e_Help';
import { Services } from './Components/01b_Services';
import { Footer } from './Components/02_Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CandidateHomePage } from './Candidate/01_Candidate';
import { LoginCandidate } from './Candidate/02_LoginCand';
import { SignupCandidate } from './Candidate/03_SignupCand';
import { ForgotPasswordCandidate } from './Candidate/04_ForgotPassword';
import { ResetPasswordCandidate } from './Candidate/05_ResetPassword';
import { CandidateMain } from './Candidate/06_MainCand';
import { ResumeAnalysis } from './Candidate/07_ResumeAnalysis';
import { RecruiterHomePage } from './Recruiter/01_Recruiter';
import { LoginRecruiter } from './Recruiter/02_LoginRec';
import { SignupRecruiter } from './Recruiter/03_SignupRec';
import { RecruiterMain } from './Recruiter/04_MainRec';
import { CandidatesApplied } from './Recruiter/05_CandidatesApplied';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Nav />
        <div className="content">
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />

            {/* Candidate */}
            <Route path="/Candidate/01_Candidate" element={<CandidateHomePage />} />
            <Route path="/Candidate/02_LoginCand" element={<LoginCandidate />} />
            <Route path="/Candidate/03_SignupCand" element={<SignupCandidate />} />
            <Route path="/Candidate/ForgotPassword" element={<ForgotPasswordCandidate />} />
            <Route path="/Candidate/ResetPassword" element={<ResetPasswordCandidate />} />
            <Route path="/Candidate/04_MainCand" element={<CandidateMain />} />
            <Route path="/Candidate/05_ResumeAnalysis" element={<ResumeAnalysis />} />

            {/* Recruiter */}
            <Route path="/Recruiter/01_Recruiter" element={<RecruiterHomePage />} />
            <Route path="/Recruiter/02_LoginRec" element={<LoginRecruiter />} />
            <Route path="/Recruiter/03_SignupRec" element={<SignupRecruiter />} />
            <Route path="/Recruiter/04_MainRec" element={<RecruiterMain />} />
            <Route path="/job/:jobId" element={<CandidatesApplied />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
