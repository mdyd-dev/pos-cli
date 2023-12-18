import{s as y,f as k,l as C,a as A,g as I,h as R,m as H,d as T,c as B,j as u,k as K,i as x,v as _,K as W,x as O,R as z,n as F,V as p,y as $,H as ee,W as ae}from"./scheduler.771e17c8.js";import{S as ne,i as te,b as G,d as J,m as M,a as Q,t as X,e as Y}from"./index.25a56fcb.js";import{I as Z}from"./Icon.34c6ba11.js";function se(a){let l,t,b,c,L,f,g,o,N,n,E,r,d,S,D,h,s,U,m,V,j;return f=new Z({props:{icon:a[6]==="navigation"?"arrowLeft":"minus"}}),h=new Z({props:{icon:a[6]==="navigation"?"arrowRight":"minus"}}),{c(){l=k("div"),t=k("button"),b=k("span"),c=C(a[7]),L=A(),G(f.$$.fragment),N=A(),n=k("input"),E=A(),r=k("button"),d=k("span"),S=C(a[8]),D=A(),G(h.$$.fragment),this.h()},l(e){l=I(e,"DIV",{class:!0});var i=R(l);t=I(i,"BUTTON",{class:!0,"aria-hidden":!0});var v=R(t);b=I(v,"SPAN",{class:!0});var P=R(b);c=H(P,a[7]),P.forEach(T),L=B(v),J(f.$$.fragment,v),v.forEach(T),N=B(i),n=I(i,"INPUT",{form:!0,type:!0,name:!0,id:!0,min:!0,max:!0,step:!0,style:!0,class:!0}),E=B(i),r=I(i,"BUTTON",{class:!0,"aria-hidden":!0});var w=R(r);d=I(w,"SPAN",{class:!0});var q=R(d);S=H(q,a[8]),q.forEach(T),D=B(w),J(h.$$.fragment,w),w.forEach(T),i.forEach(T),this.h()},h(){var e;u(b,"class","label"),u(t,"class","button svelte-1g961xw"),t.disabled=g=a[0]<=a[3],u(t,"aria-hidden",o=a[0]<=a[3]),u(n,"form",a[1]),u(n,"type","number"),u(n,"name",a[2]),u(n,"id",a[2]),u(n,"min",a[3]),u(n,"max",a[4]),u(n,"step",a[5]),K(n,"--max",(((e=a[4])==null?void 0:e.toString().length)||1)+"ch"),u(n,"class","svelte-1g961xw"),u(d,"class","label"),u(r,"class","button svelte-1g961xw"),r.disabled=s=a[0]>=a[4],u(r,"aria-hidden",U=a[0]>=a[4]),u(l,"class","number svelte-1g961xw")},m(e,i){x(e,l,i),_(l,t),_(t,b),_(b,c),_(t,L),M(f,t,null),_(l,N),_(l,n),W(n,a[0]),_(l,E),_(l,r),_(r,d),_(d,S),_(r,D),M(h,r,null),m=!0,V||(j=[O(t,"click",z(a[11])),O(n,"input",a[12]),O(n,"input",a[10]),O(r,"click",z(a[13]))],V=!0)},p(e,[i]){var w;(!m||i&128)&&F(c,e[7]);const v={};i&64&&(v.icon=e[6]==="navigation"?"arrowLeft":"minus"),f.$set(v),(!m||i&9&&g!==(g=e[0]<=e[3]))&&(t.disabled=g),(!m||i&9&&o!==(o=e[0]<=e[3]))&&u(t,"aria-hidden",o),(!m||i&2)&&u(n,"form",e[1]),(!m||i&4)&&u(n,"name",e[2]),(!m||i&4)&&u(n,"id",e[2]),(!m||i&8)&&u(n,"min",e[3]),(!m||i&16)&&u(n,"max",e[4]),(!m||i&32)&&u(n,"step",e[5]),(!m||i&16)&&K(n,"--max",(((w=e[4])==null?void 0:w.toString().length)||1)+"ch"),i&1&&p(n.value)!==e[0]&&W(n,e[0]),(!m||i&256)&&F(S,e[8]);const P={};i&64&&(P.icon=e[6]==="navigation"?"arrowRight":"minus"),h.$set(P),(!m||i&17&&s!==(s=e[0]>=e[4]))&&(r.disabled=s),(!m||i&17&&U!==(U=e[0]>=e[4]))&&u(r,"aria-hidden",U)},i(e){m||(Q(f.$$.fragment,e),Q(h.$$.fragment,e),m=!0)},o(e){X(f.$$.fragment,e),X(h.$$.fragment,e),m=!1},d(e){e&&T(l),Y(f),Y(h),V=!1,$(j)}}}function ie(a,l,t){let{form:b}=l,{name:c}=l,{min:L=1}=l,{max:f}=l,{step:g=1}=l,{value:o=""}=l,{style:N}=l,{decreaseLabel:n=`Decrease ${c} value`}=l,{increaseLabel:E=`Increase ${c} value`}=l;const r=ee();function d(s){ae.call(this,a,s)}const S=()=>{t(0,o=o-1),r("input")};function D(){o=p(this.value),t(0,o)}const h=()=>{t(0,o=o+1),r("input")};return a.$$set=s=>{"form"in s&&t(1,b=s.form),"name"in s&&t(2,c=s.name),"min"in s&&t(3,L=s.min),"max"in s&&t(4,f=s.max),"step"in s&&t(5,g=s.step),"value"in s&&t(0,o=s.value),"style"in s&&t(6,N=s.style),"decreaseLabel"in s&&t(7,n=s.decreaseLabel),"increaseLabel"in s&&t(8,E=s.increaseLabel)},[o,b,c,L,f,g,N,n,E,r,d,S,D,h]}class me extends ne{constructor(l){super(),te(this,l,ie,se,y,{form:1,name:2,min:3,max:4,step:5,value:0,style:6,decreaseLabel:7,increaseLabel:8})}}export{me as N};