import React from "react";
import { CircularProgress } from "@nextui-org/react";
import "./App.css";
import Header from "./components/Header";
import MediaPlayer from "./components/MediaPlayer";
import MainContent from "./components/MainContent";
import { supabase } from "./components/database/supabase";
function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [podcasts, setPodcasts] = React.useState([]);
  const [isPLaying, setIsPlaying] = React.useState(false);
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
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
      <Header session={session} setSession={setSession} />
      <MainContent
        session={session}
        podcasts={podcasts}
        isPLaying={isPLaying}
        setIsPlaying={setIsPlaying}
      />
      {isPLaying && <MediaPlayer />}
    </>
  );
}

export default App;
