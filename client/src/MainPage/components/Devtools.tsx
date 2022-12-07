import { Stats } from "@react-three/drei";
import { Debug } from "@react-three/rapier";
import { useEffect } from "react";
import settingStore from "../../store/setting.store";
import "./Devtools.scss";

export default function DevTools() {
  const { showDevtool, setShowDevtool, speed, setSpeed } = settingStore();

  useEffect(() => {
    setSpeed(40);
  }, []);

  useEffect(() => {
    const floatLayout = document.querySelector(".float-relative");
    const exist = document.querySelector(".devtools-menu");
    if (exist) {
      floatLayout?.removeChild(exist);
    }
    const menu = document.createElement("div");
    const speedInput = document.createElement("input");
    const showDevtoolInput = document.createElement("input");
    menu.className = "devtools-menu";
    menu.innerHTML = `
    <div>
      <div class="devtools show-devtools"><span>devtools</span></div>
      <div class="devtools speed"><span>speed</span></div>
    </div>
    `;
    speedInput.type = "number";
    speedInput.value = String(speed);
    speedInput.onchange = (e: any) => {
      setSpeed(e.target.value);
    };

    showDevtoolInput.type = "checkbox";
    console.log(showDevtool);
    showDevtoolInput.checked = showDevtool;
    showDevtoolInput.onchange = (e: any) => {
      setShowDevtool(!showDevtool);
    };

    floatLayout?.appendChild(menu);
    menu.querySelector(".speed")!.appendChild(speedInput);
    menu.querySelector(".show-devtools")!.appendChild(showDevtoolInput);
  }, [speed, showDevtool]);

  // Physics 컴포넌트 아래에 선언해야 합니다.

  if (!showDevtool) return null;
  return (
    <>
      <axesHelper />
      <gridHelper args={[10000, 200, "#0004ff", "#0004ff"]} position={[25, 0.2, 25]} />
      <Stats />
      <Debug />
    </>
  );
}
