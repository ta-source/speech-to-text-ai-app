from faster_whisper import WhisperModel

print("Loading Whisper Model...")

model = WhisperModel(
    "tiny.en",
    device="cpu",
    compute_type="int8"
)

print("Whisper Loaded")


def transcribe_audio(audio_path):

    print(f"Processing file: {audio_path}")

    segments, info = model.transcribe(
        audio_path
    )

    text = ""

    for segment in segments:
        text += segment.text + " "

    print("TRANSCRIPTION COMPLETE")

    return text.strip()