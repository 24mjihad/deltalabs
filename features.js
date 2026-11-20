import * as THREE from 'three';
import {GLTFLoader} from './assets/vendor/GLTFLoader.js';
const stage=document.querySelector('#model-stage'),status=stage.querySelector('.model-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const data={
 sensing:{kicker:'BRAIN & EYE SIGNALS',title:'Listen to your sleep.',copy:'EEG and EOG sensing are designed to estimate sleep stages from brain and eye signals. The goal: useful sleep insights and a smart wake window for naps or overnight sleep. Integrated accuracy and wake benefits are still being tested.',anchor:'sleep-pressure',offset:[.015,-.065,-.11]},
 light:{kicker:'A PERSONAL SUNRISE',title:'Bring the dawn closer.',copy:'A diffused inner light is designed to rise gradually before you wake. Pair it with sound for a more intentional morning. Light timing matters for your body clock; the mask is not established as treatment for SAD or jet lag.',anchor:'morning-light',offset:[0,-.055,-.12]},
 audio:{kicker:'SOUND, BUILT IN',title:'One less thing to wear.',copy:'Integrated stereo speakers bring bedtime audio and planned sleep-timed cues into the mask. No separate earbuds to keep in place. Sound delivery is part of the design; sleep improvement and memory benefits have not been established.',anchor:'seasonal-light',offset:[-.08,-.035,-.09]},
 comfort:{kicker:'THE PART YOU FEEL',title:'Let the day fall away.',copy:'A soft, removable, washable cushion and flexible construction are designed around nightly wear. Comfort and light blocking matter before any algorithm does. Final textiles, fit, and long-term comfort are being refined.',anchor:'daily-life',offset:[0,.015,.14]},
 fit:{kicker:'A FLEXIBLE CONNECTION',title:'Find your fit.',copy:'An adjustable magnetic strap is designed to make the mask easy to put on and hold comfortably in place. Stable contact also matters for sensing, so fit and signal quality are being developed together.',anchor:'daily-life',offset:[.09,.025,0]},
 power:{kicker:'READY FOR THE NEXT NIGHT',title:'Rest. Recharge. Repeat.',copy:'Battery-powered electronics and planned wireless charging keep the bedtime setup simple. Charging supports the experience; sleep sensing, sound, comfort, and wake light are what the system is built around.',anchor:'daily-life',offset:[-.07,.035,-.06]}
};
let selected=null,model,parts={},targets={},rotationTarget=.32,tiltTarget=0,ready=false,dragging=false,lastInteraction=-10000,dragX=0,dragY=0,velocity=0,autoRotate=!reduced;
const spin=document.createElement('button');spin.className='spin-toggle';spin.setAttribute('aria-pressed',String(!autoRotate));spin.textContent=autoRotate?'PAUSE ROTATION Ⅱ':'PLAY ROTATION ▷';document.querySelector('.reset-model').after(spin);spin.addEventListener('click',()=>{autoRotate=!autoRotate;spin.setAttribute('aria-pressed',String(!autoRotate));spin.textContent=autoRotate?'PAUSE ROTATION Ⅱ':'PLAY ROTATION ▷';lastInteraction=-10000;velocity=0;});
const buttons=[...document.querySelectorAll('[data-part]')];
function select(key,updateHash=true){
 if(!data[key])return;selected=key;velocity=0;const d=data[key];
 document.querySelector('#part-kicker').textContent=d.kicker;document.querySelector('#part-title').textContent=d.title;document.querySelector('#part-copy').textContent=d.copy;document.querySelector('#part-science').href='sleep.html#'+d.anchor;
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===key)));
 for(const name in parts){targets[name]=new THREE.Vector3();if(['sensing','audio','power'].includes(name))parts[name].visible=name===key;}
 const angle=key==='comfort'?2.65:.32;rotationTarget+=Math.atan2(Math.sin(angle-rotationTarget),Math.cos(angle-rotationTarget));lastInteraction=performance.now();
 if(parts.shell&&key!=='fit'&&key!=='comfort')targets.shell=new THREE.Vector3(0,.055,-.15);
 if(parts[key])targets[key]=new THREE.Vector3(...d.offset);
 if(updateHash)history.replaceState(null,'','#'+key);
}
buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.part)));
document.querySelector('.reset-model').addEventListener('click',()=>{
 selected=null;tiltTarget=0;velocity=0;lastInteraction=performance.now();for(const name in parts){targets[name]=new THREE.Vector3();if(['sensing','audio','power'].includes(name))parts[name].visible=false;}buttons.forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelector('#part-kicker').textContent='THE DELTALABS MASK';document.querySelector('#part-title').textContent='Designed together.';document.querySelector('#part-copy').textContent='Select another part to explore the system. Each layer returns smoothly to its assembled position.';document.querySelector('#part-science').href='sleep.html';history.replaceState(null,'',location.pathname);
});
window.addEventListener('hashchange',()=>select(location.hash.slice(1),false));
try{
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;stage.prepend(renderer.domElement);
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive mask. Drag or swipe to rotate. Use arrow keys to change the view.');
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;dragX=e.clientX;dragY=e.clientY;velocity=0;lastInteraction=performance.now();canvas.setPointerCapture(e.pointerId);stage.classList.add('dragging');});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-dragX,dy=e.clientY-dragY;velocity=dx*.006;rotationTarget+=velocity;tiltTarget=THREE.MathUtils.clamp(tiltTarget+dy*.004,-.65,.65);dragX=e.clientX;dragY=e.clientY;lastInteraction=performance.now();});
 const release=()=>{dragging=false;lastInteraction=performance.now();stage.classList.remove('dragging');};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{if(dragging)release();});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();lastInteraction=performance.now();if(e.key==='ArrowLeft')rotationTarget-=.18;if(e.key==='ArrowRight')rotationTarget+=.18;if(e.key==='ArrowUp')tiltTarget=Math.max(-.65,tiltTarget-.12);if(e.key==='ArrowDown')tiltTarget=Math.min(.65,tiltTarget+.12);if(e.key==='Home'){tiltTarget=0;rotationTarget+=Math.atan2(Math.sin(.32-rotationTarget),Math.cos(.32-rotationTarget));}});
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.001,10);camera.position.set(0,.16,-.64);camera.lookAt(0,0,.015);
 scene.add(new THREE.HemisphereLight(0xffffff,0x292f35,2.8));
 for(const [x,y,z,intensity] of [[-.3,.3,-.4,5],[.3,.12,.2,4],[0,-.2,-.3,1]]){const l=new THREE.DirectionalLight(0xffffff,intensity);l.position.set(x,y,z);scene.add(l);}
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<600?-.78:-.64;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
 new GLTFLoader().load('./assets/mask.glb',g=>{
  model=g.scene;scene.add(model);model.rotation.y=.32;model.position.y=-.008;
  for(const key of ['shell','sensing','light','comfort','fit','audio','power']){const o=model.getObjectByName(key);if(o){parts[key]=o;targets[key]=new THREE.Vector3();o.userData.base=o.position.clone();}}
  model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.frustumCulled=false;let p=o;while(p.parent&&p.parent!==model)p=p.parent;const key=p.name;const color={shell:0x202326,comfort:0x17191b,fit:0x25282a,sensing:0x244f40,light:0xe9dfc9,audio:0x917553,power:0x404348}[key]||0x303336;o.material=new THREE.MeshStandardMaterial({color,roughness:.74,metalness:key==='sensing'?.25:.05,side:THREE.DoubleSide});}});
  if(parts.light)parts.light.traverse(o=>{if(o.isMesh){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.color.set('#eee9dc');m.emissive.set('#e0b98b');m.emissiveIntensity=.18;});}});
  // Attach a woven surface and the original brand artwork to the outer shell.
  const cloth=document.createElement('canvas');cloth.width=1024;cloth.height=512;const ctx=cloth.getContext('2d');ctx.fillStyle='#25292c';ctx.fillRect(0,0,1024,512);
  for(let y=0;y<512;y+=3){ctx.strokeStyle=y%6?'#34383b':'#1d2022';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1024,y);ctx.stroke();}for(let x=0;x<1024;x+=3){ctx.fillStyle=x%6?'#ffffff07':'#00000020';ctx.fillRect(x,0,1,512);}
  const clothTexture=new THREE.CanvasTexture(cloth);clothTexture.colorSpace=THREE.SRGBColorSpace;clothTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  if(parts.shell)parts.shell.traverse(o=>{if(o.isMesh){const pos=o.geometry.attributes.position,uv=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){uv[i*2]=.5-pos.getX(i)/.275;uv[i*2+1]=.5+pos.getY(i)/.12;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material.map=clothTexture;o.material.color.set(0xffffff);o.material.needsUpdate=true;}});
  const logo=new Image();logo.onload=()=>{ctx.drawImage(logo,395,135,234,132);clothTexture.needsUpdate=true;};logo.src='./assets/wordmark.svg';
  for(const key of ['sensing','audio','power'])if(parts[key])parts[key].visible=false;
  ready=true;stage.classList.add('model-loaded');status.textContent='DRAG TO ROTATE · SELECT A PART TO EXPLORE';if(data[location.hash.slice(1)])select(location.hash.slice(1),false);
 },undefined,()=>{status.textContent='3D view unavailable. Explore every feature using the buttons.';stage.querySelector('.hotspots').hidden=true;});
 const anchors={sensing:[-.05,.015,-.05],light:[.035,.01,-.055],audio:[-.1,0,.025],comfort:[0,-.025,.08],fit:[.125,.005,.07],power:[.075,.025,0]};
 let previous=performance.now(),onScreen=true;new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;}).observe(stage);function draw(now){requestAnimationFrame(draw);if(now-previous<33)return;const dt=Math.min((now-previous)/1000,.06);previous=now;if(document.hidden||!onScreen)return;
  if(model){if(!dragging){if(autoRotate&&now-lastInteraction>5000)rotationTarget+=dt*.065;else if(Math.abs(velocity)>.00001){rotationTarget+=velocity;velocity*=Math.exp(-dt*9);}}const blend=reduced?1:1-Math.exp(-dt*5);model.rotation.y=THREE.MathUtils.lerp(model.rotation.y,rotationTarget,blend);model.rotation.x=THREE.MathUtils.lerp(model.rotation.x,tiltTarget,blend);for(const [key,o] of Object.entries(parts)){o.position.lerp(o.userData.base.clone().add(targets[key]),blend);}
   model.updateMatrixWorld(true);const placed=[];for(const b of stage.querySelectorAll('.hotspot')){const key=b.dataset.part;const p=new THREE.Vector3(...anchors[key]);if(targets[key])p.add(parts[key]?.position.clone().sub(parts[key].userData.base)||new THREE.Vector3());p.applyMatrix4(model.matrixWorld).project(camera);let x=THREE.MathUtils.clamp((p.x*.5+.5)*stage.clientWidth,22,stage.clientWidth-22),y=THREE.MathUtils.clamp((-p.y*.5+.5)*stage.clientHeight,210,stage.clientHeight-60);for(let k=0;k<6;k++){if(placed.some(q=>Math.hypot(x-q.x,y-q.y)<42))y+=43;else break;}placed.push({x,y});b.style.left=x+'px';b.style.top=y+'px';b.hidden=!ready||p.z>1;}
  }renderer.render(scene,camera);
 }requestAnimationFrame(draw);
}catch(error){status.textContent='3D view unavailable. Explore every feature using the buttons.';stage.querySelector('.hotspots').hidden=true;}
