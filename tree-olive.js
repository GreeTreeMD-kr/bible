/* 감람나무(올리브나무) 그림 - index.html의 나무 키우기에서 불러다 씀
   등록 이름: '감람나무' 와 '올리브나무' 둘 다 (index.html의 TREES 이름 중 어느 쪽이든 동작)
   이 파일은 혼자서 동작하도록 필요한 도구를 모두 안에 가지고 있음
   90% 이후: 같은 뿌리에서 곁줄기가 올라와 굵어지고 가지, 잎, 꽃까지 자람 (신약 1개, 구약 2개, 전체 3개) */
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
const LF='M0 0C3-2.1 10.5-2.5 15.5 0C10.5 2.5 3 2.1 0 0Z',      /* 가늘고 긴 올리브 잎 */
 OV='M0 0C2-3 8-3.6 10.5 0C8 3.6 2 3 0 0Z',                      /* 떡잎 */
 PIT='M-5 0C-3-2.8 3-2.8 5.4 0C3 2.8-3 2.8-5 0Z';                /* 올리브 씨 */
let curLid='';
const LV='ABCN',
 leafU=(x,y,a,k,v)=>'<use xlink:href="#olvLf'+curLid+LV[v]+'" transform="translate('+f1(x)+' '+f1(y)+') rotate('+Math.round(a)+') scale('+f1(k)+')"/>',
 LFD=cols=>cols.map((c,i)=>'<g id="olvLf'+curLid+LV[i]+'"><path d="'+LF+'" fill="'+c+'"/><path d="M1 0H14" stroke="'+lt(c,.4)+'" stroke-width=".45" opacity=".55" fill="none"/></g>').join('');
/* 꽃 한 송이 (흰 꽃잎 네 장, 가운데 노란 꽃밥) - defs에 한 번만 정의해 두고 가져다 씀 */
const PET='<path d="M0 0C-1.5-1-1.9-3.7 0-4.2C1.9-3.7 1.5-1 0 0Z" fill="#FFFEF8" stroke="#E2DEC2" stroke-width=".3"/>',
 FLO='<g id="olvFlo">'+[0,90,180,270].map(a=>'<g transform="rotate('+a+')">'+PET+'</g>').join('')
  +'<circle r="1.05" fill="#E9D86A"/><circle cx="-1" cy=".3" r=".55" fill="#F2C94C"/><circle cx="1" cy="-.3" r=".55" fill="#F2C94C"/></g>',
 FOFF=[[0,0],[-2.7,-1.5],[2.5,-2.3]],          /* 꽃송이 안 꽃들의 자리 */
 FRU=[[0,3.9],[-2.5,2.9],[2.6,3.3],[.4,6.1]];           /* 열매 송이 안 열매들의 자리 */
/* 열매 색: 녹색 -> 연두 -> 갈자색 -> 자주 -> 검정 */
const DCOL=[[0,'#8FB04F'],[.28,'#B7CB5C'],[.48,'#B9894E'],[.66,'#85446E'],[.84,'#4F2D5C'],[1,'#2D1D3A']];
const dcolor=v=>{v=cp(v);for(let i=1;i<DCOL.length;i++){if(v<=DCOL[i][0]){const a=DCOL[i-1],b=DCOL[i];return mx(a[1],b[1],(v-a[0])/(b[0]-a[0]))}}return DCOL[DCOL.length-1][1]};

/* ---- 나무 뼈대: 줄기와 가지의 완성된 모양을 미리 계산 (불러올 때 한 번) ---- */
const N=14,BR=[];
function build(o,arr=BR){
 const b=Object.assign({xs:[],ys:[],th:[]},o);
 let x=b.x0,y=b.y0;
 for(let k=0;k<=N;k++){
  const t=k/N,a=b.th0*(1-.6*t)+b.wig*Math.sin(t*8.2+b.ph)+(b.dr||0)*(b.th0>=0?1:-1)*t*t;
  b.th[k]=a;b.xs[k]=x;b.ys[k]=y;
  const r=a*Math.PI/180,dl=b.len/N;x+=Math.sin(r)*dl;y-=Math.cos(r)*dl}
 arr.push(b);return b}
