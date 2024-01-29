import { Container, Graphics, Ticker, utils } from 'pixi.js';
import { BOSS_SHUT_INTERVAL_MS, BOS_HEALTH, textures } from '../variables';
import { Bullet } from '../Bullet';
import { Enemy } from './Enemy';

export class Boss extends Enemy {
  private changeDirectionInterval = Math.random() * 2000 + 1000;
  private healthLine: Graphics;
  private shootInterval: number | undefined = undefined;

  constructor(container: Container, health: number, speed: number) {
    super(container, health, speed, utils.TextureCache[textures.boss.name]);
    this.healthLine = new Graphics();
  }

  public initialize(): void {
    this.container.addChild(this.sprite);
    const anchorX = 0.5;
    const anchorY = 0.5;
    const scale = 0.25;
    this.createHealthLine(anchorX, anchorY);
    super.initialize(anchorX, anchorY, scale);
    this.shootInterval = setInterval(() => {
      this.shoot();
    }, BOSS_SHUT_INTERVAL_MS);
  }

  public move(): void {
    this.sprite.x += this.direction * this.speed;
    if (
      this.sprite.x < this.sprite.width / 2 ||
      this.sprite.x > this.screenWidth - this.sprite.width / 2
    ) {
      this.direction *= -1;
    }
    if (Ticker.shared.lastTime >= this.changeDirectionInterval) {
      this.direction = Math.floor(Math.random() * 3) - 1;
      console.log(this.direction);
      this.changeDirectionInterval = Ticker.shared.lastTime + (Math.random() * 2000 + 1000);
    }
    this.bulletsInSpace = this.bulletsInSpace.filter((bullet) => !bullet.isDestroyed());
    this.bulletsInSpace.forEach((bullet) => bullet.update());
  }

  protected createHealthLine(anchorX: number, anchorY: number): void {
    const oneHealthWith = this.sprite.width / BOS_HEALTH;
    this.healthLine.lineStyle(10, 0xff0000);
    this.healthLine.drawRect(
      -this.sprite.width * anchorX,
      -this.sprite.height * anchorY,
      oneHealthWith * this.health,
      8
    );
    this.sprite.addChild(this.healthLine);
  }
  protected updateHealthLine(): void {
    this.healthLine.width = this.healthLine.width * this.health / BOS_HEALTH;
  }

  private shoot(): void {
    const bullet = new Bullet(this.sprite.x, this.sprite.y + this.sprite.height / 2, false);
    this.container.addChild(bullet);
    this.bulletsInSpace.push(bullet);
  }

  damage(): void {
    this.health--;
    if (this.health <= 0) {
      this.destroy();
    }
    this.updateHealthLine();
  }

  destroy(): void {
    clearInterval(this.shootInterval);
    super.destroy();
  }
}
