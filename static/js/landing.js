const errorText = document.getElementById("errorText");
const googleLoginBox = document.getElementById("googleLoginBox");

async function handleGoogleCredential(response) {
    errorText.textContent = "";

    try {
        const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                credential: response.credential
            })
        });

        const data = await res.json();

        if (!res.ok) {
            errorText.textContent = data.details || data.error || "Login failed.";
            return;
        }

        window.location.href = "/chat";

    } catch (error) {
        errorText.textContent = "Network error during login.";
    }
}

window.onload = function () {
    if (!window.GOOGLE_CLIENT_ID) {
        errorText.textContent = "GOOGLE_CLIENT_ID missing in .env file.";
        return;
    }

    const authorizedOrigins = window.GOOGLE_AUTHORIZED_ORIGINS || [];
    const currentOrigin = window.location.origin.replace(/\/$/, "");

    if (authorizedOrigins.length && !authorizedOrigins.includes(currentOrigin)) {
        errorText.textContent = `Google login is not configured for ${currentOrigin}. Add it to GOOGLE_AUTHORIZED_ORIGINS and to your Google OAuth client's Authorized JavaScript origins.`;
        return;
    }

    google.accounts.id.initialize({
        client_id: window.GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
    });

    google.accounts.id.renderButton(
        googleLoginBox,
        {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 260
        }
    );
};
