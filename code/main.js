// IMPORTS
import kaboom from "kaboom"
import big from "./big"
import patrol from "./patrol"
import platformX from "./platformX"
import platformY from "./platformY"
import boat from "./boat(good)"
import loadAssets from "./assets"

// VARIABLES
var currentLevelTime = 0
var dt = 0
var gameScore = 0
var cotsE = 0
var totalCots = 0
var recharged = true
var reload = true
var bestTimes = Array(8).fill(Infinity)
var btRounded = Array(8).fill(Infinity)
// wrTimes has manual update, but nobody's trying anyway.
//var wrTimes = Array(8).fill([1, 1.22, 1.92, 0.95, 1.13, 2.57, 0.65, 0.8])
var deathCount = 0
var totalTime = 0
var xvKept = 0.8
var X_VEL = 0
var timerStarted = false
//var powerUps = ["meat","pineapple","pizza", "energy"]
var fgRun = false
//var preLevelScore = 0
var doubleJump = false
//var shield = false
//var spacer = false
var powerUP = 0
var newLevel = true
//var levelStartTime = 0
var charge = 2
var attacking = 0
var timeDiff = 0
var display = btRounded
var autosplit = false
var lastLevelLoad = 0
var lastLevelStart = 0
var prevLevelTime = 0
var prevTD = 0

kaboom({
    font: "apl386",
    background: [50, 75, 255],
})
loadAssets()

// define some constants
const SW = width()
const SH = height()
const JUMP_FORCE = 1320
let MOVE_SPEED = 120
const FALL_DEATH = 2400

