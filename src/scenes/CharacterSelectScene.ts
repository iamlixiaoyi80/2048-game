import Phaser from 'phaser';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
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
      this.scene.start('StartScene', { account: data.account });
    });

    // 人物标题
    const title = this.add.text(
      this.scale.width / 2,
      100,
      '选择人物',
      {
        fontSize: '48px',
        color: '#ffd700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    title.setOrigin(0.5);

    // 人物列表
    this.createCharacterList(data.account);
  }

  private createCharacterList(account: string): void {
    const characterData = [
      {
        id: 'sniper',
        name: '狙击手',
        race: '人类',
        profession: '狙击手',
        talent: '暴击大师',
        description: '高攻击，远程，暴击+20%',
        stats: { hp: 80, attack: 20, defense: 5, speed: 3 },
        color: 0x00ff00
      },
      {
        id: 'heavy',
        name: '重装兵',
        race: '兽人',
        profession: '重装兵',
        talent: '坚韧',
        description: '高血量，防御，减伤+20%',
        stats: { hp: 150, attack: 10, defense: 15, speed: 2 },
        color: 0xff0000
      },
      {
        id: 'assassin',
        name: '刺客',
        race: '精灵',
        profession: '刺客',
        talent: '敏捷',
        description: '高速度，爆发，移速+20%',
        stats: { hp: 70, attack: 18, defense: 5, speed: 5 },
        color: 0x00aaff
      }
    ];

    const startY = 180;
    const cardHeight = 250;
    const gap = 20;

    characterData.forEach((character, index) => {
      const y = startY + index * (cardHeight + gap);
      this.createCharacterCard(character, y, account);
    });
  }

  private createCharacterCard(
    character: any,
    y: number,
    account: string
  ): void {
    const cardWidth = Math.min(this.scale.width - 80, 500);
    const cardHeight = 220;
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
    cardBg.lineStyle(3, character.color, 1);
    cardBg.strokeRoundedRect(
      -cardWidth / 2,
      -cardHeight / 2,
      cardWidth,
      cardHeight,
      15
    );

    // 人物名称
    const nameText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 30, character.name, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    // 种族和职业
    const infoText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 70, `${character.race} · ${character.profession}`, {
      fontSize: '20px',
      color: '#aaaaaa'
    });

    // 天赋
    const talentText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 100, `天赋: ${character.talent}`, {
      fontSize: '18px',
      color: '#ffd700'
    });

    // 描述
    const descText = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 130, character.description, {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: cardWidth - 150 }
    });

    // 属性
    const statsText = this.add.text(-cardWidth / 2 + 20, 0, `HP: ${character.stats.hp}  攻击: ${character.stats.attack}  防御: ${character.stats.defense}  速度: ${character.stats.speed}`, {
      fontSize: '16px',
      color: '#ffffff'
    });

    // 选择按钮
    const selectButton = this.createButton(
      cardWidth / 2 - 80,
      0,
      '选择',
      120,
      50
    );
    selectButton.on('pointerdown', () => {
      this.selectCharacter(character, account);
    });

    // 容器
    const container = this.add.container(cardX, y);
    container.add([
      cardBg,
      nameText,
      infoText,
      talentText,
      descText,
      statsText,
      selectButton
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

  private selectCharacter(character: any, account: string): void {
    // 保存选择的人物
    const savedData = localStorage.getItem(`danmaku_roguelike_${account}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      data.character = character;
      localStorage.setItem(`danmaku_roguelike_${account}`, JSON.stringify(data));
    }

    // 跳转到关卡选择界面
    this.scene.start('LevelSelectScene', { account, character });
  }
}
