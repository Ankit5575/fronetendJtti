import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAnnouncementManager = () => {
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [announcementExists, setAnnouncementExists] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "https://newportal.onrender.com/admin/announcement";

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  // ✅ Fetch Announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}`, { headers });
        const msg = res.data?.message || res.data?.announcement?.message;

        if (msg && typeof msg === "string" && msg.trim() !== "") {
          setMessage(msg);
          setAnnouncementExists(true);
        } else {
          setMessage("");
          setAnnouncementExists(false);
        }

        setFeedback("");
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setFeedback("❌ Failed to load announcement.");
        setAnnouncementExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  // ✅ Create
  const createAnnouncement = async () => {
    setProcessing(true);
    try {
      await axios.post(`${API_BASE}/create`, { message }, { headers });
      setFeedback("✅ Announcement created.");
      setAnnouncementExists(true);
    } catch (err) {
      console.error("Create error:", err);
      setFeedback("❌ Creation failed.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Update
  const updateAnnouncement = async () => {
    setProcessing(true);
    try {
      await axios.put(`${API_BASE}/edit`, { message }, { headers });
      setFeedback("✅ Announcement updated.");
    } catch (err) {
      console.error("Update error:", err);
      setFeedback("❌ Update failed.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Delete
  const deleteAnnouncement = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    setProcessing(true);
    try {
      await axios.delete(`${API_BASE}/delete`, { headers });
      setMessage("");
      setAnnouncementExists(false);
      setFeedback("🗑️ Announcement deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      setFeedback("❌ Deletion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📢 Admin Announcement</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write announcement..."
            disabled={processing}
          />

          <div className="flex gap-3">
            {!announcementExists ? (
              <button
                onClick={createAnnouncement}
                disabled={!message.trim() || processing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {processing ? "Creating..." : "Create"}
              </button>
            ) : (
              <>
                <button
                  onClick={updateAnnouncement}
                  disabled={!message.trim() || processing}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {processing ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={deleteAnnouncement}
                  disabled={processing}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {processing ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {feedback && (
        <div className="mt-4 p-3 rounded text-sm bg-gray-100 text-gray-700">{feedback}</div>
      )}
    </div>
  );
};

export default AdminAnnouncementManager;
