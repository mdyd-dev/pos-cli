import{s as ea,a as i,f as n,l as k,J as ta,d as a,c as o,g as s,h as r,r as b,m as U,j as t,u as T,k as yl,i as xl,v as e,x as C,n as Et,y as na,w as sa,A as ul}from"../chunks/scheduler.C43H4T0F.js";import{S as la,i as aa,b as f,d as h,m as v,a as m,t as _,e as $}from"../chunks/index.JUyE3YTa.js";import{I as g}from"../chunks/Icon.HnzAYZiZ.js";import{s as Yn}from"../chunks/state.FTiieUpz.js";import{t as ra}from"../chunks/table.2qc5Sp1a.js";function ia(c){let qe,ie,p,L,P,E,w,oe,ln,ce,Zn="Database",an,ue,yn='<li class="svelte-13p3n7t">Inspect tables and records</li> <li class="svelte-13p3n7t">Create, edit or delete records</li> <li class="svelte-13p3n7t">Filter and find any record</li>',rn,y,Ie,B,de,on,pe,I="Show more information about Database tool",De,kt,J,fe,xn,Ne,Kt=c[1].header.includes("database")?"Unpin Database from":"Pin Database to",cn,es,un,ts,D,x,Ut,ze,ns,Se,dl="Users",ss,Me,pl='<li class="svelte-13p3n7t">Inspect registered users and their personal data</li>',ls,he,Ct,R,Ae,as,Be,fl="Show more information about Users tool",rs,wt,H,ve,is,Je,Wt=c[1].header.includes("users")?"Unpin Users from":"Pin Users to",dn,os,pn,cs,N,ee,Pt,He,us,Oe,hl="Logs",ds,Fe,vl='<li class="svelte-13p3n7t">View system logs</li> <li class="svelte-13p3n7t">Inspect logs you&#39;ve outputted yourself</li> <li class="svelte-13p3n7t">Debug Liquid or GraphQL errors</li>',ps,j,Qe,ml='<a href="/logsv2" style="padding-inline: .5em; font-size: .75rem; position: relative; top: -2px;">V2 β</a>',fs,Tt,K,Ge,hs,Ve,_l="Show more information about Logs tool",vs,qt,O,me,ms,Re,Xt=c[1].header.includes("logs")?"Unpin Logs from":"Pin Logs to",fn,_s,hn,$s,z,te,It,je,gs,Ke,$l="Background Jobs",bs,We,gl='<li class="svelte-13p3n7t">List scheduled background jobs</li> <li class="svelte-13p3n7t">Debug background jobs that failed to run</li>',Ls,_e,Dt,W,Xe,Es,Ye,bl="Show more information about Background Jobs tool",ks,Nt,F,$e,Us,Ze,Yt=c[1].header.includes("backgroundJobs")?"Unpin Background Jobs from":"Pin Background Jobs to",vn,Cs,mn,ws,S,ne,zt,ye,Ps,xe,Ll="Constants",Ts,et,El='<li class="svelte-13p3n7t">Check all constants in one place</li> <li class="svelte-13p3n7t">Create new constants</li> <li class="svelte-13p3n7t">Edit or delete existing ones</li>',qs,ge,St,X,tt,Is,nt,kl="Show more information about Constants tool",Ds,Mt,Q,be,Ns,st,Zt=c[1].header.includes("constants")?"Unpin Constants from":"Pin Constants to",_n,zs,$n,Ss,Le,M,se,lt,at,Ms,rt,Ul="Liquid Evaluator",As,it,Cl='<li class="svelte-13p3n7t">Run Liquid code against your instance</li> <li class="svelte-13p3n7t">Test Liquid logic</li> <li class="svelte-13p3n7t">Quickly prototype your ideas</li>',Bs,Ee,At,Y,ot,Js,ct,wl="Show more information about Liquid Evaluator",Hs,Bt,G,ke,Os,ut,yt=c[1].header.includes("liquid")?"Unpin Liquid Evaluator from":"Pin Liquid Evaluator to",gn,Fs,bn,Qs,A,le,dt,pt,Gs,ft,Pl="GraphiQL",Vs,ht,Tl='<li class="svelte-13p3n7t">Run GraphQL against your instance</li> <li class="svelte-13p3n7t">Explore documentation</li> <li class="svelte-13p3n7t">Quickly prototype your queries and mutations</li>',Rs,Ue,Jt,Z,vt,js,mt,ql="Show more information about GraphiQL",Ks,Ht,V,Ce,Ws,_t,xt=c[1].header.includes("graphiql")?"Unpin GraphiQL from":"Pin GraphiQL to",Ln,Xs,En,Ys,we,en,Pe,$t,Zs,ys,tn,Te,gt,xs,d,el,Il;return document.title=qe="platformOS"+(c[1].online?.MPKIT_URL?": "+c[1].online.MPKIT_URL.replace("https://",""):""),oe=new g({props:{icon:"database",size:"48"}}),de=new g({props:{icon:"info",size:"14"}}),fe=new g({props:{icon:c[1].header.includes("database")?"pinFilled":"pin",size:"14"}}),ze=new g({props:{icon:"users",size:"48"}}),Ae=new g({props:{icon:"info",size:"14"}}),ve=new g({props:{icon:c[1].header.includes("users")?"pinFilled":"pin",size:"14"}}),He=new g({props:{icon:"log",size:"48"}}),Ge=new g({props:{icon:"info",size:"14"}}),me=new g({props:{icon:c[1].header.includes("logs")?"pinFilled":"pin",size:"14"}}),je=new g({props:{icon:"backgroundJob",size:"48"}}),Xe=new g({props:{icon:"info",size:"14"}}),$e=new g({props:{icon:c[1].header.includes("backgroundJobs")?"pinFilled":"pin",size:"14"}}),ye=new g({props:{icon:"constant",size:"48"}}),tt=new g({props:{icon:"info",size:"14"}}),be=new g({props:{icon:c[1].header.includes("constants")?"pinFilled":"pin",size:"14"}}),at=new g({props:{icon:"liquid",size:"48"}}),ot=new g({props:{icon:"info",size:"14"}}),ke=new g({props:{icon:c[1].header.includes("liquid")?"pinFilled":"pin",size:"14"}}),pt=new g({props:{icon:"graphql",size:"48"}}),vt=new g({props:{icon:"info",size:"14"}}),Ce=new g({props:{icon:c[1].header.includes("graphiql")?"pinFilled":"pin",size:"14"}}),$t=new g({props:{icon:"book"}}),gt=new g({props:{icon:"serverSettings"}}),{c(){ie=i(),p=n("nav"),L=n("ul"),P=n("li"),E=n("a"),w=n("div"),f(oe.$$.fragment),ln=i(),ce=n("h2"),ce.textContent=Zn,an=i(),ue=n("ul"),ue.innerHTML=yn,rn=i(),y=n("ul"),Ie=n("li"),B=n("button"),f(de.$$.fragment),on=i(),pe=n("span"),pe.textContent=I,De=i(),kt=n("li"),J=n("button"),f(fe.$$.fragment),xn=i(),Ne=n("span"),cn=k(Kt),es=k(" header menu"),ts=i(),D=n("li"),x=n("a"),Ut=n("div"),f(ze.$$.fragment),ns=i(),Se=n("h2"),Se.textContent=dl,ss=i(),Me=n("ul"),Me.innerHTML=pl,ls=i(),he=n("ul"),Ct=n("li"),R=n("button"),f(Ae.$$.fragment),as=i(),Be=n("span"),Be.textContent=fl,rs=i(),wt=n("li"),H=n("button"),f(ve.$$.fragment),is=i(),Je=n("span"),dn=k(Wt),os=k(" header menu"),cs=i(),N=n("li"),ee=n("a"),Pt=n("div"),f(He.$$.fragment),us=i(),Oe=n("h2"),Oe.textContent=hl,ds=i(),Fe=n("ul"),Fe.innerHTML=vl,ps=i(),j=n("ul"),Qe=n("li"),Qe.innerHTML=ml,fs=i(),Tt=n("li"),K=n("button"),f(Ge.$$.fragment),hs=i(),Ve=n("span"),Ve.textContent=_l,vs=i(),qt=n("li"),O=n("button"),f(me.$$.fragment),ms=i(),Re=n("span"),fn=k(Xt),_s=k(" header menu"),$s=i(),z=n("li"),te=n("a"),It=n("div"),f(je.$$.fragment),gs=i(),Ke=n("h2"),Ke.textContent=$l,bs=i(),We=n("ul"),We.innerHTML=gl,Ls=i(),_e=n("ul"),Dt=n("li"),W=n("button"),f(Xe.$$.fragment),Es=i(),Ye=n("span"),Ye.textContent=bl,ks=i(),Nt=n("li"),F=n("button"),f($e.$$.fragment),Us=i(),Ze=n("span"),vn=k(Yt),Cs=k(" header menu"),ws=i(),S=n("li"),ne=n("a"),zt=n("div"),f(ye.$$.fragment),Ps=i(),xe=n("h2"),xe.textContent=Ll,Ts=i(),et=n("ul"),et.innerHTML=El,qs=i(),ge=n("ul"),St=n("li"),X=n("button"),f(tt.$$.fragment),Is=i(),nt=n("span"),nt.textContent=kl,Ds=i(),Mt=n("li"),Q=n("button"),f(be.$$.fragment),Ns=i(),st=n("span"),_n=k(Zt),zs=k(" header menu"),Ss=i(),Le=n("ul"),M=n("li"),se=n("a"),lt=n("div"),f(at.$$.fragment),Ms=i(),rt=n("h2"),rt.textContent=Ul,As=i(),it=n("ul"),it.innerHTML=Cl,Bs=i(),Ee=n("ul"),At=n("li"),Y=n("button"),f(ot.$$.fragment),Js=i(),ct=n("span"),ct.textContent=wl,Hs=i(),Bt=n("li"),G=n("button"),f(ke.$$.fragment),Os=i(),ut=n("span"),gn=k(yt),Fs=k(" header menu"),Qs=i(),A=n("li"),le=n("a"),dt=n("div"),f(pt.$$.fragment),Gs=i(),ft=n("h2"),ft.textContent=Pl,Vs=i(),ht=n("ul"),ht.innerHTML=Tl,Rs=i(),Ue=n("ul"),Jt=n("li"),Z=n("button"),f(vt.$$.fragment),js=i(),mt=n("span"),mt.textContent=ql,Ks=i(),Ht=n("li"),V=n("button"),f(Ce.$$.fragment),Ws=i(),_t=n("span"),Ln=k(xt),Xs=k(" header menu"),Ys=i(),we=n("ul"),en=n("li"),Pe=n("a"),f($t.$$.fragment),Zs=k(`\r
        Documentation`),ys=i(),tn=n("li"),Te=n("a"),f(gt.$$.fragment),xs=k(`\r
        Partner Portal`),this.h()},l(l){ta("svelte-zlk2mt",document.head).forEach(a),ie=o(l),p=s(l,"NAV",{class:!0});var ae=r(p);L=s(ae,"UL",{class:!0});var q=r(L);P=s(q,"LI",{class:!0});var re=r(P);E=s(re,"A",{href:!0,class:!0});var bt=r(E);w=s(bt,"DIV",{class:!0});var nn=r(w);h(oe.$$.fragment,nn),nn.forEach(a),ln=o(bt),ce=s(bt,"H2",{class:!0,"data-svelte-h":!0}),b(ce)!=="svelte-1a38a01"&&(ce.textContent=Zn),bt.forEach(a),an=o(re),ue=s(re,"UL",{class:!0,"data-svelte-h":!0}),b(ue)!=="svelte-1tj1zl5"&&(ue.innerHTML=yn),rn=o(re),y=s(re,"UL",{class:!0});var Lt=r(y);Ie=s(Lt,"LI",{class:!0});var sn=r(Ie);B=s(sn,"BUTTON",{title:!0,class:!0});var kn=r(B);h(de.$$.fragment,kn),on=o(kn),pe=s(kn,"SPAN",{class:!0,"data-svelte-h":!0}),b(pe)!=="svelte-vg36pf"&&(pe.textContent=I),kn.forEach(a),sn.forEach(a),De=o(Lt),kt=s(Lt,"LI",{class:!0});var Dl=r(kt);J=s(Dl,"BUTTON",{title:!0,class:!0});var Un=r(J);h(fe.$$.fragment,Un),xn=o(Un),Ne=s(Un,"SPAN",{class:!0});var tl=r(Ne);cn=U(tl,Kt),es=U(tl," header menu"),tl.forEach(a),Un.forEach(a),Dl.forEach(a),Lt.forEach(a),re.forEach(a),ts=o(q),D=s(q,"LI",{class:!0});var Ot=r(D);x=s(Ot,"A",{href:!0,class:!0});var Cn=r(x);Ut=s(Cn,"DIV",{class:!0});var Nl=r(Ut);h(ze.$$.fragment,Nl),Nl.forEach(a),ns=o(Cn),Se=s(Cn,"H2",{class:!0,"data-svelte-h":!0}),b(Se)!=="svelte-bvmn5u"&&(Se.textContent=dl),Cn.forEach(a),ss=o(Ot),Me=s(Ot,"UL",{class:!0,"data-svelte-h":!0}),b(Me)!=="svelte-ml78fh"&&(Me.innerHTML=pl),ls=o(Ot),he=s(Ot,"UL",{class:!0});var wn=r(he);Ct=s(wn,"LI",{class:!0});var zl=r(Ct);R=s(zl,"BUTTON",{title:!0,class:!0});var Pn=r(R);h(Ae.$$.fragment,Pn),as=o(Pn),Be=s(Pn,"SPAN",{class:!0,"data-svelte-h":!0}),b(Be)!=="svelte-10o6fc2"&&(Be.textContent=fl),Pn.forEach(a),zl.forEach(a),rs=o(wn),wt=s(wn,"LI",{class:!0});var Sl=r(wt);H=s(Sl,"BUTTON",{title:!0,class:!0});var Tn=r(H);h(ve.$$.fragment,Tn),is=o(Tn),Je=s(Tn,"SPAN",{class:!0});var nl=r(Je);dn=U(nl,Wt),os=U(nl," header menu"),nl.forEach(a),Tn.forEach(a),Sl.forEach(a),wn.forEach(a),Ot.forEach(a),cs=o(q),N=s(q,"LI",{class:!0});var Ft=r(N);ee=s(Ft,"A",{href:!0,class:!0});var qn=r(ee);Pt=s(qn,"DIV",{class:!0});var Ml=r(Pt);h(He.$$.fragment,Ml),Ml.forEach(a),us=o(qn),Oe=s(qn,"H2",{class:!0,"data-svelte-h":!0}),b(Oe)!=="svelte-1ef7qq7"&&(Oe.textContent=hl),qn.forEach(a),ds=o(Ft),Fe=s(Ft,"UL",{class:!0,"data-svelte-h":!0}),b(Fe)!=="svelte-16nvdoq"&&(Fe.innerHTML=vl),ps=o(Ft),j=s(Ft,"UL",{class:!0});var Qt=r(j);Qe=s(Qt,"LI",{class:!0,"data-svelte-h":!0}),b(Qe)!=="svelte-44hxvb"&&(Qe.innerHTML=ml),fs=o(Qt),Tt=s(Qt,"LI",{class:!0});var Al=r(Tt);K=s(Al,"BUTTON",{title:!0,class:!0});var In=r(K);h(Ge.$$.fragment,In),hs=o(In),Ve=s(In,"SPAN",{class:!0,"data-svelte-h":!0}),b(Ve)!=="svelte-7a5jqd"&&(Ve.textContent=_l),In.forEach(a),Al.forEach(a),vs=o(Qt),qt=s(Qt,"LI",{class:!0});var Bl=r(qt);O=s(Bl,"BUTTON",{title:!0,class:!0});var Dn=r(O);h(me.$$.fragment,Dn),ms=o(Dn),Re=s(Dn,"SPAN",{class:!0});var sl=r(Re);fn=U(sl,Xt),_s=U(sl," header menu"),sl.forEach(a),Dn.forEach(a),Bl.forEach(a),Qt.forEach(a),Ft.forEach(a),$s=o(q),z=s(q,"LI",{class:!0});var Gt=r(z);te=s(Gt,"A",{href:!0,class:!0});var Nn=r(te);It=s(Nn,"DIV",{class:!0});var Jl=r(It);h(je.$$.fragment,Jl),Jl.forEach(a),gs=o(Nn),Ke=s(Nn,"H2",{class:!0,"data-svelte-h":!0}),b(Ke)!=="svelte-1bxtcha"&&(Ke.textContent=$l),Nn.forEach(a),bs=o(Gt),We=s(Gt,"UL",{class:!0,"data-svelte-h":!0}),b(We)!=="svelte-198kha5"&&(We.innerHTML=gl),Ls=o(Gt),_e=s(Gt,"UL",{class:!0});var zn=r(_e);Dt=s(zn,"LI",{class:!0});var Hl=r(Dt);W=s(Hl,"BUTTON",{title:!0,class:!0});var Sn=r(W);h(Xe.$$.fragment,Sn),Es=o(Sn),Ye=s(Sn,"SPAN",{class:!0,"data-svelte-h":!0}),b(Ye)!=="svelte-12zm1eu"&&(Ye.textContent=bl),Sn.forEach(a),Hl.forEach(a),ks=o(zn),Nt=s(zn,"LI",{class:!0});var Ol=r(Nt);F=s(Ol,"BUTTON",{title:!0,class:!0});var Mn=r(F);h($e.$$.fragment,Mn),Us=o(Mn),Ze=s(Mn,"SPAN",{class:!0});var ll=r(Ze);vn=U(ll,Yt),Cs=U(ll," header menu"),ll.forEach(a),Mn.forEach(a),Ol.forEach(a),zn.forEach(a),Gt.forEach(a),ws=o(q),S=s(q,"LI",{class:!0});var Vt=r(S);ne=s(Vt,"A",{href:!0,class:!0});var An=r(ne);zt=s(An,"DIV",{class:!0});var Fl=r(zt);h(ye.$$.fragment,Fl),Fl.forEach(a),Ps=o(An),xe=s(An,"H2",{class:!0,"data-svelte-h":!0}),b(xe)!=="svelte-187k1uv"&&(xe.textContent=Ll),An.forEach(a),Ts=o(Vt),et=s(Vt,"UL",{class:!0,"data-svelte-h":!0}),b(et)!=="svelte-1hxwc9f"&&(et.innerHTML=El),qs=o(Vt),ge=s(Vt,"UL",{class:!0});var Bn=r(ge);St=s(Bn,"LI",{class:!0});var Ql=r(St);X=s(Ql,"BUTTON",{title:!0,class:!0});var Jn=r(X);h(tt.$$.fragment,Jn),Is=o(Jn),nt=s(Jn,"SPAN",{class:!0,"data-svelte-h":!0}),b(nt)!=="svelte-96zp3x"&&(nt.textContent=kl),Jn.forEach(a),Ql.forEach(a),Ds=o(Bn),Mt=s(Bn,"LI",{class:!0});var Gl=r(Mt);Q=s(Gl,"BUTTON",{title:!0,class:!0});var Hn=r(Q);h(be.$$.fragment,Hn),Ns=o(Hn),st=s(Hn,"SPAN",{class:!0});var al=r(st);_n=U(al,Zt),zs=U(al," header menu"),al.forEach(a),Hn.forEach(a),Gl.forEach(a),Bn.forEach(a),Vt.forEach(a),q.forEach(a),Ss=o(ae),Le=s(ae,"UL",{class:!0});var On=r(Le);M=s(On,"LI",{class:!0});var Rt=r(M);se=s(Rt,"A",{href:!0,class:!0});var Fn=r(se);lt=s(Fn,"DIV",{class:!0,style:!0});var Vl=r(lt);h(at.$$.fragment,Vl),Vl.forEach(a),Ms=o(Fn),rt=s(Fn,"H2",{class:!0,"data-svelte-h":!0}),b(rt)!=="svelte-1945w61"&&(rt.textContent=Ul),Fn.forEach(a),As=o(Rt),it=s(Rt,"UL",{class:!0,"data-svelte-h":!0}),b(it)!=="svelte-1k625ps"&&(it.innerHTML=Cl),Bs=o(Rt),Ee=s(Rt,"UL",{class:!0});var Qn=r(Ee);At=s(Qn,"LI",{class:!0});var Rl=r(At);Y=s(Rl,"BUTTON",{title:!0,class:!0});var Gn=r(Y);h(ot.$$.fragment,Gn),Js=o(Gn),ct=s(Gn,"SPAN",{class:!0,"data-svelte-h":!0}),b(ct)!=="svelte-zgpe6t"&&(ct.textContent=wl),Gn.forEach(a),Rl.forEach(a),Hs=o(Qn),Bt=s(Qn,"LI",{class:!0});var jl=r(Bt);G=s(jl,"BUTTON",{title:!0,class:!0});var Vn=r(G);h(ke.$$.fragment,Vn),Os=o(Vn),ut=s(Vn,"SPAN",{class:!0});var rl=r(ut);gn=U(rl,yt),Fs=U(rl," header menu"),rl.forEach(a),Vn.forEach(a),jl.forEach(a),Qn.forEach(a),Rt.forEach(a),Qs=o(On),A=s(On,"LI",{class:!0});var jt=r(A);le=s(jt,"A",{href:!0,class:!0});var Rn=r(le);dt=s(Rn,"DIV",{class:!0,style:!0});var Kl=r(dt);h(pt.$$.fragment,Kl),Kl.forEach(a),Gs=o(Rn),ft=s(Rn,"H2",{class:!0,"data-svelte-h":!0}),b(ft)!=="svelte-v0z4e8"&&(ft.textContent=Pl),Rn.forEach(a),Vs=o(jt),ht=s(jt,"UL",{class:!0,"data-svelte-h":!0}),b(ht)!=="svelte-17bqupm"&&(ht.innerHTML=Tl),Rs=o(jt),Ue=s(jt,"UL",{class:!0});var jn=r(Ue);Jt=s(jn,"LI",{class:!0});var Wl=r(Jt);Z=s(Wl,"BUTTON",{title:!0,class:!0});var Kn=r(Z);h(vt.$$.fragment,Kn),js=o(Kn),mt=s(Kn,"SPAN",{class:!0,"data-svelte-h":!0}),b(mt)!=="svelte-1mz1lxe"&&(mt.textContent=ql),Kn.forEach(a),Wl.forEach(a),Ks=o(jn),Ht=s(jn,"LI",{class:!0});var Xl=r(Ht);V=s(Xl,"BUTTON",{title:!0,class:!0});var Wn=r(V);h(Ce.$$.fragment,Wn),Ws=o(Wn),_t=s(Wn,"SPAN",{class:!0});var il=r(_t);Ln=U(il,xt),Xs=U(il," header menu"),il.forEach(a),Wn.forEach(a),Xl.forEach(a),jn.forEach(a),jt.forEach(a),On.forEach(a),Ys=o(ae),we=s(ae,"UL",{class:!0});var Xn=r(we);en=s(Xn,"LI",{});var Yl=r(en);Pe=s(Yl,"A",{href:!0,class:!0});var ol=r(Pe);h($t.$$.fragment,ol),Zs=U(ol,`\r
        Documentation`),ol.forEach(a),Yl.forEach(a),ys=o(Xn),tn=s(Xn,"LI",{});var Zl=r(tn);Te=s(Zl,"A",{href:!0,class:!0});var cl=r(Te);h(gt.$$.fragment,cl),xs=U(cl,`\r
        Partner Portal`),cl.forEach(a),Zl.forEach(a),Xn.forEach(a),ae.forEach(a),this.h()},h(){t(w,"class","icon svelte-13p3n7t"),t(ce,"class","svelte-13p3n7t"),t(E,"href","/database"),t(E,"class","svelte-13p3n7t"),t(ue,"class","description svelte-13p3n7t"),t(pe,"class","label"),t(B,"title","More information"),t(B,"class","svelte-13p3n7t"),t(Ie,"class","svelte-13p3n7t"),t(Ne,"class","label"),t(J,"title",un=(c[1].header.includes("database")?"Unpin Database from":"Pin Database to")+" header menu"),t(J,"class","svelte-13p3n7t"),t(kt,"class","svelte-13p3n7t"),t(y,"class","actions svelte-13p3n7t"),t(P,"class","application svelte-13p3n7t"),T(P,"showDescription",c[0].includes("database")),t(Ut,"class","icon svelte-13p3n7t"),t(Se,"class","svelte-13p3n7t"),t(x,"href","/users"),t(x,"class","svelte-13p3n7t"),t(Me,"class","description svelte-13p3n7t"),t(Be,"class","label"),t(R,"title","More information"),t(R,"class","svelte-13p3n7t"),t(Ct,"class","svelte-13p3n7t"),t(Je,"class","label"),t(H,"title",pn=(c[1].header.includes("users")?"Unpin Users from":"Pin Users to")+" header menu"),t(H,"class","svelte-13p3n7t"),t(wt,"class","svelte-13p3n7t"),t(he,"class","actions svelte-13p3n7t"),t(D,"class","application svelte-13p3n7t"),T(D,"showDescription",c[0].includes("users")),t(Pt,"class","icon svelte-13p3n7t"),t(Oe,"class","svelte-13p3n7t"),t(ee,"href","/logs"),t(ee,"class","svelte-13p3n7t"),t(Fe,"class","description svelte-13p3n7t"),t(Qe,"class","svelte-13p3n7t"),t(Ve,"class","label"),t(K,"title","More information"),t(K,"class","svelte-13p3n7t"),t(Tt,"class","svelte-13p3n7t"),t(Re,"class","label"),t(O,"title",hn=(c[1].header.includes("logs")?"Unpin Logs from":"Pin Logs to")+" header menu"),t(O,"class","svelte-13p3n7t"),t(qt,"class","svelte-13p3n7t"),t(j,"class","actions svelte-13p3n7t"),t(N,"class","application svelte-13p3n7t"),T(N,"showDescription",c[0].includes("logs")),t(It,"class","icon svelte-13p3n7t"),t(Ke,"class","svelte-13p3n7t"),t(te,"href","/backgroundJobs"),t(te,"class","svelte-13p3n7t"),t(We,"class","description svelte-13p3n7t"),t(Ye,"class","label"),t(W,"title","More information"),t(W,"class","svelte-13p3n7t"),t(Dt,"class","svelte-13p3n7t"),t(Ze,"class","label"),t(F,"title",mn=(c[1].header.includes("backgroundJobs")?"Unpin Background Jobs from":"Pin Background Jobs to")+" header menu"),t(F,"class","svelte-13p3n7t"),t(Nt,"class","svelte-13p3n7t"),t(_e,"class","actions svelte-13p3n7t"),t(z,"class","application svelte-13p3n7t"),T(z,"showDescription",c[0].includes("backgroundJobs")),t(zt,"class","icon svelte-13p3n7t"),t(xe,"class","svelte-13p3n7t"),t(ne,"href","/constants"),t(ne,"class","svelte-13p3n7t"),t(et,"class","description svelte-13p3n7t"),t(nt,"class","label"),t(X,"title","More information"),t(X,"class","svelte-13p3n7t"),t(St,"class","svelte-13p3n7t"),t(st,"class","label"),t(Q,"title",$n=(c[1].header.includes("constants")?"Unpin Constants from":"Pin Constants to")+" header menu"),t(Q,"class","svelte-13p3n7t"),t(Mt,"class","svelte-13p3n7t"),t(ge,"class","actions svelte-13p3n7t"),t(S,"class","application svelte-13p3n7t"),T(S,"showDescription",c[0].includes("constants")),t(L,"class","applications svelte-13p3n7t"),t(lt,"class","icon svelte-13p3n7t"),yl(lt,"color","#aeb0b3"),t(rt,"class","svelte-13p3n7t"),t(se,"href",(typeof window<"u"&&window.location.port!=="4173"&&window.location.port!=="5173"?`http://localhost:${parseInt(window.location.port)}`:"http://localhost:3333")+"/gui/liquid"),t(se,"class","svelte-13p3n7t"),t(it,"class","description svelte-13p3n7t"),t(ct,"class","label"),t(Y,"title","More information"),t(Y,"class","svelte-13p3n7t"),t(At,"class","svelte-13p3n7t"),t(ut,"class","label"),t(G,"title",bn=(c[1].header.includes("liquid")?"Unpin Liquid Evaluator from":"Pin Liquid Evaluator to")+" header menu"),t(G,"class","svelte-13p3n7t"),t(Bt,"class","svelte-13p3n7t"),t(Ee,"class","actions svelte-13p3n7t"),t(M,"class","application svelte-13p3n7t"),T(M,"showDescription",c[0].includes("liquid")),t(dt,"class","icon svelte-13p3n7t"),yl(dt,"color","#f30e9c"),t(ft,"class","svelte-13p3n7t"),t(le,"href",(typeof window<"u"&&window.location.port!=="4173"&&window.location.port!=="5173"?`http://localhost:${parseInt(window.location.port)}`:"http://localhost:3333")+"/gui/graphql"),t(le,"class","svelte-13p3n7t"),t(ht,"class","description svelte-13p3n7t"),t(mt,"class","label"),t(Z,"title","More information"),t(Z,"class","svelte-13p3n7t"),t(Jt,"class","svelte-13p3n7t"),t(_t,"class","label"),t(V,"title",En=(c[1].header.includes("graphiql")?"Unpin GraphiQL from":"Pin GraphiQL to")+" header menu"),t(V,"class","svelte-13p3n7t"),t(Ht,"class","svelte-13p3n7t"),t(Ue,"class","actions svelte-13p3n7t"),t(A,"class","application svelte-13p3n7t"),T(A,"showDescription",c[0].includes("graphiql")),t(Le,"class","applications svelte-13p3n7t"),t(Pe,"href","https://documentation.platformos.com"),t(Pe,"class","button"),t(Te,"href","https://partners.platformos.com"),t(Te,"class","button"),t(we,"class","links svelte-13p3n7t"),t(p,"class","svelte-13p3n7t")},m(l,u){xl(l,ie,u),xl(l,p,u),e(p,L),e(L,P),e(P,E),e(E,w),v(oe,w,null),e(E,ln),e(E,ce),e(P,an),e(P,ue),e(P,rn),e(P,y),e(y,Ie),e(Ie,B),v(de,B,null),e(B,on),e(B,pe),e(y,De),e(y,kt),e(kt,J),v(fe,J,null),e(J,xn),e(J,Ne),e(Ne,cn),e(Ne,es),e(L,ts),e(L,D),e(D,x),e(x,Ut),v(ze,Ut,null),e(x,ns),e(x,Se),e(D,ss),e(D,Me),e(D,ls),e(D,he),e(he,Ct),e(Ct,R),v(Ae,R,null),e(R,as),e(R,Be),e(he,rs),e(he,wt),e(wt,H),v(ve,H,null),e(H,is),e(H,Je),e(Je,dn),e(Je,os),e(L,cs),e(L,N),e(N,ee),e(ee,Pt),v(He,Pt,null),e(ee,us),e(ee,Oe),e(N,ds),e(N,Fe),e(N,ps),e(N,j),e(j,Qe),e(j,fs),e(j,Tt),e(Tt,K),v(Ge,K,null),e(K,hs),e(K,Ve),e(j,vs),e(j,qt),e(qt,O),v(me,O,null),e(O,ms),e(O,Re),e(Re,fn),e(Re,_s),e(L,$s),e(L,z),e(z,te),e(te,It),v(je,It,null),e(te,gs),e(te,Ke),e(z,bs),e(z,We),e(z,Ls),e(z,_e),e(_e,Dt),e(Dt,W),v(Xe,W,null),e(W,Es),e(W,Ye),e(_e,ks),e(_e,Nt),e(Nt,F),v($e,F,null),e(F,Us),e(F,Ze),e(Ze,vn),e(Ze,Cs),e(L,ws),e(L,S),e(S,ne),e(ne,zt),v(ye,zt,null),e(ne,Ps),e(ne,xe),e(S,Ts),e(S,et),e(S,qs),e(S,ge),e(ge,St),e(St,X),v(tt,X,null),e(X,Is),e(X,nt),e(ge,Ds),e(ge,Mt),e(Mt,Q),v(be,Q,null),e(Q,Ns),e(Q,st),e(st,_n),e(st,zs),e(p,Ss),e(p,Le),e(Le,M),e(M,se),e(se,lt),v(at,lt,null),e(se,Ms),e(se,rt),e(M,As),e(M,it),e(M,Bs),e(M,Ee),e(Ee,At),e(At,Y),v(ot,Y,null),e(Y,Js),e(Y,ct),e(Ee,Hs),e(Ee,Bt),e(Bt,G),v(ke,G,null),e(G,Os),e(G,ut),e(ut,gn),e(ut,Fs),e(Le,Qs),e(Le,A),e(A,le),e(le,dt),v(pt,dt,null),e(le,Gs),e(le,ft),e(A,Vs),e(A,ht),e(A,Rs),e(A,Ue),e(Ue,Jt),e(Jt,Z),v(vt,Z,null),e(Z,js),e(Z,mt),e(Ue,Ks),e(Ue,Ht),e(Ht,V),v(Ce,V,null),e(V,Ws),e(V,_t),e(_t,Ln),e(_t,Xs),e(p,Ys),e(p,we),e(we,en),e(en,Pe),v($t,Pe,null),e(Pe,Zs),e(we,ys),e(we,tn),e(tn,Te),v(gt,Te,null),e(Te,xs),d=!0,el||(Il=[C(E,"focus",c[2],{once:!0}),C(E,"mouseover",c[2],{once:!0}),C(B,"click",c[5]),C(J,"click",c[6]),C(R,"click",c[7]),C(H,"click",c[8]),C(K,"click",c[9]),C(O,"click",c[10]),C(W,"click",c[11]),C(F,"click",c[12]),C(X,"click",c[13]),C(Q,"click",c[14]),C(Y,"click",c[15]),C(G,"click",c[16]),C(Z,"click",c[17]),C(V,"click",c[18])],el=!0)},p(l,[u]){(!d||u&2)&&qe!==(qe="platformOS"+(l[1].online?.MPKIT_URL?": "+l[1].online.MPKIT_URL.replace("https://",""):""))&&(document.title=qe);const ae={};u&2&&(ae.icon=l[1].header.includes("database")?"pinFilled":"pin"),fe.$set(ae),(!d||u&2)&&Kt!==(Kt=l[1].header.includes("database")?"Unpin Database from":"Pin Database to")&&Et(cn,Kt),(!d||u&2&&un!==(un=(l[1].header.includes("database")?"Unpin Database from":"Pin Database to")+" header menu"))&&t(J,"title",un),(!d||u&1)&&T(P,"showDescription",l[0].includes("database"));const q={};u&2&&(q.icon=l[1].header.includes("users")?"pinFilled":"pin"),ve.$set(q),(!d||u&2)&&Wt!==(Wt=l[1].header.includes("users")?"Unpin Users from":"Pin Users to")&&Et(dn,Wt),(!d||u&2&&pn!==(pn=(l[1].header.includes("users")?"Unpin Users from":"Pin Users to")+" header menu"))&&t(H,"title",pn),(!d||u&1)&&T(D,"showDescription",l[0].includes("users"));const re={};u&2&&(re.icon=l[1].header.includes("logs")?"pinFilled":"pin"),me.$set(re),(!d||u&2)&&Xt!==(Xt=l[1].header.includes("logs")?"Unpin Logs from":"Pin Logs to")&&Et(fn,Xt),(!d||u&2&&hn!==(hn=(l[1].header.includes("logs")?"Unpin Logs from":"Pin Logs to")+" header menu"))&&t(O,"title",hn),(!d||u&1)&&T(N,"showDescription",l[0].includes("logs"));const bt={};u&2&&(bt.icon=l[1].header.includes("backgroundJobs")?"pinFilled":"pin"),$e.$set(bt),(!d||u&2)&&Yt!==(Yt=l[1].header.includes("backgroundJobs")?"Unpin Background Jobs from":"Pin Background Jobs to")&&Et(vn,Yt),(!d||u&2&&mn!==(mn=(l[1].header.includes("backgroundJobs")?"Unpin Background Jobs from":"Pin Background Jobs to")+" header menu"))&&t(F,"title",mn),(!d||u&1)&&T(z,"showDescription",l[0].includes("backgroundJobs"));const nn={};u&2&&(nn.icon=l[1].header.includes("constants")?"pinFilled":"pin"),be.$set(nn),(!d||u&2)&&Zt!==(Zt=l[1].header.includes("constants")?"Unpin Constants from":"Pin Constants to")&&Et(_n,Zt),(!d||u&2&&$n!==($n=(l[1].header.includes("constants")?"Unpin Constants from":"Pin Constants to")+" header menu"))&&t(Q,"title",$n),(!d||u&1)&&T(S,"showDescription",l[0].includes("constants"));const Lt={};u&2&&(Lt.icon=l[1].header.includes("liquid")?"pinFilled":"pin"),ke.$set(Lt),(!d||u&2)&&yt!==(yt=l[1].header.includes("liquid")?"Unpin Liquid Evaluator from":"Pin Liquid Evaluator to")&&Et(gn,yt),(!d||u&2&&bn!==(bn=(l[1].header.includes("liquid")?"Unpin Liquid Evaluator from":"Pin Liquid Evaluator to")+" header menu"))&&t(G,"title",bn),(!d||u&1)&&T(M,"showDescription",l[0].includes("liquid"));const sn={};u&2&&(sn.icon=l[1].header.includes("graphiql")?"pinFilled":"pin"),Ce.$set(sn),(!d||u&2)&&xt!==(xt=l[1].header.includes("graphiql")?"Unpin GraphiQL from":"Pin GraphiQL to")&&Et(Ln,xt),(!d||u&2&&En!==(En=(l[1].header.includes("graphiql")?"Unpin GraphiQL from":"Pin GraphiQL to")+" header menu"))&&t(V,"title",En),(!d||u&1)&&T(A,"showDescription",l[0].includes("graphiql"))},i(l){d||(m(oe.$$.fragment,l),m(de.$$.fragment,l),m(fe.$$.fragment,l),m(ze.$$.fragment,l),m(Ae.$$.fragment,l),m(ve.$$.fragment,l),m(He.$$.fragment,l),m(Ge.$$.fragment,l),m(me.$$.fragment,l),m(je.$$.fragment,l),m(Xe.$$.fragment,l),m($e.$$.fragment,l),m(ye.$$.fragment,l),m(tt.$$.fragment,l),m(be.$$.fragment,l),m(at.$$.fragment,l),m(ot.$$.fragment,l),m(ke.$$.fragment,l),m(pt.$$.fragment,l),m(vt.$$.fragment,l),m(Ce.$$.fragment,l),m($t.$$.fragment,l),m(gt.$$.fragment,l),d=!0)},o(l){_(oe.$$.fragment,l),_(de.$$.fragment,l),_(fe.$$.fragment,l),_(ze.$$.fragment,l),_(Ae.$$.fragment,l),_(ve.$$.fragment,l),_(He.$$.fragment,l),_(Ge.$$.fragment,l),_(me.$$.fragment,l),_(je.$$.fragment,l),_(Xe.$$.fragment,l),_($e.$$.fragment,l),_(ye.$$.fragment,l),_(tt.$$.fragment,l),_(be.$$.fragment,l),_(at.$$.fragment,l),_(ot.$$.fragment,l),_(ke.$$.fragment,l),_(pt.$$.fragment,l),_(vt.$$.fragment,l),_(Ce.$$.fragment,l),_($t.$$.fragment,l),_(gt.$$.fragment,l),d=!1},d(l){l&&(a(ie),a(p)),$(oe),$(de),$(fe),$(ze),$(Ae),$(ve),$(He),$(Ge),$(me),$(je),$(Xe),$($e),$(ye),$(tt),$(be),$(at),$(ot),$(ke),$(pt),$(vt),$(Ce),$($t),$(gt),el=!1,na(Il)}}}function oa(c,qe,ie){let p;sa(c,Yn,I=>ie(1,p=I));let L=[];const P=async()=>{p.tables.length||ul(Yn,p.tables=await ra.get(),p)},E=I=>{p.header.indexOf(I)>-1?ul(Yn,p.header=p.header.filter(De=>De!==I),p):ul(Yn,p.header=[...p.header,I],p),localStorage.header=JSON.stringify(p.header)},w=I=>{L.indexOf(I)>-1?ie(0,L=L.filter(De=>De!==I)):ie(0,L=[...L,I])};return[L,p,P,E,w,()=>w("database"),()=>E("database"),()=>w("users"),()=>E("users"),()=>w("logs"),()=>E("logs"),()=>w("backgroundJobs"),()=>E("backgroundJobs"),()=>w("constants"),()=>E("constants"),()=>w("liquid"),()=>E("liquid"),()=>w("graphiql"),()=>E("graphiql")]}class ha extends la{constructor(qe){super(),aa(this,qe,oa,ia,ea,{})}}export{ha as component};
