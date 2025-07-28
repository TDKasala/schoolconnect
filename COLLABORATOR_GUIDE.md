# SchoolConnect - Collaborator Guide

Welcome to the SchoolConnect project! This guide is designed to help new collaborators understand the project structure, development workflow, and contribution guidelines.

## 🎯 Project Overview

SchoolConnect is a School Management System (SaaS) built for schools in the Democratic Republic of Congo. The platform provides digital solutions optimized for low-bandwidth internet connections.

### Key Features
- **POSP (Pedagogy)** - Class, grade, and assessment management
- **UBank (Finance)** - School financial and accounting management
- **Connected Portals** - Communication between school, teachers, and parents
- **Multi-role Access** - Platform admin, school admin, teacher, and parent roles

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom animations
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel
- **PWA**: Vite PWA Plugin

## 📁 Project Structure

```
SchoolConnect/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   └── teacher/       # Teacher-specific components
│   ├── pages/             # Page components
│   │   ├── auth/          # Login, Register, ForgotPassword
│   │   ├── dashboard/     # Dashboard sections
│   │   └── public/        # Public marketing pages
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services and business logic
│   ├── types/             # TypeScript types and interfaces
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── supabase/              # Supabase schema and policies
├── scripts/               # Utility scripts
├── .env.example           # Environment variables template
├── tailwind.config.js     # TailwindCSS configuration
├── vite.config.ts         # Vite build configuration
└── vercel.json            # Vercel deployment configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TDKasala/schoolconnect.git
   cd schoolconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🧪 Development Workflow

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Bug fixes for production

### Git Workflow
1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to `develop`

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Write clear, descriptive commit messages
- Maintain consistent styling with TailwindCSS
- Ensure components are reusable and well-documented

## 🔐 Authentication & Authorization

### User Roles
1. **Platform Admin** - Full access to all schools and features
2. **School Admin** - Access to one school's data and management
3. **Teacher** - Access to class management and student data
4. **Parent** - Access to child's progress and communication

### Supabase Integration
- Authentication handled by Supabase Auth
- Row Level Security (RLS) policies for data protection
- Automatic user profile creation via database triggers

## 🌐 Supabase Setup

### Database Schema
The schema is defined in `supabase/final-schema.sql` and includes:
- Users table with role-based access
- Schools, classes, students, grades tables
- Payments, attendance, messages tables

### RLS Policies
Policies are defined in `supabase/rls-policies-fixed.sql` and ensure:
- Users can only access their own data
- Platform admins have full access
- Proper role-based access control

## 🎨 UI/UX Guidelines

### Design System
- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Green (#16a34a)
- **Accent Color**: Violet (#7c3aed)
- **Font**: System UI stack

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1280px
- Touch-friendly interface

### Accessibility
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigation support
- Color contrast compliance

## 🧪 Testing

### Testing Strategy
- Manual testing for UI components
- Integration testing for critical flows
- End-to-end testing for authentication

### Browser Support
- Latest Chrome, Firefox, Safari
- Mobile browsers (Android, iOS)
- Progressive Web App support

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Automatic deployments on push to `main`

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## 🐛 Troubleshooting

### Common Issues

1. **Blank page on load**
   - Check browser console for errors
   - Verify Supabase credentials
   - Ensure RLS policies are applied

2. **Authentication failures**
   - Confirm user exists in Supabase Auth
   - Check user role in public.users table
   - Verify RLS policies for users table

3. **Build errors**
   - Check for TypeScript compilation errors
   - Verify all dependencies are installed
   - Ensure environment variables are set

### Debugging Tips
- Use browser developer tools
- Check Supabase dashboard for errors
- Review console logs in development
- Test API endpoints directly

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write clear commit messages
5. Submit a pull request

### Code Review Process
- All PRs require review by maintainers
- Automated checks must pass
- Code must follow established patterns
- Documentation should be updated

### Reporting Issues
- Use GitHub Issues
- Include steps to reproduce
- Provide environment details
- Add screenshots if applicable

## 📞 Support

For questions or support:
- Email: support@schoolconnect.cd
- GitHub Issues: https://github.com/TDKasala/schoolconnect/issues

## 📄 License

© 2024 SchoolConnect. All rights reserved.

---

**Built with ❤️ for education in DRC**
