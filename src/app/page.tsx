'use client';

import Image from 'next/image';

interface Friend {
  id: string;
  name: string;
  distance: number; // 0-100, percentage from center
  imageUrl?: string;
  auraColors: {
    from: string;
    to: string;
  };
}

const SAMPLE_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Alice',
    distance: 40,
    imageUrl: "https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/studio-business-headshot-of-a-black-man-in-Los-Angeles-qep2bstk7vlgl6yzkdozfxz606pu8t2vgp6pzqd4pc.jpg",
    auraColors: { from: 'blue-300', to: 'purple-300' }
  },
  {
    id: '2',
    name: 'Bob',
    distance: 60,
    imageUrl: '/sample-avatar-2.jpg',
    auraColors: { from: 'pink-300', to: 'purple-400' }
  },
  {
    id: '3',
    name: 'Charlie',
    distance: 80,
    auraColors: { from: 'indigo-300', to: 'blue-400' }
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center p-8">
      {/* Main container */}
      <div className="relative w-full max-w-3xl aspect-square">
        {/* Central glowing orb - your aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 animate-pulse shadow-[0_0_100px_30px_rgba(168,85,247,0.4)]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/40 via-transparent to-purple-400/40 animate-pulse [animation-delay:-.5s]" />
        </div>

        {/* Surrounding friend orbs */}
        {SAMPLE_FRIENDS.map((friend, index) => {
          const angle = (index * 2 * Math.PI) / SAMPLE_FRIENDS.length;
          return (
            <div
              key={friend.id}
              className="absolute w-16 h-16 transition-transform duration-300 hover:scale-125 cursor-pointer group"
              style={{
                top: `${50 + friend.distance * Math.sin(angle)}%`,
                left: `${50 + friend.distance * Math.cos(angle)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="relative w-full h-full animate-float" 
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Aura glow */}
                <div 
                  className="absolute inset-0 rounded-full shadow-[0_0_20px_5px_rgba(168,85,247,0.2)]"
                  style={{
                    background: `linear-gradient(to bottom right, var(--tw-gradient-from-${friend.auraColors.from}), var(--tw-gradient-to-${friend.auraColors.to}))`,
                  }}
                />
                
                {/* Glass effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
                
                {/* Profile image if available */}
                {friend.imageUrl && (
                  <div className="absolute inset-2 rounded-full overflow-hidden">
                    <Image 
                      src={friend.imageUrl} 
                      alt={friend.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Name tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-sm px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm">
                  {friend.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 