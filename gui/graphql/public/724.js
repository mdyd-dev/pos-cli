"use strict";(self.webpackChunk_platformos_gui=self.webpackChunk_platformos_gui||[]).push([[724],{7181:(P,M,s)=>{s.d(M,{a:()=>p,b:()=>j,c:()=>k,d:()=>E,e:()=>O,g:()=>_});var r=s(398),f=s(2584),T=s(1520),D=Object.defineProperty,d=(n,a)=>D(n,"name",{value:a,configurable:!0});function _(n,a){const e={schema:n,type:null,parentType:null,inputType:null,directiveDef:null,fieldDef:null,argDef:null,argDefs:null,objectFieldDefs:null};return(0,T.f)(a,t=>{var o,i;switch(t.kind){case"Query":case"ShortQuery":e.type=n.getQueryType();break;case"Mutation":e.type=n.getMutationType();break;case"Subscription":e.type=n.getSubscriptionType();break;case"InlineFragment":case"FragmentDefinition":t.type&&(e.type=n.getType(t.type));break;case"Field":case"AliasedField":e.fieldDef=e.type&&t.name?c(n,e.parentType,t.name):null,e.type=(o=e.fieldDef)===null||o===void 0?void 0:o.type;break;case"SelectionSet":e.parentType=e.type?(0,r.xC)(e.type):null;break;case"Directive":e.directiveDef=t.name?n.getDirective(t.name):null;break;case"Arguments":const l=t.prevState?t.prevState.kind==="Field"?e.fieldDef:t.prevState.kind==="Directive"?e.directiveDef:t.prevState.kind==="AliasedField"?t.prevState.name&&c(n,e.parentType,t.prevState.name):null:null;e.argDefs=l?l.args:null;break;case"Argument":if(e.argDef=null,e.argDefs){for(let y=0;y<e.argDefs.length;y++)if(e.argDefs[y].name===t.name){e.argDef=e.argDefs[y];break}}e.inputType=(i=e.argDef)===null||i===void 0?void 0:i.type;break;case"EnumValue":const u=e.inputType?(0,r.xC)(e.inputType):null;e.enumValue=u instanceof r.mR?m(u.getValues(),y=>y.value===t.name):null;break;case"ListValue":const g=e.inputType?(0,r.tf)(e.inputType):null;e.inputType=g instanceof r.p2?g.ofType:null;break;case"ObjectValue":const b=e.inputType?(0,r.xC)(e.inputType):null;e.objectFieldDefs=b instanceof r.sR?b.getFields():null;break;case"ObjectField":const C=t.name&&e.objectFieldDefs?e.objectFieldDefs[t.name]:null;e.inputType=C==null?void 0:C.type;break;case"NamedType":e.type=t.name?n.getType(t.name):null;break}}),e}d(_,"getTypeInfo");function c(n,a,e){if(e===f.S.name&&n.getQueryType()===a)return f.S;if(e===f.T.name&&n.getQueryType()===a)return f.T;if(e===f.a.name&&(0,r.Gv)(a))return f.a;if(a&&a.getFields)return a.getFields()[e]}d(c,"getFieldDef");function m(n,a){for(let e=0;e<n.length;e++)if(a(n[e]))return n[e]}d(m,"find");function p(n){return{kind:"Field",schema:n.schema,field:n.fieldDef,type:v(n.fieldDef)?null:n.parentType}}d(p,"getFieldReference");function j(n){return{kind:"Directive",schema:n.schema,directive:n.directiveDef}}d(j,"getDirectiveReference");function k(n){return n.directiveDef?{kind:"Argument",schema:n.schema,argument:n.argDef,directive:n.directiveDef}:{kind:"Argument",schema:n.schema,argument:n.argDef,field:n.fieldDef,type:v(n.fieldDef)?null:n.parentType}}d(k,"getArgumentReference");function E(n){return{kind:"EnumValue",value:n.enumValue||void 0,type:n.inputType?(0,r.xC)(n.inputType):void 0}}d(E,"getEnumValueReference");function O(n,a){return{kind:"Type",schema:n.schema,type:a||n.type}}d(O,"getTypeReference");function v(n){return n.name.slice(0,2)==="__"}d(v,"isMetaField")},1520:(P,M,s)=>{s.d(M,{f:()=>T});var r=Object.defineProperty,f=(D,d)=>r(D,"name",{value:d,configurable:!0});function T(D,d){const _=[];let c=D;for(;c!=null&&c.kind;)_.push(c),c=c.prevState;for(let m=_.length-1;m>=0;m--)d(_[m])}f(T,"forEachState")},724:(P,M,s)=>{s.r(M);var r=s(7480),f=s(7181),T=s(9361),D=s(7294),d=s(3935),_=s(2584),c=s(1520),m=Object.defineProperty,p=(e,t)=>m(e,"name",{value:t,configurable:!0});r.C.defineOption("jump",!1,(e,t,o)=>{if(o&&o!==r.C.Init){const i=e.state.jump.onMouseOver;r.C.off(e.getWrapperElement(),"mouseover",i);const l=e.state.jump.onMouseOut;r.C.off(e.getWrapperElement(),"mouseout",l),r.C.off(document,"keydown",e.state.jump.onKeyDown),delete e.state.jump}if(t){const i=e.state.jump={options:t,onMouseOver:j.bind(null,e),onMouseOut:k.bind(null,e),onKeyDown:E.bind(null,e)};r.C.on(e.getWrapperElement(),"mouseover",i.onMouseOver),r.C.on(e.getWrapperElement(),"mouseout",i.onMouseOut),r.C.on(document,"keydown",i.onKeyDown)}});function j(e,t){const o=t.target||t.srcElement;if(!(o instanceof HTMLElement)||(o==null?void 0:o.nodeName)!=="SPAN")return;const i=o.getBoundingClientRect(),l={left:(i.left+i.right)/2,top:(i.top+i.bottom)/2};e.state.jump.cursor=l,e.state.jump.isHoldingModifier&&n(e)}p(j,"onMouseOver");function k(e){if(!e.state.jump.isHoldingModifier&&e.state.jump.cursor){e.state.jump.cursor=null;return}e.state.jump.isHoldingModifier&&e.state.jump.marker&&a(e)}p(k,"onMouseOut");function E(e,t){if(e.state.jump.isHoldingModifier||!v(t.key))return;e.state.jump.isHoldingModifier=!0,e.state.jump.cursor&&n(e);const o=p(u=>{u.code===t.code&&(e.state.jump.isHoldingModifier=!1,e.state.jump.marker&&a(e),r.C.off(document,"keyup",o),r.C.off(document,"click",i),e.off("mousedown",l))},"onKeyUp"),i=p(u=>{const g=e.state.jump.destination;g&&e.state.jump.options.onClick(g,u)},"onClick"),l=p((u,g)=>{e.state.jump.destination&&(g.codemirrorIgnore=!0)},"onMouseDown");r.C.on(document,"keyup",o),r.C.on(document,"click",i),e.on("mousedown",l)}p(E,"onKeyDown");const O=typeof navigator<"u"&&navigator&&navigator.appVersion.indexOf("Mac")!==-1;function v(e){return e===(O?"Meta":"Control")}p(v,"isJumpModifier");function n(e){if(e.state.jump.marker)return;const t=e.state.jump.cursor,o=e.coordsChar(t),i=e.getTokenAt(o,!0),l=e.state.jump.options,u=l.getDestination||e.getHelper(o,"jump");if(u){const g=u(i,l,e);if(g){const b=e.markText({line:o.line,ch:i.start},{line:o.line,ch:i.end},{className:"CodeMirror-jump-token"});e.state.jump.marker=b,e.state.jump.destination=g}}}p(n,"enableJumpMode");function a(e){const t=e.state.jump.marker;e.state.jump.marker=null,e.state.jump.destination=null,t.clear()}p(a,"disableJumpMode"),r.C.registerHelper("jump","graphql",(e,t)=>{if(!t.schema||!t.onClick||!e.state)return;const o=e.state,i=o.kind,l=o.step,u=(0,f.g)(t.schema,o);if(i==="Field"&&l===0&&u.fieldDef||i==="AliasedField"&&l===2&&u.fieldDef)return(0,f.a)(u);if(i==="Directive"&&l===1&&u.directiveDef)return(0,f.b)(u);if(i==="Argument"&&l===0&&u.argDef)return(0,f.c)(u);if(i==="EnumValue"&&u.enumValue)return(0,f.d)(u);if(i==="NamedType"&&u.type)return(0,f.e)(u)})}}]);
