from groq import Groq
import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_ai(prompt):

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        print("=" * 40)
        print("GROQ ERROR")
        print(str(e))
        print("=" * 40)

        return "AI service unavailable."


def correct_transcript(text):

    prompt = f"""
Correct grammar, punctuation and spelling errors.

Return only corrected text.

Text:
{text}
"""

    return ask_ai(prompt)


def summarize_transcript(text):

    prompt = f"""
Create a short professional summary.

Use bullet points.

Transcript:
{text}
"""

    return ask_ai(prompt)


def generate_email(text):

    prompt = f"""
Convert the following text into a professional email.

Text:
{text}
"""

    return ask_ai(prompt)


def translate_text(text, language):

    prompt = f"""
Translate the following text into {language}.

Return only translated text.

Text:
{text}
"""

    return ask_ai(prompt)