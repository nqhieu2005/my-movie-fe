import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface MovieDetailData {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  quality: string;
  lang: string;
  episode_current: string;
  time: string;
  actor: string[];
  director: string[];
  category: { name: string; slug: string }[];
  country: { name: string; slug: string }[];
  trailer_url: string;
}

interface EpisodeData {
  name: string;
  slug: string;
  link_embed: string;
}

interface ServerData {
  server_name: string;
  server_data: EpisodeData[];
}

interface ApiResponse {
  status: boolean;
  msg: string;
  movie: MovieDetailData;
  episodes: ServerData[];
}

const MovieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movieData, setMovieData] = useState<ApiResponse | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData | null>(
    null
  );

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!slug) return;
      try {
        const response = await fetch(`http://localhost:4000/api/movies/${slug}`);
        const data: ApiResponse = await response.json();
        setMovieData(data);

        if (
          data.episodes &&
          data.episodes[0] &&
          data.episodes[0].server_data[0]
        ) {
          setSelectedEpisode(data.episodes[0].server_data[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
      }
    };
     fetchMovieDetail();
  }, [slug]);
  if (!movieData) {
    return <div className="text-white text-center p-6">Đang tải...</div>;
  }
  const { movie, episodes } = movieData;

  return(
    <div className="container mx-auto p-6 text-white">
    <div className="w-full max-w-[1280px] mx-auto aspect-video bg-black mb-6 rounded-lg overflow-hidden">
      {selectedEpisode ? (
        <iframe
          src={selectedEpisode.link_embed}
          allowFullScreen
          className="w-full h-full"
          style={{ aspectRatio: '16/9' }}
        ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Chọn một tập phim để xem
          </div>
        )}
      </div>

      <h1 className="text-4xl font-bold mb-2">{movie.name}</h1>
      <p className="text-xl text-gray-400 mb-4">{movie.origin_name} ({movie.year})</p>
      <div className="flex flex-wrap gap-4 mb-6">
        <span className="bg-gray-800 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
          {movie.quality}
        </span>
        <span className="bg-gray-800 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
          {movie.lang}
        </span>
        <span className="bg-gray-800 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
          {movie.time}
        </span>
        <span className="bg-gray-800 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
          {movie.episode_current}
        </span>
      </div>
      <p className="text-gray-300 mb-6">{movie.content}</p>

      {/* Thông tin diễn viên, đạo diễn... */}
      <div className="mb-6">
        <p><strong>Đạo diễn:</strong> {movie.director.join(', ')}</p>
        <p><strong>Diễn viên:</strong> {movie.actor.join(', ')}</p>
        <p><strong>Thể loại:</strong> {movie.category.map(cat => cat.name).join(', ')}</p>
        <p><strong>Quốc gia:</strong> {movie.country.map(coun => coun.name).join(', ')}</p>
      </div>

      {/* Danh sách tập phim */}
      <h2 className="text-2xl font-bold mb-4">Danh Sách Tập</h2>
      {episodes.map(server => (
        <div key={server.server_name} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{server.server_name}</h3>
          <div className="flex flex-wrap gap-2">
            {server.server_data.map(episode => (
              <button
                key={episode.slug}
                onClick={() => setSelectedEpisode(episode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedEpisode?.slug === episode.slug
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-red-500'
                }`}
              >
                {episode.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};
export default MovieDetail;