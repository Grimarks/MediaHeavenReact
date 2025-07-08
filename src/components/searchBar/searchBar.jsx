import { useState } from "react";
import MovieCard from "../movieCard/movieCard.jsx";
import { Search } from "lucide-react";

const apiKey = "f8658389b2915edf093d1cbd33cfdec9";

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filter, setFilter] = useState("popular"); // Default filter

    const fetchMovies = async (query, filterType) => {
        let apiUrl = "";
        if (query) {
            apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
        } else {
            if (filterType === "popular") {
                apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
            } else if (filterType === "top_rated") {
                apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
            } else if (filterType === "new_releases") {
                apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
            }
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setSearchResults(data.results || []);
    };

    return (
        <div className="p-4">
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-6">
                {/* Search Bar (Left) */}
                <div className="flex items-center gap-2 border rounded-lg p-2 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search for a movie..."
                        className="w-full p-2 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={() => fetchMovies(searchQuery, filter)}
                        className="bg-gray-800 text-white p-2 rounded-lg"
                    >
                        <Search size={20}/>
                    </button>
                </div>

                {/* Filter Buttons (Right) */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setFilter("new_releases");
                            fetchMovies("", "new_releases");
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === "new_releases" ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                        New Releases
                    </button>

                    <button
                        onClick={() => {
                            setFilter("top_rated");
                            fetchMovies("", "top_rated");
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === "top_rated" ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                        Top Rated
                    </button>

                    <button
                        onClick={() => {
                            setFilter("popular");
                            fetchMovies("", "popular");
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === "popular" ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                        Popular
                    </button>
                </div>
            </div>

            {/* MovieCard Component - Pass search results */}
            <MovieCard searchResults={searchResults}/>
        </div>
    );
}
