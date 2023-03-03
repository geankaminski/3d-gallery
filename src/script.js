import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "Anonymous"

/**
 * Base
 */
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// add a plan to the scene
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: '#777777'
    })
)

plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true
scene.add(plane)

const photos = new THREE.Group()

function addPhoto (x, y, z, photo) {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: '#777777',
            map: photo,
            needsUpdate: true
        })
    )

    plane.rotation.x = - Math.PI * 0.5
   /*   plane.rotation.y = Math.random() * Math.PI
    plane.rotation.z = Math.random() * Math.PI */
    plane.position.x = x
    plane.position.y = y
    plane.position.z = z
    plane.castShadow = true

    photos.add(plane)
}

scene.add(photos)

const photo1 = textureLoader.load('https://fastly.picsum.photos/id/342/200/200.jpg?hmac=RWvP86WrI79J1lVaj-tfUFqvBHgAWnsRKVI9ER9Hdzc')
const photo2 = textureLoader.load('https://fastly.picsum.photos/id/683/200/200.jpg?hmac=gsOZBaeY42qvlTQSCuucn40FRUEnTdDYKl9q-YMcZh4')
const photo3 = textureLoader.load('https://fastly.picsum.photos/id/1051/200/200.jpg?hmac=s6d4ypEjpec8nvA2zqhWzx_6ogXYM2fJ_YJwaOM1CUA')
const photo4 = textureLoader.load('https://fastly.picsum.photos/id/992/200/200.jpg?hmac=PEyYl5Ux8jQFkEiXZfFSBThSPRQU1BsrdSMruB1lD4k')
const photo5 = textureLoader.load('https://fastly.picsum.photos/id/1016/200/200.jpg?hmac=VXVyuNaCgLl1UAdVez4gIo7AzMowZxMZVlIKlHMjgBw')

for(let i = 0; i < 20; i++) {
    for(let j = 0; j < 20; j++) {
        const x = (i - 10) * 10
        const z = (j - 10) * 10
        const y = Math.random() * 40

        const photo = [photo1, photo2, photo3, photo4, photo5][Math.floor(Math.random() * 5)]

        addPhoto(x, y, z, photo)
    }
}

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.set(20, 55, 10)
scene.add(camera)

// gui.add(camera.position, 'x').min(- 5).max(5).step(0.001).name('cameraX')
gui.add(camera.position, 'y').min(1).max(80).step(0.00001).name('cameraY')
gui.add(camera.position, 'z').min(- 60).max(60).step(0.00001).name('cameraZ')

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let selectedPhoto = null

const tick = () =>
{
    // Update controls
    controls.update()

    if(!selectedPhoto) {
         selectedPhoto = photos.children[Math.floor(Math.random() * photos.children.length)]
    }

    if(selectedPhoto.position.y > 0.01) {
        selectedPhoto.position.y -= 0.3
    } else {
        selectedPhoto = null
    }

    camera.position.x = Math.sin(Date.now() * 0.0003) * 40
    camera.lookAt(scene.position)


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()