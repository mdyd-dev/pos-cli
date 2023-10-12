import{s as Le,f as d,l as z,a as I,g as v,h as O,m as G,r as Y,d as C,c as S,J as $,j as u,B as Ne,i as me,u as r,K as de,x as U,L as Pe,n as pe,M as De,y as Fe,v as we,o as Me,A as qe,D as Be,E as Ue,F as He,G as Re,P as Ve,p as $e}from"../chunks/scheduler.e2aa1391.js";import{S as ze,i as Ge,b as ye,d as Oe,m as Ae,a as w,t as H,c as ve,e as Ie,f as be,g as ge}from"../chunks/index.12b5c620.js";import{e as ke}from"../chunks/each.c0161bb5.js";import{q as Je}from"../chunks/index.50c00146.js";import{p as Ke}from"../chunks/stores.e84b517d.js";import{u as Qe}from"../chunks/user.1d284359.js";import{I as Se}from"../chunks/Icon.a5fa4953.js";function Ee(l,e,t){const a=l.slice();return a[17]=e[t],a}function je(l){let e,t,a="Clear filters",s,p,o,f,N,i;return p=new Se({props:{icon:"x",size:"14"}}),{c(){e=d("button"),t=d("span"),t.textContent=a,s=I(),ye(p.$$.fragment),this.h()},l(m){e=v(m,"BUTTON",{type:!0,class:!0});var E=O(e);t=v(E,"SPAN",{class:!0,"data-svelte-h":!0}),Y(t)!=="svelte-ki22n5"&&(t.textContent=a),s=S(E),Oe(p.$$.fragment,E),E.forEach(C),this.h()},h(){u(t,"class","label svelte-19k8sjb"),u(e,"type","button"),u(e,"class","clear svelte-19k8sjb")},m(m,E){me(m,e,E),r(e,t),r(e,s),Ae(p,e,null),f=!0,N||(i=U(e,"click",l[13]),N=!0)},p:qe,i(m){f||(w(p.$$.fragment,m),m&&Ne(()=>{f&&(o||(o=be(e,l[7],{},!0)),o.run(1))}),f=!0)},o(m){H(p.$$.fragment,m),m&&(o||(o=be(e,l[7],{},!1)),o.run(0)),f=!1},d(m){m&&C(e),Ie(p),m&&o&&o.end(),N=!1,i()}}}function Te(l){let e,t,a=l[17].id+"",s,p,o,f,N=l[17].email+"",i,m,E;return{c(){e=d("tr"),t=d("td"),s=z(a),p=I(),o=d("td"),f=d("a"),i=z(N),E=I(),this.h()},l(h){e=v(h,"TR",{});var c=O(e);t=v(c,"TD",{class:!0});var M=O(t);s=G(M,a),M.forEach(C),p=S(c),o=v(c,"TD",{class:!0});var q=O(o);f=v(q,"A",{href:!0});var y=O(f);i=G(y,N),y.forEach(C),q.forEach(C),E=S(c),c.forEach(C),this.h()},h(){u(t,"class","svelte-19k8sjb"),u(f,"href",m="/users/"+l[17].id),u(o,"class","svelte-19k8sjb")},m(h,c){me(h,e,c),r(e,t),r(t,s),r(e,p),r(e,o),r(o,f),r(f,i),r(e,E)},p(h,c){c&2&&a!==(a=h[17].id+"")&&pe(s,a),c&2&&N!==(N=h[17].email+"")&&pe(i,N),c&2&&m!==(m="/users/"+h[17].id)&&u(f,"href",m)},d(h){h&&C(e)}}}function Ce(l){let e;const t=l[9].default,a=Be(t,l,l[8],null);return{c(){a&&a.c()},l(s){a&&a.l(s)},m(s,p){a&&a.m(s,p),e=!0},p(s,p){a&&a.p&&(!e||p&256)&&Ue(a,t,s,s[8],e?Re(t,s[8],p,null):He(s[8]),null)},i(s){e||(w(a,s),e=!0)},o(s){H(a,s),e=!1},d(s){a&&a.d(s)}}}function We(l){let e,t,a,s,p,o,f,N="email",i,m="id",E,h,c,M,q,y,L,Z="Apply filter",J,k,K,A,D,ae='<tr><th class="svelte-19k8sjb">id</th> <th class="svelte-19k8sjb">email</th></tr>',ne,re,F,oe,P,x,ie,Q=(l[3]||"")+"",ee,ue,R,fe,he,b=l[2].value&&je(l);k=new Se({props:{icon:"arrowRight"}});let V=ke(l[1]),T=[];for(let n=0;n<V.length;n+=1)T[n]=Te(Ee(l,V,n));let g=l[4].params.id&&Ce(l);return{c(){e=d("div"),t=d("section"),a=d("nav"),s=d("form"),p=z(`Filter by\r
        `),o=d("select"),f=d("option"),f.textContent=N,i=d("option"),i.textContent=m,E=I(),h=d("fieldset"),c=d("input"),M=I(),b&&b.c(),q=I(),y=d("button"),L=d("span"),L.textContent=Z,J=I(),ye(k.$$.fragment),K=I(),A=d("table"),D=d("thead"),D.innerHTML=ae,ne=I();for(let n=0;n<T.length;n+=1)T[n].c();re=I(),F=d("nav"),oe=z(`Page:\r
      `),P=d("input"),ie=z(`\r
      of `),ee=z(Q),ue=I(),g&&g.c(),this.h()},l(n){e=v(n,"DIV",{class:!0});var j=O(e);t=v(j,"SECTION",{class:!0});var _=O(t);a=v(_,"NAV",{class:!0});var W=O(a);s=v(W,"FORM",{id:!0,class:!0});var B=O(s);p=G(B,`Filter by\r
        `),o=v(B,"SELECT",{name:!0});var ce=O(o);f=v(ce,"OPTION",{"data-svelte-h":!0}),Y(f)!=="svelte-51kto6"&&(f.textContent=N),i=v(ce,"OPTION",{"data-svelte-h":!0}),Y(i)!=="svelte-ns3pfu"&&(i.textContent=m),ce.forEach(C),E=S(B),h=v(B,"FIELDSET",{class:!0});var te=O(h);c=v(te,"INPUT",{type:!0,name:!0,class:!0}),M=S(te),b&&b.l(te),te.forEach(C),q=S(B),y=v(B,"BUTTON",{type:!0,class:!0});var se=O(y);L=v(se,"SPAN",{class:!0,"data-svelte-h":!0}),Y(L)!=="svelte-ctu7wl"&&(L.textContent=Z),J=S(se),Oe(k.$$.fragment,se),se.forEach(C),B.forEach(C),W.forEach(C),K=S(_),A=v(_,"TABLE",{class:!0});var le=O(A);D=v(le,"THEAD",{class:!0,"data-svelte-h":!0}),Y(D)!=="svelte-128602a"&&(D.innerHTML=ae),ne=S(le);for(let _e=0;_e<T.length;_e+=1)T[_e].l(le);le.forEach(C),re=S(_),F=v(_,"NAV",{class:!0});var X=O(F);oe=G(X,`Page:\r
      `),P=v(X,"INPUT",{form:!0,type:!0,name:!0,min:!0,max:!0,step:!0}),ie=G(X,`\r
      of `),ee=G(X,Q),X.forEach(C),_.forEach(C),ue=S(j),g&&g.l(j),j.forEach(C),this.h()},h(){f.__value="email",$(f,f.__value),i.__value="id",$(i,i.__value),u(o,"name","attribute"),l[2].attribute===void 0&&Ne(()=>l[10].call(o)),u(c,"type","text"),u(c,"name","value"),u(c,"class","svelte-19k8sjb"),u(h,"class","svelte-19k8sjb"),u(L,"class","label svelte-19k8sjb"),u(y,"type","submit"),u(y,"class","button submit"),u(s,"id","filters"),u(s,"class","svelte-19k8sjb"),u(a,"class","filters svelte-19k8sjb"),u(D,"class","svelte-19k8sjb"),u(A,"class","svelte-19k8sjb"),u(P,"form","filters"),u(P,"type","number"),u(P,"name","page"),u(P,"min","1"),u(P,"max",x=l[3]||100),u(P,"step","1"),u(F,"class","pagination svelte-19k8sjb"),u(t,"class","svelte-19k8sjb"),u(e,"class","container svelte-19k8sjb")},m(n,j){me(n,e,j),r(e,t),r(t,a),r(a,s),r(s,p),r(s,o),r(o,f),r(o,i),de(o,l[2].attribute,!0),r(s,E),r(s,h),r(h,c),$(c,l[2].value),r(h,M),b&&b.m(h,null),r(s,q),r(s,y),r(y,L),r(y,J),Ae(k,y,null),l[14](s),r(t,K),r(t,A),r(A,D),r(A,ne);for(let _=0;_<T.length;_+=1)T[_]&&T[_].m(A,null);r(t,re),r(t,F),r(F,oe),r(F,P),$(P,l[2].page),r(F,ie),r(F,ee),r(e,ue),g&&g.m(e,null),R=!0,fe||(he=[U(o,"change",l[10]),U(o,"change",l[11]),U(c,"input",l[12]),U(s,"submit",l[15]),U(P,"input",l[16]),U(P,"input",l[6])],fe=!0)},p(n,[j]){if(j&4&&de(o,n[2].attribute),j&4&&c.value!==n[2].value&&$(c,n[2].value),n[2].value?b?(b.p(n,j),j&4&&w(b,1)):(b=je(n),b.c(),w(b,1),b.m(h,null)):b&&(ge(),H(b,1,1,()=>{b=null}),ve()),j&2){V=ke(n[1]);let _;for(_=0;_<V.length;_+=1){const W=Ee(n,V,_);T[_]?T[_].p(W,j):(T[_]=Te(W),T[_].c(),T[_].m(A,null))}for(;_<T.length;_+=1)T[_].d(1);T.length=V.length}(!R||j&8&&x!==(x=n[3]||100))&&u(P,"max",x),j&4&&Pe(P.value)!==n[2].page&&$(P,n[2].page),(!R||j&8)&&Q!==(Q=(n[3]||"")+"")&&pe(ee,Q),n[4].params.id?g?(g.p(n,j),j&16&&w(g,1)):(g=Ce(n),g.c(),w(g,1),g.m(e,null)):g&&(ge(),H(g,1,1,()=>{g=null}),ve())},i(n){R||(w(b),w(k.$$.fragment,n),w(g),R=!0)},o(n){H(b),H(k.$$.fragment,n),H(g),R=!1},d(n){n&&C(e),b&&b.d(),Ie(k),l[14](null),De(T,n),g&&g.d(),fe=!1,Fe(he)}}}function Xe(l,e,t){let a;we(l,Ke,k=>t(4,a=k));let{$$slots:s={},$$scope:p}=e,o,f=[],N={page:1,attribute:"email",value:""},i={...N,...Object.fromEntries(a.url.searchParams)},m=1;const E=async()=>{await Qe.get(i).then(k=>{t(1,f=k.results),t(3,m=k.total_pages)})};Me(()=>{E()});const h=function(k,{delay:K=0,duration:A=150}){return{delay:K,duration:A,css:D=>`scale: ${Je(D)};`}};function c(){i.attribute=Ve(this),t(2,i)}const M=()=>t(2,i.value="",i);function q(){i.value=this.value,t(2,i)}const y=()=>{t(2,i={...N}),o.requestSubmit()};function L(k){$e[k?"unshift":"push"](()=>{o=k,t(0,o)})}const Z=()=>{t(2,i.page=1,i),E()};function J(){i.page=Pe(this.value),t(2,i)}return l.$$set=k=>{"$$scope"in k&&t(8,p=k.$$scope)},[o,f,i,m,a,N,E,h,p,s,c,M,q,y,L,Z,J]}class at extends ze{constructor(e){super(),Ge(this,e,Xe,We,Le,{})}}export{at as component};
