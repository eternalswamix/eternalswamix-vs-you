const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");

const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

const apiKeyModal = document.getElementById("apiKeyModal");
const modalApiKeyInput = document.getElementById("modalApiKeyInput");
const modalSaveKeyBtn = document.getElementById("modalSaveKeyBtn");
const modalError = document.getElementById("modalError");

const clearChatBtn = document.getElementById("clearChatBtn");
const logoutBtn = document.getElementById("logoutBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const themeBtn = document.getElementById("themeBtn");
const userEmail = document.getElementById("userEmail");
const voiceInputBtn = document.getElementById("voiceInputBtn");
const ttsToggleBtn = document.getElementById("ttsToggleBtn");


let chatHistory = JSON.parse(sessionStorage.getItem("eternalswamix_chat_history")) || [];
let currentTheme = localStorage.getItem("eternalswamix_theme") || "green";
let ttsEnabled = localStorage.getItem("eternalswamix_tts") === "true";
let recognition = null;
let isListening = false;
let typingTimer = null;

document.body.classList.add(`theme-${currentTheme}`);
ttsToggleBtn.classList.toggle("active", ttsEnabled);

async function checkAuth() {
    try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
            window.location.href = "/";
            return;
        }

        const email = data.user.email || "Unknown user";
        userEmail.textContent = email;

        checkApiKey();
        renderSavedHistory();

    } catch (error) {
        window.location.href = "/";
    }
}

function checkApiKey() {
    const savedKey = sessionStorage.getItem("gemini_api_key");

    if (!savedKey) {
        apiKeyModal.classList.add("show");
        return;
    }

    apiKeyInput.value = savedKey;
    apiKeyModal.classList.remove("show");
}

function saveApiKey(key) {
    const cleanKey = key.trim();

    if (!cleanKey) {
        return false;
    }

    sessionStorage.setItem("gemini_api_key", cleanKey);
    apiKeyInput.value = cleanKey;
    return true;
}

function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
}

function closeSidebarPanel() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

function addMessage(role, content, shouldSave = true) {
    const messageBox = document.createElement("div");
    messageBox.className = `message ${role}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = content;

    messageBox.appendChild(paragraph);
    chatMessages.appendChild(messageBox);

    messageBox.scrollIntoView({ behavior: "smooth", block: "end" });

    if (shouldSave && (role === "user" || role === "assistant")) {
        chatHistory.push({ role, content });
        sessionStorage.setItem("eternalswamix_chat_history", JSON.stringify(chatHistory));
    }

    if (role === "assistant" && shouldSave) {
        speakText(content);
    }

    return messageBox;
}

function addAssistantMessageTyped(content) {
    const messageBox = document.createElement("div");
    messageBox.className = "message assistant typing";

    const paragraph = document.createElement("p");
    messageBox.appendChild(paragraph);
    chatMessages.appendChild(messageBox);
    messageBox.scrollIntoView({ behavior: "smooth", block: "end" });

    let index = 0;
    clearInterval(typingTimer);

    typingTimer = setInterval(() => {
        paragraph.textContent = content.slice(0, index + 1);
        index += 1;
        messageBox.scrollIntoView({ behavior: "smooth", block: "end" });

        if (index >= content.length) {
            clearInterval(typingTimer);
            typingTimer = null;
            messageBox.classList.remove("typing");
        }
    }, 14);

    chatHistory.push({ role: "assistant", content });
    sessionStorage.setItem("eternalswamix_chat_history", JSON.stringify(chatHistory));
    speakText(content);
    return messageBox;
}

function speakText(text) {
    if (!ttsEnabled || !("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
}

function setupVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceInputBtn.disabled = true;
        voiceInputBtn.title = "Voice input not supported in this browser.";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.addEventListener("start", () => {
        isListening = true;
        voiceInputBtn.classList.add("active");
    });

    recognition.addEventListener("end", () => {
        isListening = false;
        voiceInputBtn.classList.remove("active");
    });

    recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript.trim();
        messageInput.value = transcript;
        messageInput.focus();
    });
}

function renderSavedHistory() {
    if (!chatHistory.length) {
        return;
    }

    chatHistory.forEach((item) => {
        addMessage(item.role, item.content, false);
    });
}

function clearChat() {
    clearInterval(typingTimer);
    typingTimer = null;
    chatHistory = [];
    sessionStorage.removeItem("eternalswamix_chat_history");

    chatMessages.innerHTML = `
        <div class="message assistant">
            <p>Hello. How can I help you?</p>
        </div>
    `;
}

async function sendMessage(message) {
    const apiKey = sessionStorage.getItem("gemini_api_key");

    if (!apiKey) {
        apiKeyModal.classList.add("show");
        return;
    }

    addMessage("user", message);

    const loadingBox = addMessage("assistant loading", "Thinking...", false);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: apiKey,
                message: message,
                history: chatHistory
            })
        });

        const data = await response.json();

        loadingBox.remove();

        if (!response.ok) {
            addMessage("assistant", data.error || "Something went wrong.");
            return;
        }

        addAssistantMessageTyped(data.reply || "No reply received.");

    } catch (error) {
        loadingBox.remove();
        addMessage("assistant", "Network error. Please try again.");
    }
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    messageInput.value = "";
    await sendMessage(message);
});

saveApiKeyBtn.addEventListener("click", () => {
    const saved = saveApiKey(apiKeyInput.value);

    if (!saved) {
        alert("Enter Gemini API key first.");
        return;
    }

    closeSidebarPanel();
});

modalSaveKeyBtn.addEventListener("click", () => {
    modalError.textContent = "";

    const saved = saveApiKey(modalApiKeyInput.value);

    if (!saved) {
        modalError.textContent = "API key required.";
        return;
    }

    apiKeyModal.classList.remove("show");
    messageInput.focus();
});

sidebarToggle.addEventListener("click", openSidebar);
closeSidebar.addEventListener("click", closeSidebarPanel);
overlay.addEventListener("click", closeSidebarPanel);

clearChatBtn.addEventListener("click", () => {
    clearChat();
    closeSidebarPanel();
});

logoutBtn.addEventListener("click", async () => {
    sessionStorage.clear();

    await fetch("/api/auth/logout", {
        method: "POST"
    });

    window.location.href = "/";
});

fullscreenBtn.addEventListener("click", () => {
    closeSidebarPanel();

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

themeBtn.addEventListener("click", () => {
    document.body.classList.remove(`theme-${currentTheme}`);

    currentTheme = currentTheme === "green" ? "amber" : "green";

    document.body.classList.add(`theme-${currentTheme}`);
    localStorage.setItem("eternalswamix_theme", currentTheme);
});

voiceInputBtn.addEventListener("click", () => {
    if (!recognition) {
        return;
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    recognition.start();
});

ttsToggleBtn.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;
    localStorage.setItem("eternalswamix_tts", String(ttsEnabled));
    ttsToggleBtn.classList.toggle("active", ttsEnabled);

    if (!ttsEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebarPanel();
        apiKeyModal.classList.remove("show");
        return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        clearChat();
        closeSidebarPanel();
        messageInput.focus();
        return;
    }

    if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        openSidebar();
        return;
    }

    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

setupVoiceInput();
checkAuth();

