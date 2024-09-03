import {
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Accordion,
  AccordionItem,
  Progress,
} from "@nextui-org/react";
import genres from "./api/genres";
import {
  addFavourite,
  removeFavourite,
  isFavourite,
} from "./database/favourites";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { BiStar, BiSolidStar, BiPlay, BiPause } from "react-icons/bi";

export default function ShowCard({
  isOpen,
  onOpenChange,
  podcastData,
  loading,
  playEpisode,
  selectedKeysArray,
  selectedKeys,
  setSelectedKeys,
  getGenreTitles,
  selectedPodcast,
  session,
  userFavourites,
  isPlaying,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      {loading ? (
        <CircularProgress className="page-loading" label="Loading..." />
      ) : podcastData ? (
        <>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {podcastData.title}
            </ModalHeader>
            <ModalBody>
              <small>{getGenreTitles(selectedPodcast.genres, genres)}</small>
              <small className="text-default-500">
                Seasons: {podcastData.seasons.length}
              </small>
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={podcastData.image}
                width={270}
              />
              <small className="text-default-500">
                {`Episodes: ${podcastData.seasons[selectedKeysArray].episodes.length}`}
              </small>

              <Accordion>
                {podcastData.seasons[selectedKeysArray].episodes.map(
                  (episode, index) => (
                    <AccordionItem
                      key={index}
                      aria-label={`Episode ${index}`}
                      title={episode.title}
                      subtitle={`Episode ${index + 1}`}
                    >
                      {isPlaying ? (
                        <button
                          className="controlButton"
                          onClick={pauseEpisode}
                        >
                          <IconContext.Provider
                            value={{ color: "black", size: "2em" }}
                          >
                            <BiPause />
                          </IconContext.Provider>
                        </button>
                      ) : (
                        <button
                          className="controlButton"
                          onClick={() => playEpisode(episode.file)}
                        >
                          <IconContext.Provider
                            value={{ color: "black", size: "2em" }}
                          >
                            <BiPlay />
                          </IconContext.Provider>
                        </button>
                      )}

                      {isFavourite(userFavourites, episode.title) ? (
                        <button
                          onClick={() =>
                            removeFavourite(session.user.id, episode.title)
                          }
                        >
                          <IconContext.Provider
                            value={{
                              size: "1.5em",
                            }}
                          >
                            <BiSolidStar />
                          </IconContext.Provider>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            addFavourite(session.user.id, episode.title)
                          }
                        >
                          <IconContext.Provider
                            value={{
                              size: "1.5em",
                            }}
                          >
                            <BiStar />
                          </IconContext.Provider>
                        </button>
                      )}

                      <Progress size="sm" value={episode.progress} />
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </ModalBody>
            <ModalFooter>
              <Dropdown className="show-card-seasons">
                <DropdownTrigger variant="bordered">
                  <Button>{`Season ${Number(selectedKeysArray) + 1}`}</Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Seasons"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  {podcastData.seasons.map((season, index) => (
                    <DropdownItem key={index}>
                      {`Season ${index + 1}`}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </ModalFooter>
          </ModalContent>
        </>
      ) : (
        <p>Failed to load podcast details.</p>
      )}
    </Modal>
  );
}

ShowCard.propTypes = {
  podcastData: PropTypes.object,
  loading: PropTypes.bool,
  playEpisode: PropTypes.func,
  selectedKeysArray: PropTypes.array,
  selectedKeys: PropTypes.object,
  setSelectedKeys: PropTypes.func,
  getGenreTitles: PropTypes.func,
  selectedPodcast: PropTypes.object,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  session: PropTypes.object,
  userFavourites: PropTypes.array,
  isPlaying: PropTypes.bool,
};
