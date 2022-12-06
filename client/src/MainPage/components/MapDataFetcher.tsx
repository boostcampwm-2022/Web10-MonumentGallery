import { useFrame, useThree } from "@react-three/fiber";
import mainStore from "../../store/main.store";

export default function MapDataFetcher() {
  const { camera } = useThree();
  const setData = mainStore((store) => store.setData);
  const getData = mainStore((store) => store.getData);
  const data = getData();
  useFrame(({ clock }) => {
    const { x, z } = camera.position;
    const timer = clock.getElapsedTime();
    if (Math.floor(timer * 1000) % 10 === 0) {
      console.log(x, z);
    }
  });
  return null;
}
