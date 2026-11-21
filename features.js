import * as THREE from 'three';
import {GLTFLoader} from './assets/vendor/GLTFLoader.js';
const stage=document.querySelector('#model-stage'),status=stage.querySelector('.model-status'),description=document.querySelector('.feature-description');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const copy={
 sensing:{kicker:'BRAINWAVES & EYE MOVEMENTS',title:'Track your sleep stages',text:'EEG and EOG electrodes, breathing, blood oxygen and movement — aiming for greater accuracy than wristbands',anchor:'sleep-pressure'},
 light:{kicker:'SUNRISE LIGHT & SMART WAKE',title:'Wake up less drowsy',text:'Sunrise LEDs and a smart wake window for nights and naps',anchor:'morning-light'},
 audio:{kicker:'BUILT-IN STEREO SPEAKERS',title:'Fall asleep faster',text:'Sound pulses timed to your sleep stage — designed to increase deep sleep intensity and reduce time spent falling asleep',anchor:'sleep-pressure'},
 comfort:{kicker:'SOFT / REMOVABLE / WASHABLE',title:'Make yourself comfortable',text:'Porous, corrugated padding and a removable, washable face cushion',anchor:'daily-life'},
 fit:{kicker:'ADJUSTABLE MAGNETIC STRAP',title:'A comfortable fit',text:'A flexible strap that adjusts to your head and spreads pressure evenly',anchor:'daily-life'},
 power:{kicker:'WIRELESS CHARGING',title:'Fold it down and recharge',text:'Set the folded mask on its charging pad, ready for the next night',anchor:'daily-life'}
};
const buttons=[...document.querySelectorAll('[data-part]')],internal=['sensing','audio','power','fit'];
let model,ready=false,parts={},flatBoxes={},meshes=[],lightMaterials=[],flat=0,active=null,pending=null,phase='idle',phaseTime=0,phaseLength=1,fromFlat=0,closePositions={},closePairs=[],closeOpen=0,plan=null,openness=0,glowAfter=false,glow=0;const pairBoxes=new Map();
let phaseStarted=performance.now();
let yaw=.25,yawGoal=.25,pitch=0,pitchGoal=0,drag=false,px=0,py=0,inertia=0,lastInput=-10000,onScreen=true;
const ease=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
const basePosition=key=>new THREE.Vector3(0,0,key==='light'?.0008:0);
function text(key){const d=copy[key];document.querySelector('#part-kicker').textContent=d?d.kicker:'TRACK / SLEEP / WAKE';document.querySelector('#part-title').textContent=d?d.title:'One mask';document.querySelector('#part-copy').textContent=d?d.text:'Select a feature below';document.querySelector('#part-science').href=d?'sleep.html#'+d.anchor:'sleep.html';buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===key)));}
function enter(name,length){phase=name;phaseTime=0;phaseStarted=performance.now();phaseLength=reduced?.001:length;stage.dataset.phase=name;status.textContent=name==='closing'?'Reassembling':name==='flattening'?'Opening the band':'';description.setAttribute('aria-busy',String(['closing','curving','hold','flattening'].includes(name)));}
function view(angle){yawGoal+=Math.atan2(Math.sin(angle-yawGoal),Math.cos(angle-yawGoal));pitchGoal=0;inertia=0;lastInput=performance.now();}
function resetOffsets(){for(const [key,o] of Object.entries(parts)){o.position.copy(basePosition(key));if(o.userData.pairs)for(const child of o.userData.pairs)child.position.x=0;}openness=0;}
function close(){
 stage.classList.remove('show-charging');glowAfter=active==='light';glow=0;closePositions={};closePairs=[];fromFlat=flat;closeOpen=openness;
 for(const [key,o] of Object.entries(parts)){closePositions[key]=o.position.clone();if(o.userData.pairs)for(const child of o.userData.pairs)closePairs.push({child,x:child.position.x});}
 enter('closing',.42);
}
function next(){
 if(pending==='@light'){pending=null;active='light';text(active);view(2.28);enter('illuminating',2.4);return;}
 if(pending===null){active=null;plan=null;flat=0;text(null);enter('idle',1);return;}
 if(pending==='power'){active='power';pending=null;flat=0;resetOffsets();text(active);stage.classList.add('show-charging');enter('charging',1);return;}
 active=null;fromFlat=flat;view(pending==='comfort'?2.20:.86);enter('flattening',.9);
}
function request(key){
 if(key!==null&&!copy[key])return;pending=key;buttons.forEach(b=>b.dataset.pending=String(b.dataset.part===key));
 if(!ready)return;
 if(['idle','charging','lit','illuminating'].includes(phase)&&flat<.001&&openness<.001){stage.classList.remove('show-charging');glow=0;active=null;next();}else close();
}
buttons.forEach(b=>b.addEventListener('click',()=>{history.replaceState(null,'','#'+b.dataset.part);request(b.dataset.part);}));
document.querySelector('.reset-model').addEventListener('click',()=>{history.replaceState(null,'',location.pathname);request(null);} );
window.addEventListener('hashchange',()=>request(copy[location.hash.slice(1)]?location.hash.slice(1):null));
function boxUnion(keys){const box=new THREE.Box3();for(const key of keys)if(flatBoxes[key])box.union(flatBoxes[key]);return box;}
function makePlan(key){
 const gap=.045,positions={},radials=[];for(const name in parts)positions[name]=basePosition(name);
 const structural=['shell','padding','light','frame','comfort'];let faces=[],selectedBox=flatBoxes[key];
 if(key==='comfort'){
  const core=boxUnion(['shell','light','frame']);positions.comfort.z=core.max.z+gap-selectedBox.min.z;positions.comfort.y=.055;
 }else{
  faces=key==='sensing'?['shell','padding','light']:['shell','padding'];
  const core=boxUnion(structural.filter(n=>n!==key&&!faces.includes(n)));
  positions[key].z=core.min.z-gap-selectedBox.max.z;
  const faceBox=boxUnion(faces);const faceOffset=selectedBox.min.z+positions[key].z-gap-faceBox.max.z;
  for(const name of faces){positions[name].z+=faceOffset;positions[name].y=-.025;}
  if(!parts[key].userData.pairs)positions[key].y=.075;
  if(parts[key].userData.pairs){
   const context=boxUnion(structural);
   for(const child of parts[key].userData.pairs){const b=pairBoxes.get(child);const x=child.userData.side<0?context.min.x-gap-b.max.x:context.max.x+gap-b.min.x;radials.push({child,x});}
  }
 }
 const bounds=new THREE.Box3();
 for(const name of structural){const b=flatBoxes[name]?.clone();if(b)bounds.union(b.translate(positions[name]));}
 if(radials.length){for(const {child,x} of radials)bounds.union(pairBoxes.get(child).clone().translate(new THREE.Vector3(x,0,positions[key].z)));}
 else bounds.union(selectedBox.clone().translate(positions[key]));
 const size=bounds.getSize(new THREE.Vector3());return {key,faces,positions,radials,width:size.x,depth:size.z,gap};
}
function open(){active=pending;pending=null;plan=makePlan(active);text(active);buttons.forEach(b=>b.dataset.pending='false');description.setAttribute('aria-busy','false');enter(plan.faces.length?'face':'part',plan.faces.length?.65:1.9);}
function transition(dt){
 phaseTime=(performance.now()-phaseStarted)/1000;const u=THREE.MathUtils.clamp(phaseTime/phaseLength,0,1),e=ease(u);
 if(phase==='closing'){
  const horizontal=ease(u/.42),partReturn=ease((u-.42)/.34),faceReturn=ease((u-.76)/.24);
  for(const [key,o] of Object.entries(parts)){
   const from=closePositions[key]||basePosition(key),base=basePosition(key),isFace=plan?.faces.includes(key);
   if(isFace)o.position.lerpVectors(from,base,faceReturn);
   else{o.position.x=THREE.MathUtils.lerp(from.x,base.x,horizontal);o.position.y=THREE.MathUtils.lerp(from.y,base.y,horizontal);o.position.z=THREE.MathUtils.lerp(from.z,base.z,partReturn);}
  }
  for(const item of closePairs)item.child.position.x=item.x*(1-horizontal);flat=fromFlat;openness=closeOpen*(1-e);
  if(u===1){resetOffsets();fromFlat=flat;enter('curving',.22);}
 }else if(phase==='curving'){
  flat=fromFlat*(1-e);
  if(u===1){flat=0;active=null;enter('hold',.12);}
 }else if(phase==='hold'&&u===1){
  if(glowAfter){glowAfter=false;active='light';text(active);view(2.28);enter('illuminating',2.4);}else next();
 }else if(phase==='flattening'){
  flat=THREE.MathUtils.lerp(fromFlat,1,e);
  if(u===1){flat=1;open();}
 }else if(phase==='face'){
  for(const key of plan.faces)parts[key].position.lerpVectors(basePosition(key),plan.positions[key],e);openness=.35*e;
  if(u===1)enter('part',1.9);
 }else if(phase==='part'){
  const z=ease(Math.min(1,u/.55)),out=ease(Math.max(0,(u-.48)/.52)),base=basePosition(active);parts[active].position.z=THREE.MathUtils.lerp(base.z,plan.positions[active].z,z);parts[active].position.y=plan.positions[active].y*out;for(const item of plan.radials)item.child.position.x=item.x*out;openness=.35+.65*e;
  if(u===1){openness=1;stage.dataset.clearance=plan.gap.toFixed(3);enter('open',1);}
 }else if(phase==='open'&&active==='light'&&phaseTime>3.8){pending='@light';close();
 }else if(phase==='illuminating'){
  glow=e;stage.dataset.assembled='true';
  if(u===1){glow=1;if(pending&&pending!=='@light'){glow=0;active=null;next();}else{pending=null;enter('lit',1);}}
 }
 stage.dataset.flatten=flat.toFixed(3);stage.dataset.activePart=active||'';stage.dataset.glow=glow.toFixed(3);stage.dataset.assembled=String(flat<.001&&openness<.001);
}
try{
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Mask model — drag or swipe to rotate, or use the arrow keys');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.04,6);let distance=.70;camera.position.set(0,.10,-distance);camera.lookAt(0,.015,.005);
 scene.add(new THREE.HemisphereLight(0xffffff,0x11151a,1.1));
 const sun=new THREE.DirectionalLight(0xffffff,3.2);sun.position.set(-.35,.32,-.45);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-.8,right:.8,top:.5,bottom:-.5,near:.05,far:2});sun.shadow.normalBias=.001;sun.shadow.bias=-.00001;scene.add(sun);
 const rim=new THREE.DirectionalLight(0xffffff,2.1);rim.position.set(.35,.15,.35);scene.add(rim);
 const sunrise=new THREE.PointLight(0xffb371,0,1,.9);sunrise.position.set(0,0,.035);scene.add(sunrise);
 const resize=()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;px=e.clientX;py=e.clientY;inertia=0;lastInput=performance.now();canvas.setPointerCapture(e.pointerId);stage.classList.add('dragging');});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;inertia=THREE.MathUtils.clamp((e.clientX-px)*.005,-.09,.09);yawGoal+=inertia;pitchGoal=THREE.MathUtils.clamp(pitchGoal+(e.clientY-py)*.0035,-.55,.55);px=e.clientX;py=e.clientY;lastInput=performance.now();});
 const release=()=>{drag=false;lastInput=performance.now();stage.classList.remove('dragging');};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{if(drag)release();});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();inertia=0;lastInput=performance.now();if(e.key==='ArrowLeft')yawGoal-=.18;if(e.key==='ArrowRight')yawGoal+=.18;if(e.key==='ArrowUp')pitchGoal=Math.max(-.55,pitchGoal-.12);if(e.key==='ArrowDown')pitchGoal=Math.min(.55,pitchGoal+.12);if(e.key==='Home')view(.25);});
 function flatPoint(g,i){const p=g.attributes.position,m=g.morphAttributes.position?.[0];const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i));if(m){const f=new THREE.Vector3(m.getX(i),m.getY(i),m.getZ(i));if(g.morphTargetsRelative)v.add(f);else v.copy(f);}return v;}
 function boundsOf(object){const box=new THREE.Box3();object.traverse(o=>{if(o.isMesh)for(let i=0;i<o.geometry.attributes.position.count;i++)box.expandByPoint(flatPoint(o.geometry,i));});return box;}
 function correctMorphNormals(g){
  if(!g.morphAttributes.position?.length)return;g.computeVertexNormals();const count=g.attributes.position.count,coordinates=new Float32Array(count*3);
  for(let i=0;i<count;i++){const p=flatPoint(g,i);coordinates[i*3]=p.x;coordinates[i*3+1]=p.y;coordinates[i*3+2]=p.z;}
  const flatGeometry=new THREE.BufferGeometry();flatGeometry.setAttribute('position',new THREE.BufferAttribute(coordinates,3));if(g.index)flatGeometry.setIndex(g.index.clone());flatGeometry.computeVertexNormals();const normal=flatGeometry.attributes.normal,base=g.attributes.normal,delta=new Float32Array(count*3);
  for(let i=0;i<count;i++){delta[i*3]=normal.getX(i)-(g.morphTargetsRelative?base.getX(i):0);delta[i*3+1]=normal.getY(i)-(g.morphTargetsRelative?base.getY(i):0);delta[i*3+2]=normal.getZ(i)-(g.morphTargetsRelative?base.getZ(i):0);}
  g.morphAttributes.normal=[new THREE.BufferAttribute(delta,3)];flatGeometry.dispose();
 }
 function splitPair(original){
  const pair=new THREE.Group();pair.name=original.name;const left=new THREE.Group(),right=new THREE.Group();left.userData.side=-1;right.userData.side=1;pair.add(left,right);pair.userData.pairs=[left,right];
  original.traverse(source=>{
   if(!source.isMesh)return;const g=source.geometry,index=g.index,p=g.attributes.position,n=g.attributes.normal,mp=g.morphAttributes.position?.[0],mn=g.morphAttributes.normal?.[0],buckets=Array.from({length:2},()=>({p:[],n:[],mp:[],mn:[]}));
   for(let i=0;i<(index?index.count:p.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);const side=ids.reduce((sum,id)=>sum+flatPoint(g,id).x,0)<0?0:1;for(const id of ids){for(const [key,attribute] of [['p',p],['n',n],['mp',mp],['mn',mn]])if(attribute)buckets[side][key].push(attribute.getX(id),attribute.getY(id),attribute.getZ(id));}}
   buckets.forEach((b,i)=>{if(!b.p.length)return;const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));if(b.mp.length)geometry.morphAttributes.position=[new THREE.Float32BufferAttribute(b.mp,3)];if(b.mn.length)geometry.morphAttributes.normal=[new THREE.Float32BufferAttribute(b.mn,3)];geometry.morphTargetsRelative=g.morphTargetsRelative;const mesh=new THREE.Mesh(geometry,source.material);mesh.castShadow=true;mesh.receiveShadow=true;(i?right:left).add(mesh);});
  });
  original.parent.add(pair);original.parent.remove(original);pairBoxes.set(left,boundsOf(left));pairBoxes.set(right,boundsOf(right));return pair;
 }
 new GLTFLoader().load('./assets/mask.glb?v=6',g=>{
  model=g.scene;model.position.y=-.008;scene.add(model);
  const colors={shell:0x272b2d,frame:0x191d20,padding:0x22282a,comfort:0x282e30,light:0xb5ad9b,sensing:0x22292a,fit:0x24282b,audio:0x51300f,power:0x343b3e};
  for(const key of Object.keys(colors)){
   let object=model.getObjectByName(key);if(!object)continue;
   object.traverse(o=>{if(!o.isMesh)return;correctMorphNormals(o.geometry);const old=o.material,name=old?.name||'',metal=/Metal|Copper/.test(name);let color=metal?(/Copper/.test(name)?0xa86f35:0xb9bfc3):/Flex PCB/.test(name)?0x8f591e:/Chip body/.test(name)?0x171a1d:colors[key];o.material=new THREE.MeshStandardMaterial({color,roughness:metal?.17:key==='comfort'?.95:.8,metalness:metal?.98:.02,side:THREE.FrontSide});o.castShadow=true;o.receiveShadow=true;if(metal){o.material.polygonOffset=true;o.material.polygonOffsetFactor=-1;o.material.polygonOffsetUnits=-1;}if(key==='light'){o.material.polygonOffset=true;o.material.polygonOffsetFactor=1;o.material.polygonOffsetUnits=1;lightMaterials.push(o.material);}if(key==='frame'){o.material.polygonOffset=true;o.material.polygonOffsetFactor=2;o.material.polygonOffsetUnits=2;}});
   if(['fit','audio','power'].includes(key))object=splitPair(object);parts[key]=object;flatBoxes[key]=boundsOf(object);object.position.copy(basePosition(key));
  }
  const cloth=document.createElement('canvas');cloth.width=1024;cloth.height=512;const ctx=cloth.getContext('2d');ctx.fillStyle='#272b2d';ctx.fillRect(0,0,1024,512);const texture=new THREE.CanvasTexture(cloth);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  parts.shell.traverse(o=>{if(!o.isMesh)return;const uv=new Float32Array(o.geometry.attributes.position.count*2);for(let i=0;i<uv.length/2;i++){const p=flatPoint(o.geometry,i);uv[i*2]=.5-p.x/.275;uv[i*2+1]=.5+p.y/.12;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material.map=texture;o.material.color.set(0xffffff);o.material.polygonOffset=true;o.material.polygonOffsetFactor=-1;o.material.polygonOffsetUnits=-1;o.material.needsUpdate=true;});
  const logo=new Image();logo.onload=()=>{ctx.drawImage(logo,395,160,234,132);texture.needsUpdate=true;};logo.src='./assets/wordmark.svg?v=6';
  const foam=document.createElement('canvas');foam.width=512;foam.height=256;const fctx=foam.getContext('2d'),image=fctx.createImageData(512,256);let seed=912345;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<256;y++)for(let x=0;x<512;x++){const v=Math.round(90+55*Math.sin(x*Math.PI/6)+(rand()-.5)*65),i=(y*512+x)*4;image.data[i]=image.data[i+1]=image.data[i+2]=v;image.data[i+3]=255;}fctx.putImageData(image,0,0);for(let i=0;i<6500;i++){fctx.fillStyle='#111';fctx.beginPath();fctx.ellipse(rand()*512,rand()*256,.5+rand(),.7+rand(),0,0,Math.PI*2);fctx.fill();}const bump=new THREE.CanvasTexture(foam);bump.anisotropy=8;
  parts.comfort.traverse(o=>{if(!o.isMesh)return;const uv=new Float32Array(o.geometry.attributes.position.count*2);for(let i=0;i<uv.length/2;i++){const p=flatPoint(o.geometry,i);uv[i*2]=.5+p.x/.15;uv[i*2+1]=.5+p.y/.07;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material.bumpMap=bump;o.material.bumpScale=.00055;o.material.needsUpdate=true;});
  model.traverse(o=>{if(o.isMesh)meshes.push(o);});
  ready=true;stage.classList.add('model-loaded');status.textContent='';stage.dataset.morphs=String(meshes.filter(o=>o.morphTargetInfluences?.length).length);stage.dataset.assembled='true';if(copy[location.hash.slice(1)])request(location.hash.slice(1));else if(pending)next();
 },undefined,()=>{status.textContent='Use the buttons below to explore each feature';});
 new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;}).observe(stage);let previous=performance.now();
 function frame(now){
  requestAnimationFrame(frame);if(now-previous<33)return;const dt=Math.min((now-previous)/1000,.25);previous=now;if(document.hidden||!onScreen)return;
  if(model&&ready){
   transition(dt);if(!drag&&!reduced){if(now-lastInput>5000)yawGoal+=dt*(active?.017:.045);else if(Math.abs(inertia)>.0001){yawGoal+=inertia;inertia*=Math.exp(-dt*10);}}
   const blend=reduced?1:1-Math.exp(-dt*5);yaw=THREE.MathUtils.lerp(yaw,yawGoal,blend);pitch=THREE.MathUtils.lerp(pitch,pitchGoal,blend);model.rotation.set(pitch,yaw,0);
   for(const mesh of meshes)if(mesh.morphTargetInfluences?.length)mesh.morphTargetInfluences[0]=flat;
   for(const [key,o] of Object.entries(parts)){
    if(internal.includes(key))o.visible=active===key&&!['curving','hold','flattening','charging','illuminating','lit'].includes(phase);
    if(key==='frame')o.visible=flat>.95&&active!==null;
    if(key==='padding')o.visible=!!plan?.faces.includes('padding')&&Math.abs(o.position.z)>.012;
   }
   for(const material of lightMaterials){material.emissive.set(0xffad58);material.emissiveIntensity=glow*1.8;}sunrise.intensity=glow*.045;
   const width=.28+.39*flat+Math.max(0,(plan?.width||.67)-.67)*openness,depth=.18*(1-flat)+.03*flat+(plan?.depth||0)*openness;
   const target=Math.max(.42,width/(2*Math.tan(THREE.MathUtils.degToRad(17))*camera.aspect)*1.15+depth*.35);distance=THREE.MathUtils.lerp(distance,target,blend);camera.position.set(0,.10,-distance);camera.lookAt(0,.015,.005);
  }
  if(phase!=='charging')renderer.render(scene,camera);
 }requestAnimationFrame(frame);
}catch(error){status.textContent='Use the buttons below to explore each feature';}
