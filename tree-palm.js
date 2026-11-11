/* 대추야자나무(성경의 종려나무) 그림 - index.html의 나무 키우기에서 불러다 씀
   등록 이름: '종려나무' 와 '대추야자나무' 둘 다 (index.html의 TREES 이름 중 어느 쪽이든 동작)
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
 ci=(x,y,r,c,st)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="'+c+'"'+(st?' stroke="'+st+'" stroke-width=".35"':'')+'/>';

/* 정해진 번호마다 늘 같은 값이 나오는 '불규칙' (기기가 달라도 같은 모양) */
const R=n=>{let t=(n+0x6D2B79F5)|0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296},
 rr=(a,b,n)=>a+(b-a)*R(n);
/* 쑥쑥 자라다 쉬다 하는 성장 곡선 (0~1 -> 0~1, 줄어들지 않음) */
const spurt=(sd,x)=>{
 const raw=v=>{let a=0,w=0;for(let i=0;i<6;i++){const c=(i+.5+(R(sd*31+i)-.5)*.9)/6,m=.4+R(sd*17+i)*1.2;a+=m*ss(c-.07,c+.07,v);w+=m}return .4*v+.6*a/w};
 return raw(cp(x))/raw(1)};

const N=16;
/* ---- 줄기(잎자루) 모양: 맨 아래에서 시작해 갈수록 바깥쪽으로 휘어짐 ---- */
function rach(F,len,arch){
 const xs=[],ys=[],th=[];let x=F.bx,y=F.by;
 for(let k=0;k<=N;k++){const t=k/N,a=F.th0+arch*F.cv*Math.pow(t,1.25);th[k]=a;xs[k]=x;ys[k]=y;const r=a*Math.PI/180,dl=len/N;x+=Math.sin(r)*dl;y-=Math.cos(r)*dl}
 return {xs:xs,ys:ys,th:th}}
/* 잎 한 장: 처음엔 좁고 곧은 칼 모양 -> 자라면서 깃털처럼 갈라져 펼쳐지고 바깥으로 휘어짐 */
function frond(F,len,g,col,dcol){
 if(len<3)return '';
 const open=ss(.35,1,g),arch=ss(.12,1,g),P=rach(F,len,arch);
 let s='';
 /* 칼 모양 (어린 잎) */
 const bo=1-ss(.2,.45,open);
 if(bo>.02){const L=[],Q=[];
  for(let k=0;k<=N;k++){const w=(.4+1.9*Math.sin(Math.PI*Math.pow(k/N,.7)))*(.8+.4*(1-open))/2,a=P.th[k]*Math.PI/180;
   L.push(f1(P.xs[k]-Math.cos(a)*w)+' '+f1(P.ys[k]-Math.sin(a)*w));Q.push(f1(P.xs[k]+Math.cos(a)*w)+' '+f1(P.ys[k]+Math.sin(a)*w))}
  s+='<path d="M'+L.join('L')+'L'+Q.reverse().join('L')+'Z" fill="'+col+'" opacity="'+f1(bo)+'"/>'}
 /* 깃꼴 (자란 잎) */
 const po=ss(.2,.45,open);
 if(po>.02){
  let rp='M'+f1(P.xs[0])+' '+f1(P.ys[0]),lf='';
  for(let k=1;k<=N;k++)rp+='L'+f1(P.xs[k])+' '+f1(P.ys[k]);
  const phi=(6+50*open)*Math.PI/180,sc=.3+.7*open;
  for(let k=2;k<N;k++){
   const t=k/N,a=P.th[k]*Math.PI/180,ll=F.ll*Math.sin(Math.PI*Math.pow(t,.8))*(.88+.24*R(F.sd*40+k))*sc;
   for(let sd=-1;sd<=1;sd+=2){
    const b=a+sd*phi;
    lf+='M'+f1(P.xs[k])+' '+f1(P.ys[k])+'L'+f1(P.xs[k]+Math.sin(b)*ll)+' '+f1(P.ys[k]-Math.cos(b)*ll+ll*.28*open)}}
  s+='<g opacity="'+f1(po)+'"><path d="'+lf+'" stroke="'+col+'" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="'+rp+'" stroke="'+dcol+'" stroke-width="1.2" stroke-linecap="round" fill="none"/></g>'}
 return s}