const at=(b,f)=>{const q=cp(f)*N,k=Math.min(N-1,Math.floor(q)),u=q-k;
 return {x:b.xs[k]+(b.xs[k+1]-b.xs[k])*u,y:b.ys[k]+(b.ys[k+1]-b.ys[k])*u,th:b.th[k]+(b.th[k+1]-b.th[k])*u}};
let sdn=10;
/* 굵고 구불구불한 짧은 줄기 */
const TR=build({kind:0,x0:100,y0:171,th0:0,wig:7,ph:.4,len:62,p0:.1,p1:.72,sd:11,wb:18,wt:8.5,par:-1,f:0});
BR.length=0;BR.push(TR);
function child(par,f,side,rel,lenf,kind,p0,p1,wb,wt,arr=BR){
 const P=arr[par],pt=at(P,f),th0=Math.max(-100,Math.min(100,pt.th+side*rel)),
  b=build({kind:kind,x0:pt.x,y0:pt.y,th0:th0,wig:rr(-6,6,++sdn),ph:rr(0,6,++sdn),len:P.len*lenf,p0:p0,p1:Math.min(arr===BR?.93:1,p1),sd:++sdn,wb:wb,wt:wt,par:par,f:f,dr:kind===1?4:kind===2?16:18},arr);
 return arr.length-1}
/* 큰 가지 8개: 둥글고 넓게 퍼지는 수관 */
[[.44,-1,58,1.1],[.48,1,56,1.1],[.58,-1,44,1.15],[.64,1,42,1.15],[.76,-1,28,1.3],[.82,1,26,1.3],[1,-1,10,1.3],[1,1,8,1.25]].forEach((a,i)=>{
 child(0,a[0],a[1],a[2],a[3],1,.2+.035*i+R(700+i)*.06,.62+.2*R(720+i)+.02*i,5.5,.9)});
/* 작은 가지: 큰 가지마다 둘씩, 잔가지: 작은 가지마다 하나씩 */
for(let i=1;i<=8;i++){
 const P=BR[i];
 [[.4,.55],[.74,.45]].forEach((a,j)=>{
  const s=child(i,a[0],(i+j)%2?1:-1,36+R(740+i*3+j)*14,a[1],2,P.p0+.1+R(760+i*3+j)*.1,P.p1+.04,2.4,.6);
  child(s,.7,(i+j)%2?-1:1,38,.5,3,BR[s].p0+.08+R(780+i*3+j)*.08,BR[s].p1+.03,1.3,.5)})}
const ORDER=BR.map((b,i)=>i).sort((a,b)=>BR[b].kind-BR[a].kind);   /* 잔가지부터 그려 줄기가 위로 오게 */

/* 꽃·열매 자리: 작은 가지와 잔가지에. 꽃이 지면 열매가 맺혀 익고, 몇 알은 땅에 떨어짐 */
const SPOTS=[];
BR.forEach((b,i)=>{
 if(b.kind<1)return;
 (b.kind===1?[.9]:b.kind===2?[.45,.72,.92]:[.4,.7,.95]).forEach((s,j)=>{const e=i*10+j;SPOTS.push({b:i,s:s+(R(900+e)-.5)*.08,side:R(910+e)<.5?-1:1,e:e,
  tb:.36+.3*R(920+e),sc:.9+.4*R(930+e),rot:Math.round((R(940+e)-.5)*50),n:3+(R(975+e)<.4?1:0),fin:.55+.45*R(935+e),hasF:R(970+e)<.9})})});
SPOTS.forEach(sp=>{sp.tf=sp.tb+.09+.07*R(950+sp.e);sp.ts=Math.min(.93,sp.tf+.2+.12*R(960+sp.e))});
const DR=SPOTS.map((sp,i)=>i).filter(i=>SPOTS[i].hasF).sort((a,b)=>SPOTS[a].ts-SPOTS[b].ts).slice(0,4),
 GX=[[76,173.4,.95],[125,174,.72],[69,174.6,.5],[131,173.2,.88]];