// LEVELS, MAP READER
const LEVELS = [
    [
        "                             $",
        "                             $",
        "                             $",
        "                             $",
        "                   e         $",
        "     ==  ==   $$   =     =   $",
        "    %  %     ===         =   $",
        "=                        =   $",
        "=                        =    ",
        "=   >&&   ^^   ^  = >    =   @",
        "==============================",
    ],
    [
        "%                  $$$$$$$$ ",
        "                 =   %  = ",
        "= =   =         =           ",
        "            ==            ",
        "        ===      =         ",
        "                   &&&&&&  ",
        " =^&&>=&&>&&&&>&&&>====== @",
        "===========================",
    ],
    [
        "                                               ",
        "                                               ",
        "                                               ",
        "                                    ======     ",
        "                =    =          =====    =====",
        "                                               ",
        "           %                =                 =",
        "                        =   =    >            =",
        " ==  $$$ === > > > > > === $$=$$= &&&&>^  >  @=",
        "===============================================",
    ],
    [
        "                                                  =       ",
        "                                                       =       ",
        "                                                          =       ",
        "                                      =   =                    =",
        "             $                                                      =     $",
        "     &&      ^                &               @                            =",
        "   =====   =====  =   =      >=          =$   =                        =",
        "   =         =    =$$$=      = =^    &   ==$  =                      ",
        "=  ==%       =   ======     =====    =  == =$ =                          =",
        "   =  >     &=    =   =   ^=     =^      =  =$                        =",
        "   ===== && == && =   =   = &^&^& => =  ^=   ==                     =",
        "======================================  =======              $ =",
        "                                                             =",
        "                                                    $$$$   $  ",
        "                                          $  $  $  >$$$$   =",
        "                                          $  $  $  =$$$$=",
        "                                       =  =  =  =   ====",
    ],
    [   "                                              ",
        "                                           %",
        "                                                     =    ===  =               =                                  ",
        "     ^^      &        &>&                  $         =                                    ^                        ",
        "   =====     =       ====    ===    ===^   =                                                                   =   ",
        "  %  =      = =     =$$$$$  =   =   =  =   =                                                                       ",
        "     =     =====    =  =  = = ! = = ===    =                                              =                         ",
        " =   =    =     =   =$$$$$  =   =   =  =   @                                                                       ",
        "  ===&$&$=       =   ==== &&&=== & $===    =                                                                        ",
        "======================================================================================================================",
    ],
    [
        //" > > > > > > > > >> > > >   >>  >  > > > >  >> > >       =",
        "= =  =  =  = = ==    =    =    =    =  =  =      =      =                       ",
        "                                             =          =                       ",
        "                                                =       =                       ",
        "                                                   =   =                       ",
        "                                                      >=                       ",
        "                                                       ==                       ",
        "                                               =     =   =                       ",
        "=   =   =   =   =   =   =   =   =   =   =   =     =      =                       ",
        "  =   =   =   =   =   =   =   =   =   =   =              =                        ",
        "   $   $   $   ^   $   $   $   $   $   $   $             =                       ",
        "   =   =   =   =   =   =   =   =   =   =   =             =                       ",
        "                                                                                =   @",
        "                  =          =               =                                      =",
        "                                                        =                       ",
        "   y       =        p^e     =        =     =        =      =                       ",
        "=======================================================================================================",
        "                                                        =",
    ],
    [
        "      >  =    =               &",
        "===   ====                   >=$",
        ">$$$ &$$$                    ===",
        "  =======",
        "&     &  #                     %%%",
        "=>& x=====                     $$$",
        "===$$$$$^^                     ===",
        "=&       &                    =",
        "===     ==       @   ==  #",
        "===>>>> && &==       >$$$=",
        "==============       =====",
        "                 ="

    ],
    [
        "   >$   $      &",
        "==========    ===",
        "   $$$  >        ",
        "&y $$$  &    &&  ",
        "===    ===%==== >",
        "= $$          =  %",
        "=>$$  &&      =  &",
        "===========      =",
        "=%%%      >    ===",
        "=$$$      >    =  ",
        "=&       =>  &&=  ",
        "======   =======   &",
        "=%%%               =  @",
        "=$$$    &=> >x> &  ====",
        "====================   ",
    ],
    [
        "   =            $",
        "   =            =",
        "   =        =",
        "   =",
        "   ===x     =      =     ^^^",
        "x    =            ==     ===",
        "=    = x   =       =     =     x    =",
        "=    =      =      =     =       ^  =",
        "=    =  x   =      =     =   x   ===",
        "=    =       =     =          ==@      ",
        "=    =   x   =   ==            x       =",
        "=      >   >     =x x x                    ====",
        "=              >y=                         ^  =",
        "====================================       =",
        "                            ===%%%          x =",
        "                            =      x       x  =",
        "                            = $$$            y=",
        "                            =========   =======",
        "                                    =   =",
        "                                    =   =",
        "                              =======   =======",
        "                              =%             %=",
        "                              =$$$$$     $$$$$=",
        "                              ======x    ======",
        "                              ==              =",
        "                              =       x      =",
        "                                    =====",
        "                              =x             =",
        "                              ======"
    ],
    [
        "         xxxxxxxxxxx   x",
        "           y      y    x",
        "     w        y        x               @",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ],
    [
        "                                       =   =                    ",
        "                                       ===                     ",
        "                                         $$     *      @       ",
        "                                   =    $$$$    x      =       ",
        "          =                            $$$$$$                ",
        "                        >             $$$$$$$$  $              ",
        "=                                     $$$^^$$$  =              ",
        "===============================================================",],]

function options() {
  return {id: "optimize"}
    /*return {
        id: "optimize",
        require: ["outview"],
        add() {
            this.onExitView(() => {
                this.hidden = true

                /*if (this.is()) => {
                  
                }*//*
            }), this.onEnterView(() => {
                this.hidden = false
            })

        }
    }*/
}

// define what each symbol means in the level graph
const levelConf = {
    // grid size
    width: 64,
    height: 64,
    // define each object as a list of components
    "=": () => [
        sprite("sand"),
        area(),
        solid(),
        origin("bot"),
        outview(/*{hide:true}*/),
        options()
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
        outview({hide:true}),
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
        outview(/*{hide:true}*/),
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
        area({width: 63, height:63}),
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
        body(),
        origin("bot"),
        outview(),
        "UPbubbles"
    ]
}

/*every("enemy", () => {
    totalCots += 1
})*/

// LEVEL SELECT
scene("levelselect", () => {
    function button() {
        return {
            id: "button",
            require: ["area", "scale"]
        }
    }
    for (let i = 1; i <= 8; i++) {
        add([
            i.toString(),
            text(i.toString()),
            pos(SW / 2 + i * 150 - 675, SH / 2),
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
                    levelId: b.number - 1,
                    score: 0
                })
            }
        } else if (b.scale.x > 1) {
            b.scale.x -= 0.25
            b.scale.y -= 0.25
        }

    })
})

