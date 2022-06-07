import kaboom from "kaboom"
import big from "./big"
import patrol from "./patrol"
import loadAssets from "./assets"

var gameScore = 0
var cotsE = 0
var totalCots = 20
kaboom({
  font:"apl386",
  background: [50,75,255],
})
loadAssets()

// define some constants
const JUMP_FORCE = 1320
const MOVE_SPEED = 480
const FALL_DEATH = 2400

const LEVELS = [
	[
		"                             $",
		"                             $",
		"                             $",
		"                             $",
		"                             $",
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
	], [
    "                                               ",
		"                                               ",
		"                                               ",
		"                                    ======     ",
		"                =    =          =====    =====",
		"                            =    >>           =",
		"                        =   =                 =",
		" ==  $$$ === > > > > > === $$=$$= &&&& ^   > @=",
		"===============================================",
  ], [
    "                                               ",
		"             $                                 ",
		"     &&      ^                &                ",
		"   =====   =====  =   =      >=>         =    =",
		"   =         =    =$$$=     ^= =^    &   ==   =",
		"=  ==%       =   ======     =====    =   = =  =",
		"   =  >     &=    =   =   ^=     =^      =  =@=",
		"   ===== &&  = && =   =   = &^&^& =  >^ ^=   ==",
		"===============================================",
  ], [
    "                                           %   ",
		"                                               ",
		"     ^^      &        &>&            >     $   ",
		"   =====     =       ====    ===    ===^   =   ",
		"  %  =      = =     =$$$$$  =   =   =  =   =   ",
		"     =     =====    =  =  = =   = = ===    =   ",
		" =   =    =     =   =$$$$$  =   =   =  =   @   ",
		"  ===&$&$=       =   ==== &&&=== & $===    =   ",
		"===============================================",
  ],
]

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
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -9),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("meat"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
	">": () => [
    sprite("cots"),
		area({width:128, height:120,}),
    scale(0.5),
		origin("bot"),
		body(),
		patrol(),
	  "enemy",
	],
	"@": () => [
		sprite("boat"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
    body(),
		"portal",
	], 
  "&": () => [
    sprite("coral"),
    area(),
    scale(1),
    origin("bot"),
    //body(),
    "coral",
  ],
}
const allEnemys = get("enemy")
every((allEnemys) => {
  //totalCots+=1,
})
scene("game", ({ levelId, score, numOfCots } = { levelId: 0, score: 0, numOfCots: totalCots,}) => {
  cotsE = 0
	gravity(3200)

	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)
    
  
	// define player object
	const player = add([
		sprite("bean-2"),
		pos(0, 0),
		area({scale:0.8}),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
		origin("left"),
    
	])

	// action() runs every frame
	player.onUpdate(() => {
		// center camera to player
		camPos(player.pos)
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("drown")
		}
	})

	// if player onCollide with any obj with "danger" tag, lose
	player.onCollide("danger", () => {
		go("spiked")
		play("hit")
	})

	player.onCollide("portal", () => {
		play("portal")
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				score: score,
			})
		} else {
			go("win")
		}
	})

	player.onGround((l) => {
		if (l.is("enemy")) {
			go("pricked")
			play("hit")
		}
	})

	player.onCollide("enemy",  (e) => {
		// if it's not from the top, die
    if(isKeyDown("space")) {
	    destroy(e)
    	addKaboom(player.pos)
      score+=10
      scoreLabel.text = score
      gameScore = score
		  play("score")
      cotsE++
    }
	})

	let hasApple = false

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.onHeadbutt((obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.gridPos.sub(0, 1))
			apple.jump()
			hasApple = true
			play("blip")
		}
	})
  //fix up
	// player grows big onCollide with an "apple" obj
  
	player.onCollide("apple", (a) => {
		destroy(a)
		score +=2
    scoreLabel.text = score
    gameScore = score
		hasApple = false
		play("powerup")
	})

	let coinPitch = 0

	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
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

  onKeyPress("up", () => {
	// these 2 functions are provided by body() component
	if (player.isGrounded()) {
		player.jump(JUMP_FORCE)
	}
})  

	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
	})

	onKeyPress("down", () => {
		player.weight = 3
	})

	onKeyRelease("down", () => {
		player.weight = 1
	})

	onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})

})


scene("lose", () => {
	add([
		text("You Lose. Somehow you found this ending? Good job? idk must be a bug\nScore:" + gameScore),
	])
  shake(1200)
	onKeyPress(() => go("game"))
})

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
  onKeyPress(() => go("game"))
})
scene("win", () => {
	add([
		text("You Win!\nYou have successfully controled the outbreak of CoTS in the Jakub reef\nScore: " + gameScore + "\nCots Eliminated:" + cotsE + "/" + totalCots, {
      font:"apl386o",
      size:55,
      width:width(),
    }),
	])
	onKeyPress(() => go("game"))
})
scene("startup", () => {
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
    text("Use arrow keys for movement, once I get around to it you will have to use space to inject the starfish\n Press space and touch the starfish with the squirty pole thing, and you will exterminate it. (in real life it takes longer but whatever) (press any key to continue)\n(also press f for fullscreen)\nalso some weird bugs when you touch cots", {
      font:"apl386o",
      size:55,
      width:width(),
    })
  ])
  onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})
  onKeyPress(() => go("game"))
})
go("startup")