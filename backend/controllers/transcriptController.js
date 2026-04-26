import axios from "axios";

// 🔹 Extract video ID
const getVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    if (parsedUrl.searchParams.get("v")) {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.pathname.includes("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1];
    }

    return null;
  } catch {
    return null;
  }
};

export const getTranscript = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const videoId = getVideoId(url);

    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    // 🔥 Use free transcript API (reliable)
    const ytResponse = await axios.get(
      `https://youtubetranscript.com/?server_vid2=${videoId}`
    );

    const transcriptData = ytResponse.data?.transcript;

    if (!transcriptData || transcriptData.length === 0) {
      return res.status(404).json({ message: "No transcript available" });
    }

    const transcriptText = transcriptData
      .map((item) => item.text)
      .join(" ")
      .slice(0, 15000);

    // 🔥 Send to n8n
    const response = await axios.post(
      "https://irrelevantabhii.app.n8n.cloud/webhook/899d9173-0315-4ead-b228-ac32f0d332a9",
      { transcript: transcriptText },
      { timeout: 30000 }
    );

    res.json({
      success: true,
      data: {
        pdfUrl:
          response.data?.pdfUrl ||
          response.data?.url ||
          response.data,
      },
    });

  } catch (error) {
    console.error("🔥 ERROR:", error.message);

    res.status(500).json({
      message: "Error generating transcript",
    });
  }
};