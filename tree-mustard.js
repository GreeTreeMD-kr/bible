/* 겨자나무 그림 (2판) - index.html의 나무 키우기에서 불러다 씀
   등록 이름: '겨자나무' (index.html의 TREES 이름과 같아야 함)
   이 파일은 혼자서 동작하도록 필요한 도구를 모두 안에 가지고 있음 */
(function(){
window.TREEFX=window.TREEFX||{};
const cp=x=>Math.max(0,Math.min(1,x)),
 ss=(a,b,x)=>{const t=cp((x-a)/(b-a));return t*t*(3-2*t)},
 f1=n=>(+n).toFixed(1),
 hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)),
 rgb=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join(''),
 mx=(a,b,t)=>{const A=hx(a),C=hx(b);return rgb(A.map((v,i)=>v+(C[i]-v)*t))},
 lt=(h,k)=>rgb(hx(h).map(v=>k>=0?v+(255-v)*k:v*(1+k))),
 gt=(x,y,a,k,s)=>'<g transform="translate('+f1(x)+' '+f1(y)+') rotate('+a+') scale('+f1(k)+')">'+s+'</g>',
 ci=(x,y,r,c,st)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="'+c+'"'+(st?' stroke="'+st+'" stroke-width=".35"':'')+'/>';

/* ---- 모양 ---- */
/* 갈라진 톱니 잎 (오른쪽을 향한 모양, 위 윤곽을 아래로 거울처럼 접어 만듦) */
const poly=U=>{const up=U.map(p=>p[0]+' '+p[1]).join('L'),dn=U.slice().reverse().slice(1,-1).map(p=>p[0]+' '+(-p[1])).join('L');return 'M'+up+'L'+dn+'Z'},
 ML=poly([[0,0],[3,-2],[4.5,-7.5],[8,-4],[11,-10],[14,-5.2],[18,-8.2],[21,-3.8],[25.5,-4.8],[32,0]]),
 VEIN='M1 0H29M7 0L5.5-4M7 0L5.5 4M13 0L12-5M13 0L12 5M19 0L18.5-4.5M19 0L18.5 4.5',
 NL='M0 0C4-3 11-3 17 0C11 3 4 3 0 0Z',
 CO='M0 0C2-6 11-7 13-1C14 5 5 7 0 0Z',
 /* 네 장짜리 꽃 (반지름 약 5.8) */
 FL='M0 0C-3.2-1-3.6-5.4 0-5.8C3.6-5.4 3.2-1 0 0ZM0 0C1-3.2 5.4-3.6 5.8 0C5.4 3.6 1 3.2 0 0ZM0 0C3.2 1 3.6 5.4 0 5.8C-3.6 5.4-3.2 1 0 0ZM0 0C-1 3.2-5.4 3.6-5.8 0C-5.4-3.6-1-3.2 0 0Z';

function leaf(x,y,ang,k,lob,col){
 return gt(x,y,ang,k,lob
  ?'<path d="'+ML+'" fill="'+col+'" stroke="'+col+'" stroke-width=".9" stroke-linejoin="round"/><path d="'+VEIN+'" stroke="'+lt(col,.4)+'" stroke-width=".5" opacity=".55" fill="none"/>'
  :'<path d="'+NL+'" fill="'+col+'"/>')}

/* 꽃송이: 가운데 줄기에 꽃이 어긋나게 달리고 맨 위는 봉오리. 아래쪽 꽃부터 핀다 */
const RC=[[3.8,-3.4],[-3.8,-6.8],[3.6,-10.2],[-3.4,-13.6],[3,-16.8],[-2.6,-19.8],[.8,-22.4],[-.4,-25]],
 rk=P=>{const o=P.map((q,i)=>i).sort((a,b)=>P[b][1]-P[a][1]),R=[];o.forEach((i,n)=>R[i]=n);return R},
 RR=rk(RC);
