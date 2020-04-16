import ExampleObject from '../objects/exampleObject';
import Beam from '../objects/beam';
const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 272;

export default class MainScene extends Phaser.Scene {

  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.GameObjects.Sprite;
  ship2: Phaser.GameObjects.Sprite;
  ship3: Phaser.GameObjects.Sprite;
  powerUps: Phaser.Physics.Arcade.Group;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  projectiles: Phaser.GameObjects.Group;
  enemies: Phaser.Physics.Arcade.Group;
  scoreLabel: Phaser.GameObjects.BitmapText;
  score: number;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {

    //this.background = this.add.image(0, 0, "background");
    this.background = this.add.tileSprite(0,0, DEFAULT_WIDTH, DEFAULT_HEIGHT, "background");
    this.background.setOrigin(0, 0);
    
    this.score = 0

    this.scoreLabel = this.add.bitmapText(10,5,"pixelFont", "SCORE " + this.score, 16)

    this.ship1 = this.add.sprite(100, 100, "ship")
    this.ship2 = this.add.sprite(150, 100, "ship2")
    this.ship3 = this.add.sprite(200, 100, "ship3")

    this.enemies = this.physics.add.group()
    this.enemies.add(this.ship1)
    this.enemies.add(this.ship2)
    this.enemies.add(this.ship3)

    //make flame animation
    this.ship1.play("ship1_anim")
    this.ship2.play("ship2_anim")
    this.ship3.play("ship3_anim")

    //make it so you can click on the ships
    this.ship1.setInteractive()
    this.ship2.setInteractive()
    this.ship3.setInteractive()


    //physics groups are like objects that you can create instances of
    this.powerUps = this.physics.add.group()

    //create maxObjects number of power ups
    var maxObjects = 8
    for(var i = 0; i <= maxObjects; i++){
      var powerUp = this.physics.add.sprite(16,16,"power-up")
      this.powerUps.add(powerUp)
      powerUp.setRandomPosition(0,0, DEFAULT_WIDTH, DEFAULT_HEIGHT)
    
      if(Math.random() > .5) {
        powerUp.play("red")
      } else {
        powerUp.play("gray")
      }

      powerUp.setVelocity(100,100)
      powerUp.setCollideWorldBounds(true)
      powerUp.setBounce(1)
    }

    //game object down is for when clicked
    this.input.on('gameobjectdown', this.destroyShip, this)

    this.player = this.physics.add.sprite(DEFAULT_WIDTH/2-8, DEFAULT_HEIGHT-60, "player")
    this.player.play("thrust")
    this.player.setCollideWorldBounds(true)
  
    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.projectiles = this.add.group()
    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){projectile.destroy()})
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp)

    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer)

    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy)
  }
  hitEnemy  = (projectile, enemy) => {

    this.score += 15
    
    projectile.destroy()
    this.resetShipPos(enemy)
    /*enemy.y = 0
    var randomX = Phaser.Math.Between(0, DEFAULT_WIDTH)
    enemy.x = randomX
    */
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true,true)
  }

  hurtPlayer = (player, enemy) =>{
    this.resetShipPos(enemy)
    player.x = DEFAULT_WIDTH/2 - 8
    player.y = DEFAULT_HEIGHT - 64
  }
   //moves ship down the screen
   moveShip(ship, speed) {
     ship.y += speed;
     if(ship.y > DEFAULT_HEIGHT){
       this.resetShipPos(ship)
     }
   }

   //moves ship to top of page
   resetShipPos(ship){
     ship.y = 0
     var randomX = Phaser.Math.Between(0, DEFAULT_WIDTH)
     ship.x = randomX
   }
   //changes ship to explosion animation which has a 0 repeat animation for destroy
   destroyShip(pointer, gameObject) {
     gameObject.setTexture("explosion")
     gameObject.play("explosion_anim")
   }

   shootBeam(){
     var beam = new Beam(this, this.player.x, this.player.y)
    }

  //updates every tick 
  update() {
    this.moveShip(this.ship1,.5)  
    this.moveShip(this.ship2,.75)
      this.moveShip(this.ship3, 1)
  
    this.movePlayerManager()

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam()
    }
    this.ship2.angle+=3
    this.background.tilePositionY -= .05

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i]
      beam.update()
    }

    this.scoreLabel.destroy()
    this.scoreLabel = this.add.bitmapText(10,5,"pixelFont", "SCORE " + this.score, 16)

  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown) {
      this.player.setVelocityX(-100)
    } else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(100)
    } else {
      this.player.setVelocityX(0)
    }

    if(this.cursorKeys.up?.isDown) {
      this.player.setVelocityY(-100)
    } else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(100)
    } else {
      this.player.setVelocityY(0)
    }

  }

}
