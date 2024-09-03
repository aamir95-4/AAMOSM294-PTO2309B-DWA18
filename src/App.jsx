import React from "react";
import { CircularProgress } from "@nextui-org/react";
import "./App.css";
import Header from "./components/Header";
import MediaPlayer from "./components/MediaPlayer";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import { supabase } from "./components/database/supabase";
import { fetchFavourites } from "./components/database/favourites";
function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [podcasts, setPodcasts] = React.useState([]);
  const [isPLaying, setIsPlaying] = React.useState(false);
  const [session, setSession] = React.useState(null);
  const [userFavourites, setUserFavourites] = React.useState([]);

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
    }, 2000);
  }, []);

  React.useEffect(() => {
    if (session) {
      fetchFavourites(session.user.id).then((data) => {
        setUserFavourites(data);
      });
    }
  }, [session, userFavourites]);

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
        isPLaying={isPLaying}
        setIsPlaying={setIsPlaying}
        userFavourites={userFavourites}
      />
      {isPLaying && <MediaPlayer />}
      <Footer />
    </>
  );
}

export default App;