function raceme(x,y,sr,o){
 const N=RC.length,fs=sr*.85;let st='',pd='',bd='',fl='';
 st='<path d="M'+f1(x)+' '+f1(y+1)+'L'+f1(x-.3*sr)+' '+f1(y-26*sr)+'" stroke="#6FA050" stroke-width="'+f1(1.1*sr+.3)+'" stroke-linecap="round"/>';
 for(let k=N-1;k>=0;k--){
  const px=x+RC[k][0]*sr,py=y+RC[k][1]*sr,v=cp(o*(N+1)-RR[k]);
  pd+='<path d="M'+f1(x)+' '+f1(py+2.2*sr)+'L'+f1(px)+' '+f1(py)+'" stroke="#7DB35A" stroke-width="'+f1(.6*sr+.1)+'"/>';
  if(v<=0)bd+=ci(px,py,1.7*sr,'#9CCB57','#7BAE3F');
  else if(v<1)fl+=gt(px,py,(k*37)%90,fs*(.35+.5*v),'<path d="'+FL+'" fill="'+mx('#A8D468','#FFDD2E',v)+'" stroke="#86B94A" stroke-width=".4" stroke-linejoin="round"/>');
  else fl+='<use xlink:href="#mstFlo" transform="translate('+f1(px)+' '+f1(py)+') rotate('+(k*37)%90+') scale('+f1(fs)+')"/>'}
 return st+pd+bd+fl}

/* 하늘을 나는 새 (날개가 따로 움직임) */
const FBIRD='<path d="M-5 0L-12 -1.5L-11 2.2Z" fill="#6B523A"/>'
 +'<path class="mstWL" d="M-1 -1Q-5 -11 -13 -9Q-8 -3 1 1Z" fill="#6B523A"/>'
 +'<ellipse cx="0" cy="0" rx="5.2" ry="3" fill="#8B6F4E"/>'
 +'<ellipse cx="1" cy="1.2" rx="3.4" ry="1.5" fill="#E2CBA6"/>'
 +'<path class="mstWR" d="M1 -1Q3 -9 9 -10Q6 -4 3 1Z" fill="#7C6144"/>'
 +'<circle cx="5.2" cy="-2.2" r="2.6" fill="#8B6F4E"/>'
 +'<path d="M7.6 -2.6L11 -1.6L7.6 -.8Z" fill="#E8A33A"/>'
 +'<circle cx="6" cy="-2.9" r=".65" fill="#2B2118"/>';
/* 땅 위를 걷는 새 (몸 가운데가 원점, 발은 아래쪽) */
const WALK='<g class="mstBob"><path d="M-5 -.5L-11 -2.4L-10.2 1.8Z" fill="#6B523A"/>'
 +'<ellipse cx="0" cy="0" rx="5.4" ry="3.4" fill="#8B6F4E"/>'
 +'<ellipse cx=".8" cy="1.3" rx="3.6" ry="1.7" fill="#E2CBA6"/>'
 +'<path d="M-3.6 -.6Q0 -3.4 3.6 -.4Q0 2.2 -3.6 -.6Z" fill="#6B523A"/>'
 +'<g class="mstHead"><circle cx="5.6" cy="-3.6" r="2.7" fill="#8B6F4E"/><path d="M8 -4L11.4 -3L8 -2.2Z" fill="#E8A33A"/><circle cx="6.4" cy="-4.3" r=".65" fill="#2B2118"/></g></g>'
 +'<path class="mstLegA" d="M-1.2 2.6V6.6H.8" stroke="#C8872B" stroke-width=".9" fill="none" stroke-linecap="round"/>'
 +'<path class="mstLegB" d="M1.8 2.6V6.6H3.8" stroke="#C8872B" stroke-width=".9" fill="none" stroke-linecap="round"/>';
