mport React, { useEffect, useState } from 'react';
import { getLeaderboardData } from '../services/leaderboard';

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      const data = await getLeaderboardData();
      setLeaders(data);
      setLoading(false);
    }
    fetchRankings();
  }, []);

  if (loading) return <div className="text-center p-6 text-[#3D3025]">Loading top heroes...</div>;

  return (
    <div className="max-w-xl mx-auto bg-[#F7F4EB] border border-[#C5B49E] rounded-xl shadow-sm p-8 text-[#3D3025]">
      <span className="text-xs font-bold tracking-widest text-[#705E4C] uppercase block mb-1">COMMUNITY HEROES</span>
      <h2 className="text-3xl font-serif font-bold text-[#1A110B] mb-2">Top Founders</h2>
      <p className="text-[#5C4D3E] text-sm mb-6">Rankings of students who have reported and returned missing items.</p>
      
      <div className="space-y-4">
        {leaders.map((founder, index) => {
          const rank = index + 1;
          const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
          return (
            <div key={founder.id || index} className="flex items-center justify-between p-4 bg-[#FAF9F5] border border-[#E3DEC3] rounded-lg">
              <div className="flex items-center gap-4">
                <span className="font-serif font-bold text-lg w-8 text-center text-[#705E4C]">{rankBadge}</span>
                <div className="w-10 h-10 rounded-full bg-[#EAE5D3] border border-[#C5B49E] text-[#5C4D3E] flex items-center justify-center font-bold font-serif text-sm">
                  {founder.name ? founder.name[0].toUpperCase() : '?'}
                </div>
                <span className="font-serif font-bold text-base text-[#1A110B]">{founder.name}</span>
              </div>
              <div className="text-right font-serif">
                <span className="font-bold text-xl text-[#8C6D4F]">{founder.itemsFound}</span>
                <span className="text-xs text-[#705E4C] lowercase italic ml-1">{founder.itemsFound === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}