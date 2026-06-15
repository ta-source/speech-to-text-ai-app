"use client";

import {
  useRef,
  useState,
  useEffect
} from "react";



export default function RecorderPanel() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] =
  useState("");

const [language, setLanguage] =
  useState("Bengali");

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);
  const [email, setEmail] =
    useState("");
  const [emailLoading, setEmailLoading] =
  useState(false);
  const [showEmailModal,
      setShowEmailModal] =
      useState(false);

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);
  const recognitionRef =
  useRef<any>(null);
  const [summaryLoading, setSummaryLoading] =
  useState(false);

const [translationLoading, setTranslationLoading] =
  useState(false);


  const formatTime = (
    totalSeconds: number
  ) => {

    const mins = Math.floor(
      totalSeconds / 60
    );

    const secs =
      totalSeconds % 60;

    return `${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const wordCount =
    transcript.trim() === ""
      ? 0
      : transcript
          .trim()
          .split(/\s+/).length;

  const characterCount =
    transcript.length;

  const startRecording =
    async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        const mediaRecorder =
          new MediaRecorder(
            stream
          );

        mediaRecorderRef.current =
          mediaRecorder;

        audioChunksRef.current = [];

        setTranscript("");
        setSeconds(0);
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
             (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
         alert("Speech Recognition is not supported on this device.");
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.lang = "en-US";

        recognition.onresult =
            (event: any) => {

                let text = "";

                for (
                     let i = 0;
                     i < event.results.length;
                     i++
                ) {
                    text +=
                        event.results[i][0]
                         .transcript + " ";
                }

                setTranscript(text);
            };

        recognition.start();

        recognitionRef.current =
            recognition;

        timerRef.current =
          setInterval(() => {

            setSeconds(
              (prev) =>
                prev + 1
            );

          }, 1000);

mediaRecorder.ondataavailable =
  (event) => {

    audioChunksRef.current.push(
      event.data
    );

  };

        mediaRecorder.onstop =
          async () => {

            setLoading(true);

            const audioBlob =
              new Blob(
                audioChunksRef.current,
                {
                  type:
                    "audio/webm",
                }
              );

            const formData =
              new FormData();

            formData.append(
              "file",
              audioBlob,
              "speech.webm"
            );

            try {

              const response =
                await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/transcribe`,

                  {
                    method:
                      "POST",
                    body:
                      formData,
                  }
                );

              const data =
                await response.json();

              if (data.transcript) {
                setTranscript(data.transcript);
              }

            } catch (
              error
            ) {

              console.error(
                error
              );

              setTranscript(
                "Failed to connect to backend."
              );

            } finally {

              setLoading(
                false
              );

            }
          };

        mediaRecorder.start(
          1000
        );

        setRecording(true);

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Unable to access microphone."
        );
      }
    };

  const stopRecording =
    () => {
      if (
        recognitionRef.current
      ) {
        recognitionRef.current.stop();
      }

      if (
        mediaRecorderRef.current
      ) {

        mediaRecorderRef.current.stop();

        if (
          timerRef.current
        ) {

          clearInterval(
            timerRef.current
          );
        }

        setRecording(
          false
        );
      }
    };

  const copyTranscript =
    async () => {

      try {

        await navigator.clipboard.writeText(
          transcript
        );

        alert(
          "Transcript copied!"
        );

      } catch (
        error
      ) {

        console.error(
          error
        );
      }
    };
  const generateSummary =
  async () => {

    try {
        setSummaryLoading(true);
      const response =
        await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/summary`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              transcript
            }),
          }
        );

      const data =
        await response.json();

      setSummary(
        data.summary
      );

    } catch (error) {

        console.error(error);

    }   finally {
            setSummaryLoading(false);
    }


};
  const translateTranscript =
    async () => {

        try {
            setTranslationLoading(true);

            const response =
                await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/translate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                        },
                        body: JSON.stringify({
                            transcript,
                            language
                        }),
                }
            );

        const data =
            await response.json();

        setTranslation(
            data.translation
        );

    } catch (error) {

            console.error(error);

        }    finally{


                 setTranslationLoading(false);

        }
};


  const clearTranscript =
    () => {

      setTranscript("");
    };

  const downloadTranscript =
    () => {

      const blob =
        new Blob(
          [transcript],
          {
            type:
              "text/plain",
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "transcript.txt";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );
    };
  const generateEmail =
    async () => {

  try {
    setEmailLoading(true);
    const response =
      await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/email`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            transcript
          }),
        }
      );

    const data =
      await response.json();

    setEmail(
      data.email
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to generate email."
    );
  } finally {
      setEmailLoading(false);
  }
};
  const copyEmail = async () => {

  try {

    await navigator.clipboard.writeText(
      email
    );

    alert(
      "Email copied!"
    );

  } catch (error) {

    console.error(error);

  }
};
  const clearEmail = () => {

  setEmail("");
  setShowEmailModal(false);

};
  const copyTranslation = async () => {

  await navigator.clipboard.writeText(
    translation
  );

  alert("Translation copied!");
};

const clearTranslation = () => {

  setTranslation("");

};
const copySummary = async () => {

  await navigator.clipboard.writeText(
    summary
  );

  alert("Summary copied!");
};

