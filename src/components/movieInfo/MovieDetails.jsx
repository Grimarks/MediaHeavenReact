import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../navbar/Navbar.jsx';
import Footer from '../footer/footer.jsx';

const MovieDetails = () => {
    const { id } = useParams(); // Get the movie ID from the URL
    const [movie, setMovie] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const apiKey = 'f8658389b2915edf093d1cbd33cfdec9';
            if (id) {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
                    if (!response.ok) throw new Error('Failed to fetch movie details');

                    const movieData = await response.json();
                    setMovie(movieData);
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            } else {
                console.error('No movie ID in URL');
            }
        };

        fetchMovieDetails();
    }, [id]); // Add id as a dependency

    const addToWishlist = (id_movie) => {
        const username = localStorage.getItem('username');
        if (!username) {
            alert('You must be logged in to add movies to your wishlist.');
            return;
        }

        fetch('http://localhost:3001/add-to-wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_movie, username }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to add movie to wishlist');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'Error adding movie to wishlist.');
            });
    };

    return (
        <div>
            <Nav></Nav>

            <main className="container mx-auto bg-white p-10 rounded-lg shadow-md w-[80%] mt-20">
                <div className="product flex items-start justify-between">
                    {/* Image Section */}
                    <div className="image relative w-1/3">
                        <img
                            src={movie ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.png'}
                            alt="Movie Poster"
                            className="rounded-lg"
                        />
                        <div
                            className="favorite absolute top-2 right-2 text-xl cursor-pointer"
                            aria-label="Add to favorites"
                            onClick={toggleFavorite}
                        >
                            {isFavorite ? '💔' : '❤️'}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="details w-2/3 text-black ml-5">
                        <h1 className="text-2xl font-bold">{movie ? movie.title : 'Loading Movie Title...'}</h1>
                        <span className="tag text-gray-500 block mt-2">
        {movie ? `Genre: ${movie.genres.map(genre => genre.name).join(', ')}` : 'Genre: Loading...'}
      </span>
                        <p className="description mt-3 text-sm">
                            {movie ? movie.overview : 'Loading movie description...'}
                        </p>
                        <div className="extra-info mt-5">
                            <p>
                                <strong>Release Date:</strong>{' '}
                                <span className="release-date">{movie ? movie.release_date : 'Loading...'}</span>
                            </p>
                            <p>
                                <strong>Rating:</strong>{' '}
                                <span className="rating">{movie ? movie.vote_average : 'Loading...'}</span> ★
                            </p>
                        </div>
                        <button
                            type="submit"
                            id="addToWishlist"
                            className="bg-gray-800 text-white px-5 py-2 mt-5 rounded hover:bg-gray-700"
                            onClick={() => addToWishlist(movie?.id)}
                        >
                            ADD Movie
                        </button>
                    </div>
                </div>
            </main>


            <Footer></Footer>
        </div>
    );
};

export default MovieDetails;