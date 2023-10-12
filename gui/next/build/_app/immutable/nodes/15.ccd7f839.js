import{s as $e,a as z,I as Ie,d as m,c as A,i as b,v as Te,f as v,l as P,e as U,g as h,h as k,m as q,j as D,u,n as F,r as O}from"../chunks/scheduler.e2aa1391.js";import{S as Se,i as we,b as Le,d as Ve,m as je,a as Ue,t as Pe,e as qe}from"../chunks/index.12b5c620.js";import{p as ze}from"../chunks/stores.e84b517d.js";import{u as Ae}from"../chunks/user.1d284359.js";import{A as Fe}from"../chunks/Aside.48de29ae.js";function ve(r){var d;let e,l=((d=r[1])==null?void 0:d.id)+"",n;return{c(){e=P("ID: "),n=P(l)},l(t){e=q(t,"ID: "),n=q(t,l)},m(t,o){b(t,e,o),b(t,n,o)},p(t,o){var i;o&2&&l!==(l=((i=t[1])==null?void 0:i.id)+"")&&F(n,l)},d(t){t&&(m(e),m(n))}}}function he(r){var o;let e,l="External ID:",n,d=((o=r[1])==null?void 0:o.external_id)+"",t;return{c(){e=v("dt"),e.textContent=l,n=v("dd"),t=P(d),this.h()},l(i){e=h(i,"DT",{class:!0,"data-svelte-h":!0}),O(e)!=="svelte-1xroeo8"&&(e.textContent=l),n=h(i,"DD",{class:!0});var f=k(n);t=q(f,d),f.forEach(m),this.h()},h(){D(e,"class","svelte-9t2ood"),D(n,"class","svelte-9t2ood")},m(i,f){b(i,e,f),b(i,n,f),u(n,t)},p(i,f){var s;f&2&&d!==(d=((s=i[1])==null?void 0:s.external_id)+"")&&F(t,d)},d(i){i&&(m(e),m(n))}}}function pe(r){var o;let e,l="JWT:",n,d=((o=r[1])==null?void 0:o.jwt_token)+"",t;return{c(){e=v("dt"),e.textContent=l,n=v("dd"),t=P(d),this.h()},l(i){e=h(i,"DT",{class:!0,"data-svelte-h":!0}),O(e)!=="svelte-l7ssfz"&&(e.textContent=l),n=h(i,"DD",{class:!0});var f=k(n);t=q(f,d),f.forEach(m),this.h()},h(){D(e,"class","svelte-9t2ood"),D(n,"class","svelte-9t2ood")},m(i,f){b(i,e,f),b(i,n,f),u(n,t)},p(i,f){var s;f&2&&d!==(d=((s=i[1])==null?void 0:s.jwt_token)+"")&&F(t,d)},d(i){i&&(m(e),m(n))}}}function De(r){var f;let e,l,n="First name:",d,t,o=((f=r[1])==null?void 0:f.name)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-8iyt8l"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.name)+"")&&F(i,o)},d(s){s&&m(e)}}}function ge(r){var f;let e,l,n="First name:",d,t,o=((f=r[1])==null?void 0:f.first_name)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-8iyt8l"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.first_name)+"")&&F(i,o)},d(s){s&&m(e)}}}function ke(r){var f;let e,l,n="Middle name:",d,t,o=((f=r[1])==null?void 0:f.middle_name)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-1eitmmc"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.middle_name)+"")&&F(i,o)},d(s){s&&m(e)}}}function be(r){var f;let e,l,n="Last name:",d,t,o=((f=r[1])==null?void 0:f.last_name)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-1sn8cp"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.last_name)+"")&&F(i,o)},d(s){s&&m(e)}}}function Ce(r){var f;let e,l,n="Slug:",d,t,o=((f=r[1])==null?void 0:f.slug)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-q9mm1z"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.slug)+"")&&F(i,o)},d(s){s&&m(e)}}}function Ee(r){var f;let e,l,n="Language:",d,t,o=((f=r[1])==null?void 0:f.language)+"",i;return{c(){e=v("div"),l=v("dt"),l.textContent=n,d=z(),t=v("dd"),i=P(o),this.h()},l(s){e=h(s,"DIV",{class:!0});var a=k(e);l=h(a,"DT",{"data-svelte-h":!0}),O(l)!=="svelte-14i3pp2"&&(l.textContent=n),d=A(a),t=h(a,"DD",{class:!0});var c=k(t);i=q(c,o),c.forEach(m),a.forEach(m),this.h()},h(){D(t,"class","svelte-9t2ood"),D(e,"class","svelte-9t2ood")},m(s,a){b(s,e,a),u(e,l),u(e,d),u(e,t),u(t,i)},p(s,a){var c;a&2&&o!==(o=((c=s[1])==null?void 0:c.language)+"")&&F(i,o)},d(s){s&&m(e)}}}function Me(r){var Y,Z,y,x,ee,te,le,se,ae,ie,ne;let e,l,n,d,t=new Date((Y=r[1])==null?void 0:Y.created_at).toLocaleDateString(void 0,{})+"",o,i,f=new Date((Z=r[1])==null?void 0:Z.created_at).toLocaleTimeString(void 0,{})+"",s,a,c,j,J,H,p,K,N,Q,R,X,C=((y=r[1])==null?void 0:y.id)&&ve(r),E=((x=r[1])==null?void 0:x.external_id)&&he(r),$=((ee=r[1])==null?void 0:ee.jwt_token)&&pe(r),I=((te=r[1])==null?void 0:te.name)&&De(r),T=((le=r[1])==null?void 0:le.first_name)&&ge(r),S=((se=r[1])==null?void 0:se.middle_name)&&ke(r),w=((ae=r[1])==null?void 0:ae.last_name)&&be(r),L=((ie=r[1])==null?void 0:ie.slug)&&Ce(r),V=((ne=r[1])==null?void 0:ne.language)&&Ee(r);return{c(){e=v("div"),l=v("div"),C&&C.c(),n=z(),d=v("time"),o=P(t),i=z(),s=P(f),c=z(),j=v("dl"),E&&E.c(),J=U(),$&&$.c(),H=z(),p=v("dl"),I&&I.c(),K=U(),T&&T.c(),N=U(),S&&S.c(),Q=U(),w&&w.c(),R=U(),L&&L.c(),X=U(),V&&V.c(),this.h()},l(_){e=h(_,"DIV",{});var g=k(e);l=h(g,"DIV",{class:!0});var W=k(l);C&&C.l(W),n=A(W),d=h(W,"TIME",{datetime:!0,class:!0});var B=k(d);o=q(B,t),i=A(B),s=q(B,f),B.forEach(m),W.forEach(m),g.forEach(m),c=A(_),j=h(_,"DL",{class:!0});var G=k(j);E&&E.l(G),J=U(),$&&$.l(G),G.forEach(m),H=A(_),p=h(_,"DL",{class:!0});var M=k(p);I&&I.l(M),K=U(),T&&T.l(M),N=U(),S&&S.l(M),Q=U(),w&&w.l(M),R=U(),L&&L.l(M),X=U(),V&&V.l(M),M.forEach(m),this.h()},h(){var _;D(d,"datetime",a=(_=r[1])==null?void 0:_.created_at),D(d,"class","svelte-9t2ood"),D(l,"class","info svelte-9t2ood"),D(j,"class","tech svelte-9t2ood"),D(p,"class","personal svelte-9t2ood")},m(_,g){b(_,e,g),u(e,l),C&&C.m(l,null),u(l,n),u(l,d),u(d,o),u(d,i),u(d,s),b(_,c,g),b(_,j,g),E&&E.m(j,null),u(j,J),$&&$.m(j,null),b(_,H,g),b(_,p,g),I&&I.m(p,null),u(p,K),T&&T.m(p,null),u(p,N),S&&S.m(p,null),u(p,Q),w&&w.m(p,null),u(p,R),L&&L.m(p,null),u(p,X),V&&V.m(p,null)},p(_,g){var W,B,G,M,de,oe,fe,re,_e,ce,ue,me;(W=_[1])!=null&&W.id?C?C.p(_,g):(C=ve(_),C.c(),C.m(l,n)):C&&(C.d(1),C=null),g&2&&t!==(t=new Date((B=_[1])==null?void 0:B.created_at).toLocaleDateString(void 0,{})+"")&&F(o,t),g&2&&f!==(f=new Date((G=_[1])==null?void 0:G.created_at).toLocaleTimeString(void 0,{})+"")&&F(s,f),g&2&&a!==(a=(M=_[1])==null?void 0:M.created_at)&&D(d,"datetime",a),(de=_[1])!=null&&de.external_id?E?E.p(_,g):(E=he(_),E.c(),E.m(j,J)):E&&(E.d(1),E=null),(oe=_[1])!=null&&oe.jwt_token?$?$.p(_,g):($=pe(_),$.c(),$.m(j,null)):$&&($.d(1),$=null),(fe=_[1])!=null&&fe.name?I?I.p(_,g):(I=De(_),I.c(),I.m(p,K)):I&&(I.d(1),I=null),(re=_[1])!=null&&re.first_name?T?T.p(_,g):(T=ge(_),T.c(),T.m(p,N)):T&&(T.d(1),T=null),(_e=_[1])!=null&&_e.middle_name?S?S.p(_,g):(S=ke(_),S.c(),S.m(p,Q)):S&&(S.d(1),S=null),(ce=_[1])!=null&&ce.last_name?w?w.p(_,g):(w=be(_),w.c(),w.m(p,R)):w&&(w.d(1),w=null),(ue=_[1])!=null&&ue.slug?L?L.p(_,g):(L=Ce(_),L.c(),L.m(p,X)):L&&(L.d(1),L=null),(me=_[1])!=null&&me.language?V?V.p(_,g):(V=Ee(_),V.c(),V.m(p,null)):V&&(V.d(1),V=null)},d(_){_&&(m(e),m(c),m(j),m(H),m(p)),C&&C.d(),E&&E.d(),$&&$.d(),I&&I.d(),T&&T.d(),S&&S.d(),w&&w.d(),L&&L.d(),V&&V.d()}}}function Oe(r){var t,o,i;let e,l,n,d;return document.title=e=(((t=r[1])==null?void 0:t.email)??"Users")+" | platformOS",n=new Fe({props:{title:((o=r[1])==null?void 0:o.email)??((i=r[1])==null?void 0:i.id)??"Loading…",closeUrl:"/users?"+r[0].url.searchParams.toString(),$$slots:{default:[Me]},$$scope:{ctx:r}}}),{c(){l=z(),Le(n.$$.fragment)},l(f){Ie("svelte-1t64gtk",document.head).forEach(m),l=A(f),Ve(n.$$.fragment,f)},m(f,s){b(f,l,s),je(n,f,s),d=!0},p(f,[s]){var c,j,J;(!d||s&2)&&e!==(e=(((c=f[1])==null?void 0:c.email)??"Users")+" | platformOS")&&(document.title=e);const a={};s&2&&(a.title=((j=f[1])==null?void 0:j.email)??((J=f[1])==null?void 0:J.id)??"Loading…"),s&1&&(a.closeUrl="/users?"+f[0].url.searchParams.toString()),s&10&&(a.$$scope={dirty:s,ctx:f}),n.$set(a)},i(f){d||(Ue(n.$$.fragment,f),d=!0)},o(f){Pe(n.$$.fragment,f),d=!1},d(f){f&&m(l),qe(n,f)}}}function Je(r,e,l){let n;Te(r,ze,o=>l(0,n=o));let d;const t=async()=>{const o={attribute:"id",value:n.params.id};await Ae.get(o).then(i=>{l(1,d=i.results[0])})};return r.$$.update=()=>{r.$$.dirty&1&&n.params.id&&t()},[n,d]}class Ne extends Se{constructor(e){super(),we(this,e,Je,Oe,$e,{})}}export{Ne as component};
