import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/transcript/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data) ? res.data : res.data.notes || [];
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/transcript/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const isValidPdf = (pdfUrl) => {
    return (
      pdfUrl &&
      pdfUrl !== "base64-pdf" &&
      (pdfUrl.startsWith("http") || pdfUrl.startsWith("data:application/pdf"))
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVideoId = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">📋</span>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-rrom-white to-purple-400 bg-clip-text text-transparent tracking-tight">
              Your Notes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? "Loading..." : `${notes.length} session${notes.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
        </div>
        {/* Divider */}
        <div className="h-px bg-linear-to-r from-purple-500/40 to-transparent mt-4" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-32 gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Fetching your sessions...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-32 gap-3">
          <span className="text-6xl">🎬</span>
          <p className="text-xl font-semibold text-gray-400">No sessions yet</p>
          <p className="text-sm text-gray-600">Generate your first PDF notes to see them here</p>
        </div>
      )}

      {/* Notes Grid */}
      {!loading && notes.length > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.map((note, index) => {
            const videoId = getVideoId(note.videoUrl);
            const thumbnail = videoId
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : null;

            return (
              <div
                key={note._id}
                className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-40 bg-zinc-900 overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-950/30">
                      <span className="text-4xl">🎥</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90" />
                  {/* PDF Badge */}
                  <span className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md">
                    PDF
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-2 truncate">
                    {note.title || "Untitled Session"}
                  </h3>

                  {/* Video URL */}
                  <a
                    href={note.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 mb-3 group/link"
                  >
                    <span className="text-purple-500 text-xs">▶</span>
                    <span className="text-xs text-purple-400/80 group-hover/link:text-purple-300 truncate transition-colors">
                      {note.videoUrl?.replace("https://", "").slice(0, 45)}
                      {note.videoUrl?.length > 50 ? "..." : ""}
                    </span>
                  </a>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-600">📅 {formatDate(note.createdAt)}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-600">🕐 {formatTime(note.createdAt)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {isValidPdf(note.pdfUrl) ? (
                      <>
                        <a
                          href={note.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-purple-500/20"
                        >
                          View PDF ↗
                        </a>
                        <a
                          href={note.pdfUrl}
                          download="notes.pdf"
                          className="bg-white/8 hover:bg-white/15 border border-white/10 text-gray-300 text-xs font-medium px-4 py-2 rounded-xl transition-all"
                        >
                          ⬇ Download
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-red-400/60">PDF unavailable</span>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(note._id)}
                      disabled={deletingId === note._id}
                      className="ml-auto bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-40"
                    >
                      {deletingId === note._id ? "..." : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;