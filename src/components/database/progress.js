import { supabase } from "./supabase";

export const saveProgress = async (
  userId,
  podcastId,
  episodeId,
  progress,
  progressUpdated
) => {
  // Fetch existing progress row
  const { data: existingProgress, error: fetchError } = await supabase
    .from("progress")
    .select("id")
    .eq("user_id", userId)
    .eq("podcast_id", podcastId)
    .eq("episode_id", episodeId)
    .single(); // Using .single() to expect one row, but will handle no row case

  if (fetchError && fetchError.code !== "PGRST116") {
    // Log and return if fetch error is not related to "no rows found"
    console.error("Error fetching progress:", fetchError);
    return fetchError;
  }

  if (existingProgress) {
    // Update the existing row
    const { error: updateError } = await supabase
      .from("progress")
      .update({
        progress: progress,
        timestamp: new Date(),
      })
      .eq("id", existingProgress.id);

    if (updateError) {
      console.error("Error updating progress:", updateError);
      return updateError;
    }
  } else {
    // Insert a new row
    const { error: insertError, data: insertData } = await supabase
      .from("progress")
      .insert([
        {
          user_id: userId,
          podcast_id: podcastId,
          episode_id: episodeId,
          progress: progress,
          timestamp: new Date(),
        },
      ]);

    if (insertError) {
      console.error("Error inserting progress:", insertError);
      return insertError;
    } else {
      console.log("Inserted new row:", insertData);
    }
  }

  progressUpdated(true);

  return null;
};

export const loadProgress = async (userId) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const getEpisodeProgress = (episodeTitle, showProgress) => {
  if (!showProgress || !Array.isArray(showProgress.data)) {
    console.error("showProgress is not an array:", showProgress);
    return 0;
  }

  const progressData = showProgress.data.find((progress) => {
    return progress.episode_id === episodeTitle;
  });

  return progressData ? progressData.progress : 0;
};

export const clearProgress = async (userId) => {
  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("user_id", userId);
  return error;
};
