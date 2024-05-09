export default function boat(dir = 1) {
  return {
    id: "boat",
    require: ["pos", "area",],
      update() {
        this.move(dir, 0)
        dir = -dir
      }
  }
}