DR.forEach((si,j)=>{const sp=SPOTS[si];sp.drop=j;sp.fin=1;sp.td=Math.min(.97,sp.ts+.03+.05*R(970+j))});

let uid=0;
function bProg(b,p){return cp((p-b.p0)/(b.p1-b.p0))}
/* 가지의 자란 정도(0~1): 부모가 아직 거기까지 안 자랐으면 못 나옴. 줄기는 씨앗 단계의 싹(16)에서 이어서 자람 */
function growth(i,p,memo){
 if(memo[i]!==undefined)return memo[i];
 const b=BR[i];let g;
 if(i===0)g=(16+(b.len-16)*spurt(b.sd,bProg(b,p)))/b.len;
 else{g=spurt(b.sd,bProg(b,p));if(b.par>=0)g*=ss(b.f,b.f+.12,growth(b.par,p,memo))}
 return memo[i]=g}
/* 줄기·가지의 폭 */
function bw(b,p,t){
 if(b.kind===0){
  const q=Math.pow(cp((p-.1)/.88),1.15),tw=2.4+(b.wt-2.4)*q,bd=2.4+(b.wb-2.4)*q,fl=4*q*Math.pow(Math.max(0,1-t*8),2);
  return Math.max(.8,(tw+(bd-tw)*Math.pow(Math.max(0,1-t),1.5)+fl)*(1+.1*q*Math.sin(t*14+b.ph*3)))}
 const gp=cp((p-b.p0)/(1-b.p0)),tw=b.wt*.75,bd=b.wt+(b.wb-b.wt)*(.35+.65*gp);
 return Math.max(.45,tw+(bd-tw)*Math.pow(Math.max(0,1-t),1.3))}
function poly(b,g,p,col,wf=bw){
 if(g<=.01)return '';
 const L=[],Q=[],n=Math.max(3,Math.ceil(g*(b.kind===0?26:N)));
 for(let k=0;k<=n;k++){
  const t=Math.min(g,g*k/n),pt=at(b,t),a=pt.th*Math.PI/180,w=wf(b,p,t)/2;
  L.push(f1(pt.x-Math.cos(a)*w)+' '+f1(pt.y-Math.sin(a)*w));Q.push(f1(pt.x+Math.cos(a)*w)+' '+f1(pt.y+Math.sin(a)*w))}
 return '<path d="M'+L.join('L')+'L'+Q.reverse().join('L')+'Z" fill="'+col+'"/>'}

/* 땅속 단면: 흙 속에서 올리브 씨(연한 베이지)가 갈라지며 뿌리가 내려가고 싹이 올라옴 */
function under(p){
 const o=1-ss(.24,.34,p);if(o<=.02)return '';
 const u=cp(p/.1),sd=1-ss(.14,.26,p),lat=ss(.1,.2,p),sw=ss(0,.4,u),id='olvS'+(++uid);
 let s='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#A47A52" stop-opacity=".92"/><stop offset=".6" stop-color="#A47A52" stop-opacity=".6"/><stop offset="1" stop-color="#A47A52" stop-opacity="0"/></radialGradient></defs>'
  +'<g opacity="'+f1(o)+'"><ellipse cx="100" cy="180" rx="30" ry="8.2" fill="url(#'+id+')"/>';
 if(sd>.02){const k=(.6+.4*sd)*(1+.08*sw);
  s+='<g opacity="'+f1(sd)+'" transform="translate(98 181) scale('+f1(k)+')"><path d="'+PIT+'" fill="#D9C89E" stroke="#9A8559" stroke-width=".45"/>'
   +'<path d="M-3.6 -.5C-1-1.3 1.6-1.3 4 -.3M-3.4 .8C-1 1.5 1.6 1.5 3.8 .6" stroke="#B3A073" stroke-width=".35" fill="none"/>';
  if(u>.3)s+='<path d="M-4.2 .1C-1 .9 2 .9 4.8 .1" stroke="#6B5A38" stroke-width=".5" fill="none" opacity="'+f1(ss(.3,.6,u))+'"/>';
  s+='</g>'}
 const Lr=7*ss(.12,.7,u);
 if(Lr>.2)s+='<path d="M103 181C105.2 181 106 '+f1(181+Lr*.3)+' 104.6 '+f1(181+Lr*.85)+'" stroke="#F6F0DA" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
 const hr=ss(.55,.9,u);
 if(hr>.05)s+='<path d="M104.8 184.6L103.2 185.2M105 186L106.7 186.6" stroke="#F6F0DA" stroke-width=".5" opacity="'+f1(hr)+'"/>';
 if(lat>.05)s+='<path d="M104.8 186.4L'+f1(104.8-5*lat)+' '+f1(186.4+1.6*lat)+'M105 187L'+f1(105+5.4*lat)+' '+f1(187+1.6*lat)+'" stroke="#F6F0DA" stroke-width=".8" stroke-linecap="round" fill="none"/>';
 const sh=5.6*ss(.3,.62,u);
 if(sh>.1)s+='<path d="M99.4 179.6V'+f1(179.6-sh)+'" stroke="#D6EDA8" stroke-width="1.5" stroke-linecap="round"/>';
 return s+'</g>'}

