import { useEffect, useState } from "react";

const useCountUp = (end: number, duration = 800) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!end || end <= 1) {
      setCount(end);
      return;
    }

    let current = 1;
    const stepTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      current += 1;
      setCount(current);

      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

export default useCountUp;
