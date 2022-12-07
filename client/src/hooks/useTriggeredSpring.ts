import { SpringConfig, useSpring } from "@react-spring/three";
import { useEffect, useState, useMemo } from "react";

export default function useTriggeredSpring(trigged: boolean, config: SpringConfig) {
  const [ready, setReady] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = useMemo(() => !!(ready || playing), [ready, playing]);

  const { spring } = useSpring({
    spring: ready,
    config,
    onStart: () => setPlaying(true),
    onRest: () => setPlaying(false),
  });

  useEffect(() => {
    if (trigged) {
      if (!ready) setReady(+!ready);
    } else {
      if (ready) setReady(+!ready);
    }
  }, [trigged]);

  return { spring, ready, playing, active };
}
