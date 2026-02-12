# Pooja Trehan Portfolio

A modern, database-driven portfolio website with a secure admin interface. Built for Pooja Trehan to showcase her experience, education, and skills with the ability to manage content through an intuitive admin panel.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **TailwindCSS 4** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Framer Motion** for animations
- **Shadcn/ui** for UI components

### Backend
- **Express.js** (Node.js)
- **Passport.js** for authentication
- **Express Session** for session management
- **Drizzle ORM** with Postgres
- **Vercel Postgres** (Neon) for database
- **Vercel Blob** for image storage
- **bcrypt** for password hashing

## Features

- ✅ **Public Portfolio** - Beautiful, responsive portfolio page
- ✅ **Admin Panel** - Secure `/admin` login with session management
- ✅ **Content Management** - Edit all content via UI (no code changes needed)
- ✅ **Image Uploads** - Profile picture upload to Vercel Blob
- ✅ **Preview/Publish Workflow** - Safe draft system before going live
- ✅ **Theme Customization** - Change colors through admin panel
- ✅ **Mobile Responsive** - Optimized for all devices with safe area support
- ✅ **Loading States** - Skeleton loaders and smooth transitions
- ✅ **Error Handling** - Toast notifications and graceful error recovery

## Project Structure

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Shadcn/ui components
│   │   │   └── admin/    # Admin editor components
│   │   ├── lib/          # Utilities and API client
│   │   ├── pages/        # Route pages
│   │   └── hooks/        # Custom React hooks
├── server/                # Backend Express app
│   ├── middleware/       # Auth middleware
│   ├── services/         # Business logic
│   │   ├── blob.ts      # Vercel Blob operations
│   │   └── portfolio.ts # Portfolio CRUD
│   ├── index.ts         # Express app setup
│   ├── routes.ts        # API route handlers
│   └── storage.ts       # Database client
├── shared/               # Shared types and schema
│   └── schema.ts        # Drizzle schema definitions
├── script/              # Utility scripts
│   ├── seed-admin.ts   # Create admin user
│   └── migrate-data.ts # Migrate initial data
└── vercel.json          # Vercel deployment config
```

## Setup Instructions

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (or Vercel Postgres)
- Vercel Blob storage (optional for image uploads)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
SESSION_SECRET=generate_random_32_char_string
NODE_ENV=development
```

Generate session secret:
```bash
openssl rand -base64 32
```

### 3. Database Setup

Push schema to database:
```bash
npm run db:push
```

Create admin user:
```bash
npm run seed:admin
```

Migrate initial content:
```bash
npm run migrate:data
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the project

### Step 2: Add Vercel Postgres

1. In Vercel project → Storage tab
2. Click "Create Database" → Choose "Postgres"
3. Name it and create
4. Connection string is automatically added to environment variables

### Step 3: Add Vercel Blob

1. In Storage tab → Click "Create Database" → Choose "Blob"
2. Name it and create
3. `BLOB_READ_WRITE_TOKEN` is automatically added

### Step 4: Add Environment Variables

In Project Settings → Environment Variables, add:

```
SESSION_SECRET=<your-random-string>
NODE_ENV=production
```

### Step 5: Deploy

1. Commit and push to main branch
2. Vercel auto-deploys
3. Once deployed, run migrations:

```bash
vercel env pull .env.production
npm run db:push
npm run seed:admin
npm run migrate:data
```

### Step 6: Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel project → Domains
3. Add your domain and follow DNS instructions

## Admin Access

- **URL:** `https://poojatrehan.vercel.app/admin`
- **Username:** Set during `seed-admin` script
- **Password:** Set during `seed-admin` script

## API Routes

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user

### Portfolio
- `GET /api/portfolio/published` - Get published content (public)
- `GET /api/portfolio/draft` - Get draft content (admin only)
- `POST /api/portfolio/save-draft` - Save changes to draft
- `POST /api/portfolio/publish` - Publish draft to live

### Images
- `POST /api/upload/image` - Upload image (admin only)

### Experience
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience
- `POST /api/experiences/reorder` - Reorder experiences

### Education
- `POST /api/education` - Create education
- `PUT /api/education/:id` - Update education
- `DELETE /api/education/:id` - Delete education
- `POST /api/education/reorder` - Reorder education

### Skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `POST /api/skills/reorder` - Reorder skills

## Database Schema

### admins
- Admin user credentials (bcrypt hashed passwords)

### portfolio_content
- Main portfolio content (profile, hero, theme)
- Supports draft/published versions

### experiences
- Work experience entries with bullets
- Ordered by `order` field

### education
- Education history
- Ordered by `order` field

### skills
- Individual skills
- Ordered by `order` field

See `shared/schema.ts` for full schema definitions.

## Cost Breakdown

- **Hosting:** Free (Vercel Hobby plan)
- **Database:** Free (Vercel Postgres 512MB)
- **Image Storage:** Free (Vercel Blob 1000 writes/month)
- **Domain:** ~$12-15/year (optional)

**Total: $0/month** (or ~$1/month with custom domain)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run seed:admin` - Create admin user
- `npm run migrate:data` - Migrate initial data

## Security

- Passwords hashed with bcrypt (10 rounds)
- Session-based authentication
- HTTP-only cookies
- CSRF protection via same-site cookies
- SQL injection prevention via Drizzle ORM
- XSS protection via React's built-in escaping

## Troubleshooting

### Database connection fails
- Check DATABASE_URL is correct
- Ensure database is running and accessible
- Verify network access (Vercel Postgres requires allowlist)

### Admin can't log in
- Run `seed-admin` to create/reset admin user
- Check session configuration
- Clear browser cookies

### Images not uploading
- Verify BLOB_READ_WRITE_TOKEN is set
- Check file size (max 5MB)
- Ensure Vercel Blob is created

### Changes not appearing
- Check if user clicked "Publish" after editing
- Verify draft vs published content
- Clear browser cache

## Support

For issues or questions, contact:
- **Developer:** Ani Potts
- **User Guide:** See `ADMIN_GUIDE.md`

## License

Private portfolio - All rights reserved.

---

Built with ❤️ by Ani Potts for Pooja Trehan
