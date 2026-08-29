# Marginalia — Blog App

A small full-stack blog app built as a learning project.

- **Module 1 (Frontend):** `frontend/` — plain HTML, CSS, and JavaScript. Home, Login, Register, Dashboard, Write, and View Post pages.
- **Module 2 (Backend):** `backend/` — Node.js + Express REST API with JWT auth.
- **Module 3 (Database):** the backend stores everything in **MongoDB** via Mongoose. Includes a public "view individual blog" page with a live view counter.
- **Module 4 (CRUD Operations):** full Create, Read, Update, Delete is wired end-to-end, plus **search** and **category filtering** on both the home page and the dashboard.

## Project structure

```
marginalia/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js        # Mongoose schema for users
│   │   └── Blog.js        # Mongoose schema for blog posts
│   ├── routes/
│   │   ├── auth.js        # register, login, me
│   │   └── blogs.js       # create, list, view, update, delete posts
│   ├── middleware/
│   │   └── auth.js        # JWT verification
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── create-blog.html
    ├── view-blog.html     # NEW — individual blog detail page
    ├── css/style.css
    └── js/app.js
```

## 1. Set up MongoDB (free, cloud-hosted)

You don't need to install a database locally — MongoDB Atlas gives you a free cloud database.

1. Create a free account at https://www.mongodb.com/cloud/atlas/register
2. Create a free **M0** cluster (takes a couple of minutes to spin up)
3. Under **Database Access**, add a database user with a username and password
4. Under **Network Access**, click "Add IP Address" → "Allow access from anywhere" (fine for learning/testing)
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add `/marginalia` before the `?` so it points at a database named `marginalia`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/marginalia?retryWrites=true&w=majority
   ```

(If you already have MongoDB installed locally, you can skip Atlas and use `mongodb://127.0.0.1:27017/marginalia` instead — see `.env.example`.)

## 2. Start the backend

```
cd backend
npm install
copy .env.example .env      (Mac/Linux: cp .env.example .env)
```

Open `.env` and paste in your real `MONGO_URI` and a random `JWT_SECRET`. Then:

```
npm start
```

You should see:
```
Connected to MongoDB.
Marginalia backend running on http://localhost:5000
```

If you see a connection error instead, double-check your username/password and that your IP is allowed under Network Access in Atlas.

## 3. Open the frontend

No build step needed — open `frontend/index.html` directly in your browser, or serve the folder with a static server (e.g. the VS Code "Live Server" extension).

Flow to try:
1. **Register** an account → lands on the dashboard
2. **Write** a post → publish it
3. Go to the **Dashboard** → click the post title (or **View**) → opens `view-blog.html`, which shows the full post and increases its view count
4. Click **Edit** on a post in the dashboard → change the title/tag/body → **Save changes**
5. Use the **search box** in the dashboard toolbar to filter your own posts by title/body
6. Go back to **Home** — published posts appear there too, pulled live from MongoDB. Try the **search box** and **category dropdown** above the post grid.
7. Click **Delete** on a post in the dashboard to remove it for good

## API reference

| Method | Route                        | Auth required | Description                                          |
|--------|-------------------------------|:--------------:|--------------------------------------------------------|
| POST   | `/api/auth/register`          | No             | Create an account, returns a JWT                       |
| POST   | `/api/auth/login`             | No             | Log in, returns a JWT                                  |
| GET    | `/api/auth/me`                | Yes            | Get the logged-in user                                 |
| POST   | `/api/blogs`                   | Yes            | Create a post                                            |
| GET    | `/api/blogs?search=&tag=`      | Yes            | List your own posts, optionally filtered                |
| GET    | `/api/blogs/public?search=&tag=` | No           | List published posts, optionally filtered (home page)   |
| GET    | `/api/blogs/public/tags`       | No             | Distinct list of tags among published posts (category filter) |
| GET    | `/api/blogs/public/:id`        | No             | View a single published post (increments views)         |
| GET    | `/api/blogs/:id`               | Yes            | Get one of your own posts (draft or published)           |
| PUT    | `/api/blogs/:id`               | Yes            | Update one of your posts                                  |
| DELETE | `/api/blogs/:id`               | Yes            | Delete one of your posts                                  |

## Notes

- Passwords are hashed with bcrypt before storage; they are never stored in plain text.
- The frontend stores its JWT in `localStorage` under `marginalia_token`.
- `backend/.env` is git-ignored — never commit real database credentials.
