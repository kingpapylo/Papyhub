/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// tslint:disable:organize-imports
// tslint:disable:ban-malformed-import-paths
// tslint:disable:no-new-decorators

import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Analyser} from './analyser';

import * as THREE from 'three';
import {EXRLoader} from 'three/addons/loaders/EXRLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {fs as backdropFS, vs as backdropVS} from './backdrop-shader';
import {vs as sphereVS} from './sphere-shader';

/**
 * 3D live audio visual.
 */
@customElement('gdm-live-audio-visuals-3d')
export class GdmLiveAudioVisuals3D extends LitElement {
  private inputAnalyser!: Analyser;
  private outputAnalyser!: Analyser;
  private camera!: THREE.PerspectiveCamera;
  private backdrop!: THREE.Mesh;
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;
  private sphere!: THREE.Mesh;
  private particles!: THREE.Points;
  private particlePositions!: Float32Array;
  private particleVelocities!: Float32Array;
  private lights: THREE.PointLight[] = [];
  private lastThresholdTime = 0;
  private prevTime = 0;
  private hueOffset = 0;
  private rotation = new THREE.Vector3(0, 0, 0);

  @property({type: Boolean}) isWakeWordListening = false;

  private _outputNode!: AudioNode;

  @property()
  set outputNode(node: AudioNode) {
    this._outputNode = node;
    this.outputAnalyser = new Analyser(this._outputNode);
  }

  get outputNode() {
    return this._outputNode;
  }

  private _inputNode!: AudioNode;

  @property()
  set inputNode(node: AudioNode) {
    this._inputNode = node;
    this.inputAnalyser = new Analyser(this._inputNode);
  }

  get inputNode() {
    return this._inputNode;
  }

  private canvas!: HTMLCanvasElement;

