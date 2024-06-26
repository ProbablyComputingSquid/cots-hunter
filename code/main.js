// IMPORTS
import kaboom from "kaboom"
import big from "./big"
import patrol from "./patrol"
import platformX from "./platformX"
import platformY from "./platformY"
import boat from "./boat(good)"
import loadAssets from "./assets"
import music from "./music"
import LEVELS from "./LEVELS"

// VARIABLES
var currentLevelTime = 0
var dt = 0
var gameScore = 0
var cotsE = 0
var totalCots = 0
var reload = true
var bestTimes = Array(9).fill(Infinity)
var btRounded = Array(9).fill(Infinity)
var deathCount = 0
var totalTime = 0
var xvKept = 0.8
var X_VEL = 0
var timerStarted = false
var fgRun = false
var preLevelScore = 0
var powerUP = 0
var newLevel = true
var charge = 2
var attacking = 0
var timeDiff = 0
var display = btRounded
var autosplit = false
var lastLevelLoad = 0
var lastLevelStart = 0
var prevLevelTime = 0
var prevTD = 0
var speedier = false


kaboom({
    font: "apl386",
    background: [50, 75, 255],
})
loadAssets()

// define some constants
const SW = width()
const SH = height()
const JUMP_FORCE = 1320
let MOVE_SPEED = 100
let original_speed = MOVE_SPEED
const FALL_DEATH = 2400


function options() {
    return { id: "optimize" }
}

// define what each symbol means in the level graph
const levelConf = {
    // grid size
    width: 64,
    height: 64,
    // define each object as a list of components
    "=": () => [
        sprite("sand"),
        "sand",
        area(),
        solid(),
        origin("bot"),
        outview(/*{hide:true}*/),
        options()
    ],
    "-": () => [
        sprite("sand"),
        "internal",
        area(),
        origin("bot")
    ],
    "$": () => [
        sprite("coin"),
        area(),
        pos(0, -9),
        origin("bot"),
        "coin",
        outview(/*{hide:true}*/),
        options()
    ],
    "%": () => [
        sprite("prize"),
        area(),
        solid(),
        origin("bot"),
        "prize",
        outview(/*{hide:true}*/),
        options()
    ],
    "^": () => [
        sprite("spike"),
        area(),
        origin("bot"),
        body(),
        solid(),
        "danger",
        outview(/*{hide:true}*/),
        options()
    ],
    "#": () => [
        sprite("meat"),
        area(),
        body(),
        origin("bot"),
        "meat",
        "passable",
        outview(/*{hide:true}*/),
        options()
    ],
    ">": () => [
        sprite("cots"),
        area({ width: 128, height: 120, }),
        scale(0.5),
        origin("bot"),
        body(),
        patrol(),
        solid(),
        "enemy",
        outview({ hide: true }),
        options()
    ],
    "@": () => [
        sprite("boat"),
        area({ scale: 0.5, }),
        origin("bot"),
        pos(0, -12),
        body(),
        solid(),
        "portal",
        boat(),
        outview({ hide: false }),
        options()
    ],
    "&": () => [
        sprite("coral"),
        area(),
        origin("bot"),
        "coral",
        outview(/*{hide:true}*/),
        options()
    ],
    "x": () => [
        sprite("purple-sand"),
        area({ width: 63, height: 63 }),
        solid(),
        origin("bot"),
        "movingX",
        outview(/*{hide:true}*/),
        options(),
        platformX()
    ],
    "y": () => [
        sprite("purple-sand"),
        area(),
        solid(),
        pos(),
        origin("bot"),
        "movingY",
        outview(/*{hide:true}*/),
        options(),
        platformY()
    ],
    "!": () => [
        origin("bot"),
        area(),
        "spawnpoint",
        options()
    ],
    "p": () => [
        sprite("pizza"),
        area(),
        body(),
        origin("bot"),
        "pizza",
        "passable",
        outview(/*{hide:true}*/),//dont remove im fixing it please just give me 5 minutes watch htv plz plz plz
        options(),
    ],
    "*": () => [
        sprite("pineapple"),
        area(),
        body(),
        origin("bot"),
        "pineapple",
        "passable",
        outview(/*{hide:true}*/),
        options(),
    ],
    "e": () => [
        sprite("energy"),
        area(),
        body(),
        origin("bot"),
        "energy",
        "passable",
        outview(/*{hide:true}*/),
        options(),
    ],
    "w": () => [
        sprite("bubbles"),
        area(),
        /*        body(),*/
        origin("bot"),
        outview(),
        "UPbubbles"
    ],
    "d": () => [
        sprite("bubbles"),
        area(),
        /*        body(),*/
        origin("bot"),
        outview(),
        "SIDEbubbles"
    ],
    "o": () => [
        pos(),
        area({ scale: 0.8 }),
        origin("center"),
        "spawnpoint"
    ],
    "m": () => [
        pos(),
        area(),
        "music",
        //music()
    ]
}


