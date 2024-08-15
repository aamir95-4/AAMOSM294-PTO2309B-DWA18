import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Accordion,
  AccordionItem,
  Button,
} from "@nextui-org/react";

export default function App() {
  return (
    <Card className="show-card">
      <CardHeader className="show-card-header">
        <Button isIconOnly className="close-button">
          X
        </Button>
        <h4 className="font-bold text-large">Podcast Name</h4>{" "}
        <p className="text-tiny uppercase font-bold">Genre</p>
        <small className="text-default-500">No of Seasons</small>
      </CardHeader>
      <CardBody className="show-card-body">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://nextui.org/images/hero-card-complete.jpeg"
          width={270}
        />
        <Accordion variant="shadow">
          <AccordionItem key="1" aria-label="Accordion 1" title="Season 1">
            Episodes
          </AccordionItem>
          <AccordionItem key="2" aria-label="Accordion 2" title="Season 2">
            Episodes
          </AccordionItem>
          <AccordionItem key="3" aria-label="Accordion 3" title="Season 3">
            Episodes
          </AccordionItem>
          <AccordionItem key="4" aria-label="Accordion 3" title="Season 4">
            Episodes
          </AccordionItem>
          <AccordionItem key="5" aria-label="Accordion 3" title="Season 5">
            Episodes
          </AccordionItem>
          <AccordionItem key="6" aria-label="Accordion 3" title="Season 6">
            Episodes
          </AccordionItem>
          <AccordionItem key="7" aria-label="Accordion 3" title="Season 7">
            Episodes
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
}
