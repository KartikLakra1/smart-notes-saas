# Notes Guru

A smart note-taking application powered by AI. Create, organize, and interact with your notes using AI-powered summaries and Q&A.

## Features

- **Smart Note Taking** - Create and organize notes by topic
- **AI Summaries** - Generate instant summaries of your notes
- **AI Q&A** - Ask questions and get contextual answers
- **Tag Management** - Organize with custom tags
- **Search** - Quick search across all notes
- **Dark/Light Mode** - Toggle between themes
- **Secure Authentication** - Powered by Clerk

## Tech Stack

### Frontend

- Next.js 15
- React 18
- Redux Toolkit
- Tailwind CSS
- Shadcn UI
- Clerk Authentication

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- OpenAI API

### DevOps

- Docker
- Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (or MongoDB Atlas account)
- Clerk account
- OpenAI API key (optional for AI features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/notes-guru.git
cd notes-guru
```

2. **Setup Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

3. **Setup Frontend**

```bash
cd ../client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Run the application**

Terminal 1 - Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Frontend:

```bash
cd client
npm run dev
```

5. **Open your browser**

```
http://localhost:3000
```

## Docker Setup

### Run with Docker Compose

1. **Build and start all services**

```bash
docker-compose up --build
```

2. **Stop services**

```bash
docker-compose down
```

3. **View logs**

```bash
docker-compose logs -f
```

## Project Structure

```
notes-guru/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App routes
│   │   ├── components/    # React components
│   │   └── store/         # Redux store
│   └── package.json
├── server/                # Backend (Express)
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### AI

- `POST /api/ai/summary/:noteId` - Generate summary
- `POST /api/ai/chat/:noteId` - Chat with AI
- `GET /api/ai/chat/:noteId` - Get chat history
- `DELETE /api/ai/chat/:noteId` - Clear chat

## Features in Detail

### Note Management

- Create notes with title, topic, and content
- Add custom tags for organization
- Edit and delete notes
- Search across all notes

### AI Features

- Generate concise summaries
- Ask questions about your notes
- Get contextual answers
- Chat history persistence

### UI/UX

- Clean, minimal design
- Dark and light themes
- Responsive layout
- Smooth interactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

Your Name - [GitHub](https://github.com/yourusername)
