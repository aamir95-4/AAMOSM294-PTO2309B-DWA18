import React from "react";
import "./App.css";
import Hero from "./components/Hero";
import Header from "./components/Header";
// import MediaPlayer from "./components/MediaPlayer";
import MainContent from "./components/MainContent";
function App() {
  const [podcasts, setPodcasts] = React.useState([]);

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

  return (
    <>
      <Header />
      <Hero podcasts={podcasts} />
      <MainContent podcasts={podcasts} />
      {/* <MediaPlayer /> */}
    </>
  );
}

export default App;
