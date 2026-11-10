// The illustrated equipment fits the same animated doll used in the field and on mounts.
const jobs = [
  {name:'얼음마법사',hair:6,outfit:6,eye:'서리달 눈',weapon:4,iris:'#7eaacb',tilt:1},
  {name:'궁수',hair:7,outfit:7,eye:'새벽숲 눈',weapon:5,iris:'#7b9f80',tilt:-2},
  {name:'석궁사',hair:7,outfit:8,eye:'매의 눈',weapon:6,iris:'#bb946a',tilt:-4},
  {name:'도적',hair:8,outfit:9,eye:'그믐달 눈',weapon:7,iris:'#a18dbf',tilt:-5},
  {name:'불마법사',hair:9,outfit:10,eye:'불꽃 눈',weapon:8,iris:'#e69869',tilt:-3},
  {name:'전기마법사',hair:10,outfit:11,eye:'번개별 눈',weapon:9,iris:'#ac9ee5',tilt:0},
  {name:'전사',hair:8,outfit:12,eye:'수호자의 눈',weapon:10,iris:'#7995aa',tilt:-2}
];
dressCatalog.hair.push('서리빛 긴 웨이브','숲결 레이어드','달그림자 땋은 머리','불꽃 웨이브 단발','별리본 트윈 브레이드');
dressCatalog.outfit.push('서리별 로브','숲잎 사냥복','석궁 정찰 코트','달그림자 잠행복','홍염 마법복','뇌전 자수 코트','은빛 기사 갑주');
dressCatalog.face.push(...jobs.map(job=>job.eye));
dressCatalog.weapon.push('서리 마도서','잎새 장궁','정찰 석궁','초승달 단검','불꽃 지팡이','번개 마력봉','기사의 장검');
hairColors.push('#c6e7fa'); clothColors.push('#d3e3fa');
function chooseJob(index){
  const job=jobs[index];
  Object.assign(draft,{hair:job.hair,outfit:job.outfit,face:5+index,weapon:job.weapon,
    hairColor:7,color:6,acc:0,shoes:index===6?3:1,cape:0});
  wardrobeTab='outfit';drawWardrobe();
}
function jobPicker(){
  return '<div class="job-presets"><strong>직업 코디</strong>'+jobs.map((j,i)=>
    '<button onclick="chooseJob('+i+')">'+j.name+'</button>').join('')+'</div>';
}
function tintDefinition(name,hex){
  const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const rows=channels.map(v=>[.22*v+.04,.67*v+.04,.11*v+.04,0,.025].join(' '));
  return '<filter id="'+name+'" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="'+rows.join(' ')+' 0 0 0 1 0"/></filter>';
}
const magnoliaOutfitLoading=new Set();
function magnoliaPrimeOutfit(key){
  const url=cozyArt[key];
  if(!url||url.startsWith('data:')||magnoliaOutfitLoading.has(key))return;
  magnoliaOutfitLoading.add(key);
  magnoliaInlineAsset(url).then(data=>{
    cozyArt[key]=data;
    magnoliaOutfitLoading.delete(key);
    refreshAvatar();mountAvatarKey='';refreshMount();
    if(document.querySelector('.doll-closet'))drawWardrobe();
  }).catch(e=>{magnoliaOutfitLoading.delete(key);console.warn(e)});
}
function equipmentImage(key,x,y,w,h,filter=''){
  const src=cozyArt[key];if(!src)return '';
  if(!src.startsWith('data:')){magnoliaPrimeOutfit(key);return '';} 
  return '<image href="'+src+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+
    '" preserveAspectRatio="none" '+(filter?'filter="url(#'+filter+')"':'')+'/>';
}
function portraitEyes(job){
  const tilt=job.tilt;
  return [62,98].map((x,i)=>{
    const side=i?1:-1;
    const openness=({도적:6,석궁사:7,전사:8,궁수:9,불마법사:10,얼음마법사:10,전기마법사:11})[job.name];
    const brow=job.name==='도적'?83:job.name==='석궁사'?80:75;
    return `<g transform="rotate(${side*tilt} ${x} 87)" stroke="none">
      <path d="M${x-12} 85Q${x} ${72-tilt} ${x+12} 84Q${x+8} ${89+openness} ${x-9} ${87+openness}Z" fill="#fff9fc"/>
      <ellipse cx="${x}" cy="87" rx="8.6" ry="${openness}" fill="#343448"/>
      <ellipse cx="${x}" cy="90" rx="6.8" ry="${openness*.57}" fill="${job.iris}"/>
      <ellipse cx="${x}" cy="85" rx="3.9" ry="5.6" fill="#302d40"/>
      <path d="M${x-12} 84Q${x} ${brow-2-tilt} ${x+12} 83l${i?3:-2}-2" stroke="#393548" fill="none" stroke-width="2.7" stroke-linecap="round"/>
      <path d="M${x-8} 75q8-4 16-1" stroke="#8e8094" fill="none" stroke-width="1.2"/>
      <ellipse cx="${x-3}" cy="83" rx="2.8" ry="3" fill="white"/>
      <circle cx="${x+4}" cy="91" r="1.7" fill="#eafaff"/>
      ${job.name==='전기마법사'?`<path d="M${x} 85l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="#ffe9a8"/>`:''}</g>`;
  }).join('');
}
function handEquipment(index){
  const frame='<g stroke="#53516b" stroke-linecap="round" stroke-linejoin="round">';
  const shapes=[
    equipmentImage('grimoire',113,100,44,44),
    '<path d="M132 95Q166 127 125 156Q148 127 132 95Z" fill="#a78b57"/><path d="M132 95L125 156" stroke="#d9e5b5"/><path d="M117 135l35-15-5 7" stroke="#6f986b" stroke-width="2"/>',
    '<path d="M116 142l28-28 5 3-24 33Z" fill="#966953"/><path d="M112 117Q137 115 154 139L128 128Z" fill="#ad8a64"/><path d="M113 119l41 20" stroke="#dfdce2"/>',
    '<path d="M119 141Q141 132 148 103Q153 130 126 144Z" fill="#c7c2ea"/><path d="M117 138l14 9m-6-5-6 9" stroke="#917ba6" stroke-width="3"/>',
    '<path d="M124 151l13-48" stroke="#9a674c" stroke-width="4"/><path d="M136 111Q122 103 138 84Q135 98 145 96Q150 105 136 111Z" fill="#ff985c"/><path d="M136 106l3-10 3 7Z" fill="#fff3aa"/>',
    '<path d="M119 152l17-44" stroke="#867aaf" stroke-width="4"/><path d="M138 87l-11 17h8l-5 13 17-21h-9l6-9Z" fill="#ffdf79"/>',
    '<path d="M124 138l17-38 10-6 0 12-22 35Z" fill="#d8e7f2"/><path d="M120 135l15 7m-7-3-6 14" stroke="#b69964" stroke-width="4"/>'
  ];
  return index<4?null:frame+shapes[index-4]+'</g>';
}
function costumePieces(a,swing){
  const hair=['fringe','hairArcher','hairRogue','hairFlame','hairBraid'][a.hair-6];
  const coat=['coat','ranger','crossbow','rogue','flame','storm','knight'][a.outfit-6];
  const dyeHair=a.hairColor===7?'':'hairDye', dyeCoat=a.color===6?'':'coatDye';
  const skin=skins[a.skin]||skins[0];
  const hands=[-1,1].map(side=>`<g transform="rotate(${-swing*side*15} ${80+side*24} 116)"><ellipse cx="${80+side*30}" cy="133" rx="5.2" ry="5.6" fill="${skin}" stroke="#9e7c80"/></g>`).join('');
  return {
    defs:(dyeHair?tintDefinition(dyeHair,hairColors[a.hairColor]||hairColors[0]):'')+
      (dyeCoat?tintDefinition(dyeCoat,clothColors[a.color]||clothColors[0]):''),
    back:hair?(a.hair===6?equipmentImage('curls',9,23,142,125,dyeHair):''):null,
    front:hair?equipmentImage(hair,12,2,136,a.hair===6?140:126,dyeHair):null,
    body:coat?hands+equipmentImage(coat,40,104,80,49,dyeCoat):null,
    hand:handEquipment(a.weapon),eyes:a.face>=5?portraitEyes(jobs[a.face-5]):null
  };
}
const savedLook=gameStorage.getItem('sparkwood-avatar');
if(savedLook){try{avatar=newAvatar(JSON.parse(savedLook))}catch{}}
if(!savedLook){
  Object.assign(avatar,{hair:6,outfit:6,face:5,weapon:4,hairColor:7,color:6,acc:0,shoes:1,cape:0});
}
draft={...avatar};refreshAvatar();mountAvatarKey='';refreshMount();
if(document.querySelector('.doll-closet'))drawWardrobe();
