import React from "react";
import { CircularProgress } from "@nextui-org/react";
import "./App.css";
import Hero from "./components/Hero";
import Header from "./components/Header";
import MediaPlayer from "./components/MediaPlayer";
import MainContent from "./components/MainContent";

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [podcasts, setPodcasts] = React.useState([]);
  const [isPLaying, setIsPlaying] = React.useState(false);

  /*
  Set loading to wait 3 seconds before showing the page
  */
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  React.useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  // if (isLoading) {
  //   return <CircularProgress className="page-loading" label="Loading..." />;
  // }

  return (
    <>
      <Header />
      <Hero podcasts={podcasts} />
      <MainContent podcasts={podcasts} />
      {isPLaying && <MediaPlayer />}
    </>
  );
}

export default App;