  static styles = css`
    canvas {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      inset: 0;
      image-rendering: pixelated;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  private init() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100c14);

    const backdrop = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 5),
      new THREE.RawShaderMaterial({
        uniforms: {
          resolution: {value: new THREE.Vector2(1, 1)},
          rand: {value: 0},
        },
        vertexShader: backdropVS,
        fragmentShader: backdropFS,
        glslVersion: THREE.GLSL3,
      }),
    );
    backdrop.material.side = THREE.BackSide;
    scene.add(backdrop);
    this.backdrop = backdrop;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(2, -2, 5);
    this.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio / 1);

    const geometry = new THREE.IcosahedronGeometry(1, 10);

    new EXRLoader().load('piz_compressed.exr', (texture: THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      sphereMaterial.envMap = exrCubeRenderTarget.texture;
      sphere.visible = true;
    });

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x000010,
      metalness: 0.5,
      roughness: 0.1,
      emissive: 0x000010,
      emissiveIntensity: 1.5,
    });

    sphereMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.time = {value: 0};
      shader.uniforms.inputData = {value: new THREE.Vector4()};
      shader.uniforms.outputData = {value: new THREE.Vector4()};

      sphereMaterial.userData.shader = shader;

      shader.vertexShader = sphereVS;
    };

    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(sphere);
    sphere.visible = false;

    this.sphere = sphere;

    // Particle System
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);
    this.particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      this.particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(this.particles);

    // Add dynamic lights
    const light1 = new THREE.PointLight(0x3b82f6, 10, 10);
    const light2 = new THREE.PointLight(0xef4444, 10, 10);
    scene.add(light1);
    scene.add(light2);
    this.lights.push(light1, light2);

    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    const renderPass = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      5,
      0.5,
      0,
    );

    const fxaaPass = new ShaderPass(FXAAShader);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    // composer.addPass(fxaaPass);
    composer.addPass(bloomPass);

    this.composer = composer;
    this.bloomPass = bloomPass;

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      const dPR = renderer.getPixelRatio();
      const w = window.innerWidth;
      const h = window.innerHeight;
      backdrop.material.uniforms.resolution.value.set(w * dPR, h * dPR);
      renderer.setSize(w, h);
      composer.setSize(w, h);
      fxaaPass.material.uniforms['resolution'].value.set(
        1 / (w * dPR),
        1 / (h * dPR),
      );
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    this.animation();
  }

  private animation() {
    requestAnimationFrame(() => this.animation());

    this.inputAnalyser.update();
    this.outputAnalyser.update();

    const t = performance.now();
    const dt = (t - this.prevTime) / (1000 / 60);
    this.prevTime = t;

    // Update hue offset based on time and audio intensity
    const totalIntensity = (this.inputAnalyser.data[0] + this.outputAnalyser.data[0]) / 510;
    this.hueOffset += dt * 0.001 * (1 + totalIntensity * 5);

    const backdropMaterial = this.backdrop.material as THREE.RawShaderMaterial;
    const sphereMaterial = this.sphere.material as THREE.MeshStandardMaterial;

    backdropMaterial.uniforms.rand.value = Math.random() * 10000;

    if (sphereMaterial.userData.shader) {
      // Extract frequency bands
      const getAverage = (data: Uint8Array, start: number, end: number) => {
        let sum = 0;
        for (let i = start; i <= end; i++) sum += data[i];
        return sum / (end - start + 1) / 255;
      };

      const inputBass = getAverage(this.inputAnalyser.data, 0, 3);
      const inputMid = getAverage(this.inputAnalyser.data, 4, 9);
      const inputTreble = getAverage(this.inputAnalyser.data, 10, 15);

      const outputBass = getAverage(this.outputAnalyser.data, 0, 3);
      const outputMid = getAverage(this.outputAnalyser.data, 4, 9);
      const outputTreble = getAverage(this.outputAnalyser.data, 10, 15);

      const f = 0.001;
      this.rotation.x += (dt * f * 0.5 * this.outputAnalyser.data[1]) / 255;
      this.rotation.z += (dt * f * 0.5 * this.inputAnalyser.data[1]) / 255;
      this.rotation.y += (dt * f * 0.25 * this.inputAnalyser.data[2]) / 255;
      this.rotation.y += (dt * f * 0.25 * this.outputAnalyser.data[2]) / 255;

      const euler = new THREE.Euler(
        this.rotation.x,
        this.rotation.y,
        this.rotation.z,
      );
      const quaternion = new THREE.Quaternion().setFromEuler(euler);
      const vector = new THREE.Vector3(0, 0, 5);
      vector.applyQuaternion(quaternion);
      this.camera.position.copy(vector);
      this.camera.lookAt(this.sphere.position);

      sphereMaterial.userData.shader.uniforms.time.value +=
        (dt * 0.1 * this.outputAnalyser.data[0]) / 255;
      sphereMaterial.userData.shader.uniforms.inputData.value.set(
        (2.5 * this.inputAnalyser.data[0]) / 255,
        (0.2 * this.inputAnalyser.data[1]) / 255,
        (15 * this.inputAnalyser.data[2]) / 255,
        0,
      );
      sphereMaterial.userData.shader.uniforms.outputData.value.set(
        (2 * this.outputAnalyser.data[0]) / 255,
        (0.1 * this.outputAnalyser.data[1]) / 255,
        (10 * this.outputAnalyser.data[2]) / 255,
        0,
      );

      // Update dynamic lights
      const inputLevel = this.inputAnalyser.data[0] / 255;
      const outputLevel = this.outputAnalyser.data[0] / 255;

      // Pulse scale based on both input and output
      this.sphere.scale.setScalar(
        1 + (0.2 * outputLevel) + (0.15 * inputLevel)
      );

      if (this.isWakeWordListening && !inputLevel && !outputLevel) {
        const pulse = Math.sin(t * 0.002) * 0.5 + 0.5;
        this.lights[0].intensity = 2 + 10 * pulse;
        this.lights[1].intensity = 2 + 10 * pulse;
        this.lights[0].color.setHSL(0.5, 1, 0.5); // Cyan pulse
        this.lights[1].color.setHSL(0.5, 1, 0.5);
      } else {
        this.lights[0].intensity = 5 + 50 * outputLevel;
        this.lights[1].intensity = 5 + 50 * inputLevel;
      }

      const time = t * 0.001;
      this.lights[0].position.set(
        Math.cos(time) * 3,
        Math.sin(time * 0.5) * 3,
        Math.sin(time) * 3
      );
      this.lights[1].position.set(
        Math.sin(time * 0.7) * 4,
        Math.cos(time * 0.3) * 4,
        Math.cos(time * 0.5) * 4
      );

      // Dynamic color shifts
      const outputHue = (0.6 + this.hueOffset + outputMid * 0.2) % 1.0;
      const inputHue = (0.95 + this.hueOffset + inputMid * 0.2) % 1.0;

      // Pulse emissive based on output
      sphereMaterial.emissive.setHSL(outputHue, 0.8, 0.1 + 0.4 * outputLevel);
      sphereMaterial.emissiveIntensity = 1.5 + 5 * outputLevel;

      // Pulse base color based on input
      sphereMaterial.color.setHSL(inputHue, 0.8, 0.05 + 0.3 * inputLevel);

      // Update lights colors to match
      this.lights[0].color.setHSL(outputHue, 0.9, 0.5);
      this.lights[1].color.setHSL(inputHue, 0.9, 0.5);

      // Update bloom strength
      this.bloomPass.strength = 1.5 + 4 * outputLevel + 2 * inputLevel;

      if (this.isWakeWordListening && !inputLevel && !outputLevel) {
        this.bloomPass.strength += Math.sin(t * 0.005) * 0.5 + 0.5;
      }

      // Update particles
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      const particleMaterial = this.particles.material as THREE.PointsMaterial;
      
      const combinedLevel = (inputLevel + outputLevel) * 0.5;
      particleMaterial.opacity = 0.1 + 0.9 * combinedLevel;
      
      // Particles shift between input and output hues
      const particleHue = (this.hueOffset + (inputLevel > outputLevel ? inputHue : outputHue)) % 1.0;
      particleMaterial.color.setHSL(particleHue, 0.8, 0.4 + 0.6 * outputLevel);
      particleMaterial.size = 0.01 + 0.15 * (inputLevel + outputLevel + inputTreble + outputTreble);

      const speedMult = 1 + 15 * combinedLevel;
      const swirlMult = 3 * combinedLevel;

      for (let i = 0; i < positions.length / 3; i++) {
        const idx = i * 3;
        
        // Current position
        const x = positions[idx];
        const y = positions[idx + 1];
        const z = positions[idx + 2];
        
        // Vortex effect (swirl around Y axis)
        const swirlX = -z * swirlMult * 0.05;
        const swirlZ = x * swirlMult * 0.05;

        // Apply velocities and swirl
        positions[idx] += (this.particleVelocities[idx] * speedMult + swirlX) * dt;
        positions[idx + 1] += this.particleVelocities[idx + 1] * speedMult * dt;
        positions[idx + 2] += (this.particleVelocities[idx + 2] * speedMult + swirlZ) * dt;

        const distSq = x * x + y * y + z * z;
        const dist = Math.sqrt(distSq);

        // Probability of reset increases with audio level (simulating emission bursts)
        const resetProb = 0.002 + 0.08 * combinedLevel;

        if (dist > 8 || dist < 0.3 || Math.random() < resetProb) {
          // Reset particle to sphere surface or just outside
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const r = 0.8 + Math.random() * 0.4; // Start near the sphere
          
          positions[idx] = r * Math.sin(theta) * Math.cos(phi);
          positions[idx + 1] = r * Math.sin(theta) * Math.sin(phi);
          positions[idx + 2] = r * Math.cos(theta);
          
          // Velocity is mostly radial outwards
          const vMult = 0.01 + 0.03 * Math.random();
          this.particleVelocities[idx] = (positions[idx] / r) * vMult;
          this.particleVelocities[idx + 1] = (positions[idx + 1] / r) * vMult;
          this.particleVelocities[idx + 2] = (positions[idx + 2] / r) * vMult;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;

      // Camera shake on loud sounds
      if (combinedLevel > 0.7) {
        this.camera.position.x += (Math.random() - 0.5) * 0.15 * combinedLevel;
        this.camera.position.y += (Math.random() - 0.5) * 0.15 * combinedLevel;
        this.camera.position.z += (Math.random() - 0.5) * 0.15 * combinedLevel;
      }

      // Play threshold sound if intensity is high
      if ((inputLevel > 0.8 || outputLevel > 0.8) && t - this.lastThresholdTime > 500) {
        this.playThresholdSound();
        this.lastThresholdTime = t;
      }
    }

    this.composer.render();
  }

  private playThresholdSound() {
    const ctx = this.inputNode.context;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  protected firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector('canvas') as HTMLCanvasElement;
    this.init();
  }

  protected render() {
    return html`<canvas></canvas>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gdm-live-audio-visuals-3d': GdmLiveAudioVisuals3D;
  }
}
