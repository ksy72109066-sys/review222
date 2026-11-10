// An enterable cottage, with one action and one completion callback at a time.
const homeDoor=['home','모험가의 집',-3,2.8];
stations[0].push(homeDoor);
const otherStationIcon=stationIcon;
stationIcon=function(id){return id==='home'?'🏡':otherStationIcon(id)};
const cottageFacade=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 195"><defs>
<linearGradient id="roof" x2="0" y2="1"><stop stop-color="#a4b6a5"/><stop offset=".6" stop-color="#607f73"/><stop offset="1" stop-color="#456b61"/></linearGradient>
<radialGradient id="window"><stop stop-color="#fff0ba"/><stop offset="1" stop-color="#e8ab61"/></radialGradient></defs>
<ellipse cx="100" cy="175" rx="86" ry="13" fill="#34594c33"/><path d="M35 87L101 44L165 87V168Q101 190 35 164Z" fill="#e5cfaa" stroke="#856c58" stroke-width="3"/>
<path d="M138 67V25h17v52" fill="#aa857d" stroke="#826661" stroke-width="3"/><path d="M19 93Q66 64 96 18Q119 49 179 86L169 101Q128 82 99 54Q69 82 29 105Z" fill="url(#roof)" stroke="#526c63" stroke-width="4"/>
<path d="M38 89Q72 69 98 36Q128 69 157 83M52 80Q78 63 97 45" fill="none" stroke="#c6c8a2" stroke-width="2"/>
<path d="M84 169v-43q16-26 32 0v45Z" fill="#88614b" stroke="#6a5148" stroke-width="3"/><circle cx="108" cy="143" r="3" fill="#ffd58d"/>
<g fill="url(#window)" stroke="#8c7057" stroke-width="3"><rect x="44" y="111" width="26" height="30" rx="8"/><rect x="132" y="106" width="23" height="29" rx="8"/><circle cx="99" cy="82" r="10"/></g>
<path d="M57 111v30m-13-15h26m74-20v29m-12-14h23" stroke="#92775c" stroke-width="3"/>
<path d="M27 159q4-18 14-6 6-19 14-3 12-10 15 10m59-9q6-14 14-5 11-15 19-3" fill="#7f9c72"/>
<g fill="#fff1df"><circle cx="43" cy="151" r="4"/><circle cx="58" cy="154" r="3"/><circle cx="148" cy="142" r="4"/></g><path d="M79 173h44l8 7H72Z" fill="#c9b997"/></svg>`;
objectImages.home=svgFrame(cottageFacade);
let atHome=false,homeTimer=0,homeSequence=0,homeBusy=false;
const normalStation=useStation;
useStation=function(id){
  if(id!=='home')return normalStation(id);
  if(rpg.hp<=0)return revival();
  atHome=true;indoors=true;target=null;keys={};showHome();
};
function leaveHome(){clearTimeout(homeTimer);homeSequence++;homeBusy=false;atHome=false;indoors=false;closeModal();ui()}
const homeActions={
 wash:{name:'세면대 · 손 씻기',x:20,y:77,ms:2200,line:'소매를 걷고 두 손을 비벼 씻는 중…',end:'뽀득! 손을 씻고 수건으로 닦았어.'},
 cook:{name:'주방 · 수프 끓이기',x:25,y:52,ms:2800,line:'나무 주걱으로 수프를 저어 보자.',end:'따뜻한 수프 한 그릇을 가방에 담았어.'},
 sit:{name:'식탁 · 의자에 앉기',x:18,y:91,ms:950,line:'의자를 당겨 식탁에 앉는 중…',end:'식탁에 앉았어. 준비한 수프를 먹을 수 있어.'},
 eat:{name:'식탁 · 수프 먹기',x:18,y:91,ms:2100,line:'따끈한 수프를 한 숟가락씩…',end:'잘 먹었다! 허기 +60 · HP +25 (최대치까지).'},
 sleep:{name:'침대 · 잠자기',x:76,y:34,ms:3400,line:'이불을 덮고 잠시 눈을 감는 중…',end:'개운하게 일어났어. HP와 MP를 모두 회복했어.'},
 pet:{name:'펫 침대 · 쉬게 하기',x:73,y:82,ms:2100,line:'펫이 몸을 말고 방석에 눕는 중…',end:'펫이 편안히 쉬었어. 이제 다시 함께 탐험하자.'}
};
function hasDino(){return rpg.pet&&rpg.level>=10}
function showHome(message='주방에서 요리하고, 식탁에 앉아 한 끼 먹어 봐.'){
  modal(`<button class="close" onclick="leaveHome()" aria-label="집 밖으로">×</button><h2>모험가의 집</h2><div class="home-controls">${Object.entries(homeActions).map(([id,a])=>`<button onclick="homeAction('${id}')">${a.name}</button>`).join('')}</div>
  <div class="cozy-room" style="background-image:url('${cozyArt.cottageRoom}')">
    <div class="washbasin" aria-hidden="true">🫧</div><div id="room-dino" class="${hasDino()?'':'empty'}">${hasDino()?selectedPetSprite():''}</div>
    <div id="room-actor">${avatarSvg(avatar)}</div><div id="room-props"></div><div class="quilt-overlay"></div>
    <div class="home-hotspots">${[['cook','🍲 주방',21,50],['sleep','☾ 침대',80,32],['pet','🐾 펫 방석',82,79],['sit','식탁',13,89],['wash','손 씻기',31,74]].map(([k,n,x,y])=>`<button style="left:${x}%;top:${y}%" onclick="homeAction('${k}')">${n}</button>`).join('')}</div>
  </div><p id="home-status" role="status">${message}</p><div class="home-menu">${Object.entries(homeActions).map(([id,a])=>`<button onclick="homeAction('${id}')">${a.name}</button>`).join('')}</div><small>집에 준비된 채소로 첫 수프를 끓이고, 이후에는 코코넛 2개로 만들 수 있어. 보유 수프 ${rpg.bag.meal||0}그릇.</small>`);
  $('content').classList.add('home-card');
  if(typeof setupRoomWalking==='function')setupRoomWalking();
}
function homeAction(id){
  if(!atHome||homeBusy||!homeActions[id])return;
  const status=$('home-status'),action=homeActions[id],room=document.querySelector('.cozy-room');
  if(id==='pet'&&!hasDino()){status.textContent='펫 전용 방석이야. 레벨 10부터 스킬·펫에서 펫을 데려오면 여기서 함께 쉴 수 있어.';return}
  if(id==='cook'&&rpg.homeFirstMeal&&(rpg.bag.coconut||0)<2){status.textContent='코코넛 2개가 필요해. 해변의 야자수에서 채집할 수 있어.';return}
  if(id==='eat'&&!(rpg.bag.meal>0)){status.textContent='먼저 주방에서 수프를 만들자.';return}
  homeBusy=true;const key=++homeSequence;const actor=$('room-actor'),props=$('room-props');
  actor.style.transition='left .65s ease,top .65s ease';roomPosition.x=action.x;roomPosition.y=action.y;roomTarget=null;room.dataset.action='walk';actor.style.left=action.x+'%';actor.style.top=action.y+'%';
  props.textContent='';status.textContent=action.line;actor.innerHTML=avatarSvg(avatar,1.3);
  homeTimer=setTimeout(()=>{
    if(!atHome||key!==homeSequence)return;room.dataset.action=id;actor.innerHTML=avatarSvg(id==='sleep'?{...avatar,face:1}:avatar,.15);
    if(['wash','cook','eat'].includes(id)){actor.insertAdjacentHTML('beforeend','<span class="busy-hands"><i></i><i></i></span>')}
    props.innerHTML={wash:'<i>💧</i><i>🫧</i><i>💧</i>',cook:'<b>🥄</b><i>♨</i>',sleep:'<i>z</i><i>Z</i>',eat:'<b>🥄</b><i>🍲</i>',sit:'',pet:'<i>z</i>'}[id];
    if(id==='wash'){const token=key;setTimeout(()=>{if(atHome&&token===homeSequence&&homeBusy){room.dataset.action='dry';props.innerHTML='<b>▧</b>';status.textContent='보송한 수건으로 손을 닦는 중…'}},1250)}
    homeTimer=setTimeout(()=>{
      if(!atHome||key!==homeSequence)return;
      if(id==='cook'){if(rpg.homeFirstMeal&&!takeItem('coconut',2)){homeBusy=false;showHome('코코넛 2개가 필요해.');return}rpg.homeFirstMeal=true;giveItem('meal');giveItem('broth')}
      if(id==='eat'&&takeItem('meal')){rpg.hunger=Math.min(100,rpg.hunger+60);rpg.hp=Math.min(maxHP(),rpg.hp+25)}
      if(id==='sleep'){rpg.hp=maxHP();rpg.mp=maxMP()}
      saveRpg();homeBusy=false;showHome(action.end);
      if(id==='sit'||id==='eat'){const room=document.querySelector('.cozy-room');room.dataset.action='sit';$('room-actor').style.left='18%';$('room-actor').style.top='91%'}
    },action.ms);
  },650);
}
const modalOutsideHome=modal;
modal=function(html){
  $('content').classList.remove('home-card');
  if(atHome&&!html.includes('class="cozy-room"')){clearTimeout(homeTimer);homeSequence++;atHome=false;indoors=false;homeBusy=false}
  modalOutsideHome(html);
};
