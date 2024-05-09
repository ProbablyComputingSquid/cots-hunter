/*export default function baot() {
    let onPlatform = false
    return {
        id("boat")
	      require: [ "pos", "area", ],
            update() {
                  if (this.isColliding("moving", (obj, col))) {
                      try {
                          if (col.isDown()) {
                              onPlatform = true
                          }
                      }
                  } else {
                      onPlatform = false
                  }
                  if (this.isOverlapping("sand", (s))) {
                      this.move(150, 0)
                  }
            }
    }
}*/