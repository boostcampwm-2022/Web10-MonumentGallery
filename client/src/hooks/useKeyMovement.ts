import { useReducer, useEffect } from "react";

interface KeyState {
  [code: string]: boolean;
}

interface KeyStateReducerProps {
  code: string;
  type: "keydown" | "keyup" | "allKeyUp";
}

function mapMovementKey(code: string) {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      return "Front";
    case "ArrowLeft":
    case "KeyA":
      return "Left";
    case "ArrowDown":
    case "KeyS":
      return "Back";
    case "ArrowRight":
    case "KeyD":
      return "Right";
    case "Space":
      return "Up";
    case "ShiftLeft":
      return "Down";
    default:
      return null;
  }
}

function keyStateReducer(state: KeyState, { code, type }: KeyStateReducerProps) {
  switch (type) {
    case "keydown":
      return { ...state, [code]: true };
    case "keyup":
      return { ...state, [code]: false };
    case "allKeyUp":
      return {};
    default:
      throw new Error("invalid command!");
  }
}

export function useKeyMovement() {
  const [keyState, controlKeyState] = useReducer(keyStateReducer, {});
  function getKeyState(code: string) {
    return !!keyState[code];
  }

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      const movementKey = mapMovementKey(e.code);
      if (movementKey === null) return;
      if (getKeyState(movementKey) === true) return;
      controlKeyState({ type: "keydown", code: movementKey });
    }
    function keyUp(e: KeyboardEvent) {
      const movementKey = mapMovementKey(e.code);
      if (movementKey === null) return;
      if (getKeyState(movementKey) === false) return;
      controlKeyState({ type: "keyup", code: movementKey });
    }
    function allRelease() {
      controlKeyState({ type: "allKeyUp", code: "" });
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    window.addEventListener("blur", allRelease);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", allRelease);
    };
  }, [keyState]);

  return getKeyState;
}
