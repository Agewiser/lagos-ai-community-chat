import { useState} from 'react';

export default function JoinScreen (onJoin) {
    const [name, setName] = useState('');

    function handleSubmit () {
        const trimmed = name.trim();
        if (!trimmed) return;
        onJoin(trimmed);
    }

    function handleKeyDown (e) {
        if (e.Key === 'Enter') handleSubmit();
    }

    return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center">
         <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
            <span className="text-5xl">🇳🇬</span>
                <h1 className="text-2xl font-bold text-gray-800 mt-2">
                    Lagos Community Chat
                </h1>
            <p className="text-gray-500 text-sm mt-1">
                Enter your name to join the room
            </p>
         </div>

        {/* Input */}
        <input
          type="text"
          placeholder="What's your name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />

        {/* Button */}
        <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
            Join the Room
        </button>

      </div>
    </div>
    )
}