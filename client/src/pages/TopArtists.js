import { useState, useEffect } from "react";
import { getTopArtists } from "../spotify";
import { catchErrors } from "../utils";
import { ArtistGrid, SectionWrapper, TimeRangeButtons, Loader } from "../components";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtists.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);


  return (
    <main>
      
      {topArtists && topArtists.items ? (
        <SectionWrapper title="Top artists" breadcrumb="true">
          <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange} />
          <ArtistGrid artists={topArtists.items.slice(0, 20)} />
        </SectionWrapper>
      ) : <Loader />}
    </main>
  );
};

export default TopArtists;