const clearSummary = () => {

  setSummary("");

};
const clearAll = () => {

  setTranscript("");
  setSummary("");
  setTranslation("");
  setEmail("");

};
  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-end mb-6">

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-lg font-semibold"
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={
              startRecording
            }
            disabled={
              recording
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Start Recording
          </button>

          <button
            onClick={
              stopRecording
            }
            disabled={
              !recording
            }
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Stop Recording
          </button>
            <button
                onClick={generateEmail}
                disabled={emailLoading}
                className="
                    bg-orange-600
                    hover:bg-orange-700
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    disabled:bg-gray-400
                "
            >
                {emailLoading
                    ? "⏳ Generating..."
                    : "📧 Generate Email"}
            </button>

        </div>
          <div className="flex gap-3 mt-4">






        </div>
          <div className="flex gap-3 mt-4">

              <button
                onClick={clearAll}
                className="bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                🧹 Clear All
              </button>

          </div>

        {recording && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">

            <h3 className="text-red-600 font-bold text-2xl">
              🔴 Recording Live
            </h3>

            <p className="mt-3 text-black">
              Duration:{" "}
              {formatTime(
                seconds
              )}
            </p>

            <div className="mt-3">

              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                LIVE TRANSCRIPTION
              </span>

            </div>

          </div>
        )}

        {loading && (
          <div className="mt-6 text-blue-600 font-semibold text-xl">
            ⏳ Final Transcription...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
            <h3 className="text-blue-600 font-bold">
              Words
            </h3>

            <p className="text-5xl font-bold text-black">
              {wordCount}
            </p>
          </div>
            {email && (
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5">

                    <h2 className="text-2xl font-bold text-orange-700 mb-3">
                        📧 AI Email
                    </h2>

                    <div className="max-h-64 overflow-y-auto bg-white p-4 rounded-lg border">

                        <pre className="whitespace-pre-wrap text-gray-800">
                            {email}
                        </pre>
                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={copyEmail}
                                className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "
                        >
                                📋 Copy
                         </button>

                        <button
                            onClick={clearEmail}
                            className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                        "
                    >
                        🗑 Clear
                    </button>

                </div>

                </div>

        </div>
    )}
            {emailLoading && (

  <div className="mt-4">

    <div className="flex items-center gap-3 text-orange-600 font-semibold">

      <div
        className="
          w-5
          h-5
          border-4
          border-orange-500
          border-t-transparent
          rounded-full
          animate-spin
        "
      />

        ⏳ Generating...

    </div>

  </div>

)}

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-md">
            <h3 className="text-green-600 font-bold">
              Characters
            </h3>

            <p className="text-5xl font-bold text-black">
              {
                characterCount
              }
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-md">
            <h3 className="text-purple-600 font-bold">
              Duration
            </h3>

            <p className="text-5xl font-bold text-black">
              {formatTime(
                seconds
              )}
            </p>
          </div>

        </div>

        <div
          className={`mt-8 rounded-xl border p-6 shadow-md ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">
            Transcript
          </h2>

          <p
            className={`text-lg whitespace-pre-wrap ${
              darkMode
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            {transcript || ""}

            {recording && (
                <span className="animate-pulse">
                    |
                </span>
            )}
          </p>
  <div className="mt-6">

  <select
    value={language}
    onChange={(e) =>
      setLanguage(
        e.target.value
      )
    }
    className="border p-2 rounded-lg"
  >

    <option>
      Bengali
    </option>

    <option>
      Hindi
    </option>

  </select>

</div>
          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={
                copyTranscript
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              📋 Copy
            </button>

            <button
              onClick={
                clearTranscript
              }
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              🗑 Clear
            </button>

            <button
              onClick={
                downloadTranscript
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              ⬇ Download TXT
            </button>
              <button
                onClick={generateSummary}
                disabled={summaryLoading}
                className="
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                px-4
                py-2
                rounded-lg
                disabled:bg-gray-400
                "
            >
                {summaryLoading
                    ? "⏳ Generating..."
                     : "🤖 Generate Summary"}
                </button>
              <button
                onClick={translateTranscript}
                disabled={translationLoading}
                className="
                bg-green-600
                hover:bg-green-700
                 text-white
                px-4
                py-2
                rounded-lg
                disabled:bg-gray-400
                "
                >
                    {translationLoading
                         ? "⏳ Translating..."
                        : "🌐 Translate"}
              </button>
          </div>
            {summary && (
  <div className="summary-box">

    <h3>🤖 AI Summary</h3>

    <p>{summary}</p>

    <div className="flex gap-3 mt-4">
        <button
        onClick={copySummary}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        🗑 copy Summary
      </button>

      <button
        onClick={clearSummary}
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        🗑 Clear Summary
      </button>

    </div>

  </div>
)}
            {translation && (
  <div>

    <h3>🌐 Translation</h3>

    <p>{translation}</p>

    <div className="flex gap-3 mt-4">

      <button onClick={copyTranslation}>
        📋 Copy Translation
      </button>

      <button onClick={clearTranslation}>
        🗑 Clear Translation
      </button>

    </div>

  </div>
)}
        </div>
          {summaryLoading && (

            <div className="mt-4 text-indigo-600 font-semibold">

                ⏳ AI is generating summary...

            </div>

        )}
          {translationLoading && (

            <div className="mt-4 text-green-600 font-semibold">

                ⏳ AI is translating...

            </div>

        )}

      </div>

    
    </div>
  );
}