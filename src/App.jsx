import React, { useEffect, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";

export const API_KEY = "a9118a3a";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
  width: 100%;
  box-sizing: border-box;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 6px;
  width: 50%;
  background-color: white;
  align-items: center;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
  width: 100%;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  font-size: 24px;
  font-weight: 500;
  color: black;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState(null);
  const [timeoutId, updateTimeoutId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defaultMovies, setDefaultMovies] = useState([]);

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  const fetchDefaultMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.get(
        `https://www.omdbapi.com/?s=batman&apikey=${API_KEY}`
      );
      if (response.data.Error) {
        setError(response.data.Error);
      } else {
        updateMovieList(response.data.Search);
        setDefaultMovies(response.data.Search);
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    }
    setLoading(false);
  };

  const fetchData = async (searchString) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.get(
        `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`
      );
      if (response.data.Error) {
        setError(response.data.Error);
      } else {
        updateMovieList(response.data.Search);
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    }
    setLoading(false);
  };

  const onTextChange = (e) => {
    onMovieSelect(null);
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    if (e.target.value) {
      const timeout = setTimeout(() => fetchData(e.target.value), 500);
      updateTimeoutId(timeout);
    } else {
      updateMovieList(defaultMovies);
    }
  };

  return (
    <Container>
      <Header>
        <AppName>
          {/* <MovieImage src="/react-movie-app/movie-icon.svg" /> */}
          React Movie App
        </AppName>
        <SearchBox>
          {/* <SearchIcon src="/react-movie-app/search-icon.svg" /> */}
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {selectedMovie && (
        <MovieInfoComponent
          selectedMovie={selectedMovie}
          onMovieSelect={onMovieSelect}
        />
      )}
      <MovieListContainer>
        {loading ? (
          <Loading>Loading...</Loading>
        ) : error ? (
          <Loading>{error}</Loading>
        ) : movieList.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/react-movie-app/movie-icon.svg" />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;
