import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const apiKey = "f8658389b2915edf093d1cbd33cfdec9";

const MovieCard = ({ searchResults }) => {
    const [movies, setMovies] = useState([]);
    const [moviePage, setMoviePage] = useState(1);

    // Fetch popular movies only if there are no search results
    useEffect(() => {
        if (!searchResults.length) {
            fetchPopularMovies();
        } else {
            setMovies(searchResults);
        }
    }, [moviePage, searchResults]);

    const fetchPopularMovies = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${moviePage}`
            );
            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    };

    const prevSlide = () => {
        if (moviePage > 1) setMoviePage(moviePage - 1);
    };

    const nextSlide = () => {
        setMoviePage(moviePage + 1);
    };

    return (
        <div className="p-6">
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-6">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        to={`/movieInfo/${movie.id}`}
                        className="card bg-white text-black rounded-lg p-4 shadow-md hover:transform hover:scale-105 transition-transform"
                    >
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/500"
                            }
                            alt={movie.title}
                            className="w-full rounded-lg transition-transform"
                        />
                        <h3 className="mt-4 font-bold">{movie.title}</h3>
                        <h3 className="text-sm text-gray-600">{movie.release_date}</h3>
                        <h3 className="text-sm text-gray-600">{movie.vote_average}</h3>
                        <p className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 text-white flex items-center justify-center p-5 opacity-0 hover:opacity-100 transition-opacity rounded-lg overflow-y-auto">
                            {movie.overview}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Pagination (Only for Popular Movies) */}
            {!searchResults.length && (
                <div className="flex justify-between">
                    <button
                        onClick={prevSlide}
                        className="prev fixed top-1/2 left-5 transform -translate-y-1/2 bg-white text-black text-lg py-2 px-4 rounded-full shadow-md transition-transform hover:transform hover:scale-110"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={nextSlide}
                        className="next fixed top-1/2 right-5 transform -translate-y-1/2 bg-white text-black text-lg py-2 px-4 rounded-full shadow-md transition-transform hover:transform hover:scale-110"
                    >
                        &#10095;
                    </button>
                </div>
            )}

            {/* Show Page Number (Only for Popular Movies) */}
            {!searchResults.length && (
                <p className="moviePage fixed bottom-5 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-70 text-lg font-bold py-2 px-4 rounded shadow-md">
                    {moviePage}
                </p>
            )}
        </div>
    );
};
export default MovieCard;
