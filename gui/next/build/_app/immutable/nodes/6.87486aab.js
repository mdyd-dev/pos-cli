import{S as ze,i as Me,s as $e,k as m,q as P,a as S,y as De,l as d,m as g,r as F,h as c,c as q,z as Le,n as i,L as Re,b as ge,E as t,X as Ae,Y as re,A as Ue,H as z,g as D,d as M,f as Ie,Z as Be,u as be,B as He,_ as Ke,I as Qe,F as Xe,o as Ye,K as Ze,O as Pe,Q as Ge,R as Je,T as We,U as xe,v as Se,a1 as et,w as tt}from"../chunks/index.d0f8a730.js";import{q as st}from"../chunks/index.50c00146.js";import{p as lt}from"../chunks/stores.e9fb348f.js";import{u as at}from"../chunks/user.52ee5d35.js";import{I as Ve}from"../chunks/Icon.1de0c66c.js";function Fe(a,e,s){const n=a.slice();return n[17]=e[s],n}function qe(a){let e,s,n,l,v,o,f,O,u;return v=new Ve({props:{icon:"x",size:"14"}}),{c(){e=m("button"),s=m("span"),n=P("Clear filters"),l=S(),De(v.$$.fragment),this.h()},l(b){e=d(b,"BUTTON",{type:!0,class:!0});var j=g(e);s=d(j,"SPAN",{class:!0});var _=g(s);n=F(_,"Clear filters"),_.forEach(c),l=q(j),Le(v.$$.fragment,j),j.forEach(c),this.h()},h(){i(s,"class","label svelte-19k8sjb"),i(e,"type","button"),i(e,"class","clear svelte-19k8sjb")},m(b,j){ge(b,e,j),t(e,s),t(s,n),t(e,l),Ue(v,e,null),f=!0,O||(u=z(e,"click",a[13]),O=!0)},p:Ze,i(b){f||(D(v.$$.fragment,b),Re(()=>{f&&(o||(o=Pe(e,a[7],{},!0)),o.run(1))}),f=!0)},o(b){M(v.$$.fragment,b),o||(o=Pe(e,a[7],{},!1)),o.run(0),f=!1},d(b){b&&c(e),He(v),b&&o&&o.end(),O=!1,u()}}}function we(a){let e,s,n=a[17].id+"",l,v,o,f,O=a[17].email+"",u,b,j;return{c(){e=m("tr"),s=m("td"),l=P(n),v=S(),o=m("td"),f=m("a"),u=P(O),j=S(),this.h()},l(_){e=d(_,"TR",{});var p=g(e);s=d(p,"TD",{class:!0});var L=g(s);l=F(L,n),L.forEach(c),v=q(p),o=d(p,"TD",{class:!0});var R=g(o);f=d(R,"A",{href:!0});var I=g(f);u=F(I,O),I.forEach(c),R.forEach(c),j=q(p),p.forEach(c),this.h()},h(){i(s,"class","svelte-19k8sjb"),i(f,"href",b="/users/"+a[17].id),i(o,"class","svelte-19k8sjb")},m(_,p){ge(_,e,p),t(e,s),t(s,l),t(e,v),t(e,o),t(o,f),t(f,u),t(e,j)},p(_,p){p&2&&n!==(n=_[17].id+"")&&be(l,n),p&2&&O!==(O=_[17].email+"")&&be(u,O),p&2&&b!==(b="/users/"+_[17].id)&&i(f,"href",b)},d(_){_&&c(e)}}}function Ce(a){let e;const s=a[9].default,n=Ge(s,a,a[8],null);return{c(){n&&n.c()},l(l){n&&n.l(l)},m(l,v){n&&n.m(l,v),e=!0},p(l,v){n&&n.p&&(!e||v&256)&&Je(n,s,l,l[8],e?xe(s,l[8],v,null):We(l[8]),null)},i(l){e||(D(n,l),e=!0)},o(l){M(n,l),e=!1},d(l){n&&n.d(l)}}}function nt(a){let e,s,n,l,v,o,f,O,u,b,j,_,p,L,R,I,U,Y,Z,T,G,w,B,H,$,oe,ie,K,ue,fe,ce,C,_e,A,ee,pe,J=(a[3]||"")+"",te,he,Q,me,Ee,E=a[2].value&&qe(a);T=new Ve({props:{icon:"arrowRight"}});let X=a[1],y=[];for(let r=0;r<X.length;r+=1)y[r]=we(Fe(a,X,r));let k=a[4].params.id&&Ce(a);return{c(){e=m("div"),s=m("section"),n=m("nav"),l=m("form"),v=P(`Filter by\r
        `),o=m("select"),f=m("option"),O=P("email"),u=m("option"),b=P("id"),j=S(),_=m("fieldset"),p=m("input"),L=S(),E&&E.c(),R=S(),I=m("button"),U=m("span"),Y=P("Apply filter"),Z=S(),De(T.$$.fragment),G=S(),w=m("table"),B=m("thead"),H=m("tr"),$=m("th"),oe=P("id"),ie=S(),K=m("th"),ue=P("email"),fe=S();for(let r=0;r<y.length;r+=1)y[r].c();ce=S(),C=m("nav"),_e=P(`Page:\r
      `),A=m("input"),pe=P(`\r
      of `),te=P(J),he=S(),k&&k.c(),this.h()},l(r){e=d(r,"DIV",{class:!0});var N=g(e);s=d(N,"SECTION",{class:!0});var h=g(s);n=d(h,"NAV",{class:!0});var W=g(n);l=d(W,"FORM",{id:!0,class:!0});var V=g(l);v=F(V,`Filter by\r
        `),o=d(V,"SELECT",{name:!0});var de=g(o);f=d(de,"OPTION",{});var ke=g(f);O=F(ke,"email"),ke.forEach(c),u=d(de,"OPTION",{});var Te=g(u);b=F(Te,"id"),Te.forEach(c),de.forEach(c),j=q(V),_=d(V,"FIELDSET",{class:!0});var se=g(_);p=d(se,"INPUT",{type:!0,name:!0,class:!0}),L=q(se),E&&E.l(se),se.forEach(c),R=q(V),I=d(V,"BUTTON",{type:!0,class:!0});var le=g(I);U=d(le,"SPAN",{class:!0});var je=g(U);Y=F(je,"Apply filter"),je.forEach(c),Z=q(le),Le(T.$$.fragment,le),le.forEach(c),V.forEach(c),W.forEach(c),G=q(h),w=d(h,"TABLE",{class:!0});var ae=g(w);B=d(ae,"THEAD",{class:!0});var Ne=g(B);H=d(Ne,"TR",{});var ne=g(H);$=d(ne,"TH",{class:!0});var Oe=g($);oe=F(Oe,"id"),Oe.forEach(c),ie=q(ne),K=d(ne,"TH",{class:!0});var ye=g(K);ue=F(ye,"email"),ye.forEach(c),ne.forEach(c),Ne.forEach(c),fe=q(ae);for(let ve=0;ve<y.length;ve+=1)y[ve].l(ae);ae.forEach(c),ce=q(h),C=d(h,"NAV",{class:!0});var x=g(C);_e=F(x,`Page:\r
      `),A=d(x,"INPUT",{form:!0,type:!0,name:!0,min:!0,max:!0,step:!0}),pe=F(x,`\r
      of `),te=F(x,J),x.forEach(c),h.forEach(c),he=q(N),k&&k.l(N),N.forEach(c),this.h()},h(){f.__value="email",f.value=f.__value,u.__value="id",u.value=u.__value,i(o,"name","attribute"),a[2].attribute===void 0&&Re(()=>a[10].call(o)),i(p,"type","text"),i(p,"name","value"),i(p,"class","svelte-19k8sjb"),i(_,"class","svelte-19k8sjb"),i(U,"class","label svelte-19k8sjb"),i(I,"type","submit"),i(I,"class","button submit"),i(l,"id","filters"),i(l,"class","svelte-19k8sjb"),i(n,"class","filters svelte-19k8sjb"),i($,"class","svelte-19k8sjb"),i(K,"class","svelte-19k8sjb"),i(B,"class","svelte-19k8sjb"),i(w,"class","svelte-19k8sjb"),i(A,"form","filters"),i(A,"type","number"),i(A,"name","page"),i(A,"min","1"),i(A,"max",ee=a[3]||100),i(A,"step","1"),i(C,"class","pagination svelte-19k8sjb"),i(s,"class","svelte-19k8sjb"),i(e,"class","container svelte-19k8sjb")},m(r,N){ge(r,e,N),t(e,s),t(s,n),t(n,l),t(l,v),t(l,o),t(o,f),t(f,O),t(o,u),t(u,b),Ae(o,a[2].attribute,!0),t(l,j),t(l,_),t(_,p),re(p,a[2].value),t(_,L),E&&E.m(_,null),t(l,R),t(l,I),t(I,U),t(U,Y),t(I,Z),Ue(T,I,null),a[14](l),t(s,G),t(s,w),t(w,B),t(B,H),t(H,$),t($,oe),t(H,ie),t(H,K),t(K,ue),t(w,fe);for(let h=0;h<y.length;h+=1)y[h]&&y[h].m(w,null);t(s,ce),t(s,C),t(C,_e),t(C,A),re(A,a[2].page),t(C,pe),t(C,te),t(e,he),k&&k.m(e,null),Q=!0,me||(Ee=[z(o,"change",a[10]),z(o,"change",a[11]),z(p,"input",a[12]),z(l,"submit",a[15]),z(A,"input",a[16]),z(A,"input",a[6])],me=!0)},p(r,[N]){if(N&4&&Ae(o,r[2].attribute),N&4&&p.value!==r[2].value&&re(p,r[2].value),r[2].value?E?(E.p(r,N),N&4&&D(E,1)):(E=qe(r),E.c(),D(E,1),E.m(_,null)):E&&(Se(),M(E,1,1,()=>{E=null}),Ie()),N&2){X=r[1];let h;for(h=0;h<X.length;h+=1){const W=Fe(r,X,h);y[h]?y[h].p(W,N):(y[h]=we(W),y[h].c(),y[h].m(w,null))}for(;h<y.length;h+=1)y[h].d(1);y.length=X.length}(!Q||N&8&&ee!==(ee=r[3]||100))&&i(A,"max",ee),N&4&&Be(A.value)!==r[2].page&&re(A,r[2].page),(!Q||N&8)&&J!==(J=(r[3]||"")+"")&&be(te,J),r[4].params.id?k?(k.p(r,N),N&16&&D(k,1)):(k=Ce(r),k.c(),D(k,1),k.m(e,null)):k&&(Se(),M(k,1,1,()=>{k=null}),Ie())},i(r){Q||(D(E),D(T.$$.fragment,r),D(k),Q=!0)},o(r){M(E),M(T.$$.fragment,r),M(k),Q=!1},d(r){r&&c(e),E&&E.d(),He(T),a[14](null),Ke(y,r),k&&k.d(),me=!1,Qe(Ee)}}}function rt(a,e,s){let n;Xe(a,lt,T=>s(4,n=T));let{$$slots:l={},$$scope:v}=e,o,f=[],O={page:1,attribute:"email",value:""},u={...O,...Object.fromEntries(n.url.searchParams)},b=1;const j=async()=>{await at.get(u).then(T=>{s(1,f=T.results),s(3,b=T.total_pages)})};Ye(()=>{j()});const _=function(T,{delay:G=0,duration:w=150}){return{delay:G,duration:w,css:B=>`scale: ${st(B)};`}};function p(){u.attribute=et(this),s(2,u)}const L=()=>s(2,u.value="",u);function R(){u.value=this.value,s(2,u)}const I=()=>{s(2,u={...O}),o.requestSubmit()};function U(T){tt[T?"unshift":"push"](()=>{o=T,s(0,o)})}const Y=()=>{s(2,u.page=1,u),j()};function Z(){u.page=Be(this.value),s(2,u)}return a.$$set=T=>{"$$scope"in T&&s(8,v=T.$$scope)},[o,f,u,b,n,O,j,_,v,l,p,L,R,I,U,Y,Z]}class _t extends ze{constructor(e){super(),Me(this,e,rt,nt,$e,{})}}export{_t as component};