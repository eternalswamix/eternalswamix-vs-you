# EternalSwamiX vs You

A futuristic AI clone chat web app built with Flask, Google OAuth, Gemini API, and Supabase. The app lets users sign in with Google, add their own Gemini API key in the browser session, and chat with an AI clone through a cinematic black-theme interface.

## Features

- Google OAuth login
- Gemini-powered AI chat
- User-provided Gemini API key
- Browser-session key storage
- Supabase-backed user profile persistence
- Futuristic black-theme landing page
- Minimal glass-style chat UI
- Voice input using browser speech recognition
- Text-to-speech for AI responses
- AI typing animation
- Keyboard shortcuts
- Theme toggle
- Fullscreen mode
- Clear chat
- Logout
- Favicon, web manifest, robots.txt, and sitemap.xml
- Vercel-ready Python deployment

## Tech Stack

- Python
- Flask
- Google Identity Services
- Google Auth
- Gemini API
- Supabase
- HTML
- CSS
- JavaScript
- Vercel

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + K` | New chat / clear chat |
| `Esc` | Close sidebar or modal |
| `Ctrl + /` | Open controls |
| `Ctrl + Enter` | Send message |

## Project Structure

```text
.
├── app.py
├── eternalswamix_app/
│   ├── __init__.py
│   ├── config.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   └── pages.py
│   └── services/
│       ├── gemini_service.py
│       ├── google_auth_service.py
│       └── supabase_service.py
├── static/
│   ├── assets/
│   │   └── favicon.svg
│   ├── css/
│   │   ├── chat.css
│   │   └── landing.css
│   ├── js/
│   │   ├── chat.js
│   │   └── landing.js
│   └── site.webmanifest
├── templates/
│   ├── chat.html
│   └── landing.html
├── requirements.txt
└── vercel.json
```

## Environment Variables

Create a `.env` file from `.env.example`.

```text
SECRET_KEY=change-this-secret-key
GOOGLE_CLIENT_ID=your_google_web_oauth_client_id.apps.googleusercontent.com
GOOGLE_AUTHORIZED_ORIGINS=http://localhost:5000,https://your-vercel-domain.vercel.app
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PROJECT_NAME=eternalswamix-vs-you
GEMINI_MODEL=gemini-2.5-flash
```

## Google OAuth Setup

1. Open Google Cloud Console.
2. Create an OAuth client.
3. Select **Web application** as the application type.
4. Add local and production URLs to **Authorized JavaScript origins**:

```text
http://localhost:5000
https://your-vercel-domain.vercel.app
```

5. Copy the client ID into `GOOGLE_CLIENT_ID`.

If Google shows `Error 401: invalid_client` with `no registered origin`, the current browser origin is missing from the OAuth client settings.

## Local Development

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the app:

```bash
python app.py
```

Open:

```text
http://localhost:5000
```

## Vercel Deployment

This project is configured for Vercel through `vercel.json`.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/app.py"
    }
  ]
}
```

Important deployment notes:

- Add all environment variables in Vercel Project Settings.
- Add your Vercel domain to Google OAuth Authorized JavaScript origins.
- The Python package is named `eternalswamix_app` to avoid conflict with root `app.py`.

## SEO And App Metadata

Included:

- `/favicon.ico`
- `/favicon.svg`
- `/robots.txt`
- `/sitemap.xml`
- `static/site.webmanifest`
- Meta description
- Open Graph metadata
- Twitter summary metadata
- `noindex` on authenticated chat page

## Resume Description

**EternalSwamiX vs You** is a full-stack AI clone chat application built with Flask, Google OAuth, Gemini API, and Supabase. It features secure Google login, user-provided Gemini API keys, voice input, text-to-speech, typing animations, keyboard shortcuts, responsive black-theme UI, and Vercel deployment support.

## Future Improvements

- Markdown response rendering
- Copy response button
- Regenerate response
- Edit previous message
- Export chat as `.txt` or `.md`
- Persona modes
- Private mode toggle
- Search inside chat
