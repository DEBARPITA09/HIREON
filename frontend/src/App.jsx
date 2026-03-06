
import './App.css';
import { Nav } from './Components/01_Nav';
import { Home } from './Components/01a_Home';
import { About } from './Components/01c_About';
import { Contact } from './Components/01d_Contact';
import { Help } from './Components/01e_Help';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Services } from './Components/01b_Services';
import { Footer } from './Components/02_Footer';
import { CandidateHomePage } from './Candidate/01_Candidate';
import { RecruiterHomePage } from './Recruiter/01_Recruiter';
import { LoginCandidate } from './Candidate/02_LoginCand';
import { SignupCandidate } from './Candidate/03_SignupCand';
import { CandidateMain } from './Candidate/04_MainCand';

import { LoginRecruiter } from './Recruiter/02_LoginRec';
import { SignupRecruiter } from './Recruiter/03_SignupRec';
import { RecruiterMain } from './Recruiter/04_MainRec';
import { CandidatesApplied } from "./Recruiter/05_CandidatesApplied";

import { ResumeAnalysis } from './Candidate/05_ResumeAnalysis';
function App() {
  return (
    <BrowserRouter> 
        
        <div className="app-container">
            <Nav />
            <div className="content">
                <Routes>
                     <Route path="/" element={<Home/>}/>
                     <Route path="/Candidate/01_Candidate" element={<CandidateHomePage/>}/>
                     <Route path="/Recruiter/01_Recruiter" element={<RecruiterHomePage/>}/>
                     <Route path="/01b_Services" element={<Services/>}/>
                     <Route path="/01c_About" element={<About/>}/>
                      {/* means its a route from the nav wala page to the about wala page. on clicking on about in the navbar - we reach the about(element) wala page 
                      
                      react-router expects url path. so "./home" wont work. rather "/home" would.
                      */}
                     <Route path="/01d_Contact" element={<Contact/>}/>
                     <Route path="/01e_Help" element={<Help/>}/>
                
                {/*Candidate*/}
                
                  <Route path="/Candidate/02_LoginCand" element={<LoginCandidate/>}/>
                  <Route path="/Candidate/03_SignupCand" element={<SignupCandidate/>}/>
                  <Route path="/Candidate/04_MainCand" element={<CandidateMain/>}/>
                  <Route path="/Candidate/05_ResumeAnalysis" element={<ResumeAnalysis/>}/>
                

                {/*Recruiter*/}
                
                  <Route path="/Recruiter/02_LoginRec" element={<LoginRecruiter/>}/>
                  <Route path="/Recruiter/03_SignupRec" element={<SignupRecruiter/>}/>
                  <Route path="/Recruiter/04_MainRec" element={<RecruiterMain/>}/>
                  <Route path="/job/:jobId" element={<CandidatesApplied/>} />
                </Routes>
            </div>     

            <Footer/>
        </div>
     
    </BrowserRouter>
  )
}

export default App;
//as nav bar and footer outside <routes> hence they'll be visible everywhere
/*
-------------------
Navbar
-------------------
<Routes>Dynamic Page Content (changes)</Routes>
-------------------
Footer
-------------------
*/