const walker=(x,y,k)=>'<g transform="translate('+x+' '+y+')"><g class="mstPace'+k+'"><g transform="scale(1.1)">'+WALK+'</g></g></g>';
/* 움직임 (설정에서 동작 줄이기를 켠 기기는 멈춤) */
const MOVE='<style>'
 +'.mstFly{animation:mstFloat 3.2s ease-in-out infinite alternate}'
 +'@keyframes mstFloat{from{transform:translate(-3px,1px)}to{transform:translate(3px,-2px)}}'
 +'.mstWL{transform-box:fill-box;transform-origin:100% 100%;animation:mstFlapL .7s ease-in-out infinite alternate}'
 +'.mstWR{transform-box:fill-box;transform-origin:0 100%;animation:mstFlapR .7s ease-in-out infinite alternate}'
 +'@keyframes mstFlapL{from{transform:rotate(-6deg)}to{transform:rotate(16deg)}}'
 +'@keyframes mstFlapR{from{transform:rotate(6deg)}to{transform:rotate(-16deg)}}'
 +'.mstPaceA{animation:mstPA 10s linear infinite}'
 +'.mstPaceB{animation:mstPA 13s linear infinite;animation-delay:-6s}'
 +'@keyframes mstPA{0%{transform:translateX(-9px) scaleX(1)}46%{transform:translateX(9px) scaleX(1)}50%{transform:translateX(9px) scaleX(-1)}96%{transform:translateX(-9px) scaleX(-1)}100%{transform:translateX(-9px) scaleX(1)}}'
 +'.mstHead{animation:mstHB .5s ease-in-out infinite alternate}'
 +'@keyframes mstHB{from{transform:translateX(-.8px)}to{transform:translateX(1.4px)}}'
 +'.mstBob{animation:mstBB .25s ease-in-out infinite alternate}'
 +'@keyframes mstBB{from{transform:translateY(0)}to{transform:translateY(-.7px)}}'
 +'.mstLegA,.mstLegB{transform-box:fill-box;transform-origin:50% 0}'
 +'.mstLegA{animation:mstLg .5s ease-in-out infinite alternate}'
 +'.mstLegB{animation:mstLg .5s ease-in-out infinite alternate-reverse}'
 +'@keyframes mstLg{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}'
 +'@media (prefers-reduced-motion:reduce){.mstFly,.mstWL,.mstWR,.mstPaceA,.mstPaceB,.mstHead,.mstBob,.mstLegA,.mstLegB{animation:none!important}}'
 +'</style>';

/* 땅속 단면 창: 흙 속에서 씨앗이 부풀고 뿌리가 내려가며 싹이 올라옴 */
function under(p){
 const o=1-ss(.24,.34,p);if(o<=.02)return '';
 const u=cp(p/.1),sd=1-ss(.14,.26,p),lat=ss(.1,.2,p),sw=ss(0,.4,u),id='mstS'+(++uid);
 let s='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#A47A52" stop-opacity=".92"/><stop offset=".6" stop-color="#A47A52" stop-opacity=".6"/><stop offset="1" stop-color="#A47A52" stop-opacity="0"/></radialGradient></defs>'
  +'<g opacity="'+f1(o)+'"><ellipse cx="100" cy="180" rx="30" ry="8.2" fill="url(#'+id+')"/>';
 /* 씨앗 */
 if(sd>.02){const k=.6+.4*sd;
  s+='<g opacity="'+f1(sd)+'"><ellipse cx="100" cy="180.4" rx="'+f1((3.2+.6*sw)*k)+'" ry="'+f1((2.4+.5*sw)*k)+'" fill="#E3B84A" stroke="#B07F1E" stroke-width=".4"/>';
  if(u>.3)s+='<ellipse cx="100" cy="180.4" rx="'+f1(1.8*k)+'" ry="'+f1(1.1*k)+'" fill="#FFF3C4" opacity="'+f1(ss(.3,.6,u))+'"/><path d="M97 180.4Q100 178.9 103 180.4" stroke="#8B5A12" stroke-width=".5" fill="none"/>';
  s+='</g>'}
 /* 싹(위쪽으로) */
 const sh=4*ss(.35,.62,u);
 if(sh>.1)s+='<path d="M100 179.4V'+f1(179.4-sh)+'" stroke="#D6EDA8" stroke-width="1.5" stroke-linecap="round"/>';
 /* 뿌리(아래쪽으로) */
 const Lr=4.6*ss(.15,.75,u);
 if(Lr>.2){s+='<path d="M100 183Q99.2 '+f1(183+Lr*.5)+' 100.6 '+f1(183+Lr)+'" stroke="#F6F0DA" stroke-width="1.1" stroke-linecap="round" fill="none"/>';
  const hr=ss(.55,.9,u);
  if(hr>.05)s+='<path d="M100 184.6L98.4 185.2M100.2 185.8L101.9 186.3" stroke="#F6F0DA" stroke-width=".5" opacity="'+f1(hr)+'"/>';
  if(lat>.05)s+='<path d="M100.3 185.2L'+f1(100.3-5.6*lat)+' '+f1(185.2+1.8*lat)+'M100.6 185.8L'+f1(100.6+6*lat)+' '+f1(185.8+1.8*lat)+'" stroke="#F6F0DA" stroke-width=".8" stroke-linecap="round" fill="none"/>'}
 return s+'</g>'}

