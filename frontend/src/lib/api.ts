export async function uploadAudio(audioBlob: Blob) {
  const formData = new FormData();

  formData.append(
    "file",
    audioBlob,
    "speech.webm"
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/transcribe`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
}