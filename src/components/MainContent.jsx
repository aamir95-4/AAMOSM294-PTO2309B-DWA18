import {
  Card,
  CardHeader,
  CardBody,
  Image,
  useDisclosure,
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
import moment from "moment";
import Filters from "./Filters";
import React from "react";
import genres from "./api/genres";
import Hero from "./Hero";
import Fuse from "fuse.js";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import { addFavorite, removeFavorite } from "./database/favourites";
import PropTypes from "prop-types";

const getGenreTitles = (podcastGenres, allGenres) => {
  return podcastGenres
    .map((genreId) => {
      const genre = allGenres.find((g) => g.id === genreId);
      return genre ? genre.title : "Unknown Genre";
    })
    .join(", ");
};

export default function MainContent({
  podcasts,
  session,
  isPlaying,
  setIsPlaying,
}) {
  const [selectedPodcast, setSelectedPodcast] = React.useState(null);
  const [sortingOptions, setSortingOptions] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredPodcasts, setFilteredPodcasts] = React.useState(podcasts);
  const [podcastData, setPodcastData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  const selectedKeysArray = Array.from(selectedKeys);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fuse = new Fuse(podcasts, {
    keys: ["title"],
  });

  const applyFilters = () => {
    let filtered = podcasts;
    const selectedGenresArray = Array.from(selectedGenres).map(Number);
    const sortingOptionsArray = Array.from(sortingOptions);

    if (selectedGenresArray.length > 0) {
      filtered = filtered.filter((podcast) =>
        selectedGenresArray.some((genre) =>
          podcast.genres.includes(Number(genre))
        )
      );
    }

    if (sortingOptionsArray.length > 0) {
      filtered = filtered.sort((a, b) => {
        if (sortingOptionsArray[0] === "Newest") {
          return moment(b.updated).diff(moment(a.updated));
        } else if (sortingOptionsArray[0] === "Oldest") {
          return moment(a.updated).diff(moment(b.updated));
        } else if (sortingOptionsArray[0] === "A-Z") {
          return a.title.localeCompare(b.title);
        } else if (sortingOptionsArray[0] === "Z-A") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    }

    if (searchTerm) {
      const fuseResults = fuse.search(searchTerm);
      filtered = fuseResults.map((result) => result.item);
    }

    setFilteredPodcasts(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedGenres, sortingOptions, podcasts]);

  React.useEffect(() => {
    if (searchTerm !== "") {
      setSelectedGenres([]);
      setSortingOptions([]);
    }
  }, [searchTerm]);

  const handleCardClick = async (podcast) => {
    setLoading(true);
    setSelectedPodcast(podcast);

    onOpen();

    try {
      const data = await fetchSinglePodcast(podcast.id);
      setPodcastData(data);
      if (data.seasons.length > 0) {
        setSelectedKeys(new Set([`${0}`]));
      }
    } catch (error) {
      console.error("Failed to fetch podcast data:", error);
    } finally {
      setLoading(false);
    }
  };

  let audioInstance = null;

  function playEpisode(fileUrl) {
    if (audioInstance) {
      audioInstance.pause();
    }
    audioInstance = new Audio(fileUrl);
    audioInstance.play();

    setIsPlaying(true);

    audioInstance.addEventListener("ended", () => {
      console.log("Episode finished playing.");
      setIsPlaying(false);
      audioInstance = null;
    });
  }

  function pauseEpisode() {
    if (audioInstance) {
      audioInstance.pause();
      console.log("Episode paused.");
      setIsPlaying(false);
    } else {
      console.log("No episode is currently playing.");
    }
  }

  return (
    <>
      <div>
        <Hero podcasts={podcasts} handleShowCardClick={handleCardClick} />
      </div>
      <div className="main-content">
        <div className="filters-container">
          <Filters
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            podcasts={podcasts}
          />
        </div>
        <div className="grid-container">
          {filteredPodcasts.map((podcast) => (
            <div className="grid-item" key={podcast.id}>
              <Card
                className="pod-card"
                isPressable
                onClick={() => handleCardClick(podcast)}
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold">
                    {podcast.title}
                  </p>
                  <small className="text-default-500">
                    Seasons: {podcast.seasons}
                  </small>
                  <small className="text-default-500">
                    Updated: {moment(podcast.updated).format("D MMMM YYYY")}
                  </small>
                  <small className="text-default-500">
                    {getGenreTitles(podcast.genres, genres)}
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt={podcast.title}
                    className="object-cover"
                    src={podcast.image}
                    width={270}
                  />
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        <Modal
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
                  <small>
                    {getGenreTitles(selectedPodcast.genres, genres)}
                  </small>
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
                          <Button
                            color="primary"
                            onClick={() => pauseEpisode()}
                          >
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
                      <Button>{`Season ${
                        Number(selectedKeysArray) + 1
                      }`}</Button>
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
                    color="primary"
                    onClick={() => addFavorite(session.user.id, podcastData.id)}
                  >
                    Favourite
                  </Button>
                </ModalFooter>
              </ModalContent>
            </>
          ) : (
            <p>Failed to load podcast details.</p>
          )}
        </Modal>
      </div>
    </>
  );
}

MainContent.PropTypes = {
  podcasts: PropTypes.array,
  session: PropTypes.object,
  isPlaying: PropTypes.bool,
  setIsPlaying: PropTypes.func,
};
