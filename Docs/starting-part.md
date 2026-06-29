Frontend → Supabase Google Login
Frontend → gets user session/token
Frontend → sends chat message + Gemini key to Flask
Flask → calls Gemini
Supabase → stores user profile/chat later


syntra-clone/
│
├── app.py
├── requirements.txt
├── vercel.json
├── .env
├── .gitignore
│
├── app/
│   ├── __init__.py
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── pages.py
│   │   ├── chat.py
│   │   └── auth.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py
│   │   └── supabase_service.py
│   │
│   └── config.py
│
├── templates/
│   ├── landing.html
│   └── chat.html
│
├── static/
│   ├── css/
│   │   ├── landing.css
│   │   └── chat.css
│   │
│   ├── js/
│   │   ├── landing.js
│   │   └── chat.js
│   │
│   └── assets/
│       └── logo.png
│
└── docs/
    └── project-notes.md



app.py
Main entry point for Vercel.

app/__init__.py
Creates Flask app.

routes/pages.py
Landing page and chat page routes.

routes/chat.py
/chat API route for Gemini replies.

routes/auth.py
Optional auth-related backend checks.

services/gemini_service.py
All Gemini API calling logic.

services/supabase_service.py
Supabase client setup and database functions.

config.py
Loads environment variables.











mkdir syntra-clone
cd syntra-clone

mkdir app
mkdir app\routes
mkdir app\services
mkdir templates
mkdir static
mkdir static\css
mkdir static\js
mkdir static\assets
mkdir docs

type nul > app.py
type nul > requirements.txt
type nul > vercel.json
type nul > .env
type nul > .gitignore

type nul > app\__init__.py
type nul > app\config.py
type nul > app\routes\__init__.py
type nul > app\routes\pages.py
type nul > app\routes\chat.py
type nul > app\routes\auth.py
type nul > app\services\__init__.py
type nul > app\services\gemini_service.py
type nul > app\services\supabase_service.py

type nul > templates\landing.html
type nul > templates\chat.html
type nul > static\css\landing.css
type nul > static\css\chat.css
type nul > static\js\landing.js
type nul > static\js\chat.js
type nul > docs\project-notes.md