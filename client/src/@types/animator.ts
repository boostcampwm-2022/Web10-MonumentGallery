import type { SpringValue } from "@react-spring/three";

export interface ITriggeredSpringState {
  spring: SpringValue;
  ready: number;
  playing: boolean;
  active: boolean;
}