import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import React from "react";
import genres from "./api/genres";
import PropTypes from "prop-types";
// import { addFavorite, removeFavorite } from "./database/favourites";

function getGenreTitles(podcastGenres, allGenres) {
  return podcastGenres
    .map((genreId) => {
      const genre = allGenres.find((g) => g.id === genreId);
      return genre ? genre.title : "Unknown Genre";
    })
    .join(", ");
}

export default function ShowCard({ podcast, onClose, userId }) {
  const [podcastData, setPodcastData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  const selectedValue = React.useMemo(
    () =>
      Array.from(selectedKeys)
        .map((key) => `Season ${key}`)
        .join(", "),

    [selectedKeys]
  );

  React.useEffect(() => {
    if (podcast && podcast.id) {
      fetchSinglePodcast(podcast.id).then((data) => {
        setPodcastData(data);
        setLoading(false);
        if (data.seasons.length > 0) {
          setSelectedKeys(new Set([`${1}`]));
        }
      });
    }
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [podcast]);

  if (!podcast) return null;

  if (loading)
    return <CircularProgress className="page-loading" label="Loading..." />;

  if (!podcastData) return <p>Failed to load podcast details.</p>;

  const maxDescriptionLength = 350;
  const isTruncated = podcastData.description.length > maxDescriptionLength;
  const truncatedDescription =
    podcastData.description.substring(0, maxDescriptionLength) + "...";

  return (
    <div className="show-card">
      <Card className="show-card-overlay">
        <CardHeader className="show-card-header">
          <Button onClick={onClose} isIconOnly className="close-button">
            X
          </Button>
          <h4 className="font-bold text-large">{podcastData.title}</h4>{" "}
          <p className="text-tiny uppercase font-bold">
            {getGenreTitles(podcast.genres, genres)}
          </p>
          <small className="text-default-500">
            Seasons: {podcastData.seasons.length}
          </small>
        </CardHeader>
        <CardBody className="show-card-body">
          <section className="show-card-body-image">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={podcastData.image}
              width={270}
            />
            <div className="show-card-description">
              <p className="text-tiny uppercase font-bold">Description</p>
              <p className="text-default-500">
                {showFullDescription || !isTruncated
                  ? podcastData.description
                  : truncatedDescription}
              </p>
              {isTruncated && (
                <Button
                  size="sm"
                  auto
                  light
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="show-more-button"
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>
          </section>
          <section>
            <Dropdown className="show-card-seasons">
              <DropdownTrigger variant="bordered">
                <Button>{selectedValue}</Button>
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
                  <DropdownItem key={index + 1}>{`Season ${
                    index + 1
                  }`}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Accordion>
              <AccordionItem key="1" aria-label="Episode 1" title="Episode 1">
                <Button> --</Button>
              </AccordionItem>
            </Accordion>
          </section>
        </CardBody>
      </Card>
    </div>
  );
}

ShowCard.propTypes = {
  podcast: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
