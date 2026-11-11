/* 아몬드나무(성경의 살구나무) 그림 - index.html의 나무 키우기에서 불러다 씀
   등록 이름: '아몬드나무' 와 '살구나무' 둘 다 (index.html의 TREES 이름 중 어느 쪽이든 동작)
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

/* 정해진 번호마다 늘 같은 값이 나오는 '불규칙' (기기가 달라도 같은 모양) */
const R=n=>{let t=(n+0x6D2B79F5)|0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296},
 rr=(a,b,n)=>a+(b-a)*R(n);
/* 쑥쑥 자라다 쉬다 하는 성장 곡선 (0~1 -> 0~1, 줄어들지 않음) */
const spurt=(sd,x)=>{
 const raw=v=>{let a=0,w=0;for(let i=0;i<6;i++){const c=(i+.5+(R(sd*31+i)-.5)*.9)/6,m=.4+R(sd*17+i)*1.2;a+=m*ss(c-.07,c+.07,v);w+=m}return .4*v+.6*a/w};
 return raw(cp(x))/raw(1)};

/* ---- 모양 ---- */
const LF='M0 0C3-2.4 9-2.4 13 0C9 2.4 3 2.4 0 0Z',   /* 가늘고 긴 잎 */
 OV='M0 0C2-4 9-5 11 0C9 5 2 4 0 0Z',                /* 어린 둥근 잎 */
 HULL='M0 -4.6C3.2-3.2 3.8 2.4 0 5.4C-3.8 2.4 -3.2-3.2 0-4.6Z',
 NUT='M0 -3.6C2.2-2.2 2.6 1.8 0 4.4C-2.6 1.8 -2.2-2.2 0-3.6Z',
 HL='M0 -4.6C-3.2-3.2 -3.8 2.4 0 5.4C-1.5 2.2 -1.7-2.8 0-4.6Z',
 HR='M0 -4.6C3.2-3.2 3.8 2.4 0 5.4C1.5 2.2 1.7-2.8 0-4.6Z';
let curLid='';
const leafU=(x,y,a,k,v)=>'<use xlink:href="#almLf'+curLid+'ABC'[v]+'" transform="translate('+f1(x)+' '+f1(y)+') rotate('+a+') scale('+f1(k)+')"/>',
 LFD=cols=>cols.map((c,i)=>'<g id="almLf'+curLid+'ABC'[i]+'"><path d="'+LF+'" fill="'+c+'"/><path d="M1 0H11" stroke="'+lt(c,.35)+'" stroke-width=".45" opacity=".6" fill="none"/></g>').join('');
/* 꽃 한 송이 (흰 꽃잎 다섯 장, 가운데 분홍) - defs에 한 번만 정의해 두고 가져다 씀 */
const PET='<path d="M0 0C-2.7-1-3.5-4.7 0-5.1C3.5-4.7 2.7-1 0 0Z" fill="#FFFDFB" stroke="#EBC3CB" stroke-width=".35"/>',
 FLO='<g id="almFlo">'+[0,72,144,216,288].map(a=>'<g transform="rotate('+a+')">'+PET+'</g>').join('')
  +'<circle r="2.4" fill="#F9D3DB" opacity=".85"/><circle r="1.1" fill="#E8668A"/>'
  +'<path d="M0 0L-1.8-2.2M0 0L1.9-2M0 0L2.3 .9M0 0L-.6 2.5M0 0L-2.4 1" stroke="#F2B84B" stroke-width=".35"/></g>';

/* ---- 나무 뼈대: 줄기와 가지의 완성된 모양을 미리 계산 (불러올 때 한 번) ---- */
const N=14,BR=[];
function build(o){
 const b=Object.assign({xs:[],ys:[],th:[]},o);
 let x=b.x0,y=b.y0;
 for(let k=0;k<=N;k++){
  const t=k/N,a=b.th0*(1-.6*t)+b.wig*Math.sin(t*8.2+b.ph);
  b.th[k]=a;b.xs[k]=x;b.ys[k]=y;
  const r=a*Math.PI/180,dl=b.len/N;x+=Math.sin(r)*dl;y-=Math.cos(r)*dl}
 BR.push(b);return b}
