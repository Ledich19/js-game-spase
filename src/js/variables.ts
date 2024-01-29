import { ITextureInfo } from "../interfaces/game";

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const TEXT_MARGIN = 10;

export const SHIP_SPEED = 5;
export const NUMBER_OF_BULLETS = 10;
export const GAME_DURATION_SECONDS = 60;

export const NUMBER_OF_ASTEROIDS = 4;
export const ASTEROID_SPEED = 2;

export const BOS_HEALTH = 4;
export const BOSS_SPEED = 2;
export const BOSS_SHUT_INTERVAL_MS = 2000;

export const textures: Record<string,ITextureInfo > = {
  spaceShip: {
    path: './assets/spaceShip.png',
    name: 'spaceShip',
  },
  asteroid: {
    path: './assets/asteroid.png',
    name: 'asteroid',
  },
  boss: {
    path: './assets/Daco_4681675.png',
    name: 'boss',
  },
  bg: {
    path: './assets/STFC-041021-EuropeFromSpace-GettyImages-1284041267-735x490.jpg',
    name: 'bg',
  },
};