/* ---- 90% 이후: 같은 뿌리에서 곁줄기가 올라와 굵은 줄기가 되고, 가지, 잎, 꽃까지 자람 ----
   (목표가 신약이면 곁줄기 1개, 구약이면 2개, 신구약 전체면 3개) */
const ES=[],
 XT=[{x0:93,th0:-27,len:60,wb:7.5,p0:.9,sd:71,ph:.9,nb:4},{x0:107,th0:29,len:48,wb:6.5,p0:.915,sd:72,ph:2.2,nb:3},{x0:90,th0:-46,len:36,wb:5.5,p0:.935,sd:73,ph:3.4,nb:2}];
XT.forEach((t,ti)=>{
 build({kind:0,x0:t.x0,y0:172,th0:t.th0,wig:4,ph:t.ph,len:t.len,p0:t.p0,p1:1,sd:t.sd,wb:t.wb,wt:2,par:-1,f:0,dr:0},ES);
 const t0=ES.length-1;t.idx=[t0];
 for(let j=0;j<t.nb;j++){
  const side=(j+ti)%2?1:-1,k1=child(t0,[.34,.48,.62,.76,.9][j],side,48-6*j,.62-.06*j,1,t.p0+.03+.012*j+R(1000+ti*9+j)*.02,1,3,.8,ES);
  t.idx.push(k1);
  }});
function growth2(i,p,memo){
 if(memo[i]!==undefined)return memo[i];
 const b=ES[i];let g=spurt(b.sd,bProg(b,p));
 if(b.par<0)g=.1+.9*g;else g*=ss(b.f,b.f+.12,growth2(b.par,p,memo));
 return memo[i]=g}
function bw2(b,p,t){
 const q=cp((p-b.p0)/(1-b.p0));
 if(b.kind===0){const tw=1+1.2*q,bd=1.4+(b.wb-1.4)*Math.pow(q,.9),fl=3*q*Math.pow(Math.max(0,1-t*7),2);
  return Math.max(.7,tw+(bd-tw)*Math.pow(Math.max(0,1-t),1.4)+fl)}
 const tw=b.wt*.75,bd=b.wt+(b.wb-b.wt)*(.35+.65*q);
 return Math.max(.4,tw+(bd-tw)*Math.pow(Math.max(0,1-t),1.3))}
