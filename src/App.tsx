import { useState, useEffect, useRef } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Container, Grid, Card, IconButton, Skeleton } from "@mui/material";
import "./App.css";

const gf = new GiphyFetch("FwHzuNcpIiVH2u9qiOq7eOtA06eLpvI3");

const Gif = ({ url }: { url: string }) => {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <Grid item xs={12} sm={6} md={4} style={{}}>
      <Card
        elevation={5}
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {!isLoaded && (
          <Skeleton
            animation='wave'
            variant='rectangular'
            height={180}
            sx={{ width: "100%" }}
          />
        )}
        <img
          src={url}
          height='180'
          alt='test'
          onLoad={() => setLoaded(true)}
          style={{ display: !isLoaded ? "none" : "block" }}
        />
      </Card>
    </Grid>
  );
};

function App() {
  const [preservedData, setPreservedData] = useState<IGif[] | null>(null);
  const [gifs, setGifs] = useState<IGif[] | null>(null);
  const [limit, setLimit] = useState<number>(12);
  const [offset, setOffset] = useState<number>(0);
  const [isQuerying, setQuerying] = useState<boolean>(false);
  const intervalRef = useRef<any>();

  const fetchGifs = async (offset: number) => {
    const { data } = await gf.trending({ offset, limit, type: "gifs" });
    // console.log(data);
    setGifs(data);
    setPreservedData(data);
  };

  const searchGifs = async (query: string) => {
    if (query === "") {
      setGifs(preservedData);
      setQuerying(false);
      return;
    }
    setQuerying(true);
    const { data } = await gf.search(query, {
      sort: "relevant",
      lang: "en",
      limit: 12,
      type: "gifs",
    });
    // console.log(data);
    setGifs(data);
  };

  useEffect(() => {
    if (isQuerying) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      fetchGifs(0);
    }, 5000);
  }, [isQuerying]);

  return (
    <Container sx={{ paddingTop: "50px", paddingBottom: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <input
          placeholder='Search...'
          style={{ width: "300px", padding: "10px", fontSize: 20 }}
          onChange={(e) => searchGifs(e.target.value)}
        />
      </div>

      <Grid container spacing={3}>
        {gifs?.map((item) => (
          <Gif key={item.id} url={item.images.original.url} />
        ))}
        <Grid item xs={6}>
          {offset > 0 && (
            <IconButton
              onClick={() => {
                fetchGifs(offset - 12);
                setOffset((prev) => prev - 12);
              }}
            >
              <img
                src='https://s2.svgbox.net/materialui.svg?ic=arrow_back_ios&color=000'
                width='32'
                height='32'
                alt='arrow-back'
              />
            </IconButton>
          )}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {!isQuerying && (
            <IconButton
              onClick={() => {
                fetchGifs(offset + 12);
                setOffset((prev) => prev + 12);
              }}
            >
              <img
                src='https://s2.svgbox.net/materialui.svg?ic=arrow_forward_ios&color=000'
                width='32'
                height='32'
                alt='arrow-forward'
              />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
