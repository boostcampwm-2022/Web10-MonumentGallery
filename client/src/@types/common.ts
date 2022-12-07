export interface IToast {
  id: number;
  type: string;
  description: string;
  backgroundColor: string;
  icon: string;
  autoDeleteTime?: number;
}

export type Vector3Arr = [x: number, y: number, z: number];

export interface User {
  id?: string;
  name?: string;
  avatarUrl?: string;
}