// speedrun option
scene("speedrun?", () => {
    add([
        text("Do you want this to be a full\ngame speedrun?\n\npress y/n to continue\n\nTHE RUN MAY FAIL IF YOU DROWN")
    ])
    onKeyPress("y", () => {
        fgRun = true
        go("game")
    })
    onKeyPress("n", () => go("game"))
})

// MAIN GAME
scene("game", ({ levelId, score, numOfCots } = { levelId: 0, score: 0, numOfCots: totalCots, }) => {
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
    onUpdate("outview", (thing) => {
        if (thing.isOutOfView()) {
            thing.hidden = true
        } else {
            thing.hidden = false
        }
    })
    //thing-a-thing that might help optimization

    onUpdate("sand", (b) => {
        b.solid = b.pos.dist(player.pos) >= 20
    })
    // PLAYER UPDATE
    player.onUpdate(() => {
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
        /*onKeyPress("left", () => {
            xvKept *= 2
        }) hello?
        onKeyRelease("left", () => {
            xvKept *= 0.5
        })
        onKeyPress("a", () => {
            xvKept *= 2
        })
        onKeyRelease("a", () => {
            xvKept *= 0.5
        })*/
        /*onKeyPress("right", () => {
          xvKept *= 2
        })
        onKeyRelease("right", () => {
            xvKept *= 0.5
        })
        onKeyPress("d", () => {
            xvKept *= 2
        })
        onKeyRelease("d", () => {
            xvKept *= 0.5
        })*/
        if (isKeyDown("down") || isKeyDown("s")) {
            player.weight = 3
            //player.angle += 90
        } else {
            player.weight = 1
            //player.angle -= 90
        }

        if (isKeyDown("shift") && charge > 0) {
            charge -= 1/dt
            attacking = 10
            display = charge
        } else if (attacking > 0) {
            attacking -= 1
            display = charge
        } else if (charge < 2) {
            charge += 1/dt
            display = charge
        } else {
        }

        if (player.isGrounded()) {
          xvKept = 0.8
          MOVE_SPEED = 120
        } else {
          xvKept = 0.9
          MOVE_SPEED = 60
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
                go("game", {levelId: levelId, score: preLevelScore})
            } else {
                go("drown")
            }
        }
    })
  
    let isFlipped = false;
    onKeyPress("space", () => {
        pew()
    })
    function pew(bulletNum = 3) {
        let dir = isFlipped ? -1 : 1
        if (reload /*&&!isKeyDown("down")*/) {
            // recoil effect
            X_VEL += 3000 * -dir
          
            // make the bullet
          for(let i = 0; i < bulletNum;i++) {
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

            // give it a timer
            let spawnTime = time()
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
                // optimization: delete the bullet after 2 seconds
                
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
            go("game", {levelId: levelId, score: preLevelScore})
        } else {
            go("spiked")
            play("hit")
        }
    })

    // coin collection
    player.onCollide("coin", (c) => {
        gameScore += 1
        destroy(c)
    })

    // level end code
    player.onCollide("portal", () => {
        play("portal")
        prevLevelTime = time() - lastLevelLoad
        prevTD = timeDiff
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
            for (let n = 0; n <= 7; n++) {
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
      if((charge > 0) && keyIsDown("shift")) {
        destroy(e)
        addKaboom(player.pos)
        score += 10
        scoreLabel.text = score
        gameScore = score
        play("score")
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
            play("score")
            cotsE += 1
        } else {
            if (fgRun == true) {
              deathCount += 1
              currentLevelTime += time() - lastLevelLoad
              go("game", {levelId: levelId, score: preLevelScore})
            } else {
              go("pricked")
              play("hit")
            }
        }
      }
      /*} else if(shield) {
        shield = false
        spacer = true
        shake(10)
      //} else if (spacer) {
        spacer = false
        shake(10)
      //}*/
    })

    // punish hitting walls and let you come to a stop
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
            powerUP = randi(1,101)
            //debug.log(powerUP)
            if (powerUP <= 50) {
              /*let pizza = level.spawn("p", obj.gridPos.sub(0,1))
              pizza.jump()*/
              const meat = level.spawn("#", obj.gridPos.sub(0, 1))  
              meat.jump()
            } else if (powerUP <= 75 && powerUP >50 ) {
              let pineapple = level.spawn("*", obj.gridPos.sub(0,1))
              pineapple.jump()
            } else if (powerUP > 75 && powerUP <= 90) {
              let pizza = level.spawn("p", obj.gridPos.sub(0,1))
              pizza.jump()
            } else if(powerUP > 90) {
              let energy = level.spawn("e", obj.gridPos.sub(0,1))
              energy.jump()
            }
            
            //hasmeat = true
            play("blip")
            //recharged = false
            destroy(obj)
            recharged = true
            //recharge()
        }
    })
    // fix up
    player.onCollide("meat", (a) => {
        destroy(a)
        score += 5
        scoreLabel.text = score
        gameScore = score
        hasmeat = false
        play("powerup")
    })
    player.onCollide("pineapple", (a) => {
      destroy(a)
      score += 20
      scoreLabel.text = score
      gameScore = score
      hasmeat = false
      play("powerup")
    })
    player.onCollide("pizza", (a) => {
      shield = true
      debug.log("wow pizza")
      destroy(a)
      play("powerup")
    })
    player.onCollide("energy", (a) => {
      doubleJump = true
      destroy(a)
      play("powerup")
      debug.log(doubleJump)
      wait(15, () => {
        doubleJump = false
        debug.log(doubleJump)
      })
    })

    let coinPitch = 0

    onUpdate(() => {
        timeDiff = -1 * (bestTimes[levelId] - (time() - lastLevelLoad))
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
        if (autosplit == true) {
            display = timeDiff
        }
        debug.log(display)
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
scene("spiked", () => {
    add([
        text("You got poked by a coral.\nYour suit burst,\nand you drowned\nRIP\n\nPress any key to continue\nScore:" + gameScore),
    ])
    shake(120)
    onKeyPress(() => go("game"))
})
scene("pricked", () => {
    add([
        text("You got pricked by a starfish\nand had to go to the hospital\n\nbe more careful next time\n\nPress any key to continue\nScore:" + gameScore)
    ])
    shake(120)
    onKeyPress(() => go("game"))
})
scene("drown", () => {
    add([
        text("You drowned...\nBetter bring some more air\n\nlol\n\nPress any key to continue\nScore:" + gameScore),
    ])
    shake(120)
    play("hit")
    onKeyPress(() => go("game"))
})

// win scene
scene("win", () => {
    add([
        text(`You Win!\nYou have successfully controled the outbreak of CoTS in the reef\nScore: ${gameScore}\nCots Eliminated: ${cotsE}/${totalCots}\nTotal time: ${totalTime} (deaths: ${deathCount})\nPress space to play again`, {
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

// removed because this isn't a science project anymore
/*scene("startup", () => {
  add([
    text("If you aren't seeing text, you need a bigger screen. \nWelcome to CoTS hunter, \nA game made by me to simulate control of the invasive Crown-of-Thorns Starfish. This game simulates scuba divers exterminating the CoTS in outbreaks. Stay tuned for new features. (press any key to continue)", {
      font:"apl386o",
      size:55,
      width:width(),
    }),
  ])
  onKeyPress("f", () => {
        fullscreen(!fullscreen())
    })
  onKeyPress(() => go("startup-2"))
})
scene("startup-2", () => {
   add([
    text("The thing is, this species only becomes invasive in large numbers, typically in out break population size. One or two CoTS are actually beneficial for a reef's ecosystem, but more, can cause devestating damage. Usually, one of the most effective ways to curb the population of a CoTS outbreak without damaging the ecosystem, is injecting the CoTS.(press any key to continue)", {
      font:"apl386o",
      size:53,
      width:width(),
    }),
  ])
  onKeyPress("f", () => {
        fullscreen(!fullscreen())
    })
  onKeyPress(() => go("controls"))
})
scene("controls", () => {
  add([
    text("Use arrow keys for movement, once I get around to it you will have to use space to inject the starfish\n Press space and touch the starfish with the squirty pole thing, and you will exterminate it. (in real life it takes longer but whatever) (press any key to continue)\n(also press f for fullscreen)\n", {
      font:"apl386o",
      size:55,
      width:width(),
    })
  ])
  onKeyPress("f", () => {
        fullscreen(!fullscreen())
    })
  onKeyPress(() => go("game"))
})*/
go("speedrun?")