const at=(b,f)=>{const q=cp(f)*N,k=Math.min(N-1,Math.floor(q)),u=q-k;
 return {x:b.xs[k]+(b.xs[k+1]-b.xs[k])*u,y:b.ys[k]+(b.ys[k+1]-b.ys[k])*u,th:b.th[k]+(b.th[k+1]-b.th[k])*u}};
let sdn=10;
const TR=build({kind:0,x0:100,y0:171,th0:0,wig:5,ph:.4,len:86,p0:.1,p1:.72,sd:11,wb:8.5,wt:2.4,par:-1,f:0});
BR.length=0;BR.push(TR);
function child(par,f,side,rel,lenf,kind,p0,p1,wb,wt){
 const P=BR[par],pt=at(P,f),th0=Math.max(-100,Math.min(100,pt.th+side*rel)),
  b=build({kind:kind,x0:pt.x,y0:pt.y,th0:th0,wig:rr(-6,6,++sdn),ph:rr(0,6,++sdn),len:P.len*lenf,p0:p0,p1:Math.min(.93,p1),sd:++sdn,wb:wb,wt:wt,par:par,f:f});
 return BR.length-1}
/* 큰 가지 8개 */
[[.34,-1,68,.92],[.42,1,66,.94],[.52,-1,56,.86],[.6,1,52,.84],[.72,-1,44,.76],[.8,1,42,.76],[1,-1,24,.62],[1,1,22,.58]].forEach((a,i)=>{
 child(0,a[0],a[1],a[2],a[3],1,.2+.035*i+R(700+i)*.06,.62+.2*R(720+i)+.02*i,3.2,.7)});
/* 작은 가지: 큰 가지마다 둘씩, 잔가지: 작은 가지마다 하나씩 */
for(let i=1;i<=8;i++){
 const P=BR[i];
 [[.42,.52],[.76,.42]].forEach((a,j)=>{
  const s=child(i,a[0],(i+j)%2?1:-1,36+R(740+i*3+j)*14,a[1],2,P.p0+.1+R(760+i*3+j)*.1,P.p1+.04,1.8,.55);
  child(s,.7,(i+j)%2?-1:1,38,.5,3,BR[s].p0+.08+R(780+i*3+j)*.08,BR[s].p1+.03,1.1,.45)})}
const ORDER=BR.map((b,i)=>i).sort((a,b)=>BR[b].kind-BR[a].kind);   /* 잔가지부터 그려 줄기가 위로 오게 */

/* 꽃·열매 자리: 작은 가지, 잔가지, 큰 가지 끝에 */
const SPOTS=[];
BR.forEach((b,i)=>{
 if(b.kind===0)return;
 const ss0=b.kind===1?[.8,.97]:b.kind===2?[.45,.8]:[.55,.9];
 ss0.forEach((s,j)=>{const e=i*10+j;SPOTS.push({b:i,s:s+(R(900+e)-.5)*.08,side:R(910+e)<.5?-1:1,e:e,
  tb:.38+.3*R(920+e),sc:1.15+.5*R(930+e),rot:Math.round((R(940+e)-.5)*50)})})});
SPOTS.forEach(sp=>{sp.tf=Math.min(.9,sp.tb+.16+.16*R(950+sp.e));sp.ts=Math.min(.97,sp.tf+.1+.12*R(960+sp.e))});

let uid=0;
function bProg(b,p){return cp((p-b.p0)/(b.p1-b.p0))}
/* 가지의 자란 정도(0~1): 부모가 아직 거기까지 안 자랐으면 못 나옴 */
function growth(i,p,memo){
 if(memo[i]!==undefined)return memo[i];
 const b=BR[i];let g=spurt(b.sd,bProg(b,p));
 if(b.par>=0)g*=ss(b.f,b.f+.12,growth(b.par,p,memo));
 return memo[i]=g}