function extras(p,tot,bark,twig){
 const n=tot>=1189?3:tot>=900?2:1,memo={},G2=ES.map((b,i)=>growth2(i,p,memo));
 let w='',lv='',fl='';
 [2,0,1].filter(ti=>ti<n).forEach(ti=>{
  const t=XT[ti];if(p<=t.p0)return;
  /* 줄기와 가지 (잔가지부터) */
  t.idx.slice().sort((a,b)=>ES[b].kind-ES[a].kind).forEach(i=>{const k=ES[i].kind;w+=poly(ES[i],G2[i],p,k===0?bark:k===1?mx(bark,twig,.3):twig,bw2)});
  t.idx.forEach(i=>{
   const b=ES[i],g=G2[i];if(g<.1)return;
   const nk=b.kind===0?5:b.kind===1?4:3,base=b.kind===0?.62:b.kind===1?.7:.66;
   for(let k=0;k<nk;k++){
    const s=(b.kind===0?.3+k*.14:.16+k*(.72/nk))+(R(i*40+k+3000)-.5)*.05,gl=ss(s+rr(0,.06,i*40+k+3020),s+.3,g);
    if(gl<.05)continue;
    const pt=at(b,s);
    for(let sd=-1;sd<=1;sd+=2){
     const a=pt.th+sd*(48+R(i*40+k+sd+3099)*24)-90+Math.round((R(i*40+k+sd+3060)-.5)*18),sz=gl*base*(.8+R(i*40+k+sd+3070)*.4),
      v=g<.8?3:[0,1,1,2,2,0][Math.floor(R(i*40+k+sd+3080)*6)];
     lv+=leafU(pt.x,pt.y,a,sz,v)}}
   const tp=at(b,g),tg=ss(.4,.85,g);
   if(tg>.05)[-44,-14,14,44].forEach((dq,q)=>{lv+=leafU(tp.x,tp.y,tp.th-90+dq,tg*base*(.9+R(i*40+q+3040)*.3),g<.85?3:[1,2,0,1][q])});
   /* 꽃봉오리 -> 꽃 (줄기와 가지 끝) */
   const qb=cp((p-b.p0)/(1-b.p0)),oj=cp((qb-.62)/.3),bd=ss(.5,.62,qb)*(1-ss(0,.25,oj));
   if(g>.55&&(bd>.05||oj>.02))FOFF.forEach(([dx,dy],j)=>{
    const px=tp.x+dx*.8,py=tp.y+dy*.8-1;
    if(bd>.05&&oj<.9)fl+=ci(px,py,.9*bd,'#E9E8A8','#C9C680');
    if(oj>.02)fl+='<use xlink:href="#olvFlo" transform="translate('+f1(px)+' '+f1(py)+') rotate('+Math.round(R(i*40+j+3200)*90)+') scale('+f1((.24+.26*oj)*(.9+R(i*40+j+3240)*.2))+')"/>'})})});
 return w+lv+fl}

