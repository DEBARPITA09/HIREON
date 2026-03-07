import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Nav } from './Components/01_Nav';
import { Home } from './Components/01a_Home';
import { Services } from './Components/01b_Services';
import { About } from './Components/01c_About';
import { Contact } from './Components/01d_Contact';
import { Help } from './Components/01e_Help';
import { Footer } from './Components/02_Footer';

import { CandidateHomePage } from './Candidate/01_Candidate';
import { LoginCandidate } from './Candidate/02_LoginCand';
import { SignupCandidate } from './Candidate/03_SignupCand';
import { ForgotPasswordCandidate } from './Candidate/04_ForgotPassword';
import { ResetPasswordCandidate } from './Candidate/05_ResetPassword';
import { CandidateMain } from './Candidate/06_MainCand';
import { ResumeBuilder } from './Candidate/07_ResumeBuilder';
import { ResumeAnalysis } from './Candidate/08_ResumeAnalysis';
import { ATSChecker } from './Candidate/09_ATSChecker';
import { JobMatching } from './Candidate/10_JobRecommendation';
import { ApplicationTracker } from './Candidate/11_ApplicationStatus';
import { ProfileManagement } from './Candidate/12_ProfileManagement';

import { RecruiterHomePage } from './Recruiter/01_Recruiter';
import { LoginRecruiter } from './Recruiter/02_LoginRec';
import { SignupRecruiter } from './Recruiter/03_SignupRec';
import { ForgotPasswordRecruiter } from './Recruiter/04_ForgotPassword';
import { ResetPasswordRecruiter } from './Recruiter/05_ResetPassword';
import { RecruiterMain } from './Recruiter/06_MainRec';

function AppLayout() {
  const location = useLocation();

  const hideNavFooter = location.pathname.startsWith("/Candidate/services") ||
                        location.pathname.startsWith("/Candidate/06") ||
                        location.pathname.startsWith("/Recruiter/06");

  return (
    <div className="app-container">
      {!hideNavFooter && <Nav />}
      <div className="content">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />

          <Route path="/Candidate/01_Candidate" element={<CandidateHomePage />} />
          <Route path="/Candidate/02_LoginCand" element={<LoginCandidate />} />
          <Route path="/Candidate/03_SignupCand" element={<SignupCandidate />} />
          <Route path="/Candidate/04_ForgotPassword" element={<ForgotPasswordCandidate />} />
          <Route path="/Candidate/05_ResetPassword" element={<ResetPasswordCandidate />} />
          <Route path="/Candidate/06_MainCand" element={<CandidateMain />} />
          <Route path="/Candidate/services/resume-builder" element={<ResumeBuilder />} />
          <Route path="/Candidate/services/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/Candidate/services/ats-checker" element={<ATSChecker />} />
          <Route path="/Candidate/services/job-matching" element={<JobMatching />} />
          <Route path="/Candidate/services/application-tracker" element={<ApplicationTracker />} />
          <Route path="/Candidate/services/profile-management" element={<ProfileManagement />} />

          <Route path="/Recruiter/01_Recruiter" element={<RecruiterHomePage />} />
          <Route path="/Recruiter/02_LoginRec" element={<LoginRecruiter />} />
          <Route path="/Recruiter/03_SignupRec" element={<SignupRecruiter />} />
          <Route path="/Recruiter/04_ForgotPassword" element={<ForgotPasswordRecruiter />} />
          <Route path="/Recruiter/05_ResetPassword" element={<ResetPasswordRecruiter />} />
          <Route path="/Recruiter/06_MainRec" element={<RecruiterMain />} />

        </Routes>
      </div>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;