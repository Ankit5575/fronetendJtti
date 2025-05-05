import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAnnouncementManager = () => {
  const [message, setMessage] = useState("");
  const [originalMessage, setOriginalMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [announcementExists, setAnnouncementExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "https://newportal.onrender.com/admin/announcement";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://newportal.onrender.com/api/announcement");
        const msg = res.data?.message || res.data?.announcement?.message;

        if (msg && typeof msg === "string" && msg.trim() !== "") {
          setMessage(msg);
          setOriginalMessage(msg);
          setAnnouncementExists(true);
        } else {
          setMessage("");
          setOriginalMessage("");
          setAnnouncementExists(false);
        }

        setFeedback("");
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setFeedback("❌ Failed to load announcement.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  const createAnnouncement = async () => {
    setProcessing(true);
    try {
      await axios.post(`${API_BASE}/create`, { message }, { headers });
      setFeedback("✅ Announcement created successfully.");
      setAnnouncementExists(true);
      setOriginalMessage(message);
    } catch (err) {
      setFeedback(err.response?.data?.message || "❌ Creation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const editAnnouncement = async () => {
    setProcessing(true);
    try {
      await axios.put(`${API_BASE}/edit`, { message }, { headers });
      setFeedback("✅ Announcement updated successfully.");
      setOriginalMessage(message);
      setIsEditing(false);
    } catch (err) {
      setFeedback(err.response?.data?.message || "❌ Update failed.");
    } finally {
      setProcessing(false);
    }
  };

  const deleteAnnouncement = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    setProcessing(true);
    try {
      await axios.delete(`${API_BASE}/delete`, { headers });
      setMessage("");
      setOriginalMessage("");
      setAnnouncementExists(false);
      setFeedback("🗑️ Announcement deleted.");
      setIsEditing(false);
    } catch (err) {
      setFeedback(err.response?.data?.message || "❌ Deletion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📢</span> Admin Announcement Panel
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your announcement here..."
            disabled={!isEditing || processing}
          />

          <div className="flex space-x-3 mb-4">
            {announcementExists ? (
              <>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={processing}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={editAnnouncement}
                    disabled={processing || !message.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {processing ? "Updating..." : "Update"}
                  </button>
                )}
                <button
                  onClick={deleteAnnouncement}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {processing ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : (
              <button
                onClick={createAnnouncement}
                disabled={processing || !message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {processing ? "Creating..." : "Create Announcement"}
              </button>
            )}
          </div>
        </>
      )}

      {feedback && (
        <div
          className={`p-3 rounded-lg ${
            feedback.includes("❌") || feedback.includes("Failed")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementManager;
