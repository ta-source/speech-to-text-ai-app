"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Transcript {
  id: number;
  text: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Transcript[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "process.env.NEXT_PUBLIC_API_URL/history"
      );

      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTranscript = async (
    id: number
  ) => {
    try {
      await fetch(
        `process.env.NEXT_PUBLIC_API_URL/transcript/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = () => {
    window.open(
      "process.env.NEXT_PUBLIC_API_URL/export-pdf",
      "_blank"
    );
  };

  const filteredHistory = history.filter(
    (item) =>
      item.text
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

          <h1 className="text-3xl md:text-5xl font-bold">
            📜 Transcript History
          </h1>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={downloadPDF}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              📄 Export PDF
            </button>

            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              🏠 Home
            </Link>

          </div>

        </div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 Search transcript..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border-2 border-gray-300 rounded-xl p-4 mb-8 text-lg bg-white shadow-sm"
        />

        {/* Transcript Cards */}
        {filteredHistory.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No transcripts found.
          </div>
        ) : (
          <div className="grid gap-5">

            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl shadow-md p-5"
              >

                <p className="text-lg text-gray-800 mb-3 whitespace-pre-wrap">
                  {item.text}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  {item.created_at}
                </p>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() => {
                      const confirmed =
                        window.confirm(
                          "Delete this transcript?"
                        );

                      if (confirmed) {
                        deleteTranscript(
                          item.id
                        );
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    🗑 Delete
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        item.text
                      );

                      alert(
                        "Transcript copied!"
                      );
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    📋 Copy
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}