import React, { createRef } from 'react'
import './style.scss'

export default class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.ref = createRef()

  }
  componentDidMount() {
    const cw = 500
    const ch = 500
    class Seem {
      constructor(
        x, y, l
      ) {
        this.b = (Math.random() * 1.9) + 0.1
        this.x0 = x
        this.y0 = y
        this.a = Math.random() * 2 * Math.PI
        this.x1 = this.x0 + (l * Math.cos(this.a))
        this.y1 = this.y0 + (l * Math.sin(this.a))
        this.l = l
      }
      update(x, y) {
        this.x0 = x
        this.y0 = y
        this.a = Math.atan2(this.y1 - this.y0, this.x1 - this.x0)
        this.x1 = this.x0 + (this.l * Math.cos(this.a))
        this.y1 = this.y0 + (this.l * Math.sin(this.a))
      }
    }
    class Rope {
      constructor(
        tx, ty, l, b, slq, typ
      ) {

        if (typ === 'l') {
          this.res = l / 2
        } else {
          this.res = l / slq
        }
        this.type = typ
        this.l = l
        this.segm = []
        this.segm.push(new Seem(
          tx, ty, this.l / this.res
        ))
        for (let i = 1; i < this.res; i++) {
          this.segm.push(new Seem(
            this.segm[i - 1].x1, this.segm[i - 1].y1, this.l / this.res
          ))
        }
        this.b = b
      }
      update(t) {
        this.segm[0].update(t.x, t.y)
        for (let i = 1; i < this.res; i++) {
          this.segm[i].update(this.segm[i - 1].x1, this.segm[i - 1].y1)
        }
      }
      show() {
        if (this.type === 'l') {
          c.beginPath()
          for (let i = 0; i < this.segm.length; i++) {
            c.lineTo(this.segm[i].x0, this.segm[i].y0)
          }
          c.lineTo(this.segm[this.segm.length - 1].x1,
            this.segm[this.segm.length - 1].y1)
          c.strokeStyle = 'white'
          c.lineWidth = this.b
          c.stroke()

          c.beginPath()
          c.arc(
            this.segm[0].x0, this.segm[0].y0, 1, 0, 2 * Math.PI
          )
          c.fillStyle = 'white'
          c.fill()

          c.beginPath()
          c.arc(
            this.segm[this.segm.length - 1].x1,
            this.segm[this.segm.length - 1].y1,
            2,
            0,
            2 * Math.PI
          )
          c.fillStyle = 'white'
          c.fill()
        } else {
          for (let i = 0; i < this.segm.length; i++) {
            c.beginPath()
            c.arc(
              this.segm[i].x0, this.segm[i].y0, this.segm[i].b, 0, 2 * Math.PI
            )
            c.fillStyle = 'white'
            c.fill()
          }
          c.beginPath()
          c.arc(
            this.segm[this.segm.length - 1].x1,
            this.segm[this.segm.length - 1].y1,
            2, 0, 2 * Math.PI
          )
          c.fillStyle = 'white'
          c.fill()
        }
      }
    }
    //setting up canvas
    const c = this.ref.current?.getContext('2d')
    const canvas = this.ref.current
    canvas.width = cw
    canvas.height = ch
    let w  = cw
    let h = ch
    const ropes = []

    //variables definition
    const mouse = {}
    const lastMouse = {}
    const rl = 50
    const randl = []
    const target = { x: w / 2, y: h / 2, }
    const lastTarget = {}
    let t = 0
    const q = 10
    const da = []
    let type = 'l'

    for (let i = 0; i < 100; i++) {
      if (Math.random() > 0.25) {
        type = 'l'
      } else {
        type = 'o'
      }
      ropes.push(new Rope(
        w / 2,
        h / 2,
        ((Math.random() * 1) + 0.5) * 500,
        (Math.random() * 0.4) + 0.1,
        (Math.random() * 15) + 5,
        type
      ))
      randl.push((Math.random() * 2) - 1)
      da.push(0)
    }

    //place for objects in animation
    function draw() {

      if (mouse.x) {
        target.errx = mouse.x - target.x
        target.erry = mouse.y - target.y
      } else {
        target.errx =
          (w / 2) +
          ((((h / 2) - q) *
          Math.sqrt(2) *
          Math.cos(t)) /
          (Math.pow(Math.sin(t), 2) + 1)) -
          target.x
        target.erry =
          (h / 2) +
          ((((h / 2) - q) *
          Math.sqrt(2) *
          Math.cos(t) *
          Math.sin(t)) /
          (Math.pow(Math.sin(t), 2) + 1)) -
          target.y
      }

      target.x += target.errx / 10
      target.y += target.erry / 10

      t += 0.01

      for (let i = 0; i < ropes.length; i++) {
        if (randl[i] > 0) {
          da[i] += (1 - randl[i]) / 10
        } else {
          da[i] += (-1 - randl[i]) / 10
        }
        ropes[i].update({
          x:
            target.x +
            ((randl[i] * rl * Math.cos((i * 2 * Math.PI)) / ropes.length) + da[i]),
          y:
            target.y +
           ((randl[i] * rl * Math.sin((i * 2 * Math.PI)) / ropes.length) + da[i]),
        })
        ropes[i].show()
      }
      lastTarget.x = target.x
      lastTarget.y = target.y
    }

    //mouse position
    canvas.addEventListener(
      'mousemove',
      function (e) {
        lastMouse.x = mouse.x
        lastMouse.y = mouse.y

        mouse.x = e.pageX - this.offsetLeft
        mouse.y = e.pageY - this.offsetTop
      },
      false
    )

    canvas.addEventListener('mouseleave', function() {
      mouse.x = false
      mouse.y = false
    })

    //animation frame
    function loop() {
      window.requestAnimationFrame(loop)
      c.clearRect(
        0, 0, w, h
      )
      draw()
    }

    //window resize
    window.addEventListener('resize', function () {
      w = cw
      h = ch
      loop()
    })

    loop()

  }

  render() {
    return (
      <div className='canvas-container'>
        <canvas ref={this.ref}></canvas>
      </div>
    )
  }
}