// LEVEL SELECT
scene("levelselect", () => {
    function button() {
        return {
            id: "button",
            require: ["area", "scale"]
        }
    }
    for (let i = 1; i <= 11; i++) {
        add([
            i.toString(),
            text(i.toString()),
            pos(SW / 2 + i * 150 - 900, SH / 2),
            area(),
            button(),
            scale(1),
            origin("center"),
            { number: i }
        ])
    }
    add([text("X Velocity: " + X_VEL), pos(10, SH - 100)])
    onUpdate("button", (b) => {
        if (b.isHovering()) {
            if (b.scale.x < 2) {
                b.scale.x += 0.25
                b.scale.y += 0.25
            }
            if (isMouseDown()) {
                go("game", {
                    levelId: b.number,
                    score: 0
                })
            }
        } else if (b.scale.x > 1) {
            b.scale.x -= 0.25
            b.scale.y -= 0.25
        }
    })
})
scene("intro-1", () => {

    add([
        pos(0, 0),
        text("Better in new tab - not mobile adjusted | Press any key to continue", {
            width: width(),
            size: height() / 8,
        }),
    ])
    onKeyPress(() => go("speedrun?"))
})
// speedrun option
scene("speedrun?", () => {
    add([
        text("Do you want this to be a full\ngame speedrun?\npress y/n to continue", {
            width: width(),
            size: height() / 8,
        })
    ])

    onKeyPress("y", () => {
        fgRun = true
        music()
        go("game", { levelId: 0, score: 0 })
    })

    onKeyPress("n", () => { go("game", { levelId: 0, score: 0 }, music()) })
})

