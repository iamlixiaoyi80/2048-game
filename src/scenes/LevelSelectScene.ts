import Phaser from 'phaser';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create(data: any): void {
    // 背景颜色
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 返回按钮
    const backButton = this.createButton(
      60,
      50,
      '←',
      80,
      50
    );
    backButton.on('pointerdown', () => {
      this.scene.start('CharacterSelectScene', { account: data.account });
    });

    // 关卡标题
    const title = this.add.text(
      this.scale.width / 2,
      100,
      '选择关卡',
      {
        fontSize: '48px',
        color: '#ffd700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    title.setOrigin(0.5);

    // 关卡列表
    this.createLevelList(data.account, data.character);
  }

  private createLevelList(account: string, character: any): void {
    const levelData = [
      {
        id: 1,
        name: '新手村外围',
        description: '适合新手的简单关卡',
        enemyTypes: '史莱姆、哥布林、野狼',
        waveCount: 5,
        color: 0x00ff00
      },
      {
        id: 2,
        name: '魔法森林',
        description: '有魔法元素的神秘森林',
        enemyTypes: '森林精灵、树精、魔法花朵',
        waveCount: 5,
        color: 0x00aaff
      },
      {
        id: 3,
        name: '沙漠遗迹',
        description: '炎热沙漠中的古老遗迹',
        enemyTypes: '沙虫、木乃伊、沙蝎',
        waveCount: 5,
        color: 0xffaa00
      }
    ];

    const startY = 180;
    const cardHeight = 200;
    const gap = 20;

    levelData.forEach((level, index) => {
      const y = startY + index * (cardHeight + gap);
      this.createLevelCard(level, y, account, character);
    });
  }

  private createLevelCard(
    level: any,
    y: number,
    account: string,
    character: any
  ): void {
    const cardWidth = Math.min(this.scale.width - 80, 500);
    const cardHeight = 180;
    const cardX = this.scale.width / 2;

    // 卡片背景
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x2a1a4a, 1);
    cardBg.fillRoundedRect(
      -cardWidth / 2,
      -cardHeight / 2,
      cardWidth,
      cardHeight,
      15
    );
    cardBg.lineStyle(3, level.color, 1);
    cardBg.strokeRoundedRect(
      -cardWidth / 2,
      -cardHeight / 2,
      cardWidth,
      cardHeight,
      15
    );

    // 关卡名称
    const nameText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 30, `关卡 ${level.id}: ${level.name}`, {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    // 描述
    const descText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 70, level.description, {
      fontSize: '18px',
      color: '#aaaaaa'
    });

    // 敌人信息
    const enemyText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 100, `敌人: ${level.enemyTypes}`, {
      fontSize: '16px',
      color: '#ffffff'
    });

    // 波数
    const waveText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 130, `波数: ${level.waveCount}`, {
      fontSize: '16px',
      color: '#ffffff'
    });

    // 开始按钮
    const startButton = this.createButton(
      cardWidth / 2 - 80,
      0,
      '开始',
      120,
      50
    );
    startButton.on('pointerdown', () => {
      this.startLevel(level, account, character);
    });

    // 容器
    const container = this.add.container(cardX, y);
    container.add([
      cardBg,
      nameText,
      descText,
      enemyText,
      waveText,
      startButton
    ]);
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
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);

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

  private startLevel(level: any, account: string, character: any): void {
    // TODO: 跳转到游戏场景
    alert(`即将开始关卡 ${level.id}: ${level.name}`);
  }
}
