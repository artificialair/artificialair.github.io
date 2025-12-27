const BACKGROUND = "#333"
const FOREGROUND = "#00FF00"
gaming.width = 800
gaming.height = 800
const ctx = gaming.getContext("2d")

vs = []
fs = []
fetch('assets/js/velociraptor.json')
    .then(response => response.json())  
    .then(data => {
        vs = data.vs
        fs = data.fs
    })

function clean() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, gaming.width, gaming.height)
    ctx.fillStyle = FOREGROUND
}

function place({x, y}) {
    const s = 10
    ctx.fillRect(x - s / 2, y - s / 2, s, s)
}

var screen = (p) => ({
    x: (p.x + 1) / 2 * gaming.width, 
    y: (1 - p.y) / 2 * gaming.height
});

var project = ({x, y, z}) => ({
    x: x/z, 
    y: y/z
});

var draw_line = (p1, p2) => {
    ctx.strokeStyle = FOREGROUND
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

var translate_z = ({x, y, z}, dz) => ({x, y, z: z + dz});

var rotate_xz = ({x, y, z}, d) => {
    s = Math.sin(d)
    c = Math.cos(d)
    return {
        x: x * c - z * s, 
        y, 
        z: x * s + z * c
    }
}

const FPS = 60
let dz = 1.2
let angle = 0

function frame() {
    const dt = 1 / FPS
    angle += Math.PI * dt
    clean()
    // for (const v of vs) {
    //     place(screen(project(translate_z(rotate_xz(v, angle), dz))))
    // }
    for (const f of fs) {
        for (let l = 0; l < f.length; l++) {
            p1 = vs[f[l]]
            p2 = vs[f[(l + 1) % f.length]]
            draw_line(
                screen(project(translate_z(rotate_xz(p1, angle), dz))), 
                screen(project(translate_z(rotate_xz(p2, angle), dz))), 
            )
        }
    }
    setTimeout(frame, 1000 / FPS);
}

setTimeout(frame, 1000 / FPS);