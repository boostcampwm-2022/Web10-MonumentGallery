import type { SpringValue } from "@react-spring/three";

export interface IToast {
  id: number;
  type: string;
  description: string;
  backgroundColor: string;
  icon: string;
  autoDeleteTime?: number;
}

export type Vector3Arr = [x: number, y: number, z: number];

export interface ITriggeredSpringState {
  spring: SpringValue;
  ready: number;
  playing: boolean;
}

export interface User {
  id?: string;
  name?: string;
  avatarUrl?: string;
}
