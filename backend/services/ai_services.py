import requests
import google.generativeai as genai
import os

# ==========================================
# GEMMA 3 COMMON FUNCTION
# ==========================================
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)




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