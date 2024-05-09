export default function platformX(player, speed = 150, dir = 1) {
	return {
		id: "platformX",
		require: [ "pos", "area", ],
        add() {
            // sometimes throws an error randomly but it works most of the time
            this.onCollide("solid", (obj, col) => {
            if ()
                try{
				    if (col.isLeft() || col.isRight()) {
                        dir = -dir
    				}
                } catch {dir = -dir}
			}),
            this.onCollide("coral", (coral) => {
                dir = -dir
            })
        },
    
        update() {
            this.pos.x = this.pos.x + (speed * dir * dt())
		},
	}
}