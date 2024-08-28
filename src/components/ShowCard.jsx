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
} from "@nextui-org/react";
import genres from "./api/genres";
import { addFavorite, removeFavorite } from "./database/favourites";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { BiStar, BiSolidStar } from "react-icons/bi";

export default function ShowCard({
  isOpen,
  onOpenChange,
  podcastData,
  loading,
  pauseEpisode,
  playEpisode,
  selectedKeysArray,
  selectedKeys,
  setSelectedKeys,
  getGenreTitles,
  selectedPodcast,
  session,
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
                    >
                      <Button color="primary" onClick={() => pauseEpisode()}>
                        Pause
                      </Button>

                      <Button
                        color="primary"
                        onClick={() => playEpisode(episode.file)}
                      >
                        Play
                      </Button>
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
              <Button
                color="defuault"
                isIconOnly
                onClick={() => addFavorite(session.user.id, podcastData.id)}
              >
                <IconContext.Provider value={{ color: "black", size: "1em" }}>
                  <BiStar /> <BiSolidStar />
                </IconContext.Provider>
              </Button>
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
  pauseEpisode: PropTypes.func,
  playEpisode: PropTypes.func,
  selectedKeysArray: PropTypes.number,
  selectedKeys: PropTypes.array,
  setSelectedKeys: PropTypes.func,
  getGenreTitles: PropTypes.func,
  selectedPodcast: PropTypes.object,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  session: PropTypes.object,
};
