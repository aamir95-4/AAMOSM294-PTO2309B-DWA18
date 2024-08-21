import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import moment from "moment";
import Filters from "./Filters";
import React from "react";
import ShowCard from "./ShowCard";
import genres from "./api/genres";
import Hero from "./Hero";
import PropTypes from "prop-types";
import Fuse from "fuse.js";

const getGenreTitles = (podcastGenres, allGenres) => {
  return podcastGenres
    .map((genreId) => {
      const genre = allGenres.find((g) => g.id === genreId);
      return genre ? genre.title : "Unknown Genre";
    })
    .join(", ");
};

export default function MainContent({ podcasts, session }) {
  const [showCardOverlay, setShowCardOverlay] = React.useState(false);
  const [selectedPodcast, setSelectedPodcast] = React.useState(null);
  const [sortingOptions, setSortingOptions] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredPodcasts, setFilteredPodcasts] = React.useState(podcasts);

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
    // Why is sorting not updating in realtime, have to double click
    if (sortingOptionsArray.length > 0) {
      console.log(sortingOptionsArray);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedGenres, sortingOptions, podcasts]);

  React.useEffect(() => {
    if (searchTerm !== "") {
      setSelectedGenres([]);
      setSortingOptions([]);
    }
  }, [searchTerm]);
  const handleShowCardClick = (podcast) => {
    setSelectedPodcast(podcast);
    setShowCardOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowCardOverlay(false);
    setSelectedPodcast(null);
  };

  return (
    <>
      <div>
        <Hero podcasts={podcasts} handleShowCardClick={handleShowCardClick} />
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
                onClick={() => handleShowCardClick(podcast)}
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
        {showCardOverlay && (
          <ShowCard
            userId={session.user.id}
            podcast={selectedPodcast}
            onClose={handleOverlayClose}
          />
        )}
      </div>
    </>
  );
}

MainContent.propTypes = {
  podcasts: PropTypes.array.isRequired,
  session: PropTypes.object.isRequired,
};
