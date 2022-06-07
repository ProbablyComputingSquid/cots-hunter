// custom component controlling enemy patrol movement
export default function patrol(speed = 50, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj,col) => {
				dir = -dir
				
			})
		},
    add() {
      this.onCollide("coral", (c) => {
        destroy(c)
        play("chomp")
      })
    },
		update() {
			this.move(speed * dir, 0)
		},
	}
}