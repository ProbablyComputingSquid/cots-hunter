// custom component controlling platform movement

export default function patrol(player, speed = 50, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
        add() {
            // sometimes throws an error randomly but it works most of the time
            this.onCollide("solid", (obj, col) => {
                try{
				    if (col.isLeft() || col.isRight()) {
                        dir = -dir
    				}
                } catch {dir = -dir}
			}),
            this.onCollide("coral", (coral) => {
                destroy(coral)
                play("chomp", {volume:0.25})
            })
        },
        update() {
            this.move(speed * dir, 0)
		},
	}
}