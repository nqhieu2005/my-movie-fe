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
    }[] | null;
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
  };
}

function HomePage() {
  const [movie, setMovie] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchApiResponse | null>(null);

  // Fetch movies mới cập nhật
  useEffect(() => {
    if (!isSearching) {
      const fetchMovies = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/api/movies/new?page=${currentPage}`
          );
          const data: ApiResponse = await response.json();
          setMovie(data);
          setTotalPages(data.pagination.totalPages);
        } catch (error) {
          console.error("Error fetching movies:", error);
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
        `http://localhost:4000/api/movies/search?keyword=${encodeURIComponent(searchKeyword)}&page=${currentPage}&limit=20`
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
            `http://localhost:4000/api/movies/search?keyword=${encodeURIComponent(searchKeyword)}&page=${currentPage}&limit=20`
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
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(
        <span key="dots-1" className="text-gray-400 px-2">
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
          className={`px-4 py-2 rounded-md ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots-2" className="text-gray-400 px-2">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // Kiểm tra loading state
  if (!isSearching && !movie) {
    return <div className="text-white text-center p-8">Loading...</div>;
  }

  // Lấy danh sách phim để hiển thị
  const displayMovies = isSearching ? searchResults?.data.items : movie?.items;
  const displayTitle = isSearching 
    ? `Kết quả tìm kiếm: "${searchKeyword}"` 
    : "Phim mới cập nhật";

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm phim..."
              className="w-full px-4 py-3 pl-12 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-gray-700"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Xóa tìm kiếm"
            >
              <FaTimes />
            </button>
          )}
        </form>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-6">{displayTitle}</h1>

      {/* Movies Grid */}
      {displayMovies && displayMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : isSearching ? (
        <div className="text-white text-center p-8">
          <p className="text-xl">Không tìm thấy phim nào với từ khóa "{searchKeyword}"</p>
          <button
            onClick={clearSearch}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Xem tất cả phim
          </button>
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
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
            className={`px-4 py-2 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;