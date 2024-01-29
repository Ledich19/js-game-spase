import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { NUMBER_OF_BULLETS, TEXT_MARGIN } from './variables';

export class Notification {
  private time: number = 0;
  private bullets: number = 0;
  private notification: Text | null = null;
  private timeText: Text;
  private bulletsText: Text;

  constructor(private container: Container, time: number, bullets: number) {
    this.time = time;
    this.bullets = bullets;
    const timeStyle = new TextStyle({
      fill: 0xff0000,
      fontSize: 30,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    this.timeText = new Text(`time: ${this.addLeadingZero(this.time)}`, timeStyle);
    this.timeText.position.set(container.width - this.timeText.width - TEXT_MARGIN, TEXT_MARGIN);
    this.container.addChild(this.timeText);

    const bulletsStyle = new TextStyle({
      fill: 0xff0000,
      fontSize: 30,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    this.bulletsText = new Text(`bullets: ${this.bullets}/${NUMBER_OF_BULLETS}`, bulletsStyle);
    this.bulletsText.position.set(TEXT_MARGIN, TEXT_MARGIN);
    this.container.addChild(this.bulletsText);
  }

  private addLeadingZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  public setNotification(text: string, color: string): void {
    this.removeNotification();
    const notificationStyle = new TextStyle({
      fill: color,
      fontSize: 100,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    this.notification = new Text(text, notificationStyle);
    this.notification.position.set(
      this.container.width / 2 - this.notification.width / 2,
      this.container.height / 2 - this.notification.height / 2
    );
    this.container.addChild(this.notification);
    this.container.setChildIndex(this.notification, this.container.children.length - 1);
  }

  public removeNotification(): void {
    if (this.notification) {
      this.container.removeChild(this.notification);
      this.notification.destroy();
      this.notification = null;
    }
  }

  public setTime(newScore: number): void {
    this.time = newScore;
    this.timeText.text = `time: ${this.time}`;
  }

  public setBullets(newBullets: number): void {
    this.bullets = newBullets;
    this.bulletsText.text = `bullets: ${this.bullets}/${NUMBER_OF_BULLETS}`;
  }
}
