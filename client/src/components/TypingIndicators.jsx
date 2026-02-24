

export default function TypingIndicators ({ typingUsers}) {
    if (!typingUsers || typingUsers.length === 0) return null;

return (
    <div className="px-4 py-2 space-y-2">
      {typingUsers.map((persona) => (
        <div key={persona.name} className="flex items-center gap-2">

          {/* Persona avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ backgroundColor: persona.color + "22" }}
          >
            {persona.avatar}
          </div>

          {/* Typing bubble */}
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
            <div className="flex items-center gap-1">
              <span
                className="text-xs font-semibold mr-2"
                style={{ color: persona.color }}
              >
                {persona.name}
              </span>

              {/* Animated dots */}
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
