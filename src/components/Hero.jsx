import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function Hero(props) {
  const [slides, setSlides] = React.useState([]);

  React.useEffect(() => {
    function getRandomItems(arr, numItems) {
      const result = [];
      const usedIndices = new Set();

      if (arr.length <= numItems) return arr;

      while (result.length < numItems) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        if (!usedIndices.has(randomIndex)) {
          result.push(arr[randomIndex]);
          usedIndices.add(randomIndex);
        }
      }

      return result;
    }

    const randomSlides = getRandomItems(props.podcasts, 3);
    setSlides(randomSlides);
  }, [props.podcasts]);

  return (
    <div className="hero-carousel">
      {slides.map((slide) => (
        <Card
          className="hero-card h-[300px] w-full"
          radius="none"
          key={slide.id}
        >
          <Image
            removeWrapper
            alt={slide.title}
            radius="none"
            className="z-0 w-full h-full object-cover"
            src={slide.image}
          />
          <CardFooter className="justify-between bg-black/60 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{slide.title}</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
              Listen Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
