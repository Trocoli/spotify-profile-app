import React from 'react'
import { useState, useEffect } from "react";
import { getTopTracks } from "../spotify";
import { catchErrors } from "../utils";
import { Tracklist, SectionWrapper, TimeRangeButtons, Loader } from "../components"

const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');
  
    useEffect(() => {
      const fetchData = async () => {
        const userTopTracks = await getTopTracks(`${activeRange}_term`);
        setTopTracks(userTopTracks.data);
      };
  
      catchErrors(fetchData());
    }, [activeRange]);
  
  
    return (
      <main>
        
        {topTracks && topTracks.items ? (
          <SectionWrapper title="Top tracks" breadcrumb="true">
            <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange} />
            <Tracklist tracks={topTracks.items} />
          </SectionWrapper>
        ) : <Loader />}
      </main>
    );
}

export default TopTracks