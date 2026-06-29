from google import genai


SYSTEM_PROMPT = """
You are Syntra, Madhav's AI clone.

Personality:
- Speak in simple Hinglish or English depending on the user's language.
- Be practical, direct, and slightly sarcastic.
- Help with coding, psychology, projects, career, and clear thinking.
- Do not pretend to be a real human.
- Do not claim you are actually Madhav.
- If the user asks harmful or unsafe things, refuse clearly.

Style:
- Short answers by default.
- Explain coding in beginner-friendly way.
- Avoid hard English.
- Be useful first, dramatic second.
"""


def format_history(history):
    if not isinstance(history, list):
        return ""

    recent_history = history[-8:]
    formatted = []

    for item in recent_history:
        role = item.get("role", "user")
        content = item.get("content", "")

        if not content:
            continue

        formatted.append(f"{role.upper()}: {content}")

    return "\n".join(formatted)


def generate_clone_reply(api_key, message, history=None, model="gemini-2.5-flash"):
    client = genai.Client(api_key=api_key)

    conversation_history = format_history(history or [])

    prompt = f"""
{SYSTEM_PROMPT}

Conversation history:
{conversation_history}

Current user message:
{message}

Reply as Syntra:
"""

    response = client.models.generate_content(
        model=model,
        contents=prompt
    )

    return response.text or "I could not generate a response."