// MAIN GAME
scene("game", ({ levelId, score } = { levelId: 0, score: 0/*, numOfCots: totalCots*/ }) => {
    // check for improper initialization
    if (score == undefined) { score = 0 } 
    if (levelId == undefined) { levelId = 0 }
    
    lastLevelStart = time()
    reload = true
    if (newLevel == true) {
        currentLevelTime = 0
    }
    timerStarted = false
    X_VEL = 0;
    if (isKeyDown("w") || isKeyDown("up") || isKeyDown("a") || isKeyDown("left") || isKeyDown("d") || isKeyDown("right") || isKeyDown("s") || isKeyDown("down") || isKeyDown("space")) {
        lastLevelLoad = time()
    }
    preLevelScore = score
    if (levelId == 0) {
        lastDeath = time()
    }
    onKeyPress(() => {
        if (!timerStarted) {
            lastLevelLoad = time()
            timerStarted = true
        }
    })
    onKeyPress(["q", "r"], () => {
        if (fgRun) {
            bestTimes = Array(8).fill(Infinity)
            btRounded = Array(8).fill(Infinity)
        }
        go("game")
    })
    cotsE = 0
    gravity(3200)

    // add level to scene
    const level = addLevel(LEVELS[levelId ?? 0], levelConf)

    // define player object
    const player = add([
        sprite("bean-2"),
        pos(0, 0),
        area({ scale: 0.8 }),
        scale(1),
        body(),
        big(),
        origin("center"),
        "player"
    ])

    // optimization code that probably helps
    // TODO: possibly redundant code
    onUpdate("outview", (thing) => {
        if (thing.isOutOfView()) {
            thing.hidden = true
        } else {
            thing.hidden = false
        }
    })
    //something that might help optimization, or perhaps not

    /*onUpdate("sand", (b) => {
        b.solid = b.pos.dist(player.pos) >= 20
    })*/
    // PLAYER UPDATE
    onUpdate("player", (player) => {
        //key presses
        if (isKeyDown("l") && fgRun == false) {
            go("levelselect")
        }
        if ((isKeyDown("up") || (isKeyDown("w"))) && player.isGrounded()) {
            player.jump(JUMP_FORCE)
        }
        if (isKeyDown("right") || isKeyDown("d")) {
            X_VEL += MOVE_SPEED
            isFlipped = false
            player.flipX(false)
        }
        if (isKeyDown("left") || isKeyDown("a")) {
            X_VEL -= MOVE_SPEED
            isFlipped = true
            player.flipX(true)
        }
        if (isKeyDown("down") || isKeyDown("s")) {
            player.weight = 3
        } else {
            player.weight = 1
        }
        if (charge < 0) {
            if (autosplit) {
                display = timeDiff
            } else {
                display = btRounded
            }
        } else if (isKeyDown("shift") && charge > 0) {
            charge -= 1 / dt
            attacking = 10
            display = charge
        } else if (attacking > 0) {
            attacking -= 1
            display = charge
        } else if (charge < 2) {
            charge += 1 / dt
            display = charge
        }
        if (player.isGrounded()) {
            xvKept = 0.8
            MOVE_SPEED = original_speed
            if (speedier) { MOVE_SPEED *= 2 }
        } else {
            xvKept = 0.9
            MOVE_SPEED = original_speed / 2
            if (speedier) { MOVE_SPEED *= 2 }
        }

        // move the player, slow them down
        player.move(X_VEL, 0)
        X_VEL *= xvKept

        // center camera to player
        camPos(player.pos)
        // check fall death
        if (player.pos.y >= FALL_DEATH) {
            if (fgRun == true) {
                deathCount += 1
                go("game", { levelId: levelId, score: preLevelScore })
            } else {
                go("drown", { levelId: levelId, score: preLevelScore })
            }
        }
    })

    let isFlipped = false;
    onKeyPress("space", () => {
        pew()
    })
    function pew(bulletNum = 1) {
        let dir = isFlipped ? -1 : 1
        if (reload /*&&!isKeyDown("down")*/) {
            // recoil effect
            X_VEL += 3000 * -dir
            // make the bullet
            for (let i = 0; i < bulletNum; i++) {
                let bullet = add([
                    sprite("bullet"),
                    pos(player.pos.x + dir * 100, player.pos.y),
                    area({ scale: 0.5 }),
                    origin("center"),
                    scale(0.1),
                    "bullet",
                    cleanup(),
                ])


                if (isFlipped) {
                    bullet.flipX(true)
                }

                // destroy enemies
                bullet.onCollide("solid", (e) => {
                    if (e.is("enemy")) {
                        destroy(e)
                        gameScore += 10
                    }
                    addKaboom(bullet.pos)
                    destroy(bullet)
                })
                // make the bullet move
                bullet.onUpdate(() => {
                    bullet.move(1024 * dir, 0)
                })

                // make sure you can't spam
                reload = false
                wait(0.5, () => {
                    reload = true
                })
            }
        }
    }

    // if player onCollide with any obj with "danger" tag, lose
    player.onCollide("danger", () => {
        if (fgRun == true) {
            newLevel = false
            currentLevelTime += time() - lastLevelLoad
            deathCount += 1
            go("game", { levelId: levelId, score: preLevelScore })
        } else {
            go("spiked", { levelId: levelId, score: preLevelScore })
            play("hit", { volume: 0.25 })
        }
    })

    // coin collection
    player.onCollide("coin", (c) => {
        gameScore += 1
        destroy(c)
    })

    // level end code
    player.onCollide("portal", () => {
        play("portal", { volume: 0.25 })
        prevLevelTime = time() - lastLevelLoad
        prevTD = timeDiff
        display = prevTD
        // set the player's new best time for the level, if needed
        if (bestTimes[levelId] > time() - lastLevelLoad) {
            if (!fgRun) {
                bestTimes[levelId] = time() - lastLevelLoad
            } else {
                currentLevelTime += time() - lastLevelLoad
                bestTimes[levelId] = currentLevelTime
                newLevel = true
            }
            btRounded[levelId] = Math.round(bestTimes[levelId] * 100) / 100
        }
        // play the next level if there is one, otherwise go to the win screen
        if (levelId + 1 < LEVELS.length) {
            go("game", {
                levelId: levelId + 1,
                score: score,
            })
        } else {
            totalTime = 0
            for (let n = 1; n <= 8; n++) {
                totalTime += bestTimes[n]
            }
            totalTime = Math.round(totalTime * 100) / 100
            //totalTime += deathCount
            go("win")
        }
    })

    // player-enemy interaction
    player.onCollide("enemy", (e) => {
        // if it's not from the top, die
        //if(!shield && !spacer)
        if ((charge > 0) && keyIsDown("shift")) {
            destroy(e)
            addKaboom(player.pos)
            score += 10
            scoreLabel.text = score
            gameScore = score
            play("score", { volume: 0.25 })
            cotsE += 1
        } else {
            if (player.isFalling() && !player.isGrounded()) {
                // make the enemy die, player bounce (only works from the side)
                player.jump(JUMP_FORCE)
                destroy(e)
                addKaboom(player.pos)
                score += 10
                scoreLabel.text = score
                gameScore = score
                play("score", { volume: 0.25 })
                cotsE += 1
            } else {
                if (fgRun == true) {
                    deathCount += 1
                    currentLevelTime += time() - lastLevelLoad
                    go("game", { levelId: levelId, score: preLevelScore })
                } else {
                    play("hit", { volume: 0.25 })
                    go("pricked", { levelId: levelId, score: preLevelScore })

                }
            }
        }
    })

    // punish hitting walls and make you come to a stop
    player.onCollide((obj, col) => {
        if (col.isLeft() || col.isRight()) {
            if (X_VEL < 400) {
                X_VEL = 0
            } else {
                X_VEL *= 0.4
            }
        }
    })

    // grow an meat if player's head bumps into an obj with "prize" tag
    player.onHeadbutt((obj) => {
        if (obj.is("prize")) {// && recharged) {
            powerUP = randi(1, 101)
            //debug.log(powerUP)
            if (!fgRun) {
                if (powerUP <= 50) {
                    const meat = level.spawn("#", obj.gridPos.sub(0, 1))
                    meat.jump()
                } else if (powerUP <= 75 && powerUP > 50) {
                    let pineapple = level.spawn("*", obj.gridPos.sub(0, 1))
                    pineapple.jump()
                } else if (powerUP > 75 && powerUP <= 90) {
                    let pizza = level.spawn("p", obj.gridPos.sub(0, 1))
                    pizza.jump()
                } else if (powerUP > 90) {
                    let energy = level.spawn("e", obj.gridPos.sub(0, 1))
                    energy.jump()
                }
            } else {
                if (powerUP <= 75) {
                    const meat = level.spawn("#", obj.gridPos.sub(0, 1))
                    meat.jump()
                } else if (powerUP > 75 && powerUP >= 100) {
                    let pineapple = level.spawn("*", obj.gridPos.sub(0, 1))
                    pineapple.jump()
                }
            }
            play("blip", { volume: 0.25 })
            destroy(obj)
            recharged = true
        }
    })
    // fix up
    player.onCollide("meat", (a) => {
        destroy(a)
        score += 5
        scoreLabel.text = score
        gameScore = score
        hasmeat = false
        play("powerup", { volume: 0.25 })
    })
    player.onCollide("pineapple", (a) => {
        destroy(a)
        score += 20
        scoreLabel.text = score
        gameScore = score
        hasmeat = false
        play("powerup", { volume: 0.25 })
    })
    player.onCollide("pizza", (a) => {
        debug.log("wow pizza")
        destroy(a)
        play("powerup", { volume: 0.25 })
        speedier = true
        wait(15, () => { speedier = false })
    })
    player.onCollide("energy", (a) => {
        destroy(a)
        play("powerup", { volume: 0.25 })
        gravity(3200 * 0.75)
        
        wait(5, () => {
            gravity(3200)
        })
    })


    //bubble functionality

    player.onCollide("UPbubbles", (w) => {
        player.jump(1000)
    })
    //maybe make player move to target bubble
    //side bubble wow
    let tempSpeed = randi(80, 120)
    player.onCollide("SIDEbubbles", (w) => {
        tempSpeed = tempSpeed + randi(80, 120)
        tempSpeed = tempSpeed % 200
        player.move(tempSpeed, randi(50, 150))

    })
    let coinPitch = 0

    onUpdate(() => {
        timeDiff = -1 * (bestTimes[levelId] - (time() - lastLevelLoad))
        if (!(display == charge)) {
            if ((time() - lastLevelStart) < 2) {
                display = (prevTD)
            } else if (keyIsDown("t")) {
                display = timeDiff
                autosplit = true
            } else if (keyIsDown("b")) {
                display = btRounded
                autosplit = false
            } else {
                if (autosplit == true) {
                    display = timeDiff
                } else {
                    display = btRounded
                }
            }
        }
        if (autosplit == true) {
            display = timeDiff
        }
        //debug.log(display)
        if (charge > 2) {
            charge = 2
        } else if (charge < 0) {
            charge = 0
        }
        dt = time() - dt
        if (coinPitch > 0) {
            coinPitch = Math.max(0, coinPitch - dt * 100)
        }
    })

    player.onCollide("coin", (c) => {
        destroy(c)
        play("coin", {
            detune: coinPitch,
            volume: 0.25
        })
        coinPitch += 100
        score += 1
        scoreLabel.text = score
        gameScore = score
    })
    const scoreLabel = add([
        text(score),
        pos(24, 24),
        fixed(),
    ])
})

