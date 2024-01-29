import{s as X,e as b,a as I,c as y,b as E,g as M,z as N,f as h,y as v,D as z,i as T,h as $,B as te,p as se,V as ae,k as le,t as A,v as K,d as H,j as B,n as Q}from"../chunks/scheduler.XoNWsti8.js";import{S as Y,i as Z,c as q,b as J,m as O,t as D,a as S,e as U,g as x,d as ee}from"../chunks/index.tx27_CoG.js";import{p as re}from"../chunks/stores.s-e7Wdux.js";import{l as oe}from"../chunks/logsv2.jKOCppqP.js";import{t as ne}from"../chunks/tryParseJSON.KtkvGy73.js";import{A as ie}from"../chunks/Aside.cjCRsQL-.js";import{J as ce}from"../chunks/JSONTree.9wTpXHGU.js";import{I as ue}from"../chunks/Icon.kG__kIFo.js";function fe(n){let e,t,s,l,a="Copy",c,i,o,f;return t=new ue({props:{icon:n[0]?"check":n[2]?"x":"copy",size:"16"}}),{c(){e=b("button"),q(t.$$.fragment),s=I(),l=b("span"),l.textContent=a,this.h()},l(r){e=y(r,"BUTTON",{title:!0,class:!0,"aria-disabled":!0});var p=E(e);J(t.$$.fragment,p),s=M(p),l=y(p,"SPAN",{class:!0,"data-svelte-h":!0}),N(l)!=="svelte-uxc2fm"&&(l.textContent=a),p.forEach(h),this.h()},h(){v(l,"class","label"),v(e,"title","Copy message to clipboard"),v(e,"class","button compact svelte-1ve7fyv"),v(e,"aria-disabled",c=n[1]||n[0]||n[2]),z(e,"progressing",n[1])},m(r,p){T(r,e,p),O(t,e,null),$(e,s),$(e,l),i=!0,o||(f=te(e,"click",n[3]),o=!0)},p(r,[p]){const u={};p&5&&(u.icon=r[0]?"check":r[2]?"x":"copy"),t.$set(u),(!i||p&7&&c!==(c=r[1]||r[0]||r[2]))&&v(e,"aria-disabled",c),(!i||p&2)&&z(e,"progressing",r[1])},i(r){i||(D(t.$$.fragment,r),i=!0)},o(r){S(t.$$.fragment,r),i=!1},d(r){r&&h(e),U(t),o=!1,f()}}}function me(n,e,t){let{text:s}=e,l=!1,a=!1,c=!1;const i=()=>{t(1,a=!0),navigator.clipboard.writeText(s.toString()).then(()=>{setTimeout(()=>{t(0,l=!0)},150),setTimeout(()=>{t(1,a=!1)},300),setTimeout(()=>{t(1,a=!0)},2300),setTimeout(()=>{t(0,l=!1)},2450),setTimeout(()=>{t(1,a=!1)},2600)}).catch(o=>{t(1,a=!1),t(2,c=!0),console.error(o)})};return n.$$set=o=>{"text"in o&&t(4,s=o.text)},[l,a,c,i,s]}class pe extends Y{constructor(e){super(),Z(this,e,me,fe,X,{text:4})}}function W(n){let e,t,s,l,a,c,i,o;s=new pe({props:{text:n[0].message}});const f=[de,_e],r=[];function p(u,d){return u[2]?0:1}return c=p(n),i=r[c]=f[c](n),{c(){e=b("h2"),t=A(`Message:\r
      `),q(s.$$.fragment),l=I(),a=b("div"),i.c(),this.h()},l(u){e=y(u,"H2",{class:!0});var d=E(e);t=H(d,`Message:\r
      `),J(s.$$.fragment,d),d.forEach(h),l=M(u),a=y(u,"DIV",{class:!0});var k=E(a);i.l(k),k.forEach(h),this.h()},h(){v(e,"class","svelte-14ly6in"),v(a,"class","code svelte-14ly6in"),z(a,"json",n[2])},m(u,d){T(u,e,d),$(e,t),O(s,e,null),T(u,l,d),T(u,a,d),r[c].m(a,null),o=!0},p(u,d){const k={};d&1&&(k.text=u[0].message),s.$set(k);let C=c;c=p(u),c===C?r[c].p(u,d):(x(),S(r[C],1,1,()=>{r[C]=null}),ee(),i=r[c],i?i.p(u,d):(i=r[c]=f[c](u),i.c()),D(i,1),i.m(a,null)),(!o||d&4)&&z(a,"json",u[2])},i(u){o||(D(s.$$.fragment,u),D(i),o=!0)},o(u){S(s.$$.fragment,u),S(i),o=!1},d(u){u&&(h(e),h(l),h(a)),U(s),r[c].d()}}}function _e(n){let e=n[0].message+"",t;return{c(){t=A(e)},l(s){t=H(s,e)},m(s,l){T(s,t,l)},p(s,l){l&1&&e!==(e=s[0].message+"")&&B(t,e)},i:Q,o:Q,d(s){s&&h(t)}}}function de(n){let e,t;return e=new ce({props:{value:n[2],showFullLines:!0}}),{c(){q(e.$$.fragment)},l(s){J(e.$$.fragment,s)},m(s,l){O(e,s,l),t=!0},p(s,l){const a={};l&4&&(a.value=s[2]),e.$set(a)},i(s){t||(D(e.$$.fragment,s),t=!0)},o(s){S(e.$$.fragment,s),t=!1},d(s){U(e,s)}}}function he(n){var V,F,R;let e,t,s="Time:",l,a=new Date(((V=n[0])==null?void 0:V.options_at)/1e3).toLocaleString()+"",c,i,o="Host:",f,r,p=((F=n[0])==null?void 0:F.options_data_url)+"",u,d,k,C,w,_=((R=n[0])==null?void 0:R.message)&&W(n);return{c(){e=b("dl"),t=b("dt"),t.textContent=s,l=b("dd"),c=A(a),i=b("dt"),i.textContent=o,f=b("dd"),r=b("a"),u=A(p),k=I(),_&&_.c(),C=K(),this.h()},l(m){e=y(m,"DL",{class:!0});var g=E(e);t=y(g,"DT",{"data-svelte-h":!0}),N(t)!=="svelte-toke4h"&&(t.textContent=s),l=y(g,"DD",{class:!0});var L=E(l);c=H(L,a),L.forEach(h),i=y(g,"DT",{"data-svelte-h":!0}),N(i)!=="svelte-ylaeay"&&(i.textContent=o),f=y(g,"DD",{class:!0});var j=E(f);r=y(j,"A",{href:!0,class:!0});var P=E(r);u=H(P,p),P.forEach(h),j.forEach(h),g.forEach(h),k=M(m),_&&_.l(m),C=K(),this.h()},h(){var m;v(l,"class","svelte-14ly6in"),v(r,"href",d=(m=n[0])==null?void 0:m.options_data_url),v(r,"class","svelte-14ly6in"),v(f,"class","svelte-14ly6in"),v(e,"class","svelte-14ly6in")},m(m,g){T(m,e,g),$(e,t),$(e,l),$(l,c),$(e,i),$(e,f),$(f,r),$(r,u),T(m,k,g),_&&_.m(m,g),T(m,C,g),w=!0},p(m,g){var L,j,P,G;(!w||g&1)&&a!==(a=new Date(((L=m[0])==null?void 0:L.options_at)/1e3).toLocaleString()+"")&&B(c,a),(!w||g&1)&&p!==(p=((j=m[0])==null?void 0:j.options_data_url)+"")&&B(u,p),(!w||g&1&&d!==(d=(P=m[0])==null?void 0:P.options_data_url))&&v(r,"href",d),(G=m[0])!=null&&G.message?_?(_.p(m,g),g&1&&D(_,1)):(_=W(m),_.c(),D(_,1),_.m(C.parentNode,C)):_&&(x(),S(_,1,1,()=>{_=null}),ee())},i(m){w||(D(_),w=!0)},o(m){S(_),w=!1},d(m){m&&(h(e),h(k),h(C)),_&&_.d(m)}}}function ge(n){var i;let e,t="",s,l,a,c;return a=new ie({props:{title:((i=n[0])==null?void 0:i.type)??"Loading…",closeUrl:"/logsv2?"+n[1].url.searchParams.toString(),$$slots:{default:[he]},$$scope:{ctx:n}}}),{c(){e=b("script"),e.innerHTML=t,l=I(),q(a.$$.fragment),this.h()},l(o){const f=se("svelte-1pgpgj4",document.head);e=y(f,"SCRIPT",{src:!0,"data-manual":!0,"data-svelte-h":!0}),N(e)!=="svelte-6mxszl"&&(e.innerHTML=t),f.forEach(h),l=M(o),J(a.$$.fragment,o),this.h()},h(){ae(e.src,s="/prism.js")||v(e,"src",s),v(e,"data-manual","")},m(o,f){$(document.head,e),T(o,l,f),O(a,o,f),c=!0},p(o,[f]){var p;const r={};f&1&&(r.title=((p=o[0])==null?void 0:p.type)??"Loading…"),f&2&&(r.closeUrl="/logsv2?"+o[1].url.searchParams.toString()),f&21&&(r.$$scope={dirty:f,ctx:o}),a.$set(r)},i(o){c||(D(a.$$.fragment,o),c=!0)},o(o){S(a.$$.fragment,o),c=!1},d(o){o&&h(l),h(e),U(a,o)}}}function ve(n,e,t){let s,l;le(n,re,i=>t(1,l=i));let a={};const c=async()=>{const i={size:1,sql:`select * from logs where _timestamp = ${l.params.id}`};await oe.get(i).then(o=>{t(0,a=o.hits[0])})};return n.$$.update=()=>{n.$$.dirty&1&&t(2,s=a&&ne(a.message)),n.$$.dirty&2&&l.params.id&&c()},[a,l,s]}class we extends Y{constructor(e){super(),Z(this,e,ve,ge,X,{})}}export{we as component};
