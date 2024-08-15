import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import moment from "moment";
import Filters from "./Filters";
import React from "react";
import ShowCard from "./ShowCard";

export default function MainContent(props) {
  const [showCardOverlay, setShowCardOverlay] = React.useState(false);
  const [selectedPodcast, setSelectedPodcast] = React.useState(null);
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
        <Filters />
      </div>
      <div className="grid-container">
        {props.podcasts.map((podcast) => (
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
