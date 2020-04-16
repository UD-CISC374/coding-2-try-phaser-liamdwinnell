import { Physics } from "phaser"

export default class Beam extends Phaser.GameObjects.Sprite {
    beamer: any

    constructor(scene, x: number, y: number) {

        var x = x
        var y = y

        
        super(scene, x, y, "beam")
        
        this.beamer = scene.physics.add.sprite(x,y,"beam")
        scene.projectiles.add(this.beamer)

        this.play("beam_anim")
        
        this.beamer.body.velocity.y = -250
        
        scene.projectiles.add(this)

    }
    update() {
        if(this.beamer.y < 32){
            this.beamer.destroy()
        }
    }

}