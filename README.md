## Setup

Create a `.env` file from `.env.example`.

For Google login, use a **Web application** OAuth client ID from Google Cloud
Console. Add every URL you use to open the app to that client's **Authorized
JavaScript origins**, for example:

```text
http://localhost:5000
https://your-vercel-app.vercel.app
```

Keep the same comma-separated list in `.env`:

```text
GOOGLE_AUTHORIZED_ORIGINS=http://localhost:5000,https://your-vercel-app.vercel.app
```

If Google shows `Error 401: invalid_client` with `no registered origin`, the
current browser origin is missing from the OAuth client configuration, or the
client ID is not a Web application client.
