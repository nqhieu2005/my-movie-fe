import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

function HomePage() {
  const [movie, setMovie] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
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
  }, [currentPage]);

  if (!movie) {
    return <div className="text-white text-center p-8">Loading...</div>;
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
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
        className={
          'px-4 py-2 rounded-md ${currentPage ===1 ? "bg-blue-600 text-white": "bg-gray-800 text-gray-300 hover:bg-gray-700"}'
        }
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Phim mới cập nhật</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6">
        {movie.items.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
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
    </div>
  );
}

export default HomePage;
