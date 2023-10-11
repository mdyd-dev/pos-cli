import{S as De,i as Ue,s as Be,a as O,k as c,q as K,y as he,W as Pe,h as o,c as I,l as m,m as y,r as J,z as ve,n as t,b as le,E as s,Y as Se,A as be,H as re,a4 as we,g as W,d as se,f as Fe,B as ge,_ as qe,I as Ce,F as He,K as Me,G as te,u as Le,L as Re,a2 as Ve,v as ke}from"../chunks/index.d0f8a730.js";import{f as ze}from"../chunks/index.b4e343af.js";import{g as $e}from"../chunks/graphql.66a06395.js";import{s as G}from"../chunks/state.c2a70a8a.js";import{I as Ee}from"../chunks/Icon.1de0c66c.js";const ce={get:()=>$e({query:`
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
      }`}).then(a=>a.constants.results),edit:e=>{e=Object.fromEntries(e.entries());const a=`
      mutation {
        constant_set(name: "${e.name}", value: "${e.value}"){
          name,
          value
        }
      }`;return $e({query:a})},delete:e=>{e=Object.fromEntries(e.entries());const a=`
      mutation {
        constant_unset(name: "${e.name}"){
          name
        }
      }
    `;return $e({query:a})}};function Oe(e,a,n){const u=e.slice();return u[13]=a[n],u[14]=a,u[15]=n,u}function Ie(e){let a,n,u,T,g,S,h,U;return g=new Ee({props:{icon:"x",size:"12"}}),{c(){a=c("button"),n=c("span"),u=K("Clear filter"),T=O(),he(g.$$.fragment),this.h()},l(F){a=m(F,"BUTTON",{class:!0});var E=y(a);n=m(E,"SPAN",{class:!0});var k=y(n);u=J(k,"Clear filter"),k.forEach(o),T=I(E),ve(g.$$.fragment,E),E.forEach(o),this.h()},h(){t(n,"class","label svelte-9flr1b"),t(a,"class","clearFilter svelte-9flr1b")},m(F,E){le(F,a,E),s(a,n),s(n,u),s(a,T),be(g,a,null),S=!0,h||(U=re(a,"click",e[8]),h=!0)},p:Me,i(F){S||(W(g.$$.fragment,F),S=!0)},o(F){se(g.$$.fragment,F),S=!1},d(F){F&&o(a),ge(g),h=!1,U()}}}function Ae(e){let a,n,u,T,g,S,h,U,F,E,k,w,A,z=e[13].name+"",Y,r,$,i,P,ae,q,N,Q,B,X,M,C,D,j=e[13].exposed?"Hide value":"Show value",Z,oe,f,H,d,R,l,v,_,p,ue,me;E=new Ee({props:{icon:"x",size:"14"}});function x(){return e[10](e[13],e[14],e[15])}f=new Ee({props:{icon:e[13].exposed?"eyeStriked":"eye"}});function ie(){return e[11](e[13],e[14],e[15])}function de(...L){return e[12](e[15],...L)}return{c(){a=c("li"),n=c("form"),u=c("input"),g=O(),S=c("button"),h=c("span"),U=K("Delete constant"),F=O(),he(E.$$.fragment),k=O(),w=c("form"),A=c("label"),Y=K(z),$=O(),i=c("input"),ae=O(),q=c("fieldset"),N=c("input"),M=O(),C=c("button"),D=c("span"),Z=K(j),oe=O(),he(f.$$.fragment),d=O(),R=c("button"),l=K("Save"),v=O(),this.h()},l(L){a=m(L,"LI",{class:!0});var b=y(a);n=m(b,"FORM",{class:!0});var V=y(n);u=m(V,"INPUT",{type:!0,name:!0,class:!0}),g=I(V),S=m(V,"BUTTON",{type:!0,title:!0,class:!0});var ne=y(S);h=m(ne,"SPAN",{class:!0});var fe=y(h);U=J(fe,"Delete constant"),fe.forEach(o),F=I(ne),ve(E.$$.fragment,ne),ne.forEach(o),V.forEach(o),k=I(b),w=m(b,"FORM",{class:!0});var ee=y(w);A=m(ee,"LABEL",{for:!0,class:!0});var Ne=y(A);Y=J(Ne,z),Ne.forEach(o),$=I(ee),i=m(ee,"INPUT",{type:!0,name:!0,class:!0}),ae=I(ee),q=m(ee,"FIELDSET",{class:!0});var _e=y(q);N=m(_e,"INPUT",{name:!0,id:!0,class:!0}),M=I(_e),C=m(_e,"BUTTON",{type:!0,class:!0,title:!0});var pe=y(C);D=m(pe,"SPAN",{class:!0});var ye=y(D);Z=J(ye,j),ye.forEach(o),oe=I(pe),ve(f.$$.fragment,pe),pe.forEach(o),_e.forEach(o),d=I(ee),R=m(ee,"BUTTON",{type:!0,class:!0});var Te=y(R);l=J(Te,"Save"),Te.forEach(o),ee.forEach(o),v=I(b),b.forEach(o),this.h()},h(){t(u,"type","hidden"),t(u,"name","name"),u.value=T=e[13].name,t(u,"class","svelte-9flr1b"),t(h,"class","label svelte-9flr1b"),t(S,"type","submit"),t(S,"title","Delete constant"),t(S,"class","svelte-9flr1b"),t(n,"class","delete svelte-9flr1b"),t(A,"for",r=e[13].name),t(A,"class","svelte-9flr1b"),t(i,"type","hidden"),t(i,"name","name"),i.value=P=e[13].name,t(i,"class","svelte-9flr1b"),N.disabled=Q=!e[13].exposed,t(N,"name","value"),N.value=B=e[13].value,t(N,"id",X=e[13].name),t(N,"class","svelte-9flr1b"),te(N,"exposed",e[13].exposed),t(D,"class","label svelte-9flr1b"),t(C,"type","button"),t(C,"class","toggleExposition svelte-9flr1b"),t(C,"title",H=e[13].exposed?"Hide value":"Show value"),t(q,"class","svelte-9flr1b"),t(R,"type","submit"),t(R,"class","button svelte-9flr1b"),te(R,"needed",e[1][e[15]].changed),t(w,"class","edit svelte-9flr1b"),t(a,"class","svelte-9flr1b"),te(a,"hidden",e[0]&&e[3](e[13])),te(a,"highlighted",e[2].highlighted.constant===e[13].name)},m(L,b){le(L,a,b),s(a,n),s(n,u),s(n,g),s(n,S),s(S,h),s(h,U),s(S,F),be(E,S,null),s(a,k),s(a,w),s(w,A),s(A,Y),s(w,$),s(w,i),s(w,ae),s(w,q),s(q,N),s(q,M),s(q,C),s(C,D),s(D,Z),s(C,oe),be(f,C,null),s(w,d),s(w,R),s(R,l),s(a,v),p=!0,ue||(me=[re(n,"submit",we(e[9])),re(N,"input",x),re(C,"click",ie),re(w,"submit",we(de))],ue=!0)},p(L,b){e=L,(!p||b&2&&T!==(T=e[13].name))&&(u.value=T),(!p||b&2)&&z!==(z=e[13].name+"")&&Le(Y,z),(!p||b&2&&r!==(r=e[13].name))&&t(A,"for",r),(!p||b&2&&P!==(P=e[13].name))&&(i.value=P),(!p||b&2&&Q!==(Q=!e[13].exposed))&&(N.disabled=Q),(!p||b&2&&B!==(B=e[13].value)&&N.value!==B)&&(N.value=B),(!p||b&2&&X!==(X=e[13].name))&&t(N,"id",X),(!p||b&2)&&te(N,"exposed",e[13].exposed),(!p||b&2)&&j!==(j=e[13].exposed?"Hide value":"Show value")&&Le(Z,j);const V={};b&2&&(V.icon=e[13].exposed?"eyeStriked":"eye"),f.$set(V),(!p||b&2&&H!==(H=e[13].exposed?"Hide value":"Show value"))&&t(C,"title",H),(!p||b&2)&&te(R,"needed",e[1][e[15]].changed),(!p||b&11)&&te(a,"hidden",e[0]&&e[3](e[13])),(!p||b&6)&&te(a,"highlighted",e[2].highlighted.constant===e[13].name)},i(L){p||(W(E.$$.fragment,L),W(f.$$.fragment,L),_||Re(()=>{_=Ve(a,ze,{duration:100,delay:10*e[15]}),_.start()}),p=!0)},o(L){se(E.$$.fragment,L),se(f.$$.fragment,L),p=!1},d(L){L&&o(a),ge(E),ge(f),ue=!1,Ce(me)}}}function je(e){let a,n,u,T,g,S,h,U,F,E,k,w,A,z,Y,r,$,i,P,ae,q,N,Q,B,X,M,C,D,j,Z,oe,f=e[0]&&Ie(e);M=new Ee({props:{icon:"arrowRight"}});let H=e[1],d=[];for(let l=0;l<H.length;l+=1)d[l]=Ae(Oe(e,H,l));const R=l=>se(d[l],1,1,()=>{d[l]=null});return{c(){a=O(),n=c("nav"),u=c("form"),T=c("label"),g=K("Find:"),S=O(),h=c("input"),U=O(),f&&f.c(),F=O(),E=c("section"),k=c("form"),w=c("fieldset"),A=c("label"),z=K("Name"),Y=O(),r=c("input"),$=O(),i=c("fieldset"),P=c("label"),ae=K("Value"),q=O(),N=c("input"),Q=O(),B=c("button"),X=K(`Add\r
      `),he(M.$$.fragment),C=O(),D=c("ul");for(let l=0;l<d.length;l+=1)d[l].c();this.h()},l(l){Pe("svelte-147nas7",document.head).forEach(o),a=I(l),n=m(l,"NAV",{class:!0});var _=y(n);u=m(_,"FORM",{});var p=y(u);T=m(p,"LABEL",{for:!0});var ue=y(T);g=J(ue,"Find:"),ue.forEach(o),S=I(p),h=m(p,"INPUT",{type:!0,id:!0,class:!0}),U=I(p),f&&f.l(p),p.forEach(o),_.forEach(o),F=I(l),E=m(l,"SECTION",{class:!0});var me=y(E);k=m(me,"FORM",{class:!0});var x=y(k);w=m(x,"FIELDSET",{class:!0});var ie=y(w);A=m(ie,"LABEL",{for:!0,class:!0});var de=y(A);z=J(de,"Name"),de.forEach(o),Y=I(ie),r=m(ie,"INPUT",{type:!0,name:!0,id:!0,placeholder:!0,class:!0}),ie.forEach(o),$=I(x),i=m(x,"FIELDSET",{class:!0});var L=y(i);P=m(L,"LABEL",{for:!0,class:!0});var b=y(P);ae=J(b,"Value"),b.forEach(o),q=I(L),N=m(L,"INPUT",{type:!0,name:!0,id:!0,class:!0}),L.forEach(o),Q=I(x),B=m(x,"BUTTON",{class:!0});var V=y(B);X=J(V,`Add\r
      `),ve(M.$$.fragment,V),V.forEach(o),x.forEach(o),me.forEach(o),C=I(l),D=m(l,"UL",{class:!0});var ne=y(D);for(let fe=0;fe<d.length;fe+=1)d[fe].l(ne);ne.forEach(o),this.h()},h(){document.title="Constants | platformOS",t(T,"for","filter"),t(h,"type","text"),t(h,"id","filter"),h.autofocus=!0,t(h,"class","svelte-9flr1b"),t(n,"class","svelte-9flr1b"),t(A,"for","newName"),t(A,"class","svelte-9flr1b"),t(r,"type","text"),t(r,"name","name"),t(r,"id","newName"),t(r,"placeholder","MY_NEW_CONSTANT"),t(r,"class","svelte-9flr1b"),t(w,"class","svelte-9flr1b"),t(P,"for","newValue"),t(P,"class","svelte-9flr1b"),t(N,"type","text"),t(N,"name","value"),t(N,"id","newValue"),t(N,"class","svelte-9flr1b"),t(i,"class","svelte-9flr1b"),t(B,"class","button svelte-9flr1b"),t(k,"class","svelte-9flr1b"),t(E,"class","create svelte-9flr1b"),t(D,"class","svelte-9flr1b")},m(l,v){le(l,a,v),le(l,n,v),s(n,u),s(u,T),s(T,g),s(u,S),s(u,h),Se(h,e[0]),s(u,U),f&&f.m(u,null),le(l,F,v),le(l,E,v),s(E,k),s(k,w),s(w,A),s(A,z),s(w,Y),s(w,r),s(k,$),s(k,i),s(i,P),s(P,ae),s(i,q),s(i,N),s(k,Q),s(k,B),s(B,X),be(M,B,null),le(l,C,v),le(l,D,v);for(let _=0;_<d.length;_+=1)d[_]&&d[_].m(D,null);j=!0,h.focus(),Z||(oe=[re(h,"input",e[7]),re(k,"submit",we(e[6]))],Z=!0)},p(l,[v]){if(v&1&&h.value!==l[0]&&Se(h,l[0]),l[0]?f?(f.p(l,v),v&1&&W(f,1)):(f=Ie(l),f.c(),W(f,1),f.m(u,null)):f&&(ke(),se(f,1,1,()=>{f=null}),Fe()),v&63){H=l[1];let _;for(_=0;_<H.length;_+=1){const p=Oe(l,H,_);d[_]?(d[_].p(p,v),W(d[_],1)):(d[_]=Ae(p),d[_].c(),W(d[_],1),d[_].m(D,null))}for(ke(),_=H.length;_<d.length;_+=1)R(_);Fe()}},i(l){if(!j){W(f),W(M.$$.fragment,l);for(let v=0;v<H.length;v+=1)W(d[v]);j=!0}},o(l){se(f),se(M.$$.fragment,l),d=d.filter(Boolean);for(let v=0;v<d.length;v+=1)se(d[v]);j=!1},d(l){l&&o(a),l&&o(n),f&&f.d(),l&&o(F),l&&o(E),ge(M),l&&o(C),l&&o(D),qe(d,l),Z=!1,Ce(oe)}}}function We(e,a,n){let u;He(e,G,r=>n(2,u=r));let T="",g=[];(async()=>await ce.get())().then(r=>{n(1,g=r)});const S=r=>r.name.toLowerCase().indexOf(T.toLowerCase())===-1&&r.value.toLowerCase().indexOf(T.toLowerCase())===-1,h=async(r,$)=>{r.preventDefault();const i=await ce.edit(new FormData(r.target));i.errors?G.notification.create("error",`Failed to update ${i.constant_set.name} constant`):(n(1,g[$].changed=!1,g),G.highlight("constant",i.constant_set.name),G.notification.create("success",`Constant ${i.constant_set.name} updated`))},U=async r=>{if(r.preventDefault(),confirm("Are you sure you want to delete this constant?")){const $=await ce.delete(new FormData(r.target));$.errors?G.notification.create("success",`Failed to delete ${$.constant_unset.name} constant`):(G.notification.create("success",`Constant ${$.constant_unset.name} deleted`),await ce.get().then(i=>{n(1,g=i)}))}},F=async r=>{r.preventDefault();const $=await ce.edit(new FormData(r.target));$.errors?G.notification.create("error",`Failed to create ${$.constant_set.name} constant`):(r.target.reset(),G.notification.create("success",`Constant ${$.constant_set.name} created`),await ce.get().then(i=>{n(1,g=i),G.highlight("constant",$.constant_set.name)}))};function E(){T=this.value,n(0,T)}return[T,g,u,S,h,U,F,E,()=>n(0,T=""),r=>U(r),(r,$,i)=>n(1,$[i].changed=!0,g),(r,$,i)=>n(1,$[i].exposed=!r.exposed,g),(r,$)=>h($,r)]}class Xe extends De{constructor(a){super(),Ue(this,a,We,je,Be,{})}}export{Xe as component};