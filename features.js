import * as THREE from 'three';
import {GLTFLoader} from './assets/vendor/GLTFLoader.js';
const stage=document.querySelector('#model-stage'),status=stage.querySelector('.model-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const descriptions={
 sensing:{kicker:'BRAINWAVES & EYE MOVEMENTS',title:'Track your sleep stages',copy:'EEG and EOG electrodes, breathing, blood oxygen and movement — aiming for greater accuracy than wristbands',anchor:'sleep-pressure'},
 light:{kicker:'SUNRISE LIGHT & SMART WAKE',title:'Wake up less drowsy',copy:'Built-in LEDs gently wake you during lighter sleep, with a smart wake window for nights and naps',anchor:'morning-light'},
 audio:{kicker:'BUILT-IN STEREO SPEAKERS',title:'Fall asleep faster',copy:'Sound pulses timed to your sleep stage — designed to increase deep sleep intensity and reduce time spent falling asleep',anchor:'seasonal-light'},
 comfort:{kicker:'SOFT & WASHABLE',title:'Made to sleep in',copy:'A removable, washable face cushion, soft fabric and a flexible frame',anchor:'daily-life'},
 fit:{kicker:'ADJUSTABLE MAGNETIC STRAP',title:'A comfortable fit',copy:'A flexible strap that adjusts to your head and spreads pressure evenly',anchor:'daily-life'},
 power:{kicker:'WIRELESS CHARGING',title:'Ready for the next night',copy:'Set the mask on its charger — no cables to plug into the mask',anchor:'daily-life'}
};
const buttons=[...document.querySelectorAll('[data-part]')],spin=document.querySelector('.spin-toggle');
let model,selected=null,parts={},targets={},spreads={},yaw=.25,pitch=0,yawGoal=.25,pitchGoal=0,auto=!reduced,drag=false,px=0,py=0,inertia=0,lastInput=-10000,onScreen=true;
function updateSpin(){spin.textContent=auto?'Ⅱ':'▷';spin.setAttribute('aria-label',auto?'Pause rotation':'Play rotation');spin.setAttribute('aria-pressed',String(!auto));}
updateSpin();spin.addEventListener('click',()=>{auto=!auto;inertia=0;lastInput=-10000;updateSpin();});
function clearTargets(){for(const key in parts){targets[key]=new THREE.Vector3(0,0,key==='light'?.0008:0);spreads[key]=0;}}
function setView(angle){yawGoal+=Math.atan2(Math.sin(angle-yawGoal),Math.cos(angle-yawGoal));pitchGoal=0;inertia=0;lastInput=performance.now();}
function show(key,hash=true){
 if(!descriptions[key])return;selected=key;const d=descriptions[key];
 document.querySelector('#part-kicker').textContent=d.kicker;document.querySelector('#part-title').textContent=d.title;document.querySelector('#part-copy').textContent=d.copy;document.querySelector('#part-science').href='sleep.html#'+d.anchor;
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===key)));clearTargets();
 // Explode along the construction axis. Paired components move outward on their own side.
 if(['sensing','light','audio','power'].includes(key))targets.shell=new THREE.Vector3(0,0,-.19);
 if(key==='sensing')targets.sensing=new THREE.Vector3(0,0,-.075);
 if(key==='light')targets.light=new THREE.Vector3(0,0,-.09);
 if(key==='comfort'){targets.comfort=new THREE.Vector3(0,0,.14);targets.padding=new THREE.Vector3(0,0,.14);}
 if(key==='fit')spreads.fit=.075;
 if(key==='audio')spreads.audio=.10;
 if(key==='power')spreads.power=.09;
 setView(key==='comfort'?2.30:.9);if(hash)history.replaceState(null,'','#'+key);
}
buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.part)));
document.querySelector('.reset-model').addEventListener('click',()=>{selected=null;clearTargets();inertia=0;lastInput=performance.now();buttons.forEach(b=>b.setAttribute('aria-pressed','false'));document.querySelector('#part-kicker').textContent='TRACK / SLEEP / WAKE';document.querySelector('#part-title').textContent='One mask';document.querySelector('#part-copy').textContent='Select a feature below';document.querySelector('#part-science').href='sleep.html';history.replaceState(null,'',location.pathname);});
window.addEventListener('hashchange',()=>show(location.hash.slice(1),false));
try{
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;stage.prepend(renderer.domElement);
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Mask model — drag or swipe to rotate, or use the arrow keys');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.05,3);camera.position.set(0,.10,-.70);camera.lookAt(0,.015,.005);
 scene.add(new THREE.HemisphereLight(0xffffff,0x171b20,2));
 for(const [x,y,z,power] of [[-.3,.3,-.4,3],[.3,.15,.25,2.3],[0,-.2,-.3,.4]]){const l=new THREE.DirectionalLight(0xffffff,power);l.position.set(x,y,z);scene.add(l);}
 let distance=.70,distanceGoal=.70;
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;px=e.clientX;py=e.clientY;inertia=0;lastInput=performance.now();canvas.setPointerCapture(e.pointerId);stage.classList.add('dragging');});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-px,dy=e.clientY-py;inertia=THREE.MathUtils.clamp(dx*.005,-.09,.09);yawGoal+=inertia;pitchGoal=THREE.MathUtils.clamp(pitchGoal+dy*.0035,-.55,.55);px=e.clientX;py=e.clientY;lastInput=performance.now();});
 const release=()=>{drag=false;lastInput=performance.now();stage.classList.remove('dragging');};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{if(drag)release();});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();lastInput=performance.now();inertia=0;if(e.key==='ArrowLeft')yawGoal-=.18;if(e.key==='ArrowRight')yawGoal+=.18;if(e.key==='ArrowUp')pitchGoal=Math.max(-.55,pitchGoal-.12);if(e.key==='ArrowDown')pitchGoal=Math.min(.55,pitchGoal+.12);if(e.key==='Home')setView(.25);});
 function splitPair(original){
  if(!original?.isMesh)return original;const group=new THREE.Group();group.name=original.name;const geometry=original.geometry,index=geometry.index,position=geometry.attributes.position,normal=geometry.attributes.normal;
  const buckets=[{p:[],n:[]},{p:[],n:[]}];const count=index?index.count:position.count;
  for(let i=0;i<count;i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);const side=ids.reduce((sum,id)=>sum+position.getX(id),0)<0?0:1;for(const id of ids){buckets[side].p.push(position.getX(id),position.getY(id),position.getZ(id));buckets[side].n.push(normal.getX(id),normal.getY(id),normal.getZ(id));}}
  buckets.forEach((bucket,i)=>{if(!bucket.p.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(bucket.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(bucket.n,3));const mesh=new THREE.Mesh(g,original.material);mesh.userData.side=i===0?-1:1;group.add(mesh);});
  original.parent.add(group);original.parent.remove(original);return group;
 }
 new GLTFLoader().load('./assets/mask.glb?v=5.1',g=>{
  model=g.scene;scene.add(model);model.position.y=-.008;
  const colors={shell:0x202326,frame:0x1a1c1e,padding:0x141719,comfort:0x141719,fit:0x242729,sensing:0x285141,light:0xb2a78f,audio:0x876947,power:0x373c40};
  for(const key of Object.keys(colors)){let object=model.getObjectByName(key);if(!object)continue;object.traverse(o=>{if(!o.isMesh)return;o.material=new THREE.MeshStandardMaterial({color:colors[key],roughness:.82,metalness:key==='sensing'?.18:.03,side:THREE.FrontSide});if(['frame','comfort','light'].includes(key)){o.material.polygonOffset=true;o.material.polygonOffsetFactor=key==='light'?1:key==='comfort'?0:2;o.material.polygonOffsetUnits=o.material.polygonOffsetFactor;}if(key==='shell'||!o.geometry.attributes.normal)o.geometry.computeVertexNormals();o.frustumCulled=true;});if(['fit','audio','power'].includes(key))object=splitPair(object);parts[key]=object;targets[key]=new THREE.Vector3(0,0,key==='light'?.0008:0);spreads[key]=0;}
  // A low-frequency surface avoids the moire and flicker caused by the old checker weave.
  const cloth=document.createElement('canvas');cloth.width=1024;cloth.height=512;const ctx=cloth.getContext('2d');ctx.fillStyle='#272b2d';ctx.fillRect(0,0,1024,512);const texture=new THREE.CanvasTexture(cloth);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  parts.shell?.traverse(o=>{if(!o.isMesh)return;const pos=o.geometry.attributes.position,uv=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){uv[i*2]=.5-pos.getX(i)/.275;uv[i*2+1]=.5+pos.getY(i)/.12;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material.map=texture;o.material.color.set(0xffffff);o.material.polygonOffset=true;o.material.polygonOffsetFactor=-1;o.material.polygonOffsetUnits=-1;o.material.needsUpdate=true;});
  const logo=new Image();logo.onload=()=>{ctx.drawImage(logo,395,160,234,132);texture.needsUpdate=true;};logo.src='./assets/wordmark.svg?v=5';
  for(const key of ['sensing','audio','power','fit','frame','padding'])if(parts[key])parts[key].visible=false;
  stage.classList.add('model-loaded');status.textContent='';if(descriptions[location.hash.slice(1)])show(location.hash.slice(1),false);
 },undefined,()=>{status.textContent='Use the buttons below to explore each feature';});
 new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;}).observe(stage);
 let previous=performance.now();
 function frame(now){requestAnimationFrame(frame);if(now-previous<33)return;const dt=Math.min((now-previous)/1000,.06);previous=now;if(!onScreen||document.hidden)return;
  const amount=reduced?1:1-Math.exp(-dt*4);
  if(model){
   if(!drag){if(auto&&!selected&&now-lastInput>5000)yawGoal+=dt*.055;else if(!reduced&&Math.abs(inertia)>.0001){yawGoal+=inertia;inertia*=Math.exp(-dt*10);}}
   yaw=THREE.MathUtils.lerp(yaw,yawGoal,amount);pitch=THREE.MathUtils.lerp(pitch,pitchGoal,amount);model.rotation.set(pitch,yaw,0);
   for(const [key,object] of Object.entries(parts)){
    object.position.lerp(targets[key]||new THREE.Vector3(),amount);
    if(['fit','audio','power'].includes(key))for(const child of object.children){child.position.x=THREE.MathUtils.lerp(child.position.x,(spreads[key]||0)*child.userData.side,amount);}
    if(key==='frame')object.visible=selected!==null;else if(key==='padding')object.visible=selected==='comfort';else if(['sensing','audio','power','fit'].includes(key))object.visible=selected===key;
   }
   // A fixed framing for each mode prevents zoom oscillation as the model turns.
   distanceGoal=(selected ? .75 : .42)*Math.max(1,1.25/camera.aspect);
   distance=THREE.MathUtils.lerp(distance,distanceGoal,amount);camera.position.set(0,.10,-distance);camera.lookAt(0,.015,.005);
  }renderer.render(scene,camera);
 }requestAnimationFrame(frame);
}catch(error){status.textContent='Use the buttons below to explore each feature';}
