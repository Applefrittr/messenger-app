import { useState, useEffect } from "react";
import URL from "../API/apiURL";

function useLinkify(text) {
  const [parsedText, setParsedText] = useState();

  const re = /\bhttps?::?\/\/\S+/gi;
  const urls = [...text.matchAll(re)].flat(1);

  useEffect(() => {
    if (urls.length === 0) setParsedText(text);
    else {
      const urlPromises = urls.map(async (url) => {
        const request = await fetch(`${URL}/fetchURL`, {
          mode: "cors",
          method: "Post",
          body: JSON.stringify({ url }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        return response.title;
      });

      Promise.all(urlPromises).then((values) => {
        let parsedText = text;
        values.forEach((value) => {
          parsedText = parsedText.replace(/\bhttps?::?\/\/\S+/i, value);
        });
        setParsedText(parsedText);
      });
    }
  });

  return parsedText;
}

export default useLinkify;