function oliveT(T,p,r,tot){
 p=cp(p);
 const lc=mx('#CDEB9A',T.lc,cp((p-.08)/.7)),dk=lt(lc,-.28),sil=mx(lc,'#DCE4D2',.5),nw=mx('#C4E78E','#9BCB6A',.4),
  bark=mx(mx('#A9C47E',T.tc,ss(.12,.55,p)),'#6F6254',.45*ss(.55,1,p)),
  twig=mx(bark,'#8FA070',.35);
 let h='';

 /* 1) 씨앗 (0~9%): 땅속에서 발아해 싹이 땅 위로 올라오고 떡잎이 열림 */
 if(p<.1){
  const u=cp(p/.1),Ht=16*ss(.5,1,u),k=ss(.75,1,u);
  h+=under(p);
  if(Ht>.5)h+='<path d="M100 171V'+f1(171-Ht)+'" stroke="#CFE9A0" stroke-width="'+f1(1.6+.8*ss(.5,1,u))+'" stroke-linecap="round" fill="none"/>';
  if(k>.02){const y0=171-Ht;h+=gt(100,y0,-160+10*(1-k),.8*k,'<path d="'+OV+'" fill="#B4E07A"/>')+gt(100,y0,-20-10*(1-k),.8*k,'<path d="'+OV+'" fill="#A5D86B"/>')}
  return h}

 /* 2) 싹 이후 */
 curLid=String(++uid);
 h+=under(p)+'<defs>'+FLO+LFD([dk,lc,sil,nw])+'</defs>';
 const memo={},G=BR.map((b,i)=>growth(i,p,memo));
 let lv='',fl='',tl='';

 /* 가지와 줄기 (잔가지부터) */
 ORDER.forEach(i=>{const k=BR[i].kind;h+=poly(BR[i],G[i],p,k===0?bark:k===1?mx(bark,twig,.2):twig)});
 /* 줄기 껍질의 구불구불한 무늬와 옹이 구멍 */
 if(p>.45&&G[0]>.3){
  const ga=.5*ss(.45,.7,p),gm=Math.min(G[0],.9);
  for(let k=0;k<4;k++){
   let d='';
   for(let t=.03;t<=gm;t+=.04){
    const pt=at(TR,t),a=pt.th*Math.PI/180,w=bw(TR,p,t),off=(k-1.5)*w*.24+Math.sin(t*11+k*2.1)*w*.12;
    d+=(d?'L':'M')+f1(pt.x+Math.cos(a)*off)+' '+f1(pt.y+Math.sin(a)*off)}
   if(d)h+='<path d="'+d+'" stroke="'+lt(bark,-.35)+'" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="'+f1(ga)+'"/>'}
  const hk=ss(.8,.97,p);
  if(hk>.03&&G[0]>.3){const pt=at(TR,.2);
   h+='<ellipse cx="'+f1(pt.x+1.2)+'" cy="'+f1(pt.y)+'" rx="'+f1(2.2*hk)+'" ry="'+f1(3.1*hk)+'" fill="#3B2B1F" stroke="'+lt(bark,-.2)+'" stroke-width=".7"/>'
    +'<ellipse cx="'+f1(pt.x+1.5)+'" cy="'+f1(pt.y+.8)+'" rx="'+f1(1*hk)+'" ry="'+f1(1.5*hk)+'" fill="#1E140D" opacity=".7"/>'}}

 /* 어린 줄기의 마주나는 잎(자라면서 떨어짐) */
 const jl=1-ss(.4,.65,p),Lt=G[0]*TR.len;
 if(jl>.02){
  for(let k=0;k<10;k++){
   const d=22+k*7;if(d>Lt-3)break;
   const pt=at(TR,d/TR.len),gl=ss(d,d+12,Lt);
   for(let sd=-1;sd<=1;sd+=2)tl+=leafU(pt.x,pt.y,pt.th+sd*(52+R(840+k+sd)*18)-90,.62*gl*(.85+R(860+k+sd)*.3),d>Lt*.6?3:(k%2?1:0))}
  const co=1-ss(.18,.3,p);
  if(co>.02&&Lt>16)tl+='<g opacity="'+f1(co)+'">'+gt(TR.xs[0],171-16,-160,.8,'<path d="'+OV+'" fill="#B4E07A"/>')+gt(TR.xs[0],171-16,-20,.8,'<path d="'+OV+'" fill="#A5D86B"/>')+'</g>';
  h+='<g opacity="'+f1(jl)+'">'+tl+'</g>'}

 /* 잎: 가지를 따라 마주나기, 끝에는 여러 장 모여 남 */
 BR.forEach((b,i)=>{
  if(b.kind===0)return;
  const g=G[i];if(g<.08)return;
  const nk=b.kind===1?5:b.kind===2?6:5,base=(b.kind===1?.88:b.kind===2?.94:.86);
  for(let k=0;k<nk;k++){
   const s=.14+k*(.78/nk)+(R(i*50+k)-.5)*.05,gl=ss(s+rr(0,.06,i*50+k+20),s+.3,g);
   if(gl<.05)continue;
   const pt=at(b,s);
   for(let sd=-1;sd<=1;sd+=2){
    const a=pt.th+sd*(48+R(i*50+k+sd+99)*24)-90+Math.round((R(i*50+k+sd+60)-.5)*18),sz=gl*base*(.8+R(i*50+k+sd+70)*.4),
     v=[0,1,1,2,2,0][Math.floor(R(i*50+k+sd+80)*6)];
    lv+=leafU(pt.x,pt.y,a,sz,v)}}
  const tp=at(b,g),tg=ss(.5,.9,g),nv=g<.85?3:-1;
  if(tg>.05)(b.kind===1?[-46,-15,15,46]:[-50,-24,0,24,50]).forEach((dq,q)=>{
   lv+=leafU(tp.x,tp.y,tp.th-90+dq,tg*base*(.85+R(i*50+q+40)*.3),nv>=0?nv:[1,2,0,1,2][q%5])})});
 h+=lv;

 /* 꽃(흰색, 노란 꽃밥 - 작은 송이로 많이) -> 꽃이 지면 열매가 맺혀 녹색에서 자주·검정으로 익음 */
 SPOTS.forEach(sp=>{
  const b=BR[sp.b],g=G[sp.b],vis=ss(sp.s,sp.s+.1,g);
  if(vis<.05)return;
  const pt=at(b,sp.s),a=pt.th*Math.PI/180,x=pt.x+Math.cos(a)*sp.side*1.8,y=pt.y+Math.sin(a)*sp.side*1.8,
   bud=ss(sp.tb-.1,sp.tb-.02,p)*(1-ss(sp.tb-.02,sp.tb+.02,p)),op=ss(sp.tb,sp.tb+.03,p)*(1-ss(sp.tf-.02,sp.tf+.01,p));
  FOFF.forEach(([dx,dy],j)=>{
   const px=x+dx*sp.sc*.9,py=y+dy*sp.sc*.9;
   if(bud>.05)fl+=ci(px,py,.95*bud*vis,'#E9E8A8','#C9C680');
   if(op>.03)fl+='<use xlink:href="#olvFlo" transform="translate('+f1(px)+' '+f1(py)+') rotate('+Math.round(sp.rot*2+j*40)+') scale('+f1(sp.sc*.62*op*vis*(1-.12*j))+')"/>'});
  if(!sp.hasF)return;
  const fs=ss(sp.tf-.01,sp.tf+.1,p)*vis;
  if(fs<=.05)return;
  const k=(.4+.6*ss(sp.tf,sp.tf+.14,p))*fs*sp.sc*.85,rp=ss(sp.tf+.06,sp.ts,p)*sp.fin;
  let sk='',fe='';
  for(let j=0;j<sp.n;j++){
   if(j===0&&sp.drop!==undefined&&p>=sp.td)continue;
   const fx=x+FRU[j][0]*sp.sc*.8,fy=y+FRU[j][1]*sp.sc*.8,v=cp(rp+(R(sp.e*7+j)-.5)*.16);
   sk+='M'+f1(x)+' '+f1(y)+'L'+f1(fx)+' '+f1(fy-1.8*k);
   fe+='<ellipse cx="'+f1(fx)+'" cy="'+f1(fy)+'" rx="'+f1(1.5*k)+'" ry="'+f1(2.05*k)+'" fill="'+dcolor(v)+'" transform="rotate('+(sp.rot+j*20)+' '+f1(fx)+' '+f1(fy)+')"/>'}
  if(sk)fl+='<path d="'+sk+'" stroke="#8FA070" stroke-width=".5"/>'+fe});
 h+=fl;

 /* 땅에 떨어진 열매 (익은 열매가 하나씩 떨어져 쌓임) */
 DR.forEach((si,j)=>{
  const sp=SPOTS[si];if(p<sp.td)return;
  const gk=ss(sp.td,sp.td+.03,p),gx=GX[j][0],gy=GX[j][1],col=dcolor(GX[j][2]);
  h+='<ellipse cx="'+f1(gx)+'" cy="'+f1(gy)+'" rx="'+f1(1.7*gk)+'" ry="'+f1(2.3*gk)+'" fill="'+col+'" stroke="'+lt(col,-.35)+'" stroke-width=".3" transform="rotate('+(j*37+25)+' '+f1(gx)+' '+f1(gy)+')"/>'
   +'<ellipse cx="'+f1(gx-.5)+'" cy="'+f1(gy-.8)+'" rx="'+f1(.45*gk)+'" ry="'+f1(.8*gk)+'" fill="#fff" opacity=".28"/>'});

 /* 90% 이후: 같은 뿌리에서 곁줄기가 올라와 굵은 줄기가 되고 가지, 잎, 꽃까지 자람 */
 if(p>.9)h+=extras(p,tot,bark,twig);
 return h}

oliveT.ns=1;
window.TREEFX['감람나무']=oliveT;
window.TREEFX['올리브나무']=oliveT;
})();
