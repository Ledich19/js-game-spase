import { Application, Container, Sprite, Texture } from 'pixi.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, textures } from './js/variables';
import { Game } from './Game';
import { ITextureInfo } from './interfaces/game';

class App {
  private game: Game | null = null;

  constructor() {
    const app = new Application({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    const containerDiv = document.getElementById('container');
    const container = new Container();
    const startButton = this.createStartButton();

    if (containerDiv) {
      containerDiv.appendChild(startButton);
      containerDiv.appendChild(app.view as HTMLCanvasElement);
    }

    app.stage.addChild(container);
    
    this.loadTextures(textures)
    .then(() => {
        container.addChildAt(this.createBg(app.screen.width, app.screen.height), 0);
        startButton.disabled = false;
        this.game = new Game(container, startButton);
        this.game.init();
      })
      .catch((error) => {
        console.error('Error: texture loading:', error);
      });
  }

  private async loadTextures(textures: Record<string, ITextureInfo>) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    for (const key in textures) {
      if (textures.hasOwnProperty(key)) {
        const textureName = textures[key].name;
        const texture = await Texture.fromURL(textures[key].path);
        Texture.addToCache(texture, textureName);
      }
    }

    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }

  private createStartButton(): HTMLButtonElement {
    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.id = 'start_btn';
    startButton.disabled = true;
    startButton.addEventListener('click', () => {
      if (!this.game) return;
      this.game.startGame();
      startButton.style.display = 'none';
    });
    return startButton;
  }

  private createBg(width: number, height: number) {
    const backgroundTexture = Texture.from(textures.bg.name);
    const backgroundSprite = new Sprite(backgroundTexture);
    backgroundSprite.width = width;
    backgroundSprite.height = height;
    return backgroundSprite;
  }
}

new App();
