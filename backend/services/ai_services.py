import requests

# ==========================================
# GEMMA 3 COMMON FUNCTION
# ==========================================

def ask_gemma(prompt):

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma3:4b",
                "prompt": prompt,
                "stream": False
            }
        )

        result = response.json()

        return result["response"]

    except Exception as e:

        print("=" * 40)
        print("OLLAMA ERROR")
        print(e)
        print("=" * 40)

        return "AI service unavailable."


# ==========================================
# GRAMMAR CORRECTION
# ==========================================

def correct_transcript(text):

    prompt = f"""
Correct grammar, punctuation,
and spelling errors.

Return only corrected text.

Text:
{text}
"""

    return ask_gemma(prompt)


# ==========================================
# AI SUMMARY
# ==========================================

def summarize_transcript(text):

    prompt = f"""
Create a short professional summary.

Use bullet points.

Transcript:
{text}
"""

    return ask_gemma(prompt)


# ==========================================
# EMAIL GENERATOR
# ==========================================

def generate_email(text):

    prompt = f"""
Convert the following text into
a professional email.

Text:
{text}
"""

    return ask_gemma(prompt)


# ==========================================
# TRANSLATION
# ==========================================

def translate_text(text, language):

    prompt = f"""
Translate the following text into {language}.

Return only translated text.

Text:
{text}
"""

    return ask_gemma(prompt)