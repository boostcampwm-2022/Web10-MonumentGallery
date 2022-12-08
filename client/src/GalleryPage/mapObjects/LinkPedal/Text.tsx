import { Html } from "@react-three/drei";
import "./style.scss";

interface LinkPedalHtmlProps {
  href: string;
  visible: boolean;
}

export default function LinkPedalHtml({ href, visible }: LinkPedalHtmlProps) {
  if (!visible) return null;
  return (
    <Html center className="pedal-html" distanceFactor={5}>
      <div>
        <div>Enter 클릭 시 이동</div>
        <div className="pedal-link">{href}</div>
      </div>
    </Html>
  );
}
