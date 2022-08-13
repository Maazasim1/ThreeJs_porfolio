import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
const Home = () => {

  const mountRef = useRef(null);



  useEffect(() => {
    //Texture
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = () => {

    }
    const textureLoader = new THREE.TextureLoader(loadingManager)
    
    const matCapTexture = textureLoader.load('textures/matcaps/8.png')
    const gradientTextures = textureLoader.load('textures/gradients/3.jpg')
    gradientTextures.minFilter = THREE.NearestFilter
    gradientTextures.magFilter = THREE.NearestFilter

    const cubeTextureLoader = new THREE.CubeTextureLoader()
    
    //Font
    const fontLoader = new FontLoader()
    fontLoader.load(
      'fonts/helvetiker_regular.typeface.json',
      (font) => {

        const textGeometry = new TextGeometry
          (
            "Maaz Asim",
            {
              font,
              size: 0.5,
              height: 0.2,
              curveSegments: 5,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 4

            }
          )
    
        textGeometry.center()
        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matCapTexture
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture })

        for (let i = 0; i < 200; i++) {
          const donut = new THREE.Mesh(donutGeometry, donutMaterial)
          donut.position.x = Math.random() * 10 - 5
          donut.position.y = Math.random() * 10 - 5
          donut.position.z = Math.random() * 10 - 5

          donut.rotation.x = Math.random() * Math.PI
          donut.rotation.y = Math.random() * Math.PI
          const scale = Math.random()
          donut.scale.x = scale
          donut.scale.y = scale
          donut.scale.z = scale
          scene.add(donut)
        }
      }
    )
    //Mouse-Movement
    const cursor = {
      x: 0,
      y: 0
    }
    window.addEventListener('mousemove', (event) => {
      cursor.x = event.clientX / size.width - 0.5;
      cursor.y = -(event.clientY / size.height - 0.35);
    })
    //scene
    const scene = new THREE.Scene()
    const size = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
    camera.position.z = 5

    scene.add(camera)




    //Renderer

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true;

    //Detect Double Click
    window.addEventListener('dblclick', () => {

      if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen();

      }
      else if (document.fullscreenElement) {

        document.exitFullscreen();

      }

    })
    //Time
    const clock = new THREE.Clock()
    //Animation
    const tick = () => {
      //Time
      const elapsedTime = clock.getElapsedTime()
      //Render
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }

    tick()


    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);

  return (
    <div ref={mountRef}>

    </div>
  );
}

export default Home;