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
} from "@nextui-org/react";

export default function Favourites({ session }) {
  return (
    <>
      <div className="favourites-title">
        <h1 className="text-default-500 font-bold text-3xl "> Favourites</h1>
      </div>

      <div className="favourites-card">
        <Card
          isBlurred
          className=" border-none bg-background/60 dark:bg-default-100/50 max-w-[300px]"
        >
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">Podcast Title</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Accordion>
              <AccordionItem key="1" aria-label="Accordion 1" title="Season">
                <Accordion variant="shadow">
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Episode"
                  >
                    Play, pause, progress
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    title="Accordion 2"
                  >
                    Play, pause, progress
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Accordion 3"
                    title="Accordion 3"
                  >
                    Play, pause, progress
                  </AccordionItem>
                </Accordion>
              </AccordionItem>
            </Accordion>
          </CardBody>
          <Divider />
          <CardFooter>
            <Link href="#">View full show</Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
