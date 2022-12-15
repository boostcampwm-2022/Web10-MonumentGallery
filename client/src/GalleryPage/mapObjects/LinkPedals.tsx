import { useMemo } from "react";
import LinkPedal from "./LinkPedal";
import { generateRandomPosition } from "../../utils/random";

import type { GroupProps } from "@react-three/fiber";
import type { IGalleryPageLink } from "../../@types/gallery";

interface LinkPedalsProps extends GroupProps {
  links: IGalleryPageLink[];
}

export default function LinkPedals({ links, ...props }: LinkPedalsProps) {
  const positions = useMemo(() => generateRandomPosition("stone", links.length), []);
  return (
    <group {...props}>
      {links.map((link, i) => (
        <LinkPedal key={i} link={link} position={[positions[i][0], 0, positions[i][1]]} />
      ))}
    </group>
  );
}
