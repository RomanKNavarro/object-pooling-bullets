class Player {
    constructor(game) {
        this.game = game;
        this.width = 100; 
        this.height = 100;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;
        this.speed = 5;
    }
    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        // horizontal movement:
        if (this.game.keys.indexOf('ArrowLeft') > -1) this.x -= this.speed;
        if (this.game.keys.indexOf('ArrowRight') > -1) this.x += this.speed;
        // boundaries:
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    }
    shoot() {
        const projectile = this.game.getProjectile();
        // render projectile, set its "free" to false:
        if (projectile) projectile.start(this.x, this.y);
    }
}

class Projectile {
    constructor() {
        this.width = 4;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.free = true;
    }
    draw(context) {
        if (!this.free) {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update() {
        if (!this.free) {
            this.y -= this.speed;
            if (this.y < -this.height) this.reset();
        }
    }
    start(x, y) {
        this.x = x;
        this.y = y;
        this.free = false;
    }
    reset() {
        this.free = true;
    }
}

class Enemy {

}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
        this.player = new Player(this);     // instantiate player and pass class itself as argument.

        // PROJECTILES:
        this.projectilesPool = [];
        this.numOfProjectiles = 10;
        this.createProjectiles();
        console.log(this.projectilesPool);

        // event listeners:
        window.addEventListener('keydown', e => {
            // wtf is this? indexOf() returns -1 if the given value is not present. So, push key if not alr in array:
            if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
            if (e.key === '1') this.player.shoot();
        });
        window.addEventListener('keyup', e => {
            // remove key from array after it's been released:
            const index = this.keys.indexOf(e.key);
            if (index > -1) this.keys.splice(index, 1);
        });
    }
    render(context) {
        this.player.draw(context);
        this.player.update();
        // all projectiles are rendered immediately.
        this.projectilesPool.forEach(projectile => {
            projectile.update();
            projectile.draw(context);
        })
    }
    // create projectiles object pool
    createProjectiles() {
        for (let i = 0; i < this.numOfProjectiles; i++) {
            this.projectilesPool.push(new Projectile());
        }
    }
    // get free projectile object from pool:
    // think of this as a projectile object in itself:
    getProjectile() {
        for (let i = 0; i < this.projectilesPool.length; i++) {
            if (this.projectilesPool[i].free) return this.projectilesPool[i];
        }
    }
}

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const cxt = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;

    const game = new Game(canvas);

    function animate() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        game.render(cxt);
        window.requestAnimationFrame(animate);
    }
    animate();

});