import { supabase } from "./supabase";

export const getEpisodeProgress = (episodeTitle, showProgress) => {
  if (!showProgress || !showProgress.data) {
    console.warn("showProgress or showProgress.data is undefined");
    return 0;
  }

  const progressData = showProgress.data.find((progress) => {
    return progress.episode_id === episodeTitle;
  });

  return progressData ? progressData.progress : 0;
};
export const saveProgress = async (
  userId,
  podcastId,
  episodeId,
  progress,
  progressUpdated
) => {
  console.log("Saving progress:", { userId, podcastId, episodeId, progress });

  try {
    // Fetch existing progress row
    const { data: existingProgress, error: fetchError } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", userId)
      .eq("podcast_id", podcastId)
      .eq("episode_id", episodeId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching progress:", fetchError.message);
      throw fetchError;
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
        console.error("Error updating progress:", updateError.message);
        throw updateError;
      }
    } else {
      // Insert a new row
      const { error: insertError } = await supabase.from("progress").insert([
        {
          user_id: userId,
          podcast_id: podcastId,
          episode_id: episodeId,
          progress: progress,
          timestamp: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting progress:", insertError.message);
        throw insertError;
      }
    }

    console.log("Progress saved successfully");
    progressUpdated(true);
  } catch (error) {
    console.error("Error in saveProgress:", error);
    // You might want to handle this error in your UI
  }
};

export const loadProgress = async (userId) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const clearProgress = async (userId) => {
  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error(`Error clearing progress: ${error.message}`);
    // You might want to handle this error in your UI
  } else {
    console.log("Progress cleared successfully.");
  }

  return error;
};
