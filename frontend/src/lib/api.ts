export async function uploadAudio(audioBlob: Blob) {

  const formData = new FormData();

  formData.append(
    "file",
    audioBlob,
    "speech.webm"
  );

  const response = await fetch(
    "http://127.0.0.1:5000/transcribe",
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
}