import Phaser from 'phaser';

interface GameData {
  account?: string;
  character?: {
    id: number;
    name: string;
    race: string;
    class: string;
    talent: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
  };
  level?: {
    id: number;
    name: string;
    description: string;
  };
}

export class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private enemies: Phaser.GameObjects.Container[] = [];
  private gameUI?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(data: GameData): void {
    console.log('GameScene created with data:', data);

    // 背景颜色
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 创建背景
    this.createBackground();

    // 创建玩家
    this.createPlayer(data.character);

    // 创建敌人（示例）
    this.createEnemies();

    // 创建UI
    this.createGameUI(data);

    // 添加返回按钮
    this.createBackButton(data);
  }

  private createBackground(): void {
    // 创建星空背景
    const graphics = this.add.graphics();

    // 绘制深色渐变背景
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    // 添加一些星星
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.FloatBetween(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.8);

      const star = this.add.circle(x, y, size, 0xffffff, alpha);
      star.setScrollFactor(0); // 视差效果
    }
  }

  private createPlayer(character?: GameData['character']): void {
    const playerContainer = this.add.container(
      this.scale.width / 2,
      this.scale.height * 0.75
    );

    // 玩家背景（Q版圆形）
    const playerBg = this.add.graphics();
    const color = this.getCharacterColor(character?.id || 1);
    playerBg.fillStyle(color, 1);
    playerBg.fillCircle(0, 0, 50);

    // 玩家边框
    playerBg.lineStyle(3, 0xffffff, 0.8);
    playerBg.strokeCircle(0, 0, 50);

    // 玩家眼睛
    playerBg.fillStyle(0xffffff, 1);
    playerBg.fillCircle(-15, -10, 8);
    playerBg.fillCircle(15, -10, 8);

    playerBg.fillStyle(0x000000, 1);
    playerBg.fillCircle(-15, -10, 4);
    playerBg.fillCircle(15, -10, 4);

    // 玩家嘴巴（Q版小嘴）
    playerBg.lineStyle(2, 0x000000, 1);
    playerBg.beginPath();
    playerBg.moveTo(-10, 15);
    playerBg.lineTo(10, 15);
    playerBg.stroke();

    // 玩家名称
    const playerName = this.add.text(0, 70, character?.name || '玩家', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    playerName.setOrigin(0.5);

    playerContainer.add([playerBg, playerName]);
    this.player = playerContainer;

    // 添加动画效果（简单的上下浮动）
    this.tweens.add({
      targets: playerContainer,
      y: this.scale.height * 0.75 - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createEnemies(): void {
    // 创建3个示例敌人
    const enemyData = [
      { name: '史莱姆', color: 0x00ff00, y: 0.2 },
      { name: '哥布林', color: 0x00aaff, y: 0.3 },
      { name: '野狼', color: 0xff0000, y: 0.4 }
    ];

    enemyData.forEach((enemy, index) => {
      const enemyContainer = this.add.container(
        this.scale.width / 2 + (index - 1) * 150,
        this.scale.height * enemy.y
      );

      // 敌人背景（Q版圆形）
      const enemyBg = this.add.graphics();
      enemyBg.fillStyle(enemy.color, 1);
      enemyBg.fillCircle(0, 0, 40);

      // 敌人边框
      enemyBg.lineStyle(2, 0xffffff, 0.6);
      enemyBg.strokeCircle(0, 0, 40);

      // 敌人眼睛
      enemyBg.fillStyle(0xffffff, 1);
      enemyBg.fillCircle(-12, -8, 6);
      enemyBg.fillCircle(12, -8, 6);

      enemyBg.fillStyle(0x000000, 1);
      enemyBg.fillCircle(-12, -8, 3);
      enemyBg.fillCircle(12, -8, 3);

      // 敌人嘴巴
      enemyBg.lineStyle(2, 0x000000, 1);
      enemyBg.beginPath();
      enemyBg.moveTo(-8, 12);
      enemyBg.lineTo(8, 12);
      enemyBg.stroke();

      // 敌人名称
      const enemyName = this.add.text(0, 55, enemy.name, {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      });
      enemyName.setOrigin(0.5);

      enemyContainer.add([enemyBg, enemyName]);
      this.enemies.push(enemyContainer);

      // 添加浮动动画
      this.tweens.add({
        targets: enemyContainer,
        y: this.scale.height * enemy.y - 8,
        duration: 1200 + index * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: index * 100
      });
    });
  }

  private createGameUI(data: GameData): void {
    const uiContainer = this.add.container(0, 0);

    // 顶部信息栏
    const topBar = this.add.graphics();
    topBar.fillStyle(0x000000, 0.5);
    topBar.fillRect(20, 20, this.scale.width - 40, 60);
    topBar.lineStyle(2, 0xffd700, 1);
    topBar.strokeRoundedRect(20, 20, this.scale.width - 40, 60, 10);

    // 玩家信息
    const playerInfo = this.add.text(40, 50, `玩家: ${data.account || '未登录'}`, {
      fontSize: '20px',
      color: '#ffd700'
    });
    playerInfo.setOrigin(0, 0.5);

    // 人物信息
    const characterInfo = this.add.text(200, 50, `角色: ${data.character?.name || '未知'}`, {
      fontSize: '20px',
      color: '#00aaff'
    });
    characterInfo.setOrigin(0, 0.5);

    // HP显示
    const hpText = this.add.text(
      this.scale.width - 60,
      50,
      `HP: ${data.character?.stats.hp || 100}`,
      {
        fontSize: '24px',
        color: '#ff4444',
        fontStyle: 'bold'
      }
    );
    hpText.setOrigin(1, 0.5);

    // 底部操作提示
    const bottomHint = this.add.text(
      this.scale.width / 2,
      this.scale.height - 40,
      '游戏场景开发中...\n移动和战斗功能即将上线',
      {
        fontSize: '18px',
        color: '#888888',
        align: 'center'
      }
    );
    bottomHint.setOrigin(0.5);

    uiContainer.add([topBar, playerInfo, characterInfo, hpText, bottomHint]);
    this.gameUI = uiContainer;
  }

  private createBackButton(data: GameData): void {
    const backButton = this.createButton(60, 60, '←', 80, 50);
    backButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene', {
        account: data.account,
        savedData: data
      });
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
      fontSize: '24px',
      color: '#1a1a2e',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);

    container.add([buttonBg, buttonText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    return container;
  }

  private getCharacterColor(characterId: number): number {
    const colors: { [key: number]: number } = {
      1: 0x00aaff, // 狙击手 - 蓝色
      2: 0xffd700, // 重装兵 - 金色
      3: 0xff00ff  // 刺客 - 紫色
    };
    return colors[characterId] || 0x00aaff;
  }

  update(time: number, delta: number): void {
    // 游戏循环更新逻辑（后续添加）
    // 目前只是占位，实际的游戏逻辑会在后续功能中添加
  }
}
