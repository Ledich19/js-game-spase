import * as PIXI from 'pixi.js';
import { SpaceShip } from './js/SpaceShip';
import {
  BOSS_SPEED,
  BOS_HEALTH,
  GAME_DURATION_SECONDS,
  NUMBER_OF_ASTEROIDS,
  NUMBER_OF_BULLETS,
} from './js/variables';
import { Asteroid } from './js/enemies/Asteroid';
import { Notification } from './js/Notification';
import { Boss } from './js/enemies/Boss';

export class Game {
  private spaceShip: SpaceShip;
  private notification: Notification;
  private gameTime: number = GAME_DURATION_SECONDS;
  private timer: number = 0;
  private level: number = 0;
  private isGame: boolean = false;
  private enemies: (Boss | Asteroid)[][] = [];

  constructor(private container: PIXI.Container, private startButton: HTMLButtonElement) {
    this.spaceShip = new SpaceShip(this.container);
    this.notification = new Notification(this.container, 0, 10);
  }

  public init(): void {
    this.spaceShip.init();
    PIXI.Ticker.shared.add(() => {
      if (this.isGame) {
        this.enemies[this.level].forEach((enemy) => enemy.move());
      }
      this.checkAsteroidsCollision();
      this.checkAndGame();
    });
  }

  public startGame(): void {
    if (this.isGame) return;
    this.enemies.forEach((enemies) => {
      for (const asteroid of enemies) {
        asteroid.destroy();
      }
    });
    this.enemies = [];

    this.spaceShip.destroy();
    this.spaceShip = new SpaceShip(this.container);

    this.container.addChild(this.spaceShip);
    this.spaceShip.init();

    this.level = 0;
    this.enemies.push(this.createAsteroids(NUMBER_OF_ASTEROIDS));
    this.enemies.push([new Boss(this.container, BOS_HEALTH, BOSS_SPEED)]); 
    this.enemies[this.level].forEach((enemy) => enemy.initialize());
    this.gameTime = GAME_DURATION_SECONDS;
    this.notification.removeNotification();
    this.notification.setTime(this.gameTime);
    this.spaceShip.setBulletsAmount(10);
    this.notification.setBullets(this.spaceShip.getBulletsAmount());
    this.startTimer();
    this.isGame = true;
  }

  private createAsteroids(numberOfAsteroids: number): Asteroid[] {
    const newAsteroids: Asteroid[] = [];
    for (let i = 0; i < numberOfAsteroids; i++) {
      newAsteroids.push(new Asteroid(this.container));
    }
    return newAsteroids;
  }

  private startTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.gameTime -= 1;
      this.notification.setTime(this.gameTime);
      if (this.gameTime <= 0) {
        clearInterval(this.timer);
        this.gameTime = 0;
      }
    }, 1000);
  }

  checkAndGame(): void {
    if (!this.isGame) return;

    if (this.level >= this.enemies.length - 1 && this.enemies[this.level].length === 0) {
      this.notification.setNotification('YOU WIN !', '#1eff00');
      this.notification.setTime(this.gameTime);
      clearInterval(this.timer);
      this.isGame = false;
      this.startButton.style.display = 'block';
      return;
    }

    if (this.enemies[this.level].length === 0) {
      this.level++;
      this.notification.setTime(this.gameTime);
      this.spaceShip.setBulletsAmount(NUMBER_OF_BULLETS);
      this.gameTime = GAME_DURATION_SECONDS;
      this.enemies[this.level].forEach((enemy) => enemy.initialize());
      return;
    }

    if (
      (this.spaceShip.getBulletsAmount() === 0 && this.spaceShip.getBulletsSpace().length === 0) ||
      this.gameTime <= 0 ||
      this.spaceShip.isDestroyed()
    ) {
      if (this.timer !== null) {
        clearInterval(this.timer);
      }
      this.notification.setNotification('YOU LOSE !', '#ff1e00');
      this.isGame = false;
      this.startButton.style.display = 'block';
      return;
    }
  }

  checkAsteroidsCollision(): void {
    if (!this.isGame) return;
    const bullets = this.spaceShip.getBulletsSpace();
    this.notification.setBullets(this.spaceShip.getBulletsAmount());

    bullets.forEach((bullet) => {
      this.enemies[this.level].forEach((asteroid, index) => {
        if (bullet && bullet.collidesWith(asteroid)) {
          bullet.destroy();

          asteroid.damage();
          if (asteroid.isDestroyed()) {
            this.enemies[this.level].splice(index, 1);
          }
        }
      });
    });

    if (!this.enemies[this.level]) return;
    this.enemies[this.level].forEach((enemy) => {
      if (enemy instanceof Boss) {
        enemy.getBulletsSpace().forEach((bullet) => {
          bullets.forEach((anotherBullet) => {
            if (bullet.collidesWith(anotherBullet)) {
              bullet.destroy();
              anotherBullet.destroy();
            }
          });
          if (bullet.collidesWith(this.spaceShip)) {
            bullet.destroy();
            this.spaceShip.destroy();
          }
        });
      }
    });
  }
}
