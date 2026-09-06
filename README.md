# 📝 Marginalia — A Full-Stack Blog Application

Marginalia is a full-stack blogging platform built as a step-by-step learning project — from a static frontend to a database-backed, authenticated, deployable web app.

> "A quiet place to draft, not perform."

---

## ✨ Features

- **Authentication** — register, log in, and stay signed in with JWT
- **Protected routes** — Dashboard, Write, and Profile pages require login, both on the frontend (redirects) and backend (JWT-checked API routes)
- **Full CRUD** — create, read, update, and delete blog posts
- **Drafts & publishing** — save a post as a draft or publish it immediately
- **Search & filters** — search posts by keyword, filter by category (tag), or by status (draft/published) in your dashboard
- **Individual post pages** — every post has its own shareable page, with a live view counter
- **User profile** — see your post stats, update your name, or change your password
- **Responsive design** — works on desktop, tablet, and mobile
- **Real database** — MongoDB via Mongoose, not flat files

## 🧱 Tech stack

| Layer      | Technology                          |
|------------|---------------------------------------|
| Frontend   | HTML, CSS, vanilla JavaScript          |
| Backend    | Node.js, Express                       |
| Database   | MongoDB (Mongoose)                     |
| Auth       | JWT (jsonwebtoken) + bcrypt password hashing |
| Deployment | Backend → Render · Frontend → Netlify or Vercel |

## 📁 Project structure

```
marginalia/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── auth.js            # register, login, profile (get/update)
│   │   └── blogs.js           # create, list, search, view, update, delete
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html             # Home — published posts, search, category filter
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html         # your posts — search, filter, edit, delete
│   ├── create-blog.html       # write & edit posts, live preview
│   ├── view-blog.html         # individual post page
│   ├── profile.html           # account details, stats, name/password update
│   ├── css/style.css
│   └── js/
│       ├── config.js          # API base URL — edit this after deploying
│       └── app.js
├── render.yaml                 # Render deployment config (backend)
├── netlify.toml                 # Netlify deployment config (frontend)
└── vercel.json                  # Vercel deployment config (frontend, alternative)
```

## 🚀 Getting started locally

### 1. Set up MongoDB (free, cloud-hosted)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free **M0** cluster
3. Under **Database Access**, add a database user + password
4. Under **Network Access**, allow access from anywhere (fine for learning)
5. Click **Connect → Drivers**, copy the connection string, and add `/marginalia` before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/marginalia?retryWrites=true&w=majority
   ```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env    # Windows: copy .env.example .env
```

Open `.env` and fill in your real `MONGO_URI` and a random `JWT_SECRET`. Then:

```bash
npm start
```

You should see:
```
Connected to MongoDB.
Marginalia backend running on http://localhost:5000
```

### 3. Open the frontend

No build step — just open `frontend/index.html` in your browser, or serve the folder with a static server (e.g. VS Code's "Live Server" extension).

Try the full flow: **Register → Write a post → Dashboard → Edit/Delete → Profile → Log out.**

## 🌍 Deploying to production

### Backend → Render

1. Push this repo to GitHub (if you haven't already)
2. Go to [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo
3. Render will detect `render.yaml` automatically. If not, set manually:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`, and (once your frontend is live) `FRONTEND_URL`
5. Deploy — Render gives you a URL like `https://marginalia-backend.onrender.com`

### Frontend → Netlify or Vercel

**Netlify:**
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from GitHub**
2. It will detect `netlify.toml` automatically (publishes the `frontend` folder)
3. Deploy — you'll get a URL like `https://your-site.netlify.app`

**Vercel (alternative):**
1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your repo
2. It will detect `vercel.json` automatically
3. Deploy — you'll get a URL like `https://your-site.vercel.app`

### Connect the two

After both are deployed:

1. Open `frontend/js/config.js` and replace the URL with your live backend:
   ```js
   window.MARGINALIA_API_BASE = 'https://marginalia-backend.onrender.com/api';
   ```
2. Commit and push — Netlify/Vercel will auto-redeploy
3. In your Render backend's environment variables, set `FRONTEND_URL` to your live frontend URL (this locks the API down to your site only)

## 📡 API reference

| Method | Route                    | Auth | Description                                    |
|--------|---------------------------|:----:|--------------------------------------------------|
| POST   | `/api/auth/register`      | No   | Create an account, returns a JWT                 |
| POST   | `/api/auth/login`         | No   | Log in, returns a JWT                             |
| GET    | `/api/auth/me`            | Yes  | Get your profile + post stats                     |
| PUT    | `/api/auth/me`            | Yes  | Update your name and/or password                  |
| POST   | `/api/blogs`               | Yes  | Create a post                                       |
| GET    | `/api/blogs`               | Yes  | List your own posts (supports `?search=` `?status=` `?tag=`) |
| GET    | `/api/blogs/public`        | No   | List published posts (supports `?search=` `?tag=`) |
| GET    | `/api/blogs/public/tags`   | No   | List distinct categories/tags in use               |
| GET    | `/api/blogs/public/:id`    | No   | View a single published post (increments views)   |
| GET    | `/api/blogs/:id`           | Yes  | Get one of your own posts (draft or published)     |
| PUT    | `/api/blogs/:id`           | Yes  | Update one of your posts                           |
| DELETE | `/api/blogs/:id`           | Yes  | Delete one of your posts                           |

## 🔒 Security notes

- Passwords are hashed with bcrypt — never stored in plain text
- JWTs are stored in `localStorage` and sent as a `Bearer` token on every protected request
- Every protected API route re-verifies the JWT server-side (`requireAuth` middleware) — frontend redirects are a UX nicety, not the real security boundary
- `.env` is git-ignored — never commit real database credentials or secrets

## 🙌 About this project

Built as a self-guided, module-by-module learning project covering the full lifecycle of a web app: frontend, backend, database, auth, CRUD, and deployment.
 
