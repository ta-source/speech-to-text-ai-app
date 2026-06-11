from google import genai
import os

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_summary(transcript):
    prompt = f"""
    Summarize the following transcript in concise bullet points.

    Transcript:
    {transcript}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text