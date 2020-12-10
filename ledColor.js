const five = require('johnny-five')
const {Board, Led} = five 
const board = new Board(
  { port: 'COM5' }
)

board.on('ready', function () {
  console.log('Ready Event. Repl instance auto-initialized')

  let led = new Led.RGB([3,5,6])
  this.repl.inject({
    color (c,i) {
      led.color(c)
      led.intensity(i)
      console.log(led.color(),led.intensity())
    },

    off () {
      console.log('lED off')
      led.off()
    }
  })
})