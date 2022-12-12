import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface DelayedProps {
  children: ReactNode;
  waitBeforeShow: number;
}

function Delayed({ children, waitBeforeShow = 500 }: DelayedProps) {
  const [isShown, setIsShown] = useState(waitBeforeShow <= 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);

    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : null;
}

export default Delayed;
