class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("startButton", "assets/start.png");
    this.load.image("backgroundMenu", "assets/background_menu.png");
  }

  create() {
    this.add.image(400, 300, "backgroundMenu");
    this.add.text(250, 100, "Jogo do Labirinto", {
      fontSize: "48px",
      fill: "#fff",
    });
    let startButton = this.add.image(400, 400, "startButton").setInteractive();
    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.score = 0;
    this.hasKey = false;
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("key", "assets/key.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("door", "assets/door.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
    this.load.image("tiles", "assets/tileset.png");
    this.load.image("backgroundGame", "assets/background_game.png");
  }

  create() {
    this.add.image(400, 300, "backgroundGame");
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    map.createLayer("Ground", tileset, 0, 0);

    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    this.spawnKey();
    this.door = this.physics.add.sprite(500, 200, "door");
    this.physics.add.overlap(
      this.player,
      this.door,
      this.enterDoor,
      null,
      this
    );

    this.enemy = this.physics.add.sprite(400, 200, "enemy");
    this.enemy.setVelocity(100, 100);
    this.enemy.setBounce(1, 1);
    this.enemy.setCollideWorldBounds(true);

    this.scoreText = this.add.text(16, 16, "placar: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );
    this.physics.add.overlap(this.player, this.enemy, () => {
      this.scene.start("GameOverScene");
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
  }

  spawnKey() {
    if (this.keyItem) {
      this.keyItem.destroy();
    }
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(50, 550);
    this.keyItem = this.physics.add.sprite(x, y, "key");
    this.physics.add.overlap(
      this.player,
      this.keyItem,
      this.collectKey,
      null,
      this
    );
    this.hasKey = false;
  }

  collectKey(player, key) {
    this.score += 10;
    this.scoreText.setText("placar: " + this.score);
    key.destroy();
    this.hasKey = true;
  }

  enterDoor(player, door) {
    if (this.hasKey) {
      this.scene.start("GameScene2");
    }
  }
}

class GameScene2 extends Phaser.Scene {
  constructor() {
    super("GameScene2");
    this.tempoPulo = 0;
  }
  preload() {
    this.load.image("bg", "./assets_2/fundo_meu_jogo.jpg");
    this.load.image("plataforma", "./assets_2/plataforma.png");
    this.load.image("personagem", "./assets_2/witch.png");
    this.load.image("moeda", "./assets_2/estrela.png");
    this.load.image("bomba", "./assets_2/bomba.png");
    this.load.image("purpurina", "./assets_2/purpurina.png");
  }

  create() {
    var larguraJogo = 800;
    var alturaJogo = 600;
    this.bombs = this.physics.add.group();
    this.add.image(larguraJogo / 2, alturaJogo / 2, "bg").setScale(2.4);

    this.teclado = this.input.keyboard.createCursorKeys();

    this.purpurina = this.add.sprite(0, 0, "purpurina");
    this.purpurina.setVisible(false);
    this.purpurina.setScale(0.125);

    this.personagem = this.physics.add.sprite(
      larguraJogo / 2,
      630,
      "personagem"
    );
    this.personagem.body.setSize(500, 950, true);
    this.personagem.setScale(0.075);
    this.personagem.setCollideWorldBounds(true);

    this.moeda = this.physics.add.sprite(455, 420, "moeda");
    this.moeda.body.setSize(480, 600, true);
    this.moeda.setScale(0.08);
    this.moeda.setBounce(0.7);

    this.placar = this.add.text(25, 30, "moedas:", this.pontos, {
      fontSize: "25px",
      fill: "#ffffff",
    });

    this.plataformas = [];
    this.plataformas[0] = this.physics.add.staticImage(455, 520, "plataforma");
    this.plataformas[0].body.setSize(90, 25, true);
    this.plataformas[0].setScale(0.18);
    this.physics.add.collider(this.personagem, this.plataformas[0]);
    this.physics.add.collider(this.moeda, this.plataformas[0]);

    this.plataformas[1] = this.physics.add.staticImage(250, 365, "plataforma");
    this.plataformas[1].body.setSize(90, 25, true);
    this.plataformas[1].setScale(0.18);
    this.physics.add.collider(this.personagem, this.plataformas[1]);
    this.physics.add.collider(this.moeda, this.plataformas[1]);

    this.plataformas[2] = this.physics.add.staticImage(45, 210, "plataforma");
    this.plataformas[2].body.setSize(90, 25, true);
    this.plataformas[2].setScale(0.18);
    this.physics.add.collider(this.personagem, this.plataformas[2]);
    this.physics.add.collider(this.moeda, this.plataformas[2]);

    this.chao = this.physics.add.staticImage(
      larguraJogo / 2,
      850,
      "plataforma"
    );
    this.chao.body.setSize(6000, 340, true);
    this.chao.setScale(2.5);
    this.physics.add.collider(this.personagem, this.chao);
    this.physics.add.collider(this.moeda, this.chao);

    this.physics.add.overlap(this.personagem, this.moeda, () => {
      this.moeda.setVisible(false);
      var posicaomoeda_Y = Phaser.Math.RND.between(50, 650);
      this.moeda.setPosition(posicaomoeda_Y, 100);
      this.pontos += 1;
      this.placar.setText("moedas:" + this.pontos);
      this.moeda.setVisible(true);

      if (this.pontos % 3 === 0) {
        let bomba = this.bombs.create(
          Phaser.Math.Between(1, 700),
          100,
          "bomba"
        );
        bomba.setBounce(1);
        bomba.setScale(0.125);
        bomba.body.setSize(500, 500);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
        this.physics.add.collider(bomba, this.plataformas);
      }
    });
    this.physics.add.overlap(this.personagem, this.bombs, () => {
      this.scene.start("game_over");
    });
  }

  update() {
    // movimento para esquerda
    if (this.teclado.left.isDown) {
      // velocidade
      this.personagem.setVelocityX(-150);
      // imagem inverte horizontalmente
      this.personagem.setFlip(true, false);
    }

    // movimento para a direita
    else if (this.teclado.right.isDown) {
      // velocidade
      this.personagem.setVelocityX(150);
      // imagem volta ao seu estado normal
      this.personagem.setFlip(false, false);
    }

    // sem movimento horizontal caso nenhuma das setas laterais estiver acionada
    else {
      this.personagem.setVelocityX(0);
    }

    // o this.personagem só poderá pular de novo
    const encostachao =
      this.personagem.body.blocked.down || this.personagem.body.touching.down;
    // se o this.personagem estiver encostando no chão e a seta superior estiver ativada, o this.personagem irá pular
    if (encostachao && this.teclado.up.isDown) {
      // define a velocidade do pulo
      this.personagem.setVelocityY(-370);
      // ativa a função "ativarPulo", que aciona o efeito
      this.ativarPulo();
    }
    // se a seta inferior estiver acionada, o this.personagem irá descer
    else if (this.teclado.down.isDown) {
      // velocidade de descida
      this.personagem.setVelocityY(300);
      // ativa a função "desativar Pulo", que tira o efeito
      this.desativarPulo();
    }
    // caso nada esteja sendo feito, a função "desativarPulo" estará ativada
    else {
      this.desativarPulo();
    }

    // definindo a posição do efeito
    this.purpurina.setPosition(this.personagem.x, this.personagem.y + 50);
  }

  ativarPulo() {
    this.purpurina.setVisible(true);
  }

  desativarPulo() {
    this.purpurina.setVisible(false);
  }

  ativarPulo() {
    // fazendo o efeito aparecer quando a função "ativarPulo" estiver ativada
    this.purpurina.setVisible(true);
    // tornando a variável "tempoPulo" igual a 47
    this.tempoPulo = 47;
  }

  desativarPulo() {
    // fazendo o efeito aparecer por mais tempo
    if (this.tempoPulo && this.tempoPulo > 0) {
      // subtraindo 1 da variável "tempoPulo" até se tornar igual a 0
      this.tempoPulo -= 1;
    } else {
      // fazendo o efeito desaparecer quando a função "desativarPulo" estiver ativada
      this.purpurina.setVisible(false);
    }
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.image("backgroundGameOver", "assets/background_gameover.png");
  }

  create() {
    this.add.image(400, 300, "backgroundGameOver");
    this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });
    this.input.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  preload() {
    this.load.image("backgroundWin", "assets/background_win.png");
  }

  create() {
    this.add.image(400, 300, "backgroundWin");
    this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });
    this.input.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene],
};

const game = new Phaser.Game(config);
