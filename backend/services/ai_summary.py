from groq import Groq
import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_summary(transcript):

    prompt = f"""
Summarize the following transcript in concise bullet points.

Transcript:
{transcript}
"""

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

        return "Summary generation failed."