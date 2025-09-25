import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

export default function Notification({ notifications, markAllAsRead }) {
  const [open, setOpen] = useState(false);
  const notifRef = useRef(null); // 👈 dropdown ကိုဖမ်းဖို့

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications =
    notifications.length > 10 ? notifications.slice(0, 9) : notifications;
  const remainingCount = notifications.length - displayNotifications.length;

  // ✅ Outside click ကို detect လုပ်တာ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      {/* Notification button */}
      <button
        onClick={() => setOpen((prev) => !prev)} // ✅ toggle logic
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-20 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button
              onClick={markAllAsRead}
              className="text-blue-600 text-sm hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No notifications</div>
          ) : (
            displayNotifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                  !n.read ? "bg-blue-50" : ""
                }`}
              >
                <p className="text-sm text-gray-700">{n.text}</p>
              </div>
            ))
          )}

          {remainingCount > 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 cursor-pointer">
              +{remainingCount} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