/* ---- 잎(가지) 13장의 계획: 각도, 길이, 나오는 때 ---- */
const FR=[],AN=[0,-16,14,-34,32,-52,50,-70,68,-88,86,-104,102];
AN.forEach((a,i)=>{
 const side=a<0?-1:1,p0=(i?.1+i*.043:.03)+R(100+i)*.04;
 FR.push({th0:a+Math.round((R(110+i)-.5)*8),cv:side*(i?rr(70,100,120+i):rr(-14,14,120)),L:(i?(Math.abs(a)>80?48:60):46)*(.92+.16*R(130+i)),ll:(Math.abs(a)>80?9:11)+R(140+i)*2.5,
  p0:p0,p1:Math.min(.98,p0+.3+.14*R(150+i)),sd:200+i,drop:Math.abs(a)>80?5:Math.abs(a)>40?2.5:0,bx:0,by:0})});
/* 밑동의 새순 둘 */
const SUCK=[{x:84,a:[-26,-6,16],L:[26,32,24],p0:.36},{x:117,a:[-14,8,30],L:[24,30,26],p0:.48}];

/* ---- 열매 송이 6개 ---- */
const DC=[[2,-1.6],[3,-.8],[4,0],[5,0],[5,0],[4,0],[3,0],[2,0]];   /* 줄마다 열매 수 */
const BU=[];
[[-50,26,-6,3],[-26,22,-3,6],[-8,28,-1.5,4],[10,24,1.5,7],[30,27,3,3],[52,22,6,5]].forEach((a,j)=>{BU.push({side:a[0]<0?-1:1,ang:a[0],len:a[1],sc:.85+.28*R(320+j),tb:.5+.28*R(330+j),e:.9+.095*R(340+j),fin:.6+.38*R(350+j),sd:360+j,ox:a[2],oy:a[3]})});
const DCOL=[[0,'#8DB548'],[.25,'#D9C24A'],[.5,'#F29A2E'],[.75,'#C94A2B'],[1,'#7B4322']];
const dcolor=v=>{v=cp(v);for(let i=1;i<DCOL.length;i++){if(v<=DCOL[i][0]){const a=DCOL[i-1],b=DCOL[i];return mx(a[1],b[1],(v-a[0])/(b[0]-a[0]))}}return DCOL[DCOL.length-1][1]};
function bunch(B,x0,y0,p){
 const gr=ss(B.tb,B.tb+.12,p);
 if(gr<.04)return '';
 const rp=ss(B.tb+.1,B.e,p)*B.fin,a=B.ang*Math.PI/180,s=B.sc*gr;
 /* 줄기: 위에서 아래로 늘어짐 */
 const ex=x0+Math.sin(a)*B.len*.8*s,ey=y0+Math.cos(a)*B.len*.35*s+5*s;
 let out='<path d="M'+f1(x0)+' '+f1(y0)+'Q'+f1(x0+Math.sin(a)*B.len*.6*s)+' '+f1(y0-1*s)+' '+f1(ex)+' '+f1(ey)+'" stroke="#E0A34A" stroke-width="'+f1(1.3*s+.2)+'" fill="none" stroke-linecap="round"/>';
 const buckets={};
 let rowY=ey;
 DC.forEach((row,ri)=>{const n=row[0]+(row[1]>0?0:0),cnt=[2,3,4,5,5,4,3,2][ri];
  for(let c=0;c<cnt;c++){
   const e=B.sd*100+ri*10+c,dx=(c-(cnt-1)/2)*3.1*s+(R(e)-.5)*.9*s,dy=ri*3.4*s+(R(e+50)-.5)*.8*s,
    v=rp+(R(e+70)-.5)*.2,col=dcolor(v);
   (buckets[col]=buckets[col]||[]).push([ex+dx+Math.sin(a)*ri*.6*s,ey+dy+1.5*s,1.75*s,2.35*s])}});
 Object.keys(buckets).forEach(col=>{
  out+='<path d="'+buckets[col].map(d=>'M'+f1(d[0]-d[2])+' '+f1(d[1])+'a'+f1(d[2])+' '+f1(d[3])+' 0 1 0 '+f1(2*d[2])+' 0a'+f1(d[2])+' '+f1(d[3])+' 0 1 0 '+f1(-2*d[2])+' 0Z').join('')+'" fill="'+col+'" stroke="'+lt(col,-.3)+'" stroke-width=".3"/>'});
 return out}

