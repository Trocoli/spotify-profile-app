import { useState, useEffect } from "react";
import { GlobalStyle } from "./styles";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist } from './pages';
import styled from 'styled-components/macro';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

const StyledLogoudBtn = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;



function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className='app'>
      <GlobalStyle />
      {!token ? (
        <Login />
      ) : (
        <>
        <StyledLogoudBtn onClick={logout}>Log out</StyledLogoudBtn>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/top-artists" element={<TopArtists />}/>
            <Route path="/top-tracks" element={<TopTracks />} />
            <Route path="/playlists/:id" element={<Playlist />} />
            <Route path="/playlists" element={<Playlists />}/>
            <Route exact path="/" element={<Profile />} />
          </Routes>
        </Router></>
      )}
    </div>
  );
}

export default App;
