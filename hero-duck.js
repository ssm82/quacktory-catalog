import * as THREE from "three";

const canvas = document.getElementById("hero-duck");
if (canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.3, 11);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffe5c2, 0.6));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(2.5, 4.5, 3);
  scene.add(keyLight);

  const warmRim = new THREE.DirectionalLight(0xff7a3a, 0.6);
  warmRim.position.set(-3, 1.5, 1.2);
  scene.add(warmRim);

  const coolRim = new THREE.DirectionalLight(0x6ea8ff, 0.4);
  coolRim.position.set(2.5, -1.5, -2);
  scene.add(coolRim);

  const makeMat = (hex, opts = {}) =>
    new THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.72,
      metalness: 0.02,
      flatShading: true,
      ...opts,
    });

  const bodyMat = makeMat(0xf39332);
  const bellyMat = makeMat(0xffc987, { roughness: 0.85 });
  const wingMat = makeMat(0xc96a1e);
  const beakMat = makeMat(0xf5a623, { roughness: 0.58 });
  const beakTipMat = makeMat(0xa83a16, { roughness: 0.62 });
  const footMat = makeMat(0xe77a1d);
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.3,
  });

  const duck = new THREE.Group();
  const baseScale = 1.4;
  duck.scale.set(baseScale, baseScale, baseScale);
  duck.position.set(0.0, -0.05, 0);
  scene.add(duck);

  const bodyGeo = new THREE.IcosahedronGeometry(1, 1).scale(0.82, 0.66, 1.48);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, -0.08, -0.18);
  duck.add(body);

  const bellyGeo = new THREE.IcosahedronGeometry(0.9, 1).scale(0.78, 0.34, 1.18);
  const belly = new THREE.Mesh(bellyGeo, bellyMat);
  belly.position.set(0, -0.48, 0.02);
  duck.add(belly);

  const neckGeo = new THREE.CylinderGeometry(0.27, 0.38, 0.74, 6, 1);
  const neck = new THREE.Mesh(neckGeo, bodyMat);
  neck.position.set(0, 0.34, 0.76);
  neck.rotation.x = 0.30;
  duck.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.73, 1.18);
  duck.add(headGroup);

  const headGeo = new THREE.IcosahedronGeometry(0.47, 1).scale(0.98, 0.94, 1.05);
  const head = new THREE.Mesh(headGeo, bodyMat);
  headGroup.add(head);

  const beakGeo = new THREE.BoxGeometry(0.70, 0.16, 0.56, 1, 1, 1);
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.position.set(0, -0.10, 0.56);
  headGroup.add(beak);

  const beakTipGeo = new THREE.BoxGeometry(0.38, 0.10, 0.12, 1, 1, 1);
  const beakTip = new THREE.Mesh(beakTipGeo, beakTipMat);
  beakTip.position.set(0, -0.10, 0.85);
  headGroup.add(beakTip);

  const eyeWhiteGeo = new THREE.SphereGeometry(0.1, 12, 10);
  const pupilGeo = new THREE.SphereGeometry(0.055, 12, 10);
  for (const sx of [-1, 1]) {
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhite.position.set(sx * 0.29, 0.12, 0.30);
    headGroup.add(eyeWhite);
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(sx * 0.32, 0.12, 0.37);
    headGroup.add(pupil);
  }

  const wingGeo = new THREE.OctahedronGeometry(0.55, 0);
  wingGeo.scale(0.92, 0.28, 1.12);

  const wingR = new THREE.Mesh(wingGeo, wingMat);
  wingR.position.set(0.66, -0.02, -0.22);
  wingR.rotation.set(-0.08, 0, -0.34);
  duck.add(wingR);

  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(-0.66, -0.02, -0.22);
  wingL.rotation.set(-0.08, 0, 0.34);
  duck.add(wingL);

  const tail = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.46, 0),
    bodyMat,
  );
  tail.scale.set(0.78, 0.62, 1.15);
  tail.position.set(0, 0.16, -1.56);
  tail.rotation.x = -0.20;
  duck.add(tail);

  const footGeo = new THREE.IcosahedronGeometry(0.34, 0);
  footGeo.scale(0.82, 0.18, 1.32);

  const footR = new THREE.Mesh(footGeo, footMat);
  footR.position.set(0.34, -0.78, 0.54);
  footR.rotation.y = -0.10;
  duck.add(footR);

  const footL = new THREE.Mesh(footGeo, footMat);
  footL.position.set(-0.34, -0.78, 0.54);
  footL.rotation.y = 0.10;
  duck.add(footL);

  const legGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.28, 5);
  for (const x of [-0.30, 0.30]) {
    const leg = new THREE.Mesh(legGeo, footMat);
    leg.position.set(x, -0.67, 0.22);
    duck.add(leg);
  }

  duck.rotation.set(-0.05, -0.45, 0);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const scale = Math.min(1.6, Math.max(0.9, w / 900));
    duck.scale.set(scale, scale, scale);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let running = true;
  let paused = reduced;
  let rafId = 0;

  const clock = new THREE.Clock();
  function tick() {
    rafId = 0;
    if (!running || paused) return;
    const t = clock.getElapsedTime();
    duck.rotation.y = -0.45 + Math.sin(t * 0.45) * 0.08;
    duck.position.y = 0.05 + Math.sin(t * 1.6) * 0.05;
    headGroup.rotation.z = Math.sin(t * 0.9) * 0.05;
    headGroup.rotation.x = Math.sin(t * 0.7 + 1.0) * 0.04;
    wingR.rotation.x = Math.sin(t * 1.2) * 0.10 - 0.08;
    wingL.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.10 - 0.08;
    tail.rotation.y = Math.sin(t * 0.8) * 0.18;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  function scheduleTick() {
    if (!rafId && running && !paused) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function renderOnce() {
    renderer.render(scene, camera);
  }

  const heroCard = canvas.closest(".hero-card") || canvas;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          running = entry.isIntersecting;
          if (running) scheduleTick();
        }
      },
      { threshold: 0 }
    );
    requestAnimationFrame(() => {
      resize();
      observer.observe(heroCard);
      renderOnce();
    });
  } else {
    running = true;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!paused) {
      running = true;
      scheduleTick();
    }
  });

  if (reduced) {
    paused = true;
    renderOnce();
  } else {
    scheduleTick();
  }
}
