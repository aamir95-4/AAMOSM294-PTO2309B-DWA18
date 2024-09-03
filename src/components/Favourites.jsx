import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Accordion,
  AccordionItem,
  CircularProgress,
} from "@nextui-org/react";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import React from "react";
import PropTypes from "prop-types";

export default function Favourites({
  session,
  podcasts,
  userFavourites,
  handleCardClick,
}) {
  const [favouritePodcastShows, setFavouritePodcastShows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const episodeTitlesSet = React.useMemo(() => {
    return new Set((userFavourites[0] && userFavourites[0].podcastarray) || []);
  }, [userFavourites]);

  const podcastArray = async (episodeTitlesSet) => {
    const podcastIdArray = podcasts.map((podcast) => podcast.id);

    const fetchPromises = podcastIdArray.map((podcastId) =>
      fetchSinglePodcast(podcastId)
    );

    try {
      const podcastsData = await Promise.all(fetchPromises);

      const matchingPodcastIds = podcastsData.filter((podcast) =>
        podcast.seasons.some((season) =>
          season.episodes.some((episode) => episodeTitlesSet.has(episode.title))
        )
      );

      return matchingPodcastIds;
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await podcastArray(episodeTitlesSet);
      setFavouritePodcastShows(data);
      setLoading(false);
    };

    fetchData();
  }, [podcasts, userFavourites, episodeTitlesSet]);

  if (loading)
    return <CircularProgress className="page-loading" label="Loading..." />;

  return (
    <>
      <div className="page-title">
        <h1 className="text-default-500 font-bold text-3xl">Favourites</h1>
      </div>
      {!session && (
        <div className="favourites-container">
          <p className="text-default-500">
            Please log in or sign up to see your favourites
          </p>
        </div>
      )}

      {session && (
        <div className="favourites-container">
          {favouritePodcastShows.map((podcast) => (
            <Card key={podcast.id} isBlurred className="favourites-card">
              <CardHeader className="flex gap-3">
                <Image
                  alt={podcast.title}
                  height={40}
                  radius="sm"
                  src={podcast.image || "https://via.placeholder.com/40"}
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md font-bold">{podcast.title}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <Accordion>
                  {podcast.seasons.map((season, seasonIndex) => {
                    const episodesInSeason = season.episodes.filter((episode) =>
                      episodeTitlesSet.has(episode.title)
                    );

                    if (episodesInSeason.length === 0) return null;

                    return (
                      <AccordionItem
                        key={seasonIndex}
                        aria-label={`Season ${seasonIndex + 1}`}
                        title={`Season ${seasonIndex + 1}`}
                      >
                        <Accordion variant="shadow">
                          {episodesInSeason.map((episode, episodeIndex) => (
                            <AccordionItem
                              key={episodeIndex}
                              aria-label={`Episode ${episodeIndex + 1}`}
                              title={episode.title}
                            >
                              {/* Add player or details for each episode */}
                              Play, pause, progress
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link href="#" onClick={() => handleCardClick(podcast)}>
                  View full show
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

Favourites.propTypes = {
  session: PropTypes.object.isRequired,
  podcasts: PropTypes.array.isRequired,
  userFavourites: PropTypes.array,
  handleCardClick: PropTypes.func,
};
