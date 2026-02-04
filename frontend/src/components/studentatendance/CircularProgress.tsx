import { useEffect, useState } from "react";

interface Props {
  percentage: number;
  size?: number;
  stroke?: number;
}

const CircularProgress = ({ percentage, size = 140, stroke = 12 }: Props) => {
  const [animatedPercent, setAnimatedPercent] = useState<number>(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressColorClass =  percentage > 75 ? "progress-green" : "progress-red";

  useEffect(() => {
    let start = 0;
    const duration = 300; // animation duration (ms)
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.round(progress * percentage);
      setAnimatedPercent(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const offset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="progress-wrapper">
      <svg width={size} height={size}>
        <circle
          className="progress-bg"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`progress-bar ${progressColorClass}`}
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>

      <div className="progress-text">
        <span className={percentage > 75 ? "green-percentage" : "red-percentage"}>{animatedPercent}%</span>
      </div>
    </div>
  );
};

export default CircularProgress;
