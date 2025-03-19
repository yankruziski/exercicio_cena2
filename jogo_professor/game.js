class jogo extends Phaser.Scene {

    constructor() {
        super({ key: 'jogo'});
    }

    preload() {
        this.load.image('bg', '../assets/fundo_meu_jogo.jpg');
        this.load.image('plataforma', '../assets/plataforma.png');
        this.load.image('personagem', '../assets/witch.png');
        this.load.image('moeda', '../assets/estrela.png');
        this.load.image('bomba', '../assets/bomba.png');
        this.load.image('purpurina', '../assets/purpurina.png');
    }

    create() {

        this.bombs = this.physics.add.group();
        this.add.image(larguraJogo/2, alturaJogo/2, 'bg').setScale(2.4);

        teclado = this.input.keyboard.createCursorKeys();

        purpurina = this.add.sprite(0, 0, 'purpurina');
            purpurina.setVisible(false);
            purpurina.setScale(0.125);


        personagem = this.physics.add.sprite(larguraJogo/2, 630, 'personagem')
        personagem.body.setSize(500, 950, true)
        personagem.setScale(0.075);
        personagem.setCollideWorldBounds(true);


        moeda = this.physics.add.sprite(455, 420, 'moeda');
        moeda.body.setSize(480, 600, true);
        moeda.setScale(0.08);
        moeda.setBounce(0.7);

        placar = this.add.text(25, 30, 'Moedas:' + pontos, {fontSize:'25px', fill:'#ffffff'});

        
        plataformas[0] = this.physics.add.staticImage(455, 520, 'plataforma');
        plataformas[0].body.setSize(90, 25, true);
        plataformas[0].setScale(0.18);
        this.physics.add.collider(personagem, plataformas[0]);
        this.physics.add.collider(moeda, plataformas[0]);


        plataformas[1] = this.physics.add.staticImage(250, 365, 'plataforma');
        plataformas[1].body.setSize(90, 25, true);
        plataformas[1].setScale(0.18);
        this.physics.add.collider(personagem, plataformas[1]);
        this.physics.add.collider(moeda, plataformas[1]);

        plataformas[2] = this.physics.add.staticImage(45, 210, 'plataforma');
        plataformas[2].body.setSize(90, 25, true);
        plataformas[2].setScale(0.18);
        this.physics.add.collider(personagem, plataformas[2]);
        this.physics.add.collider(moeda, plataformas[2]);

        chao = this.physics.add.staticImage(larguraJogo/2, 850, 'plataforma');
        chao.body.setSize(6000, 340, true);
        chao.setScale(2.5);
        this.physics.add.collider(personagem, chao);
        this.physics.add.collider(moeda, chao);

        this.physics.add.overlap(personagem, moeda, () => {
            moeda.setVisible(false);
            var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
            moeda.setPosition(posicaoMoeda_Y, 100);
            pontos += 1;
            placar.setText('Moedas:' + pontos);
            moeda.setVisible(true);
        
            if (pontos % 3 === 0) {
                let bomba = this.bombs.create(Phaser.Math.Between(1, 700), 100, 'bomba');
                bomba.setBounce(1);
                bomba.setScale(0.125);
                bomba.body.setSize(500, 500);
                bomba.setCollideWorldBounds(true);
                bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
                this.physics.add.collider(bomba, plataformas);
                
            }
        });
        this.physics.add.overlap(personagem, this.bombs, () => {
            this.scene.start('game_over');
        });
        

    }

    update() {
        
        // movimento para esquerda
        if (teclado.left.isDown) {
            // velocidade
            personagem.setVelocityX(-150);
            // imagem inverte horizontalmente
            personagem.setFlip(true, false);
        }

        // movimento para a direita
        else if (teclado.right.isDown) {
            // velocidade
            personagem.setVelocityX(150);
            // imagem volta ao seu estado normal
            personagem.setFlip(false, false);
        }

        // sem movimento horizontal caso nenhuma das setas laterais estiver acionada
        else {
            personagem.setVelocityX(0);
        }

        // o personagem só poderá pular de novo
        const encostaChao = personagem.body.blocked.down || personagem.body.touching.down;
        // se o personagem estiver encostando no chão e a seta superior estiver ativada, o personagem irá pular
        if (encostaChao && teclado.up.isDown) {
            // define a velocidade do pulo
            personagem.setVelocityY(-370);
            // ativa a função "ativarPulo", que aciona o efeito 
            ativarPulo();
        }
        // se a seta inferior estiver acionada, o personagem irá descer
        else if (teclado.down.isDown){
            // velocidade de descida
            personagem.setVelocityY(300);
            // ativa a função "desativar Pulo", que tira o efeito
            desativarPulo();
        }
        // caso nada esteja sendo feito, a função "desativarPulo" estará ativada 
        else {
            desativarPulo();
        }

        // definindo a posição do efeito
        purpurina.setPosition(personagem.x, personagem.y + 50);

        function ativarPulo () {
            purpurina.setVisible(true);
        }

        function desativarPulo(){
            purpurina.setVisible(false);
        }



        
        function ativarPulo() {
            // fazendo o efeito aparecer quando a função "ativarPulo" estiver ativada
            purpurina.setVisible(true);
            // tornando a variável "tempoPulo" igual a 47
            tempoPulo = 47;
        }


        function desativarPulo() {
            // fazendo o efeito aparecer por mais tempo
            if (tempoPulo > 0){
                // subtraindo 1 da variável "tempoPulo" até se tornar igual a 0
                tempoPulo -= 1;
            }
            else{
                // fazendo o efeito desaparecer quando a função "desativarPulo" estiver ativada
                purpurina.setVisible(false);
            }
        }

       

    }
}