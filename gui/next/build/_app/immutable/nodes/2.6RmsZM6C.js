import{s as Pe,e as d,a as I,t as Y,c as f,b as E,g as L,d as Z,f as u,y as c,i as x,h as l,B as me,P as We,F as Te,E as Fe,l as et,p as tt,z as ie,A as Oe,G as at,H as qe,I as nt,j as $e,u as st,m as lt,o as rt,C as ot,r as Qe,k as He,W as it,D as Ve,K as ut}from"../chunks/scheduler.XoNWsti8.js";import{S as Ae,i as Ne,c as he,b as pe,m as ge,t as O,a as G,e as ve,f as dt,d as Xe,g as Ye}from"../chunks/index.tx27_CoG.js";import{e as ze}from"../chunks/each.njyuMQuv.js";import"../chunks/entry.FAwDom82.js";import{p as ft}from"../chunks/stores.H_D2oWDd.js";import{b as Re}from"../chunks/backgroundJob.f4-tI9MC.js";import{s as ke}from"../chunks/state.MezN31W7.js";import{I as je}from"../chunks/Icon.kG__kIFo.js";import{N as ct}from"../chunks/Number.YLNzmRn9.js";const be=e=>{const t=e instanceof Date?e:new Date(e),a=new Intl.RelativeTimeFormat("en"),n={years:3600*24*365,months:3600*24*30,weeks:3600*24*7,days:3600*24,hours:3600,minutes:60,seconds:1},s=(t.getTime()-Date.now())/1e3;for(let i in n)if(n[i]<Math.abs(s)){const _=s/n[i];return a.format(Math.round(_),i)}};function _t(e){let t,a,n,s,i,_,h,r,p;return i=new je({props:{icon:"refresh",size:"22"}}),{c(){t=d("form"),a=d("input"),n=I(),s=d("button"),he(i.$$.fragment),_=Y(`\r
    Retry`),this.h()},l(g){t=f(g,"FORM",{});var o=E(t);a=f(o,"INPUT",{type:!0,name:!0}),n=L(o),s=f(o,"BUTTON",{class:!0});var b=E(s);pe(i.$$.fragment,b),_=Z(b,`\r
    Retry`),b.forEach(u),o.forEach(u),this.h()},h(){c(a,"type","hidden"),c(a,"name","id"),a.value=e[0],c(s,"class","danger")},m(g,o){x(g,t,o),l(t,a),l(t,n),l(t,s),ge(i,s,null),l(s,_),e[3](t),h=!0,r||(p=me(t,"submit",e[2]),r=!0)},p(g,[o]){(!h||o&1)&&(a.value=g[0])},i(g){h||(O(i.$$.fragment,g),h=!0)},o(g){G(i.$$.fragment,g),h=!1},d(g){g&&u(t),ve(i),e[3](null),r=!1,p()}}}function mt(e,t,a){let{id:n}=t,s;const i=We(),_=async r=>{r.preventDefault();const p=await Re.retry({properties:new FormData(s)});p.errors?ke.notification.create("error",`Background job ${p.admin_background_job_retry.id} could not be run again`):(i("itemsChanged"),ke.notification.create("success",`Background job ${p.admin_background_job_retry.id} planned to run again`))};function h(r){Te[r?"unshift":"push"](()=>{s=r,a(1,s)})}return e.$$set=r=>{"id"in r&&a(0,n=r.id)},[n,s,_,h]}class ht extends Ae{constructor(t){super(),Ne(this,t,mt,_t,Pe,{id:0})}}function pt(e){let t,a,n,s,i,_,h,r,p,g;return _=new je({props:{icon:"x",size:"22"}}),{c(){t=d("form"),a=d("input"),n=I(),s=d("button"),i=d("i"),he(_.$$.fragment),h=Y(`\r
    Delete background job`),this.h()},l(o){t=f(o,"FORM",{});var b=E(t);a=f(b,"INPUT",{type:!0,name:!0}),n=L(b),s=f(b,"BUTTON",{class:!0});var A=E(s);i=f(A,"I",{class:!0});var $=E(i);pe(_.$$.fragment,$),$.forEach(u),h=Z(A,`\r
    Delete background job`),A.forEach(u),b.forEach(u),this.h()},h(){c(a,"type","hidden"),c(a,"name","id"),a.value=e[0],c(i,"class","svelte-ooaugn"),c(s,"class","danger")},m(o,b){x(o,t,b),l(t,a),l(t,n),l(t,s),l(s,i),ge(_,i,null),l(s,h),e[3](t),r=!0,p||(g=me(t,"submit",e[2]),p=!0)},p(o,[b]){(!r||b&1)&&(a.value=o[0])},i(o){r||(O(_.$$.fragment,o),r=!0)},o(o){G(_.$$.fragment,o),r=!1},d(o){o&&u(t),ve(_),e[3](null),p=!1,g()}}}function gt(e,t,a){let{id:n}=t,s;const i=We(),_=async r=>{if(r.preventDefault(),confirm("Are you sure you want to delete this background job?")){const p=await Re.delete({properties:new FormData(s)});p.errors?ke.notification.create("error",`Background job ${p.admin_background_job_delete.id} could not be deleted`):(i("itemsChanged"),ke.notification.create("success",`Background job ${p.admin_background_job_delete.id} deleted`))}};function h(r){Te[r?"unshift":"push"](()=>{s=r,a(1,s)})}return e.$$set=r=>{"id"in r&&a(0,n=r.id)},[n,s,_,h]}class vt extends Ae{constructor(t){super(),Ne(this,t,gt,pt,Pe,{id:0})}}function Je(e,t,a){const n=e.slice();return n[16]=t[a],n}function bt(e){let t;return{c(){t=Y("Runs")},l(a){t=Z(a,"Runs")},m(a,n){x(a,t,n)},d(a){a&&u(t)}}}function Et(e){let t;return{c(){t=Y("Failed")},l(a){t=Z(a,"Failed")},m(a,n){x(a,t,n)},d(a){a&&u(t)}}}function Ke(e){let t,a,n;return a=new ht({props:{id:e[16].id}}),a.$on("itemsChanged",e[6]),{c(){t=d("li"),he(a.$$.fragment),this.h()},l(s){t=f(s,"LI",{class:!0});var i=E(t);pe(a.$$.fragment,i),i.forEach(u),this.h()},h(){c(t,"class","svelte-1m1ug4d")},m(s,i){x(s,t,i),ge(a,t,null),n=!0},p(s,i){const _={};i&2&&(_.id=s[16].id),a.$set(_)},i(s){n||(O(a.$$.fragment,s),n=!0)},o(s){G(a.$$.fragment,s),n=!1},d(s){s&&u(t),ve(a)}}}function yt(e){let t=(e[16].run_at_parsed||be(new Date(e[16].run_at)))+"",a;return{c(){a=Y(t)},l(n){a=Z(n,t)},m(n,s){x(n,a,s)},p(n,s){s&2&&t!==(t=(n[16].run_at_parsed||be(new Date(n[16].run_at)))+"")&&$e(a,t)},d(n){n&&u(a)}}}function $t(e){let t=(e[16].dead_at_parsed||be(new Date(e[16].dead_at))||"")+"",a;return{c(){a=Y(t)},l(n){a=Z(n,t)},m(n,s){x(n,a,s)},p(n,s){s&2&&t!==(t=(n[16].dead_at_parsed||be(new Date(n[16].dead_at))||"")+"")&&$e(a,t)},d(n){n&&u(a)}}}function Ge(e){let t,a,n,s,i,_="More options",h,r,p,g,o,b,A,$,se,j,P=(e[16].source_name||e[16].id)+"",v,S,z,ee,te=e[16].queue+"",q,ue,J,K,H,le,U;r=new je({props:{icon:"navigationMenuVertical",size:"16"}});function ae(){return e[11](e[16])}let D=e[16].dead_at&&Ke(e);$=new vt({props:{id:e[16].id}}),$.$on("itemsChanged",e[6]);function de(T,y){return T[0].type==="DEAD"?$t:yt}let N=de(e),R=N(e);return{c(){t=d("tr"),a=d("td"),n=d("div"),s=d("button"),i=d("span"),i.textContent=_,h=I(),he(r.$$.fragment),p=I(),g=d("menu"),o=d("ul"),D&&D.c(),b=I(),A=d("li"),he($.$$.fragment),se=I(),j=d("a"),v=Y(P),z=I(),ee=d("td"),q=Y(te),ue=I(),J=d("td"),R.c(),K=I(),this.h()},l(T){t=f(T,"TR",{class:!0});var y=E(t);a=f(y,"TD",{class:!0});var W=E(a);n=f(W,"DIV",{class:!0});var Q=E(n);s=f(Q,"BUTTON",{class:!0});var M=E(s);i=f(M,"SPAN",{class:!0,"data-svelte-h":!0}),ie(i)!=="svelte-1agpmtc"&&(i.textContent=_),h=L(M),pe(r.$$.fragment,M),M.forEach(u),p=L(Q),g=f(Q,"MENU",{class:!0});var fe=E(g);o=f(fe,"UL",{});var re=E(o);D&&D.l(re),b=L(re),A=f(re,"LI",{class:!0});var Ee=E(A);pe($.$$.fragment,Ee),Ee.forEach(u),re.forEach(u),fe.forEach(u),se=L(Q),j=f(Q,"A",{href:!0,class:!0});var oe=E(j);v=Z(oe,P),oe.forEach(u),Q.forEach(u),W.forEach(u),z=L(y),ee=f(y,"TD",{class:!0});var V=E(ee);q=Z(V,te),V.forEach(u),ue=L(y),J=f(y,"TD",{class:!0});var X=E(J);R.l(X),X.forEach(u),K=L(y),y.forEach(u),this.h()},h(){c(i,"class","label"),c(s,"class","button compact more svelte-1m1ug4d"),c(A,"class","svelte-1m1ug4d"),c(g,"class","content-context svelte-1m1ug4d"),Ve(g,"active",e[2].id===e[16].id),c(j,"href",S="/backgroundJobs/"+e[0].type.toLowerCase()+"/"+e[16].id+"?"+e[4].url.searchParams.toString()),c(j,"class","svelte-1m1ug4d"),c(n,"class","svelte-1m1ug4d"),c(a,"class","id svelte-1m1ug4d"),c(ee,"class","svelte-1m1ug4d"),c(J,"class","svelte-1m1ug4d"),c(t,"class","svelte-1m1ug4d")},m(T,y){x(T,t,y),l(t,a),l(a,n),l(n,s),l(s,i),l(s,h),ge(r,s,null),l(n,p),l(n,g),l(g,o),D&&D.m(o,null),l(o,b),l(o,A),ge($,A,null),l(n,se),l(n,j),l(j,v),l(t,z),l(t,ee),l(ee,q),l(t,ue),l(t,J),R.m(J,null),l(t,K),H=!0,le||(U=[me(s,"click",ae),me(a,"mouseleave",e[12])],le=!0)},p(T,y){e=T,e[16].dead_at?D?(D.p(e,y),y&2&&O(D,1)):(D=Ke(e),D.c(),O(D,1),D.m(o,b)):D&&(Ye(),G(D,1,1,()=>{D=null}),Xe());const W={};y&2&&(W.id=e[16].id),$.$set(W),(!H||y&6)&&Ve(g,"active",e[2].id===e[16].id),(!H||y&2)&&P!==(P=(e[16].source_name||e[16].id)+"")&&$e(v,P),(!H||y&19&&S!==(S="/backgroundJobs/"+e[0].type.toLowerCase()+"/"+e[16].id+"?"+e[4].url.searchParams.toString()))&&c(j,"href",S),(!H||y&2)&&te!==(te=e[16].queue+"")&&$e(q,te),N===(N=de(e))&&R?R.p(e,y):(R.d(1),R=N(e),R&&(R.c(),R.m(J,null)))},i(T){H||(O(r.$$.fragment,T),O(D),O($.$$.fragment,T),H=!0)},o(T){G(r.$$.fragment,T),G(D),G($.$$.fragment,T),H=!1},d(T){T&&u(t),ve(r),D&&D.d(),ve($),R.d(),le=!1,Qe(U)}}}function kt(e){var Ue;let t,a,n,s,i,_,h,r,p="Type:",g,o,b,A="Scheduled",$,se="Failed",j,P,v,S,z,ee="Name / id",te,q,ue="Priority",J,K,H,le,U,ae,D="Page:",de,N,R,T,y=(e[1].total_pages||1)+"",W,Q,M,fe,re;document.title=t="Jobs"+((Ue=e[5].online)!=null&&Ue.MPKIT_URL?": "+e[5].online.MPKIT_URL.replace("https://",""):"");function Ee(m,C){return m[0].type==="DEAD"?Et:bt}let oe=Ee(e),V=oe(e),X=ze(e[1].results),k=[];for(let m=0;m<X.length;m+=1)k[m]=Ge(Je(e,X,m));const Ze=m=>G(k[m],1,1,()=>{k[m]=null});function xe(m){e[13](m)}let Se={form:"filters",name:"page",min:1,max:e[1].total_pages,step:1,decreaseLabel:"Previous page",increaseLabel:"Next page",style:"navigation"};e[0].page!==void 0&&(Se.value=e[0].page),N=new ct({props:Se}),Te.push(()=>dt(N,"value",xe)),N.$on("input",function(){Fe(e[3].requestSubmit())&&e[3].requestSubmit().apply(this,arguments)});const we=e[8].default,B=et(we,e,e[7],null);return{c(){a=I(),n=d("div"),s=d("div"),i=d("nav"),_=d("form"),h=d("fieldset"),r=d("label"),r.textContent=p,g=I(),o=d("select"),b=d("option"),b.textContent=A,$=d("option"),$.textContent=se,j=I(),P=d("table"),v=d("thead"),S=d("tr"),z=d("th"),z.textContent=ee,te=I(),q=d("th"),q.textContent=ue,J=I(),K=d("th"),V.c(),H=I();for(let m=0;m<k.length;m+=1)k[m].c();le=I(),U=d("nav"),ae=d("label"),ae.textContent=D,de=I(),he(N.$$.fragment),T=Y(`\r
      of `),W=Y(y),Q=I(),B&&B.c(),this.h()},l(m){tt("svelte-qj8tye",document.head).forEach(u),a=L(m),n=f(m,"DIV",{class:!0});var F=E(n);s=f(F,"DIV",{class:!0});var ne=E(s);i=f(ne,"NAV",{class:!0});var w=E(i);_=f(w,"FORM",{id:!0,class:!0});var ye=E(_);h=f(ye,"FIELDSET",{class:!0});var De=E(h);r=f(De,"LABEL",{for:!0,"data-svelte-h":!0}),ie(r)!=="svelte-iw296f"&&(r.textContent=p),g=L(De),o=f(De,"SELECT",{name:!0,id:!0});var Ie=E(o);b=f(Ie,"OPTION",{"data-svelte-h":!0}),ie(b)!=="svelte-1nu502o"&&(b.textContent=A),$=f(Ie,"OPTION",{"data-svelte-h":!0}),ie($)!=="svelte-105yz3n"&&($.textContent=se),Ie.forEach(u),De.forEach(u),ye.forEach(u),w.forEach(u),j=L(ne),P=f(ne,"TABLE",{class:!0});var Ce=E(P);v=f(Ce,"THEAD",{class:!0});var Me=E(v);S=f(Me,"TR",{});var ce=E(S);z=f(ce,"TH",{class:!0,"data-svelte-h":!0}),ie(z)!=="svelte-17wqap5"&&(z.textContent=ee),te=L(ce),q=f(ce,"TH",{class:!0,"data-svelte-h":!0}),ie(q)!=="svelte-wgplya"&&(q.textContent=ue),J=L(ce),K=f(ce,"TH",{class:!0});var Be=E(K);V.l(Be),Be.forEach(u),ce.forEach(u),Me.forEach(u),H=L(Ce);for(let Le=0;Le<k.length;Le+=1)k[Le].l(Ce);Ce.forEach(u),le=L(ne),U=f(ne,"NAV",{class:!0});var _e=E(U);ae=f(_e,"LABEL",{for:!0,"data-svelte-h":!0}),ie(ae)!=="svelte-1r8oyu6"&&(ae.textContent=D),de=L(_e),pe(N.$$.fragment,_e),T=Z(_e,`\r
      of `),W=Z(_e,y),_e.forEach(u),ne.forEach(u),Q=L(F),B&&B.l(F),F.forEach(u),this.h()},h(){c(r,"for","filter-type"),b.__value="SCHEDULED",Oe(b,b.__value),$.__value="DEAD",Oe($,$.__value),c(o,"name","type"),c(o,"id","filter-type"),e[0].type===void 0&&at(()=>e[9].call(o)),c(h,"class","svelte-1m1ug4d"),c(_,"id","filters"),c(_,"class","svelte-1m1ug4d"),c(i,"class","filters svelte-1m1ug4d"),c(z,"class","id svelte-1m1ug4d"),c(q,"class","svelte-1m1ug4d"),c(K,"class","svelte-1m1ug4d"),c(v,"class","svelte-1m1ug4d"),c(P,"class","svelte-1m1ug4d"),c(ae,"for","page"),c(U,"class","pagination svelte-1m1ug4d"),c(s,"class","svelte-1m1ug4d"),c(n,"class","container svelte-1m1ug4d")},m(m,C){x(m,a,C),x(m,n,C),l(n,s),l(s,i),l(i,_),l(_,h),l(h,r),l(h,g),l(h,o),l(o,b),l(o,$),qe(o,e[0].type,!0),e[10](_),l(s,j),l(s,P),l(P,v),l(v,S),l(S,z),l(S,te),l(S,q),l(S,J),l(S,K),V.m(K,null),l(P,H);for(let F=0;F<k.length;F+=1)k[F]&&k[F].m(P,null);l(s,le),l(s,U),l(U,ae),l(U,de),ge(N,U,null),l(U,T),l(U,W),l(n,Q),B&&B.m(n,null),M=!0,fe||(re=[me(o,"change",e[9]),me(o,"change",function(){Fe(e[3].requestSubmit())&&e[3].requestSubmit().apply(this,arguments)})],fe=!0)},p(m,[C]){var ne;if(e=m,(!M||C&32)&&t!==(t="Jobs"+((ne=e[5].online)!=null&&ne.MPKIT_URL?": "+e[5].online.MPKIT_URL.replace("https://",""):""))&&(document.title=t),C&1&&qe(o,e[0].type),oe!==(oe=Ee(e))&&(V.d(1),V=oe(e),V&&(V.c(),V.m(K,null))),C&87){X=ze(e[1].results);let w;for(w=0;w<X.length;w+=1){const ye=Je(e,X,w);k[w]?(k[w].p(ye,C),O(k[w],1)):(k[w]=Ge(ye),k[w].c(),O(k[w],1),k[w].m(P,null))}for(Ye(),w=X.length;w<k.length;w+=1)Ze(w);Xe()}const F={};C&2&&(F.max=e[1].total_pages),!R&&C&1&&(R=!0,F.value=e[0].page,nt(()=>R=!1)),N.$set(F),(!M||C&2)&&y!==(y=(e[1].total_pages||1)+"")&&$e(W,y),B&&B.p&&(!M||C&128)&&st(B,we,e,e[7],M?rt(we,e[7],C,null):lt(e[7]),null)},i(m){if(!M){for(let C=0;C<X.length;C+=1)O(k[C]);O(N.$$.fragment,m),O(B,m),M=!0}},o(m){k=k.filter(Boolean);for(let C=0;C<k.length;C+=1)G(k[C]);G(N.$$.fragment,m),G(B,m),M=!1},d(m){m&&(u(a),u(n)),e[10](null),V.d(),ot(k,m),ve(N),B&&B.d(m),fe=!1,Qe(re)}}}function Dt(e,t,a){let n,s;He(e,ft,v=>a(4,n=v)),He(e,ke,v=>a(5,s=v));let{$$slots:i={},$$scope:_}=t,h={results:[]},r={id:null},p={page:1,type:"SCHEDULED",...Object.fromEntries(n.url.searchParams)},g,o;const b=async()=>{clearInterval(o),a(1,h=await Re.get(p)),console.log(h),o=setInterval(()=>{h.results.forEach(v=>{p.type==="DEAD"?v.dead_at_parsed=be(new Date(v.dead_at)):v.run_at_parsed=be(new Date(v.run_at))})},1e3)};it(()=>{clearInterval(o)});function A(){p.type=ut(this),a(0,p)}function $(v){Te[v?"unshift":"push"](()=>{g=v,a(3,g)})}const se=v=>a(2,r.id=v.id,r),j=()=>a(2,r.id=null,r);function P(v){e.$$.not_equal(p.page,v)&&(p.page=v,a(0,p))}return e.$$set=v=>{"$$scope"in v&&a(7,_=v.$$scope)},e.$$.update=()=>{e.$$.dirty&1&&p&&b()},[p,h,r,g,n,s,b,_,i,A,$,se,j,P]}class jt extends Ae{constructor(t){super(),Ne(this,t,Dt,kt,Pe,{})}}export{jt as component};
