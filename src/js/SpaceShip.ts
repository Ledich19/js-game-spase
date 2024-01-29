import { Sprite, Container, Texture, Ticker, utils, Graphics, Rectangle } from 'pixi.js';
import { Bullet } from './Bullet';
import { SHIP_SPEED, textures } from './variables';

export class SpaceShip extends Sprite {
  private screenWidth: number;
  private screenHeight: number;
  private bulletsInSpace: Bullet[] = [];
  private bulletsAmount: number = 0;
  private speed: number = SHIP_SPEED;
  private isMovingLeft: boolean = false;
  private isMovingRight: boolean = false;
  private _isDestroyed: boolean = false;
  private hitbox: Graphics;
  container: Container;

  constructor(container: Container) {
    super(Texture.from(textures.spaceShip.name));
    this.container = container;
    this.screenWidth = container.width;
    this.screenHeight = container.height;
    this.hitbox = new Graphics();
  }

  public init(): void {
    this.anchor.set(0.5, 1);
    this.x = this.screenWidth / 2;
    this.y = this.screenHeight;
    this.setHitBox(0.5, 1);
    this.width = this.width / 2;
    this.height = this.height / 2;
    this.setupKeyboardControls();
    this.setupTicker();
  }

  private setupTicker(): void {
    Ticker.shared.add((deltaTime) => {
      this.update(deltaTime);
    });
  }

  private update(deltaTime: number): void {
    if (this.isMovingLeft && this.x > this.width / 2) {
      this.x -= this.speed * deltaTime;
    }

    if (this.isMovingRight && this.x < this.screenWidth - this.width / 2) {
      this.x += this.speed * deltaTime;
    }

    this.bulletsInSpace = this.bulletsInSpace.filter((bullet) => bullet && !bullet.isDestroyed());
    this.bulletsInSpace.forEach((bullet) => bullet.update());
  }

  private setupKeyboardControls(): void {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.isMovingLeft = true;
          break;
        case 'ArrowRight':
          this.isMovingRight = true;
          break;
        case ' ':
          this.shoot();
          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.isMovingLeft = false;
          break;
        case 'ArrowRight':
          this.isMovingRight = false;
          break;
      }
    });
  }

  private shoot(): void {
    if (this.bulletsAmount <= 0 || this._isDestroyed) return;
    const bullet = new Bullet(this.x, this.y - this.height, true);
    this.container.addChild(bullet);
    this.bulletsInSpace.push(bullet);
    this.bulletsAmount--;
  }

  public getBulletsSpace(): Bullet[] {
    return this.bulletsInSpace;
  }

  public getBulletsAmount(): number {
    return this.bulletsAmount;
  }
  public setBulletsAmount(bullets: number): void {
    this.bulletsAmount = bullets;
  }

  public destroy(): void {
    this.bulletsInSpace.forEach((bullet) => {
      bullet.destroy();
    });
    this.container.removeChild(this);
    this._isDestroyed = true;
  }
  public isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public getHitbox(): Rectangle {
    return this.hitbox.getBounds();
  }

  private setHitBox(anchorX: number, anchorY: number): void {
    const hitboxSize = this.width * 0.9;
    const hitboxOffset = (this.width * 0.1) / 2;
    this.hitbox = new Graphics();
    this.hitbox.lineStyle(10, 0xff0000);
    this.hitbox.alpha = 0;
    const hitboxX = 0 - anchorX * this.width + hitboxOffset;
    const hitboxY = 0 - anchorY * this.height + hitboxOffset;
    this.hitbox.drawRect(hitboxX, hitboxY, hitboxSize, hitboxSize);
    this.addChild(this.hitbox);
  }
}