/* 줄기들: 가운데 큰 줄기 하나와 밑동에서 갈라져 나오는 줄기 넷 */
const STEMS=[
 {bx:-5,amp:-58,H:80,p0:.46,wg:1.2,ph:.7,br:[[.6,-1]]},
 {bx:5,amp:60,H:86,p0:.5,wg:1.2,ph:2,br:[[.6,1]]},
 {bx:-3,amp:-34,H:122,p0:.3,wg:1.6,ph:1.3,br:[[.52,-1],[.68,1],[.82,-1]]},
 {bx:3,amp:36,H:128,p0:.34,wg:1.6,ph:2.4,br:[[.52,1],[.68,-1],[.82,1]]},
 {bx:0,amp:0,H:140,p0:.1,wg:3.2,ph:0,main:1,br:[[.46,1],[.56,-1],[.65,1],[.74,-1],[.82,1],[.9,-1]]}
];
const xc=(S,d)=>100+S.bx+S.amp*(1-Math.pow(1-cp(d/S.H),2.2))+S.wg*Math.sin(d/22+S.ph)*cp(d/26);

function stemPoly(S,Hs,wb,fill){
 const n=Math.max(2,Math.ceil(Hs/3)),L=[],R=[],wt=S.main?1.3:1.1;
 for(let k=0;k<=n;k++){const d=Hs*k/n,w=(wt+wb*Math.pow(1-d/Hs,1.4))/2,x=xc(S,d),y=171-d;
  L.push(f1(x-w)+' '+f1(y));R.push(f1(x+w)+' '+f1(y))}
 return '<path d="M'+L.join('L')+'L'+R.reverse().join('L')+'Z" fill="'+fill+'"/>'+ci(xc(S,Hs),171-Hs,wt/2,fill)}

