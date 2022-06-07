export default function loadAssets() {
	loadSprite("spike", "sprites/spike.png");
	loadSprite("grass", "sprites/grass.png");
	loadSprite("prize", "sprites/jumpy.png");
	loadSprite("apple", "sprites/apple.png");
	loadSprite("portal", "sprites/portal.png");
	loadSprite("coin", "sprites/coin.png");
  loadSprite("meat", "sprites/meat.png");
  loadSprite("cots", "sprites/cots.png");
  loadSprite("sand", "sprites/sand.png");
  loadSprite("boat", "sprites/boat.png");
  loadSprite("coral", "sprites/coral.png");
	loadSound("coin", "sounds/score.mp3");
	loadSound("powerup", "sounds/powerup.mp3");
	loadSound("blip", "sounds/blip.mp3");
	loadSound("hit", "sounds/hit.mp3");
  loadSound("score", "sounds/score.mp3");
	loadSound("portal", "sounds/portal.mp3");
  loadSound("chomp", "sounds/chomp.mp3");
  loadSprite("bean", "sprites/bean.png");
  loadSprite("bean-2", "sprites/bean-needle.png");
  loadSprite("been", "/sprites/bean-c.png", {
	// The image contains 2 frames layed out horizontally, slice it into individual frames
	sliceX: 2,
	// Define animations
	anims: {
		"needle": 0,
		"normal": 1		
	},
}) }