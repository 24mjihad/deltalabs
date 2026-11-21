const canvas=document.querySelector('#sleep-signals-canvas');
if(canvas){
 const ctx=canvas.getContext('2d'),container=canvas.closest('.sleep-signals'),heading=document.querySelector('#current-sleep-stage');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fs=128,capacity=fs*180,data=Array.from({length:6},()=>new Float32Array(capacity));
 let seed=0x6d7a12b9;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 const white=()=>((random()+random()+random()+random())-2)*1.732;
 const definitions={N1:{label:'N1 / FALLING ASLEEP',short:'N1',color:'#9aabb4',hz:5.9,amp:6.5},N2:{label:'N2 / LIGHT SLEEP',short:'N2 / LIGHT SLEEP',color:'#43858b',hz:5.1,amp:5.0},N3:{label:'N3 / DEEP SLEEP',short:'N3 / DEEP SLEEP',color:'#65658f',hz:1.18,amp:19},REM:{label:'REM / RAPID EYE MOVEMENTS',short:'REM',color:'#a77f66',hz:5.5,amp:4.2},Awake:{label:'BRIEF AWAKENING',short:'AWAKE',color:'#c0a062',hz:10.5,amp:6.0}};
 const stages=[];let end=0;
 function append(name,duration){
  const stage={name,start:end,end:end+duration,events:[],eyes:[],moves:[]};end=stage.end;
  if(name==='N2'){
   for(let t=stage.start+2.2+random()*1.4;t<stage.end-2.2;t+=5+random()*4.2){stage.events.push({type:'K-complex',time:t,amp:33+random()*10,duration:.7});if(t+2.2<stage.end-1)stage.events.push({type:'Sleep spindle',time:t+1.3+random()*.7,amp:8+random()*4,duration:.75+random()*.6,frequency:12+random()*2.2});}
  }
  if(name==='REM'||name==='Awake')for(let t=stage.start+.5;t<stage.end;t+=1+random()*2.8)stage.eyes.push({time:t,amp:9+random()*10,duration:.10+random()*.18});
  if(name==='Awake')stage.moves.push({time:stage.start+.35,amp:18,duration:.22});
  else if(random()<.35)stage.moves.push({time:stage.start+duration*(.3+random()*.5),amp:3+random()*4,duration:.14});
  stages.push(stage);
 }
 append('N2',18.5);append('Awake',2.7);append('N1',10.8);append('N2',23.6);
 function extend(until){
  while(end<until){const previous=stages.at(-1).name,r=random();let name;
   if(previous==='N1')name=r<.82?'N2':'Awake';
   else if(previous==='N2')name=r<.42?'N3':r<.68?'REM':r<.85?'Awake':'N1';
   else if(previous==='N3')name=r<.92?'N2':'Awake';
   else if(previous==='REM')name=r<.45?'Awake':r<.8?'N2':'N1';
   else name=r<.65?'N1':'N2';
   const ranges={N1:[9,18],N2:[17,29],N3:[16,28],REM:[13,24],Awake:[1.8,3.7]},[a,b]=ranges[name];append(name,a+random()*(b-a));
  }
 }
 const noise=new Float64Array(6),phase=new Float64Array(2),drift=new Float64Array(2);let breathPhase=0,generated=0,genStage=0;
 const gaussian=(time,center,sigma)=>{const z=(time-center)/sigma;return Math.abs(z)>5?0:Math.exp(-.5*z*z);};
 function generate(until){
  extend(until+30);const target=Math.ceil(until*fs);
  while(generated<=target){
   const t=generated/fs;while(stages[genStage].end<=t)genStage++;const stage=stages[genStage],def=definitions[stage.name],age=t-stage.start;
   const n=[];for(let ch=0;ch<6;ch++){const w=white();noise[ch]=noise[ch]*.89+w*.23;n[ch]=noise[ch]*2.1+w*.8;}
   const channels=[];
   for(let ch=0;ch<2;ch++){
    drift[ch]=drift[ch]*.999+white()*.0008;phase[ch]+=2*Math.PI*(def.hz+drift[ch]+.10*Math.sin(t*.39+ch))/fs;
    let v=def.amp*Math.sin(phase[ch])*(.7+.18*Math.sin(t*.61+ch))+n[ch]*2.7;
    if(stage.name==='N3')v+=7*Math.sin(t*2*Math.PI*.68+ch*.12)+2.4*Math.sin(t*2*Math.PI*3.1);
    else v+=1.8*Math.sin(t*2*Math.PI*(16.7+ch*.6)+Math.sin(t*.24));
    if(stage.name==='Awake')v+=n[ch]*4+7*Math.sin(t*2*Math.PI*19.3)*Math.exp(-age*.8);
    for(const event of stage.events){
     const d=t-event.time;if(Math.abs(d)>2)continue;
     if(event.type==='K-complex')v+=event.amp*(-gaussian(d,.10,.065)+.62*gaussian(d,.34,.135))*(ch===0?1:.78);
     else if(d>=0&&d<event.duration){const envelope=Math.sin(Math.PI*d/event.duration)**2;v+=event.amp*envelope*Math.sin(2*Math.PI*event.frequency*d+ch*.5);}
    }
    channels.push(v);
   }
   let eyes=stage.name==='N1'?10*Math.sin(t*2*Math.PI*.28+Math.sin(t*.12)):0;
   for(const event of stage.eyes)eyes+=event.amp*(gaussian(t,event.time,event.duration)-.75*gaussian(t,event.time+.25,event.duration*1.15));
   channels.push(eyes+n[2]*1.4,-eyes*.83+n[3]*1.5);
   breathPhase+=2*Math.PI*(.215+.012*Math.sin(t*.17)+(stage.name==='REM'?.025*Math.sin(t*.9):0))/fs;
   channels.push((10+2*Math.sin(t*.23))*Math.sin(breathPhase)+n[4]*.7);
   let motion=n[5]*.65;for(const event of stage.moves)motion+=event.amp*gaussian(t,event.time,event.duration)*(Math.sin((t-event.time)*36)+.6);
   channels.push(motion);
   for(let ch=0;ch<6;ch++)data[ch][generated%capacity]=channels[ch];generated++;
  }
 }
 function value(t,ch){const index=t*fs,a=Math.floor(index),u=index-a;return data[ch][a%capacity]*(1-u)+data[ch][(a+1)%capacity]*u;}
 const channelNames=['EEG / LEFT','EEG / RIGHT','EYE / LEFT','EYE / RIGHT','BREATHING','MOVEMENT'];let width=600,height=420,visible=true,clock=0,previous=performance.now(),lastStage=-1;
 function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
 new ResizeObserver(resize).observe(canvas);resize();
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(container);
 function draw(){
  const gutter=width<430?61:80,right=width-8,plotWidth=right-gutter,windowSeconds=width<430?10:18,start=clock,endTime=start+windowSeconds;generate(endTime+2);
  ctx.clearRect(0,0,width,height);const yTop=64,yBottom=height-30,row=(yBottom-yTop)/6;ctx.font='8px Manrope,Arial';ctx.textBaseline='middle';ctx.fillStyle='#ffffffbb';
  channelNames.forEach((label,i)=>{ctx.textAlign='right';ctx.fillText(label,gutter-9,yTop+row*(i+.5));});
  const x=t=>gutter+(t-start)/windowSeconds*plotWidth,focus=start+windowSeconds*.55;
  const currentIndex=stages.findIndex(s=>s.start<=focus&&s.end>focus),current=stages[currentIndex];
  if(currentIndex!==lastStage){heading.textContent=definitions[current.name].label;heading.dataset.stage=current.name;lastStage=currentIndex;}
  canvas.dataset.windowStart=start.toFixed(3);canvas.dataset.focusStage=current.name;
  ctx.save();ctx.beginPath();ctx.rect(gutter,0,plotWidth,height);ctx.clip();
  const labels=[],visibleEvents=[];
  for(const stage of stages){
   if(stage.end<start||stage.start>endTime)continue;const def=definitions[stage.name],left=x(stage.start),w=x(stage.end)-left;
   ctx.fillStyle=def.color;ctx.globalAlpha=.12;ctx.fillRect(left,0,w,yBottom);ctx.globalAlpha=.72;ctx.fillRect(left,0,w,24);ctx.globalAlpha=1;
   ctx.save();ctx.beginPath();ctx.rect(left+1,0,w-2,24);ctx.clip();ctx.fillStyle='white';ctx.textAlign='left';ctx.font='9px Manrope,Arial';ctx.fillText(def.short,left+6,13);ctx.restore();labels.push({stage:stage.name,x:Number(left.toFixed(1))});
   for(const event of stage.events){
    if(event.time<start||event.time>endTime)continue;visibleEvents.push(event.type);const ex=x(event.time),ey=event.type==='K-complex'?36:49;ctx.fillStyle='#ffffffcc';ctx.font='8px Manrope,Arial';ctx.textAlign='left';ctx.fillText(event.type,ex+3,ey);ctx.strokeStyle='#ffffff40';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(ex,ey+5);ctx.lineTo(ex,yTop+row*.20);ctx.stroke();
   }
  }
  canvas.dataset.movingLabels=JSON.stringify(labels);canvas.dataset.events=JSON.stringify(visibleEvents);
  for(let ch=0;ch<6;ch++){
   const baseline=yTop+row*(ch+.5),scale=ch<2?.64:ch<4?.7:.8;ctx.lineWidth=.45;ctx.strokeStyle='#ffffff15';ctx.beginPath();ctx.moveTo(gutter,baseline);ctx.lineTo(right,baseline);ctx.stroke();
   ctx.lineWidth=.85;ctx.strokeStyle=ch<2?'#ffffffed':'#ffffffb8';ctx.beginPath();
   const steps=Math.ceil(plotWidth*1.6);for(let i=0;i<=steps;i++){const t=start+i/steps*windowSeconds,px=gutter+i/steps*plotWidth,py=baseline+value(t,ch)*scale;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();
  }
  ctx.strokeStyle='#ffffff50';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x(focus),24);ctx.lineTo(x(focus),yBottom);ctx.stroke();
  ctx.fillStyle='#ffffff70';ctx.font='7px Manrope,Arial';ctx.textAlign='center';ctx.fillText('CURRENT STAGE',x(focus),height-8);
  ctx.restore();
 }
 function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-previous)/1000,.1);if(now-previous<33)return;previous=now;if(document.hidden||!visible)return;if(!reduced)clock+=dt*.8;draw();}
 draw();requestAnimationFrame(tick);
}
