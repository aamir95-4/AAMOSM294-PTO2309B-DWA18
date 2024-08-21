import { supabase } from "./supabase";

const addFavorite = async (userId, podcastId) => {
  const { data, error } = await supabase
    .from("User Favourites")
    .insert([{ user_id: userId, podcast_id: podcastId }]);

  if (error) console.error("Error adding favorite:", error);
  else console.log("Favorite added:", data);
};

const removeFavorite = async (userId, podcastId) => {
  const { data, error } = await supabase
    .from("User Favourites")
    .delete()
    .eq("user_id", userId)
    .eq("podcast_id", podcastId);

  if (error) console.error("Error removing favorite:", error);
  else console.log("Favorite removed:", data);
};

const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("User Favourites")
    .select("podcast_id")
    .eq("user_id", userId);

  if (error) console.error("Error fetching favorites:", error);
  else console.log("User favorites:", data);
};

export { addFavorite, removeFavorite, getFavorites };
