# HIREON

## How to run locally

### 1. Clone the repo and switch to frontend branch
git clone https://github.com/DEBARPITA09/HIREON.git
cd HIREON
git checkout frontend

### 2. Setup Backend
cd backend
npm install

Create a `.env` file in the backend folder.
Copy `.env.example` and fill in the values 
(get them from Debarpita on WhatsApp)

node server.js
# Should show: HIREON Backend running on port 5000

### 3. Setup Frontend (open a second terminal)
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173