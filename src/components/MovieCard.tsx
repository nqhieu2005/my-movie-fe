import { Link } from "react-router-dom";

interface Movie {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105">
      <Link to={`/movies/${movie.slug}`}>
        <div className="relative w-full h-72 md:h-80">
          <img
            src={movie.poster_url}
            alt={movie.name}
            className="w-full h-full object-cover"
          ></img>
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-white text-lg font-semibold truncate">
          {movie.name}
        </h3>
        <p className="text-gray-400 text-sm mt-1">Năm: {movie.year}</p>
      </div>
    </div>
  );
};
export default MovieCard;
