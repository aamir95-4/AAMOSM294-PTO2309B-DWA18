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
import { BiStar, BiSolidStar } from "react-icons/bi";
import { getEpisodeProgress } from "./database/progress";

export default function ShowCard({
  isOpen,
  onOpenChange,
  podcastData,
  loading,
  selectedKeysArray,
  selectedKeys,
  setSelectedKeys,
  getGenreTitles,
  selectedPodcast,
  session,
  userFavourites,
  setIsPlayerOpen,
  setEpisodePlaying,
  setFavouritesUpdated,
  showProgress,
}) {
  const playEpisode = (id, show, season, episode, episodeFile) => {
    setEpisodePlaying({
      podcastId: id,
      podcastTitle: show,
      seasonNumber: season,
      episodeTitle: episode,
      episodeFile: episodeFile,
    });
    setIsPlayerOpen(true);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
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
                      aria-label={`Episode ${index}: ${episode.title}`}
                      title={episode.title}
                      subtitle={`Episode ${index + 1}`}
                    >
                      {!session && (
                        <div>
                          <p className="text-default-500">
                            {" "}
                            Please log in/sign up to listen.
                          </p>
                        </div>
                      )}
                      {session && (
                        <div className="episode-actions">
                          <Button
                            aria-label={`Play episode: ${episode.title}`}
                            size="sm"
                            className="controlButton"
                            onClick={() =>
                              playEpisode(
                                podcastData.id,
                                podcastData.title,
                                selectedKeysArray,
                                episode.title,
                                episode.file
                              )
                            }
                          >
                            Listen Now
                          </Button>
                          {isFavourite(userFavourites, episode.title) ? (
                            <button
                              aria-label={`Remove ${episode.title} from favourites`}
                              onClick={() =>
                                removeFavourite(
                                  session.user.id,
                                  episode.title,
                                  setFavouritesUpdated
                                )
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
                              aria-label={`Add ${episode.title} to favourites`}
                              onClick={() =>
                                addFavourite(
                                  session.user.id,
                                  episode.title,
                                  setFavouritesUpdated
                                )
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
                        </div>
                      )}
                      <Progress
                        aria-label={`Progress for episode ${episode.title}: ${episode.progress}%`}
                        size="sm"
                        value={getEpisodeProgress(episode.title, showProgress)}
                      />
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
                  aria-label={`Select season (Currently Season ${
                    Number(selectedKeysArray) + 1
                  })`}
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  {podcastData.seasons.map((season, index) => (
                    <DropdownItem
                      key={index}
                      aria-label={`Season ${index + 1}`}
                    >
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
  setIsPlayerOpen: PropTypes.func,
  setEpisodePlaying: PropTypes.func,
  setFavouritesUpdated: PropTypes.func,
  showProgress: PropTypes.object,
};
