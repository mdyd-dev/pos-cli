import{s as Me,a as k,f as _,l as ve,J as De,d as L,c as S,g as h,h as O,r as ae,m as be,j as n,i as fe,v as s,K as $e,x as ee,R as ge,N as Pe,y as Fe,w as Ae,z as Re,u as Q,n as Te,B as Be}from"../chunks/scheduler.sKKhyktU.js";import{S as qe,i as He,b as ce,d as de,m as me,a as K,t as X,c as Ce,e as _e,j as Ke,g as Le}from"../chunks/index.LYVpS7Hw.js";import{e as Ne}from"../chunks/each.3GYeTQvW.js";import{f as Ve}from"../chunks/index.jubkZZMc.js";import{g as pe}from"../chunks/graphql.vANW7X3L.js";import{s as j}from"../chunks/state.u3CNLQkb.js";import{I as he}from"../chunks/Icon.rkznIECp.js";const se={get:()=>pe({query:`
      query {
        constants(
          per_page: 100
        ) {
          results {
            name,
            value,
            updated_at
          }
        }
      }`}).then(t=>t.constants.results),edit:e=>{e=Object.fromEntries(e.entries());const t=`
      mutation {
        constant_set(name: "${e.name}", value: "${e.value}"){
          name,
          value
        }
      }`;return pe({query:t})},delete:e=>{e=Object.fromEntries(e.entries());const t=`
      mutation {
        constant_unset(name: "${e.name}"){
          name
        }
      }
    `;return pe({query:t})}};function ye(e,t,a){const o=e.slice();return o[13]=t[a],o[14]=t,o[15]=a,o}function ke(e){let t,a,o="Clear filter",E,i,p,y,A;return i=new he({props:{icon:"x",size:"12"}}),{c(){t=_("button"),a=_("span"),a.textContent=o,E=k(),ce(i.$$.fragment),this.h()},l(c){t=h(c,"BUTTON",{class:!0});var N=O(t);a=h(N,"SPAN",{class:!0,"data-svelte-h":!0}),ae(a)!=="svelte-1bu6mgu"&&(a.textContent=o),E=S(N),de(i.$$.fragment,N),N.forEach(L),this.h()},h(){n(a,"class","label svelte-9flr1b"),n(t,"class","clearFilter svelte-9flr1b")},m(c,N){fe(c,t,N),s(t,a),s(t,E),me(i,t,null),p=!0,y||(A=ee(t,"click",e[8]),y=!0)},p:Re,i(c){p||(K(i.$$.fragment,c),p=!0)},o(c){X(i.$$.fragment,c),p=!1},d(c){c&&L(t),_e(i),y=!1,A()}}}function Se(e){let t,a,o,E,i,p,y,A="Delete constant",c,N,z,$,T,M=e[13].name+"",J,r,d,v,W,B,R,b,Y,D,q,Z,U,m,P=e[13].exposed?"Hide value":"Show value",f,re,l,g,u,F,V="Save",te,H,C,le,ne;N=new he({props:{icon:"x",size:"14"}});function Ie(){return e[10](e[13],e[14],e[15])}l=new he({props:{icon:e[13].exposed?"eyeStriked":"eye"}});function Oe(){return e[11](e[13],e[14],e[15])}function Ue(...I){return e[12](e[15],...I)}return{c(){t=_("li"),a=_("form"),o=_("input"),i=k(),p=_("button"),y=_("span"),y.textContent=A,c=k(),ce(N.$$.fragment),z=k(),$=_("form"),T=_("label"),J=ve(M),d=k(),v=_("input"),B=k(),R=_("fieldset"),b=_("input"),Z=k(),U=_("button"),m=_("span"),f=ve(P),re=k(),ce(l.$$.fragment),u=k(),F=_("button"),F.textContent=V,te=k(),this.h()},l(I){t=h(I,"LI",{class:!0});var w=O(t);a=h(w,"FORM",{class:!0});var x=O(a);o=h(x,"INPUT",{type:!0,name:!0,class:!0}),i=S(x),p=h(x,"BUTTON",{type:!0,title:!0,class:!0});var oe=O(p);y=h(oe,"SPAN",{class:!0,"data-svelte-h":!0}),ae(y)!=="svelte-1p7u8ms"&&(y.textContent=A),c=S(oe),de(N.$$.fragment,oe),oe.forEach(L),x.forEach(L),z=S(w),$=h(w,"FORM",{class:!0});var G=O($);T=h(G,"LABEL",{for:!0,class:!0});var Ee=O(T);J=be(Ee,M),Ee.forEach(L),d=S(G),v=h(G,"INPUT",{type:!0,name:!0,class:!0}),B=S(G),R=h(G,"FIELDSET",{class:!0});var ie=O(R);b=h(ie,"INPUT",{name:!0,id:!0,class:!0}),Z=S(ie),U=h(ie,"BUTTON",{type:!0,class:!0,title:!0});var ue=O(U);m=h(ue,"SPAN",{class:!0});var we=O(m);f=be(we,P),we.forEach(L),re=S(ue),de(l.$$.fragment,ue),ue.forEach(L),ie.forEach(L),u=S(G),F=h(G,"BUTTON",{type:!0,class:!0,"data-svelte-h":!0}),ae(F)!=="svelte-1g3xn8h"&&(F.textContent=V),G.forEach(L),te=S(w),w.forEach(L),this.h()},h(){n(o,"type","hidden"),n(o,"name","name"),o.value=E=e[13].name,n(o,"class","svelte-9flr1b"),n(y,"class","label svelte-9flr1b"),n(p,"type","submit"),n(p,"title","Delete constant"),n(p,"class","svelte-9flr1b"),n(a,"class","delete svelte-9flr1b"),n(T,"for",r=e[13].name),n(T,"class","svelte-9flr1b"),n(v,"type","hidden"),n(v,"name","name"),v.value=W=e[13].name,n(v,"class","svelte-9flr1b"),b.disabled=Y=!e[13].exposed,n(b,"name","value"),b.value=D=e[13].value,n(b,"id",q=e[13].name),n(b,"class","svelte-9flr1b"),Q(b,"exposed",e[13].exposed),n(m,"class","label svelte-9flr1b"),n(U,"type","button"),n(U,"class","toggleExposition svelte-9flr1b"),n(U,"title",g=e[13].exposed?"Hide value":"Show value"),n(R,"class","svelte-9flr1b"),n(F,"type","submit"),n(F,"class","button svelte-9flr1b"),Q(F,"needed",e[1][e[15]].changed),n($,"class","edit svelte-9flr1b"),n(t,"class","svelte-9flr1b"),Q(t,"hidden",e[0]&&e[3](e[13])),Q(t,"highlighted",e[2].highlighted.constant===e[13].name)},m(I,w){fe(I,t,w),s(t,a),s(a,o),s(a,i),s(a,p),s(p,y),s(p,c),me(N,p,null),s(t,z),s(t,$),s($,T),s(T,J),s($,d),s($,v),s($,B),s($,R),s(R,b),s(R,Z),s(R,U),s(U,m),s(m,f),s(U,re),me(l,U,null),s($,u),s($,F),s(t,te),C=!0,le||(ne=[ee(a,"submit",ge(e[9])),ee(b,"input",Ie),ee(U,"click",Oe),ee($,"submit",ge(Ue))],le=!0)},p(I,w){e=I,(!C||w&2&&E!==(E=e[13].name))&&(o.value=E),(!C||w&2)&&M!==(M=e[13].name+"")&&Te(J,M),(!C||w&2&&r!==(r=e[13].name))&&n(T,"for",r),(!C||w&2&&W!==(W=e[13].name))&&(v.value=W),(!C||w&2&&Y!==(Y=!e[13].exposed))&&(b.disabled=Y),(!C||w&2&&D!==(D=e[13].value)&&b.value!==D)&&(b.value=D),(!C||w&2&&q!==(q=e[13].name))&&n(b,"id",q),(!C||w&2)&&Q(b,"exposed",e[13].exposed),(!C||w&2)&&P!==(P=e[13].exposed?"Hide value":"Show value")&&Te(f,P);const x={};w&2&&(x.icon=e[13].exposed?"eyeStriked":"eye"),l.$set(x),(!C||w&2&&g!==(g=e[13].exposed?"Hide value":"Show value"))&&n(U,"title",g),(!C||w&2)&&Q(F,"needed",e[1][e[15]].changed),(!C||w&11)&&Q(t,"hidden",e[0]&&e[3](e[13])),(!C||w&6)&&Q(t,"highlighted",e[2].highlighted.constant===e[13].name)},i(I){C||(K(N.$$.fragment,I),K(l.$$.fragment,I),I&&(H||Be(()=>{H=Ke(t,Ve,{duration:100,delay:10*e[15]}),H.start()})),C=!0)},o(I){X(N.$$.fragment,I),X(l.$$.fragment,I),C=!1},d(I){I&&L(t),_e(N),_e(l),le=!1,Fe(ne)}}}function je(e){let t,a,o,E,i,p,y="Find:",A,c,N,z,$,T,M,J='<label for="newName" class="svelte-9flr1b">Name</label> <input type="text" name="name" id="newName" placeholder="MY_NEW_CONSTANT" class="svelte-9flr1b"/>',r,d,v='<label for="newValue" class="svelte-9flr1b">Value</label> <input type="text" name="value" id="newValue" class="svelte-9flr1b"/>',W,B,R,b,Y,D,q,Z,U;document.title=t="Constants"+(e[2].online?.MPKIT_URL?": "+e[2].online.MPKIT_URL.replace("https://",""):"");let m=e[0]&&ke(e);b=new he({props:{icon:"arrowRight"}});let P=Ne(e[1]),f=[];for(let l=0;l<P.length;l+=1)f[l]=Se(ye(e,P,l));const re=l=>X(f[l],1,1,()=>{f[l]=null});return{c(){a=k(),o=_("div"),E=_("nav"),i=_("form"),p=_("label"),p.textContent=y,A=k(),c=_("input"),N=k(),m&&m.c(),z=k(),$=_("section"),T=_("form"),M=_("fieldset"),M.innerHTML=J,r=k(),d=_("fieldset"),d.innerHTML=v,W=k(),B=_("button"),R=ve(`Add\r
        `),ce(b.$$.fragment),Y=k(),D=_("ul");for(let l=0;l<f.length;l+=1)f[l].c();this.h()},l(l){De("svelte-2x07wh",document.head).forEach(L),a=S(l),o=h(l,"DIV",{class:!0});var u=O(o);E=h(u,"NAV",{class:!0});var F=O(E);i=h(F,"FORM",{});var V=O(i);p=h(V,"LABEL",{for:!0,"data-svelte-h":!0}),ae(p)!=="svelte-1otrvr9"&&(p.textContent=y),A=S(V),c=h(V,"INPUT",{type:!0,id:!0,class:!0}),N=S(V),m&&m.l(V),V.forEach(L),F.forEach(L),z=S(u),$=h(u,"SECTION",{class:!0});var te=O($);T=h(te,"FORM",{class:!0});var H=O(T);M=h(H,"FIELDSET",{class:!0,"data-svelte-h":!0}),ae(M)!=="svelte-1pelkcv"&&(M.innerHTML=J),r=S(H),d=h(H,"FIELDSET",{class:!0,"data-svelte-h":!0}),ae(d)!=="svelte-t20vqf"&&(d.innerHTML=v),W=S(H),B=h(H,"BUTTON",{class:!0});var C=O(B);R=be(C,`Add\r
        `),de(b.$$.fragment,C),C.forEach(L),H.forEach(L),te.forEach(L),Y=S(u),D=h(u,"UL",{class:!0});var le=O(D);for(let ne=0;ne<f.length;ne+=1)f[ne].l(le);le.forEach(L),u.forEach(L),this.h()},h(){n(p,"for","filter"),n(c,"type","text"),n(c,"id","filter"),c.autofocus=!0,n(c,"class","svelte-9flr1b"),n(E,"class","svelte-9flr1b"),n(M,"class","svelte-9flr1b"),n(d,"class","svelte-9flr1b"),n(B,"class","button svelte-9flr1b"),n(T,"class","svelte-9flr1b"),n($,"class","create svelte-9flr1b"),n(D,"class","svelte-9flr1b"),n(o,"class","container")},m(l,g){fe(l,a,g),fe(l,o,g),s(o,E),s(E,i),s(i,p),s(i,A),s(i,c),$e(c,e[0]),s(i,N),m&&m.m(i,null),s(o,z),s(o,$),s($,T),s(T,M),s(T,r),s(T,d),s(T,W),s(T,B),s(B,R),me(b,B,null),s(o,Y),s(o,D);for(let u=0;u<f.length;u+=1)f[u]&&f[u].m(D,null);q=!0,c.focus(),Z||(U=[ee(c,"input",e[7]),ee(T,"submit",ge(e[6]))],Z=!0)},p(l,[g]){if((!q||g&4)&&t!==(t="Constants"+(l[2].online?.MPKIT_URL?": "+l[2].online.MPKIT_URL.replace("https://",""):""))&&(document.title=t),g&1&&c.value!==l[0]&&$e(c,l[0]),l[0]?m?(m.p(l,g),g&1&&K(m,1)):(m=ke(l),m.c(),K(m,1),m.m(i,null)):m&&(Le(),X(m,1,1,()=>{m=null}),Ce()),g&63){P=Ne(l[1]);let u;for(u=0;u<P.length;u+=1){const F=ye(l,P,u);f[u]?(f[u].p(F,g),K(f[u],1)):(f[u]=Se(F),f[u].c(),K(f[u],1),f[u].m(D,null))}for(Le(),u=P.length;u<f.length;u+=1)re(u);Ce()}},i(l){if(!q){K(m),K(b.$$.fragment,l);for(let g=0;g<P.length;g+=1)K(f[g]);q=!0}},o(l){X(m),X(b.$$.fragment,l),f=f.filter(Boolean);for(let g=0;g<f.length;g+=1)X(f[g]);q=!1},d(l){l&&(L(a),L(o)),m&&m.d(),_e(b),Pe(f,l),Z=!1,Fe(U)}}}function ze(e,t,a){let o;Ae(e,j,r=>a(2,o=r));let E="",i=[];(async()=>await se.get())().then(r=>{a(1,i=r)});const p=r=>r.name.toLowerCase().indexOf(E.toLowerCase())===-1&&r.value.toLowerCase().indexOf(E.toLowerCase())===-1,y=async(r,d)=>{r.preventDefault();const v=await se.edit(new FormData(r.target));v.errors?j.notification.create("error",`Failed to update ${v.constant_set.name} constant`):(a(1,i[d].changed=!1,i),j.highlight("constant",v.constant_set.name),j.notification.create("success",`Constant ${v.constant_set.name} updated`))},A=async r=>{if(r.preventDefault(),confirm("Are you sure you want to delete this constant?")){const d=await se.delete(new FormData(r.target));d.errors?j.notification.create("success",`Failed to delete ${d.constant_unset.name} constant`):(j.notification.create("success",`Constant ${d.constant_unset.name} deleted`),await se.get().then(v=>{a(1,i=v)}))}},c=async r=>{r.preventDefault();const d=await se.edit(new FormData(r.target));d.errors?j.notification.create("error",`Failed to create ${d.constant_set.name} constant`):(r.target.reset(),j.notification.create("success",`Constant ${d.constant_set.name} created`),await se.get().then(v=>{a(1,i=v),j.highlight("constant",d.constant_set.name)}))};function N(){E=this.value,a(0,E)}return[E,i,o,p,y,A,c,N,()=>a(0,E=""),r=>A(r),(r,d,v)=>a(1,d[v].changed=!0,i),(r,d,v)=>a(1,d[v].exposed=!r.exposed,i),(r,d)=>y(d,r)]}class xe extends qe{constructor(t){super(),He(this,t,ze,je,Me,{})}}export{xe as component};