function poly(b,g,p,col){
 if(g<=.01)return '';
 const wbE=b.wb*(.4+.6*cp((p-b.p0)/(1-b.p0))),L=[],Q=[],n=Math.max(2,Math.ceil(g*N));
 for(let k=0;k<=n;k++){
  const t=Math.min(g,g*k/n),pt=at(b,t),a=pt.th*Math.PI/180,w=Math.max(b.wt*.5,b.wt+(wbE-b.wt)*Math.pow(Math.max(0,1-t),1.1))/2;
  L.push(f1(pt.x-Math.cos(a)*w)+' '+f1(pt.y-Math.sin(a)*w));Q.push(f1(pt.x+Math.cos(a)*w)+' '+f1(pt.y+Math.sin(a)*w))}
 return '<path d="M'+L.join('L')+'L'+Q.reverse().join('L')+'Z" fill="'+col+'"/>'}

/* 땅속 단면: 흙 속에서 씨앗(갈색 껍질)이 갈라지며 뿌리가 내려가고 싹이 올라옴 */
function under(p){
 const o=1-ss(.24,.34,p);if(o<=.02)return '';
 const u=cp(p/.1),sd=1-ss(.14,.26,p),lat=ss(.1,.2,p),sw=ss(0,.4,u),id='almS'+(++uid);
 let s='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#A47A52" stop-opacity=".92"/><stop offset=".6" stop-color="#A47A52" stop-opacity=".6"/><stop offset="1" stop-color="#A47A52" stop-opacity="0"/></radialGradient></defs>'
  +'<g opacity="'+f1(o)+'"><ellipse cx="100" cy="180" rx="30" ry="8.2" fill="url(#'+id+')"/>';
 if(sd>.02){const k=.6+.4*sd;
  s+='<g opacity="'+f1(sd)+'" transform="translate(100 180.6) scale('+f1(k)+')"><path d="M-4.4 0C-2.6-3 2.4-3.2 4.6 0C2.4 3.2-2.6 3 -4.4 0Z" fill="#B88556" stroke="#7C4F2C" stroke-width=".45"/>'
   +'<path d="M-3 -.2C-1-1.2 1.4-1.2 3 -.2" stroke="#8C5E45" stroke-width=".35" fill="none"/>';
  if(u>.3)s+='<path d="M-3.6 .3C-1 1.4 1.6 1.4 3.7 .3" stroke="#5E3A20" stroke-width=".5" fill="none" opacity="'+f1(ss(.3,.6,u))+'"/><ellipse cx="0" cy=".2" rx="1.6" ry=".6" fill="#F4E4C8" opacity="'+f1(ss(.3,.6,u))+'"/>';
  s+='</g>'}
 const sh=4*ss(.35,.62,u);
 if(sh>.1)s+='<path d="M100 179.4V'+f1(179.4-sh)+'" stroke="#D6EDA8" stroke-width="1.5" stroke-linecap="round"/>';
 const Lr=4.6*ss(.15,.75,u);
 if(Lr>.2){s+='<path d="M100 183Q99.2 '+f1(183+Lr*.5)+' 100.6 '+f1(183+Lr)+'" stroke="#F3DCCD" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M100 183V'+f1(183.7)+'" stroke="#D9857A" stroke-width="1.2" stroke-linecap="round"/>';
  const hr=ss(.55,.9,u);
  if(hr>.05)s+='<path d="M100 184.6L98.4 185.2M100.2 185.8L101.9 186.3" stroke="#F3DCCD" stroke-width=".5" opacity="'+f1(hr)+'"/>';
  if(lat>.05)s+='<path d="M100.3 185.2L'+f1(100.3-5.6*lat)+' '+f1(185.2+1.8*lat)+'M100.6 185.8L'+f1(100.6+6*lat)+' '+f1(185.8+1.8*lat)+'" stroke="#F3DCCD" stroke-width=".8" stroke-linecap="round" fill="none"/>'}
 return s+'</g>'}