let uid=0;
function mustardT(T,p,r,tot){
 const id='mstG'+(++uid),lc=mx('#C9EE90',T.lc,cp((p-.08)/.9)),dk=lt(lc,-.13),
  sc=mx('#B4DD82','#6FA050',ss(.1,.6,p)),bc=mx(sc,'#A08C58',ss(.5,1,p)*.75),
  husk='<ellipse rx="3.2" ry="2.4" fill="#D9A93A" stroke="#B07F1E" stroke-width=".5"/><ellipse cx="-.8" cy="-.8" rx="1.2" ry=".7" fill="#F3D27A"/>';
 let h='';

 /* 1) 씨앗 (0~9%) : 땅속에서 발아해 싹이 땅 위로 올라옴 */
 if(p<.1){
  const u=cp(p/.1),Ht=16*ss(.5,1,u),ys=165.5-Ht;
  h+=under(p);
  if(Ht>.5)h+='<path d="M100 171V'+f1(171-Ht)+'" stroke="#CFE9A0" stroke-width="'+f1(1.6+.8*ss(.5,1,u))+'" stroke-linecap="round" fill="none"/>';
  const k=ss(.72,1,u);
  if(k>.02){const y0=171-Ht,s=.85*k;h+=gt(100,y0,-150+10*(1-k),s,'<path d="'+CO+'" fill="#B4E07A"/>')+gt(100,y0,-30-10*(1-k),s,'<path d="'+CO+'" fill="#A5D86B"/>')}
  if(Ht>.6)h+=gt(100,ys,0,1+.25*u,husk);
  return h}

 /* 2) 싹 이후 */
 const q=cp((p-.1)/.9),o=cp((p-.78)/.22),ofn=d=>cp(o*1.6-Math.min(6,6*d/150)/6*.6),
  defs='<defs><linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="171" x2="0" y2="20"><stop offset="0" stop-color="'+bc+'"/><stop offset=".55" stop-color="'+sc+'"/></linearGradient><g id="mstFlo"><path d="'+FL+'" fill="#FFDD2E" stroke="#E5AD00" stroke-width=".4" stroke-linejoin="round"/><circle r="2.3" fill="#FFF07A" opacity=".6"/><circle r="1" fill="#F59E0B"/></g></defs>';
 let cl='';
 h+=under(p)+defs;

 /* 밑동에서 사방으로 펼쳐지는 큰 잎 */
 const kb=ss(.14,.42,p),bl=lt(lc,-.2);
 if(kb>.02)[[4,1.25,1,0],[-22,1.05,1,1],[-50,.8,1,0],[4,1.15,-1,1],[-24,1,-1,0],[-52,.75,-1,1]].forEach(([a,s,side,c])=>{
  h+=leaf(100+side*3,168,side>0?a:180-a,s*kb,1,c?bl:dk)});

 /* 줄기마다 : 곁가지 -> 잎 -> 줄기 -> 끝 송이 */
 STEMS.forEach(S=>{
  const g=S.main?q:cp((p-S.p0)/(1-S.p0)),Hs=S.main?16+(S.H-16)*Math.pow(q,.8):S.H*Math.pow(g,.75);
  if(Hs<8)return;
  S.br.forEach(([fr,side],i)=>{
   const db=fr*S.H,gb=cp((Hs-db-4)/(S.main?46:40))*(S.main?ss(.36,.5,p):1);if(gb<=.02)return;
   const L=(S.main?34-3.5*i:22-3*i)*gb,x0=xc(S,db),y0=171-db,dx=side*L*.9,dy=-L*.62;
   h+='<path d="M'+f1(x0)+' '+f1(y0)+'Q'+f1(x0+dx*.7)+' '+f1(y0+dy*.15)+' '+f1(x0+dx)+' '+f1(y0+dy)+'" stroke="'+sc+'" stroke-width="'+f1(1+.7*gb)+'" stroke-linecap="round" fill="none"/>';
   cl+=raceme(x0+dx,y0+dy+2,(S.main?.3+.55*gb:.3+.5*gb),ofn(171-(y0+dy)))});
  const d0=S.main?20:16,stp=S.main?11:13,fm=S.main?1:.85,lb=.55*S.H;
  for(let i=0,d=d0;d<=Math.min(Hs-6,S.H-16);i++,d+=stp){
   const gl=ss(d,d+20,Hs),a=Math.round(8-45*d/150),lob=d<lb,
    k=(lob?.9-.45*(d/lb):.95-.3*cp((d-lb)/(S.H-lb)))*gl*fm,side=i%2?-1:1;
   if(k>.04)h+=leaf(xc(S,d),171-d,side>0?a:180-a,k,lob,i%2?lc:dk)}
  h+=stemPoly(S,Hs,S.main?1+1.9*g:.6+1.5*g,'url(#'+id+')');
  if(S.main){if(p>.38)cl+=raceme(xc(S,Hs),171-Hs+2,(.45+.45*q)*ss(.38,.55,p),ofn(171-Hs))}
  else cl+=raceme(xc(S,Hs),171-Hs+2,(.3+.55*g)*ss(18,40,Hs),ofn(171-Hs))});

 /* 떡잎 : 자라면서 시들어 사라짐 (가운데 줄기 아래쪽) */
 const co=1-ss(.3,.45,p);
 if(co>.02){const y0=171-16,s=.85;h+='<g opacity="'+f1(co)+'">'+gt(100,y0,-150,s,'<path d="'+CO+'" fill="#B4E07A"/>')+gt(100,y0,-30,s,'<path d="'+CO+'" fill="#A5D86B"/>')+'</g>'}
 if(p<.17)h+='<g opacity="'+f1(1-ss(.12,.17,p))+'">'+gt(98,151,-25,1.25,husk)+'</g>';

 h+=cl;

 /* 완성 : 하늘을 나는 새(식물 쪽을 바라봄)와 땅에서 걷는 새 두 마리 */
 if(r>=tot)h+=MOVE+gt(168,40,6,.8,'<g class="mstFly"><g transform="scale(-1 1)">'+FBIRD+'</g></g>')+walker(52,177,'A')+walker(148,177,'B');
 return h}

mustardT.ns=1;
window.TREEFX['겨자나무']=mustardT;
})();
