import { supabase } from './supabase'; // Adjust path if needed

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('items')
    .select(`
      founder_id,
      profiles:founder_id (
        full_name,
        avatar_url
      )
    `)
    // Filter to only count items that have successfully been resolved/found
    .eq('status', 'found'); 

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  // Aggregate and count items per user manually since client-side grouping is cleanest in Supabase JS
  const counts = data.reduce((acc, item) => {
    const founder = item.profiles;
    const id = item.founder_id;
    
    if (!id) return acc;
    
    if (!acc[id]) {
      acc[id] = {
        name: founder?.full_name || 'Anonymous Founder',
        avatar: founder?.avatar_url || '',
        itemsFound: 0
      };
    }
    acc[id].itemsFound += 1;
    return acc;
  }, {});

  // Convert to array and sort by highest items found
  return Object.values(counts).sort((a, b) => b.itemsFound - a.itemsFound);
};
