import React, { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [time, setTime] = useState(300);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime((prevState) => prevState - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {time === 0 ? (
        <p className="text-sm lg:text-base font-semibold text-error-300 animate-pulse">
          Time&apos;s Up!
        </p>
      ) : (
        <h1 className="text-sm sm:text-base text-error-300 font-semibold">
          {formatTime(time)}
        </h1>
      )}
    </>
  );
}
