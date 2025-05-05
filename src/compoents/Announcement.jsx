import { useEffect, useState } from "react";

function Announcement() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevAnnouncement, setPrevAnnouncement] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch("https://newportal.onrender.com/admin/announcement/");
        const data = await res.json();

        if (data.success && data.message) {
          // If changed from previous, trigger notification
          if (prevAnnouncement !== null && data.message !== prevAnnouncement) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          }

          setAnnouncement(data.message);
          setPrevAnnouncement(data.message);
        } else {
          setAnnouncement(null);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [prevAnnouncement]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="mb-6 relative">
      {/* Notification Popup */}
      {showNotification && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center z-10">
          <div className="animate-bounce bg-yellow-100 border-l-4 border-blue-900 text-yellow-700 p-3 rounded-lg shadow-lg flex items-center">
            <span className="mr-2">📢</span>
            <span className="font-medium">New announcement posted!</span>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-3 text-yellow-700 hover:text-yellow-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Announcement Content */}
      {announcement ? (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-900 border-l-4 border-amber-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-xl">📢</div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-blue-900">Announcement</h2>
              <p className="mt-1 text-sm md:text-base">{announcement}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 px-6 bg-gray-50 text-gray-500 rounded-lg border border-dashed border-gray-300">
          <span className="inline-flex items-center">
            <span className="mr-2">📭</span>
            No announcements at the moment
          </span>
        </div>
      )}
    </div>
  );
}

export default Announcement;
