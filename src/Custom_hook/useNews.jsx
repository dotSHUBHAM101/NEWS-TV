import { useEffect, useState } from 'react'

function useNews(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return;

    // 1. CLEAR OLD DATA IMMEDIATELY
    // This forces the UI to stop showing "US" news while "India" loads
    setData(null); 
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]); // This detects the change in your console logs

  return { data, loading, error };
}

export default useNews;