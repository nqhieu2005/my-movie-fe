import { Link } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";

interface Movie {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year: number;
  tmdb: {
    vote_average: number;
    vote_count: number;
  }
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      <Link to={`/movies/${movie.slug}`}>
        <div className="relative w-full h-80 overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <FaPlay className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Year badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {movie.year}
          </div>

          {/* Rating stars */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-white text-xs font-medium">{movie.tmdb.vote_average}</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <h3 className="text-white text-lg font-semibold truncate group-hover:text-blue-400 transition-colors duration-300">
          {movie.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-white/60 text-sm">Năm: {movie.year}</p>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-white/80 text-xs">{movie.tmdb.vote_count}</span>
          </div>
        </div>
        
        {/* Hover effect line */}
        <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 mt-3"></div>
      </div>
    </div>
  );
};

export default MovieCard;
