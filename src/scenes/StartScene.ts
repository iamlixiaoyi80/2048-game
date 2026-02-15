import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create(data: any): void {
    // 背景颜色
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 游戏标题
    const title = this.add.text(
      this.scale.width / 2,
      this.scale.height / 4,
      '弹幕肉鸽',
      {
        fontSize: '64px',
        color: '#ffd700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    title.setOrigin(0.5);

    // 账号信息
    if (data.account) {
      const accountText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 3,
        `欢迎回来，${data.account}！`,
        {
          fontSize: '28px',
          color: '#00aaff'
        }
      );
      accountText.setOrigin(0.5);
    }

    // 新游戏按钮
    const newGameButton = this.createButton(
      this.scale.width / 2,
      this.scale.height / 2 - 60,
      '新游戏',
      250,
      80
    );
    newGameButton.on('pointerdown', () => {
      this.scene.start('CharacterSelectScene', { account: data.account });
    });

    // 继续游戏按钮
    const continueGameButton = this.createButton(
      this.scale.width / 2,
      this.scale.height / 2 + 100,
      '继续游戏',
      250,
      80
    );
    continueGameButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene', { account: data.account, savedData: data.savedData });
    });

    // 返回按钮
    const backButton = this.createButton(
      60,
      60,
      '←',
      80,
      50
    );
    backButton.on('pointerdown', () => {
      this.scene.start('LoginScene');
    });
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    width: number,
    height: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // 按钮背景
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0xffd700, 1);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);

    // 按钮文字
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '32px',
      color: '#1a1a2e',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);

    container.add([buttonBg, buttonText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    return container;
  }
}
