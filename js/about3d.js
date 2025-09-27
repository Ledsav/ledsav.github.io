// Modern ES6 Three.js with GLTF loader
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.addEventListener('load', function() {
  const canvas = document.getElementById('about-3d-canvas');
  if (!canvas) {
    return;
  }


  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 350/550, 0.1, 1000);
  camera.position.set(0, 0, 15);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(350, 550);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Enhanced lighting for GLTF
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xff6b35, 1, 10);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff6b35, 0.8, 10);
  pointLight2.position.set(-5, 5, -5);
  scene.add(pointLight2);

  // Variables
  let robot = null;
  let mixer = null;
  let animationTime = 0;
  let mouse = { x: 0, y: 0 };
  let isHovering = false;
  let robotParts = {};

  // Load YOUR GLTF robot model
  const loader = new GLTFLoader();


  loader.load(
    'assets/models/blue_the_minimalistic_robot/scene.gltf',
    function(gltf) {


      robot = gltf.scene;

      robot.scale.set(0.1, 0.1, 0.1);
      robot.position.set(0, 0, 0);
      robot.rotation.y = 0;

      // Enable shadows and catalog robot parts
      robot.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        // Store robot parts by name for individual control
        if (child.name && child.name !== '') {
          robotParts[child.name.toLowerCase()] = child;
          console.log('Robot part found:', child.name, child.type);
        }
      });

      // Log all available parts
      console.log('Available robot parts:', Object.keys(robotParts));

      // Set up animations if they exist
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(robot);
  

        gltf.animations.forEach((clip, index) => {
          const action = mixer.clipAction(clip);
          action.play();
          
        });
      }

      scene.add(robot);
    
    },
    function(progress) {
      const percent = Math.round((progress.loaded / progress.total) * 100);
    },
    function(error) {
      console.error('GLTF loading failed:', error);

      
    }
  );

  // Add particles
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse interaction
  function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener('mousemove', updateMousePosition);
  canvas.addEventListener('mouseenter', () => { isHovering = true; });
  canvas.addEventListener('mouseleave', () => { isHovering = false; });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    animationTime += deltaTime;

    // Update mixer for model animations
    if (mixer) {
      mixer.update(deltaTime);
    }

    // Animate robot
    if (robot) {
      if (isHovering) {
        // Follow mouse when hovering (corrected direction)
        const targetRotationY = +mouse.x * 0.5;
        const targetRotationX = -mouse.y * 0.5;

        // Smooth interpolation to target rotation
        robot.rotation.y += (targetRotationY - robot.rotation.y) * 0.1;
        robot.rotation.x += (targetRotationX - robot.rotation.x) * 0.1;

        // Animate individual robot mesh parts based on mouse position
        if (robotParts.defaultmaterial) {
          robotParts.defaultmaterial.rotation.y = mouse.x * 0.2;
          robotParts.defaultmaterial.rotation.x = -mouse.y * 0.1;
        }

        if (robotParts.defaultmaterial_1) {
          robotParts.defaultmaterial_1.rotation.z = Math.sin(animationTime * 2) * 0.1 + mouse.x * 0.05;
        }

        if (robotParts.defaultmaterial_2) {
          robotParts.defaultmaterial_2.rotation.z = -Math.sin(animationTime * 2.5) * 0.1 - mouse.x * 0.05;
        }

        if (robotParts.defaultmaterial_3) {
          robotParts.defaultmaterial_3.rotation.x = Math.cos(animationTime * 1.8) * 0.08 + mouse.y * 0.03;
        }

        if (robotParts.defaultmaterial_4) {
          robotParts.defaultmaterial_4.rotation.y = Math.sin(animationTime * 1.5) * 0.12 + mouse.x * 0.08;
        }

      } else {
        // Return to neutral when not hovering
        robot.rotation.y *= 0.95;
        robot.rotation.x *= 0.95;

        // Reset individual parts to neutral
        Object.values(robotParts).forEach(part => {
          if (part.rotation) {
            part.rotation.x *= 0.9;
            part.rotation.y *= 0.9;
            part.rotation.z *= 0.9;
          }
        });
      }

      robot.position.y = Math.sin(animationTime) * 0.2;
    }

    // Animate particles
    particles.rotation.y += 0.002;
    particles.rotation.x = Math.sin(animationTime * 0.5) * 0.1;
    particles.rotation.z = Math.cos(animationTime * 0.3) * 0.05;

    // Animate individual particle positions
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(animationTime + i) * 0.001; // Y movement
      positions[i] += Math.cos(animationTime + i * 0.1) * 0.0005; // X drift
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Dynamic lighting
    pointLight1.position.x = Math.sin(animationTime * 2) * 5;
    pointLight2.position.z = Math.cos(animationTime * 1.5) * 5;

    renderer.render(scene, camera);
  }

  animate();
});