const fetchSinglePodcast = async (id) => {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch podcast with ID ${id}: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching podcast:", error);
  }
};

export default fetchSinglePodcast;
