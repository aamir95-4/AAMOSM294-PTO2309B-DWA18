import React from "react";
import { Card, CardHeader, CardBody, Slider } from "@nextui-org/react";
import { IconContext } from "react-icons";
import { BiPlay, BiSkipNext, BiSkipPrevious, BiPause } from "react-icons/bi";

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(240);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="media-player">
      <Card>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Podcast Title</p>
          <small className="text-default-500">Episode</small>
        </CardHeader>

        <CardBody>
          <div className="controls-container">
            <div className="controls">
              <IconContext.Provider value={{ color: "black", size: "2em" }}>
                <BiSkipPrevious />
              </IconContext.Provider>
              {isPlaying ? (
                <button className="controlButton" onClick={handlePlay}>
                  <IconContext.Provider value={{ color: "black", size: "2em" }}>
                    <BiPause />
                  </IconContext.Provider>
                </button>
              ) : (
                <button className="controlButton" onClick={handlePlay}>
                  <IconContext.Provider value={{ color: "black", size: "2em" }}>
                    <BiPlay />
                  </IconContext.Provider>
                </button>
              )}
              <IconContext.Provider value={{ color: "black", size: "2em" }}>
                <BiSkipNext />
              </IconContext.Provider>
            </div>
          </div>
          <div className="progress-bar-container">
            <Slider
              size="sm"
              value={currentTime}
              startContent={formatTime(currentTime)}
              endContent={formatTime(duration)}
              formatOptions={{ showMinutes: true, showSeconds: true }}
              onChange={setCurrentTime}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
