import { Sprite, Container, Texture, Graphics, Rectangle, utils } from 'pixi.js';
import { Bullet } from '../Bullet';
import { IEnemy } from '../../interfaces/game';

export class Enemy implements IEnemy {
  hitbox: Graphics;
  health: number;
  screenWidth: number;
  screenHeight: number;
  speed: number;
  bulletsInSpace: Bullet[] = [];
  _isDestroyed: boolean = false;
  direction = Math.random() < 0.5 ? -1 : 1;

  sprite: Sprite;
  texture: Texture;
  container: Container;

  constructor(container: Container, health: number, speed: number, texture: Texture) {
    this.container = container;
    this.hitbox = new Graphics();
    this.speed = speed;
    this.screenWidth = container.width;
    this.screenHeight = container.height;
    this.health = health;
    this.texture = texture;
    this.sprite = new Sprite(texture);
  }

  public initialize(anchorX: number, anchorY: number, scale: number): void {
    this.setPosition(anchorX, anchorY);
    this.setHitBox(anchorX, anchorY);
    this.setScale(scale);
    this.container.addChild(this.sprite);
  }

  setPosition(anchorX: number, anchorY: number): void {
    this.sprite.anchor.set(anchorX, anchorY);
    this.sprite.x = this.screenWidth / 2;
    this.sprite.y = this.screenHeight / 4;
  }

  move(): void {}

  protected setHitBox(anchorX: number, anchorY: number): void {
    const hitboxSize = this.sprite.width * 0.9;
    const hitboxOffset = (this.sprite.width * 0.1) / 2;
    const hitboxX = 0 - anchorX * this.sprite.width + hitboxOffset;
    const hitboxY = 0 - anchorY * this.sprite.width + hitboxOffset;
    this.hitbox = new Graphics();
    this.hitbox.lineStyle(10, 0xff0000);
    this.hitbox.alpha = 0;
    this.hitbox.drawRect(hitboxX, hitboxY, hitboxSize, hitboxSize);
    this.sprite.addChild(this.hitbox);
  }

  setScale(scale: number): void {
    this.sprite.width *= scale;
    this.sprite.height *= scale;
  }

  destroy(): void {
    this.bulletsInSpace.forEach((bullet) => {
      bullet.destroy();
      this.container.removeChild(bullet)
    });
    this.container.removeChild(this.sprite);
    this._isDestroyed = true;
  }

  isDestroyed(): boolean {
    return this._isDestroyed;
  }

  getBulletsSpace(): Bullet[] {
    return this.bulletsInSpace;
  }

  getHitbox(): Rectangle {
    return this.hitbox.getBounds();
  }

  getHealth(): number {
    return this.health;
  }

  damage(): void {
    this.health--;
    if (this.health <= 0) this.destroy();
  }
}
