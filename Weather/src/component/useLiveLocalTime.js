import { useEffect, useMemo, useState } from 'react';

const getDelayToNextMinute = () => {
  const now = new Date();
  return (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
};

const useLiveLocalTime = (timeString) => {
  const baseLocalTime = useMemo(() => new Date(timeString).getTime(), [timeString]);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setElapsedMs(0);

    const startedAt = Date.now();
    let intervalId;

    const timeoutId = setTimeout(() => {
      setElapsedMs(Date.now() - startedAt);

      intervalId = setInterval(() => {
        setElapsedMs(Date.now() - startedAt);
      }, 60_000);
    }, getDelayToNextMinute());

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [baseLocalTime]);

  return useMemo(() => new Date(baseLocalTime + elapsedMs), [baseLocalTime, elapsedMs]);
};

export default useLiveLocalTime;
