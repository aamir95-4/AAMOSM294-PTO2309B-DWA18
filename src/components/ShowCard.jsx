import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Accordion,
  AccordionItem,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import React from "react";
import genres from "./api/genres";

function getGenreTitles(podcastGenres, allGenres) {
  return podcastGenres
    .map((genreId) => {
      const genre = allGenres.find((g) => g.id === genreId);
      return genre ? genre.title : "Unknown Genre";
    })
    .join(", ");
}

export default function ShowCard({ podcast, onClose }) {
  const [podcastData, setPodcastData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  React.useEffect(() => {
    if (podcast && podcast.id) {
      fetchSinglePodcast(podcast.id).then((data) => {
        setPodcastData(data);
        setLoading(false);
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

          <Accordion className="show-card-seasons" variant="shadow">
            {podcastData.seasons.map((season, index) => (
              <AccordionItem
                key={index}
                aria-label={`Accordion ${index + 1}`}
                title={`Season ${index + 1}`}
              >
                Episodes
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}
