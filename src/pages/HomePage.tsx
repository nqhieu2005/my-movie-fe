  import { useState, useEffect } from "react";
  import MovieCard from "../components/MovieCard";
  import { FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";

  interface ApiResponse {
    status: boolean;
    msg: string;
    items: {
      _id: string;
      name: string;
      slug: string;
      poster_url: string;
      year: number;
      tmdb: {
        vote_average: number;
        vote_count: number;
      }
    }[];
    pagination: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      totalPages: number;
    };
  }

  interface SearchApiResponse {
    status: string;
    msg: string;
    data: {
      items: {
        _id: string;
        name: string;
        slug: string;
        poster_url: string;
        year: number;
        tmdb: {
          vote_average: number;
          vote_count: number;
        }
      }[] | null;
      params: {
        pagination: {
          totalItems: number;
          totalItemsPerPage: number;
          currentPage: number;
          totalPages: number;
        };
      };
      APP_DOMAIN_FRONTEND: string;
      APP_DOMAIN_CDN_IMAGE: string;
    };
  }

  function HomePage() {
    const [movie, setMovie] = useState<ApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch movies mới cập nhật
    useEffect(() => {
      if (!isSearching) {
        const fetchMovies = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(
              `https://my-movies-be.onrender.com/api/movies/new?page=${currentPage}`
            );
            const data: ApiResponse = await response.json();
            setMovie(data);
            setTotalPages(data.pagination.totalPages);
          } catch (error) {
            console.error("Error fetching movies:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchMovies();
      }
    }, [currentPage, isSearching]);

    // Tìm kiếm phim
    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchKeyword.trim()) return;

      setIsSearching(true);
      setCurrentPage(1);
      
      try {
        const response = await fetch(
          `https://my-movies-be.onrender.com/api/movies/search?keyword=${encodeURIComponent(searchKeyword)}&page=${currentPage}&limit=20`
        );
        const data: SearchApiResponse = await response.json();
        setSearchResults(data);
        setTotalPages(data.data.params.pagination.totalPages);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    };

    // Xử lý tìm kiếm khi thay đổi trang trong chế độ search
    useEffect(() => {
      if (isSearching && searchKeyword.trim()) {
        const searchWithPage = async () => {
          try {
            const response = await fetch(
              `https://my-movies-be.onrender.com/api/movies/search?keyword=${encodeURIComponent(searchKeyword)}&page=${currentPage}&limit=20`
            );
            const data: SearchApiResponse = await response.json();
            setSearchResults(data);
            setTotalPages(data.data.params.pagination.totalPages);
          } catch (error) {
            console.error("Error searching movies:", error);
          }
        };
        searchWithPage();
      }
    }, [currentPage, searchKeyword, isSearching]);

    // Clear search và trở về danh sách phim mới
    const clearSearch = () => {
      setSearchKeyword("");
      setIsSearching(false);
      setSearchResults(null);
      setCurrentPage(1);
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const renderPagination = () => {
      const pages = [];

      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
            currentPage === 1
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        pages.push(
          <span key="dots-1" className="text-white/60 px-2">
            ...
          </span>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              currentPage === i
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots-2" className="text-white/60 px-2">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              currentPage === totalPages
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            {totalPages}
          </button>
        );
      }

      return pages;
    };

    // Loading animation
    if (isLoading && !isSearching) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">Đang tải phim...</p>
          </div>
        </div>
      );
    }

    // Lấy danh sách phim để hiển thị
const displayMovies = isSearching ? searchResults?.data.items ?? [] : movie?.items;
// Lấy tên miền CDN nếu đang trong chế độ tìm kiếm
const cdnDomain = isSearching ? searchResults?.data.APP_DOMAIN_CDN_IMAGE : undefined;
    const displayTitle = isSearching 
      ? `Kết quả tìm kiếm: "${searchKeyword}"` 
      : "Phim mới cập nhật";

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-6">
          {/* Search Bar */}
          <div className="mb-12 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm kiếm phim yêu thích..."
                  className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 placeholder-white/50"
                />
                <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-blue-400 transition-colors duration-300" />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Tìm kiếm
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-6 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
                  title="Xóa tìm kiếm"
                >
                  <FaTimes />
                </button>
              )}
            </form>
          </div>

          {/* Title */}
          <div className="text-center mb-12 animate-fade-in animation-delay-300">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {displayTitle}
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/60">
              {/* <FaFilm className="animate-pulse" /> */}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-1.5xl animate-pulse">Web được update vào 6/8/2025</span>
              
            </div>
          </div>

          {/* Movies Grid */}
          {displayMovies && displayMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-fade-in animation-delay-500">
              {displayMovies.map((movie, index) => (
                <div
                  key={movie._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MovieCard movie={movie} cdnDomain={cdnDomain} />
                </div>
              ))}
            </div>
          ) : isSearching ? (
            <div className="text-center p-12 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto border border-white/20">
                <FaSearch className="text-6xl text-white/40 mx-auto mb-4" />
                <p className="text-white text-xl mb-4">Không tìm thấy phim nào với từ khóa "{searchKeyword}"</p>
                <button
                  onClick={clearSearch}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Xem tất cả phim
                </button>
              </div>
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 space-x-4 animate-fade-in animation-delay-700">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  currentPage === 1
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                <FaChevronLeft />
              </button>
              <div className="flex items-center space-x-2">
                {renderPagination()}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  currentPage === totalPages
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  export default HomePage;