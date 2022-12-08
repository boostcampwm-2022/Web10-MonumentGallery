import { Html } from "@react-three/drei";
import "./style.scss";

interface LinkPedalHtmlProps {
  href: string;
  visible: boolean;
}

export default function LinkPedalHtml({ href, visible }: LinkPedalHtmlProps) {
  return (
    <Html center className="pedal-html" hidden={!visible}>
      <div>
        <div>Enter 클릭 시 이동</div>
        <a href={href} target="_blank" rel="noreferrer">
          {href}
        </a>
      </div>
    </Html>
  );
}
