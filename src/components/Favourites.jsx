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
  Button,
  Input,
} from "@nextui-org/react";
import fetchSinglePodcast from "./api/fetchSinglePodcast";
import React from "react";
import PropTypes from "prop-types";
import { removeFavourite, fetchFavourites } from "./database/favourites";
import moment from "moment";

import { IconContext } from "react-icons";
import { BiShare, BiClipboard } from "react-icons/bi";

export default function Favourites({
  session,
  podcasts,
  userFavourites,
  handleCardClick,
  setIsPlayerOpen,
  setEpisodePlaying,
  setFavouritesUpdated,
  sortingOptions,
}) {
  const [favouritePodcastShows, setFavouritePodcastShows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [shareUrl, setShareUrl] = React.useState("");

  const sharedUserId = React.useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
  }, []);

  const isSharedView = Boolean(
    sharedUserId && sharedUserId !== session?.user?.id
  );

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
      let favourites;
      if (isSharedView) {
        // Fetch favourites for shared view
        favourites = await fetchFavourites(sharedUserId);
      } else if (session) {
        // Use current user's favourites
        favourites = userFavourites;
      } else {
        // No userId in URL and no session, show empty state
        setLoading(false);
        return;
      }

      const episodeTitlesSet = new Set(
        (favourites[0] && favourites[0].podcastarray) || []
      );
      const data = await podcastArray(episodeTitlesSet);
      setFavouritePodcastShows(data);
      setLoading(false);
    };

    fetchData();
  }, [podcasts, userFavourites, sharedUserId, session, isSharedView]);

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

  const sortedFavouritePodcasts = React.useMemo(() => {
    if (!favouritePodcastShows) return [];

    let sorted = [...favouritePodcastShows];

    if (sortingOptions === "Newest") {
      sorted.sort((a, b) => moment(b.updated).diff(moment(a.updated)));
    } else if (sortingOptions === "Oldest") {
      sorted.sort((a, b) => moment(a.updated).diff(moment(b.updated)));
    } else if (sortingOptions === "A-Z") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortingOptions === "Z-A") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    return sorted;
  }, [favouritePodcastShows, sortingOptions]);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const newShareUrl = `${baseUrl}/favourites?userId=${session.user.id}`;
    setShareUrl(newShareUrl);
  };

  const copyShareUrl = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Share URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  if (loading)
    return <CircularProgress className="page-loading" label="Loading..." />;

  return (
    <>
      <div className="page-title">
        <h1 className="text-default-500 font-bold text-3xl">
          {isSharedView ? "Shared Favourites" : "My Favourites"}
        </h1>
      </div>
      {!session && !isSharedView && (
        <div className="favourites-container">
          <p className="text-default-500">
            Please log in or sign up to see your favourites
          </p>
        </div>
      )}

      {(session || isSharedView) && (
        <div className="favourites-container">
          {!isSharedView && session && (
            <div className="share-favourites">
              <Button isIconOnly onClick={generateShareUrl} className="mr-2">
                <IconContext.Provider value={{ color: "black", size: "1.5em" }}>
                  <BiShare />
                </IconContext.Provider>
              </Button>
              {shareUrl && (
                <>
                  <Button isIconOnly onClick={copyShareUrl}>
                    <IconContext.Provider
                      value={{ color: "black", size: "1.5em" }}
                    >
                      <BiClipboard />
                    </IconContext.Provider>
                  </Button>
                  <Input className=" share-url" value={shareUrl} readOnly />
                </>
              )}
            </div>
          )}
          {sortedFavouritePodcasts.map((podcast) => (
            <Card key={podcast.id} isBlurred className="favourites-card">
              <CardHeader className="flex gap-3">
                <Image
                  alt={podcast.title}
                  height={40}
                  radius="sm"
                  src={podcast.image}
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
                              <div className="favourites-buttons">
                                <Button
                                  aria-label={`Play episode: ${episode.title}`}
                                  size="sm"
                                  color="primary"
                                  onClick={() =>
                                    playEpisode(
                                      podcast.id,
                                      podcast.title,
                                      seasonIndex + 1,
                                      episode.title,
                                      episode.file
                                    )
                                  }
                                >
                                  Listen Now
                                </Button>
                                {!isSharedView && session && (
                                  <Button
                                    aria-label={`Remove ${episode.title} from favourites`}
                                    size="sm"
                                    color="danger"
                                    onClick={() =>
                                      removeFavourite(
                                        session.user.id,
                                        episode.title,
                                        setFavouritesUpdated
                                      )
                                    }
                                  >
                                    Remove From Favourites
                                  </Button>
                                )}
                              </div>
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
  session: PropTypes.object,
  podcasts: PropTypes.array.isRequired,
  userFavourites: PropTypes.array,
  handleCardClick: PropTypes.func,
  setIsPlayerOpen: PropTypes.func,
  setEpisodePlaying: PropTypes.func,
  setFavouritesUpdated: PropTypes.func,
  sortingOptions: PropTypes.string,
};
