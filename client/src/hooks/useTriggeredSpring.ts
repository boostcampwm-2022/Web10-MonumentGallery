import { SpringConfig, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";

export default function useTriggeredSpring(trigged: boolean, config: SpringConfig) {
  const [ready, setReady] = useState(0);
  const [playing, setPlaying] = useState(false);

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

  return { spring, ready, playing };
}
