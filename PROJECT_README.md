# 🚀 Portfolio & Company Website Project

A comprehensive dual-website project featuring a personal portfolio and company website with unified admin management.

## 📋 Project Overview

This project consists of two interconnected websites:
- **Personal Portfolio Website** (Port 3003) - Showcasing personal projects and skills
- **Company Website** (Port 3001) - Professional business presence for Khwass Tech
- **Unified Admin Panel** - Single dashboard managing both websites

## ✨ Key Features

### 🎯 Portfolio Website Features
- **Dynamic CV Section** - Download/preview CV from database
- **Project Showcase** - Dynamic project display with filtering
- **Skills & Experience** - Interactive skills presentation
- **Contact Integration** - Dynamic contact information from database
- **Responsive Design** - Mobile-first approach with dark mode

### 🏢 Company Website Features
- **Professional Branding** - Custom logo and favicon
- **Services & Products** - Dynamic content management
- **Project Portfolio** - Filtered company projects
- **Admin Dashboard** - Complete CRUD operations
- **SEO Optimized** - Meta tags and structured data

### 🛠️ Admin Panel Features
- **Unified Management** - Control both websites from one dashboard
- **Project Visibility** - Set projects for company/portfolio/both/hidden
- **Image Upload** - Supabase Storage integration
- **Dynamic Content** - Real-time updates across websites
- **User Authentication** - Secure admin access

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Relational database
- **Real-time subscriptions** - Live data updates
- **File storage** - Image and document management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd portfolio-project
```

2. **Install dependencies**
```bash
# Portfolio website
npm install

# Company website  
cd company-website
npm install
cd ..
```

3. **Environment Setup**
```bash
# Copy environment file
cp .env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Project

```bash
# Start portfolio website (Port 3003)
npm run dev

# Start company website (Port 3001) 
cd company-website
npm run dev
```

### Access Points
- **Portfolio Website**: http://localhost:3003
- **Company Website**: http://localhost:3001  
- **Admin Panel**: http://localhost:3001/admin

## 📁 Project Structure

```
portfolio-project/
├── src/                          # Portfolio website source
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   │   ├── CVSection.tsx         # Dynamic CV section
│   │   ├── Hero.tsx              # Hero section with DB integration
│   │   └── Contact.tsx           # Dynamic contact info
│   └── lib/                      # Utilities and API
│       └── supabase.ts           # Database client & APIs
├── company-website/              # Company website source
│   ├── src/
│   │   ├── app/
│   │   │   └── admin/            # Admin dashboard
│   │   └── components/
│   │       └── admin/            # Admin components
│   └── public/
│       ├── logo.png              # Company logo
│       └── manifest.json         # PWA manifest
├── public/                       # Portfolio assets
└── README.md                     # This file
```

## 🎨 Design Features

### Visual Design
- **Modern UI/UX** - Clean, professional interface
- **Dark Mode Support** - System preference detection
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Framer Motion integration
- **Custom Branding** - Logo integration and favicon

### User Experience
- **Fast Loading** - Optimized images and code splitting
- **SEO Friendly** - Meta tags and structured data
- **Accessibility** - WCAG compliance
- **Progressive Web App** - Installable experience

## 🔧 Admin Panel Guide

### Project Management
1. **Add New Project**
   - Fill project details
   - Upload images to Supabase Storage
   - Set visibility (Company/Portfolio/Both/Hidden)
   - Mark as featured if needed

2. **Visibility Controls**
   - **Company Only**: Shows only on company website
   - **Portfolio Only**: Shows only on portfolio website  
   - **Both**: Shows on both websites
   - **Hidden**: Not visible on any website

3. **Content Management**
   - Update personal information
   - Manage company details
   - Upload and organize media files

## 🌐 Deployment

### Vercel Deployment (Recommended)
```bash
# Deploy portfolio website
vercel --prod

# Deploy company website
cd company-website
vercel --prod
```

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 👨‍💻 Developer

**Mohamed Ali Khwass**
- Email: mohamedalikwass@gmail.com
- GitHub: [@mo7amed3li5wass17](https://github.com/mo7amed3li5wass17)
- LinkedIn: [Mohamed Ali Khwass](https://linkedin.com/in/mohamedalikwass)

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Vercel** - Deployment platform
- **Next.js Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
