
export default function MessageBubble({ message, currentUser }) {
  const isUser = message.sender === currentUser;
  const isAdmin = message.isAdmin;

  // Format timestamp to readable time e.g. "10:45 AM"
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // --- User's own message (right side) ---
  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-green-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm">
            <p className="text-sm">{message.text}</p>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // --- Admin Chike's message (special style) ---
  if (isAdmin) {
    return (
      <div className="flex justify-center mb-3">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2 max-w-sm">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm">{message.avatar}</span>
            <span className="text-xs font-bold text-orange-500">
              {message.sender}
            </span>
            <span className="text-xs bg-orange-100 text-orange-600 px-1 rounded ml-1">
              Admin
            </span>
          </div>
          <p className="text-sm text-gray-700">{message.text}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // --- AI Persona message (left side) ---
  return (
    <div className="flex items-start gap-2 mb-3">

      {/* Avatar circle with persona color */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1"
        style={{ backgroundColor: message.color + "22" }}
      >
        {message.avatar}
      </div>

      <div className="max-w-xs lg:max-w-md">
        {/* Persona name in their color */}
        <p
          className="text-xs font-semibold mb-1"
          style={{ color: message.color }}
        >
          {message.sender}
        </p>

        {/* Message bubble */}
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm">
          <p className="text-sm text-gray-800">{message.text}</p>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>

    </div>
  );
}