import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw Error("Error occured while fetching");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          //   console.log(data);
          setError(null);
          setIsPending(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsPending(false);
        });
    }, 1000);
  }, [url]);

  return { data, isPending, error };
};
