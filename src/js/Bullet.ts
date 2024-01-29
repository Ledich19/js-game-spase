import { Container, Graphics, Rectangle } from 'pixi.js';
import { IEnemy } from '../interfaces/game';
import { SpaceShip } from './SpaceShip';
import { CANVAS_HEIGHT } from './variables';

export class Bullet extends Graphics {
  private _isDestroyed: boolean;
  private direction: boolean;

  constructor( x: number, y: number, direction: boolean) {
    super();
    this.beginFill(0xff0000);
    this.drawRect(1, -10, 4, 30);
    this.endFill();
    this.x = x;
    this.y = y - 10;
    this._isDestroyed = false;
    this.direction = direction;
  }

  public update(): void {
    this.y -= this.direction ? 10 : -10;
    if (this.y < 0 || this.y > CANVAS_HEIGHT) {
      this.destroy();
    }
  }

  public isDestroyed(): boolean {
    return this._isDestroyed;
  }
  
  public collidesWith(object: Bullet | IEnemy | SpaceShip): boolean {
    const bounds1 = this.getHitbox();
    const bounds2 = object.getHitbox();
    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
      );
    }
    
    public getHitbox(): Rectangle {
      return this.getBounds();
    }
    
    public getPosition(): { x: number; y: number } {
      return { x: this.x, y: this.y };
    }

    public destroy(): void {
      if (!this._isDestroyed) {
        this._isDestroyed = true;
        if (this.parent) {
          this.parent.removeChild(this);
        }
      }
    }
}