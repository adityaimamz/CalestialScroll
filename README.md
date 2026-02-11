
---

# 📚 Celestial Scrolls – Immortal Library

**Celestial Scrolls** is a modern web platform dedicated to delivering an immersive reading experience for Celestial, Xianxia, and Fantasy novels. Built with the latest web technologies, the platform offers an elegant, fast, and fully responsive interface.

---

## 📸 Preview
![CelestialScrolls Preview](./public/readme/preview.jpeg)

## 🚀 Live Demo

👉 **Try it here:** [https://calestial-scroll.vercel.app/](https://calestial-scroll.vercel.app/)
Deployed on **Vercel**

## 🌟 Key Features

### 📖 For Readers

* **Immersive Reading Experience** – A distraction-free reading mode with full customization:

  * **Font Type**: Choose between Serif and Sans-serif
  * **Text Size**: Adjustable for eye comfort
  * **Reader Theme**: Light, Sepia, and Dark modes available
  * **Visual Progress**: Indicators for read chapters to track your journey
  * **Tap to Toggle Controls**: Tap/click to show/hide navigation bar for a clean reading view

* **Complete Novel Catalog**

  * Advanced search and filtering capabilities
  * Interactive Genre cards with 3D hover effects
  * Sorting options (Most Popular, Latest, Top Rated)
  * **Dedicated Genres Page**: Browse novels by specific genre categories

* **📊 Rankings Page**

  * View novels ranked by popularity, rating, and views
  * Chapter count and detailed statistics per novel

* **Smart Library & Tracking**

  * **Recently Read**: Quick access to your last read book on the homepage
  * **Bookmarks**: Save your favorite series with sorting options (Time Added, Rating, Latest Chapter)
  * **History**: Comprehensive reading history
  * **Engagement**: Novel rating system and real-time view counters

* **🎖️ Cultivation Badge System (Gamification)**

  * Earn badges based on chapters read – 11 tier progression from **Martial Apprentice** to **Martial God**
  * Each badge has unique visual styling with gradients, glows, and animations
  * **Badge List Modal**: View all badge tiers, your current realm, and progression
  * Rainbow glow effect for the highest **Martial God** tier

* **👤 User Profiles & Settings**

  * **User Profile Modal**: Click on any user to view their public profile (avatar, bio, role badge, cultivation badge, join date)
  * **Profile Settings**: Update username, bio, and avatar (via image upload with UploadThing)
  * **Security Settings**: Change password with current password verification
  * **Role Badges**: Users are displayed with role badges – Mortal (User), Immortal (Moderator), Immortal King (Admin)

* **💬 Advanced Comment System**

  * **Threaded Replies**: Reply to comments with nested threads
  * **Upvote / Downvote**: Vote on comments to surface the best discussions
  * **Edit & Delete**: Edit your own comments or delete them
  * **Report Comments**: Report inappropriate comments with a reason
  * **Pagination**: Load more comments for threads with many responses

* **🚩 Report System**

  * **Report Chapters**: Report chapters with issues (translation errors, missing content, etc.)
  * **Report Comments**: Flag inappropriate comments for admin review
  * **Status Tracking**: Reports are tracked with pending/resolved/ignored statuses

* **📝 Request Novel**

  * Dedicated page for readers to request new novels via the comment system
  * DMCA guidelines displayed to inform users of content restrictions

* **User Interaction**

  * **Authentication**: Seamless login via **Google** or Email
  * **Forgot / Reset Password**: Full password recovery flow via email
  * **Community**: Comment system on novels and chapters for discussions

* **🏠 Dynamic Homepage**

  * **Hero Carousel**: Featured novels with randomized selection, cover backgrounds, and atmospheric blur effects
  * **Announcements Section**: Real-time announcements from admin displayed on the homepage
  * **Top Series Carousel**: Highest-rated series showcased in visually rich cards with gradient overlays
  * **New Releases & Recent Updates**: Latest content sections for staying up to date
  * **Popular Section**: Most popular novels based on view count

* **🎨 UI / UX Enhancements**

  * **Dark / Light Theme Toggle**: Site-wide theme switching with persistence
  * **Floating Dock Navigation**: Mobile-optimized bottom navigation dock for quick access
  * **Follow Cursor Effect**: Custom interactive cursor on desktop for an immersive feel
  * **Scroll-to-Top Button**: Quick navigation back to the top of long pages
  * **Smooth Animations**: Fade-in animations and hover effects throughout the platform

* **Progressive Web App (PWA)**

  * **Installable**: Functions as a native app on Mobile and Desktop
  * **Offline Capable**: Improved performance and caching

---

### 🛡️ Admin Dashboard

* **Advanced Analytics**

  * Real-time stats for Novels, Chapters, Users, and Views
  * **Weekly Trends**: Interactive bar charts visualizing viewership data over the past 7 days
  * **Popular Novels**: Quick view of the most popular novels with cover images and ratings

* **📚 Novel Management**

  * Full CRUD for novels (Create, Read, Update, Delete)
  * Markdown-based content editor for novel descriptions
  * **Image Upload**: Upload novel cover images via UploadThing integration
  * **Chapter Management**: Add, edit, and delete chapters per novel with rich text (Markdown) editor
  * **Server-side Pagination**: Efficient browsing of large datasets

* **👥 User Management**

  * View all registered users with search and pagination
  * **Role Management**: Change user roles between Admin, Moderator, and User
  * **Delete Users**: Remove user accounts with confirmation dialog
  * Role badge display (admin/moderator/user) for quick identification

* **🏷️ Genre Management**

  * Full CRUD for genres (Create, Read, Update, Delete)
  * Auto-generated slugs from genre names
  * Search functionality within genre list

* **📢 Announcements Management**

  * Create, edit, and delete site-wide announcements
  * **Toggle Active/Inactive**: Control which announcements are visible on the homepage
  * Rich content support with title and description

* **🚩 Reports Management**

  * **Comment Reports**: Review reported comments, view reporter info, update status (pending/resolved/ignored), and delete reports
  * **Chapter Reports**: Review reported chapters with links to the problematic content, update status, and manage reports
  * Status badge system for quick visual identification

* **📋 Activity Log**

  * View recent comment activity across all novels and chapters
  * User info, timestamps, and direct links to the relevant content

* **Moderation & Management**

  * **Content Control**: Manage rankings and popular series list

---

## 🛠️ Tech Stack

This project is built using modern technologies for performance and scalability:

### Frontend

* **React** + **Vite** – Lightning-fast UI performance
* **TypeScript** – Type safety and robust development

### Styling & UI

* **Tailwind CSS** – Utility-first styling
* **shadcn/ui** – Accessible and beautiful UI components
* **Lucide** & **Tabler Icons** – Lightweight vector icons

### Backend & Infrastructure

* **Supabase** – PostgreSQL database, authentication, and realtime subscriptions
* **UploadThing** – Image upload service for avatars and novel covers

### Other Tools

* **TanStack Query** – Efficient server state management
* **React Router** – SPA navigation
* **Recharts** – Dashboard data visualization
* **React Markdown** – Markdown rendering for chapter content
* **date-fns** – Date formatting and manipulation
* **Vercel Analytics** – Website analytics and performance monitoring

---

## 🚀 Installation & Setup Guide

Follow these steps to run the project locally:

### Prerequisites

Make sure you have installed:

* **Node.js** (v18+ recommended)
* A package manager such as `npm`, `yarn`, or `bun`

---

### Steps

### 1. Clone the Repository

```bash
git clone https://github.com/adityaimamz/Calestial-scrolls.git
cd Calestial-scrolls
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Duplicate `.env.example`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Create a project in the Supabase dashboard to obtain your URL and API key.

---

### 4. Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

### 5. Build for Production

```bash
npm run build
```

The production build will be generated inside the `dist` folder.

---

## 📂 Main Folder Structure

```
src/
├── assets/         # Static assets (images, banners, novel covers)
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components (StatsCard, etc.)
│   ├── auth/       # Auth components (AuthProvider, AdminRoute, etc.)
│   ├── layout/     # Layout components (MainLayout, AdminLayout)
│   ├── settings/   # Settings page components (Profile, Security)
│   └── ui/         # Base UI components (shadcn/ui, BarLoader, FloatingDock, etc.)
├── hooks/          # Custom React Hooks (use-mobile, use-toast, useScrollHideNav)
├── integrations/   # Third-party service configuration (Supabase client & types)
├── lib/            # Utilities and helper functions (badgeSystem, etc.)
├── pages/          # Application pages
│   ├── admin/      # Admin pages (Dashboard, NovelList, UserList, Reports, etc.)
│   └── auth/       # Auth pages (Login, Register, ForgotPassword, etc.)
├── utils/          # Utility functions (UploadThing config)
└── index.css       # Global styles & design tokens
```

---

## 👨‍💻 Credits

Created and developed by **Aditya Imam Zuhdi**

* Instagram: @adityaimamz
* LinkedIn: Aditya Imam Zuhdi

---

