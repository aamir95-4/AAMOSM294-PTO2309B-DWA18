import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import moment from "moment";
import PropTypes from "prop-types";
export default function ShowAll({
  filteredPodcasts,
  handleCardClick,
  genres,
  getGenreTitles,
}) {
  return (
    <>
      <div className="page-title">
        <h1 className="text-default-500 font-bold text-3xl">All Podcasts</h1>
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
                <p className="text-tiny uppercase font-bold">{podcast.title}</p>
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
    </>
  );
}

ShowAll.propTypes = {
  filteredPodcasts: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  genres: PropTypes.array.isRequired,
  getGenreTitles: PropTypes.func.isRequired,
};
