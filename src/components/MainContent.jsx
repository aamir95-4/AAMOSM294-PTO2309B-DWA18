import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import moment from "moment";
import Filters from "./Filters";
import React from "react";
import ShowCard from "./ShowCard";

export default function MainContent({ podcasts }) {
  const [showCardOverlay, setShowCardOverlay] = React.useState(false);
  const [selectedPodcast, setSelectedPodcast] = React.useState(null);
  const [sortingOptions, setSortingOptions] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const shownPodcasts = React.useMemo(() => {
    if (selectedGenres.length === 0 && sortingOptions.length === 0) {
      if (searchTerm === "") {
        return podcasts;
      } else {
        return podcasts.filter((podcast) => {
          const searchFields = `${podcast.title.toLowerCase()}`;
          return searchFields.includes(searchTerm.toLowerCase());
        });
      }
    }
    if (selectedGenres.length !== 0)
      return podcasts.filter((podcast) => {
        const podcastGenre = podcast.genres.map((val) => val);
        const numberArray = Array.from(selectedGenres).map(Number);
        if (numberArray.length === 0) {
          return podcasts;
        } else return numberArray.some((genre) => podcastGenre.includes(genre));
      });
  }, [podcasts, selectedGenres, searchTerm, sortingOptions]);
  const handleShowCardClick = (podcast) => {
    setSelectedPodcast(podcast);
    setShowCardOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowCardOverlay(false);
    setSelectedPodcast(null);
  };

  return (
    <div className="main-content">
      <div className="filters-container">
        <Filters
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          sortingOptions={sortingOptions}
          setSortingOptions={setSortingOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="grid-container">
        {shownPodcasts.map((podcast) => (
          <div className="grid-item" key={podcast.id}>
            <Card
              className="pod-card"
              isPressable
              onClick={() => handleShowCardClick(podcast)}
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">{podcast.title}</p>
                <small className="text-default-500">
                  Seasons: {podcast.seasons}
                </small>
                <small className="text-default-500">
                  Updated: {moment(podcast.updated).format("D MMMM YYYY")}
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
        <ShowCard podcast={selectedPodcast} onClose={handleOverlayClose} />
      )}
    </div>
  );
}
