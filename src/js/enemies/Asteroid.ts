import { Container, utils } from 'pixi.js';
import { ASTEROID_SPEED, textures } from '../variables';
import { Enemy } from './Enemy';

export class Asteroid extends Enemy {
  private rotationSpeed = Math.random() * 0.01 + 0.01;
  private rotationDirection = Math.random() < 0.5 ? -1 : 1;

  constructor(container: Container) {
    super(container, 1, ASTEROID_SPEED, utils.TextureCache[textures.asteroid.name]);
  }

  public initialize(): void {
    const anchorX = Math.random();
    const anchorY = Math.random();
    const scale = Math.random() * (0.33 - 0.1) + 0.1;
    super.initialize(anchorX, anchorY, scale);
  }

  setPosition(anchorX: number, anchorY: number): void {
    this.sprite.anchor.set(anchorX, anchorY);
    this.sprite.x = Math.random() * (this.screenWidth - this.sprite.width);
    this.sprite.y = (Math.random() * this.screenHeight) / 2;
  }

  public move(): void {
    this.sprite.x += this.direction * this.speed;
    if (this.sprite.x < 0) {
      this.sprite.x = this.screenWidth - this.sprite.width;
      this.sprite.y = Math.random() * (this.screenHeight / 2);
    } else if (this.sprite.x > this.screenWidth) {
      this.sprite.x = 0;
      this.sprite.y = Math.random() * (this.screenHeight / 2);
    }
    this.sprite.rotation += this.rotationDirection * this.rotationSpeed;
  }
}
