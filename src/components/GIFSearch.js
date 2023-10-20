import { useEffect, useRef, useState } from "react";
import GIPHY from "../assets/GIPHY.png";

function GIFSearch(props) {
  const [GIFs, setGIFs] = useState([]);
  const ref = useRef();
  const queryRef = useRef();

  // API call to backend to retrieve Giphy API key then call the Giphy API with the search parameter input into the search field
  const getGifs = async (e) => {
    e.preventDefault();
    // make a placeholder array to be rendered while fetch requests process
    const placeholder = GIFs.map((gif) => "");
    setGIFs(placeholder);

    const requestAPI = await fetch("http://localhost:5000/giphyAPI", {
      mode: "cors",
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    const responseAPI = await requestAPI.json();

    const query = queryRef.current.value;
    const queryEncoded = encodeURIComponent(query);

    console.log(query, queryEncoded);

    const requestGifs = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${responseAPI}&q=${queryEncoded}s&limit=50&lang=en`,
      {
        mode: "cors",
      }
    );

    const responseGifs = await requestGifs.json();

    console.log(responseGifs);

    // map out an array of urls fromt eh Giphy API reponse json
    setGIFs(
      responseGifs.data.map((obj) => {
        return obj.images.original.url;
      })
    );
  };

  // Select the Gif to be rendered in the parent component and then close the modal/tool
  const selectGif = (e) => {
    console.log(e.target.src);
    props.renderGif(e.target.src);
    props.toggleModal();
  };

  // fade in effect of the tool on component render
  useEffect(() => {
    setTimeout(() => {
      ref.current.classList.add("toggle-gif-container");
    }, 0);
  }, []);

  return (
    <section className="gif-search-container" ref={ref}>
      <form className="gif-search-form">
        <img src={GIPHY} alt="Powered by GIPHY" className="GIPHY-attrib" />
        <div className="gif-btns">
          <input
            name="gif-search"
            placeholder="Search GIPHY..."
            ref={queryRef}
          ></input>
          <button type="submit" onClick={getGifs}>
            Search
          </button>
        </div>
        <p type="button" onClick={props.toggleModal} className="close">
          <b>X</b>
        </p>
        <div className="gif-results">
          {GIFs &&
            GIFs.map((GIF, i) => {
              return (
                <img
                  src={GIF}
                  alt="Loading..."
                  key={i}
                  className="gif-container"
                  onClick={selectGif}
                ></img>
              );
            })}
        </div>
      </form>
    </section>
  );
}

export default GIFSearch;
