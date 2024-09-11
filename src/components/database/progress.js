import { supabase } from "./supabase";

export const saveProgress = async (
  userId,
  podcastId,
  episodeId,
  progress,
  completed
) => {
  const { error } = await supabase
    .from("progress")
    .insert([
      {
        user_id: userId,
        podcast_id: podcastId,
        episode_id: episodeId,
        progress: progress,
        timestamp: new Date().toISOString,
        completed: completed,
      },
    ])
    .select();

  return error;
};