function almondT(T,p,r,tot){
 const id='almG'+(++uid),
  lc=mx('#CDEB9A',T.lc,cp((p-.08)/.7)),dk=lt(lc,-.14),
  bark=mx('#A9C47E',T.tc,ss(.12,.55,p));
 let h='';

 /* 1) 씨앗 (0~9%) */
 if(p<.1){
  const u=cp(p/.1),Ht=16*ss(.5,1,u),k=ss(.75,1,u);
  h+=under(p);
  if(Ht>.5)h+='<path d="M100 171V'+f1(171-Ht)+'" stroke="#CFE9A0" stroke-width="'+f1(1.6+.8*ss(.5,1,u))+'" stroke-linecap="round" fill="none"/>';
  if(k>.02){const y0=171-Ht;h+=gt(100,y0,-150,.7*k,'<path d="'+OV+'" fill="#B4E07A"/>')+gt(100,y0,-30,.7*k,'<path d="'+OV+'" fill="#A5D86B"/>')}
  return h}

 /* 2) 싹 이후 */
 curLid=String(++uid);
 h+=under(p)+'<defs>'+FLO+LFD([lc,dk,lt(lc,.1)])+'</defs>';
 const memo={},G=BR.map((b,i)=>growth(i,p,memo));
 let lv='',fl='',ru='';

 /* 가지와 줄기 (잔가지부터) */
 ORDER.forEach(i=>{h+=poly(BR[i],G[i],p,bark)});
 /* 줄기 껍질 무늬 */
 if(p>.5&&G[0]>.4)for(let k=0;k<7;k++){const pt=at(TR,.12+.1*k+R(800+k)*.05);if(.12+.1*k<G[0])ru+='<path d="M'+f1(pt.x+(R(810+k)-.5)*3)+' '+f1(pt.y)+'l'+f1((R(820+k)-.5)*1.4)+' 4.5" stroke="#6E4631" stroke-width=".5" opacity="'+f1(.5*ss(.5,.7,p))+'" stroke-linecap="round"/>'}
 h+=ru;

 /* 어린 줄기의 둥근 잎(자라면서 떨어짐) */
 const jl=1-ss(.3,.55,p);
 if(jl>.02){
  for(let k=0;k<6;k++){const d=10+k*9;if(d>G[0]*TR.len-4)break;const pt=at(TR,d/TR.len),side=k%2?-1:1,gl=ss(d,d+14,G[0]*TR.len);
   lv+=gt(pt.x,pt.y,side>0?-30-k*3:-150+k*3,(.9*jl*gl*(.9+R(830+k)*.2)),'<path d="'+OV+'" fill="'+(k%2?lc:dk)+'"/>')}
  const co=1-ss(.18,.3,p);
  if(co>.02&&G[0]*TR.len>12){const pt=at(TR,16/TR.len);lv+=gt(pt.x,pt.y,-150,.7,'<path d="'+OV+'" fill="#B4E07A" opacity="'+f1(co)+'"/>')+gt(pt.x,pt.y,-30,.7,'<path d="'+OV+'" fill="#A5D86B" opacity="'+f1(co)+'"/>')}}

 /* 잎: 가지를 따라 마주나기, 끝에는 세 장 */
 BR.forEach((b,i)=>{
  if(b.kind===0)return;
  const g=G[i];if(g<.08)return;
  const nk=b.kind===3?5:6,pair=true,base=b.kind===1?1:b.kind===2?1.05:.95;
  for(let k=0;k<nk;k++){
   const s=.14+k*(.8/nk)+(R(i*50+k)-.5)*.05,gl=ss(s+rr(0,.06,i*50+k+20),s+.3,g);
   if(gl<.05)continue;
   const pt=at(b,s);
   for(let sd=-1;sd<=1;sd+=2){
    if(!pair&&((k+(sd>0?1:0))%2))continue;
    const a=pt.th+sd*(52+R(i*50+k+sd+99)*22)+Math.round((R(i*50+k+sd+60)-.5)*18),sz=gl*base*(.8+R(i*50+k+sd+70)*.4);
    lv+=leafU(pt.x,pt.y,Math.round(a-90),sz,(k+sd+i+2)%3)}}
  const tp=at(b,g),tg=ss(.5,.9,g);
  if(tg>.05)[-48,-16,16,48].forEach((dq,q)=>{lv+=leafU(tp.x,tp.y,Math.round(tp.th-90+dq),tg*base*(.85+R(i*50+q+40)*.3),(q+i)%3)})});
 h+=lv;

 /* 꽃(흰색, 분홍) -> 꽃이 지면 열매가 맺혀 갈라지며 아몬드가 보임 */
 SPOTS.forEach(sp=>{
  const b=BR[sp.b],g=G[sp.b],vis=ss(sp.s,sp.s+.1,g);
  if(vis<.05)return;
  const pt=at(b,sp.s),a=pt.th*Math.PI/180,x=pt.x+Math.cos(a)*sp.side*2.4,y=pt.y+Math.sin(a)*sp.side*2.4,
   bud=ss(sp.tb-.08,sp.tb,p)*(1-ss(sp.tb,sp.tb+.03,p)),op=ss(sp.tb,sp.tb+.04,p)*(1-ss(sp.tf-.03,sp.tf,p));
  if(bud>.05)fl+=ci(x,y,1.6*bud*vis*sp.sc,'#F3B4C4','#E58AA4');
  if(op>.03)fl+='<use xlink:href="#almFlo" transform="translate('+f1(x)+' '+f1(y)+') rotate('+sp.rot*2+') scale('+f1(sp.sc*op*vis)+')"/>';
  /* 같은 자리에 둘째 꽃: 조금 늦게 피고 조금 작음 */
  const tb2=sp.tb+.03+.05*R(sp.e+500),op2=ss(tb2,tb2+.04,p)*(1-ss(sp.tf-.01,sp.tf+.02,p));
  if(op2>.03)fl+='<use xlink:href="#almFlo" transform="translate('+f1(x-Math.cos(a)*sp.side*3.4)+' '+f1(y-Math.sin(a)*sp.side*3.4-1.5)+') rotate('+(sp.rot*2+40)+') scale('+f1(sp.sc*.8*op2*vis)+')"/>';
  const fs=ss(sp.tf-.01,sp.tf+.1,p)*vis;
  if(fs>.05){
   const rp=ss(sp.tf+.05,sp.ts,p),sf=ss(sp.ts,sp.ts+.03,p),hc=mx('#9DBA72','#C9CF8A',rp),k=fs*1.2;
   const fy=y+4.2*k;
   fl+='<path d="M'+f1(x)+' '+f1(y)+'L'+f1(x)+' '+f1(fy-3*k)+'" stroke="#7B8F52" stroke-width=".6"/>';
   if(sf<.02)fl+=gt(x,fy,sp.rot,k,'<path d="'+HULL+'" fill="'+hc+'" stroke="'+lt(hc,-.2)+'" stroke-width=".35"/><ellipse cx="-1" cy="-1.4" rx=".9" ry="1.8" fill="#fff" opacity=".28"/>');
   else{const d=.5+1.7*sf;
    fl+=gt(x,fy,sp.rot,k,'<path d="'+NUT+'" fill="#A9764A" stroke="#7C4F2C" stroke-width=".3"/><path d="M0 -3.2V3.6" stroke="#8C5E45" stroke-width=".3"/>'
     +'<g transform="translate('+f1(-d)+' 0) rotate('+f1(-sf*14)+')"><path d="'+HL+'" fill="'+hc+'" stroke="'+lt(hc,-.2)+'" stroke-width=".3"/></g>'
     +'<g transform="translate('+f1(d)+' 0) rotate('+f1(sf*14)+')"><path d="'+HR+'" fill="'+hc+'" stroke="'+lt(hc,-.2)+'" stroke-width=".3"/></g>')}}});
 h+=fl;
 return h}

almondT.ns=1;
window.TREEFX['아몬드나무']=almondT;
window.TREEFX['살구나무']=almondT;
})();
