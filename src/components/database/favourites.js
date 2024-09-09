/* eslint-disable no-unused-vars */
import { supabase } from "./supabase";

export const fetchFavourites = async (userId) => {
  let { data } = await supabase
    .from("favourites")
    .select("podcastarray")
    .eq("user_id", userId);
  return data;
};

export const createFavouritesTable = async (userId) => {
  const { data, error } = await supabase
    .from("favourites")
    .insert([{ user_id: userId, podcastarray: ["example_podcast_title"] }])
    .select();

  return data;
};

export const addFavourite = async (
  userId,
  newPodcast,
  setFavouritesUpdated
) => {
  const { data, error } = await supabase
    .from("favourites")
    .select("podcastarray")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching current podcast array:", error);
    return;
  }

  let podcastArray = data?.podcastarray || [];

  if (!podcastArray.includes(newPodcast)) {
    podcastArray.push(newPodcast);
  } else {
    console.log("Podcast already in favorites");
    return;
  }

  const { error: updateError, data: updateData } = await supabase
    .from("favourites")
    .upsert(
      { user_id: userId, podcastarray: podcastArray },
      { onConflict: "user_id" }
    )
    .select();

  if (updateError) {
    console.error("Error updating podcast array:", updateError);
  } else {
    console.log("Podcast added to favorites:", updateData);
  }

  setFavouritesUpdated(true);
};

export const removeFavourite = async (
  userId,
  podcastId,
  setFavouritesUpdated
) => {
  const { data, error } = await supabase
    .from("favourites")
    .select("podcastarray")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching current podcast array:", error);
    return;
  }

  let podcastArray = data?.podcastarray || [];
  const index = podcastArray.indexOf(podcastId);
  if (index > -1) {
    podcastArray.splice(index, 1);
  } else {
    console.log("Podcast not found in favorites");
    return;
  }

  const { error: updateError, data: updateData } = await supabase
    .from("favourites")
    .upsert(
      { user_id: userId, podcastarray: podcastArray },
      { onConflict: "user_id" }
    )
    .select();

  if (updateError) {
    console.error("Error updating podcast array:", updateError);
  } else {
    console.log("Podcast removed from favorites:", updateData);
  }

  setFavouritesUpdated(true);
};

export const isFavourite = (userFavourites, podcastTitle) => {
  return userFavourites.some((favourite) =>
    favourite.podcastarray.includes(podcastTitle)
  );
};
