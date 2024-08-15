const fetchSinglePodcast = async (id) => {
  try {
    const respons = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    const data = await respons.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default fetchSinglePodcast;
