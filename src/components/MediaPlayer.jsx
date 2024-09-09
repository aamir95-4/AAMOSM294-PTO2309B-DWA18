import React from "react";
import { Card, CardHeader, CardBody, Slider, Button } from "@nextui-org/react";
import { IconContext } from "react-icons";
import {
  BiPlay,
  BiSkipNext,
  BiSkipPrevious,
  BiPause,
  BiMinus,
  BiPodcast,
} from "react-icons/bi";
import PropTypes from "prop-types";

export default function MediaPlayer({
  isPlayerOpen,
  setIsPlayerOpen,
  episodePlaying,
  setEpisodePlaying,
  podcastData,
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [episodes, setEpisodes] = React.useState([]);

  React.useEffect(() => {
    const currentSeason = episodePlaying.season;
    setEpisodes(podcastData.seasons[currentSeason].episodes);
  }, [episodePlaying, podcastData]);

  const audioRef = React.useRef(new Audio(episodePlaying.episodeFile));
  const currentEpisodeIndex = episodes.findIndex(
    (episode) => episode.title === episodePlaying.episodeTitle
  );

  React.useEffect(() => {
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current.duration);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current.currentTime);
    });
  }, []);
  React.useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

  const handleOpenPlayer = () => {
    setIsPlayerOpen(!isPlayerOpen);
  };

  const playAudio = () => {
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      pauseAudio();
      setCurrentTime(0);
      setEpisodePlaying({
        ...episodePlaying,
        episodeTitle: episodes[currentEpisodeIndex + 1].title,
        episodeFile: episodes[currentEpisodeIndex + 1].file,
      });
    }
  };

  const handlePrevious = () => {
    if (currentEpisodeIndex > 0) {
      pauseAudio();
      setCurrentTime(0);
      setEpisodePlaying({
        ...episodePlaying,
        episodeTitle: episodes[currentEpisodeIndex - 1].title,
        episodeFile: episodes[currentEpisodeIndex - 1].file,
      });
    }
  };

  const handleSliderChange = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <>
      {isPlayerOpen ? (
        <div className="media-player">
          <Card>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                {episodePlaying.podcastTitle}
              </p>
              <small className="text-default-500">
                Season: {""}
                {parseInt(episodePlaying.season) + 1}
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
              <div className="controls-container">
                <div className="controls">
                  <button
                    aria-label="Previous episode"
                    onClick={handlePrevious}
                  >
                    <IconContext.Provider
                      value={{ color: "black", size: "2em" }}
                    >
                      <BiSkipPrevious />
                    </IconContext.Provider>
                  </button>
                  {isPlaying ? (
                    <button
                      aria-label="Pause"
                      className="controlButton"
                      onClick={pauseAudio}
                    >
                      <IconContext.Provider
                        value={{ color: "black", size: "2em" }}
                      >
                        <BiPause />
                      </IconContext.Provider>
                    </button>
                  ) : (
                    <button
                      aria-label="Play"
                      className="controlButton"
                      onClick={playAudio}
                    >
                      <IconContext.Provider
                        value={{ color: "black", size: "2em" }}
                      >
                        <BiPlay />
                      </IconContext.Provider>
                    </button>
                  )}
                  <button aria-label="Next episode" onClick={handleNext}>
                    <IconContext.Provider
                      value={{ color: "black", size: "2em" }}
                    >
                      <BiSkipNext />
                    </IconContext.Provider>
                  </button>
                </div>
              </div>
              <div className="progress-bar-container">
                <Slider
                  aria-label="Episode progress"
                  size="sm"
                  minValue={0}
                  maxValue={duration}
                  value={currentTime}
                  startContent={formatTime(currentTime)}
                  endContent={formatTime(duration)}
                  formatOptions={{ showMinutes: true, showSeconds: true }}
                  onChange={handleSliderChange}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="media-player">
          <Button
            aria-label="Open media player"
            isIconOnly
            color="primary"
            onClick={handleOpenPlayer}
          >
            <IconContext.Provider value={{ color: "white", size: "2em" }}>
              <BiPodcast />
            </IconContext.Provider>
          </Button>
        </div>
      )}
    </>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

MediaPlayer.propTypes = {
  isPlayerOpen: PropTypes.bool,
  setIsPlayerOpen: PropTypes.func,
  episodePlaying: PropTypes.object,
  setEpisodePlaying: PropTypes.func,
  podcastData: PropTypes.object,
};
