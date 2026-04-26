import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/transcript/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        console.log("API DATA:", res.data);

        // ✅ Always safe
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
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No history found</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="bg-gray-800 p-4 mb-3 rounded-xl"
          >
            <h3 className="text-lg font-bold">
              {note.title || "Untitled Video"}
            </h3>

            <p className="text-sm text-gray-400">
              {note.createdAt
                ? new Date(note.createdAt).toLocaleString()
                : "No date"}
            </p>

            <div className="mt-2 flex gap-3">
              {note.pdfUrl ? (
                <>
                  <a
                    href={note.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    View PDF
                  </a>

                  <a
                    href={note.pdfUrl}
                    download
                    className="bg-green-500 px-3 py-1 rounded"
                  >
                    Download
                  </a>
                </>
              ) : (
                <span className="text-red-400">
                  PDF not available
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;