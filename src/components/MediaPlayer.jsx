import React from "react";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { IconContext } from "react-icons";
import { BiMinus, BiPodcast } from "react-icons/bi";
import PropTypes from "prop-types";

export default function MediaPlayer({
  isPlayerOpen,
  setIsPlayerOpen,
  episodePlaying,
}) {
  const audioRef = React.useRef(new Audio(episodePlaying.episodeFile));

  const handleOpenPlayer = () => {
    setIsPlayerOpen(!isPlayerOpen);
    console.log(episodePlaying);
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
                {parseInt(episodePlaying.seasonNumber) + 1}
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
              <audio controls ref={audioRef}>
                <source src={episodePlaying.episodeFile} />
              </audio>
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

MediaPlayer.propTypes = {
  isPlayerOpen: PropTypes.bool,
  setIsPlayerOpen: PropTypes.func,
  episodePlaying: PropTypes.object,
};
