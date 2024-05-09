//var u = false
export default function platformY(player, speed = 150, dir = 1) {
	return {
		id: "platformY",
		require: [ "pos", "area", ],
        add() {
            // sometimes throws an error randomly but it works most of the time
            this.onCollide("solid", (obj, col) => {
                try{
				    if (col.isUp() || col.isDown()) {
                dir = -dir
    				}
                } catch {dir = -dir}
			}),
            this.onCollide("coral", (coral) => {
                dir = -dir
            })
        },
    
        update() {
            this.pos.y = this.pos.y + (speed * dir * dt())
		    },
	}
}