import React, { useState } from "react";
import Orb from "./Orb";

const SUPADATA_API_KEY = "sd_1c13f922e8dffa79f95736c9f46a2aa1";
const N8N_WEBHOOK_URL = "https://irrelevantabhii.app.n8n.cloud/webhook/899d9173-0315-4ead-b228-ac32f0d332a9";

const extractVideoId = (youtubeUrl) => {
  const match = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const Section2 = () => {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfFilename, setPdfFilename] = useState("notes.pdf");
  const [pdfObjectUrl, setPdfObjectUrl] = useState("");

  const saveToHistory = async (videoUrl, pdfLink) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch("/api/transcript/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoUrl,
          pdfUrl: pdfLink,
          title: `Notes - ${new Date().toLocaleDateString()}`,
        }),
      });
    } catch (e) {
      console.log("History save failed:", e);
    }
  };

  const handleGenerate = async () => {
    setError("");
    setTranscript("");
    setStatus("");
    setPdfUrl("");
    setPdfBlob(null);
    setPdfFilename("notes.pdf");

    // Revoke previous object URL to avoid memory leaks
    if (pdfObjectUrl) {
      URL.revokeObjectURL(pdfObjectUrl);
      setPdfObjectUrl("");
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Could not find a valid YouTube video ID in that URL.");
      return;
    }

    setLoading(true);
    setStatus("fetching");

    try {
      const transcriptRes = await fetch(
        `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
        {
          method: "GET",
          headers: { "x-api-key": SUPADATA_API_KEY },
        }
      );

      if (!transcriptRes.ok) {
        const errText = await transcriptRes.text();
        throw new Error(`Transcript API error (${transcriptRes.status}): ${errText}`);
      }

      const transcriptData = await transcriptRes.json();
      const fullText = transcriptData?.content?.trim();

      if (!fullText) {
        throw new Error("No transcript found. The video may not have captions enabled.");
      }

      setTranscript(fullText);
      setStatus("sending");

      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          videoUrl: url,
          transcript: fullText,
        }),
      });

      if (!n8nRes.ok) {
        throw new Error(`n8n error (${n8nRes.status}). PDF generation failed.`);
      }

      const n8nData = await n8nRes.json();

      if (n8nData.success && n8nData.pdf) {
        setStatus("downloading");

        if (n8nData.pdf.startsWith("http")) {
          // n8n returned a hosted URL
          setPdfUrl(n8nData.pdf);
          await saveToHistory(url, n8nData.pdf);
        } else {
          // n8n returned base64 PDF — convert to blob for preview
          const byteChars = atob(n8nData.pdf);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const objUrl = URL.createObjectURL(blob);
          setPdfBlob(blob);
          setPdfObjectUrl(objUrl);
          setPdfFilename(n8nData.filename || "notes.pdf");
          await saveToHistory(url, objUrl);
        }

        setStatus("done");
      } else {
        throw new Error("PDF was not returned from n8n.");
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const link = document.createElement("a");
    link.href = pdfObjectUrl;
    link.download = pdfFilename;
    link.click();
  };

  const handleReset = () => {
    if (pdfObjectUrl) {
      URL.revokeObjectURL(pdfObjectUrl);
    }
    setUrl("");
    setTranscript("");
    setStatus("");
    setError("");
    setPdfUrl("");
    setPdfBlob(null);
    setPdfFilename("notes.pdf");
    setPdfObjectUrl("");
  };

  const statusMessages = {
    fetching: "Fetching transcript...",
    sending: "Sending to AI for PDF generation...",
    downloading: "PDF ready!",
    done: "Your PDF is ready!",
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={1}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">
          Paste YouTube Link
        </h1>
        <p className="text-gray-400 mb-8 text-center text-sm">
          We will extract the transcript and generate structured notes as a PDF
        </p>

        {/* Input Bar */}
        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3 shadow-xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 bg-transparent outline-none text-white px-4 py-3 placeholder-gray-400 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !url.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            {loading ? "Working..." : "Generate"}
          </button>
        </div>

        {/* Status Message */}
        {status && statusMessages[status] && (
          <p className="mt-4 text-purple-300 text-sm animate-pulse">
            {statusMessages[status]}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-400 text-sm max-w-2xl text-center">
            ⚠️ {error}
          </p>
        )}

        {/* PDF Preview + Actions — shown when done */}
        {status === "done" && (pdfUrl || pdfObjectUrl) && (
          <div className="mt-6 w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-green-400 font-semibold text-sm">
              ✅ Your notes are ready!
            </p>

            {/* PDF iframe Preview */}
            <iframe
              src={pdfUrl || pdfObjectUrl}
              className="w-full h-72 rounded-xl border border-white/20 bg-white"
              title="PDF Notes Preview"
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Open in new tab (URL-based) */}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
                >
                  Open PDF ↗
                </a>
              )}

              {/* Download (blob-based) */}
              {pdfBlob && (
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
                >
                  ⬇ Download PDF
                </button>
              )}

              {/* Generate Another */}
              <button
                onClick={handleReset}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}

        {/* Transcript Preview */}
        {transcript && status !== "done" && (
          <div className="mt-6 w-full max-w-2xl">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Transcript Preview
            </p>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 max-h-48 overflow-y-auto text-sm text-gray-200 leading-relaxed">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Section2;