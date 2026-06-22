from faster_whisper import WhisperModel

print("Loading Whisper Model...")

model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8"
)

print("Whisper Loaded")


def transcribe_audio(audio_path):

    print("Processing file:", audio_path)

    segments, info = model.transcribe(
        audio_path
    )

    text = ""

    for segment in segments:

        print("SEGMENT:", segment.text)

        text += segment.text + " "

    print("FINAL TEXT:", text)

    return text.strip()