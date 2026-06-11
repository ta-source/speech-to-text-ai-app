from faster_whisper import WhisperModel

print("Loading Whisper Model...")

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("Whisper Model Loaded Successfully!")


def transcribe_audio(audio_path):
    try:
        print(f"Processing: {audio_path}")

        segments, info = model.transcribe(
            audio_path,
            language="en",   # Change to "bn" if only Bengali
            beam_size=5
        )

        print(
            f"Detected language: {info.language} "
            f"with probability {info.language_probability}"
        )

        text = ""

        for segment in segments:
            print(
                f"[{segment.start:.2f}s -> {segment.end:.2f}s] "
                f"{segment.text}"
            )

            text += segment.text + " "

        final_text = text.strip()

        print("FINAL TRANSCRIPT:")
        print(final_text)

        return final_text

    except Exception as e:

        print("========== ERROR ==========")
        print(str(e))
        print("===========================")

        return f"ERROR: {str(e)}"