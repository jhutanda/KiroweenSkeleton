# KiroweenSkeleton

A full-stack dual-application productivity platform with Smart Notes and Daily Task Manager, built with React, TypeScript, and AWS services.

## Project Status

🚧 **Currently Implemented:**
- ✅ Project structure and monorepo setup
- ✅ Shared components library with Tailwind CSS
- ✅ Smart Notes App foundation
- ✅ Authentication system (mock implementation)
- ✅ Redux store with RTK Query
- ✅ Basic UI components and theming
- ✅ Note creation, editing, and viewing

🔄 **In Progress:**
- Task Manager App
- AWS infrastructure setup
- AI integration
- Backend Lambda functions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start the Notes App:**
```bash
cd apps/notes-app
npm run dev
```

The Notes app will be available at `http://localhost:3000`

### Login Credentials

Since this is a mock implementation, you can use any email/password combination to log in:
- Email: `test@example.com`
- Password: `password123`

## Project Structure

```
KiroweenSkeleton/
├── apps/
│   ├── notes-app/           # Smart Notes application
│   └── tasks-app/           # Daily Task Manager (coming soon)
├── shared/
│   ├── components/          # Shared UI components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   └── theme/              # Tailwind theme config
├── backend/                 # Lambda functions (coming soon)
├── infra/                   # AWS CDK infrastructure (coming soon)
└── docs/                    # Documentation
```

## Features

### Smart Notes App
- ✅ Create, edit, and delete notes
- ✅ Markdown-style preview
- ✅ Search and filtering
- ✅ Tag management
- ✅ Dark/light theme toggle
- 🔄 AI summarization (UI ready, backend pending)
- 🔄 Version history

### Shared Features
- ✅ Unified authentication across apps
- ✅ Consistent design system
- ✅ Responsive layout
- ✅ Loading states and animations

## Development

### Available Scripts

```bash
# Install all dependencies
npm install

# Start Notes app development server
cd apps/notes-app && npm run dev

# Build all apps
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, RTK Query
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: AWS Lambda, DynamoDB, API Gateway (planned)
- **AI**: OpenAI/Gemini integration (planned)

## Next Steps

1. Complete Task Manager App
2. Set up AWS infrastructure with CDK
3. Implement Lambda functions for backend
4. Add AI integration for summarization and scheduling
5. Add PWA capabilities
6. Implement real authentication with AWS Cognito

## Contributing

This is a hackathon project template. Feel free to fork and customize for your needs!

## License

MIT License - see LICENSE file for details.