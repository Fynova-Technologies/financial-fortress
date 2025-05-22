# FinCalc Pro - Financial Calculator Suite

## Overview

FinCalc Pro is a comprehensive financial calculator suite that helps users make informed financial decisions. The application offers various financial calculators including budget planners, mortgage calculators, EMI calculators, retirement planners, and more.

The project is built as a full-stack application with a React frontend and an Express backend. It uses Drizzle ORM for database operations, and is designed to work with PostgreSQL. The application implements a modern UI using shadcn/ui components with a consistent design system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a classic client-server architecture:

1. **Frontend**: React-based SPA (Single Page Application) using modern React patterns with functional components and hooks. The UI is built with shadcn/ui components, which are based on Radix UI primitives.

2. **Backend**: Express.js server that handles API requests, authentication, and database operations. The server exposes RESTful endpoints with the `/api` prefix.

3. **Database**: Uses Drizzle ORM with a PostgreSQL database (though currently appears to be using in-memory storage in development).

4. **State Management**: Combines React Context for global state (calculator context) with local component state where appropriate.

5. **Routing**: Uses Wouter for client-side routing, which is a lightweight alternative to React Router.

## Key Components

### Frontend
1. **Layout Structure**:
   - `MainLayout`: The main wrapper component that includes the sidebar, mobile header, and content area
   - `Sidebar`: Navigation sidebar for desktop
   - `MobileHeader` and `MobileNavigation`: Responsive navigation for mobile devices

2. **Pages**:
   - Home dashboard
   - Specialized calculator pages (Budget Planner, Mortgage Calculator, etc.)
   - Each calculator has its own dedicated page and component

3. **State Management**:
   - `CalculatorProvider`: Context provider for calculator-related data and functions
   - Uses React Query for API data fetching

4. **UI Components**:
   - Uses shadcn/ui component library
   - Custom UI components built on top of Radix UI primitives
   - Responsive design with Tailwind CSS

### Backend
1. **Express Server**:
   - Entry point at `server/index.ts`
   - API routes defined in `server/routes.ts`

2. **Data Storage**:
   - Database schema defined in `shared/schema.ts`
   - Uses Drizzle ORM for database operations
   - `storage.ts` implements storage methods (currently using in-memory storage)

3. **API Layer**:
   - Currently needs implementation of full REST endpoints

### Database Schema
1. **Users**:
   - Basic user information (username, password, email)

2. **Budgets**:
   - Budget information linked to users
   - Includes total income and budget name

3. **Expense Categories**:
   - Categories for budget expenses
   - Linked to budgets

## Data Flow

1. **User Input**:
   - User interacts with calculator UI components
   - Input is validated and processed locally first

2. **State Updates**:
   - Local calculator state is updated via the calculator context
   - Calculations are performed on the client side for immediate feedback

3. **API Communication**:
   - Data is saved/retrieved through API calls to the backend
   - React Query is set up for data fetching and caching

4. **Data Persistence**:
   - Backend stores data in the PostgreSQL database via Drizzle ORM
   - Data is organized according to the schema defined in `shared/schema.ts`

## External Dependencies

### Frontend
- **React**: Core UI library
- **Wouter**: Lightweight routing
- **@tanstack/react-query**: Data fetching and caching
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **recharts**: Chart visualization
- **date-fns**: Date manipulation

### Backend
- **Express**: Web server framework
- **Drizzle ORM**: Database ORM
- **zod**: Schema validation
- **PostgreSQL**: Database (via Neon Serverless)

## Deployment Strategy

The application is configured for deployment on Replit with the following strategy:

1. **Development**:
   - Run with `npm run dev` which starts the development server with hot reloading

2. **Build**:
   - Frontend is built with Vite
   - Backend is bundled with esbuild

3. **Production**:
   - Serves the static frontend files from the Express server
   - Database connection established via environment variables

4. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Environment mode (development/production)

## Next Steps for Development

1. **API Implementation**:
   - Complete the REST API endpoints in `server/routes.ts`
   - Implement proper authentication and authorization

2. **Database Integration**:
   - Move from in-memory storage to actual PostgreSQL database
   - Implement database migrations with Drizzle

3. **Full Calculator Functionality**:
   - Complete all calculator implementations
   - Add more sophisticated financial calculations

4. **User Authentication**:
   - Implement proper user registration and login flow
   - Add session management