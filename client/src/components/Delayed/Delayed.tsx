import React, { useState, useEffect } from "react";

interface DelayedProps {
  children: React.ReactNode;
  waitBeforeShow: number;
}

function Delayed({ children, waitBeforeShow = 500 }: DelayedProps) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);

    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : null;
}

export default Delayed;
