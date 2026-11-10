// The screen direction is projected from the actual world step, for keyboard and tap movement.
let mountLast=null, mountBearing=0;
drawMountedDragon=function(p){
  refreshMount();
  if(mountLast && mountLast.map===mapIndex){
    const dx=player.x-mountLast.x,dz=player.z-mountLast.z;
    if(Math.hypot(dx,dz)>.0001)mountBearing=Math.atan2((dx+dz)*.36,(dx-dz)*.78);
  }
  mountLast={...player,map:mapIndex};
  const facing=Math.cos(mountBearing)<0?-1:1;
  const pitch=Math.sin(mountBearing)*.42, w=scale*4.6;
  const frame=mountFrames[Math.floor(time*8)%12];
  ctx.save();ctx.translate(p.x,p.y-w*.25-Math.sin(time*3)*3);
  ctx.rotate(pitch*facing);ctx.scale(facing,1);
  if(frame?.complete)ctx.drawImage(frame,-w*.5,-w*.22,w,w*.5);
  ctx.restore();
};
function dinoSprite(step=0){
  const beat=Math.sin(step);
  const leg=(x,op)=>`<g transform="rotate(${beat*op*30} ${x} 77)"><path d="M${x} 76v19l5 1" fill="none" stroke="#528879" stroke-width="10" stroke-linecap="round"/><path d="M${x} 77v15" stroke="#a1d4b2" stroke-width="6" stroke-linecap="round"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 104"><g stroke="#44766d" stroke-width="1.6" stroke-linejoin="round">
  <g transform="rotate(${beat*7} 43 66)"><path d="M49 57Q23 66 6 43Q5 74 44 80Z" fill="#7cbba0"/></g>
  ${leg(50,1)}${leg(79,-1)}<path d="M36 65Q41 48 64 49Q76 47 77 34Q79 14 98 14Q118 13 120 33Q126 49 108 55L96 55Q92 82 68 86Q44 89 36 72Z" fill="#87c8a7"/>
  <path d="M79 57Q89 64 101 53Q93 79 75 82" fill="#d3e7bd" stroke="none"/>
  <path d="M37 61l2-12 8 5 5-14 9 9 6-11 7 8" fill="#d2b8d9"/>
  <path d="M80 61q8 7 12 0" fill="none" stroke="#62a78f" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="104" cy="33" rx="5" ry="7" fill="#344750"/><circle cx="102" cy="30" r="2.4" fill="white" stroke="none"/>
  <ellipse cx="108" cy="45" rx="4" ry="2" fill="#e6adae" stroke="none"/><path d="M113 48q5 1 7-4" fill="none"/>
  <path d="M84 19l-3-8 8 3 4-7 5 7" fill="#d4bcdd"/></g></svg>`;
}
function svgFrame(markup){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);return im}
const dinoFrames=Array.from({length:12},(_,i)=>svgFrame(dinoSprite(i*Math.PI/6)));
let petTrail=null;
function drawFollowingPet(){
  const now=performance.now()/1000;
  if(!petTrail||petTrail.map!==mapIndex||Math.hypot(player.x-petTrail.x,player.z-petTrail.z)>9)
    petTrail={x:player.x-1.3,z:player.z+.6,map:mapIndex,time:now,phase:0,face:1};
  const dt=Math.min(.07,now-petTrail.time);petTrail.time=now;
  const dx=player.x-petTrail.x,dz=player.z-petTrail.z,d=Math.hypot(dx,dz);
  const walk=d>1.35&&$('modal').classList.contains('hidden');
  if(walk){const step=Math.min(d-1.25,(2+d*.9)*dt);petTrail.x+=dx/d*step;petTrail.z+=dz/d*step;
    if(Math.abs(dx-dz)>.08)petTrail.face=Math.sign(dx-dz);
    petTrail.phase+=step*5;}
  const p=project(petTrail.x,0,petTrail.z),size=scale*1.45;
  ctx.save();ctx.translate(p.x,p.y);softEllipse(0,0,size*.29,size*.07,'#24463e28');
  ctx.scale(petTrail.face,1);const frame=(typeof petFramesFor==='function'?petFramesFor():dinoFrames)[walk?Math.floor(petTrail.phase*3)%12:0];
  if(frame.complete)ctx.drawImage(frame,-size/2,-size*.78-(walk?Math.abs(Math.sin(petTrail.phase))*3:Math.sin(time*2)),size,size*.8);ctx.restore();
}
const swimmingFrames=[0,1,2].map(i=>{const im=new Image();im.src=cozyArt['siren'+i];return im});
const mermaidStation=stations[3].find(s=>s[0]==='siren');
let mermaidPhase=0,sirenGuided=false,sirenFace=1,swimClock=0;
function updateMermaid(ts){
  const dt=Math.min(.08,(ts-swimClock)/1000||0);swimClock=ts;
  if(mapIndex!==3||!mermaidStation||!$('modal').classList.contains('hidden'))return;
  const distance=Math.hypot(player.x-mermaidStation[2],player.z-mermaidStation[3]);
  if(sirenGuided&&!target)sirenGuided=false;
  if(distance<2||sirenGuided)return;
  mermaidPhase+=dt*.38;
  const x=-2+Math.sin(mermaidPhase)*7.2,z=-2+Math.sin(mermaidPhase*2)*5.5;
  const direction=(x-mermaidStation[2])-(z-mermaidStation[3]);
  if(Math.abs(direction)>.001)sirenFace=Math.sign(direction);
  mermaidStation[2]=x;mermaidStation[3]=z;
}
const originalGuide=walkToStation;
walkToStation=function(i){sirenGuided=mapIndex===3&&stations[3][i]===mermaidStation;originalGuide(i)};
function drawSwimmingSiren(p){
  const frame=swimmingFrames[[0,1,2,1][Math.floor(time*3)%4]],w=scale*3.15;
  ctx.save();ctx.translate(p.x,p.y-w*.31+Math.sin(time*2)*3);ctx.scale(sirenFace,1);
  if(frame.complete)ctx.drawImage(frame,-w*.5,-w*.56,w,w);
  ctx.restore();
}
sirenSvg=function(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><image href="'+cozyArt.siren1+'" width="240" height="240"/></svg>'};
const renderBeforeCompanions=render;
render=function(ts){updateMermaid(ts);renderBeforeCompanions(ts)};
