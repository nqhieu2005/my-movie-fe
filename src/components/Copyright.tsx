import { useRef, useState, useEffect } from "react";
import { FaHeart, FaFacebook } from "react-icons/fa";

function Copyright() {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "0px 0px 50px 0px",
        threshold: 0.1,
      }
    );
    //scroll page
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }
    //out page
    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={triggerRef} className="h-10 w-full" />
      {isVisible && (
        <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-6 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-white/60">Made with</span>
                <FaHeart className="text-red-500 animate-pulse" />
                <span className="text-white/60">by</span>
                <a
                  href="https://www.facebook.com/nq.hie.05"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="group-hover:scale-110 transition-transform duration-300" />
                  Quoc Hieu Nguyen
                </a>
              </div>
              <p className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} CineStream. All rights
                reserved.
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-white/40 text-xs">
                
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default Copyright;