/* ---- 몸통: 마름모 무늬가 있는 곧은 줄기 ---- */
const TXY=d=>100+4*Math.sin(d/38)*cp(d/20);
function trunk(Ht,col,dk){
 if(Ht<4)return '';
 const n=Math.max(2,Math.ceil(Ht/4)),L=[],Q=[];
 for(let k=0;k<=n;k++){const d=Ht*k/n,w=(9+4*Math.pow(Math.max(0,1-d/14),2)-1.2*d/95)/2,x=TXY(d),y=171-d;L.push(f1(x-w)+' '+f1(y));Q.push(f1(x+w)+' '+f1(y))}
 let s='<path d="M'+L.join('L')+'L'+Q.reverse().join('L')+'Z" fill="'+col+'"/>',pat='';
 for(let k=0;;k++){const d=7+k*6.4;if(d>Ht-2)break;
  const xs=k%2?[0]:[-3,3];
  xs.forEach(dx=>{pat+='M'+f1(TXY(d)+dx)+' '+f1(171-d-3.2)+'l3 3.2l-3 3.2l-3-3.2Z'})}
 return s+'<path d="'+pat+'" fill="'+lt(col,.14)+'" stroke="'+dk+'" stroke-width=".5" stroke-linejoin="round"/>'}

/* ---- 땅속 단면: 대추야자 씨(길쭉, 붉은 갈색)에서 흰 싹이 나와 뿌리는 아래로, 싹은 위로 ---- */
let uid=0;
function under(p){
 const o=1-ss(.24,.34,p);if(o<=.02)return '';
 const u=cp(p/.1),sd=1-ss(.14,.26,p),lat=ss(.1,.2,p),sw=ss(0,.4,u),id='palS'+(++uid);
 let s='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#A47A52" stop-opacity=".92"/><stop offset=".6" stop-color="#A47A52" stop-opacity=".6"/><stop offset="1" stop-color="#A47A52" stop-opacity="0"/></radialGradient></defs>'
  +'<g opacity="'+f1(o)+'"><ellipse cx="100" cy="180" rx="30" ry="8.2" fill="url(#'+id+')"/>';
 if(sd>.02){const k=.6+.4*sd;
  s+='<g opacity="'+f1(sd)+'" transform="translate(95 181) scale('+f1(k)+')"><ellipse rx="'+f1(5.4+.4*sw)+'" ry="'+f1(2.3+.3*sw)+'" fill="#B9653A" stroke="#7A3F22" stroke-width=".45"/>'
   +'<path d="M-4.2 .1H4.2" stroke="#7A3F22" stroke-width=".5"/><ellipse cx="-1.4" cy="-.9" rx="2" ry=".6" fill="#E3A47F" opacity=".7"/></g>'}
 /* 흰 싹: 씨 오른쪽 끝에서 나와 아래로 굽어 뿌리가 됨 */
 const Lr=7*ss(.12,.7,u);
 if(Lr>.2)s+='<path d="M100.4 181C103 181 104.2 '+f1(181+Lr*.3)+' 102.4 '+f1(181+Lr*.8)+'" stroke="#F8F4E8" stroke-width="1.5" stroke-linecap="round" fill="none" transform="translate(-2 0)"/>';
 const hr=ss(.55,.9,u);
 if(hr>.05)s+='<path d="M100.6 185.2L98.8 185.8M100.8 186.4L102.5 186.9" stroke="#F8F4E8" stroke-width=".5" opacity="'+f1(hr)+'"/>';
 if(lat>.05)s+='<path d="M100.5 186L'+f1(100.5-5*lat)+' '+f1(186+1.6*lat)+'M100.8 186.4L'+f1(100.8+5.5*lat)+' '+f1(186.4+1.6*lat)+'" stroke="#F8F4E8" stroke-width=".8" stroke-linecap="round" fill="none"/>';
 /* 싹: 위로 */
 const sh=6.4*ss(.3,.62,u);
 if(sh>.1)s+='<path d="M100.4 180.4V'+f1(180.4-sh)+'" stroke="#D6EDA8" stroke-width="1.6" stroke-linecap="round"/>';
 return s+'</g>'}

