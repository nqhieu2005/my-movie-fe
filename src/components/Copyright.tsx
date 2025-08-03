import  { useRef, useState, useEffect } from "react";

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
        <div className="text-center text-gray-500 py-1 mt-1">
          <p>
            &copy; {new Date().getFullYear()} CineStream. All rights reserved by{" "}
            <a href="https://www.facebook.com/nq.hie.05">Quoc Hieu Nguyen</a>.
          </p>
        </div>
      )}
    </>
  );
}
export default Copyright;
