import{s as ce,e as g,a as H,c as $,b as w,z as J,g as y,f as m,y as p,E as S,i as T,h as d,k as ie,B as ke,r as Oe,n as F,C as we,t as he,d as fe,j as De,v as Ee,I as Je,O as Ie,L as Le,ad as Be,W as Re,l as Ke,u as je,m as Fe,o as Ge}from"../chunks/scheduler._5CyT-Md.js";import{S as ue,i as pe,t as b,g as B,a as k,d as R,c as U,b as q,m as W,e as D,h as re}from"../chunks/index.6EoUbWX-.js";import{p as Qe}from"../chunks/stores.MZ36E4u3.js";import{t as Xe}from"../chunks/table.PdX-4fmR.js";import{s as K}from"../chunks/state.ZcK67Ij2.js";import{I as j}from"../chunks/Icon.7zknkHEp.js";import{e as xe,u as Ye,o as Ze}from"../chunks/each.DU9NyX4-.js";import{f as oe}from"../chunks/index.W0k0VXDY.js";function be(r){const t=r.slice(),e=typeof window<"u"&&window.location.port!=="4173"&&window.location.port!=="5173"?`http://localhost:${parseInt(window.location.port)}`:"http://localhost:3333";return t[3]=e,t}function ze(r){const t=r.slice(),e=typeof window<"u"&&window.location.port!=="4173"&&window.location.port!=="5173"?`http://localhost:${parseInt(window.location.port)}`:"http://localhost:3333";return t[3]=e,t}function et(r){var n;let t,e=((n=r[0].online)==null?void 0:n.MPKIT_URL.replace("https://",""))+"",s,i;return{c(){t=g("a"),s=he(e),this.h()},l(c){t=$(c,"A",{href:!0});var a=w(t);s=fe(a,e),a.forEach(m),this.h()},h(){var c;p(t,"href",i=(c=r[0].online)==null?void 0:c.MPKIT_URL)},m(c,a){T(c,t,a),d(t,s)},p(c,a){var l,o;a&1&&e!==(e=((l=c[0].online)==null?void 0:l.MPKIT_URL.replace("https://",""))+"")&&De(s,e),a&1&&i!==(i=(o=c[0].online)==null?void 0:o.MPKIT_URL)&&p(t,"href",i)},d(c){c&&m(t)}}}function tt(r){let t;return{c(){t=he("disconnected")},l(e){t=fe(e,"disconnected")},m(e,s){T(e,t,s)},p:F,d(e){e&&m(t)}}}function st(r){let t;return{c(){t=he("connecting…")},l(e){t=fe(e,"connecting…")},m(e,s){T(e,t,s)},p:F,d(e){e&&m(t)}}}function Ae(r){let t,e,s,i,n,c="Database",a,l,o;return s=new j({props:{icon:"database"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(h){t=$(h,"LI",{class:!0});var L=w(t);e=$(L,"A",{href:!0,class:!0});var v=w(e);q(s.$$.fragment,v),i=y(v),n=$(v,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-xe6gx4"&&(n.textContent=c),v.forEach(m),L.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href","/database"),p(e,"class","svelte-uthxgc"),S(e,"active",r[1].url.pathname.startsWith("/database")),p(t,"class","svelte-uthxgc")},m(h,L){T(h,t,L),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0,l||(o=[ke(e,"focus",r[2],{once:!0}),ke(e,"mouseover",r[2],{once:!0})],l=!0)},p(h,L){(!a||L&2)&&S(e,"active",h[1].url.pathname.startsWith("/database"))},i(h){a||(b(s.$$.fragment,h),a=!0)},o(h){k(s.$$.fragment,h),a=!1},d(h){h&&m(t),D(s),l=!1,Oe(o)}}}function He(r){let t,e,s,i,n,c="Users",a;return s=new j({props:{icon:"users"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-o38ms3"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href","/users"),p(e,"class","svelte-uthxgc"),S(e,"active",r[1].url.pathname.startsWith("/users")),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p(l,o){(!a||o&2)&&S(e,"active",l[1].url.pathname.startsWith("/users"))},i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function ye(r){let t,e,s,i,n,c="Logs",a;return s=new j({props:{icon:"log"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-17j55om"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href","/logs"),p(e,"class","svelte-uthxgc"),S(e,"active",r[1].url.pathname.startsWith("/logs")),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p(l,o){(!a||o&2)&&S(e,"active",l[1].url.pathname.startsWith("/logs"))},i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function Se(r){let t,e,s,i,n,c="Background Jobs",a;return s=new j({props:{icon:"backgroundJob"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-fuvc8n"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href","/backgroundJobs"),p(e,"class","svelte-uthxgc"),S(e,"active",r[1].url.pathname.startsWith("/backgroundJobs")),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p(l,o){(!a||o&2)&&S(e,"active",l[1].url.pathname.startsWith("/backgroundJobs"))},i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function Te(r){let t,e,s,i,n,c="Constants",a;return s=new j({props:{icon:"constant"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-s4kqu"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href","/constants"),p(e,"class","svelte-uthxgc"),S(e,"active",r[1].url.pathname.startsWith("/constants")),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p(l,o){(!a||o&2)&&S(e,"active",l[1].url.pathname.startsWith("/constants"))},i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function Ne(r){let t,e,s,i,n,c="Liquid Evaluator",a;return s=new j({props:{icon:"liquid"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-1k272bg"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href",r[3]+"/gui/liquid"),p(e,"class","svelte-uthxgc"),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p:F,i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function Pe(r){let t,e,s,i,n,c="GraphiQL",a;return s=new j({props:{icon:"graphql"}}),{c(){t=g("li"),e=g("a"),U(s.$$.fragment),i=H(),n=g("span"),n.textContent=c,this.h()},l(l){t=$(l,"LI",{class:!0});var o=w(t);e=$(o,"A",{href:!0,class:!0});var h=w(e);q(s.$$.fragment,h),i=y(h),n=$(h,"SPAN",{class:!0,"data-svelte-h":!0}),J(n)!=="svelte-pzl6ct"&&(n.textContent=c),h.forEach(m),o.forEach(m),this.h()},h(){p(n,"class","label svelte-uthxgc"),p(e,"href",r[3]+"/gui/graphql"),p(e,"class","svelte-uthxgc"),p(t,"class","svelte-uthxgc")},m(l,o){T(l,t,o),d(t,e),W(s,e,null),d(e,i),d(e,n),a=!0},p:F,i(l){a||(b(s.$$.fragment,l),a=!0)},o(l){k(s.$$.fragment,l),a=!1},d(l){l&&m(t),D(s)}}}function lt(r){let t,e,s,i,n='<svg class="sign svelte-uthxgc" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" style="enable-background:new 0 0 28.4 24.5" version="1.1" viewBox="0 0 28.4 24.5"><style>.st0,.st1{fill-rule:evenodd;clip-rule:evenodd;fill:#56b146}.st1{fill:#c3233d}.st2,.st3,.st4,.st5,.st6,.st7,.st8,.st9{fill-rule:evenodd;clip-rule:evenodd;fill:#d5246a}.st3,.st4,.st5,.st6,.st7,.st8,.st9{fill:#e77a2b}.st4,.st5,.st6,.st7,.st8,.st9{fill:#fac922}.st5,.st6,.st7,.st8,.st9{fill:#487fb5}.st6,.st7,.st8,.st9{fill:#23477b}.st7,.st8,.st9{fill:#419845}.st8,.st9{fill:#014c3d}.st9{fill:#008b47}</style><path d="M4.7 0h2.4L3.3 3.9 4.7 0z" class="st0"></path><path d="M2 10.4 0 6.8h2v3.6z" class="st1"></path><path d="M2 6.7h4l-4 3.6V6.7z" class="st2"></path><path d="M5.8 13.6 6 6.7l-4 3.6 3.8 3.3z" class="st3"></path><path d="m10.6 10.2-4.8 3.4.2-6.9 4.6 3.5z" class="st4"></path><path d="M13.6 5.7 6 6.7l4.7 3.4 2.9-4.4z" class="st0"></path><path d="M11.9 0 8.8 3.8l4.9 1.8L11.9 0z" class="st1"></path><path d="M19.1 0h-7.3l1.8 5.7L19.1 0z" class="st5"></path><path d="m6 6.7 7.6-1.1-4.8-1.8L6 6.7z" class="st2"></path><path d="M20.5 5.7h-6.9L19.1 0l1.4 5.7z" class="st6"></path><path d="m17 12-6.4-1.8 3-4.5L17 12z" class="st7"></path><path d="M20.5 5.7 17 12l-3.4-6.3h6.9z" class="st8"></path><path d="M22.9 10.2 17 12l3.4-6.3 2.5 4.5z" class="st7"></path><path d="M21.8 13.9 17 12l5.8-1.8-1 3.7z" class="st0"></path><path d="m19.1 0 5.3 4.4-3.9 1.3L19.1 0z" class="st5"></path><path d="m20.5 5.7 3.9-1.3-1.5 5.8-2.4-4.5z" class="st9"></path><path d="m22.9 10.2 5.4 1-6.5 2.6 1.1-3.6z" class="st8"></path><path d="m28.3 11.2.1 5.2-6.5-2.6 6.4-2.6z" class="st7"></path><path d="m21.8 13.9 6.5 2.5-4.9.8-1.6-3.3z" class="st6"></path><path d="m28.4 16.4-2.5 5.7-2.4-4.8 4.9-.9z" class="st0"></path><defs><filter id="Adobe_OpacityMaskFilter" width="10.8" height="7.2" x="15.1" y="17.2" filterUnits="userSpaceOnUse"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask id="a_00000065067817451968692310000014300811633783240372_" width="10.8" height="7.2" x="15.1" y="17.2" maskUnits="userSpaceOnUse"><path d="M15.1 17.2h10.8v7.2H15.1v-7.2z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;filter:url(#Adobe_OpacityMaskFilter)"></path></mask><g style="mask:url(#a_00000065067817451968692310000014300811633783240372_)"><path d="m23.4 17.2 2.4 4.8-3.6-2 1.2-2.8z" class="st5"></path><path d="m25.8 22.1-3.6 2.4V20l3.6 2.1z" class="st6"></path><path d="M22.2 20v4.5l-1.8-2.9 1.8-1.6z" class="st5"></path><path d="M22.2 24.5h-4.8l3-2.9 1.8 2.9z" class="st6"></path><path d="m20.4 21.6-3 2.9.5-2.9h2.5z" class="st1"></path><path d="m17.9 21.6-.5 2.9-2.3-2.9h2.8z" class="st2"></path></g><path d="M17.9 21.6H15l1.7-2 1.2 2z" class="st1"></path><path d="M15.1 21.6v-3.8l1.7 1.8-1.7 2z" class="st3"></path><path d="m24.4 4.4 3.9 6.8-5.4-1 1.5-5.8z" class="st0"></path><path d="m17.9 17.9-.4-1.9 2.9 1.3-2.5.6z" class="st7"></path><path d="m15.1 17.8 2.9.1-.4-1.9-2.5 1.8z" class="st0"></path><path d="m16.7 19.6 1.2-1.7-2.9-.1 1.7 1.8z" class="st4"></path><path d="m6.7 2.5 2.1 1.3-.1-2.6-2 1.3z" class="st7"></path><path d="m6.7 2.5 2-1.3L7.1 0l-.4 2.5z" class="st0"></path><path d="M3.3 3.9 7.1 0l-.4 2.5-3.4 1.4z" class="st9"></path><path d="M8.8 3.8 6.7 2.5l-1 1.4 3.1-.1z" class="st8"></path><path d="m3.3 3.9 3.3-1.4-1 1.4H3.3z" class="st7"></path><path d="m2 6.7 3.7-2.8.3 2.8H2z" class="st3"></path><path d="M5.7 3.9 6 6.7l2.8-2.9-3.1.1z" class="st1"></path><path d="m2 6.7 1.4-2.8h2.4L2 6.7z" class="st4"></path><path d="m11 13.6-1.2 2h3.3l-2.1-2z" class="st7"></path><path d="m8.5 13.6 1.4 2 1.2-2H8.5z" class="st0"></path><path d="m10.6 10.2.4 3.4 6-1.6-6.4-1.8z" class="st8"></path><path d="M13.2 15.6 17 12l-6 1.6 2.2 2z" class="st9"></path></svg>',c,a,l,o='<svg class="logotype svelte-uthxgc" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 135 22.2" viewBox="0 0 135 22.2" fill="currentColor"><path d="m96.2 4.3-1.4 1.3-1.4-1.3h-3.1l-1.7 2-2-2v13.4h3.9V8.4h1.8l.6 1v8.3h3.9l-.4-.5.4.5V9.4l.6-1h1.2l.5 1v8.3h4V7.3l-3.1-3h-3.8zM9.5 12.2l-1.4 1.4H4V8.4h4.1L9.5 10v2.2zM6.8 4.4H4L2 6.3 0 4.4v17.8h4v-4.6l-.1-.1.1.1h5.7l3.5-3.1V8L9.6 4.4H6.8zm34.7 8.2V9.1h4.2v-4h-4.2l-2-2.2-2-2v13.7l3.9 3h5v-4h-3.3l-1.6-1zm-10.4 1.1h-4.2l-1.5-1.5V9.9l1.5-1.3h4.2v5.1zm0-9h-5.7l-3.5 3V14l3.5 3.6h5.7l2-1.9 2 1.9v-9l-2-1.9-2-2zm46.8-.1-2 2.1-2-2.1v13h4v-9h4.2l2.5 2.6V6.7L82 4.6h-4.1zM48.4 3.1v14.5h4v-4.8h4.2V8.9h-4.2V5.4L54.1 4h3.3V0h-5l-4 3.1zm-31.1-.8-2-2.2v17.6h4V4.5l-2-2.2zm50.8 9.8-1.5 1.6h-2.7l-1.5-1.6V9.9l1.5-1.3h2.7l1.5 1.3v2.2zm-5.8-7.5-3.6 3V14l3.6 3.6h6l3.6-3.6V7.6l-3.6-3h-6zm52.9 4.1V12l-1.4 2h-3l-1.4-2V5.5l1.4-2h3l1.4 2v3.2zM109.3 0l-3.7 3.5V14l3.7 3.5h6L119 14V3.5L115.3 0h-6zm22.5 7.1-.2-.1v.1h-.1V7h-5.2l-1.1-1V4.7l1.1-1.2h3.3l2.1 1.8 3.2-1.8-3.6-3.5h-6l-3.7 3.5v4.3l3.4 2.6h4.8l1.4 1v1.4l-1.4 1.2h-3l-2.1-1.8-3.2 1.8 3.7 3.5h6L135 14V9.7l-3.2-2.6z"></path></svg> <span class="label svelte-uthxgc">platformOS development tools</span>',h,L,v,f,u,O=r[0].header.includes("database"),Q,de=r[0].header.includes("users"),X,me=r[0].header.includes("logs"),Y,ve=r[0].header.includes("backgroundJobs"),Z,_e=r[0].header.includes("constants"),ee,ge=r[0].header.includes("liquid"),te,$e=r[0].header.includes("graphiql"),G;function Me(_,z){return _[0].online===void 0?st:_[0].online===!1?tt:et}let se=Me(r),P=se(r),M=O&&Ae(r),C=de&&He(r),V=me&&ye(r),E=ve&&Se(r),I=_e&&Te(r),x=ge&&Ne(ze(r)),A=$e&&Pe(be(r));return{c(){t=g("header"),e=g("div"),s=g("div"),i=g("a"),i.innerHTML=n,c=H(),a=g("h1"),l=g("a"),l.innerHTML=o,h=H(),L=g("span"),P.c(),v=H(),f=g("nav"),u=g("ul"),M&&M.c(),Q=H(),C&&C.c(),X=H(),V&&V.c(),Y=H(),E&&E.c(),Z=H(),I&&I.c(),ee=H(),x&&x.c(),te=H(),A&&A.c(),this.h()},l(_){t=$(_,"HEADER",{class:!0});var z=w(t);e=$(z,"DIV",{class:!0});var le=w(e);s=$(le,"DIV",{class:!0});var ae=w(s);i=$(ae,"A",{href:!0,"data-svelte-h":!0}),J(i)!=="svelte-1nhlu7c"&&(i.innerHTML=n),c=y(ae),a=$(ae,"H1",{class:!0});var ne=w(a);l=$(ne,"A",{href:!0,class:!0,"data-svelte-h":!0}),J(l)!=="svelte-z2lbz1"&&(l.innerHTML=o),h=y(ne),L=$(ne,"SPAN",{class:!0});var Ce=w(L);P.l(Ce),Ce.forEach(m),ne.forEach(m),ae.forEach(m),v=y(le),f=$(le,"NAV",{class:!0});var Ve=w(f);u=$(Ve,"UL",{class:!0});var N=w(u);M&&M.l(N),Q=y(N),C&&C.l(N),X=y(N),V&&V.l(N),Y=y(N),E&&E.l(N),Z=y(N),I&&I.l(N),ee=y(N),x&&x.l(N),te=y(N),A&&A.l(N),N.forEach(m),Ve.forEach(m),le.forEach(m),z.forEach(m),this.h()},h(){p(i,"href","/"),p(l,"href","/"),p(l,"class","svelte-uthxgc"),p(L,"class","instance svelte-uthxgc"),S(L,"offline",!r[0].online),p(a,"class","svelte-uthxgc"),p(s,"class","logo svelte-uthxgc"),p(u,"class","svelte-uthxgc"),p(f,"class","svelte-uthxgc"),p(e,"class","wrapper svelte-uthxgc"),p(t,"class","svelte-uthxgc")},m(_,z){T(_,t,z),d(t,e),d(e,s),d(s,i),d(s,c),d(s,a),d(a,l),d(a,h),d(a,L),P.m(L,null),d(e,v),d(e,f),d(f,u),M&&M.m(u,null),d(u,Q),C&&C.m(u,null),d(u,X),V&&V.m(u,null),d(u,Y),E&&E.m(u,null),d(u,Z),I&&I.m(u,null),d(u,ee),x&&x.m(u,null),d(u,te),A&&A.m(u,null),G=!0},p(_,[z]){se===(se=Me(_))&&P?P.p(_,z):(P.d(1),P=se(_),P&&(P.c(),P.m(L,null))),(!G||z&1)&&S(L,"offline",!_[0].online),z&1&&(O=_[0].header.includes("database")),O?M?(M.p(_,z),z&1&&b(M,1)):(M=Ae(_),M.c(),b(M,1),M.m(u,Q)):M&&(B(),k(M,1,1,()=>{M=null}),R()),z&1&&(de=_[0].header.includes("users")),de?C?(C.p(_,z),z&1&&b(C,1)):(C=He(_),C.c(),b(C,1),C.m(u,X)):C&&(B(),k(C,1,1,()=>{C=null}),R()),z&1&&(me=_[0].header.includes("logs")),me?V?(V.p(_,z),z&1&&b(V,1)):(V=ye(_),V.c(),b(V,1),V.m(u,Y)):V&&(B(),k(V,1,1,()=>{V=null}),R()),z&1&&(ve=_[0].header.includes("backgroundJobs")),ve?E?(E.p(_,z),z&1&&b(E,1)):(E=Se(_),E.c(),b(E,1),E.m(u,Z)):E&&(B(),k(E,1,1,()=>{E=null}),R()),z&1&&(_e=_[0].header.includes("constants")),_e?I?(I.p(_,z),z&1&&b(I,1)):(I=Te(_),I.c(),b(I,1),I.m(u,ee)):I&&(B(),k(I,1,1,()=>{I=null}),R()),z&1&&(ge=_[0].header.includes("liquid")),ge?x?(x.p(ze(_),z),z&1&&b(x,1)):(x=Ne(ze(_)),x.c(),b(x,1),x.m(u,te)):x&&(B(),k(x,1,1,()=>{x=null}),R()),z&1&&($e=_[0].header.includes("graphiql")),$e?A?(A.p(be(_),z),z&1&&b(A,1)):(A=Pe(be(_)),A.c(),b(A,1),A.m(u,null)):A&&(B(),k(A,1,1,()=>{A=null}),R())},i(_){G||(b(M),b(C),b(V),b(E),b(I),b(x),b(A),G=!0)},o(_){k(M),k(C),k(V),k(E),k(I),k(x),k(A),G=!1},d(_){_&&m(t),P.d(),M&&M.d(),C&&C.d(),V&&V.d(),E&&E.d(),I&&I.d(),x&&x.d(),A&&A.d()}}}function at(r,t,e){let s,i;return ie(r,K,c=>e(0,s=c)),ie(r,Qe,c=>e(1,i=c)),[s,i,async()=>{s.tables.length||we(K,s.tables=await Xe.get(),s)}]}class nt extends ue{constructor(t){super(),pe(this,t,at,lt,ce,{})}}function Ue(r){let t,e="Disconnected from the instance";return{c(){t=g("div"),t.textContent=e,this.h()},l(s){t=$(s,"DIV",{class:!0,"data-svelte-h":!0}),J(t)!=="svelte-1k8ucix"&&(t.textContent=e),this.h()},h(){p(t,"class","connectionIndicator svelte-1cyr69k"),S(t,"offline",r[0].online===!1)},m(s,i){T(s,t,i)},p(s,i){i&1&&S(t,"offline",s[0].online===!1)},d(s){s&&m(t)}}}function it(r){let t,e=r[0].online===!1&&Ue(r);return{c(){e&&e.c(),t=Ee()},l(s){e&&e.l(s),t=Ee()},m(s,i){e&&e.m(s,i),T(s,t,i)},p(s,[i]){s[0].online===!1?e?e.p(s,i):(e=Ue(s),e.c(),e.m(t.parentNode,t)):e&&(e.d(1),e=null)},i:F,o:F,d(s){s&&m(t),e&&e.d(s)}}}let rt=7e3;function ot(r,t,e){let s;ie(r,K,c=>e(0,s=c));let i;Je(async()=>(n(),i=setInterval(n,rt),()=>clearInterval(i)));const n=async()=>{if(document.visibilityState!=="hidden"){const c=typeof window<"u"&&window.location.port!=="4173"&&window.location.port!=="5173"?`http://localhost:${parseInt(window.location.port)}`:"http://localhost:3333";fetch(`${c}/info`).then(a=>a.json()).then(a=>{a&&we(K,s.online=a,s)}).catch(a=>{we(K,s.online=!1,s)})}};return[s]}class ct extends ue{constructor(t){super(),pe(this,t,ot,it,ce,{})}}function qe(r,t,e){const s=r.slice();return s[4]=t[e],s}function We(r,t){let e,s=t[4].message+"",i,n,c,a,l,o,h,L;a=new j({props:{icon:"x",size:"10"}});function v(){return t[2](t[4])}return{key:r,first:null,c(){e=g("div"),i=he(s),n=H(),c=g("button"),U(a.$$.fragment),this.h()},l(f){e=$(f,"DIV",{class:!0});var u=w(e);i=fe(u,s),n=y(u),c=$(u,"BUTTON",{class:!0});var O=w(c);q(a.$$.fragment,O),O.forEach(m),u.forEach(m),this.h()},h(){p(c,"class","svelte-14ahhss"),p(e,"class","notification svelte-14ahhss"),S(e,"success",t[4].type==="success"),S(e,"error",t[4].type==="error"),this.first=e},m(f,u){T(f,e,u),d(e,i),d(e,n),d(e,c),W(a,c,null),o=!0,h||(L=ke(c,"click",v),h=!0)},p(f,u){t=f,(!o||u&2)&&s!==(s=t[4].message+"")&&De(i,s),(!o||u&2)&&S(e,"success",t[4].type==="success"),(!o||u&2)&&S(e,"error",t[4].type==="error")},i(f){o||(b(a.$$.fragment,f),f&&Le(()=>{o&&(l||(l=re(e,oe,{duration:100},!0)),l.run(1))}),o=!0)},o(f){k(a.$$.fragment,f),f&&(l||(l=re(e,oe,{duration:100},!1)),l.run(0)),o=!1},d(f){f&&m(e),D(a),f&&l&&l.end(),h=!1,L()}}}function ht(r){let t,e=[],s=new Map,i,n,c,a,l,o,h=xe(r[1].notifications);const L=v=>v[4].id;for(let v=0;v<h.length;v+=1){let f=qe(r,h,v),u=L(f);s.set(u,e[v]=We(u,f))}return c=new ct({}),{c(){t=g("div");for(let v=0;v<e.length;v+=1)e[v].c();i=H(),n=g("div"),U(c.$$.fragment),this.h()},l(v){t=$(v,"DIV",{class:!0,"aria-live":!0,style:!0});var f=w(t);for(let O=0;O<e.length;O+=1)e[O].l(f);i=y(f),n=$(f,"DIV",{class:!0});var u=w(n);q(c.$$.fragment,u),u.forEach(m),f.forEach(m),this.h()},h(){p(n,"class","notification error svelte-14ahhss"),S(n,"disabled",r[1].online!==!1),p(t,"class","container svelte-14ahhss"),p(t,"aria-live","assertive"),Ie(t,"--height","-"+r[0]+"px"),Le(()=>r[3].call(t))},m(v,f){T(v,t,f);for(let u=0;u<e.length;u+=1)e[u]&&e[u].m(t,null);d(t,i),d(t,n),W(c,n,null),l=Be(t,r[3].bind(t)),o=!0},p(v,[f]){f&2&&(h=xe(v[1].notifications),B(),e=Ye(e,f,L,1,v,h,s,t,Ze,We,i,qe),R()),(!o||f&2)&&S(n,"disabled",v[1].online!==!1),(!o||f&1)&&Ie(t,"--height","-"+v[0]+"px")},i(v){if(!o){for(let f=0;f<h.length;f+=1)b(e[f]);b(c.$$.fragment,v),v&&Le(()=>{o&&(a||(a=re(n,oe,{duration:100},!0)),a.run(1))}),o=!0}},o(v){for(let f=0;f<e.length;f+=1)k(e[f]);k(c.$$.fragment,v),v&&(a||(a=re(n,oe,{duration:100},!1)),a.run(0)),o=!1},d(v){v&&m(t);for(let f=0;f<e.length;f+=1)e[f].d();D(c),v&&a&&a.end(),l()}}}function ft(r,t,e){let s;ie(r,K,a=>e(1,s=a));let i=0;Re(()=>{s.notifications.forEach(a=>{a.type==="success"&&!a.timeout&&(a.timeout=setTimeout(()=>K.notification.remove(a.id),7e3))})});const n=a=>K.notification.remove(a.id);function c(){i=this.clientHeight,e(0,i)}return[i,s,n,c]}class ut extends ue{constructor(t){super(),pe(this,t,ft,ht,ce,{})}}function pt(r){let t,e,s,i,n;t=new nt({});const c=r[1].default,a=Ke(c,r,r[0],null);return i=new ut({}),{c(){U(t.$$.fragment),e=H(),a&&a.c(),s=H(),U(i.$$.fragment)},l(l){q(t.$$.fragment,l),e=y(l),a&&a.l(l),s=y(l),q(i.$$.fragment,l)},m(l,o){W(t,l,o),T(l,e,o),a&&a.m(l,o),T(l,s,o),W(i,l,o),n=!0},p(l,[o]){a&&a.p&&(!n||o&1)&&je(a,c,l,l[0],n?Ge(c,l[0],o,null):Fe(l[0]),null)},i(l){n||(b(t.$$.fragment,l),b(a,l),b(i.$$.fragment,l),n=!0)},o(l){k(t.$$.fragment,l),k(a,l),k(i.$$.fragment,l),n=!1},d(l){l&&(m(e),m(s)),D(t,l),a&&a.d(l),D(i,l)}}}function dt(r,t,e){let{$$slots:s={},$$scope:i}=t;return r.$$set=n=>{"$$scope"in n&&e(0,i=n.$$scope)},[i,s]}class wt extends ue{constructor(t){super(),pe(this,t,dt,pt,ce,{})}}export{wt as component};