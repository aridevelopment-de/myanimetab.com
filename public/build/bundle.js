var app=function(){"use strict";function e(){}function t(e){return e()}function s(){return Object.create(null)}function n(e){e.forEach(t)}function a(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(e,t,s){e.insertBefore(t,s||null)}function o(e){e.parentNode.removeChild(e)}function r(e){return document.createElement(e)}function c(){return e=" ",document.createTextNode(e);var e}function p(e,t,s){null==s?e.removeAttribute(t):e.getAttribute(t)!==s&&e.setAttribute(t,s)}let d;function u(e){d=e}const m=[],b=[],h=[],f=[],v=Promise.resolve();let g=!1;function y(e){h.push(e)}const $=new Set;let w=0;function _(){const e=d;do{for(;w<m.length;){const e=m[w];w++,u(e),x(e.$$)}for(u(null),m.length=0,w=0;b.length;)b.pop()();for(let e=0;e<h.length;e+=1){const t=h[e];$.has(t)||($.add(t),t())}h.length=0}while(m.length);for(;f.length;)f.pop()();g=!1,$.clear(),u(e)}function x(e){if(null!==e.fragment){e.update(),n(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(y)}}const k=new Set;function A(e,t){-1===e.$$.dirty[0]&&(m.push(e),g||(g=!0,v.then(_)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function T(l,i,r,c,p,m,b,h=[-1]){const f=d;u(l);const v=l.$$={fragment:null,ctx:null,props:m,update:e,not_equal:p,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(f?f.$$.context:[])),callbacks:s(),dirty:h,skip_bound:!1,root:i.target||f.$$.root};b&&b(v.root);let g=!1;if(v.ctx=r?r(l,i.props||{},((e,t,...s)=>{const n=s.length?s[0]:t;return v.ctx&&p(v.ctx[e],v.ctx[e]=n)&&(!v.skip_bound&&v.bound[e]&&v.bound[e](n),g&&A(l,e)),t})):[],v.update(),g=!0,n(v.before_update),v.fragment=!!c&&c(v.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);v.fragment&&v.fragment.l(e),e.forEach(o)}else v.fragment&&v.fragment.c();i.intro&&(($=l.$$.fragment)&&$.i&&(k.delete($),$.i(w))),function(e,s,l,i){const{fragment:o,on_mount:r,on_destroy:c,after_update:p}=e.$$;o&&o.m(s,l),i||y((()=>{const s=r.map(t).filter(a);c?c.push(...s):n(s),e.$$.on_mount=[]})),p.forEach(y)}(l,i.target,i.anchor,i.customElement),_()}var $,w;u(f)}function M(t){let s,n,a,l,d,u,m,b,h;return{c(){s=r("section"),s.innerHTML='<nav class="svelte-eep9tb"><div class="nav_image svelte-eep9tb"><a href="./" class="ns svelte-eep9tb"><img class="ns navbar_image svelte-eep9tb" src="./icon.png" alt="myanimetab"/></a> \n\t\t\t<a href="./" class="ns svelte-eep9tb">MyAnimeTab</a></div> \n        <div class="links svelte-eep9tb"><a class="ns svelte-eep9tb" href="https://addons.mozilla.org/firefox/addon/myanimetab/">Install</a> \n            <a class="ns svelte-eep9tb" href="https://github.com/aridevelopment-de/myanimetab">GitHub</a></div></nav> \n\t<main class="svelte-eep9tb"><div class="landing_text svelte-eep9tb"><h1 class="pm0 svelte-eep9tb">MyAnimeTab - A Firefox Startpage for Anime Enjoyers</h1> \n\t\t\t<p class="svelte-eep9tb">MyAnimeTab is a Firefox addon that replaces the default Startpage with a customizable one.</p></div> \n\t\t<div class="landing_image svelte-eep9tb"><img src="./3.png" alt="preview" class="svelte-eep9tb"/></div></main>',n=c(),a=r("section"),a.innerHTML='<main class="svelte-eep9tb"><header class="svelte-eep9tb"><h1 class="pm0 svelte-eep9tb">It comes with a wide collection of widgets</h1></header> \n\t\t<main class="svelte-eep9tb"><div class="widget svelte-eep9tb"><header class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">Clock</p></header> \n\t\t\t\t<main class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">A simple yet powerful clock. It displays the current time but also enables setting alarms. Great to keep track of your pizza!</p></main></div> \n\t\t\t<div class="widget svelte-eep9tb"><header class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">Weather</p></header> \n\t\t\t\t<main class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">Want to know if you need to bring an umbrella with you? The weather widget provides you with the current weather status as well as a forecast for the next days!</p></main></div> \n\t\t\t<div class="widget svelte-eep9tb"><header class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">Searchbar</p></header> \n\t\t\t\t<main class="svelte-eep9tb"><p class="pm0 svelte-eep9tb">Switching between Search Engines can be hard. This widget represents the solution to that! You&#39;ll be able to quickly switch the Search Engine and even get suggestions for your search!</p></main></div></main></main>',l=c(),d=r("section"),d.innerHTML='<main class="svelte-eep9tb"><header class="svelte-eep9tb"><h1 class="pm0 svelte-eep9tb">And lets you customize everything to your preferences</h1> \n\t\t\t<p class="svelte-eep9tb">MyAnimeTab features an easy-to-use settings page. You can install widgets, set their location and most importantly, import your own images.</p></header> \n\t\t<div class="settings_image svelte-eep9tb"><img src="./2.png" alt="preview" class="svelte-eep9tb"/></div></main>',u=c(),m=r("section"),m.innerHTML='<main class="svelte-eep9tb"><header class="svelte-eep9tb"><h1 class="svelte-eep9tb">Get the most out of your Startpage!</h1></header> \n\t\t<main class="svelte-eep9tb"><a href="https://addons.mozilla.org/firefox/addon/myanimetab/" class="svelte-eep9tb">Install MyAnimeTab Now!</a></main></main>',b=c(),h=r("footer"),h.innerHTML='<p class="svelte-eep9tb">myanimetab © 2022 aridevelopment.de</p>',p(s,"id","landing"),p(s,"class","svelte-eep9tb"),p(a,"id","widget_list"),p(a,"class","svelte-eep9tb"),p(d,"id","settings_preview"),p(d,"class","svelte-eep9tb"),p(m,"id","install"),p(m,"class","svelte-eep9tb"),p(h,"class","svelte-eep9tb")},m(e,t){i(e,s,t),i(e,n,t),i(e,a,t),i(e,l,t),i(e,d,t),i(e,u,t),i(e,m,t),i(e,b,t),i(e,h,t)},p:e,i:e,o:e,d(e){e&&o(s),e&&o(n),e&&o(a),e&&o(l),e&&o(d),e&&o(u),e&&o(m),e&&o(b),e&&o(h)}}}return new class extends class{$destroy(){!function(e,t){const s=e.$$;null!==s.fragment&&(n(s.on_destroy),s.fragment&&s.fragment.d(t),s.on_destroy=s.fragment=null,s.ctx=[])}(this,1),this.$destroy=e}$on(e,t){const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(t),()=>{const e=s.indexOf(t);-1!==e&&s.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}{constructor(e){super(),T(this,e,null,M,l,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
