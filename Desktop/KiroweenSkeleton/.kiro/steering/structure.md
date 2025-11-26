# Project Structure

## Monorepo Organization

```
KiroweenSkeleton/
├── apps/
│   ├── notes-app/           # Smart Notes application
│   └── tasks-app/           # Daily Task Manager application
├── shared/
│   ├── components/          # Shared UI component library
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── theme/              # Tailwind theme configuration
├── backend/
│   ├── functions/
│   │   ├── notes/          # Note CRUD operations
│   │   ├── tasks/          # Task CRUD operations
│   │   ├── ai-proxy/       # AI service integration
│   │   └── notifications/  # Browser notification handling
│   ├── shared/             # Lambda utilities and middleware
│   └── types/              # Backend type definitions
├── infra/
│   ├── lib/                # CDK stack definitions
│   ├── bin/                # CDK app entry point
│   └── config/             # Environment configurations
└── docs/                   # Documentation and specs
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `NoteEditor.tsx`, `TaskCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useNotes.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateNote.ts`)
- **Types**: PascalCase interfaces/types (e.g., `Note.ts`, `Task.ts`)
- **Lambda functions**: kebab-case directories (e.g., `create-note/`, `get-tasks/`)

### Import Organization
1. External libraries (React, AWS SDK, etc.)
2. Internal shared modules (components, hooks, utils)
3. Relative imports (local components, types)

### Component Structure
- Each component in its own directory with index.ts barrel export
- Co-locate tests, styles, and related utilities
- Use TypeScript interfaces for all props and state

### Data Models
- **DynamoDB**: Single table design with composite keys
- **API**: RESTful endpoints with consistent response formats
- **Types**: Shared TypeScript definitions between frontend and backend

### Authentication Flow
- AWS Cognito handles all authentication
- Shared auth context across both applications
- Protected routes with automatic redirects

### State Management
- RTK Query for server state and caching
- React Context for global UI state (theme, auth)
- Local state for component-specific data

### Testing Structure
- Unit tests co-located with components
- Property-based tests in dedicated `__tests__/properties/` directories
- Integration tests in `tests/integration/`
- Mock data and utilities in `tests/fixtures/`