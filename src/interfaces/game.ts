import { Rectangle } from 'pixi.js';
import { Bullet } from '../js/Bullet';

export type Frames = {
  loc: { x: number; y: number }[];
};
export type SpriteAnimations = { [key: string]: Frames };

export interface IEnemy {
  initialize(anchorX: number, anchorY: number,scale: number): void;
  move(): void;
  destroy(): void;
  isDestroyed(): boolean;
  getBulletsSpace(): Bullet[];
  getHitbox(): Rectangle;
  getHealth(): number;
  damage(): void;
}


export interface ITextureInfo {
  path: string;
  name: string;
}