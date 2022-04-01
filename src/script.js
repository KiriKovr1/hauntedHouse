import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'


// Fullscrean
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullScreen) {
            canvas.webkitRequestFullScreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

const fogDebug = gui.addFolder('fog')
fogDebug.add(fog, 'near', 0, 5, 0.005)
fogDebug.add(fog, 'far', 5, 20, 0.005)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColor = textureLoader.load('textures/door/color.jpg')
const doorAlpha = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('textures/door/height.jpg')
const doorMetalness = textureLoader.load('textures/door/metalness.jpg')
const doorNormal = textureLoader.load('textures/door/normal.jpg')
const doorRoughness = textureLoader.load('textures/door/roughness.jpg')

const wallsColor = textureLoader.load('textures/stone/color.jpg')
const wallsAmbirntOcclusion = textureLoader.load('textures/stone/ambientOcclusion.jpg')
const wallsNormal = textureLoader.load('textures/stone/normal.jpg')

const grassColor = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcclusion = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRouggness = textureLoader.load('textures/grass/roughness.jpg')

grassColor.repeat.set(8, 8)
grassAmbientOcclusion.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRouggness.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRouggness.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRouggness.wrapT = THREE.RepeatWrapping


/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4, 100, 100),
    new THREE.MeshStandardMaterial({
        color: '#ac8e82',
        map: wallsColor,
        aoMap: wallsAmbirntOcclusion,
        normalMap: wallsNormal
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = walls.geometry.parameters.height * 0.5
house.add(walls)

// Roof 
const roofSizes = {
    radius: 3.2,
    height: 2
}
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(roofSizes.radius, roofSizes.height, 4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45'
    })
)
roof.position.y = walls.geometry.parameters.height + 1
roof.rotation.y = Math.PI * 0.25

// Door
const doorMaterial = new THREE.MeshStandardMaterial()

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.8, 100, 100),
    doorMaterial
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
console.log(door.geometry)

doorMaterial.transparent = true
doorMaterial.map = doorColor
doorMaterial.alphaMap = doorAlpha
doorMaterial.aoMap = doorAmbientOcclusion
doorMaterial.displacementMap = doorHeight
doorMaterial.displacementScale = 0.100
doorMaterial.normalMap = doorNormal
doorMaterial.metalnessMap = doorMetalness
doorMaterial.roughnessMap = doorRoughness

door.position.y = door.geometry.parameters.height * 0.5
door.position.z = (walls.geometry.parameters.width * 0.5) + 0.01

house.add(roof, door)

// Bushes
const bushes = new THREE.Group()

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#89c854'
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

bushes.add(bush1, bush2, bush3, bush4)
scene.add(bushes)

// Graves 
const graves = new THREE.Group()
scene.add(graves)

const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#b2b6b1'
})

for (let i = 0; i < 50; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 3.5 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const fontLoader = new FontLoader()

    const grave = new THREE.Group()

    const rightDetailOfGrave = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.05, 0.8, 0.15),
        graveMaterial
    )
    const centerDetailOfGrave1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.590, 0.55, 0.15),
        graveMaterial
    )

    const centerDetailOfGrave2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.6, 0.1, 0.15),
        graveMaterial
    )

    const centerDetailOfGrave3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.6, 0.8, 0.08),
        graveMaterial
    )

    const leftDetailOfGrave = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.05, 0.8, 0.15),
        graveMaterial
    )

    leftDetailOfGrave.position.x = -(0.3)
    rightDetailOfGrave.position.x = 0.3
    centerDetailOfGrave1.position.y = -0.15
    centerDetailOfGrave2.position.y = 0.35
    centerDetailOfGrave3.position.z = -0.035

    fontLoader.load(
        '/font/helvetiker_regular.typeface.json',
        (loadedFont) => {
            const textGeometry = new TextGeometry(
                'R . I . P',
                {
                    font: loadedFont,
                    size: 0.10,
                    height: 0.12,
                    curveSegments: 20,
                    bevelEnabled: true,
                    bevelThickness: 0,
                    bevelSize: 0.010,
                    bevelOffset: 0,
                    bevelSegments: 0,
                }
            )
            textGeometry.computeBoundingBox()
            textGeometry.center()

            const text = new THREE.Mesh(textGeometry, graveMaterial)

            text.position.y = 0.22

            grave.add(text)
        }
    )

    grave.add(
        rightDetailOfGrave,
        leftDetailOfGrave,
        centerDetailOfGrave1,
        centerDetailOfGrave2,
        centerDetailOfGrave3
    )

    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    rightDetailOfGrave.castShadow = true
    leftDetailOfGrave.castShadow = true
    centerDetailOfGrave1.castShadow = true
    centerDetailOfGrave2.castShadow = true
    centerDetailOfGrave3.castShadow = true

    graves.add(grave)
}

// Axes 
const axes = new THREE.AxesHelper()
axes.visible = false
scene.add(axes)


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: '#a9c388',
        map: grassColor,
        aoMap: grassAmbientOcclusion,
        normalMap: grassNormal,
        roughnessMap: grassRouggness
    })
)

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0

floor.receiveShadow = true

scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)

const debugAmbientLight = gui.addFolder('ambient light')
debugAmbientLight.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)

const debugMoonLight = gui.addFolder('moon light')
debugMoonLight.add(moonLight, 'intensity').min(0).max(1).step(0.001)
debugMoonLight.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
debugMoonLight.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
debugMoonLight.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

const houseDebug = gui.addFolder('house')
houseDebug.add(doorLight, 'intensity', 0, 5, 0.005)

// scene.add(windowLightHelper)
/**
 *  Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 *  Shadows
 */

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(ghost3Angle * 5) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()