import { supabase } from './supabase';

/**
 * Fetches data from the 'lost_items' table and joins user profile details.
 */
export const getLeaderboardData = async () => {
  try {
    // 1. Fetch lost items while querying both possible profile name fields
    const { data: items, error } = await supabase
      .from('lost_items') 
      .select(`
        user_id,
        profiles:user_id (
          username,
          full_name
        )
      `);

    if (error) {
      console.error('Supabase query error:', error.message);
      return [];
    }

    if (!items || items.length === 0) {
      return [];
    }

    // 2. Group items by user and count them using their actual profiles details
    const userCounts = items.reduce((accumulator, item) => {
      const id = item.user_id;
      
      // Dynamic fallback checklist: 
      // Look for full_name first, then username, then fall back to the raw truncated ID string.
      const displayName = item.profiles?.full_name || 
                          item.profiles?.username || 
                          `User ${id.substring(0, 5)}...`;

      if (!id) return accumulator;

      if (!accumulator[id]) {
        accumulator[id] = {
          id: id,
          name: displayName, // Sets the chosen clear identifier profile string
          itemsFound: 0,
        };
      }

      accumulator[id].itemsFound += 1;
      return accumulator;
    }, {});

    // 3. Convert grouped objects to array and sort descending (highest first)
    return Object.values(userCounts).sort((a, b) => b.itemsFound - a.itemsFound);
  } catch (err) {
    console.error('Unexpected error fetching leaderboard:', err);
    return [];
  }
};

// import { supabase } from './supabase';

// /**
//  * Fetches data from the 'lost_items' table and aggregates metrics per user.
//  */
// export const getLeaderboardData = async () => {
//   try {
//     // 1. Query the exact table and column found in your Dashboard.jsx file
//     const { data: items, error } = await supabase
//       .from('lost_items') 
//       .select('user_id'); // Using user_id based on your dashboard query snippet

//     if (error) {
//       console.error('Supabase query error:', error.message);
//       return [];
//     }

//     if (!items || items.length === 0) {
//       return [];
//     }

//     // 2. Group items by user_id and count how many entries they have
//     const userCounts = items.reduce((accumulator, item) => {
//       const id = item.user_id;
      
//       // Default fallback name for prototype view
//       const name = id ? `User ${id.substring(0, 5)}...` : 'Anonymous';

//       if (!id) return accumulator;

//       if (!accumulator[id]) {
//         accumulator[id] = {
//           id: id,
//           name: name,
//           itemsFound: 0,
//         };
//       }

//       accumulator[id].itemsFound += 1;
//       return accumulator;
//     }, {});

//     // 3. Convert grouped objects to array and sort by highest items found descending
//     return Object.values(userCounts).sort((a, b) => b.itemsFound - a.itemsFound);
//   } catch (err) {
//     console.error('Unexpected error fetching leaderboard:', err);
//     return [];
//   }
// };
// import { supabase } from './supabase'; // Adjust path if needed

// export const getLeaderboardData = async () => {
//   const { data, error } = await supabase
//     .from('items')
//     .select(`
//       founder_id,
//       profiles:founder_id (
//         full_name,
//         avatar_url
//       )
//     `)
//     // Filter to only count items that have successfully been resolved/found
//     .eq('status', 'found'); 

//   if (error) {
//     console.error('Error fetching leaderboard:', error);
//     return [];
//   }

//   // Aggregate and count items per user manually since client-side grouping is cleanest in Supabase JS
//   const counts = data.reduce((acc, item) => {
//     const founder = item.profiles;
//     const id = item.founder_id;
    
//     if (!id) return acc;
    
//     if (!acc[id]) {
//       acc[id] = {
//         name: founder?.full_name || 'Anonymous Founder',
//         avatar: founder?.avatar_url || '',
//         itemsFound: 0
//       };
//     }
//     acc[id].itemsFound += 1;
//     return acc;
//   }, {});

//   // Convert to array and sort by highest items found
//   return Object.values(counts).sort((a, b) => b.itemsFound - a.itemsFound);
// };
