import { useDisclosure, Tabs, Tab } from "@nextui-org/react";
import moment from "moment";
import Filters from "./Filters";
import React from "react";
import genres from "./api/genres";
import Hero from "./Hero";
import Fuse from "fuse.js";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import ShowCard from "./ShowCard";
import PropTypes from "prop-types";
import Favourites from "./Favourites";
import ShowAll from "./ShowAll";
import MediaPlayer from "./MediaPlayer";

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
  isPlayerOpen,
  setIsPlayerOpen,
  userFavourites,
  episodePlaying,
  setEpisodePlaying,
  setFavouritesUpdated,
  showProgress,
  setProgressUpdated,
}) {
  const [selectedPodcast, setSelectedPodcast] = React.useState(null);
  const [sortingOptions, setSortingOptions] = React.useState("");
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

  const applyFilters = React.useCallback(() => {
    let filtered = [...podcasts];

    const selectedGenresArray = Array.from(selectedGenres).map(Number);

    if (selectedGenresArray.length > 0) {
      filtered = filtered.filter((podcast) =>
        selectedGenresArray.some((genre) =>
          podcast.genres.includes(Number(genre))
        )
      );
    }

    if (sortingOptions) {
      filtered.sort((a, b) => {
        if (sortingOptions === "Newest") {
          return moment(b.updated).diff(moment(a.updated));
        } else if (sortingOptions === "Oldest") {
          return moment(a.updated).diff(moment(b.updated));
        } else if (sortingOptions === "A-Z") {
          return a.title.localeCompare(b.title);
        } else if (sortingOptions === "Z-A") {
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
  }, [podcasts, selectedGenres, sortingOptions, searchTerm]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  React.useEffect(() => {
    if (searchTerm !== "") {
      setSelectedGenres([]);
      setSortingOptions("");
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
        <div className="Tabs">
          <Tabs aria-label="menu" color="primary">
            <Tab key="show all" title="Show All">
              <ShowAll
                handleCardClick={handleCardClick}
                filteredPodcasts={filteredPodcasts}
                getGenreTitles={getGenreTitles}
                genres={genres}
              />
            </Tab>

            <Tab key="favourites" title="Favourites">
              <Favourites
                userFavourites={userFavourites || []}
                podcasts={podcasts}
                session={session}
                handleCardClick={handleCardClick}
                setIsPlayerOpen={setIsPlayerOpen}
                setEpisodePlaying={setEpisodePlaying}
                setFavouritesUpdated={setFavouritesUpdated}
                sortingOptions={sortingOptions}
              />
            </Tab>
          </Tabs>
        </div>

        <ShowCard
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          podcastData={podcastData}
          loading={loading}
          selectedKeysArray={selectedKeysArray}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          getGenreTitles={getGenreTitles}
          selectedPodcast={selectedPodcast}
          session={session}
          userFavourites={userFavourites}
          setIsPlayerOpen={setIsPlayerOpen}
          setEpisodePlaying={setEpisodePlaying}
          setFavouritesUpdated={setFavouritesUpdated}
          showProgress={showProgress}
        />
        {episodePlaying.episodeTitle && (
          <MediaPlayer
            isPlayerOpen={isPlayerOpen}
            setIsPlayerOpen={setIsPlayerOpen}
            episodePlaying={episodePlaying}
            showProgress={showProgress}
            setProgressUpdated={setProgressUpdated}
            session={session}
          />
        )}
      </div>
    </>
  );
}

MainContent.propTypes = {
  podcasts: PropTypes.array,
  session: PropTypes.object,
  isPlayerOpen: PropTypes.bool,
  setIsPlayerOpen: PropTypes.func,
  userFavourites: PropTypes.array,
  episodePlaying: PropTypes.object,
  setEpisodePlaying: PropTypes.func,
  setFavouritesUpdated: PropTypes.func,
  showProgress: PropTypes.object,
  setProgressUpdated: PropTypes.func,
};
