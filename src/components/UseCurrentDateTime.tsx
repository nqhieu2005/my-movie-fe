import { useState, useEffect } from "react";

const formatDate = (date: Date) =>{
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
const useCurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Dọn dẹp timer khi component bị unmount
    return () => clearInterval(timer);
  }, []);

  return {
    date: formatDate(currentDateTime),
    time: formatTime(currentDateTime)
  };
};

export default useCurrentDateTime;