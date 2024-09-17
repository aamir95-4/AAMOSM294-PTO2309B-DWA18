import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { IconContext } from "react-icons";
import { BiMinus } from "react-icons/bi";
import PropTypes from "prop-types";
import { getEpisodeProgress, saveProgress } from "./database/progress";

export default function MediaPlayer({
  isPlayerOpen,
  setIsPlayerOpen,
  episodePlaying,
  showProgress,
  setProgressUpdated,
  session,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSaveProgress = useCallback(() => {
    if (duration > 0) {
      const progressAsPercentage = (currentTime / duration) * 100;
      console.log("Saving progress:", progressAsPercentage);
      saveProgress(
        session.user.id,
        episodePlaying.podcastId,
        episodePlaying.episodeTitle,
        progressAsPercentage,
        setProgressUpdated
      );
    }
  }, [
    currentTime,
    duration,
    episodePlaying,
    session.user.id,
    setProgressUpdated,
  ]);

  useEffect(() => {
    console.log("Episode changed:", episodePlaying.episodeTitle);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoaded(false);
      audioRef.current.src = episodePlaying.episodeFile;
      audioRef.current.load();
    }
  }, [episodePlaying.episodeFile, episodePlaying.episodeTitle]);

  useEffect(() => {
    const setInitialProgress = () => {
      if (isLoaded && audioRef.current) {
        const progressAsPercentage = getEpisodeProgress(
          episodePlaying.episodeTitle,
          showProgress
        );
        console.log("Initial progress:", progressAsPercentage);
        if (progressAsPercentage > 0) {
          const progress =
            (progressAsPercentage / 100) * audioRef.current.duration;
          audioRef.current.currentTime = progress;
          setCurrentTime(progress);
        }
      }
    };

    setInitialProgress();
  }, [isLoaded, episodePlaying.episodeTitle, showProgress]);

  useEffect(() => {
    const saveProgressInterval = setInterval(() => {
      if (isPlaying) {
        handleSaveProgress();
      }
    }, 5000); // Save progress every 5 seconds while playing

    return () => clearInterval(saveProgressInterval);
  }, [isPlaying, handleSaveProgress]);

  const handleOpenPlayer = () => {
    setIsPlayerOpen(!isPlayerOpen);
  };

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    handleSaveProgress();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    setIsLoaded(true);
  };

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {isPlayerOpen && (
        <div className="media-player">
          <Card>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                {episodePlaying.podcastTitle}
              </p>
              <small className="text-default-500">
                Season: {parseInt(episodePlaying.seasonNumber) + 1}
              </small>
              <small className="text-default-500">
                {episodePlaying.episodeTitle}
              </small>
              <button
                aria-label="Hide media player"
                className="hide-media-player"
                onClick={handleOpenPlayer}
              >
                <IconContext.Provider value={{ color: "black", size: "1.5em" }}>
                  <BiMinus />
                </IconContext.Provider>
              </button>
            </CardHeader>

            <CardBody>
              <audio
                ref={audioRef}
                onPlay={handlePlay}
                onPause={handlePause}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onEnded={handleSaveProgress}
                controls
              >
                <source src={episodePlaying.episodeFile} />
                Your browser does not support the audio element.
              </audio>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}

MediaPlayer.propTypes = {
  isPlayerOpen: PropTypes.bool,
  setIsPlayerOpen: PropTypes.func,
  episodePlaying: PropTypes.object,
  showProgress: PropTypes.object,
  setProgressUpdated: PropTypes.func,
  session: PropTypes.object,
};
