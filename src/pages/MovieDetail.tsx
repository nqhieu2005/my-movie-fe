import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaPlay,
  FaStar,
  FaClock,
  FaClosedCaptioning,
  FaGlobe,
  FaUsers,
  FaFilm,
} from "react-icons/fa";

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
  tmdb: {
    vote_average: number;
    vote_count: number;
  }
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://my-movies-be.onrender.com/api/movies/slug/${slug}`
        );
        const data: ApiResponse = await response.json();
        setMovieData(data);

        // Logic tự động chọn tập mới nhất
        if (
          data.episodes &&
          data.episodes[0] &&
          data.episodes[0].server_data.length > 0
        ) {
          const latestEpisode = data.episodes[0].server_data[data.episodes[0].server_data.length - 1];
          setSelectedEpisode(latestEpisode);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <FaFilm className="text-6xl text-white/40 mx-auto mb-4" />
          <p className="text-white/80 text-lg">Không tìm thấy thông tin phim</p>
        </div>
      </div>
    );
  }

  const { movie, episodes } = movieData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        <div className="w-full max-w-[1280px] mx-auto">
          {/* Video Player */}
          <div className="w-full aspect-video bg-black/50 backdrop-blur-md mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in">
            {selectedEpisode ? (
              <iframe
                src={selectedEpisode.link_embed}
                allowFullScreen
                className="w-full h-full"
                style={{ aspectRatio: "16/9" }}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <FaPlay className="text-6xl mx-auto mb-4 text-white/40" />
                  <p className="text-xl">Chọn một tập phim để xem</p>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="animate-fade-in animation-delay-300">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {movie.name}
            </h1>
            <p className="text-2xl text-white/70 mb-6">
              {movie.origin_name} ({movie.year})
            </p>

            {/* Movie badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <FaFilm />
                {movie.quality}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                <FaClosedCaptioning />
                {movie.lang}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                <FaClock />
                {movie.time}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                <FaPlay />
                {movie.episode_current}
              </span>
            </div>

            {/* Movie description */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Nội dung phim
              </h3>
              <p className="text-white/80 leading-relaxed">{movie.content}</p>
            </div>

            {/* Movie details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaUsers />
                  Thông tin phim
                </h3>
                <div className="space-y-3">
                  <p className="text-white/80">
                    <strong className="text-white">Đạo diễn:</strong>{" "}
                    {movie.director.join(", ")}
                  </p>
                  <p className="text-white/80">
                    <strong className="text-white">Diễn viên:</strong>{" "}
                    {movie.actor.join(", ")}
                  </p>
                  <p className="text-white/80">
                    <strong className="text-white">Thể loại:</strong>{" "}
                    {movie.category.map((cat) => cat.name).join(", ")}
                  </p>
                  <p className="text-white/80">
                    <strong className="text-white">Quốc gia:</strong>{" "}
                    {movie.country.map((coun) => coun.name).join(", ")}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaStar />
                  Tổng lượt đánh giá
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-2xl" />
                    <span className="text-white text-2xl font-bold">{movie.tmdb.vote_average}</span>
                  </div>
                  
                  <span className="text-white/60"></span>
                </div>
                <p className="text-white/80">
                  Phim được đánh giá cao bởi cộng đồng người xem
                </p>
              </div>
            </div>

            {/* Episodes */}
            <div className="animate-fade-in animation-delay-500">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FaPlay />
                Danh Sách Tập
              </h2>
              {episodes.map((server, serverIndex) => (
                <div
                  key={server.server_name}
                  className="mb-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaGlobe />
                    {server.server_name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {server.server_data.map((episode, episodeIndex) => (
                      <button
                        key={episode.slug}
                        onClick={() => {
                          setSelectedEpisode(episode);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                          });
                        }}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          selectedEpisode?.slug === episode.slug
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
                        }`}
                        style={{
                          animationDelay: `${
                            serverIndex * 100 + episodeIndex * 50
                          }ms`,
                        }}
                      >
                        {episode.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;