import React from "react";
import { CircularProgress } from "@nextui-org/react";
import "./App.css";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import { supabase } from "./components/database/supabase";
import {
  fetchFavourites,
  createFavouritesTable,
} from "./components/database/favourites";
import { loadProgress } from "./components/database/progress";

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [podcasts, setPodcasts] = React.useState([]);
  const [isPlayerOpen, setIsPlayerOpen] = React.useState(false);
  const [session, setSession] = React.useState(null);
  const [userFavourites, setUserFavourites] = React.useState([]);
  const [favouritesUpdated, setFavouritesUpdated] = React.useState(false);
  const [showProgress, setShowProgress] = React.useState({});
  const [progressUpdated, setProgressUpdated] = React.useState(false);
  const [episodePlaying, setEpisodePlaying] = React.useState({
    podcastId: "",
    podcastTitle: "",
    seasonNumber: "",
    episodeTitle: "",
    episodeFile: "",
  });

  React.useEffect(() => {
    const storedSession = localStorage.getItem("supabaseSession");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          localStorage.setItem("supabaseSession", JSON.stringify(session));
        }
      });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.setItem("supabaseSession", JSON.stringify(session));
      } else {
        localStorage.removeItem("supabaseSession");
      }
    });
  }, []);
  /*
  Set loading to wait 3 seconds before showing the page
  */
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (session) {
      try {
        fetchFavourites(session.user.id).then((data) => {
          setUserFavourites(data);
          setFavouritesUpdated(false);
        });
      } catch (error) {
        console.error("Failed to fetch favourites:", error);
      }
    }

    if (session && userFavourites.length === 0) {
      createFavouritesTable(session.user.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, favouritesUpdated]);

  React.useEffect(() => {
    if (session) {
      loadProgress(session.user.id).then((data) => {
        setShowProgress(data);
      });
    }

    setProgressUpdated(false);
  }, [session, progressUpdated]);

  React.useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  if (isLoading) {
    return <CircularProgress className="page-loading" label="Loading..." />;
  }

  return (
    <>
      <Header session={session} setSession={setSession} />
      <MainContent
        session={session}
        podcasts={podcasts}
        isPlayerOpen={isPlayerOpen}
        setIsPlayerOpen={setIsPlayerOpen}
        userFavourites={userFavourites}
        episodePlaying={episodePlaying}
        setEpisodePlaying={setEpisodePlaying}
        setFavouritesUpdated={setFavouritesUpdated}
        showProgress={showProgress}
        setShowProgress={setShowProgress}
        setProgressUpdated={setProgressUpdated}
      />

      <Footer />
    </>
  );
}

export default App;
