import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/transcript/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.notes || [];

        setNotes(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold mb-6">History</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notes.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg">No history found</p>
          <p className="text-gray-600 text-sm mt-2">
            Generate your first PDF notes to see them here
          </p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-1">
                {note.title || "Untitled Video"}
              </h3>

              <p className="text-sm text-purple-400 mb-1 break-all">
                {note.videoUrl}
              </p>

              <p className="text-xs text-gray-500 mb-4">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : "No date"}
              </p>

              <div className="flex gap-3">
                {note.pdfUrl ? (
                  <>
                    <a
                      href={note.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      View PDF
                    </a>
                    <a
                      href={note.pdfUrl}
                      download
                      className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      Download
                    </a>
                  </>
                ) : (
                  <span className="text-red-400 text-sm">PDF not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;