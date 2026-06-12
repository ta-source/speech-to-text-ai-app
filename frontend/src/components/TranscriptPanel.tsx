interface TranscriptPanelProps {
  transcript: string;
}

export default function TranscriptPanel({
  transcript,
}: TranscriptPanelProps) {
  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow">
      <h2 className="font-bold mb-2">Transcript</h2>

      <p>{transcript || "Your transcript will appear here"}</p>
    </div>
  );
}