import os
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)

try:

    response = model.generate_content(
        "Translate Hello to Hindi"
    )

    print(response.text)

except Exception as e:

    print(e)