// removed because no way to trigger it
/*scene("lose", () => {
    add([
        text("You Lose. Somehow you found this ending? Good job? idk must be a bug\nScore:" + gameScore),
    ])
  shake(1200)
    onKeyPress(() => go("game"))
})*/

// death scenes
scene("spiked", ({ levelId, preLevelScore }) => {
    add([
        text("You got poked by a coral.\nYour suit burst,\nand you drowned\nRIP\n\nPress any key to continue\nScore:" + gameScore),
    ])
    speedier = false
    gravity(3200)
    shake(120)
    onKeyPress(() => go("game", { levelId: levelId, score: preLevelScore }))
})
scene("pricked", ({ levelId, preLevelScore }) => {
    add([
        text("You got pricked by a starfish\nand had to go to the hospital\n\nbe more careful next time\n\nPress any key to continue")
    ])
    speedier = false
    gravity(3200)
    shake(120)
    onKeyPress(() => go("game", { levelId: levelId, score: preLevelScore }))
})
scene("drown", ({ levelId, preLevelScore }) => {
    add([
        text("You drowned...\nBetter bring some more air\n\nlol\n\nPress any key to continue\nScore:" + gameScore),
    ])
    speedier = false
    gravity(3200)
    shake(120)
    play("hit", { volume: 0.25 })
    onKeyPress(() => go("game", { levelId: levelId, score: preLevelScore }))
})

// win scene
scene("win", () => {
    add([
        text(`You Win!\nYou have successfully controled the outbreak of starfish in the reef\nScore: ${gameScore}\nCots Eliminated: ${cotsE}/${totalCots}\nTotal time: ${totalTime} (deaths: ${deathCount})\nPress space to play again`, {
            font: "apl386o",
            size: 55,
            width: width(),
        }),
    ])
    onKeyPress("space", () => {
        if (fgRun == true) {
            bestTimes = Array(8).fill("Infinity")
            btRounded = Array(8).fill("Infinity")
        }
        go("game")
    })
})


go("intro-1")