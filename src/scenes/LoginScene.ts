import Phaser from 'phaser';

export class LoginScene extends Phaser.Scene {
  private accountInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;

  constructor() {
    super({ key: 'LoginScene' });
  }

  create(): void {
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

    // 账号标签
    const accountLabel = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 120,
      '账号',
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    );
    accountLabel.setOrigin(0.5);

    // 账号输入框
    this.createInput(
      this.scale.width / 2,
      this.scale.height / 2 - 60,
      'account',
      300,
      60
    );

    // 密码标签
    const passwordLabel = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 30,
      '密码',
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    );
    passwordLabel.setOrigin(0.5);

    // 密码输入框
    this.createInput(
      this.scale.width / 2,
      this.scale.height / 2 + 90,
      'password',
      300,
      60,
      true
    );

    // 登录按钮
    const loginButton = this.createButton(
      this.scale.width / 2,
      this.scale.height / 2 + 220,
      '登录',
      200,
      80
    );
    loginButton.on('pointerdown', () => {
      this.handleLogin();
    });
  }

  private createInput(
    x: number,
    y: number,
    name: string,
    width: number,
    height: number,
    isPassword: boolean = false
  ): void {
    const input = document.createElement('input');
    input.type = isPassword ? 'password' : 'text';
    input.id = name;
    input.style.position = 'absolute';
    input.style.left = `${x - width / 2}px`;
    input.style.top = `${y}px`;
    input.style.width = `${width}px`;
    input.style.height = `${height}px`;
    input.style.fontSize = '24px';
    input.style.padding = '10px';
    input.style.border = '3px solid #ffd700';
    input.style.borderRadius = '10px';
    input.style.backgroundColor = '#2a1a4a';
    input.style.color = '#ffffff';
    input.style.textAlign = 'center';
    document.body.appendChild(input);

    if (name === 'account') {
      this.accountInput = input;
    } else if (name === 'password') {
      this.passwordInput = input;
    }
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
      fontSize: '36px',
      color: '#1a1a2e',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);

    container.add([buttonBg, buttonText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    return container;
  }

  private handleLogin(): void {
    const account = this.accountInput.value;
    const password = this.passwordInput.value;

    // 检查输入是否为空
    if (!account || !password) {
      alert('请输入账号和密码！');
      return;
    }

    // 移除输入框
    if (this.accountInput) {
      this.accountInput.remove();
    }
    if (this.passwordInput) {
      this.passwordInput.remove();
    }

    // 检查账号是否为新账号
    const savedData = localStorage.getItem(`danmaku_roguelike_${account}`);

    if (!savedData) {
      // 新账号 → 开始新游戏
      this.startNewGame(account, password);
    } else {
      // 老账号 → 继续游戏
      this.continueGame(account, password);
    }
  }

  private startNewGame(account: string, password: string): void {
    // 保存账号信息
    const accountData = {
      account,
      password,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
    localStorage.setItem(`danmaku_roguelike_${account}`, JSON.stringify(accountData));

    // 跳转到主界面
    this.scene.start('StartScene', { account, isNewAccount: true });
  }

  private continueGame(account: string, password: string): void {
    // 加载存档
    const savedData = localStorage.getItem(`danmaku_roguelike_${account}`);

    if (savedData) {
      const data = JSON.parse(savedData);

      // 更新最后登录时间
      data.lastLogin = Date.now();
      localStorage.setItem(`danmaku_roguelike_${account}`, JSON.stringify(data));

      // 跳转到主界面
      this.scene.start('StartScene', { account, isNewAccount: false, savedData: data });
    }
  }
}
