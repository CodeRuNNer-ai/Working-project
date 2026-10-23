AI Study Notes & Quiz Generator 📚

This project is a web application designed to make studying easier. It can turn YouTube videos into structured PDF notes and generate MCQ quizzes from uploaded PDF documents using AI.

The main goal is to save time when preparing notes and revising topics. Instead of manually writing everything down or creating questions from scratch, users can generate study material and practice questions in one place.

Features
YouTube to PDF: Paste a YouTube video link and generate structured notes from its transcript.
AI-generated notes: Use the Grok API to organize video content into headings, summaries, and important points.
Notes history: Save generated notes in MongoDB and access them later.
PDF to MCQ quiz: Upload a PDF and generate multiple-choice questions from its content.
Automated workflows: Use n8n to connect transcript extraction, AI processing, and quiz generation.
Tech Stack
React.js
Vite
Node.js
MongoDB
n8n
Grok API
YouTube Transcript API
Project Structure
React-Project-college/
├── public/
├── src/                  # React frontend source code
├── backend/
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handling and application logic
│   ├── middleware/        # Middleware functions
│   ├── models/            # MongoDB models
│   ├── routes/            # Backend API routes
│   ├── .env               # Environment variables (not committed)
│   ├── server.js          # Backend entry point
│   └── package.json
├── README.md
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js

How It Works
YouTube Video to Notes
Paste a YouTube video link into the application.
Retrieve the video's transcript using the YouTube Transcript API.
Process the transcript through an n8n workflow and the Grok API.
Generate structured study notes and convert them into a PDF.
Save the generated notes and relevant details in MongoDB for future access.
PDF to Quiz
Upload a PDF containing study material.
Extract the text from the document.
Send the content for AI processing.
Generate MCQs based on the uploaded material.
Use the quiz to test your understanding and revise important concepts.
Getting Started
Prerequisites

Make sure you have installed:

Node.js and npm
MongoDB or a MongoDB Atlas account
A Grok API key
An n8n instance with the required workflows
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd React-Project-college


Replace the repository URL with your actual GitHub repository URL.

2. Install frontend dependencies
npm install

3. Install backend dependencies
cd backend
npm install

4. Configure environment variables

Create a .env file inside the backend folder and add the configuration required by your application.

PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROK_API_KEY=your_grok_api_key
N8N_WEBHOOK_URL=your_n8n_webhook_url


These are example variable names. Make sure they match the names actually used in your backend code. Keep your API keys and database credentials private.

5. Run the backend

From the backend directory, run:

npm run dev


If your backend does not have a dev script, use the appropriate script from backend/package.json, or run node server.js if configured for direct execution.

6. Run the frontend

Open a new terminal in the project root and run:

npm run dev


Vite will display a local URL where you can open the application in your browser.

What I Learned

This project brings together frontend development, backend APIs, database integration, and AI-powered automation. It also provides practical experience working with YouTube transcripts, PDF processing, and automated quiz generation.

Future Improvements
Add user login and personalized note history.
Show answers and explanations after completing a quiz.
Add quiz scores and progress tracking.
Support flashcards and different question difficulty levels.
Improve searching and organizing saved study materials.
License

A license can be added if the project is released for public use.

Built with React, Node.js, MongoDB, n8n, and AI-powered APIs.
