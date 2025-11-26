# Technology Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shared design tokens
- **State Management**: RTK Query for API caching and data synchronization
- **Routing**: React Router with code splitting and lazy loading
- **Animations**: Framer Motion for smooth UI interactions
- **PWA**: Service Worker for offline capabilities and notifications

## Backend (Serverless)
- **Runtime**: AWS Lambda functions (Node.js/TypeScript)
- **API**: AWS API Gateway with REST endpoints
- **Database**: DynamoDB with single table design
- **Authentication**: AWS Cognito (User Pool + Identity Pool)
- **Security**: AWS Systems Manager Parameter Store for API keys
- **Infrastructure**: AWS CDK for Infrastructure as Code

## AI Integration
- **Services**: OpenAI GPT or Google Gemini APIs
- **Architecture**: Lambda proxy functions for secure API access
- **Features**: Note summarization and task scheduling optimization

## Development Tools
- **Monorepo**: Workspace configuration with apps/, shared/, backend/, infra/
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest, React Testing Library, fast-check for property-based testing
- **Performance**: Bundle analysis, Lighthouse audits, lazy loading

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### AWS Deployment
```bash
# Deploy infrastructure
npm run deploy:infra

# Deploy Lambda functions
npm run deploy:backend

# Deploy frontend
npm run deploy:frontend
```

### Testing
```bash
# Run all tests
npm run test

# Run property-based tests
npm run test:properties

# Run integration tests
npm run test:integration
```