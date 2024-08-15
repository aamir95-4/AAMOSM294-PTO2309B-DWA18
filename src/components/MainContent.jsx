import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import moment from "moment";
import Filters from "./Filters";

export default function MainContent(props) {
  return (
    <div className="main-content">
      <div className="filters-container">
        <Filters />
      </div>
      <div className="grid-container">
        {props.podcasts.map((podcast) => (
          <div className="grid-item" key={podcast.id}>
            <Card className="pod-card" isPressable>
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
    </div>
  );
}