function palmT(T,p,r,tot){
 const lc=mx('#B4DD6E',T.lc,cp((p-.1)/.6)),dk=lt(lc,-.25),
  bark=mx('#C9B48A',T.tc,ss(.2,.6,p)),bdk=lt(bark,-.3);
 let h='';

 /* 1) 씨앗 (0~9%) : 땅속에서 발아해 첫 잎이 땅 위로 올라옴 */
 if(p<.1){
  const u=cp(p/.1),Ht=16*ss(.5,1,u);
  h+=under(p);
  if(Ht>.5)h+='<path d="M100 171V'+f1(171-Ht)+'" stroke="#BFE08A" stroke-width="'+f1(1.8+.8*ss(.5,1,u))+'" stroke-linecap="round" fill="none"/>';
  return h}

 /* 2) 싹 이후 */
 h+=under(p);
 const Ht=p<.28?0:95*spurt(21,(p-.28)/.72),xt=TXY(Ht),yt=171-Ht;

 /* 밑동의 새순 (어린 잎 몇 장) */
 SUCK.forEach((S,si)=>{
  const g=cp((p-S.p0)/(.98-S.p0));
  if(g<.04)return;
  S.a.forEach((a,k)=>{
   const gk=spurt(40+si*5+k,g),Lk=S.L[k]*gk;
   if(Lk>4)h+=frond({bx:S.x+(k-1)*1.5,by:169,th0:a,cv:(a<0?-1:1)*(18+10*k),L:S.L[k],ll:6,sd:50+si*5+k},Lk,Math.min(gk,.6)+.1*g,mx('#A8D25C',lc,.5),dk)})});

 /* 몸통 */
 h+=trunk(Ht,bark,bdk);

 /* 큰 잎: 바깥쪽부터(뒤) 가운데(앞) 순서로 */
 const order=FR.map((f,i)=>i).sort((a,b)=>Math.abs(AN[b])-Math.abs(AN[a]));
 order.forEach(i=>{
  const F=FR[i],g=cp((p-F.p0)/(F.p1-F.p0));
  if(p<F.p0&&i>0)return;
  const sp=spurt(F.sd,g),len=i===0?16+(F.L-16)*sp:F.L*Math.pow(sp,.9);
  if(len<3)return;
  const f=Object.assign({},F,{bx:xt+(i?(AN[i]<0?-1:1)*Math.min(1.6,Math.abs(AN[i])/40):0),by:yt-(i?1:0)+F.drop*ss(.4,1,Ht/95)});
  const col=mx('#A8D25C',lc,ss(0,.7,g))
  h+=frond(f,len,Math.max(g,i===0?ss(.1,.6,p):0),i%2?col:lt(col,-.1),dk)});

 /* 열매 송이: 잎 아래에 늘어져 달리고, 송이마다 때를 달리해 익음 */
 BU.forEach(B=>{h+=bunch(B,xt+B.side*B.ox,yt+B.oy,p)});

 return h}

palmT.ns=1;
window.TREEFX['종려나무']=palmT;
window.TREEFX['대추야자나무']=palmT;
})();
