(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();function Eh(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var _o={exports:{}},hs={},ps,Fl;function Th(){if(Fl)return ps;Fl=1;function n(e,t){typeof t=="boolean"&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}return ps=n,n.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0)},n.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null},n.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return!1;var t=new Date().getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.push(e),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(e);var i=this._timeouts.shift();if(i===void 0)if(this._cachedTimeouts)this._errors.splice(0,this._errors.length-1),i=this._cachedTimeouts.slice(-1);else return!1;var o=this;return this._timer=setTimeout(function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout(function(){o._operationTimeoutCb(o._attempts)},o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)},i),this._options.unref&&this._timer.unref(),!0},n.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var i=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){i._operationTimeoutCb()},i._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)},n.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e)},n.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e)},n.prototype.start=n.prototype.try,n.prototype.errors=function(){return this._errors},n.prototype.attempts=function(){return this._attempts},n.prototype.mainError=function(){if(this._errors.length===0)return null;for(var e={},t=null,i=0,o=0;o<this._errors.length;o++){var r=this._errors[o],s=r.message,a=(e[s]||0)+1;e[s]=a,a>=i&&(t=r,i=a)}return t},ps}var Bl;function xh(){return Bl||(Bl=1,(function(n){var e=Th();n.operation=function(t){var i=n.timeouts(t);return new e(i,{forever:t&&(t.forever||t.retries===1/0),unref:t&&t.unref,maxRetryTime:t&&t.maxRetryTime})},n.timeouts=function(t){if(t instanceof Array)return[].concat(t);var i={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var o in t)i[o]=t[o];if(i.minTimeout>i.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var r=[],s=0;s<i.retries;s++)r.push(this.createTimeout(s,i));return t&&t.forever&&!r.length&&r.push(this.createTimeout(s,i)),r.sort(function(a,u){return a-u}),r},n.createTimeout=function(t,i){var o=i.randomize?Math.random()+1:1,r=Math.round(o*Math.max(i.minTimeout,1)*Math.pow(i.factor,t));return r=Math.min(r,i.maxTimeout),r},n.wrap=function(t,i,o){if(i instanceof Array&&(o=i,i=null),!o){o=[];for(var r in t)typeof t[r]=="function"&&o.push(r)}for(var s=0;s<o.length;s++){var a=o[s],u=t[a];t[a]=(function(f){var h=n.operation(i),p=Array.prototype.slice.call(arguments,1),m=p.pop();p.push(function(S){h.retry(S)||(S&&(arguments[0]=h.mainError()),m.apply(this,arguments))}),h.attempt(function(){f.apply(t,p)})}).bind(t,u),t[a].options=i}}})(hs)),hs}var ms,Ol;function Mh(){return Ol||(Ol=1,ms=xh()),ms}var kl;function Ah(){if(kl)return _o.exports;kl=1;const n=Mh(),e=["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed"];class t extends Error{constructor(a){super(),a instanceof Error?(this.originalError=a,{message:a}=a):(this.originalError=new Error(a),this.originalError.stack=this.stack),this.name="AbortError",this.message=a}}const i=(s,a,u)=>{const c=u.retries-(a-1);return s.attemptNumber=a,s.retriesLeft=c,s},o=s=>e.includes(s),r=(s,a)=>new Promise((u,c)=>{a={onFailedAttempt:()=>{},retries:10,...a};const f=n.operation(a);f.attempt(async h=>{try{u(await s(h))}catch(p){if(!(p instanceof Error)){c(new TypeError(`Non-error was thrown: "${p}". You should only throw errors.`));return}if(p instanceof t)f.stop(),c(p.originalError);else if(p instanceof TypeError&&!o(p.message))f.stop(),c(p);else{i(p,h,a);try{await a.onFailedAttempt(p)}catch(m){c(m);return}f.retry(p)||c(f.mainError())}}})});return _o.exports=r,_o.exports.default=r,_o.exports.AbortError=t,_o.exports}var Ld=Ah();const Ch=Eh(Ld);var wh={};/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Rh,Ih;function bh(){return{geminiUrl:Rh,vertexUrl:Ih}}function Ph(n,e,t,i){var o,r;if(!(n!=null&&n.baseUrl)){const s=bh();return e?(o=s.vertexUrl)!==null&&o!==void 0?o:t:(r=s.geminiUrl)!==null&&r!==void 0?r:i}return n.baseUrl}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Wn{}function Ee(n,e){const t=/\{([^}]+)\}/g;return n.replace(t,(i,o)=>{if(Object.prototype.hasOwnProperty.call(e,o)){const r=e[o];return r!=null?String(r):""}else throw new Error(`Key '${o}' not found in valueMap.`)})}function d(n,e,t){for(let r=0;r<e.length-1;r++){const s=e[r];if(s.endsWith("[]")){const a=s.slice(0,-2);if(!(a in n))if(Array.isArray(t))n[a]=Array.from({length:t.length},()=>({}));else throw new Error(`Value must be a list given an array path ${s}`);if(Array.isArray(n[a])){const u=n[a];if(Array.isArray(t))for(let c=0;c<u.length;c++){const f=u[c];d(f,e.slice(r+1),t[c])}else for(const c of u)d(c,e.slice(r+1),t)}return}else if(s.endsWith("[0]")){const a=s.slice(0,-3);a in n||(n[a]=[{}]);const u=n[a];d(u[0],e.slice(r+1),t);return}(!n[s]||typeof n[s]!="object")&&(n[s]={}),n=n[s]}const i=e[e.length-1],o=n[i];if(o!==void 0){if(!t||typeof t=="object"&&Object.keys(t).length===0||t===o)return;if(typeof o=="object"&&typeof t=="object"&&o!==null&&t!==null)Object.assign(o,t);else throw new Error(`Cannot set value for an existing key. Key: ${i}`)}else i==="_self"&&typeof t=="object"&&t!==null&&!Array.isArray(t)?Object.assign(n,t):n[i]=t}function l(n,e,t=void 0){try{if(e.length===1&&e[0]==="_self")return n;for(let i=0;i<e.length;i++){if(typeof n!="object"||n===null)return t;const o=e[i];if(o.endsWith("[]")){const r=o.slice(0,-2);if(r in n){const s=n[r];return Array.isArray(s)?s.map(a=>l(a,e.slice(i+1),t)):t}else return t}else n=n[o]}return n}catch(i){if(i instanceof TypeError)return t;throw i}}function Dh(n,e){for(const[t,i]of Object.entries(e)){const o=t.split("."),r=i.split("."),s=new Set;let a=-1;for(let u=0;u<o.length;u++)if(o[u]==="*"){a=u;break}if(a!==-1&&r.length>a)for(let u=a;u<r.length;u++){const c=r[u];c!=="*"&&!c.endsWith("[]")&&!c.endsWith("[0]")&&s.add(c)}ia(n,o,r,0,s)}}function ia(n,e,t,i,o){if(i>=e.length||typeof n!="object"||n===null)return;const r=e[i];if(r.endsWith("[]")){const s=r.slice(0,-2),a=n;if(s in a&&Array.isArray(a[s]))for(const u of a[s])ia(u,e,t,i+1,o)}else if(r==="*"){if(typeof n=="object"&&n!==null&&!Array.isArray(n)){const s=n,a=Object.keys(s).filter(c=>!c.startsWith("_")&&!o.has(c)),u={};for(const c of a)u[c]=s[c];for(const[c,f]of Object.entries(u)){const h=[];for(const p of t.slice(i))p==="*"?h.push(c):h.push(p);d(s,h,f)}for(const c of a)delete s[c]}}else{const s=n;r in s&&ia(s[r],e,t,i+1,o)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ll(n){if(typeof n!="string")throw new Error("fromImageBytes must be a string");return n}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Nh(n){const e={},t=l(n,["operationName"]);t!=null&&d(e,["operationName"],t);const i=l(n,["resourceName"]);return i!=null&&d(e,["_url","resourceName"],i),e}function Uh(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["response","generateVideoResponse"]);return s!=null&&d(e,["response"],Fh(s)),e}function Lh(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["response"]);return s!=null&&d(e,["response"],Bh(s)),e}function Fh(n){const e={},t=l(n,["generatedSamples"]);if(t!=null){let r=t;Array.isArray(r)&&(r=r.map(s=>Oh(s))),d(e,["generatedVideos"],r)}const i=l(n,["raiMediaFilteredCount"]);i!=null&&d(e,["raiMediaFilteredCount"],i);const o=l(n,["raiMediaFilteredReasons"]);return o!=null&&d(e,["raiMediaFilteredReasons"],o),e}function Bh(n){const e={},t=l(n,["videos"]);if(t!=null){let r=t;Array.isArray(r)&&(r=r.map(s=>kh(s))),d(e,["generatedVideos"],r)}const i=l(n,["raiMediaFilteredCount"]);i!=null&&d(e,["raiMediaFilteredCount"],i);const o=l(n,["raiMediaFilteredReasons"]);return o!=null&&d(e,["raiMediaFilteredReasons"],o),e}function Oh(n){const e={},t=l(n,["video"]);return t!=null&&d(e,["video"],qh(t)),e}function kh(n){const e={},t=l(n,["_self"]);return t!=null&&d(e,["video"],$h(t)),e}function Gh(n){const e={},t=l(n,["operationName"]);return t!=null&&d(e,["_url","operationName"],t),e}function Vh(n){const e={},t=l(n,["operationName"]);return t!=null&&d(e,["_url","operationName"],t),e}function Hh(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["response"]);return s!=null&&d(e,["response"],zh(s)),e}function zh(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["parent"]);i!=null&&d(e,["parent"],i);const o=l(n,["documentName"]);return o!=null&&d(e,["documentName"],o),e}function Fd(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["response"]);return s!=null&&d(e,["response"],Wh(s)),e}function Wh(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["parent"]);i!=null&&d(e,["parent"],i);const o=l(n,["documentName"]);return o!=null&&d(e,["documentName"],o),e}function qh(n){const e={},t=l(n,["uri"]);t!=null&&d(e,["uri"],t);const i=l(n,["encodedVideo"]);i!=null&&d(e,["videoBytes"],ll(i));const o=l(n,["encoding"]);return o!=null&&d(e,["mimeType"],o),e}function $h(n){const e={},t=l(n,["gcsUri"]);t!=null&&d(e,["uri"],t);const i=l(n,["bytesBase64Encoded"]);i!=null&&d(e,["videoBytes"],ll(i));const o=l(n,["mimeType"]);return o!=null&&d(e,["mimeType"],o),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var Gl;(function(n){n.OUTCOME_UNSPECIFIED="OUTCOME_UNSPECIFIED",n.OUTCOME_OK="OUTCOME_OK",n.OUTCOME_FAILED="OUTCOME_FAILED",n.OUTCOME_DEADLINE_EXCEEDED="OUTCOME_DEADLINE_EXCEEDED"})(Gl||(Gl={}));var Vl;(function(n){n.LANGUAGE_UNSPECIFIED="LANGUAGE_UNSPECIFIED",n.PYTHON="PYTHON"})(Vl||(Vl={}));var Hl;(function(n){n.SCHEDULING_UNSPECIFIED="SCHEDULING_UNSPECIFIED",n.SILENT="SILENT",n.WHEN_IDLE="WHEN_IDLE",n.INTERRUPT="INTERRUPT"})(Hl||(Hl={}));var Xt;(function(n){n.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",n.STRING="STRING",n.NUMBER="NUMBER",n.INTEGER="INTEGER",n.BOOLEAN="BOOLEAN",n.ARRAY="ARRAY",n.OBJECT="OBJECT",n.NULL="NULL"})(Xt||(Xt={}));var zl;(function(n){n.PHISH_BLOCK_THRESHOLD_UNSPECIFIED="PHISH_BLOCK_THRESHOLD_UNSPECIFIED",n.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",n.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",n.BLOCK_HIGH_AND_ABOVE="BLOCK_HIGH_AND_ABOVE",n.BLOCK_HIGHER_AND_ABOVE="BLOCK_HIGHER_AND_ABOVE",n.BLOCK_VERY_HIGH_AND_ABOVE="BLOCK_VERY_HIGH_AND_ABOVE",n.BLOCK_ONLY_EXTREMELY_HIGH="BLOCK_ONLY_EXTREMELY_HIGH"})(zl||(zl={}));var Wl;(function(n){n.AUTH_TYPE_UNSPECIFIED="AUTH_TYPE_UNSPECIFIED",n.NO_AUTH="NO_AUTH",n.API_KEY_AUTH="API_KEY_AUTH",n.HTTP_BASIC_AUTH="HTTP_BASIC_AUTH",n.GOOGLE_SERVICE_ACCOUNT_AUTH="GOOGLE_SERVICE_ACCOUNT_AUTH",n.OAUTH="OAUTH",n.OIDC_AUTH="OIDC_AUTH"})(Wl||(Wl={}));var ql;(function(n){n.HTTP_IN_UNSPECIFIED="HTTP_IN_UNSPECIFIED",n.HTTP_IN_QUERY="HTTP_IN_QUERY",n.HTTP_IN_HEADER="HTTP_IN_HEADER",n.HTTP_IN_PATH="HTTP_IN_PATH",n.HTTP_IN_BODY="HTTP_IN_BODY",n.HTTP_IN_COOKIE="HTTP_IN_COOKIE"})(ql||(ql={}));var $l;(function(n){n.API_SPEC_UNSPECIFIED="API_SPEC_UNSPECIFIED",n.SIMPLE_SEARCH="SIMPLE_SEARCH",n.ELASTIC_SEARCH="ELASTIC_SEARCH"})($l||($l={}));var Xl;(function(n){n.UNSPECIFIED="UNSPECIFIED",n.BLOCKING="BLOCKING",n.NON_BLOCKING="NON_BLOCKING"})(Xl||(Xl={}));var Yl;(function(n){n.MODE_UNSPECIFIED="MODE_UNSPECIFIED",n.MODE_DYNAMIC="MODE_DYNAMIC"})(Yl||(Yl={}));var Jl;(function(n){n.MODE_UNSPECIFIED="MODE_UNSPECIFIED",n.AUTO="AUTO",n.ANY="ANY",n.NONE="NONE",n.VALIDATED="VALIDATED"})(Jl||(Jl={}));var Kl;(function(n){n.THINKING_LEVEL_UNSPECIFIED="THINKING_LEVEL_UNSPECIFIED",n.LOW="LOW",n.MEDIUM="MEDIUM",n.HIGH="HIGH",n.MINIMAL="MINIMAL"})(Kl||(Kl={}));var Zl;(function(n){n.DONT_ALLOW="DONT_ALLOW",n.ALLOW_ADULT="ALLOW_ADULT",n.ALLOW_ALL="ALLOW_ALL"})(Zl||(Zl={}));var Ql;(function(n){n.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",n.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",n.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",n.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",n.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",n.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY",n.HARM_CATEGORY_IMAGE_HATE="HARM_CATEGORY_IMAGE_HATE",n.HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT="HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT",n.HARM_CATEGORY_IMAGE_HARASSMENT="HARM_CATEGORY_IMAGE_HARASSMENT",n.HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT="HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT",n.HARM_CATEGORY_JAILBREAK="HARM_CATEGORY_JAILBREAK"})(Ql||(Ql={}));var jl;(function(n){n.HARM_BLOCK_METHOD_UNSPECIFIED="HARM_BLOCK_METHOD_UNSPECIFIED",n.SEVERITY="SEVERITY",n.PROBABILITY="PROBABILITY"})(jl||(jl={}));var ec;(function(n){n.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",n.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",n.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",n.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",n.BLOCK_NONE="BLOCK_NONE",n.OFF="OFF"})(ec||(ec={}));var tc;(function(n){n.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",n.STOP="STOP",n.MAX_TOKENS="MAX_TOKENS",n.SAFETY="SAFETY",n.RECITATION="RECITATION",n.LANGUAGE="LANGUAGE",n.OTHER="OTHER",n.BLOCKLIST="BLOCKLIST",n.PROHIBITED_CONTENT="PROHIBITED_CONTENT",n.SPII="SPII",n.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",n.IMAGE_SAFETY="IMAGE_SAFETY",n.UNEXPECTED_TOOL_CALL="UNEXPECTED_TOOL_CALL",n.IMAGE_PROHIBITED_CONTENT="IMAGE_PROHIBITED_CONTENT",n.NO_IMAGE="NO_IMAGE",n.IMAGE_RECITATION="IMAGE_RECITATION",n.IMAGE_OTHER="IMAGE_OTHER"})(tc||(tc={}));var nc;(function(n){n.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",n.NEGLIGIBLE="NEGLIGIBLE",n.LOW="LOW",n.MEDIUM="MEDIUM",n.HIGH="HIGH"})(nc||(nc={}));var ic;(function(n){n.HARM_SEVERITY_UNSPECIFIED="HARM_SEVERITY_UNSPECIFIED",n.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",n.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",n.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",n.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH"})(ic||(ic={}));var oc;(function(n){n.URL_RETRIEVAL_STATUS_UNSPECIFIED="URL_RETRIEVAL_STATUS_UNSPECIFIED",n.URL_RETRIEVAL_STATUS_SUCCESS="URL_RETRIEVAL_STATUS_SUCCESS",n.URL_RETRIEVAL_STATUS_ERROR="URL_RETRIEVAL_STATUS_ERROR",n.URL_RETRIEVAL_STATUS_PAYWALL="URL_RETRIEVAL_STATUS_PAYWALL",n.URL_RETRIEVAL_STATUS_UNSAFE="URL_RETRIEVAL_STATUS_UNSAFE"})(oc||(oc={}));var rc;(function(n){n.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",n.SAFETY="SAFETY",n.OTHER="OTHER",n.BLOCKLIST="BLOCKLIST",n.PROHIBITED_CONTENT="PROHIBITED_CONTENT",n.IMAGE_SAFETY="IMAGE_SAFETY",n.MODEL_ARMOR="MODEL_ARMOR",n.JAILBREAK="JAILBREAK"})(rc||(rc={}));var sc;(function(n){n.TRAFFIC_TYPE_UNSPECIFIED="TRAFFIC_TYPE_UNSPECIFIED",n.ON_DEMAND="ON_DEMAND",n.ON_DEMAND_PRIORITY="ON_DEMAND_PRIORITY",n.ON_DEMAND_FLEX="ON_DEMAND_FLEX",n.PROVISIONED_THROUGHPUT="PROVISIONED_THROUGHPUT"})(sc||(sc={}));var Do;(function(n){n.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",n.TEXT="TEXT",n.IMAGE="IMAGE",n.AUDIO="AUDIO"})(Do||(Do={}));var ac;(function(n){n.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",n.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",n.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",n.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH"})(ac||(ac={}));var lc;(function(n){n.TUNING_MODE_UNSPECIFIED="TUNING_MODE_UNSPECIFIED",n.TUNING_MODE_FULL="TUNING_MODE_FULL",n.TUNING_MODE_PEFT_ADAPTER="TUNING_MODE_PEFT_ADAPTER"})(lc||(lc={}));var cc;(function(n){n.ADAPTER_SIZE_UNSPECIFIED="ADAPTER_SIZE_UNSPECIFIED",n.ADAPTER_SIZE_ONE="ADAPTER_SIZE_ONE",n.ADAPTER_SIZE_TWO="ADAPTER_SIZE_TWO",n.ADAPTER_SIZE_FOUR="ADAPTER_SIZE_FOUR",n.ADAPTER_SIZE_EIGHT="ADAPTER_SIZE_EIGHT",n.ADAPTER_SIZE_SIXTEEN="ADAPTER_SIZE_SIXTEEN",n.ADAPTER_SIZE_THIRTY_TWO="ADAPTER_SIZE_THIRTY_TWO"})(cc||(cc={}));var oa;(function(n){n.JOB_STATE_UNSPECIFIED="JOB_STATE_UNSPECIFIED",n.JOB_STATE_QUEUED="JOB_STATE_QUEUED",n.JOB_STATE_PENDING="JOB_STATE_PENDING",n.JOB_STATE_RUNNING="JOB_STATE_RUNNING",n.JOB_STATE_SUCCEEDED="JOB_STATE_SUCCEEDED",n.JOB_STATE_FAILED="JOB_STATE_FAILED",n.JOB_STATE_CANCELLING="JOB_STATE_CANCELLING",n.JOB_STATE_CANCELLED="JOB_STATE_CANCELLED",n.JOB_STATE_PAUSED="JOB_STATE_PAUSED",n.JOB_STATE_EXPIRED="JOB_STATE_EXPIRED",n.JOB_STATE_UPDATING="JOB_STATE_UPDATING",n.JOB_STATE_PARTIALLY_SUCCEEDED="JOB_STATE_PARTIALLY_SUCCEEDED"})(oa||(oa={}));var uc;(function(n){n.TUNING_JOB_STATE_UNSPECIFIED="TUNING_JOB_STATE_UNSPECIFIED",n.TUNING_JOB_STATE_WAITING_FOR_QUOTA="TUNING_JOB_STATE_WAITING_FOR_QUOTA",n.TUNING_JOB_STATE_PROCESSING_DATASET="TUNING_JOB_STATE_PROCESSING_DATASET",n.TUNING_JOB_STATE_WAITING_FOR_CAPACITY="TUNING_JOB_STATE_WAITING_FOR_CAPACITY",n.TUNING_JOB_STATE_TUNING="TUNING_JOB_STATE_TUNING",n.TUNING_JOB_STATE_POST_PROCESSING="TUNING_JOB_STATE_POST_PROCESSING"})(uc||(uc={}));var dc;(function(n){n.AGGREGATION_METRIC_UNSPECIFIED="AGGREGATION_METRIC_UNSPECIFIED",n.AVERAGE="AVERAGE",n.MODE="MODE",n.STANDARD_DEVIATION="STANDARD_DEVIATION",n.VARIANCE="VARIANCE",n.MINIMUM="MINIMUM",n.MAXIMUM="MAXIMUM",n.MEDIAN="MEDIAN",n.PERCENTILE_P90="PERCENTILE_P90",n.PERCENTILE_P95="PERCENTILE_P95",n.PERCENTILE_P99="PERCENTILE_P99"})(dc||(dc={}));var fc;(function(n){n.PAIRWISE_CHOICE_UNSPECIFIED="PAIRWISE_CHOICE_UNSPECIFIED",n.BASELINE="BASELINE",n.CANDIDATE="CANDIDATE",n.TIE="TIE"})(fc||(fc={}));var hc;(function(n){n.TUNING_TASK_UNSPECIFIED="TUNING_TASK_UNSPECIFIED",n.TUNING_TASK_I2V="TUNING_TASK_I2V",n.TUNING_TASK_T2V="TUNING_TASK_T2V",n.TUNING_TASK_R2V="TUNING_TASK_R2V"})(hc||(hc={}));var pc;(function(n){n.MEDIA_RESOLUTION_UNSPECIFIED="MEDIA_RESOLUTION_UNSPECIFIED",n.MEDIA_RESOLUTION_LOW="MEDIA_RESOLUTION_LOW",n.MEDIA_RESOLUTION_MEDIUM="MEDIA_RESOLUTION_MEDIUM",n.MEDIA_RESOLUTION_HIGH="MEDIA_RESOLUTION_HIGH",n.MEDIA_RESOLUTION_ULTRA_HIGH="MEDIA_RESOLUTION_ULTRA_HIGH"})(pc||(pc={}));var ra;(function(n){n.COLLECTION="COLLECTION"})(ra||(ra={}));var mc;(function(n){n.FEATURE_SELECTION_PREFERENCE_UNSPECIFIED="FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",n.PRIORITIZE_QUALITY="PRIORITIZE_QUALITY",n.BALANCED="BALANCED",n.PRIORITIZE_COST="PRIORITIZE_COST"})(mc||(mc={}));var gc;(function(n){n.ENVIRONMENT_UNSPECIFIED="ENVIRONMENT_UNSPECIFIED",n.ENVIRONMENT_BROWSER="ENVIRONMENT_BROWSER"})(gc||(gc={}));var _c;(function(n){n.PROMINENT_PEOPLE_UNSPECIFIED="PROMINENT_PEOPLE_UNSPECIFIED",n.ALLOW_PROMINENT_PEOPLE="ALLOW_PROMINENT_PEOPLE",n.BLOCK_PROMINENT_PEOPLE="BLOCK_PROMINENT_PEOPLE"})(_c||(_c={}));var Br;(function(n){n.PREDICT="PREDICT",n.EMBED_CONTENT="EMBED_CONTENT"})(Br||(Br={}));var vc;(function(n){n.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",n.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",n.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",n.BLOCK_NONE="BLOCK_NONE"})(vc||(vc={}));var yc;(function(n){n.auto="auto",n.en="en",n.ja="ja",n.ko="ko",n.hi="hi",n.zh="zh",n.pt="pt",n.es="es"})(yc||(yc={}));var Sc;(function(n){n.MASK_MODE_DEFAULT="MASK_MODE_DEFAULT",n.MASK_MODE_USER_PROVIDED="MASK_MODE_USER_PROVIDED",n.MASK_MODE_BACKGROUND="MASK_MODE_BACKGROUND",n.MASK_MODE_FOREGROUND="MASK_MODE_FOREGROUND",n.MASK_MODE_SEMANTIC="MASK_MODE_SEMANTIC"})(Sc||(Sc={}));var Ec;(function(n){n.CONTROL_TYPE_DEFAULT="CONTROL_TYPE_DEFAULT",n.CONTROL_TYPE_CANNY="CONTROL_TYPE_CANNY",n.CONTROL_TYPE_SCRIBBLE="CONTROL_TYPE_SCRIBBLE",n.CONTROL_TYPE_FACE_MESH="CONTROL_TYPE_FACE_MESH"})(Ec||(Ec={}));var Tc;(function(n){n.SUBJECT_TYPE_DEFAULT="SUBJECT_TYPE_DEFAULT",n.SUBJECT_TYPE_PERSON="SUBJECT_TYPE_PERSON",n.SUBJECT_TYPE_ANIMAL="SUBJECT_TYPE_ANIMAL",n.SUBJECT_TYPE_PRODUCT="SUBJECT_TYPE_PRODUCT"})(Tc||(Tc={}));var xc;(function(n){n.EDIT_MODE_DEFAULT="EDIT_MODE_DEFAULT",n.EDIT_MODE_INPAINT_REMOVAL="EDIT_MODE_INPAINT_REMOVAL",n.EDIT_MODE_INPAINT_INSERTION="EDIT_MODE_INPAINT_INSERTION",n.EDIT_MODE_OUTPAINT="EDIT_MODE_OUTPAINT",n.EDIT_MODE_CONTROLLED_EDITING="EDIT_MODE_CONTROLLED_EDITING",n.EDIT_MODE_STYLE="EDIT_MODE_STYLE",n.EDIT_MODE_BGSWAP="EDIT_MODE_BGSWAP",n.EDIT_MODE_PRODUCT_IMAGE="EDIT_MODE_PRODUCT_IMAGE"})(xc||(xc={}));var Mc;(function(n){n.FOREGROUND="FOREGROUND",n.BACKGROUND="BACKGROUND",n.PROMPT="PROMPT",n.SEMANTIC="SEMANTIC",n.INTERACTIVE="INTERACTIVE"})(Mc||(Mc={}));var Ac;(function(n){n.ASSET="ASSET",n.STYLE="STYLE"})(Ac||(Ac={}));var Cc;(function(n){n.INSERT="INSERT",n.REMOVE="REMOVE",n.REMOVE_STATIC="REMOVE_STATIC",n.OUTPAINT="OUTPAINT"})(Cc||(Cc={}));var wc;(function(n){n.OPTIMIZED="OPTIMIZED",n.LOSSLESS="LOSSLESS"})(wc||(wc={}));var Rc;(function(n){n.SUPERVISED_FINE_TUNING="SUPERVISED_FINE_TUNING",n.PREFERENCE_TUNING="PREFERENCE_TUNING",n.DISTILLATION="DISTILLATION"})(Rc||(Rc={}));var Ic;(function(n){n.STATE_UNSPECIFIED="STATE_UNSPECIFIED",n.STATE_PENDING="STATE_PENDING",n.STATE_ACTIVE="STATE_ACTIVE",n.STATE_FAILED="STATE_FAILED"})(Ic||(Ic={}));var bc;(function(n){n.STATE_UNSPECIFIED="STATE_UNSPECIFIED",n.PROCESSING="PROCESSING",n.ACTIVE="ACTIVE",n.FAILED="FAILED"})(bc||(bc={}));var Pc;(function(n){n.SOURCE_UNSPECIFIED="SOURCE_UNSPECIFIED",n.UPLOADED="UPLOADED",n.GENERATED="GENERATED",n.REGISTERED="REGISTERED"})(Pc||(Pc={}));var Dc;(function(n){n.TURN_COMPLETE_REASON_UNSPECIFIED="TURN_COMPLETE_REASON_UNSPECIFIED",n.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",n.RESPONSE_REJECTED="RESPONSE_REJECTED",n.NEED_MORE_INPUT="NEED_MORE_INPUT"})(Dc||(Dc={}));var Nc;(function(n){n.MODALITY_UNSPECIFIED="MODALITY_UNSPECIFIED",n.TEXT="TEXT",n.IMAGE="IMAGE",n.VIDEO="VIDEO",n.AUDIO="AUDIO",n.DOCUMENT="DOCUMENT"})(Nc||(Nc={}));var Uc;(function(n){n.VAD_SIGNAL_TYPE_UNSPECIFIED="VAD_SIGNAL_TYPE_UNSPECIFIED",n.VAD_SIGNAL_TYPE_SOS="VAD_SIGNAL_TYPE_SOS",n.VAD_SIGNAL_TYPE_EOS="VAD_SIGNAL_TYPE_EOS"})(Uc||(Uc={}));var Lc;(function(n){n.TYPE_UNSPECIFIED="TYPE_UNSPECIFIED",n.ACTIVITY_START="ACTIVITY_START",n.ACTIVITY_END="ACTIVITY_END"})(Lc||(Lc={}));var Fc;(function(n){n.START_SENSITIVITY_UNSPECIFIED="START_SENSITIVITY_UNSPECIFIED",n.START_SENSITIVITY_HIGH="START_SENSITIVITY_HIGH",n.START_SENSITIVITY_LOW="START_SENSITIVITY_LOW"})(Fc||(Fc={}));var Bc;(function(n){n.END_SENSITIVITY_UNSPECIFIED="END_SENSITIVITY_UNSPECIFIED",n.END_SENSITIVITY_HIGH="END_SENSITIVITY_HIGH",n.END_SENSITIVITY_LOW="END_SENSITIVITY_LOW"})(Bc||(Bc={}));var Oc;(function(n){n.ACTIVITY_HANDLING_UNSPECIFIED="ACTIVITY_HANDLING_UNSPECIFIED",n.START_OF_ACTIVITY_INTERRUPTS="START_OF_ACTIVITY_INTERRUPTS",n.NO_INTERRUPTION="NO_INTERRUPTION"})(Oc||(Oc={}));var kc;(function(n){n.TURN_COVERAGE_UNSPECIFIED="TURN_COVERAGE_UNSPECIFIED",n.TURN_INCLUDES_ONLY_ACTIVITY="TURN_INCLUDES_ONLY_ACTIVITY",n.TURN_INCLUDES_ALL_INPUT="TURN_INCLUDES_ALL_INPUT"})(kc||(kc={}));var Gc;(function(n){n.SCALE_UNSPECIFIED="SCALE_UNSPECIFIED",n.C_MAJOR_A_MINOR="C_MAJOR_A_MINOR",n.D_FLAT_MAJOR_B_FLAT_MINOR="D_FLAT_MAJOR_B_FLAT_MINOR",n.D_MAJOR_B_MINOR="D_MAJOR_B_MINOR",n.E_FLAT_MAJOR_C_MINOR="E_FLAT_MAJOR_C_MINOR",n.E_MAJOR_D_FLAT_MINOR="E_MAJOR_D_FLAT_MINOR",n.F_MAJOR_D_MINOR="F_MAJOR_D_MINOR",n.G_FLAT_MAJOR_E_FLAT_MINOR="G_FLAT_MAJOR_E_FLAT_MINOR",n.G_MAJOR_E_MINOR="G_MAJOR_E_MINOR",n.A_FLAT_MAJOR_F_MINOR="A_FLAT_MAJOR_F_MINOR",n.A_MAJOR_G_FLAT_MINOR="A_MAJOR_G_FLAT_MINOR",n.B_FLAT_MAJOR_G_MINOR="B_FLAT_MAJOR_G_MINOR",n.B_MAJOR_A_FLAT_MINOR="B_MAJOR_A_FLAT_MINOR"})(Gc||(Gc={}));var Vc;(function(n){n.MUSIC_GENERATION_MODE_UNSPECIFIED="MUSIC_GENERATION_MODE_UNSPECIFIED",n.QUALITY="QUALITY",n.DIVERSITY="DIVERSITY",n.VOCALIZATION="VOCALIZATION"})(Vc||(Vc={}));var Hi;(function(n){n.PLAYBACK_CONTROL_UNSPECIFIED="PLAYBACK_CONTROL_UNSPECIFIED",n.PLAY="PLAY",n.PAUSE="PAUSE",n.STOP="STOP",n.RESET_CONTEXT="RESET_CONTEXT"})(Hi||(Hi={}));class sa{constructor(e){const t={};for(const i of e.headers.entries())t[i[0]]=i[1];this.headers=t,this.responseInternal=e}json(){return this.responseInternal.json()}}class vo{get text(){var e,t,i,o,r,s,a,u;if(((o=(i=(t=(e=this.candidates)===null||e===void 0?void 0:e[0])===null||t===void 0?void 0:t.content)===null||i===void 0?void 0:i.parts)===null||o===void 0?void 0:o.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning text from the first one.");let c="",f=!1;const h=[];for(const p of(u=(a=(s=(r=this.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content)===null||a===void 0?void 0:a.parts)!==null&&u!==void 0?u:[]){for(const[m,S]of Object.entries(p))m!=="text"&&m!=="thought"&&m!=="thoughtSignature"&&(S!==null||S!==void 0)&&h.push(m);if(typeof p.text=="string"){if(typeof p.thought=="boolean"&&p.thought)continue;f=!0,c+=p.text}}return h.length>0&&console.warn(`there are non-text parts ${h} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),f?c:void 0}get data(){var e,t,i,o,r,s,a,u;if(((o=(i=(t=(e=this.candidates)===null||e===void 0?void 0:e[0])===null||t===void 0?void 0:t.content)===null||i===void 0?void 0:i.parts)===null||o===void 0?void 0:o.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning data from the first one.");let c="";const f=[];for(const h of(u=(a=(s=(r=this.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content)===null||a===void 0?void 0:a.parts)!==null&&u!==void 0?u:[]){for(const[p,m]of Object.entries(h))p!=="inlineData"&&(m!==null||m!==void 0)&&f.push(p);h.inlineData&&typeof h.inlineData.data=="string"&&(c+=atob(h.inlineData.data))}return f.length>0&&console.warn(`there are non-data parts ${f} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),c.length>0?btoa(c):void 0}get functionCalls(){var e,t,i,o,r,s,a,u;if(((o=(i=(t=(e=this.candidates)===null||e===void 0?void 0:e[0])===null||t===void 0?void 0:t.content)===null||i===void 0?void 0:i.parts)===null||o===void 0?void 0:o.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning function calls from the first one.");const c=(u=(a=(s=(r=this.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content)===null||a===void 0?void 0:a.parts)===null||u===void 0?void 0:u.filter(f=>f.functionCall).map(f=>f.functionCall).filter(f=>f!==void 0);if((c==null?void 0:c.length)!==0)return c}get executableCode(){var e,t,i,o,r,s,a,u,c;if(((o=(i=(t=(e=this.candidates)===null||e===void 0?void 0:e[0])===null||t===void 0?void 0:t.content)===null||i===void 0?void 0:i.parts)===null||o===void 0?void 0:o.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning executable code from the first one.");const f=(u=(a=(s=(r=this.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content)===null||a===void 0?void 0:a.parts)===null||u===void 0?void 0:u.filter(h=>h.executableCode).map(h=>h.executableCode).filter(h=>h!==void 0);if((f==null?void 0:f.length)!==0)return(c=f==null?void 0:f[0])===null||c===void 0?void 0:c.code}get codeExecutionResult(){var e,t,i,o,r,s,a,u,c;if(((o=(i=(t=(e=this.candidates)===null||e===void 0?void 0:e[0])===null||t===void 0?void 0:t.content)===null||i===void 0?void 0:i.parts)===null||o===void 0?void 0:o.length)===0)return;this.candidates&&this.candidates.length>1&&console.warn("there are multiple candidates in the response, returning code execution result from the first one.");const f=(u=(a=(s=(r=this.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content)===null||a===void 0?void 0:a.parts)===null||u===void 0?void 0:u.filter(h=>h.codeExecutionResult).map(h=>h.codeExecutionResult).filter(h=>h!==void 0);if((f==null?void 0:f.length)!==0)return(c=f==null?void 0:f[0])===null||c===void 0?void 0:c.output}}class Hc{}class zc{}class Xh{}class Yh{}class Jh{}class Kh{}class Wc{}class qc{}class $c{}class Zh{}class Or{_fromAPIResponse({apiResponse:e,_isVertexAI:t}){const i=new Or;let o;const r=e;return t?o=Lh(r):o=Uh(r),Object.assign(i,o),i}}class Xc{}class Yc{}class Jc{}class Kc{}class Qh{}class jh{}class ep{}class cl{_fromAPIResponse({apiResponse:e,_isVertexAI:t}){const i=new cl,r=Hh(e);return Object.assign(i,r),i}}class tp{}class np{}class ip{}class op{}class Zc{}class rp{get text(){var e,t,i;let o="",r=!1;const s=[];for(const a of(i=(t=(e=this.serverContent)===null||e===void 0?void 0:e.modelTurn)===null||t===void 0?void 0:t.parts)!==null&&i!==void 0?i:[]){for(const[u,c]of Object.entries(a))u!=="text"&&u!=="thought"&&c!==null&&s.push(u);if(typeof a.text=="string"){if(typeof a.thought=="boolean"&&a.thought)continue;r=!0,o+=a.text}}return s.length>0&&console.warn(`there are non-text parts ${s} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`),r?o:void 0}get data(){var e,t,i;let o="";const r=[];for(const s of(i=(t=(e=this.serverContent)===null||e===void 0?void 0:e.modelTurn)===null||t===void 0?void 0:t.parts)!==null&&i!==void 0?i:[]){for(const[a,u]of Object.entries(s))a!=="inlineData"&&u!==null&&r.push(a);s.inlineData&&typeof s.inlineData.data=="string"&&(o+=atob(s.inlineData.data))}return r.length>0&&console.warn(`there are non-data parts ${r} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`),o.length>0?btoa(o):void 0}}class sp{get audioChunk(){if(this.serverContent&&this.serverContent.audioChunks&&this.serverContent.audioChunks.length>0)return this.serverContent.audioChunks[0]}}class ul{_fromAPIResponse({apiResponse:e,_isVertexAI:t}){const i=new ul,r=Fd(e);return Object.assign(i,r),i}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function lt(n,e){if(!e||typeof e!="string")throw new Error("model is required and must be a string");if(e.includes("..")||e.includes("?")||e.includes("&"))throw new Error("invalid model parameter");if(n.isVertexAI()){if(e.startsWith("publishers/")||e.startsWith("projects/")||e.startsWith("models/"))return e;if(e.indexOf("/")>=0){const t=e.split("/",2);return`publishers/${t[0]}/models/${t[1]}`}else return`publishers/google/models/${e}`}else return e.startsWith("models/")||e.startsWith("tunedModels/")?e:`models/${e}`}function Bd(n,e){const t=lt(n,e);return t?t.startsWith("publishers/")&&n.isVertexAI()?`projects/${n.getProject()}/locations/${n.getLocation()}/${t}`:t.startsWith("models/")&&n.isVertexAI()?`projects/${n.getProject()}/locations/${n.getLocation()}/publishers/google/${t}`:t:""}function Od(n){return Array.isArray(n)?n.map(e=>kr(e)):[kr(n)]}function kr(n){if(typeof n=="object"&&n!==null)return n;throw new Error(`Could not parse input as Blob. Unsupported blob type: ${typeof n}`)}function kd(n){const e=kr(n);if(e.mimeType&&e.mimeType.startsWith("image/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}function Gd(n){const e=kr(n);if(e.mimeType&&e.mimeType.startsWith("audio/"))return e;throw new Error(`Unsupported mime type: ${e.mimeType}`)}function Qc(n){if(n==null)throw new Error("PartUnion is required");if(typeof n=="object")return n;if(typeof n=="string")return{text:n};throw new Error(`Unsupported part type: ${typeof n}`)}function Vd(n){if(n==null||Array.isArray(n)&&n.length===0)throw new Error("PartListUnion is required");return Array.isArray(n)?n.map(e=>Qc(e)):[Qc(n)]}function aa(n){return n!=null&&typeof n=="object"&&"parts"in n&&Array.isArray(n.parts)}function jc(n){return n!=null&&typeof n=="object"&&"functionCall"in n}function eu(n){return n!=null&&typeof n=="object"&&"functionResponse"in n}function Dt(n){if(n==null)throw new Error("ContentUnion is required");return aa(n)?n:{role:"user",parts:Vd(n)}}function dl(n,e){if(!e)return[];if(n.isVertexAI()&&Array.isArray(e))return e.flatMap(t=>{const i=Dt(t);return i.parts&&i.parts.length>0&&i.parts[0].text!==void 0?[i.parts[0].text]:[]});if(n.isVertexAI()){const t=Dt(e);return t.parts&&t.parts.length>0&&t.parts[0].text!==void 0?[t.parts[0].text]:[]}return Array.isArray(e)?e.map(t=>Dt(t)):[Dt(e)]}function Qt(n){if(n==null||Array.isArray(n)&&n.length===0)throw new Error("contents are required");if(!Array.isArray(n)){if(jc(n)||eu(n))throw new Error("To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them");return[Dt(n)]}const e=[],t=[],i=aa(n[0]);for(const o of n){const r=aa(o);if(r!=i)throw new Error("Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them");if(r)e.push(o);else{if(jc(o)||eu(o))throw new Error("To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them");t.push(o)}}return i||e.push({role:"user",parts:Vd(t)}),e}function ap(n,e){n.includes("null")&&(e.nullable=!0);const t=n.filter(i=>i!=="null");if(t.length===1)e.type=Object.values(Xt).includes(t[0].toUpperCase())?t[0].toUpperCase():Xt.TYPE_UNSPECIFIED;else{e.anyOf=[];for(const i of t)e.anyOf.push({type:Object.values(Xt).includes(i.toUpperCase())?i.toUpperCase():Xt.TYPE_UNSPECIFIED})}}function $i(n){const e={},t=["items"],i=["anyOf"],o=["properties"];if(n.type&&n.anyOf)throw new Error("type and anyOf cannot be both populated.");const r=n.anyOf;r!=null&&r.length==2&&(r[0].type==="null"?(e.nullable=!0,n=r[1]):r[1].type==="null"&&(e.nullable=!0,n=r[0])),n.type instanceof Array&&ap(n.type,e);for(const[s,a]of Object.entries(n))if(a!=null)if(s=="type"){if(a==="null")throw new Error("type: null can not be the only possible type for the field.");if(a instanceof Array)continue;e.type=Object.values(Xt).includes(a.toUpperCase())?a.toUpperCase():Xt.TYPE_UNSPECIFIED}else if(t.includes(s))e[s]=$i(a);else if(i.includes(s)){const u=[];for(const c of a){if(c.type=="null"){e.nullable=!0;continue}u.push($i(c))}e[s]=u}else if(o.includes(s)){const u={};for(const[c,f]of Object.entries(a))u[c]=$i(f);e[s]=u}else{if(s==="additionalProperties")continue;e[s]=a}return e}function fl(n){return $i(n)}function hl(n){if(typeof n=="object")return n;if(typeof n=="string")return{voiceConfig:{prebuiltVoiceConfig:{voiceName:n}}};throw new Error(`Unsupported speechConfig type: ${typeof n}`)}function pl(n){if("multiSpeakerVoiceConfig"in n)throw new Error("multiSpeakerVoiceConfig is not supported in the live API.");return n}function ro(n){if(n.functionDeclarations)for(const e of n.functionDeclarations)e.parameters&&(Object.keys(e.parameters).includes("$schema")?e.parametersJsonSchema||(e.parametersJsonSchema=e.parameters,delete e.parameters):e.parameters=$i(e.parameters)),e.response&&(Object.keys(e.response).includes("$schema")?e.responseJsonSchema||(e.responseJsonSchema=e.response,delete e.response):e.response=$i(e.response));return n}function so(n){if(n==null)throw new Error("tools is required");if(!Array.isArray(n))throw new Error("tools is required and must be an array of Tools");const e=[];for(const t of n)e.push(t);return e}function lp(n,e,t,i=1){const o=!e.startsWith(`${t}/`)&&e.split("/").length===i;return n.isVertexAI()?e.startsWith("projects/")?e:e.startsWith("locations/")?`projects/${n.getProject()}/${e}`:e.startsWith(`${t}/`)?`projects/${n.getProject()}/locations/${n.getLocation()}/${e}`:o?`projects/${n.getProject()}/locations/${n.getLocation()}/${t}/${e}`:e:o?`${t}/${e}`:e}function qn(n,e){if(typeof e!="string")throw new Error("name must be a string");return lp(n,e,"cachedContents")}function Hd(n){switch(n){case"STATE_UNSPECIFIED":return"JOB_STATE_UNSPECIFIED";case"CREATING":return"JOB_STATE_RUNNING";case"ACTIVE":return"JOB_STATE_SUCCEEDED";case"FAILED":return"JOB_STATE_FAILED";default:return n}}function si(n){return ll(n)}function cp(n){return n!=null&&typeof n=="object"&&"name"in n}function up(n){return n!=null&&typeof n=="object"&&"video"in n}function dp(n){return n!=null&&typeof n=="object"&&"uri"in n}function zd(n){var e;let t;if(cp(n)&&(t=n.name),!(dp(n)&&(t=n.uri,t===void 0))&&!(up(n)&&(t=(e=n.video)===null||e===void 0?void 0:e.uri,t===void 0))){if(typeof n=="string"&&(t=n),t===void 0)throw new Error("Could not extract file name from the provided input.");if(t.startsWith("https://")){const o=t.split("files/")[1].match(/[a-z0-9]+/);if(o===null)throw new Error(`Could not extract file name from URI ${t}`);t=o[0]}else t.startsWith("files/")&&(t=t.split("files/")[1]);return t}}function Wd(n,e){let t;return n.isVertexAI()?t=e?"publishers/google/models":"models":t=e?"models":"tunedModels",t}function qd(n){for(const e of["models","tunedModels","publisherModels"])if(fp(n,e))return n[e];return[]}function fp(n,e){return n!==null&&typeof n=="object"&&e in n}function hp(n,e={}){const t=n,i={name:t.name,description:t.description,parametersJsonSchema:t.inputSchema};return t.outputSchema&&(i.responseJsonSchema=t.outputSchema),e.behavior&&(i.behavior=e.behavior),{functionDeclarations:[i]}}function pp(n,e={}){const t=[],i=new Set;for(const o of n){const r=o.name;if(i.has(r))throw new Error(`Duplicate function name ${r} found in MCP tools. Please ensure function names are unique.`);i.add(r);const s=hp(o,e);s.functionDeclarations&&t.push(...s.functionDeclarations)}return{functionDeclarations:t}}function $d(n,e){let t;if(typeof e=="string")if(n.isVertexAI())if(e.startsWith("gs://"))t={format:"jsonl",gcsUri:[e]};else if(e.startsWith("bq://"))t={format:"bigquery",bigqueryUri:e};else throw new Error(`Unsupported string source for Vertex AI: ${e}`);else if(e.startsWith("files/"))t={fileName:e};else throw new Error(`Unsupported string source for Gemini API: ${e}`);else if(Array.isArray(e)){if(n.isVertexAI())throw new Error("InlinedRequest[] is not supported in Vertex AI.");t={inlinedRequests:e}}else t=e;const i=[t.gcsUri,t.bigqueryUri].filter(Boolean).length,o=[t.inlinedRequests,t.fileName].filter(Boolean).length;if(n.isVertexAI()){if(o>0||i!==1)throw new Error("Exactly one of `gcsUri` or `bigqueryUri` must be set for Vertex AI.")}else if(i>0||o!==1)throw new Error("Exactly one of `inlinedRequests`, `fileName`, must be set for Gemini API.");return t}function mp(n){if(typeof n!="string")return n;const e=n;if(e.startsWith("gs://"))return{format:"jsonl",gcsUri:e};if(e.startsWith("bq://"))return{format:"bigquery",bigqueryUri:e};throw new Error(`Unsupported destination: ${e}`)}function Xd(n){if(typeof n!="object"||n===null)return{};const e=n,t=e.inlinedResponses;if(typeof t!="object"||t===null)return n;const o=t.inlinedResponses;if(!Array.isArray(o)||o.length===0)return n;let r=!1;for(const s of o){if(typeof s!="object"||s===null)continue;const u=s.response;if(typeof u!="object"||u===null)continue;if(u.embedding!==void 0){r=!0;break}}return r&&(e.inlinedEmbedContentResponses=e.inlinedResponses,delete e.inlinedResponses),n}function ao(n,e){const t=e;if(!n.isVertexAI()){if(/batches\/[^/]+$/.test(t))return t.split("/").pop();throw new Error(`Invalid batch job name: ${t}.`)}if(/^projects\/[^/]+\/locations\/[^/]+\/batchPredictionJobs\/[^/]+$/.test(t))return t.split("/").pop();if(/^\d+$/.test(t))return t;throw new Error(`Invalid batch job name: ${t}.`)}function Yd(n){const e=n;return e==="BATCH_STATE_UNSPECIFIED"?"JOB_STATE_UNSPECIFIED":e==="BATCH_STATE_PENDING"?"JOB_STATE_PENDING":e==="BATCH_STATE_RUNNING"?"JOB_STATE_RUNNING":e==="BATCH_STATE_SUCCEEDED"?"JOB_STATE_SUCCEEDED":e==="BATCH_STATE_FAILED"?"JOB_STATE_FAILED":e==="BATCH_STATE_CANCELLED"?"JOB_STATE_CANCELLED":e==="BATCH_STATE_EXPIRED"?"JOB_STATE_EXPIRED":e}function gp(n){return n.includes("gemini")&&n!=="gemini-embedding-001"||n.includes("maas")}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function _p(n){const e={},t=l(n,["apiKey"]);if(t!=null&&d(e,["apiKey"],t),l(n,["apiKeyConfig"])!==void 0)throw new Error("apiKeyConfig parameter is not supported in Gemini API.");if(l(n,["authType"])!==void 0)throw new Error("authType parameter is not supported in Gemini API.");if(l(n,["googleServiceAccountConfig"])!==void 0)throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");if(l(n,["httpBasicAuthConfig"])!==void 0)throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");if(l(n,["oauthConfig"])!==void 0)throw new Error("oauthConfig parameter is not supported in Gemini API.");if(l(n,["oidcConfig"])!==void 0)throw new Error("oidcConfig parameter is not supported in Gemini API.");return e}function vp(n){const e={},t=l(n,["responsesFile"]);t!=null&&d(e,["fileName"],t);const i=l(n,["inlinedResponses","inlinedResponses"]);if(i!=null){let r=i;Array.isArray(r)&&(r=r.map(s=>Qp(s))),d(e,["inlinedResponses"],r)}const o=l(n,["inlinedEmbedContentResponses","inlinedResponses"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["inlinedEmbedContentResponses"],r)}return e}function yp(n){const e={},t=l(n,["predictionsFormat"]);t!=null&&d(e,["format"],t);const i=l(n,["gcsDestination","outputUriPrefix"]);i!=null&&d(e,["gcsUri"],i);const o=l(n,["bigqueryDestination","outputUri"]);return o!=null&&d(e,["bigqueryUri"],o),e}function Sp(n){const e={},t=l(n,["format"]);t!=null&&d(e,["predictionsFormat"],t);const i=l(n,["gcsUri"]);i!=null&&d(e,["gcsDestination","outputUriPrefix"],i);const o=l(n,["bigqueryUri"]);if(o!=null&&d(e,["bigqueryDestination","outputUri"],o),l(n,["fileName"])!==void 0)throw new Error("fileName parameter is not supported in Vertex AI.");if(l(n,["inlinedResponses"])!==void 0)throw new Error("inlinedResponses parameter is not supported in Vertex AI.");if(l(n,["inlinedEmbedContentResponses"])!==void 0)throw new Error("inlinedEmbedContentResponses parameter is not supported in Vertex AI.");return e}function Cr(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata","displayName"]);i!=null&&d(e,["displayName"],i);const o=l(n,["metadata","state"]);o!=null&&d(e,["state"],Yd(o));const r=l(n,["metadata","createTime"]);r!=null&&d(e,["createTime"],r);const s=l(n,["metadata","endTime"]);s!=null&&d(e,["endTime"],s);const a=l(n,["metadata","updateTime"]);a!=null&&d(e,["updateTime"],a);const u=l(n,["metadata","model"]);u!=null&&d(e,["model"],u);const c=l(n,["metadata","output"]);return c!=null&&d(e,["dest"],vp(Xd(c))),e}function la(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["displayName"]);i!=null&&d(e,["displayName"],i);const o=l(n,["state"]);o!=null&&d(e,["state"],Yd(o));const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["createTime"]);s!=null&&d(e,["createTime"],s);const a=l(n,["startTime"]);a!=null&&d(e,["startTime"],a);const u=l(n,["endTime"]);u!=null&&d(e,["endTime"],u);const c=l(n,["updateTime"]);c!=null&&d(e,["updateTime"],c);const f=l(n,["model"]);f!=null&&d(e,["model"],f);const h=l(n,["inputConfig"]);h!=null&&d(e,["src"],Ep(h));const p=l(n,["outputConfig"]);p!=null&&d(e,["dest"],yp(Xd(p)));const m=l(n,["completionStats"]);return m!=null&&d(e,["completionStats"],m),e}function Ep(n){const e={},t=l(n,["instancesFormat"]);t!=null&&d(e,["format"],t);const i=l(n,["gcsSource","uris"]);i!=null&&d(e,["gcsUri"],i);const o=l(n,["bigquerySource","inputUri"]);return o!=null&&d(e,["bigqueryUri"],o),e}function Tp(n,e){const t={};if(l(e,["format"])!==void 0)throw new Error("format parameter is not supported in Gemini API.");if(l(e,["gcsUri"])!==void 0)throw new Error("gcsUri parameter is not supported in Gemini API.");if(l(e,["bigqueryUri"])!==void 0)throw new Error("bigqueryUri parameter is not supported in Gemini API.");const i=l(e,["fileName"]);i!=null&&d(t,["fileName"],i);const o=l(e,["inlinedRequests"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>Zp(n,s))),d(t,["requests","requests"],r)}return t}function xp(n){const e={},t=l(n,["format"]);t!=null&&d(e,["instancesFormat"],t);const i=l(n,["gcsUri"]);i!=null&&d(e,["gcsSource","uris"],i);const o=l(n,["bigqueryUri"]);if(o!=null&&d(e,["bigquerySource","inputUri"],o),l(n,["fileName"])!==void 0)throw new Error("fileName parameter is not supported in Vertex AI.");if(l(n,["inlinedRequests"])!==void 0)throw new Error("inlinedRequests parameter is not supported in Vertex AI.");return e}function Mp(n){const e={},t=l(n,["data"]);if(t!=null&&d(e,["data"],t),l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function Ap(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function Cp(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function wp(n){const e={},t=l(n,["content"]);t!=null&&d(e,["content"],t);const i=l(n,["citationMetadata"]);i!=null&&d(e,["citationMetadata"],Rp(i));const o=l(n,["tokenCount"]);o!=null&&d(e,["tokenCount"],o);const r=l(n,["finishReason"]);r!=null&&d(e,["finishReason"],r);const s=l(n,["groundingMetadata"]);s!=null&&d(e,["groundingMetadata"],s);const a=l(n,["avgLogprobs"]);a!=null&&d(e,["avgLogprobs"],a);const u=l(n,["index"]);u!=null&&d(e,["index"],u);const c=l(n,["logprobsResult"]);c!=null&&d(e,["logprobsResult"],c);const f=l(n,["safetyRatings"]);if(f!=null){let p=f;Array.isArray(p)&&(p=p.map(m=>m)),d(e,["safetyRatings"],p)}const h=l(n,["urlContextMetadata"]);return h!=null&&d(e,["urlContextMetadata"],h),e}function Rp(n){const e={},t=l(n,["citationSources"]);if(t!=null){let i=t;Array.isArray(i)&&(i=i.map(o=>o)),d(e,["citations"],i)}return e}function Jd(n){const e={},t=l(n,["parts"]);if(t!=null){let o=t;Array.isArray(o)&&(o=o.map(r=>rm(r))),d(e,["parts"],o)}const i=l(n,["role"]);return i!=null&&d(e,["role"],i),e}function Ip(n,e){const t={},i=l(n,["displayName"]);if(e!==void 0&&i!=null&&d(e,["batch","displayName"],i),l(n,["dest"])!==void 0)throw new Error("dest parameter is not supported in Gemini API.");return t}function bp(n,e){const t={},i=l(n,["displayName"]);e!==void 0&&i!=null&&d(e,["displayName"],i);const o=l(n,["dest"]);return e!==void 0&&o!=null&&d(e,["outputConfig"],Sp(mp(o))),t}function tu(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["_url","model"],lt(n,i));const o=l(e,["src"]);o!=null&&d(t,["batch","inputConfig"],Tp(n,$d(n,o)));const r=l(e,["config"]);return r!=null&&Ip(r,t),t}function Pp(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["model"],lt(n,i));const o=l(e,["src"]);o!=null&&d(t,["inputConfig"],xp($d(n,o)));const r=l(e,["config"]);return r!=null&&bp(r,t),t}function Dp(n,e){const t={},i=l(n,["displayName"]);return e!==void 0&&i!=null&&d(e,["batch","displayName"],i),t}function Np(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["_url","model"],lt(n,i));const o=l(e,["src"]);o!=null&&d(t,["batch","inputConfig"],Gp(n,o));const r=l(e,["config"]);return r!=null&&Dp(r,t),t}function Up(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function Lp(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function Fp(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["name"]);i!=null&&d(e,["name"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);return r!=null&&d(e,["error"],r),e}function Bp(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["name"]);i!=null&&d(e,["name"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);return r!=null&&d(e,["error"],r),e}function Op(n,e){const t={},i=l(e,["contents"]);if(i!=null){let r=dl(n,i);Array.isArray(r)&&(r=r.map(s=>s)),d(t,["requests[]","request","content"],r)}const o=l(e,["config"]);return o!=null&&(d(t,["_self"],kp(o,t)),Dh(t,{"requests[].*":"requests[].request.*"})),t}function kp(n,e){const t={},i=l(n,["taskType"]);e!==void 0&&i!=null&&d(e,["requests[]","taskType"],i);const o=l(n,["title"]);e!==void 0&&o!=null&&d(e,["requests[]","title"],o);const r=l(n,["outputDimensionality"]);if(e!==void 0&&r!=null&&d(e,["requests[]","outputDimensionality"],r),l(n,["mimeType"])!==void 0)throw new Error("mimeType parameter is not supported in Gemini API.");if(l(n,["autoTruncate"])!==void 0)throw new Error("autoTruncate parameter is not supported in Gemini API.");return t}function Gp(n,e){const t={},i=l(e,["fileName"]);i!=null&&d(t,["file_name"],i);const o=l(e,["inlinedRequests"]);return o!=null&&d(t,["requests"],Op(n,o)),t}function Vp(n){const e={};if(l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const t=l(n,["fileUri"]);t!=null&&d(e,["fileUri"],t);const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function Hp(n){const e={},t=l(n,["id"]);t!=null&&d(e,["id"],t);const i=l(n,["args"]);i!=null&&d(e,["args"],i);const o=l(n,["name"]);if(o!=null&&d(e,["name"],o),l(n,["partialArgs"])!==void 0)throw new Error("partialArgs parameter is not supported in Gemini API.");if(l(n,["willContinue"])!==void 0)throw new Error("willContinue parameter is not supported in Gemini API.");return e}function zp(n){const e={},t=l(n,["allowedFunctionNames"]);t!=null&&d(e,["allowedFunctionNames"],t);const i=l(n,["mode"]);if(i!=null&&d(e,["mode"],i),l(n,["streamFunctionCallArguments"])!==void 0)throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");return e}function Wp(n,e,t){const i={},o=l(e,["systemInstruction"]);t!==void 0&&o!=null&&d(t,["systemInstruction"],Jd(Dt(o)));const r=l(e,["temperature"]);r!=null&&d(i,["temperature"],r);const s=l(e,["topP"]);s!=null&&d(i,["topP"],s);const a=l(e,["topK"]);a!=null&&d(i,["topK"],a);const u=l(e,["candidateCount"]);u!=null&&d(i,["candidateCount"],u);const c=l(e,["maxOutputTokens"]);c!=null&&d(i,["maxOutputTokens"],c);const f=l(e,["stopSequences"]);f!=null&&d(i,["stopSequences"],f);const h=l(e,["responseLogprobs"]);h!=null&&d(i,["responseLogprobs"],h);const p=l(e,["logprobs"]);p!=null&&d(i,["logprobs"],p);const m=l(e,["presencePenalty"]);m!=null&&d(i,["presencePenalty"],m);const S=l(e,["frequencyPenalty"]);S!=null&&d(i,["frequencyPenalty"],S);const E=l(e,["seed"]);E!=null&&d(i,["seed"],E);const _=l(e,["responseMimeType"]);_!=null&&d(i,["responseMimeType"],_);const g=l(e,["responseSchema"]);g!=null&&d(i,["responseSchema"],fl(g));const w=l(e,["responseJsonSchema"]);if(w!=null&&d(i,["responseJsonSchema"],w),l(e,["routingConfig"])!==void 0)throw new Error("routingConfig parameter is not supported in Gemini API.");if(l(e,["modelSelectionConfig"])!==void 0)throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const T=l(e,["safetySettings"]);if(t!==void 0&&T!=null){let $=T;Array.isArray($)&&($=$.map(j=>sm(j))),d(t,["safetySettings"],$)}const M=l(e,["tools"]);if(t!==void 0&&M!=null){let $=so(M);Array.isArray($)&&($=$.map(j=>lm(ro(j)))),d(t,["tools"],$)}const L=l(e,["toolConfig"]);if(t!==void 0&&L!=null&&d(t,["toolConfig"],am(L)),l(e,["labels"])!==void 0)throw new Error("labels parameter is not supported in Gemini API.");const I=l(e,["cachedContent"]);t!==void 0&&I!=null&&d(t,["cachedContent"],qn(n,I));const N=l(e,["responseModalities"]);N!=null&&d(i,["responseModalities"],N);const k=l(e,["mediaResolution"]);k!=null&&d(i,["mediaResolution"],k);const A=l(e,["speechConfig"]);if(A!=null&&d(i,["speechConfig"],hl(A)),l(e,["audioTimestamp"])!==void 0)throw new Error("audioTimestamp parameter is not supported in Gemini API.");const x=l(e,["thinkingConfig"]);x!=null&&d(i,["thinkingConfig"],x);const O=l(e,["imageConfig"]);O!=null&&d(i,["imageConfig"],Kp(O));const Y=l(e,["enableEnhancedCivicAnswers"]);if(Y!=null&&d(i,["enableEnhancedCivicAnswers"],Y),l(e,["modelArmorConfig"])!==void 0)throw new Error("modelArmorConfig parameter is not supported in Gemini API.");return i}function qp(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["candidates"]);if(i!=null){let u=i;Array.isArray(u)&&(u=u.map(c=>wp(c))),d(e,["candidates"],u)}const o=l(n,["modelVersion"]);o!=null&&d(e,["modelVersion"],o);const r=l(n,["promptFeedback"]);r!=null&&d(e,["promptFeedback"],r);const s=l(n,["responseId"]);s!=null&&d(e,["responseId"],s);const a=l(n,["usageMetadata"]);return a!=null&&d(e,["usageMetadata"],a),e}function $p(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function Xp(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],ao(n,i)),t}function Yp(n){const e={},t=l(n,["authConfig"]);t!=null&&d(e,["authConfig"],_p(t));const i=l(n,["enableWidget"]);return i!=null&&d(e,["enableWidget"],i),e}function Jp(n){const e={},t=l(n,["searchTypes"]);if(t!=null&&d(e,["searchTypes"],t),l(n,["blockingConfidence"])!==void 0)throw new Error("blockingConfidence parameter is not supported in Gemini API.");if(l(n,["excludeDomains"])!==void 0)throw new Error("excludeDomains parameter is not supported in Gemini API.");const i=l(n,["timeRangeFilter"]);return i!=null&&d(e,["timeRangeFilter"],i),e}function Kp(n){const e={},t=l(n,["aspectRatio"]);t!=null&&d(e,["aspectRatio"],t);const i=l(n,["imageSize"]);if(i!=null&&d(e,["imageSize"],i),l(n,["personGeneration"])!==void 0)throw new Error("personGeneration parameter is not supported in Gemini API.");if(l(n,["prominentPeople"])!==void 0)throw new Error("prominentPeople parameter is not supported in Gemini API.");if(l(n,["outputMimeType"])!==void 0)throw new Error("outputMimeType parameter is not supported in Gemini API.");if(l(n,["outputCompressionQuality"])!==void 0)throw new Error("outputCompressionQuality parameter is not supported in Gemini API.");if(l(n,["imageOutputOptions"])!==void 0)throw new Error("imageOutputOptions parameter is not supported in Gemini API.");return e}function Zp(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["request","model"],lt(n,i));const o=l(e,["contents"]);if(o!=null){let a=Qt(o);Array.isArray(a)&&(a=a.map(u=>Jd(u))),d(t,["request","contents"],a)}const r=l(e,["metadata"]);r!=null&&d(t,["metadata"],r);const s=l(e,["config"]);return s!=null&&d(t,["request","generationConfig"],Wp(n,s,l(t,["request"],{}))),t}function Qp(n){const e={},t=l(n,["response"]);t!=null&&d(e,["response"],qp(t));const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["error"]);return o!=null&&d(e,["error"],o),e}function jp(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);if(e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),l(n,["filter"])!==void 0)throw new Error("filter parameter is not supported in Gemini API.");return t}function em(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);e!==void 0&&o!=null&&d(e,["_query","pageToken"],o);const r=l(n,["filter"]);return e!==void 0&&r!=null&&d(e,["_query","filter"],r),t}function tm(n){const e={},t=l(n,["config"]);return t!=null&&jp(t,e),e}function nm(n){const e={},t=l(n,["config"]);return t!=null&&em(t,e),e}function im(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["operations"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>Cr(s))),d(e,["batchJobs"],r)}return e}function om(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["batchPredictionJobs"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>la(s))),d(e,["batchJobs"],r)}return e}function rm(n){const e={},t=l(n,["mediaResolution"]);t!=null&&d(e,["mediaResolution"],t);const i=l(n,["codeExecutionResult"]);i!=null&&d(e,["codeExecutionResult"],i);const o=l(n,["executableCode"]);o!=null&&d(e,["executableCode"],o);const r=l(n,["fileData"]);r!=null&&d(e,["fileData"],Vp(r));const s=l(n,["functionCall"]);s!=null&&d(e,["functionCall"],Hp(s));const a=l(n,["functionResponse"]);a!=null&&d(e,["functionResponse"],a);const u=l(n,["inlineData"]);u!=null&&d(e,["inlineData"],Mp(u));const c=l(n,["text"]);c!=null&&d(e,["text"],c);const f=l(n,["thought"]);f!=null&&d(e,["thought"],f);const h=l(n,["thoughtSignature"]);h!=null&&d(e,["thoughtSignature"],h);const p=l(n,["videoMetadata"]);return p!=null&&d(e,["videoMetadata"],p),e}function sm(n){const e={},t=l(n,["category"]);if(t!=null&&d(e,["category"],t),l(n,["method"])!==void 0)throw new Error("method parameter is not supported in Gemini API.");const i=l(n,["threshold"]);return i!=null&&d(e,["threshold"],i),e}function am(n){const e={},t=l(n,["retrievalConfig"]);t!=null&&d(e,["retrievalConfig"],t);const i=l(n,["functionCallingConfig"]);return i!=null&&d(e,["functionCallingConfig"],zp(i)),e}function lm(n){const e={};if(l(n,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");const t=l(n,["computerUse"]);t!=null&&d(e,["computerUse"],t);const i=l(n,["fileSearch"]);i!=null&&d(e,["fileSearch"],i);const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],Jp(o));const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],Yp(r));const s=l(n,["codeExecution"]);if(s!=null&&d(e,["codeExecution"],s),l(n,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");const a=l(n,["functionDeclarations"]);if(a!=null){let h=a;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["functionDeclarations"],h)}const u=l(n,["googleSearchRetrieval"]);if(u!=null&&d(e,["googleSearchRetrieval"],u),l(n,["parallelAiSearch"])!==void 0)throw new Error("parallelAiSearch parameter is not supported in Gemini API.");const c=l(n,["urlContext"]);c!=null&&d(e,["urlContext"],c);const f=l(n,["mcpServers"]);if(f!=null){let h=f;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["mcpServers"],h)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var zn;(function(n){n.PAGED_ITEM_BATCH_JOBS="batchJobs",n.PAGED_ITEM_MODELS="models",n.PAGED_ITEM_TUNING_JOBS="tuningJobs",n.PAGED_ITEM_FILES="files",n.PAGED_ITEM_CACHED_CONTENTS="cachedContents",n.PAGED_ITEM_FILE_SEARCH_STORES="fileSearchStores",n.PAGED_ITEM_DOCUMENTS="documents"})(zn||(zn={}));class Mi{constructor(e,t,i,o){this.pageInternal=[],this.paramsInternal={},this.requestInternal=t,this.init(e,i,o)}init(e,t,i){var o,r;this.nameInternal=e,this.pageInternal=t[this.nameInternal]||[],this.sdkHttpResponseInternal=t==null?void 0:t.sdkHttpResponse,this.idxInternal=0;let s={config:{}};!i||Object.keys(i).length===0?s={config:{}}:typeof i=="object"?s=Object.assign({},i):s=i,s.config&&(s.config.pageToken=t.nextPageToken),this.paramsInternal=s,this.pageInternalSize=(r=(o=s.config)===null||o===void 0?void 0:o.pageSize)!==null&&r!==void 0?r:this.pageInternal.length}initNextPage(e){this.init(this.nameInternal,e,this.paramsInternal)}get page(){return this.pageInternal}get name(){return this.nameInternal}get pageSize(){return this.pageInternalSize}get sdkHttpResponse(){return this.sdkHttpResponseInternal}get params(){return this.paramsInternal}get pageLength(){return this.pageInternal.length}getItem(e){return this.pageInternal[e]}[Symbol.asyncIterator](){return{next:async()=>{if(this.idxInternal>=this.pageLength)if(this.hasNextPage())await this.nextPage();else return{value:void 0,done:!0};const e=this.getItem(this.idxInternal);return this.idxInternal+=1,{value:e,done:!1}},return:async()=>({value:void 0,done:!0})}}async nextPage(){if(!this.hasNextPage())throw new Error("No more pages to fetch.");const e=await this.requestInternal(this.params);return this.initNextPage(e),this.page}hasNextPage(){var e;return((e=this.params.config)===null||e===void 0?void 0:e.pageToken)!==void 0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class cm extends Wn{constructor(e){super(),this.apiClient=e,this.list=async(t={})=>new Mi(zn.PAGED_ITEM_BATCH_JOBS,i=>this.listInternal(i),await this.listInternal(t),t),this.create=async t=>(this.apiClient.isVertexAI()&&(t.config=this.formatDestination(t.src,t.config)),this.createInternal(t)),this.createEmbeddings=async t=>{if(console.warn("batches.createEmbeddings() is experimental and may change without notice."),this.apiClient.isVertexAI())throw new Error("Vertex AI does not support batches.createEmbeddings.");return this.createEmbeddingsInternal(t)}}createInlinedGenerateContentRequest(e){const t=tu(this.apiClient,e),i=t._url,o=Ee("{model}:batchGenerateContent",i),a=t.batch.inputConfig.requests,u=a.requests,c=[];for(const f of u){const h=Object.assign({},f);if(h.systemInstruction){const p=h.systemInstruction;delete h.systemInstruction;const m=h.request;m.systemInstruction=p,h.request=m}c.push(h)}return a.requests=c,delete t.config,delete t._url,delete t._query,{path:o,body:t}}getGcsUri(e){if(typeof e=="string")return e.startsWith("gs://")?e:void 0;if(!Array.isArray(e)&&e.gcsUri&&e.gcsUri.length>0)return e.gcsUri[0]}getBigqueryUri(e){if(typeof e=="string")return e.startsWith("bq://")?e:void 0;if(!Array.isArray(e))return e.bigqueryUri}formatDestination(e,t){const i=t?Object.assign({},t):{},o=Date.now().toString();if(i.displayName||(i.displayName=`genaiBatchJob_${o}`),i.dest===void 0){const r=this.getGcsUri(e),s=this.getBigqueryUri(e);if(r)r.endsWith(".jsonl")?i.dest=`${r.slice(0,-6)}/dest`:i.dest=`${r}_dest_${o}`;else if(s)i.dest=`${s}_dest_${o}`;else throw new Error("Unsupported source for Vertex AI: No GCS or BigQuery URI found.")}return i}async createInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Pp(this.apiClient,e);return a=Ee("batchPredictionJobs",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>la(f))}else{const c=tu(this.apiClient,e);return a=Ee("{model}:batchGenerateContent",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>Cr(f))}}async createEmbeddingsInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Np(this.apiClient,e);return r=Ee("{model}:asyncBatchEmbedContent",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>Cr(u))}}async get(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Xp(this.apiClient,e);return a=Ee("batchPredictionJobs/{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>la(f))}else{const c=$p(this.apiClient,e);return a=Ee("batches/{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>Cr(f))}}async cancel(e){var t,i,o,r;let s="",a={};if(this.apiClient.isVertexAI()){const u=Cp(this.apiClient,e);s=Ee("batchPredictionJobs/{name}:cancel",u._url),a=u._query,delete u._url,delete u._query,await this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal})}else{const u=Ap(this.apiClient,e);s=Ee("batches/{name}:cancel",u._url),a=u._query,delete u._url,delete u._query,await this.apiClient.request({path:s,queryParams:a,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal})}}async listInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=nm(e);return a=Ee("batchPredictionJobs",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=om(f),p=new Zc;return Object.assign(p,h),p})}else{const c=tm(e);return a=Ee("batches",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=im(f),p=new Zc;return Object.assign(p,h),p})}}async delete(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Lp(this.apiClient,e);return a=Ee("batchPredictionJobs/{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>Bp(f))}else{const c=Up(this.apiClient,e);return a=Ee("batches/{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>Fp(f))}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function um(n){const e={},t=l(n,["apiKey"]);if(t!=null&&d(e,["apiKey"],t),l(n,["apiKeyConfig"])!==void 0)throw new Error("apiKeyConfig parameter is not supported in Gemini API.");if(l(n,["authType"])!==void 0)throw new Error("authType parameter is not supported in Gemini API.");if(l(n,["googleServiceAccountConfig"])!==void 0)throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");if(l(n,["httpBasicAuthConfig"])!==void 0)throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");if(l(n,["oauthConfig"])!==void 0)throw new Error("oauthConfig parameter is not supported in Gemini API.");if(l(n,["oidcConfig"])!==void 0)throw new Error("oidcConfig parameter is not supported in Gemini API.");return e}function dm(n){const e={},t=l(n,["data"]);if(t!=null&&d(e,["data"],t),l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function nu(n){const e={},t=l(n,["parts"]);if(t!=null){let o=t;Array.isArray(o)&&(o=o.map(r=>Um(r))),d(e,["parts"],o)}const i=l(n,["role"]);return i!=null&&d(e,["role"],i),e}function fm(n,e){const t={},i=l(n,["ttl"]);e!==void 0&&i!=null&&d(e,["ttl"],i);const o=l(n,["expireTime"]);e!==void 0&&o!=null&&d(e,["expireTime"],o);const r=l(n,["displayName"]);e!==void 0&&r!=null&&d(e,["displayName"],r);const s=l(n,["contents"]);if(e!==void 0&&s!=null){let f=Qt(s);Array.isArray(f)&&(f=f.map(h=>nu(h))),d(e,["contents"],f)}const a=l(n,["systemInstruction"]);e!==void 0&&a!=null&&d(e,["systemInstruction"],nu(Dt(a)));const u=l(n,["tools"]);if(e!==void 0&&u!=null){let f=u;Array.isArray(f)&&(f=f.map(h=>Fm(h))),d(e,["tools"],f)}const c=l(n,["toolConfig"]);if(e!==void 0&&c!=null&&d(e,["toolConfig"],Lm(c)),l(n,["kmsKeyName"])!==void 0)throw new Error("kmsKeyName parameter is not supported in Gemini API.");return t}function hm(n,e){const t={},i=l(n,["ttl"]);e!==void 0&&i!=null&&d(e,["ttl"],i);const o=l(n,["expireTime"]);e!==void 0&&o!=null&&d(e,["expireTime"],o);const r=l(n,["displayName"]);e!==void 0&&r!=null&&d(e,["displayName"],r);const s=l(n,["contents"]);if(e!==void 0&&s!=null){let h=Qt(s);Array.isArray(h)&&(h=h.map(p=>p)),d(e,["contents"],h)}const a=l(n,["systemInstruction"]);e!==void 0&&a!=null&&d(e,["systemInstruction"],Dt(a));const u=l(n,["tools"]);if(e!==void 0&&u!=null){let h=u;Array.isArray(h)&&(h=h.map(p=>Bm(p))),d(e,["tools"],h)}const c=l(n,["toolConfig"]);e!==void 0&&c!=null&&d(e,["toolConfig"],c);const f=l(n,["kmsKeyName"]);return e!==void 0&&f!=null&&d(e,["encryption_spec","kmsKeyName"],f),t}function pm(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["model"],Bd(n,i));const o=l(e,["config"]);return o!=null&&fm(o,t),t}function mm(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["model"],Bd(n,i));const o=l(e,["config"]);return o!=null&&hm(o,t),t}function gm(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],qn(n,i)),t}function _m(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],qn(n,i)),t}function vm(n){const e={},t=l(n,["sdkHttpResponse"]);return t!=null&&d(e,["sdkHttpResponse"],t),e}function ym(n){const e={},t=l(n,["sdkHttpResponse"]);return t!=null&&d(e,["sdkHttpResponse"],t),e}function Sm(n){const e={};if(l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const t=l(n,["fileUri"]);t!=null&&d(e,["fileUri"],t);const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function Em(n){const e={},t=l(n,["id"]);t!=null&&d(e,["id"],t);const i=l(n,["args"]);i!=null&&d(e,["args"],i);const o=l(n,["name"]);if(o!=null&&d(e,["name"],o),l(n,["partialArgs"])!==void 0)throw new Error("partialArgs parameter is not supported in Gemini API.");if(l(n,["willContinue"])!==void 0)throw new Error("willContinue parameter is not supported in Gemini API.");return e}function Tm(n){const e={},t=l(n,["allowedFunctionNames"]);t!=null&&d(e,["allowedFunctionNames"],t);const i=l(n,["mode"]);if(i!=null&&d(e,["mode"],i),l(n,["streamFunctionCallArguments"])!==void 0)throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");return e}function xm(n){const e={},t=l(n,["description"]);t!=null&&d(e,["description"],t);const i=l(n,["name"]);i!=null&&d(e,["name"],i);const o=l(n,["parameters"]);o!=null&&d(e,["parameters"],o);const r=l(n,["parametersJsonSchema"]);r!=null&&d(e,["parametersJsonSchema"],r);const s=l(n,["response"]);s!=null&&d(e,["response"],s);const a=l(n,["responseJsonSchema"]);if(a!=null&&d(e,["responseJsonSchema"],a),l(n,["behavior"])!==void 0)throw new Error("behavior parameter is not supported in Vertex AI.");return e}function Mm(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],qn(n,i)),t}function Am(n,e){const t={},i=l(e,["name"]);return i!=null&&d(t,["_url","name"],qn(n,i)),t}function Cm(n){const e={},t=l(n,["authConfig"]);t!=null&&d(e,["authConfig"],um(t));const i=l(n,["enableWidget"]);return i!=null&&d(e,["enableWidget"],i),e}function wm(n){const e={},t=l(n,["searchTypes"]);if(t!=null&&d(e,["searchTypes"],t),l(n,["blockingConfidence"])!==void 0)throw new Error("blockingConfidence parameter is not supported in Gemini API.");if(l(n,["excludeDomains"])!==void 0)throw new Error("excludeDomains parameter is not supported in Gemini API.");const i=l(n,["timeRangeFilter"]);return i!=null&&d(e,["timeRangeFilter"],i),e}function Rm(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);return e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),t}function Im(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);return e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),t}function bm(n){const e={},t=l(n,["config"]);return t!=null&&Rm(t,e),e}function Pm(n){const e={},t=l(n,["config"]);return t!=null&&Im(t,e),e}function Dm(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["cachedContents"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["cachedContents"],r)}return e}function Nm(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["cachedContents"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["cachedContents"],r)}return e}function Um(n){const e={},t=l(n,["mediaResolution"]);t!=null&&d(e,["mediaResolution"],t);const i=l(n,["codeExecutionResult"]);i!=null&&d(e,["codeExecutionResult"],i);const o=l(n,["executableCode"]);o!=null&&d(e,["executableCode"],o);const r=l(n,["fileData"]);r!=null&&d(e,["fileData"],Sm(r));const s=l(n,["functionCall"]);s!=null&&d(e,["functionCall"],Em(s));const a=l(n,["functionResponse"]);a!=null&&d(e,["functionResponse"],a);const u=l(n,["inlineData"]);u!=null&&d(e,["inlineData"],dm(u));const c=l(n,["text"]);c!=null&&d(e,["text"],c);const f=l(n,["thought"]);f!=null&&d(e,["thought"],f);const h=l(n,["thoughtSignature"]);h!=null&&d(e,["thoughtSignature"],h);const p=l(n,["videoMetadata"]);return p!=null&&d(e,["videoMetadata"],p),e}function Lm(n){const e={},t=l(n,["retrievalConfig"]);t!=null&&d(e,["retrievalConfig"],t);const i=l(n,["functionCallingConfig"]);return i!=null&&d(e,["functionCallingConfig"],Tm(i)),e}function Fm(n){const e={};if(l(n,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");const t=l(n,["computerUse"]);t!=null&&d(e,["computerUse"],t);const i=l(n,["fileSearch"]);i!=null&&d(e,["fileSearch"],i);const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],wm(o));const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],Cm(r));const s=l(n,["codeExecution"]);if(s!=null&&d(e,["codeExecution"],s),l(n,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");const a=l(n,["functionDeclarations"]);if(a!=null){let h=a;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["functionDeclarations"],h)}const u=l(n,["googleSearchRetrieval"]);if(u!=null&&d(e,["googleSearchRetrieval"],u),l(n,["parallelAiSearch"])!==void 0)throw new Error("parallelAiSearch parameter is not supported in Gemini API.");const c=l(n,["urlContext"]);c!=null&&d(e,["urlContext"],c);const f=l(n,["mcpServers"]);if(f!=null){let h=f;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["mcpServers"],h)}return e}function Bm(n){const e={},t=l(n,["retrieval"]);t!=null&&d(e,["retrieval"],t);const i=l(n,["computerUse"]);if(i!=null&&d(e,["computerUse"],i),l(n,["fileSearch"])!==void 0)throw new Error("fileSearch parameter is not supported in Vertex AI.");const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],o);const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],r);const s=l(n,["codeExecution"]);s!=null&&d(e,["codeExecution"],s);const a=l(n,["enterpriseWebSearch"]);a!=null&&d(e,["enterpriseWebSearch"],a);const u=l(n,["functionDeclarations"]);if(u!=null){let p=u;Array.isArray(p)&&(p=p.map(m=>xm(m))),d(e,["functionDeclarations"],p)}const c=l(n,["googleSearchRetrieval"]);c!=null&&d(e,["googleSearchRetrieval"],c);const f=l(n,["parallelAiSearch"]);f!=null&&d(e,["parallelAiSearch"],f);const h=l(n,["urlContext"]);if(h!=null&&d(e,["urlContext"],h),l(n,["mcpServers"])!==void 0)throw new Error("mcpServers parameter is not supported in Vertex AI.");return e}function Om(n,e){const t={},i=l(n,["ttl"]);e!==void 0&&i!=null&&d(e,["ttl"],i);const o=l(n,["expireTime"]);return e!==void 0&&o!=null&&d(e,["expireTime"],o),t}function km(n,e){const t={},i=l(n,["ttl"]);e!==void 0&&i!=null&&d(e,["ttl"],i);const o=l(n,["expireTime"]);return e!==void 0&&o!=null&&d(e,["expireTime"],o),t}function Gm(n,e){const t={},i=l(e,["name"]);i!=null&&d(t,["_url","name"],qn(n,i));const o=l(e,["config"]);return o!=null&&Om(o,t),t}function Vm(n,e){const t={},i=l(e,["name"]);i!=null&&d(t,["_url","name"],qn(n,i));const o=l(e,["config"]);return o!=null&&km(o,t),t}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Hm extends Wn{constructor(e){super(),this.apiClient=e,this.list=async(t={})=>new Mi(zn.PAGED_ITEM_CACHED_CONTENTS,i=>this.listInternal(i),await this.listInternal(t),t)}async create(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=mm(this.apiClient,e);return a=Ee("cachedContents",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>f)}else{const c=pm(this.apiClient,e);return a=Ee("cachedContents",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>f)}}async get(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Am(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>f)}else{const c=Mm(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>f)}}async delete(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=_m(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=ym(f),p=new Jc;return Object.assign(p,h),p})}else{const c=gm(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=vm(f),p=new Jc;return Object.assign(p,h),p})}}async update(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Vm(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"PATCH",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>f)}else{const c=Gm(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"PATCH",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>f)}}async listInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Pm(e);return a=Ee("cachedContents",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Nm(f),p=new Kc;return Object.assign(p,h),p})}else{const c=bm(e);return a=Ee("cachedContents",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Dm(f),p=new Kc;return Object.assign(p,h),p})}}}function Gr(n,e){var t={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&e.indexOf(i)<0&&(t[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,i=Object.getOwnPropertySymbols(n);o<i.length;o++)e.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(n,i[o])&&(t[i[o]]=n[i[o]]);return t}function iu(n){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&n[e],i=0;if(t)return t.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&i>=n.length&&(n=void 0),{value:n&&n[i++],done:!n}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function qe(n){return this instanceof qe?(this.v=n,this):new qe(n)}function _n(n,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=t.apply(n,e||[]),o,r=[];return o=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",s),o[Symbol.asyncIterator]=function(){return this},o;function s(m){return function(S){return Promise.resolve(S).then(m,h)}}function a(m,S){i[m]&&(o[m]=function(E){return new Promise(function(_,g){r.push([m,E,_,g])>1||u(m,E)})},S&&(o[m]=S(o[m])))}function u(m,S){try{c(i[m](S))}catch(E){p(r[0][3],E)}}function c(m){m.value instanceof qe?Promise.resolve(m.value.v).then(f,h):p(r[0][2],m)}function f(m){u("next",m)}function h(m){u("throw",m)}function p(m,S){m(S),r.shift(),r.length&&u(r[0][0],r[0][1])}}function vn(n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=n[Symbol.asyncIterator],t;return e?e.call(n):(n=typeof iu=="function"?iu(n):n[Symbol.iterator](),t={},i("next"),i("throw"),i("return"),t[Symbol.asyncIterator]=function(){return this},t);function i(r){t[r]=n[r]&&function(s){return new Promise(function(a,u){s=n[r](s),o(a,u,s.done,s.value)})}}function o(r,s,a,u){Promise.resolve(u).then(function(c){r({value:c,done:a})},s)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function zm(n){var e;if(n.candidates==null||n.candidates.length===0)return!1;const t=(e=n.candidates[0])===null||e===void 0?void 0:e.content;return t===void 0?!1:Kd(t)}function Kd(n){if(n.parts===void 0||n.parts.length===0)return!1;for(const e of n.parts)if(e===void 0||Object.keys(e).length===0)return!1;return!0}function Wm(n){if(n.length!==0){for(const e of n)if(e.role!=="user"&&e.role!=="model")throw new Error(`Role must be user or model, but got ${e.role}.`)}}function ou(n){if(n===void 0||n.length===0)return[];const e=[],t=n.length;let i=0;for(;i<t;)if(n[i].role==="user")e.push(n[i]),i++;else{const o=[];let r=!0;for(;i<t&&n[i].role==="model";)o.push(n[i]),r&&!Kd(n[i])&&(r=!1),i++;r?e.push(...o):e.pop()}return e}class qm{constructor(e,t){this.modelsModule=e,this.apiClient=t}create(e){return new $m(this.apiClient,this.modelsModule,e.model,e.config,structuredClone(e.history))}}class $m{constructor(e,t,i,o={},r=[]){this.apiClient=e,this.modelsModule=t,this.model=i,this.config=o,this.history=r,this.sendPromise=Promise.resolve(),Wm(r)}async sendMessage(e){var t;await this.sendPromise;const i=Dt(e.message),o=this.modelsModule.generateContent({model:this.model,contents:this.getHistory(!0).concat(i),config:(t=e.config)!==null&&t!==void 0?t:this.config});return this.sendPromise=(async()=>{var r,s,a;const u=await o,c=(s=(r=u.candidates)===null||r===void 0?void 0:r[0])===null||s===void 0?void 0:s.content,f=u.automaticFunctionCallingHistory,h=this.getHistory(!0).length;let p=[];f!=null&&(p=(a=f.slice(h))!==null&&a!==void 0?a:[]);const m=c?[c]:[];this.recordHistory(i,m,p)})(),await this.sendPromise.catch(()=>{this.sendPromise=Promise.resolve()}),o}async sendMessageStream(e){var t;await this.sendPromise;const i=Dt(e.message),o=this.modelsModule.generateContentStream({model:this.model,contents:this.getHistory(!0).concat(i),config:(t=e.config)!==null&&t!==void 0?t:this.config});this.sendPromise=o.then(()=>{}).catch(()=>{});const r=await o;return this.processStreamResponse(r,i)}getHistory(e=!1){const t=e?ou(this.history):this.history;return structuredClone(t)}processStreamResponse(e,t){return _n(this,arguments,function*(){var o,r,s,a,u,c;const f=[];try{for(var h=!0,p=vn(e),m;m=yield qe(p.next()),o=m.done,!o;h=!0){a=m.value,h=!1;const S=a;if(zm(S)){const E=(c=(u=S.candidates)===null||u===void 0?void 0:u[0])===null||c===void 0?void 0:c.content;E!==void 0&&f.push(E)}yield yield qe(S)}}catch(S){r={error:S}}finally{try{!h&&!o&&(s=p.return)&&(yield qe(s.call(p)))}finally{if(r)throw r.error}}this.recordHistory(t,f)})}recordHistory(e,t,i){let o=[];t.length>0&&t.every(r=>r.role!==void 0)?o=t:o.push({role:"model",parts:[]}),i&&i.length>0?this.history.push(...ou(i)):this.history.push(e),this.history.push(...o)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Qr extends Error{constructor(e){super(e.message),this.name="ApiError",this.status=e.status,Object.setPrototypeOf(this,Qr.prototype)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Xm(n){const e={},t=l(n,["file"]);return t!=null&&d(e,["file"],t),e}function Ym(n){const e={},t=l(n,["sdkHttpResponse"]);return t!=null&&d(e,["sdkHttpResponse"],t),e}function Jm(n){const e={},t=l(n,["name"]);return t!=null&&d(e,["_url","file"],zd(t)),e}function Km(n){const e={},t=l(n,["sdkHttpResponse"]);return t!=null&&d(e,["sdkHttpResponse"],t),e}function Zm(n){const e={},t=l(n,["name"]);return t!=null&&d(e,["_url","file"],zd(t)),e}function Qm(n){const e={},t=l(n,["uris"]);return t!=null&&d(e,["uris"],t),e}function jm(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);return e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),t}function eg(n){const e={},t=l(n,["config"]);return t!=null&&jm(t,e),e}function tg(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["files"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["files"],r)}return e}function ng(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["files"]);if(i!=null){let o=i;Array.isArray(o)&&(o=o.map(r=>r)),d(e,["files"],o)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ig extends Wn{constructor(e){super(),this.apiClient=e,this.list=async(t={})=>new Mi(zn.PAGED_ITEM_FILES,i=>this.listInternal(i),await this.listInternal(t),t)}async upload(e){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files. You can share files through a GCS bucket.");return this.apiClient.uploadFile(e.file,e.config).then(t=>t)}async download(e){await this.apiClient.downloadFile(e)}async registerFiles(e){throw new Error("registerFiles is only supported in Node.js environments.")}async _registerFiles(e){return this.registerFilesInternal(e)}async listInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=eg(e);return r=Ee("files",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>{const c=tg(u),f=new tp;return Object.assign(f,c),f})}}async createInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Xm(e);return r=Ee("upload/v1beta/files",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=Ym(u),f=new np;return Object.assign(f,c),f})}}async get(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Zm(e);return r=Ee("files/{file}",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>u)}}async delete(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Jm(e);return r=Ee("files/{file}",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>{const c=Km(u),f=new ip;return Object.assign(f,c),f})}}async registerFilesInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Qm(e);return r=Ee("files:register",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=ng(u),f=new op;return Object.assign(f,c),f})}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function og(n){const e={},t=l(n,["apiKey"]);if(t!=null&&d(e,["apiKey"],t),l(n,["apiKeyConfig"])!==void 0)throw new Error("apiKeyConfig parameter is not supported in Gemini API.");if(l(n,["authType"])!==void 0)throw new Error("authType parameter is not supported in Gemini API.");if(l(n,["googleServiceAccountConfig"])!==void 0)throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");if(l(n,["httpBasicAuthConfig"])!==void 0)throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");if(l(n,["oauthConfig"])!==void 0)throw new Error("oauthConfig parameter is not supported in Gemini API.");if(l(n,["oidcConfig"])!==void 0)throw new Error("oidcConfig parameter is not supported in Gemini API.");return e}function wr(n){const e={},t=l(n,["data"]);if(t!=null&&d(e,["data"],t),l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function rg(n){const e={},t=l(n,["parts"]);if(t!=null){let o=t;Array.isArray(o)&&(o=o.map(r=>Eg(r))),d(e,["parts"],o)}const i=l(n,["role"]);return i!=null&&d(e,["role"],i),e}function sg(n){const e={};if(l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const t=l(n,["fileUri"]);t!=null&&d(e,["fileUri"],t);const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function ag(n){const e={},t=l(n,["id"]);t!=null&&d(e,["id"],t);const i=l(n,["args"]);i!=null&&d(e,["args"],i);const o=l(n,["name"]);if(o!=null&&d(e,["name"],o),l(n,["partialArgs"])!==void 0)throw new Error("partialArgs parameter is not supported in Gemini API.");if(l(n,["willContinue"])!==void 0)throw new Error("willContinue parameter is not supported in Gemini API.");return e}function lg(n){const e={},t=l(n,["description"]);t!=null&&d(e,["description"],t);const i=l(n,["name"]);i!=null&&d(e,["name"],i);const o=l(n,["parameters"]);o!=null&&d(e,["parameters"],o);const r=l(n,["parametersJsonSchema"]);r!=null&&d(e,["parametersJsonSchema"],r);const s=l(n,["response"]);s!=null&&d(e,["response"],s);const a=l(n,["responseJsonSchema"]);if(a!=null&&d(e,["responseJsonSchema"],a),l(n,["behavior"])!==void 0)throw new Error("behavior parameter is not supported in Vertex AI.");return e}function cg(n){const e={},t=l(n,["modelSelectionConfig"]);t!=null&&d(e,["modelConfig"],t);const i=l(n,["responseJsonSchema"]);i!=null&&d(e,["responseJsonSchema"],i);const o=l(n,["audioTimestamp"]);o!=null&&d(e,["audioTimestamp"],o);const r=l(n,["candidateCount"]);r!=null&&d(e,["candidateCount"],r);const s=l(n,["enableAffectiveDialog"]);s!=null&&d(e,["enableAffectiveDialog"],s);const a=l(n,["frequencyPenalty"]);a!=null&&d(e,["frequencyPenalty"],a);const u=l(n,["logprobs"]);u!=null&&d(e,["logprobs"],u);const c=l(n,["maxOutputTokens"]);c!=null&&d(e,["maxOutputTokens"],c);const f=l(n,["mediaResolution"]);f!=null&&d(e,["mediaResolution"],f);const h=l(n,["presencePenalty"]);h!=null&&d(e,["presencePenalty"],h);const p=l(n,["responseLogprobs"]);p!=null&&d(e,["responseLogprobs"],p);const m=l(n,["responseMimeType"]);m!=null&&d(e,["responseMimeType"],m);const S=l(n,["responseModalities"]);S!=null&&d(e,["responseModalities"],S);const E=l(n,["responseSchema"]);E!=null&&d(e,["responseSchema"],E);const _=l(n,["routingConfig"]);_!=null&&d(e,["routingConfig"],_);const g=l(n,["seed"]);g!=null&&d(e,["seed"],g);const w=l(n,["speechConfig"]);w!=null&&d(e,["speechConfig"],w);const T=l(n,["stopSequences"]);T!=null&&d(e,["stopSequences"],T);const M=l(n,["temperature"]);M!=null&&d(e,["temperature"],M);const L=l(n,["thinkingConfig"]);L!=null&&d(e,["thinkingConfig"],L);const I=l(n,["topK"]);I!=null&&d(e,["topK"],I);const N=l(n,["topP"]);if(N!=null&&d(e,["topP"],N),l(n,["enableEnhancedCivicAnswers"])!==void 0)throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");return e}function ug(n){const e={},t=l(n,["authConfig"]);t!=null&&d(e,["authConfig"],og(t));const i=l(n,["enableWidget"]);return i!=null&&d(e,["enableWidget"],i),e}function dg(n){const e={},t=l(n,["searchTypes"]);if(t!=null&&d(e,["searchTypes"],t),l(n,["blockingConfidence"])!==void 0)throw new Error("blockingConfidence parameter is not supported in Gemini API.");if(l(n,["excludeDomains"])!==void 0)throw new Error("excludeDomains parameter is not supported in Gemini API.");const i=l(n,["timeRangeFilter"]);return i!=null&&d(e,["timeRangeFilter"],i),e}function fg(n,e){const t={},i=l(n,["generationConfig"]);e!==void 0&&i!=null&&d(e,["setup","generationConfig"],i);const o=l(n,["responseModalities"]);e!==void 0&&o!=null&&d(e,["setup","generationConfig","responseModalities"],o);const r=l(n,["temperature"]);e!==void 0&&r!=null&&d(e,["setup","generationConfig","temperature"],r);const s=l(n,["topP"]);e!==void 0&&s!=null&&d(e,["setup","generationConfig","topP"],s);const a=l(n,["topK"]);e!==void 0&&a!=null&&d(e,["setup","generationConfig","topK"],a);const u=l(n,["maxOutputTokens"]);e!==void 0&&u!=null&&d(e,["setup","generationConfig","maxOutputTokens"],u);const c=l(n,["mediaResolution"]);e!==void 0&&c!=null&&d(e,["setup","generationConfig","mediaResolution"],c);const f=l(n,["seed"]);e!==void 0&&f!=null&&d(e,["setup","generationConfig","seed"],f);const h=l(n,["speechConfig"]);e!==void 0&&h!=null&&d(e,["setup","generationConfig","speechConfig"],pl(h));const p=l(n,["thinkingConfig"]);e!==void 0&&p!=null&&d(e,["setup","generationConfig","thinkingConfig"],p);const m=l(n,["enableAffectiveDialog"]);e!==void 0&&m!=null&&d(e,["setup","generationConfig","enableAffectiveDialog"],m);const S=l(n,["systemInstruction"]);e!==void 0&&S!=null&&d(e,["setup","systemInstruction"],rg(Dt(S)));const E=l(n,["tools"]);if(e!==void 0&&E!=null){let I=so(E);Array.isArray(I)&&(I=I.map(N=>xg(ro(N)))),d(e,["setup","tools"],I)}const _=l(n,["sessionResumption"]);e!==void 0&&_!=null&&d(e,["setup","sessionResumption"],Tg(_));const g=l(n,["inputAudioTranscription"]);e!==void 0&&g!=null&&d(e,["setup","inputAudioTranscription"],g);const w=l(n,["outputAudioTranscription"]);e!==void 0&&w!=null&&d(e,["setup","outputAudioTranscription"],w);const T=l(n,["realtimeInputConfig"]);e!==void 0&&T!=null&&d(e,["setup","realtimeInputConfig"],T);const M=l(n,["contextWindowCompression"]);e!==void 0&&M!=null&&d(e,["setup","contextWindowCompression"],M);const L=l(n,["proactivity"]);if(e!==void 0&&L!=null&&d(e,["setup","proactivity"],L),l(n,["explicitVadSignal"])!==void 0)throw new Error("explicitVadSignal parameter is not supported in Gemini API.");return t}function hg(n,e){const t={},i=l(n,["generationConfig"]);e!==void 0&&i!=null&&d(e,["setup","generationConfig"],cg(i));const o=l(n,["responseModalities"]);e!==void 0&&o!=null&&d(e,["setup","generationConfig","responseModalities"],o);const r=l(n,["temperature"]);e!==void 0&&r!=null&&d(e,["setup","generationConfig","temperature"],r);const s=l(n,["topP"]);e!==void 0&&s!=null&&d(e,["setup","generationConfig","topP"],s);const a=l(n,["topK"]);e!==void 0&&a!=null&&d(e,["setup","generationConfig","topK"],a);const u=l(n,["maxOutputTokens"]);e!==void 0&&u!=null&&d(e,["setup","generationConfig","maxOutputTokens"],u);const c=l(n,["mediaResolution"]);e!==void 0&&c!=null&&d(e,["setup","generationConfig","mediaResolution"],c);const f=l(n,["seed"]);e!==void 0&&f!=null&&d(e,["setup","generationConfig","seed"],f);const h=l(n,["speechConfig"]);e!==void 0&&h!=null&&d(e,["setup","generationConfig","speechConfig"],pl(h));const p=l(n,["thinkingConfig"]);e!==void 0&&p!=null&&d(e,["setup","generationConfig","thinkingConfig"],p);const m=l(n,["enableAffectiveDialog"]);e!==void 0&&m!=null&&d(e,["setup","generationConfig","enableAffectiveDialog"],m);const S=l(n,["systemInstruction"]);e!==void 0&&S!=null&&d(e,["setup","systemInstruction"],Dt(S));const E=l(n,["tools"]);if(e!==void 0&&E!=null){let N=so(E);Array.isArray(N)&&(N=N.map(k=>Mg(ro(k)))),d(e,["setup","tools"],N)}const _=l(n,["sessionResumption"]);e!==void 0&&_!=null&&d(e,["setup","sessionResumption"],_);const g=l(n,["inputAudioTranscription"]);e!==void 0&&g!=null&&d(e,["setup","inputAudioTranscription"],g);const w=l(n,["outputAudioTranscription"]);e!==void 0&&w!=null&&d(e,["setup","outputAudioTranscription"],w);const T=l(n,["realtimeInputConfig"]);e!==void 0&&T!=null&&d(e,["setup","realtimeInputConfig"],T);const M=l(n,["contextWindowCompression"]);e!==void 0&&M!=null&&d(e,["setup","contextWindowCompression"],M);const L=l(n,["proactivity"]);e!==void 0&&L!=null&&d(e,["setup","proactivity"],L);const I=l(n,["explicitVadSignal"]);return e!==void 0&&I!=null&&d(e,["setup","explicitVadSignal"],I),t}function pg(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["setup","model"],lt(n,i));const o=l(e,["config"]);return o!=null&&d(t,["config"],fg(o,t)),t}function mg(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["setup","model"],lt(n,i));const o=l(e,["config"]);return o!=null&&d(t,["config"],hg(o,t)),t}function gg(n){const e={},t=l(n,["musicGenerationConfig"]);return t!=null&&d(e,["musicGenerationConfig"],t),e}function _g(n){const e={},t=l(n,["weightedPrompts"]);if(t!=null){let i=t;Array.isArray(i)&&(i=i.map(o=>o)),d(e,["weightedPrompts"],i)}return e}function vg(n){const e={},t=l(n,["media"]);if(t!=null){let c=Od(t);Array.isArray(c)&&(c=c.map(f=>wr(f))),d(e,["mediaChunks"],c)}const i=l(n,["audio"]);i!=null&&d(e,["audio"],wr(Gd(i)));const o=l(n,["audioStreamEnd"]);o!=null&&d(e,["audioStreamEnd"],o);const r=l(n,["video"]);r!=null&&d(e,["video"],wr(kd(r)));const s=l(n,["text"]);s!=null&&d(e,["text"],s);const a=l(n,["activityStart"]);a!=null&&d(e,["activityStart"],a);const u=l(n,["activityEnd"]);return u!=null&&d(e,["activityEnd"],u),e}function yg(n){const e={},t=l(n,["media"]);if(t!=null){let c=Od(t);Array.isArray(c)&&(c=c.map(f=>f)),d(e,["mediaChunks"],c)}const i=l(n,["audio"]);i!=null&&d(e,["audio"],Gd(i));const o=l(n,["audioStreamEnd"]);o!=null&&d(e,["audioStreamEnd"],o);const r=l(n,["video"]);r!=null&&d(e,["video"],kd(r));const s=l(n,["text"]);s!=null&&d(e,["text"],s);const a=l(n,["activityStart"]);a!=null&&d(e,["activityStart"],a);const u=l(n,["activityEnd"]);return u!=null&&d(e,["activityEnd"],u),e}function Sg(n){const e={},t=l(n,["setupComplete"]);t!=null&&d(e,["setupComplete"],t);const i=l(n,["serverContent"]);i!=null&&d(e,["serverContent"],i);const o=l(n,["toolCall"]);o!=null&&d(e,["toolCall"],o);const r=l(n,["toolCallCancellation"]);r!=null&&d(e,["toolCallCancellation"],r);const s=l(n,["usageMetadata"]);s!=null&&d(e,["usageMetadata"],Ag(s));const a=l(n,["goAway"]);a!=null&&d(e,["goAway"],a);const u=l(n,["sessionResumptionUpdate"]);u!=null&&d(e,["sessionResumptionUpdate"],u);const c=l(n,["voiceActivityDetectionSignal"]);c!=null&&d(e,["voiceActivityDetectionSignal"],c);const f=l(n,["voiceActivity"]);return f!=null&&d(e,["voiceActivity"],Cg(f)),e}function Eg(n){const e={},t=l(n,["mediaResolution"]);t!=null&&d(e,["mediaResolution"],t);const i=l(n,["codeExecutionResult"]);i!=null&&d(e,["codeExecutionResult"],i);const o=l(n,["executableCode"]);o!=null&&d(e,["executableCode"],o);const r=l(n,["fileData"]);r!=null&&d(e,["fileData"],sg(r));const s=l(n,["functionCall"]);s!=null&&d(e,["functionCall"],ag(s));const a=l(n,["functionResponse"]);a!=null&&d(e,["functionResponse"],a);const u=l(n,["inlineData"]);u!=null&&d(e,["inlineData"],wr(u));const c=l(n,["text"]);c!=null&&d(e,["text"],c);const f=l(n,["thought"]);f!=null&&d(e,["thought"],f);const h=l(n,["thoughtSignature"]);h!=null&&d(e,["thoughtSignature"],h);const p=l(n,["videoMetadata"]);return p!=null&&d(e,["videoMetadata"],p),e}function Tg(n){const e={},t=l(n,["handle"]);if(t!=null&&d(e,["handle"],t),l(n,["transparent"])!==void 0)throw new Error("transparent parameter is not supported in Gemini API.");return e}function xg(n){const e={};if(l(n,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");const t=l(n,["computerUse"]);t!=null&&d(e,["computerUse"],t);const i=l(n,["fileSearch"]);i!=null&&d(e,["fileSearch"],i);const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],dg(o));const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],ug(r));const s=l(n,["codeExecution"]);if(s!=null&&d(e,["codeExecution"],s),l(n,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");const a=l(n,["functionDeclarations"]);if(a!=null){let h=a;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["functionDeclarations"],h)}const u=l(n,["googleSearchRetrieval"]);if(u!=null&&d(e,["googleSearchRetrieval"],u),l(n,["parallelAiSearch"])!==void 0)throw new Error("parallelAiSearch parameter is not supported in Gemini API.");const c=l(n,["urlContext"]);c!=null&&d(e,["urlContext"],c);const f=l(n,["mcpServers"]);if(f!=null){let h=f;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["mcpServers"],h)}return e}function Mg(n){const e={},t=l(n,["retrieval"]);t!=null&&d(e,["retrieval"],t);const i=l(n,["computerUse"]);if(i!=null&&d(e,["computerUse"],i),l(n,["fileSearch"])!==void 0)throw new Error("fileSearch parameter is not supported in Vertex AI.");const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],o);const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],r);const s=l(n,["codeExecution"]);s!=null&&d(e,["codeExecution"],s);const a=l(n,["enterpriseWebSearch"]);a!=null&&d(e,["enterpriseWebSearch"],a);const u=l(n,["functionDeclarations"]);if(u!=null){let p=u;Array.isArray(p)&&(p=p.map(m=>lg(m))),d(e,["functionDeclarations"],p)}const c=l(n,["googleSearchRetrieval"]);c!=null&&d(e,["googleSearchRetrieval"],c);const f=l(n,["parallelAiSearch"]);f!=null&&d(e,["parallelAiSearch"],f);const h=l(n,["urlContext"]);if(h!=null&&d(e,["urlContext"],h),l(n,["mcpServers"])!==void 0)throw new Error("mcpServers parameter is not supported in Vertex AI.");return e}function Ag(n){const e={},t=l(n,["promptTokenCount"]);t!=null&&d(e,["promptTokenCount"],t);const i=l(n,["cachedContentTokenCount"]);i!=null&&d(e,["cachedContentTokenCount"],i);const o=l(n,["candidatesTokenCount"]);o!=null&&d(e,["responseTokenCount"],o);const r=l(n,["toolUsePromptTokenCount"]);r!=null&&d(e,["toolUsePromptTokenCount"],r);const s=l(n,["thoughtsTokenCount"]);s!=null&&d(e,["thoughtsTokenCount"],s);const a=l(n,["totalTokenCount"]);a!=null&&d(e,["totalTokenCount"],a);const u=l(n,["promptTokensDetails"]);if(u!=null){let m=u;Array.isArray(m)&&(m=m.map(S=>S)),d(e,["promptTokensDetails"],m)}const c=l(n,["cacheTokensDetails"]);if(c!=null){let m=c;Array.isArray(m)&&(m=m.map(S=>S)),d(e,["cacheTokensDetails"],m)}const f=l(n,["candidatesTokensDetails"]);if(f!=null){let m=f;Array.isArray(m)&&(m=m.map(S=>S)),d(e,["responseTokensDetails"],m)}const h=l(n,["toolUsePromptTokensDetails"]);if(h!=null){let m=h;Array.isArray(m)&&(m=m.map(S=>S)),d(e,["toolUsePromptTokensDetails"],m)}const p=l(n,["trafficType"]);return p!=null&&d(e,["trafficType"],p),e}function Cg(n){const e={},t=l(n,["type"]);return t!=null&&d(e,["voiceActivityType"],t),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function wg(n,e){const t={},i=l(n,["apiKey"]);if(i!=null&&d(t,["apiKey"],i),l(n,["apiKeyConfig"])!==void 0)throw new Error("apiKeyConfig parameter is not supported in Gemini API.");if(l(n,["authType"])!==void 0)throw new Error("authType parameter is not supported in Gemini API.");if(l(n,["googleServiceAccountConfig"])!==void 0)throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");if(l(n,["httpBasicAuthConfig"])!==void 0)throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");if(l(n,["oauthConfig"])!==void 0)throw new Error("oauthConfig parameter is not supported in Gemini API.");if(l(n,["oidcConfig"])!==void 0)throw new Error("oidcConfig parameter is not supported in Gemini API.");return t}function Rg(n,e){const t={},i=l(n,["data"]);if(i!=null&&d(t,["data"],i),l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const o=l(n,["mimeType"]);return o!=null&&d(t,["mimeType"],o),t}function Ig(n,e){const t={},i=l(n,["content"]);i!=null&&d(t,["content"],i);const o=l(n,["citationMetadata"]);o!=null&&d(t,["citationMetadata"],bg(o));const r=l(n,["tokenCount"]);r!=null&&d(t,["tokenCount"],r);const s=l(n,["finishReason"]);s!=null&&d(t,["finishReason"],s);const a=l(n,["groundingMetadata"]);a!=null&&d(t,["groundingMetadata"],a);const u=l(n,["avgLogprobs"]);u!=null&&d(t,["avgLogprobs"],u);const c=l(n,["index"]);c!=null&&d(t,["index"],c);const f=l(n,["logprobsResult"]);f!=null&&d(t,["logprobsResult"],f);const h=l(n,["safetyRatings"]);if(h!=null){let m=h;Array.isArray(m)&&(m=m.map(S=>S)),d(t,["safetyRatings"],m)}const p=l(n,["urlContextMetadata"]);return p!=null&&d(t,["urlContextMetadata"],p),t}function bg(n,e){const t={},i=l(n,["citationSources"]);if(i!=null){let o=i;Array.isArray(o)&&(o=o.map(r=>r)),d(t,["citations"],o)}return t}function Pg(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let s=Qt(r);Array.isArray(s)&&(s=s.map(a=>a)),d(i,["contents"],s)}return i}function Dg(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["tokensInfo"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(t,["tokensInfo"],r)}return t}function Ng(n,e){const t={},i=l(n,["values"]);i!=null&&d(t,["values"],i);const o=l(n,["statistics"]);return o!=null&&d(t,["statistics"],Ug(o)),t}function Ug(n,e){const t={},i=l(n,["truncated"]);i!=null&&d(t,["truncated"],i);const o=l(n,["token_count"]);return o!=null&&d(t,["tokenCount"],o),t}function Go(n,e){const t={},i=l(n,["parts"]);if(i!=null){let r=i;Array.isArray(r)&&(r=r.map(s=>z_(s))),d(t,["parts"],r)}const o=l(n,["role"]);return o!=null&&d(t,["role"],o),t}function Lg(n,e){const t={},i=l(n,["controlType"]);i!=null&&d(t,["controlType"],i);const o=l(n,["enableControlImageComputation"]);return o!=null&&d(t,["computeControl"],o),t}function Fg(n,e){const t={};if(l(n,["systemInstruction"])!==void 0)throw new Error("systemInstruction parameter is not supported in Gemini API.");if(l(n,["tools"])!==void 0)throw new Error("tools parameter is not supported in Gemini API.");if(l(n,["generationConfig"])!==void 0)throw new Error("generationConfig parameter is not supported in Gemini API.");return t}function Bg(n,e,t){const i={},o=l(n,["systemInstruction"]);e!==void 0&&o!=null&&d(e,["systemInstruction"],Dt(o));const r=l(n,["tools"]);if(e!==void 0&&r!=null){let a=r;Array.isArray(a)&&(a=a.map(u=>ef(u))),d(e,["tools"],a)}const s=l(n,["generationConfig"]);return e!==void 0&&s!=null&&d(e,["generationConfig"],R_(s)),i}function Og(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let a=Qt(r);Array.isArray(a)&&(a=a.map(u=>Go(u))),d(i,["contents"],a)}const s=l(e,["config"]);return s!=null&&Fg(s),i}function kg(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let a=Qt(r);Array.isArray(a)&&(a=a.map(u=>u)),d(i,["contents"],a)}const s=l(e,["config"]);return s!=null&&Bg(s,i),i}function Gg(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["totalTokens"]);o!=null&&d(t,["totalTokens"],o);const r=l(n,["cachedContentTokenCount"]);return r!=null&&d(t,["cachedContentTokenCount"],r),t}function Vg(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["totalTokens"]);return o!=null&&d(t,["totalTokens"],o),t}function Hg(n,e,t){const i={},o=l(e,["model"]);return o!=null&&d(i,["_url","name"],lt(n,o)),i}function zg(n,e,t){const i={},o=l(e,["model"]);return o!=null&&d(i,["_url","name"],lt(n,o)),i}function Wg(n,e){const t={},i=l(n,["sdkHttpResponse"]);return i!=null&&d(t,["sdkHttpResponse"],i),t}function qg(n,e){const t={},i=l(n,["sdkHttpResponse"]);return i!=null&&d(t,["sdkHttpResponse"],i),t}function $g(n,e,t){const i={},o=l(n,["outputGcsUri"]);e!==void 0&&o!=null&&d(e,["parameters","storageUri"],o);const r=l(n,["negativePrompt"]);e!==void 0&&r!=null&&d(e,["parameters","negativePrompt"],r);const s=l(n,["numberOfImages"]);e!==void 0&&s!=null&&d(e,["parameters","sampleCount"],s);const a=l(n,["aspectRatio"]);e!==void 0&&a!=null&&d(e,["parameters","aspectRatio"],a);const u=l(n,["guidanceScale"]);e!==void 0&&u!=null&&d(e,["parameters","guidanceScale"],u);const c=l(n,["seed"]);e!==void 0&&c!=null&&d(e,["parameters","seed"],c);const f=l(n,["safetyFilterLevel"]);e!==void 0&&f!=null&&d(e,["parameters","safetySetting"],f);const h=l(n,["personGeneration"]);e!==void 0&&h!=null&&d(e,["parameters","personGeneration"],h);const p=l(n,["includeSafetyAttributes"]);e!==void 0&&p!=null&&d(e,["parameters","includeSafetyAttributes"],p);const m=l(n,["includeRaiReason"]);e!==void 0&&m!=null&&d(e,["parameters","includeRaiReason"],m);const S=l(n,["language"]);e!==void 0&&S!=null&&d(e,["parameters","language"],S);const E=l(n,["outputMimeType"]);e!==void 0&&E!=null&&d(e,["parameters","outputOptions","mimeType"],E);const _=l(n,["outputCompressionQuality"]);e!==void 0&&_!=null&&d(e,["parameters","outputOptions","compressionQuality"],_);const g=l(n,["addWatermark"]);e!==void 0&&g!=null&&d(e,["parameters","addWatermark"],g);const w=l(n,["labels"]);e!==void 0&&w!=null&&d(e,["labels"],w);const T=l(n,["editMode"]);e!==void 0&&T!=null&&d(e,["parameters","editMode"],T);const M=l(n,["baseSteps"]);return e!==void 0&&M!=null&&d(e,["parameters","editConfig","baseSteps"],M),i}function Xg(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["prompt"]);r!=null&&d(i,["instances[0]","prompt"],r);const s=l(e,["referenceImages"]);if(s!=null){let u=s;Array.isArray(u)&&(u=u.map(c=>J_(c))),d(i,["instances[0]","referenceImages"],u)}const a=l(e,["config"]);return a!=null&&$g(a,i),i}function Yg(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["predictions"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>jr(s))),d(t,["generatedImages"],r)}return t}function Jg(n,e,t){const i={},o=l(n,["taskType"]);e!==void 0&&o!=null&&d(e,["requests[]","taskType"],o);const r=l(n,["title"]);e!==void 0&&r!=null&&d(e,["requests[]","title"],r);const s=l(n,["outputDimensionality"]);if(e!==void 0&&s!=null&&d(e,["requests[]","outputDimensionality"],s),l(n,["mimeType"])!==void 0)throw new Error("mimeType parameter is not supported in Gemini API.");if(l(n,["autoTruncate"])!==void 0)throw new Error("autoTruncate parameter is not supported in Gemini API.");return i}function Kg(n,e,t){const i={};let o=l(t,["embeddingApiType"]);if(o===void 0&&(o="PREDICT"),o==="PREDICT"){const c=l(n,["taskType"]);e!==void 0&&c!=null&&d(e,["instances[]","task_type"],c)}else if(o==="EMBED_CONTENT"){const c=l(n,["taskType"]);e!==void 0&&c!=null&&d(e,["taskType"],c)}let r=l(t,["embeddingApiType"]);if(r===void 0&&(r="PREDICT"),r==="PREDICT"){const c=l(n,["title"]);e!==void 0&&c!=null&&d(e,["instances[]","title"],c)}else if(r==="EMBED_CONTENT"){const c=l(n,["title"]);e!==void 0&&c!=null&&d(e,["title"],c)}let s=l(t,["embeddingApiType"]);if(s===void 0&&(s="PREDICT"),s==="PREDICT"){const c=l(n,["outputDimensionality"]);e!==void 0&&c!=null&&d(e,["parameters","outputDimensionality"],c)}else if(s==="EMBED_CONTENT"){const c=l(n,["outputDimensionality"]);e!==void 0&&c!=null&&d(e,["outputDimensionality"],c)}let a=l(t,["embeddingApiType"]);if(a===void 0&&(a="PREDICT"),a==="PREDICT"){const c=l(n,["mimeType"]);e!==void 0&&c!=null&&d(e,["instances[]","mimeType"],c)}let u=l(t,["embeddingApiType"]);if(u===void 0&&(u="PREDICT"),u==="PREDICT"){const c=l(n,["autoTruncate"]);e!==void 0&&c!=null&&d(e,["parameters","autoTruncate"],c)}else if(u==="EMBED_CONTENT"){const c=l(n,["autoTruncate"]);e!==void 0&&c!=null&&d(e,["autoTruncate"],c)}return i}function Zg(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let c=dl(n,r);Array.isArray(c)&&(c=c.map(f=>f)),d(i,["requests[]","content"],c)}const s=l(e,["content"]);s!=null&&Go(Dt(s));const a=l(e,["config"]);a!=null&&Jg(a,i);const u=l(e,["model"]);return u!==void 0&&d(i,["requests[]","model"],lt(n,u)),i}function Qg(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));let r=l(t,["embeddingApiType"]);if(r===void 0&&(r="PREDICT"),r==="PREDICT"){const u=l(e,["contents"]);if(u!=null){let c=dl(n,u);Array.isArray(c)&&(c=c.map(f=>f)),d(i,["instances[]","content"],c)}}let s=l(t,["embeddingApiType"]);if(s===void 0&&(s="PREDICT"),s==="EMBED_CONTENT"){const u=l(e,["content"]);u!=null&&d(i,["content"],Dt(u))}const a=l(e,["config"]);return a!=null&&Kg(a,i,t),i}function jg(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["embeddings"]);if(o!=null){let s=o;Array.isArray(s)&&(s=s.map(a=>a)),d(t,["embeddings"],s)}const r=l(n,["metadata"]);return r!=null&&d(t,["metadata"],r),t}function e_(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["predictions[]","embeddings"]);if(o!=null){let s=o;Array.isArray(s)&&(s=s.map(a=>Ng(a))),d(t,["embeddings"],s)}const r=l(n,["metadata"]);if(r!=null&&d(t,["metadata"],r),e&&l(e,["embeddingApiType"])==="EMBED_CONTENT"){const s=l(n,["embedding"]),a=l(n,["usageMetadata"]),u=l(n,["truncated"]);if(s){const c={};a&&a.promptTokenCount&&(c.tokenCount=a.promptTokenCount),u&&(c.truncated=u),s.statistics=c,d(t,["embeddings"],[s])}}return t}function t_(n,e){const t={},i=l(n,["endpoint"]);i!=null&&d(t,["name"],i);const o=l(n,["deployedModelId"]);return o!=null&&d(t,["deployedModelId"],o),t}function n_(n,e){const t={};if(l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const i=l(n,["fileUri"]);i!=null&&d(t,["fileUri"],i);const o=l(n,["mimeType"]);return o!=null&&d(t,["mimeType"],o),t}function i_(n,e){const t={},i=l(n,["id"]);i!=null&&d(t,["id"],i);const o=l(n,["args"]);o!=null&&d(t,["args"],o);const r=l(n,["name"]);if(r!=null&&d(t,["name"],r),l(n,["partialArgs"])!==void 0)throw new Error("partialArgs parameter is not supported in Gemini API.");if(l(n,["willContinue"])!==void 0)throw new Error("willContinue parameter is not supported in Gemini API.");return t}function o_(n,e){const t={},i=l(n,["allowedFunctionNames"]);i!=null&&d(t,["allowedFunctionNames"],i);const o=l(n,["mode"]);if(o!=null&&d(t,["mode"],o),l(n,["streamFunctionCallArguments"])!==void 0)throw new Error("streamFunctionCallArguments parameter is not supported in Gemini API.");return t}function r_(n,e){const t={},i=l(n,["description"]);i!=null&&d(t,["description"],i);const o=l(n,["name"]);o!=null&&d(t,["name"],o);const r=l(n,["parameters"]);r!=null&&d(t,["parameters"],r);const s=l(n,["parametersJsonSchema"]);s!=null&&d(t,["parametersJsonSchema"],s);const a=l(n,["response"]);a!=null&&d(t,["response"],a);const u=l(n,["responseJsonSchema"]);if(u!=null&&d(t,["responseJsonSchema"],u),l(n,["behavior"])!==void 0)throw new Error("behavior parameter is not supported in Vertex AI.");return t}function s_(n,e,t,i){const o={},r=l(e,["systemInstruction"]);t!==void 0&&r!=null&&d(t,["systemInstruction"],Go(Dt(r)));const s=l(e,["temperature"]);s!=null&&d(o,["temperature"],s);const a=l(e,["topP"]);a!=null&&d(o,["topP"],a);const u=l(e,["topK"]);u!=null&&d(o,["topK"],u);const c=l(e,["candidateCount"]);c!=null&&d(o,["candidateCount"],c);const f=l(e,["maxOutputTokens"]);f!=null&&d(o,["maxOutputTokens"],f);const h=l(e,["stopSequences"]);h!=null&&d(o,["stopSequences"],h);const p=l(e,["responseLogprobs"]);p!=null&&d(o,["responseLogprobs"],p);const m=l(e,["logprobs"]);m!=null&&d(o,["logprobs"],m);const S=l(e,["presencePenalty"]);S!=null&&d(o,["presencePenalty"],S);const E=l(e,["frequencyPenalty"]);E!=null&&d(o,["frequencyPenalty"],E);const _=l(e,["seed"]);_!=null&&d(o,["seed"],_);const g=l(e,["responseMimeType"]);g!=null&&d(o,["responseMimeType"],g);const w=l(e,["responseSchema"]);w!=null&&d(o,["responseSchema"],fl(w));const T=l(e,["responseJsonSchema"]);if(T!=null&&d(o,["responseJsonSchema"],T),l(e,["routingConfig"])!==void 0)throw new Error("routingConfig parameter is not supported in Gemini API.");if(l(e,["modelSelectionConfig"])!==void 0)throw new Error("modelSelectionConfig parameter is not supported in Gemini API.");const M=l(e,["safetySettings"]);if(t!==void 0&&M!=null){let j=M;Array.isArray(j)&&(j=j.map(ie=>K_(ie))),d(t,["safetySettings"],j)}const L=l(e,["tools"]);if(t!==void 0&&L!=null){let j=so(L);Array.isArray(j)&&(j=j.map(ie=>iv(ro(ie)))),d(t,["tools"],j)}const I=l(e,["toolConfig"]);if(t!==void 0&&I!=null&&d(t,["toolConfig"],nv(I)),l(e,["labels"])!==void 0)throw new Error("labels parameter is not supported in Gemini API.");const N=l(e,["cachedContent"]);t!==void 0&&N!=null&&d(t,["cachedContent"],qn(n,N));const k=l(e,["responseModalities"]);k!=null&&d(o,["responseModalities"],k);const A=l(e,["mediaResolution"]);A!=null&&d(o,["mediaResolution"],A);const x=l(e,["speechConfig"]);if(x!=null&&d(o,["speechConfig"],hl(x)),l(e,["audioTimestamp"])!==void 0)throw new Error("audioTimestamp parameter is not supported in Gemini API.");const O=l(e,["thinkingConfig"]);O!=null&&d(o,["thinkingConfig"],O);const Y=l(e,["imageConfig"]);Y!=null&&d(o,["imageConfig"],N_(Y));const $=l(e,["enableEnhancedCivicAnswers"]);if($!=null&&d(o,["enableEnhancedCivicAnswers"],$),l(e,["modelArmorConfig"])!==void 0)throw new Error("modelArmorConfig parameter is not supported in Gemini API.");return o}function a_(n,e,t,i){const o={},r=l(e,["systemInstruction"]);t!==void 0&&r!=null&&d(t,["systemInstruction"],Dt(r));const s=l(e,["temperature"]);s!=null&&d(o,["temperature"],s);const a=l(e,["topP"]);a!=null&&d(o,["topP"],a);const u=l(e,["topK"]);u!=null&&d(o,["topK"],u);const c=l(e,["candidateCount"]);c!=null&&d(o,["candidateCount"],c);const f=l(e,["maxOutputTokens"]);f!=null&&d(o,["maxOutputTokens"],f);const h=l(e,["stopSequences"]);h!=null&&d(o,["stopSequences"],h);const p=l(e,["responseLogprobs"]);p!=null&&d(o,["responseLogprobs"],p);const m=l(e,["logprobs"]);m!=null&&d(o,["logprobs"],m);const S=l(e,["presencePenalty"]);S!=null&&d(o,["presencePenalty"],S);const E=l(e,["frequencyPenalty"]);E!=null&&d(o,["frequencyPenalty"],E);const _=l(e,["seed"]);_!=null&&d(o,["seed"],_);const g=l(e,["responseMimeType"]);g!=null&&d(o,["responseMimeType"],g);const w=l(e,["responseSchema"]);w!=null&&d(o,["responseSchema"],fl(w));const T=l(e,["responseJsonSchema"]);T!=null&&d(o,["responseJsonSchema"],T);const M=l(e,["routingConfig"]);M!=null&&d(o,["routingConfig"],M);const L=l(e,["modelSelectionConfig"]);L!=null&&d(o,["modelConfig"],L);const I=l(e,["safetySettings"]);if(t!==void 0&&I!=null){let J=I;Array.isArray(J)&&(J=J.map(pe=>pe)),d(t,["safetySettings"],J)}const N=l(e,["tools"]);if(t!==void 0&&N!=null){let J=so(N);Array.isArray(J)&&(J=J.map(pe=>ef(ro(pe)))),d(t,["tools"],J)}const k=l(e,["toolConfig"]);t!==void 0&&k!=null&&d(t,["toolConfig"],k);const A=l(e,["labels"]);t!==void 0&&A!=null&&d(t,["labels"],A);const x=l(e,["cachedContent"]);t!==void 0&&x!=null&&d(t,["cachedContent"],qn(n,x));const O=l(e,["responseModalities"]);O!=null&&d(o,["responseModalities"],O);const Y=l(e,["mediaResolution"]);Y!=null&&d(o,["mediaResolution"],Y);const $=l(e,["speechConfig"]);$!=null&&d(o,["speechConfig"],hl($));const j=l(e,["audioTimestamp"]);j!=null&&d(o,["audioTimestamp"],j);const ie=l(e,["thinkingConfig"]);ie!=null&&d(o,["thinkingConfig"],ie);const ee=l(e,["imageConfig"]);if(ee!=null&&d(o,["imageConfig"],U_(ee)),l(e,["enableEnhancedCivicAnswers"])!==void 0)throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");const re=l(e,["modelArmorConfig"]);return t!==void 0&&re!=null&&d(t,["modelArmorConfig"],re),o}function ru(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let a=Qt(r);Array.isArray(a)&&(a=a.map(u=>Go(u))),d(i,["contents"],a)}const s=l(e,["config"]);return s!=null&&d(i,["generationConfig"],s_(n,s,i)),i}function su(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["contents"]);if(r!=null){let a=Qt(r);Array.isArray(a)&&(a=a.map(u=>u)),d(i,["contents"],a)}const s=l(e,["config"]);return s!=null&&d(i,["generationConfig"],a_(n,s,i)),i}function au(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["candidates"]);if(o!=null){let c=o;Array.isArray(c)&&(c=c.map(f=>Ig(f))),d(t,["candidates"],c)}const r=l(n,["modelVersion"]);r!=null&&d(t,["modelVersion"],r);const s=l(n,["promptFeedback"]);s!=null&&d(t,["promptFeedback"],s);const a=l(n,["responseId"]);a!=null&&d(t,["responseId"],a);const u=l(n,["usageMetadata"]);return u!=null&&d(t,["usageMetadata"],u),t}function lu(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["candidates"]);if(o!=null){let f=o;Array.isArray(f)&&(f=f.map(h=>h)),d(t,["candidates"],f)}const r=l(n,["createTime"]);r!=null&&d(t,["createTime"],r);const s=l(n,["modelVersion"]);s!=null&&d(t,["modelVersion"],s);const a=l(n,["promptFeedback"]);a!=null&&d(t,["promptFeedback"],a);const u=l(n,["responseId"]);u!=null&&d(t,["responseId"],u);const c=l(n,["usageMetadata"]);return c!=null&&d(t,["usageMetadata"],c),t}function l_(n,e,t){const i={};if(l(n,["outputGcsUri"])!==void 0)throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(l(n,["negativePrompt"])!==void 0)throw new Error("negativePrompt parameter is not supported in Gemini API.");const o=l(n,["numberOfImages"]);e!==void 0&&o!=null&&d(e,["parameters","sampleCount"],o);const r=l(n,["aspectRatio"]);e!==void 0&&r!=null&&d(e,["parameters","aspectRatio"],r);const s=l(n,["guidanceScale"]);if(e!==void 0&&s!=null&&d(e,["parameters","guidanceScale"],s),l(n,["seed"])!==void 0)throw new Error("seed parameter is not supported in Gemini API.");const a=l(n,["safetyFilterLevel"]);e!==void 0&&a!=null&&d(e,["parameters","safetySetting"],a);const u=l(n,["personGeneration"]);e!==void 0&&u!=null&&d(e,["parameters","personGeneration"],u);const c=l(n,["includeSafetyAttributes"]);e!==void 0&&c!=null&&d(e,["parameters","includeSafetyAttributes"],c);const f=l(n,["includeRaiReason"]);e!==void 0&&f!=null&&d(e,["parameters","includeRaiReason"],f);const h=l(n,["language"]);e!==void 0&&h!=null&&d(e,["parameters","language"],h);const p=l(n,["outputMimeType"]);e!==void 0&&p!=null&&d(e,["parameters","outputOptions","mimeType"],p);const m=l(n,["outputCompressionQuality"]);if(e!==void 0&&m!=null&&d(e,["parameters","outputOptions","compressionQuality"],m),l(n,["addWatermark"])!==void 0)throw new Error("addWatermark parameter is not supported in Gemini API.");if(l(n,["labels"])!==void 0)throw new Error("labels parameter is not supported in Gemini API.");const S=l(n,["imageSize"]);if(e!==void 0&&S!=null&&d(e,["parameters","sampleImageSize"],S),l(n,["enhancePrompt"])!==void 0)throw new Error("enhancePrompt parameter is not supported in Gemini API.");return i}function c_(n,e,t){const i={},o=l(n,["outputGcsUri"]);e!==void 0&&o!=null&&d(e,["parameters","storageUri"],o);const r=l(n,["negativePrompt"]);e!==void 0&&r!=null&&d(e,["parameters","negativePrompt"],r);const s=l(n,["numberOfImages"]);e!==void 0&&s!=null&&d(e,["parameters","sampleCount"],s);const a=l(n,["aspectRatio"]);e!==void 0&&a!=null&&d(e,["parameters","aspectRatio"],a);const u=l(n,["guidanceScale"]);e!==void 0&&u!=null&&d(e,["parameters","guidanceScale"],u);const c=l(n,["seed"]);e!==void 0&&c!=null&&d(e,["parameters","seed"],c);const f=l(n,["safetyFilterLevel"]);e!==void 0&&f!=null&&d(e,["parameters","safetySetting"],f);const h=l(n,["personGeneration"]);e!==void 0&&h!=null&&d(e,["parameters","personGeneration"],h);const p=l(n,["includeSafetyAttributes"]);e!==void 0&&p!=null&&d(e,["parameters","includeSafetyAttributes"],p);const m=l(n,["includeRaiReason"]);e!==void 0&&m!=null&&d(e,["parameters","includeRaiReason"],m);const S=l(n,["language"]);e!==void 0&&S!=null&&d(e,["parameters","language"],S);const E=l(n,["outputMimeType"]);e!==void 0&&E!=null&&d(e,["parameters","outputOptions","mimeType"],E);const _=l(n,["outputCompressionQuality"]);e!==void 0&&_!=null&&d(e,["parameters","outputOptions","compressionQuality"],_);const g=l(n,["addWatermark"]);e!==void 0&&g!=null&&d(e,["parameters","addWatermark"],g);const w=l(n,["labels"]);e!==void 0&&w!=null&&d(e,["labels"],w);const T=l(n,["imageSize"]);e!==void 0&&T!=null&&d(e,["parameters","sampleImageSize"],T);const M=l(n,["enhancePrompt"]);return e!==void 0&&M!=null&&d(e,["parameters","enhancePrompt"],M),i}function u_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["prompt"]);r!=null&&d(i,["instances[0]","prompt"],r);const s=l(e,["config"]);return s!=null&&l_(s,i),i}function d_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["prompt"]);r!=null&&d(i,["instances[0]","prompt"],r);const s=l(e,["config"]);return s!=null&&c_(s,i),i}function f_(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["predictions"]);if(o!=null){let s=o;Array.isArray(s)&&(s=s.map(a=>M_(a))),d(t,["generatedImages"],s)}const r=l(n,["positivePromptSafetyAttributes"]);return r!=null&&d(t,["positivePromptSafetyAttributes"],Qd(r)),t}function h_(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["predictions"]);if(o!=null){let s=o;Array.isArray(s)&&(s=s.map(a=>jr(a))),d(t,["generatedImages"],s)}const r=l(n,["positivePromptSafetyAttributes"]);return r!=null&&d(t,["positivePromptSafetyAttributes"],jd(r)),t}function p_(n,e,t){const i={},o=l(n,["numberOfVideos"]);if(e!==void 0&&o!=null&&d(e,["parameters","sampleCount"],o),l(n,["outputGcsUri"])!==void 0)throw new Error("outputGcsUri parameter is not supported in Gemini API.");if(l(n,["fps"])!==void 0)throw new Error("fps parameter is not supported in Gemini API.");const r=l(n,["durationSeconds"]);if(e!==void 0&&r!=null&&d(e,["parameters","durationSeconds"],r),l(n,["seed"])!==void 0)throw new Error("seed parameter is not supported in Gemini API.");const s=l(n,["aspectRatio"]);e!==void 0&&s!=null&&d(e,["parameters","aspectRatio"],s);const a=l(n,["resolution"]);e!==void 0&&a!=null&&d(e,["parameters","resolution"],a);const u=l(n,["personGeneration"]);if(e!==void 0&&u!=null&&d(e,["parameters","personGeneration"],u),l(n,["pubsubTopic"])!==void 0)throw new Error("pubsubTopic parameter is not supported in Gemini API.");const c=l(n,["negativePrompt"]);e!==void 0&&c!=null&&d(e,["parameters","negativePrompt"],c);const f=l(n,["enhancePrompt"]);if(e!==void 0&&f!=null&&d(e,["parameters","enhancePrompt"],f),l(n,["generateAudio"])!==void 0)throw new Error("generateAudio parameter is not supported in Gemini API.");const h=l(n,["lastFrame"]);e!==void 0&&h!=null&&d(e,["instances[0]","lastFrame"],es(h));const p=l(n,["referenceImages"]);if(e!==void 0&&p!=null){let m=p;Array.isArray(m)&&(m=m.map(S=>gv(S))),d(e,["instances[0]","referenceImages"],m)}if(l(n,["mask"])!==void 0)throw new Error("mask parameter is not supported in Gemini API.");if(l(n,["compressionQuality"])!==void 0)throw new Error("compressionQuality parameter is not supported in Gemini API.");return i}function m_(n,e,t){const i={},o=l(n,["numberOfVideos"]);e!==void 0&&o!=null&&d(e,["parameters","sampleCount"],o);const r=l(n,["outputGcsUri"]);e!==void 0&&r!=null&&d(e,["parameters","storageUri"],r);const s=l(n,["fps"]);e!==void 0&&s!=null&&d(e,["parameters","fps"],s);const a=l(n,["durationSeconds"]);e!==void 0&&a!=null&&d(e,["parameters","durationSeconds"],a);const u=l(n,["seed"]);e!==void 0&&u!=null&&d(e,["parameters","seed"],u);const c=l(n,["aspectRatio"]);e!==void 0&&c!=null&&d(e,["parameters","aspectRatio"],c);const f=l(n,["resolution"]);e!==void 0&&f!=null&&d(e,["parameters","resolution"],f);const h=l(n,["personGeneration"]);e!==void 0&&h!=null&&d(e,["parameters","personGeneration"],h);const p=l(n,["pubsubTopic"]);e!==void 0&&p!=null&&d(e,["parameters","pubsubTopic"],p);const m=l(n,["negativePrompt"]);e!==void 0&&m!=null&&d(e,["parameters","negativePrompt"],m);const S=l(n,["enhancePrompt"]);e!==void 0&&S!=null&&d(e,["parameters","enhancePrompt"],S);const E=l(n,["generateAudio"]);e!==void 0&&E!=null&&d(e,["parameters","generateAudio"],E);const _=l(n,["lastFrame"]);e!==void 0&&_!=null&&d(e,["instances[0]","lastFrame"],Tn(_));const g=l(n,["referenceImages"]);if(e!==void 0&&g!=null){let M=g;Array.isArray(M)&&(M=M.map(L=>_v(L))),d(e,["instances[0]","referenceImages"],M)}const w=l(n,["mask"]);e!==void 0&&w!=null&&d(e,["instances[0]","mask"],mv(w));const T=l(n,["compressionQuality"]);return e!==void 0&&T!=null&&d(e,["parameters","compressionQuality"],T),i}function g_(n,e){const t={},i=l(n,["name"]);i!=null&&d(t,["name"],i);const o=l(n,["metadata"]);o!=null&&d(t,["metadata"],o);const r=l(n,["done"]);r!=null&&d(t,["done"],r);const s=l(n,["error"]);s!=null&&d(t,["error"],s);const a=l(n,["response","generateVideoResponse"]);return a!=null&&d(t,["response"],S_(a)),t}function __(n,e){const t={},i=l(n,["name"]);i!=null&&d(t,["name"],i);const o=l(n,["metadata"]);o!=null&&d(t,["metadata"],o);const r=l(n,["done"]);r!=null&&d(t,["done"],r);const s=l(n,["error"]);s!=null&&d(t,["error"],s);const a=l(n,["response"]);return a!=null&&d(t,["response"],E_(a)),t}function v_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["prompt"]);r!=null&&d(i,["instances[0]","prompt"],r);const s=l(e,["image"]);s!=null&&d(i,["instances[0]","image"],es(s));const a=l(e,["video"]);a!=null&&d(i,["instances[0]","video"],tf(a));const u=l(e,["source"]);u!=null&&T_(u,i);const c=l(e,["config"]);return c!=null&&p_(c,i),i}function y_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["prompt"]);r!=null&&d(i,["instances[0]","prompt"],r);const s=l(e,["image"]);s!=null&&d(i,["instances[0]","image"],Tn(s));const a=l(e,["video"]);a!=null&&d(i,["instances[0]","video"],nf(a));const u=l(e,["source"]);u!=null&&x_(u,i);const c=l(e,["config"]);return c!=null&&m_(c,i),i}function S_(n,e){const t={},i=l(n,["generatedSamples"]);if(i!=null){let s=i;Array.isArray(s)&&(s=s.map(a=>C_(a))),d(t,["generatedVideos"],s)}const o=l(n,["raiMediaFilteredCount"]);o!=null&&d(t,["raiMediaFilteredCount"],o);const r=l(n,["raiMediaFilteredReasons"]);return r!=null&&d(t,["raiMediaFilteredReasons"],r),t}function E_(n,e){const t={},i=l(n,["videos"]);if(i!=null){let s=i;Array.isArray(s)&&(s=s.map(a=>w_(a))),d(t,["generatedVideos"],s)}const o=l(n,["raiMediaFilteredCount"]);o!=null&&d(t,["raiMediaFilteredCount"],o);const r=l(n,["raiMediaFilteredReasons"]);return r!=null&&d(t,["raiMediaFilteredReasons"],r),t}function T_(n,e,t){const i={},o=l(n,["prompt"]);e!==void 0&&o!=null&&d(e,["instances[0]","prompt"],o);const r=l(n,["image"]);e!==void 0&&r!=null&&d(e,["instances[0]","image"],es(r));const s=l(n,["video"]);return e!==void 0&&s!=null&&d(e,["instances[0]","video"],tf(s)),i}function x_(n,e,t){const i={},o=l(n,["prompt"]);e!==void 0&&o!=null&&d(e,["instances[0]","prompt"],o);const r=l(n,["image"]);e!==void 0&&r!=null&&d(e,["instances[0]","image"],Tn(r));const s=l(n,["video"]);return e!==void 0&&s!=null&&d(e,["instances[0]","video"],nf(s)),i}function M_(n,e){const t={},i=l(n,["_self"]);i!=null&&d(t,["image"],L_(i));const o=l(n,["raiFilteredReason"]);o!=null&&d(t,["raiFilteredReason"],o);const r=l(n,["_self"]);return r!=null&&d(t,["safetyAttributes"],Qd(r)),t}function jr(n,e){const t={},i=l(n,["_self"]);i!=null&&d(t,["image"],Zd(i));const o=l(n,["raiFilteredReason"]);o!=null&&d(t,["raiFilteredReason"],o);const r=l(n,["_self"]);r!=null&&d(t,["safetyAttributes"],jd(r));const s=l(n,["prompt"]);return s!=null&&d(t,["enhancedPrompt"],s),t}function A_(n,e){const t={},i=l(n,["_self"]);i!=null&&d(t,["mask"],Zd(i));const o=l(n,["labels"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(t,["labels"],r)}return t}function C_(n,e){const t={},i=l(n,["video"]);return i!=null&&d(t,["video"],hv(i)),t}function w_(n,e){const t={},i=l(n,["_self"]);return i!=null&&d(t,["video"],pv(i)),t}function R_(n,e){const t={},i=l(n,["modelSelectionConfig"]);i!=null&&d(t,["modelConfig"],i);const o=l(n,["responseJsonSchema"]);o!=null&&d(t,["responseJsonSchema"],o);const r=l(n,["audioTimestamp"]);r!=null&&d(t,["audioTimestamp"],r);const s=l(n,["candidateCount"]);s!=null&&d(t,["candidateCount"],s);const a=l(n,["enableAffectiveDialog"]);a!=null&&d(t,["enableAffectiveDialog"],a);const u=l(n,["frequencyPenalty"]);u!=null&&d(t,["frequencyPenalty"],u);const c=l(n,["logprobs"]);c!=null&&d(t,["logprobs"],c);const f=l(n,["maxOutputTokens"]);f!=null&&d(t,["maxOutputTokens"],f);const h=l(n,["mediaResolution"]);h!=null&&d(t,["mediaResolution"],h);const p=l(n,["presencePenalty"]);p!=null&&d(t,["presencePenalty"],p);const m=l(n,["responseLogprobs"]);m!=null&&d(t,["responseLogprobs"],m);const S=l(n,["responseMimeType"]);S!=null&&d(t,["responseMimeType"],S);const E=l(n,["responseModalities"]);E!=null&&d(t,["responseModalities"],E);const _=l(n,["responseSchema"]);_!=null&&d(t,["responseSchema"],_);const g=l(n,["routingConfig"]);g!=null&&d(t,["routingConfig"],g);const w=l(n,["seed"]);w!=null&&d(t,["seed"],w);const T=l(n,["speechConfig"]);T!=null&&d(t,["speechConfig"],T);const M=l(n,["stopSequences"]);M!=null&&d(t,["stopSequences"],M);const L=l(n,["temperature"]);L!=null&&d(t,["temperature"],L);const I=l(n,["thinkingConfig"]);I!=null&&d(t,["thinkingConfig"],I);const N=l(n,["topK"]);N!=null&&d(t,["topK"],N);const k=l(n,["topP"]);if(k!=null&&d(t,["topP"],k),l(n,["enableEnhancedCivicAnswers"])!==void 0)throw new Error("enableEnhancedCivicAnswers parameter is not supported in Vertex AI.");return t}function I_(n,e,t){const i={},o=l(e,["model"]);return o!=null&&d(i,["_url","name"],lt(n,o)),i}function b_(n,e,t){const i={},o=l(e,["model"]);return o!=null&&d(i,["_url","name"],lt(n,o)),i}function P_(n,e){const t={},i=l(n,["authConfig"]);i!=null&&d(t,["authConfig"],wg(i));const o=l(n,["enableWidget"]);return o!=null&&d(t,["enableWidget"],o),t}function D_(n,e){const t={},i=l(n,["searchTypes"]);if(i!=null&&d(t,["searchTypes"],i),l(n,["blockingConfidence"])!==void 0)throw new Error("blockingConfidence parameter is not supported in Gemini API.");if(l(n,["excludeDomains"])!==void 0)throw new Error("excludeDomains parameter is not supported in Gemini API.");const o=l(n,["timeRangeFilter"]);return o!=null&&d(t,["timeRangeFilter"],o),t}function N_(n,e){const t={},i=l(n,["aspectRatio"]);i!=null&&d(t,["aspectRatio"],i);const o=l(n,["imageSize"]);if(o!=null&&d(t,["imageSize"],o),l(n,["personGeneration"])!==void 0)throw new Error("personGeneration parameter is not supported in Gemini API.");if(l(n,["prominentPeople"])!==void 0)throw new Error("prominentPeople parameter is not supported in Gemini API.");if(l(n,["outputMimeType"])!==void 0)throw new Error("outputMimeType parameter is not supported in Gemini API.");if(l(n,["outputCompressionQuality"])!==void 0)throw new Error("outputCompressionQuality parameter is not supported in Gemini API.");if(l(n,["imageOutputOptions"])!==void 0)throw new Error("imageOutputOptions parameter is not supported in Gemini API.");return t}function U_(n,e){const t={},i=l(n,["aspectRatio"]);i!=null&&d(t,["aspectRatio"],i);const o=l(n,["imageSize"]);o!=null&&d(t,["imageSize"],o);const r=l(n,["personGeneration"]);r!=null&&d(t,["personGeneration"],r);const s=l(n,["prominentPeople"]);s!=null&&d(t,["prominentPeople"],s);const a=l(n,["outputMimeType"]);a!=null&&d(t,["imageOutputOptions","mimeType"],a);const u=l(n,["outputCompressionQuality"]);u!=null&&d(t,["imageOutputOptions","compressionQuality"],u);const c=l(n,["imageOutputOptions"]);return c!=null&&d(t,["imageOutputOptions"],c),t}function L_(n,e){const t={},i=l(n,["bytesBase64Encoded"]);i!=null&&d(t,["imageBytes"],si(i));const o=l(n,["mimeType"]);return o!=null&&d(t,["mimeType"],o),t}function Zd(n,e){const t={},i=l(n,["gcsUri"]);i!=null&&d(t,["gcsUri"],i);const o=l(n,["bytesBase64Encoded"]);o!=null&&d(t,["imageBytes"],si(o));const r=l(n,["mimeType"]);return r!=null&&d(t,["mimeType"],r),t}function es(n,e){const t={};if(l(n,["gcsUri"])!==void 0)throw new Error("gcsUri parameter is not supported in Gemini API.");const i=l(n,["imageBytes"]);i!=null&&d(t,["bytesBase64Encoded"],si(i));const o=l(n,["mimeType"]);return o!=null&&d(t,["mimeType"],o),t}function Tn(n,e){const t={},i=l(n,["gcsUri"]);i!=null&&d(t,["gcsUri"],i);const o=l(n,["imageBytes"]);o!=null&&d(t,["bytesBase64Encoded"],si(o));const r=l(n,["mimeType"]);return r!=null&&d(t,["mimeType"],r),t}function F_(n,e,t,i){const o={},r=l(e,["pageSize"]);t!==void 0&&r!=null&&d(t,["_query","pageSize"],r);const s=l(e,["pageToken"]);t!==void 0&&s!=null&&d(t,["_query","pageToken"],s);const a=l(e,["filter"]);t!==void 0&&a!=null&&d(t,["_query","filter"],a);const u=l(e,["queryBase"]);return t!==void 0&&u!=null&&d(t,["_url","models_url"],Wd(n,u)),o}function B_(n,e,t,i){const o={},r=l(e,["pageSize"]);t!==void 0&&r!=null&&d(t,["_query","pageSize"],r);const s=l(e,["pageToken"]);t!==void 0&&s!=null&&d(t,["_query","pageToken"],s);const a=l(e,["filter"]);t!==void 0&&a!=null&&d(t,["_query","filter"],a);const u=l(e,["queryBase"]);return t!==void 0&&u!=null&&d(t,["_url","models_url"],Wd(n,u)),o}function O_(n,e,t){const i={},o=l(e,["config"]);return o!=null&&F_(n,o,i),i}function k_(n,e,t){const i={},o=l(e,["config"]);return o!=null&&B_(n,o,i),i}function G_(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["nextPageToken"]);o!=null&&d(t,["nextPageToken"],o);const r=l(n,["_self"]);if(r!=null){let s=qd(r);Array.isArray(s)&&(s=s.map(a=>ca(a))),d(t,["models"],s)}return t}function V_(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["nextPageToken"]);o!=null&&d(t,["nextPageToken"],o);const r=l(n,["_self"]);if(r!=null){let s=qd(r);Array.isArray(s)&&(s=s.map(a=>ua(a))),d(t,["models"],s)}return t}function H_(n,e){const t={},i=l(n,["maskMode"]);i!=null&&d(t,["maskMode"],i);const o=l(n,["segmentationClasses"]);o!=null&&d(t,["maskClasses"],o);const r=l(n,["maskDilation"]);return r!=null&&d(t,["dilation"],r),t}function ca(n,e){const t={},i=l(n,["name"]);i!=null&&d(t,["name"],i);const o=l(n,["displayName"]);o!=null&&d(t,["displayName"],o);const r=l(n,["description"]);r!=null&&d(t,["description"],r);const s=l(n,["version"]);s!=null&&d(t,["version"],s);const a=l(n,["_self"]);a!=null&&d(t,["tunedModelInfo"],ov(a));const u=l(n,["inputTokenLimit"]);u!=null&&d(t,["inputTokenLimit"],u);const c=l(n,["outputTokenLimit"]);c!=null&&d(t,["outputTokenLimit"],c);const f=l(n,["supportedGenerationMethods"]);f!=null&&d(t,["supportedActions"],f);const h=l(n,["temperature"]);h!=null&&d(t,["temperature"],h);const p=l(n,["maxTemperature"]);p!=null&&d(t,["maxTemperature"],p);const m=l(n,["topP"]);m!=null&&d(t,["topP"],m);const S=l(n,["topK"]);S!=null&&d(t,["topK"],S);const E=l(n,["thinking"]);return E!=null&&d(t,["thinking"],E),t}function ua(n,e){const t={},i=l(n,["name"]);i!=null&&d(t,["name"],i);const o=l(n,["displayName"]);o!=null&&d(t,["displayName"],o);const r=l(n,["description"]);r!=null&&d(t,["description"],r);const s=l(n,["versionId"]);s!=null&&d(t,["version"],s);const a=l(n,["deployedModels"]);if(a!=null){let p=a;Array.isArray(p)&&(p=p.map(m=>t_(m))),d(t,["endpoints"],p)}const u=l(n,["labels"]);u!=null&&d(t,["labels"],u);const c=l(n,["_self"]);c!=null&&d(t,["tunedModelInfo"],rv(c));const f=l(n,["defaultCheckpointId"]);f!=null&&d(t,["defaultCheckpointId"],f);const h=l(n,["checkpoints"]);if(h!=null){let p=h;Array.isArray(p)&&(p=p.map(m=>m)),d(t,["checkpoints"],p)}return t}function z_(n,e){const t={},i=l(n,["mediaResolution"]);i!=null&&d(t,["mediaResolution"],i);const o=l(n,["codeExecutionResult"]);o!=null&&d(t,["codeExecutionResult"],o);const r=l(n,["executableCode"]);r!=null&&d(t,["executableCode"],r);const s=l(n,["fileData"]);s!=null&&d(t,["fileData"],n_(s));const a=l(n,["functionCall"]);a!=null&&d(t,["functionCall"],i_(a));const u=l(n,["functionResponse"]);u!=null&&d(t,["functionResponse"],u);const c=l(n,["inlineData"]);c!=null&&d(t,["inlineData"],Rg(c));const f=l(n,["text"]);f!=null&&d(t,["text"],f);const h=l(n,["thought"]);h!=null&&d(t,["thought"],h);const p=l(n,["thoughtSignature"]);p!=null&&d(t,["thoughtSignature"],p);const m=l(n,["videoMetadata"]);return m!=null&&d(t,["videoMetadata"],m),t}function W_(n,e){const t={},i=l(n,["productImage"]);return i!=null&&d(t,["image"],Tn(i)),t}function q_(n,e,t){const i={},o=l(n,["numberOfImages"]);e!==void 0&&o!=null&&d(e,["parameters","sampleCount"],o);const r=l(n,["baseSteps"]);e!==void 0&&r!=null&&d(e,["parameters","baseSteps"],r);const s=l(n,["outputGcsUri"]);e!==void 0&&s!=null&&d(e,["parameters","storageUri"],s);const a=l(n,["seed"]);e!==void 0&&a!=null&&d(e,["parameters","seed"],a);const u=l(n,["safetyFilterLevel"]);e!==void 0&&u!=null&&d(e,["parameters","safetySetting"],u);const c=l(n,["personGeneration"]);e!==void 0&&c!=null&&d(e,["parameters","personGeneration"],c);const f=l(n,["addWatermark"]);e!==void 0&&f!=null&&d(e,["parameters","addWatermark"],f);const h=l(n,["outputMimeType"]);e!==void 0&&h!=null&&d(e,["parameters","outputOptions","mimeType"],h);const p=l(n,["outputCompressionQuality"]);e!==void 0&&p!=null&&d(e,["parameters","outputOptions","compressionQuality"],p);const m=l(n,["enhancePrompt"]);e!==void 0&&m!=null&&d(e,["parameters","enhancePrompt"],m);const S=l(n,["labels"]);return e!==void 0&&S!=null&&d(e,["labels"],S),i}function $_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["source"]);r!=null&&Y_(r,i);const s=l(e,["config"]);return s!=null&&q_(s,i),i}function X_(n,e){const t={},i=l(n,["predictions"]);if(i!=null){let o=i;Array.isArray(o)&&(o=o.map(r=>jr(r))),d(t,["generatedImages"],o)}return t}function Y_(n,e,t){const i={},o=l(n,["prompt"]);e!==void 0&&o!=null&&d(e,["instances[0]","prompt"],o);const r=l(n,["personImage"]);e!==void 0&&r!=null&&d(e,["instances[0]","personImage","image"],Tn(r));const s=l(n,["productImages"]);if(e!==void 0&&s!=null){let a=s;Array.isArray(a)&&(a=a.map(u=>W_(u))),d(e,["instances[0]","productImages"],a)}return i}function J_(n,e){const t={},i=l(n,["referenceImage"]);i!=null&&d(t,["referenceImage"],Tn(i));const o=l(n,["referenceId"]);o!=null&&d(t,["referenceId"],o);const r=l(n,["referenceType"]);r!=null&&d(t,["referenceType"],r);const s=l(n,["maskImageConfig"]);s!=null&&d(t,["maskImageConfig"],H_(s));const a=l(n,["controlImageConfig"]);a!=null&&d(t,["controlImageConfig"],Lg(a));const u=l(n,["styleImageConfig"]);u!=null&&d(t,["styleImageConfig"],u);const c=l(n,["subjectImageConfig"]);return c!=null&&d(t,["subjectImageConfig"],c),t}function Qd(n,e){const t={},i=l(n,["safetyAttributes","categories"]);i!=null&&d(t,["categories"],i);const o=l(n,["safetyAttributes","scores"]);o!=null&&d(t,["scores"],o);const r=l(n,["contentType"]);return r!=null&&d(t,["contentType"],r),t}function jd(n,e){const t={},i=l(n,["safetyAttributes","categories"]);i!=null&&d(t,["categories"],i);const o=l(n,["safetyAttributes","scores"]);o!=null&&d(t,["scores"],o);const r=l(n,["contentType"]);return r!=null&&d(t,["contentType"],r),t}function K_(n,e){const t={},i=l(n,["category"]);if(i!=null&&d(t,["category"],i),l(n,["method"])!==void 0)throw new Error("method parameter is not supported in Gemini API.");const o=l(n,["threshold"]);return o!=null&&d(t,["threshold"],o),t}function Z_(n,e){const t={},i=l(n,["image"]);return i!=null&&d(t,["image"],Tn(i)),t}function Q_(n,e,t){const i={},o=l(n,["mode"]);e!==void 0&&o!=null&&d(e,["parameters","mode"],o);const r=l(n,["maxPredictions"]);e!==void 0&&r!=null&&d(e,["parameters","maxPredictions"],r);const s=l(n,["confidenceThreshold"]);e!==void 0&&s!=null&&d(e,["parameters","confidenceThreshold"],s);const a=l(n,["maskDilation"]);e!==void 0&&a!=null&&d(e,["parameters","maskDilation"],a);const u=l(n,["binaryColorThreshold"]);e!==void 0&&u!=null&&d(e,["parameters","binaryColorThreshold"],u);const c=l(n,["labels"]);return e!==void 0&&c!=null&&d(e,["labels"],c),i}function j_(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["source"]);r!=null&&tv(r,i);const s=l(e,["config"]);return s!=null&&Q_(s,i),i}function ev(n,e){const t={},i=l(n,["predictions"]);if(i!=null){let o=i;Array.isArray(o)&&(o=o.map(r=>A_(r))),d(t,["generatedMasks"],o)}return t}function tv(n,e,t){const i={},o=l(n,["prompt"]);e!==void 0&&o!=null&&d(e,["instances[0]","prompt"],o);const r=l(n,["image"]);e!==void 0&&r!=null&&d(e,["instances[0]","image"],Tn(r));const s=l(n,["scribbleImage"]);return e!==void 0&&s!=null&&d(e,["instances[0]","scribble"],Z_(s)),i}function nv(n,e){const t={},i=l(n,["retrievalConfig"]);i!=null&&d(t,["retrievalConfig"],i);const o=l(n,["functionCallingConfig"]);return o!=null&&d(t,["functionCallingConfig"],o_(o)),t}function iv(n,e){const t={};if(l(n,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");const i=l(n,["computerUse"]);i!=null&&d(t,["computerUse"],i);const o=l(n,["fileSearch"]);o!=null&&d(t,["fileSearch"],o);const r=l(n,["googleSearch"]);r!=null&&d(t,["googleSearch"],D_(r));const s=l(n,["googleMaps"]);s!=null&&d(t,["googleMaps"],P_(s));const a=l(n,["codeExecution"]);if(a!=null&&d(t,["codeExecution"],a),l(n,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");const u=l(n,["functionDeclarations"]);if(u!=null){let p=u;Array.isArray(p)&&(p=p.map(m=>m)),d(t,["functionDeclarations"],p)}const c=l(n,["googleSearchRetrieval"]);if(c!=null&&d(t,["googleSearchRetrieval"],c),l(n,["parallelAiSearch"])!==void 0)throw new Error("parallelAiSearch parameter is not supported in Gemini API.");const f=l(n,["urlContext"]);f!=null&&d(t,["urlContext"],f);const h=l(n,["mcpServers"]);if(h!=null){let p=h;Array.isArray(p)&&(p=p.map(m=>m)),d(t,["mcpServers"],p)}return t}function ef(n,e){const t={},i=l(n,["retrieval"]);i!=null&&d(t,["retrieval"],i);const o=l(n,["computerUse"]);if(o!=null&&d(t,["computerUse"],o),l(n,["fileSearch"])!==void 0)throw new Error("fileSearch parameter is not supported in Vertex AI.");const r=l(n,["googleSearch"]);r!=null&&d(t,["googleSearch"],r);const s=l(n,["googleMaps"]);s!=null&&d(t,["googleMaps"],s);const a=l(n,["codeExecution"]);a!=null&&d(t,["codeExecution"],a);const u=l(n,["enterpriseWebSearch"]);u!=null&&d(t,["enterpriseWebSearch"],u);const c=l(n,["functionDeclarations"]);if(c!=null){let m=c;Array.isArray(m)&&(m=m.map(S=>r_(S))),d(t,["functionDeclarations"],m)}const f=l(n,["googleSearchRetrieval"]);f!=null&&d(t,["googleSearchRetrieval"],f);const h=l(n,["parallelAiSearch"]);h!=null&&d(t,["parallelAiSearch"],h);const p=l(n,["urlContext"]);if(p!=null&&d(t,["urlContext"],p),l(n,["mcpServers"])!==void 0)throw new Error("mcpServers parameter is not supported in Vertex AI.");return t}function ov(n,e){const t={},i=l(n,["baseModel"]);i!=null&&d(t,["baseModel"],i);const o=l(n,["createTime"]);o!=null&&d(t,["createTime"],o);const r=l(n,["updateTime"]);return r!=null&&d(t,["updateTime"],r),t}function rv(n,e){const t={},i=l(n,["labels","google-vertex-llm-tuning-base-model-id"]);i!=null&&d(t,["baseModel"],i);const o=l(n,["createTime"]);o!=null&&d(t,["createTime"],o);const r=l(n,["updateTime"]);return r!=null&&d(t,["updateTime"],r),t}function sv(n,e,t){const i={},o=l(n,["displayName"]);e!==void 0&&o!=null&&d(e,["displayName"],o);const r=l(n,["description"]);e!==void 0&&r!=null&&d(e,["description"],r);const s=l(n,["defaultCheckpointId"]);return e!==void 0&&s!=null&&d(e,["defaultCheckpointId"],s),i}function av(n,e,t){const i={},o=l(n,["displayName"]);e!==void 0&&o!=null&&d(e,["displayName"],o);const r=l(n,["description"]);e!==void 0&&r!=null&&d(e,["description"],r);const s=l(n,["defaultCheckpointId"]);return e!==void 0&&s!=null&&d(e,["defaultCheckpointId"],s),i}function lv(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","name"],lt(n,o));const r=l(e,["config"]);return r!=null&&sv(r,i),i}function cv(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["config"]);return r!=null&&av(r,i),i}function uv(n,e,t){const i={},o=l(n,["outputGcsUri"]);e!==void 0&&o!=null&&d(e,["parameters","storageUri"],o);const r=l(n,["safetyFilterLevel"]);e!==void 0&&r!=null&&d(e,["parameters","safetySetting"],r);const s=l(n,["personGeneration"]);e!==void 0&&s!=null&&d(e,["parameters","personGeneration"],s);const a=l(n,["includeRaiReason"]);e!==void 0&&a!=null&&d(e,["parameters","includeRaiReason"],a);const u=l(n,["outputMimeType"]);e!==void 0&&u!=null&&d(e,["parameters","outputOptions","mimeType"],u);const c=l(n,["outputCompressionQuality"]);e!==void 0&&c!=null&&d(e,["parameters","outputOptions","compressionQuality"],c);const f=l(n,["enhanceInputImage"]);e!==void 0&&f!=null&&d(e,["parameters","upscaleConfig","enhanceInputImage"],f);const h=l(n,["imagePreservationFactor"]);e!==void 0&&h!=null&&d(e,["parameters","upscaleConfig","imagePreservationFactor"],h);const p=l(n,["labels"]);e!==void 0&&p!=null&&d(e,["labels"],p);const m=l(n,["numberOfImages"]);e!==void 0&&m!=null&&d(e,["parameters","sampleCount"],m);const S=l(n,["mode"]);return e!==void 0&&S!=null&&d(e,["parameters","mode"],S),i}function dv(n,e,t){const i={},o=l(e,["model"]);o!=null&&d(i,["_url","model"],lt(n,o));const r=l(e,["image"]);r!=null&&d(i,["instances[0]","image"],Tn(r));const s=l(e,["upscaleFactor"]);s!=null&&d(i,["parameters","upscaleConfig","upscaleFactor"],s);const a=l(e,["config"]);return a!=null&&uv(a,i),i}function fv(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["predictions"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>jr(s))),d(t,["generatedImages"],r)}return t}function hv(n,e){const t={},i=l(n,["uri"]);i!=null&&d(t,["uri"],i);const o=l(n,["encodedVideo"]);o!=null&&d(t,["videoBytes"],si(o));const r=l(n,["encoding"]);return r!=null&&d(t,["mimeType"],r),t}function pv(n,e){const t={},i=l(n,["gcsUri"]);i!=null&&d(t,["uri"],i);const o=l(n,["bytesBase64Encoded"]);o!=null&&d(t,["videoBytes"],si(o));const r=l(n,["mimeType"]);return r!=null&&d(t,["mimeType"],r),t}function mv(n,e){const t={},i=l(n,["image"]);i!=null&&d(t,["_self"],Tn(i));const o=l(n,["maskMode"]);return o!=null&&d(t,["maskMode"],o),t}function gv(n,e){const t={},i=l(n,["image"]);i!=null&&d(t,["image"],es(i));const o=l(n,["referenceType"]);return o!=null&&d(t,["referenceType"],o),t}function _v(n,e){const t={},i=l(n,["image"]);i!=null&&d(t,["image"],Tn(i));const o=l(n,["referenceType"]);return o!=null&&d(t,["referenceType"],o),t}function tf(n,e){const t={},i=l(n,["uri"]);i!=null&&d(t,["uri"],i);const o=l(n,["videoBytes"]);o!=null&&d(t,["encodedVideo"],si(o));const r=l(n,["mimeType"]);return r!=null&&d(t,["encoding"],r),t}function nf(n,e){const t={},i=l(n,["uri"]);i!=null&&d(t,["gcsUri"],i);const o=l(n,["videoBytes"]);o!=null&&d(t,["bytesBase64Encoded"],si(o));const r=l(n,["mimeType"]);return r!=null&&d(t,["mimeType"],r),t}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function vv(n,e){const t={},i=l(n,["displayName"]);return e!==void 0&&i!=null&&d(e,["displayName"],i),t}function yv(n){const e={},t=l(n,["config"]);return t!=null&&vv(t,e),e}function Sv(n,e){const t={},i=l(n,["force"]);return e!==void 0&&i!=null&&d(e,["_query","force"],i),t}function Ev(n){const e={},t=l(n,["name"]);t!=null&&d(e,["_url","name"],t);const i=l(n,["config"]);return i!=null&&Sv(i,e),e}function Tv(n){const e={},t=l(n,["name"]);return t!=null&&d(e,["_url","name"],t),e}function xv(n,e){const t={},i=l(n,["customMetadata"]);if(e!==void 0&&i!=null){let r=i;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["customMetadata"],r)}const o=l(n,["chunkingConfig"]);return e!==void 0&&o!=null&&d(e,["chunkingConfig"],o),t}function Mv(n){const e={},t=l(n,["name"]);t!=null&&d(e,["name"],t);const i=l(n,["metadata"]);i!=null&&d(e,["metadata"],i);const o=l(n,["done"]);o!=null&&d(e,["done"],o);const r=l(n,["error"]);r!=null&&d(e,["error"],r);const s=l(n,["response"]);return s!=null&&d(e,["response"],Cv(s)),e}function Av(n){const e={},t=l(n,["fileSearchStoreName"]);t!=null&&d(e,["_url","file_search_store_name"],t);const i=l(n,["fileName"]);i!=null&&d(e,["fileName"],i);const o=l(n,["config"]);return o!=null&&xv(o,e),e}function Cv(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["parent"]);i!=null&&d(e,["parent"],i);const o=l(n,["documentName"]);return o!=null&&d(e,["documentName"],o),e}function wv(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);return e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),t}function Rv(n){const e={},t=l(n,["config"]);return t!=null&&wv(t,e),e}function Iv(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["fileSearchStores"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["fileSearchStores"],r)}return e}function of(n,e){const t={},i=l(n,["mimeType"]);e!==void 0&&i!=null&&d(e,["mimeType"],i);const o=l(n,["displayName"]);e!==void 0&&o!=null&&d(e,["displayName"],o);const r=l(n,["customMetadata"]);if(e!==void 0&&r!=null){let a=r;Array.isArray(a)&&(a=a.map(u=>u)),d(e,["customMetadata"],a)}const s=l(n,["chunkingConfig"]);return e!==void 0&&s!=null&&d(e,["chunkingConfig"],s),t}function bv(n){const e={},t=l(n,["fileSearchStoreName"]);t!=null&&d(e,["_url","file_search_store_name"],t);const i=l(n,["config"]);return i!=null&&of(i,e),e}function Pv(n){const e={},t=l(n,["sdkHttpResponse"]);return t!=null&&d(e,["sdkHttpResponse"],t),e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Dv="Content-Type",Nv="X-Server-Timeout",Uv="User-Agent",da="x-goog-api-client",Lv="1.44.0",Fv=`google-genai-sdk/${Lv}`,Bv="v1beta1",Ov="v1beta",kv=5,Gv=[408,429,500,502,503,504];class Vv{constructor(e){var t,i,o;this.clientOptions=Object.assign({},e),this.customBaseUrl=(t=e.httpOptions)===null||t===void 0?void 0:t.baseUrl,this.clientOptions.vertexai&&(this.clientOptions.project&&this.clientOptions.location?this.clientOptions.apiKey=void 0:this.clientOptions.apiKey&&(this.clientOptions.project=void 0,this.clientOptions.location=void 0));const r={};if(this.clientOptions.vertexai){if(!this.clientOptions.location&&!this.clientOptions.apiKey&&!this.customBaseUrl&&(this.clientOptions.location="global"),!(this.clientOptions.project&&this.clientOptions.location||this.clientOptions.apiKey)&&!this.customBaseUrl)throw new Error("Authentication is not set up. Please provide either a project and location, or an API key, or a custom base URL.");const a=e.project&&e.location||!!e.apiKey;this.customBaseUrl&&!a?(r.baseUrl=this.customBaseUrl,this.clientOptions.project=void 0,this.clientOptions.location=void 0):this.clientOptions.apiKey||this.clientOptions.location==="global"?r.baseUrl="https://aiplatform.googleapis.com/":this.clientOptions.project&&this.clientOptions.location&&(r.baseUrl=`https://${this.clientOptions.location}-aiplatform.googleapis.com/`),r.apiVersion=(i=this.clientOptions.apiVersion)!==null&&i!==void 0?i:Bv}else this.clientOptions.apiKey||console.warn("API key should be set when using the Gemini API."),r.apiVersion=(o=this.clientOptions.apiVersion)!==null&&o!==void 0?o:Ov,r.baseUrl="https://generativelanguage.googleapis.com/";r.headers=this.getDefaultHeaders(),this.clientOptions.httpOptions=r,e.httpOptions&&(this.clientOptions.httpOptions=this.patchHttpOptions(r,e.httpOptions))}isVertexAI(){var e;return(e=this.clientOptions.vertexai)!==null&&e!==void 0?e:!1}getProject(){return this.clientOptions.project}getLocation(){return this.clientOptions.location}getCustomBaseUrl(){return this.customBaseUrl}async getAuthHeaders(){const e=new Headers;return await this.clientOptions.auth.addAuthHeaders(e),e}getApiVersion(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.apiVersion!==void 0)return this.clientOptions.httpOptions.apiVersion;throw new Error("API version is not set.")}getBaseUrl(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.baseUrl!==void 0)return this.clientOptions.httpOptions.baseUrl;throw new Error("Base URL is not set.")}getRequestUrl(){return this.getRequestUrlInternal(this.clientOptions.httpOptions)}getHeaders(){if(this.clientOptions.httpOptions&&this.clientOptions.httpOptions.headers!==void 0)return this.clientOptions.httpOptions.headers;throw new Error("Headers are not set.")}getRequestUrlInternal(e){if(!e||e.baseUrl===void 0||e.apiVersion===void 0)throw new Error("HTTP options are not correctly set.");const i=[e.baseUrl.endsWith("/")?e.baseUrl.slice(0,-1):e.baseUrl];return e.apiVersion&&e.apiVersion!==""&&i.push(e.apiVersion),i.join("/")}getBaseResourcePath(){return`projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`}getApiKey(){return this.clientOptions.apiKey}getWebsocketBaseUrl(){const e=this.getBaseUrl(),t=new URL(e);return t.protocol=t.protocol=="http:"?"ws":"wss",t.toString()}setBaseUrl(e){if(this.clientOptions.httpOptions)this.clientOptions.httpOptions.baseUrl=e;else throw new Error("HTTP options are not correctly set.")}constructUrl(e,t,i){const o=[this.getRequestUrlInternal(t)];return i&&o.push(this.getBaseResourcePath()),e!==""&&o.push(e),new URL(`${o.join("/")}`)}shouldPrependVertexProjectPath(e,t){return!(t.baseUrl&&t.baseUrlResourceScope===ra.COLLECTION||this.clientOptions.apiKey||!this.clientOptions.vertexai||e.path.startsWith("projects/")||e.httpMethod==="GET"&&e.path.startsWith("publishers/google/models"))}async request(e){let t=this.clientOptions.httpOptions;e.httpOptions&&(t=this.patchHttpOptions(this.clientOptions.httpOptions,e.httpOptions));const i=this.shouldPrependVertexProjectPath(e,t),o=this.constructUrl(e.path,t,i);if(e.queryParams)for(const[s,a]of Object.entries(e.queryParams))o.searchParams.append(s,String(a));let r={};if(e.httpMethod==="GET"){if(e.body&&e.body!=="{}")throw new Error("Request body should be empty for GET request, but got non empty request body")}else r.body=e.body;return r=await this.includeExtraHttpOptionsToRequestInit(r,t,o.toString(),e.abortSignal),this.unaryApiCall(o,r,e.httpMethod)}patchHttpOptions(e,t){const i=JSON.parse(JSON.stringify(e));for(const[o,r]of Object.entries(t))typeof r=="object"?i[o]=Object.assign(Object.assign({},i[o]),r):r!==void 0&&(i[o]=r);return i}async requestStream(e){let t=this.clientOptions.httpOptions;e.httpOptions&&(t=this.patchHttpOptions(this.clientOptions.httpOptions,e.httpOptions));const i=this.shouldPrependVertexProjectPath(e,t),o=this.constructUrl(e.path,t,i);(!o.searchParams.has("alt")||o.searchParams.get("alt")!=="sse")&&o.searchParams.set("alt","sse");let r={};return r.body=e.body,r=await this.includeExtraHttpOptionsToRequestInit(r,t,o.toString(),e.abortSignal),this.streamApiCall(o,r,e.httpMethod)}async includeExtraHttpOptionsToRequestInit(e,t,i,o){if(t&&t.timeout||o){const r=new AbortController,s=r.signal;if(t.timeout&&(t==null?void 0:t.timeout)>0){const a=setTimeout(()=>r.abort(),t.timeout);a&&typeof a.unref=="function"&&a.unref()}o&&o.addEventListener("abort",()=>{r.abort()}),e.signal=s}return t&&t.extraBody!==null&&Hv(e,t.extraBody),e.headers=await this.getHeadersInternal(t,i),e}async unaryApiCall(e,t,i){return this.apiCall(e.toString(),Object.assign(Object.assign({},t),{method:i})).then(async o=>(await cu(o),new sa(o))).catch(o=>{throw o instanceof Error?o:new Error(JSON.stringify(o))})}async streamApiCall(e,t,i){return this.apiCall(e.toString(),Object.assign(Object.assign({},t),{method:i})).then(async o=>(await cu(o),this.processStreamResponse(o))).catch(o=>{throw o instanceof Error?o:new Error(JSON.stringify(o))})}processStreamResponse(e){return _n(this,arguments,function*(){var i;const o=(i=e==null?void 0:e.body)===null||i===void 0?void 0:i.getReader(),r=new TextDecoder("utf-8");if(!o)throw new Error("Response body is empty");try{let s="";const a="data:",u=[`

`,"\r\r",`\r
\r
`];for(;;){const{done:c,value:f}=yield qe(o.read());if(c){if(s.trim().length>0)throw new Error("Incomplete JSON segment at the end");break}const h=r.decode(f,{stream:!0});try{const S=JSON.parse(h);if("error"in S){const E=JSON.parse(JSON.stringify(S.error)),_=E.status,g=E.code,w=`got status: ${_}. ${JSON.stringify(S)}`;if(g>=400&&g<600)throw new Qr({message:w,status:g})}}catch(S){if(S.name==="ApiError")throw S}s+=h;let p=-1,m=0;for(;;){p=-1,m=0;for(const _ of u){const g=s.indexOf(_);g!==-1&&(p===-1||g<p)&&(p=g,m=_.length)}if(p===-1)break;const S=s.substring(0,p);s=s.substring(p+m);const E=S.trim();if(E.startsWith(a)){const _=E.substring(a.length).trim();try{const g=new Response(_,{headers:e==null?void 0:e.headers,status:e==null?void 0:e.status,statusText:e==null?void 0:e.statusText});yield yield qe(new sa(g))}catch(g){throw new Error(`exception parsing stream chunk ${_}. ${g}`)}}}}}finally{o.releaseLock()}})}async apiCall(e,t){var i;if(!this.clientOptions.httpOptions||!this.clientOptions.httpOptions.retryOptions)return fetch(e,t);const o=this.clientOptions.httpOptions.retryOptions;return Ch(async()=>{const s=await fetch(e,t);if(s.ok)return s;throw Gv.includes(s.status)?new Error(`Retryable HTTP Error: ${s.statusText}`):new Ld.AbortError(`Non-retryable exception ${s.statusText} sending request`)},{retries:((i=o.attempts)!==null&&i!==void 0?i:kv)-1})}getDefaultHeaders(){const e={},t=Fv+" "+this.clientOptions.userAgentExtra;return e[Uv]=t,e[da]=t,e[Dv]="application/json",e}async getHeadersInternal(e,t){const i=new Headers;if(e&&e.headers){for(const[o,r]of Object.entries(e.headers))i.append(o,r);e.timeout&&e.timeout>0&&i.append(Nv,String(Math.ceil(e.timeout/1e3)))}return await this.clientOptions.auth.addAuthHeaders(i,t),i}getFileName(e){var t;let i="";return typeof e=="string"&&(i=e.replace(/[/\\]+$/,""),i=(t=i.split(/[/\\]/).pop())!==null&&t!==void 0?t:""),i}async uploadFile(e,t){var i;const o={};t!=null&&(o.mimeType=t.mimeType,o.name=t.name,o.displayName=t.displayName),o.name&&!o.name.startsWith("files/")&&(o.name=`files/${o.name}`);const r=this.clientOptions.uploader,s=await r.stat(e);o.sizeBytes=String(s.size);const a=(i=t==null?void 0:t.mimeType)!==null&&i!==void 0?i:s.type;if(a===void 0||a==="")throw new Error("Can not determine mimeType. Please provide mimeType in the config.");o.mimeType=a;const u={file:o},c=this.getFileName(e),f=Ee("upload/v1beta/files",u._url),h=await this.fetchUploadUrl(f,o.sizeBytes,o.mimeType,c,u,t==null?void 0:t.httpOptions);return r.upload(e,h,this)}async uploadFileToFileSearchStore(e,t,i){var o;const r=this.clientOptions.uploader,s=await r.stat(t),a=String(s.size),u=(o=i==null?void 0:i.mimeType)!==null&&o!==void 0?o:s.type;if(u===void 0||u==="")throw new Error("Can not determine mimeType. Please provide mimeType in the config.");const c=`upload/v1beta/${e}:uploadToFileSearchStore`,f=this.getFileName(t),h={};i!=null&&of(i,h);const p=await this.fetchUploadUrl(c,a,u,f,h,i==null?void 0:i.httpOptions);return r.uploadToFileSearchStore(t,p,this)}async downloadFile(e){await this.clientOptions.downloader.download(e,this)}async fetchUploadUrl(e,t,i,o,r,s){var a;let u={};s?u=s:u={apiVersion:"",headers:Object.assign({"Content-Type":"application/json","X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${t}`,"X-Goog-Upload-Header-Content-Type":`${i}`},o?{"X-Goog-Upload-File-Name":o}:{})};const c=await this.request({path:e,body:JSON.stringify(r),httpMethod:"POST",httpOptions:u});if(!c||!(c!=null&&c.headers))throw new Error("Server did not return an HttpResponse or the returned HttpResponse did not have headers.");const f=(a=c==null?void 0:c.headers)===null||a===void 0?void 0:a["x-goog-upload-url"];if(f===void 0)throw new Error("Failed to get upload url. Server did not return the x-google-upload-url in the headers");return f}}async function cu(n){var e;if(n===void 0)throw new Error("response is undefined");if(!n.ok){const t=n.status;let i;!((e=n.headers.get("content-type"))===null||e===void 0)&&e.includes("application/json")?i=await n.json():i={error:{message:await n.text(),code:n.status,status:n.statusText}};const o=JSON.stringify(i);throw t>=400&&t<600?new Qr({message:o,status:t}):new Error(o)}}function Hv(n,e){if(!e||Object.keys(e).length===0)return;if(n.body instanceof Blob){console.warn("includeExtraBodyToRequestInit: extraBody provided but current request body is a Blob. extraBody will be ignored as merging is not supported for Blob bodies.");return}let t={};if(typeof n.body=="string"&&n.body.length>0)try{const r=JSON.parse(n.body);if(typeof r=="object"&&r!==null&&!Array.isArray(r))t=r;else{console.warn("includeExtraBodyToRequestInit: Original request body is valid JSON but not a non-array object. Skip applying extraBody to the request body.");return}}catch{console.warn("includeExtraBodyToRequestInit: Original request body is not valid JSON. Skip applying extraBody to the request body.");return}function i(r,s){const a=Object.assign({},r);for(const u in s)if(Object.prototype.hasOwnProperty.call(s,u)){const c=s[u],f=a[u];c&&typeof c=="object"&&!Array.isArray(c)&&f&&typeof f=="object"&&!Array.isArray(f)?a[u]=i(f,c):(f&&c&&typeof f!=typeof c&&console.warn(`includeExtraBodyToRequestInit:deepMerge: Type mismatch for key "${u}". Original type: ${typeof f}, New type: ${typeof c}. Overwriting.`),a[u]=c)}return a}const o=i(t,e);n.body=JSON.stringify(o)}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const zv="mcp_used/unknown";let Wv=!1;function rf(n){for(const e of n)if(qv(e)||typeof e=="object"&&"inputSchema"in e)return!0;return Wv}function sf(n){var e;const t=(e=n[da])!==null&&e!==void 0?e:"";n[da]=(t+` ${zv}`).trimStart()}function qv(n){return n!==null&&typeof n=="object"&&n instanceof ml}function $v(n){return _n(this,arguments,function*(t,i=100){let o,r=0;for(;r<i;){const s=yield qe(t.listTools({cursor:o}));for(const a of s.tools)yield yield qe(a),r++;if(!s.nextCursor)break;o=s.nextCursor}})}class ml{constructor(e=[],t){this.mcpTools=[],this.functionNameToMcpClient={},this.mcpClients=e,this.config=t}static create(e,t){return new ml(e,t)}async initialize(){var e,t,i,o;if(this.mcpTools.length>0)return;const r={},s=[];for(const f of this.mcpClients)try{for(var a=!0,u=(t=void 0,vn($v(f))),c;c=await u.next(),e=c.done,!e;a=!0){o=c.value,a=!1;const h=o;s.push(h);const p=h.name;if(r[p])throw new Error(`Duplicate function name ${p} found in MCP tools. Please ensure function names are unique.`);r[p]=f}}catch(h){t={error:h}}finally{try{!a&&!e&&(i=u.return)&&await i.call(u)}finally{if(t)throw t.error}}this.mcpTools=s,this.functionNameToMcpClient=r}async tool(){return await this.initialize(),pp(this.mcpTools,this.config)}async callTool(e){await this.initialize();const t=[];for(const i of e)if(i.name in this.functionNameToMcpClient){const o=this.functionNameToMcpClient[i.name];let r;this.config.timeout&&(r={timeout:this.config.timeout});const s=await o.callTool({name:i.name,arguments:i.args},void 0,r);t.push({functionResponse:{name:i.name,response:s.isError?{error:s}:s}})}return t}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */async function Xv(n,e,t){const i=new sp;let o;t.data instanceof Blob?o=JSON.parse(await t.data.text()):o=JSON.parse(t.data),Object.assign(i,o),e(i)}class Yv{constructor(e,t,i){this.apiClient=e,this.auth=t,this.webSocketFactory=i}async connect(e){var t,i;if(this.apiClient.isVertexAI())throw new Error("Live music is not supported for Vertex AI.");console.warn("Live music generation is experimental and may change in future versions.");const o=this.apiClient.getWebsocketBaseUrl(),r=this.apiClient.getApiVersion(),s=Zv(this.apiClient.getDefaultHeaders()),a=this.apiClient.getApiKey(),u=`${o}/ws/google.ai.generativelanguage.${r}.GenerativeService.BidiGenerateMusic?key=${a}`;let c=()=>{};const f=new Promise(T=>{c=T}),h=e.callbacks,p=function(){c({})},m=this.apiClient,S={onopen:p,onmessage:T=>{Xv(m,h.onmessage,T)},onerror:(t=h==null?void 0:h.onerror)!==null&&t!==void 0?t:function(T){},onclose:(i=h==null?void 0:h.onclose)!==null&&i!==void 0?i:function(T){}},E=this.webSocketFactory.create(u,Kv(s),S);E.connect(),await f;const w={setup:{model:lt(this.apiClient,e.model)}};return E.send(JSON.stringify(w)),new Jv(E,this.apiClient)}}class Jv{constructor(e,t){this.conn=e,this.apiClient=t}async setWeightedPrompts(e){if(!e.weightedPrompts||Object.keys(e.weightedPrompts).length===0)throw new Error("Weighted prompts must be set and contain at least one entry.");const t=_g(e);this.conn.send(JSON.stringify({clientContent:t}))}async setMusicGenerationConfig(e){e.musicGenerationConfig||(e.musicGenerationConfig={});const t=gg(e);this.conn.send(JSON.stringify(t))}sendPlaybackControl(e){const t={playbackControl:e};this.conn.send(JSON.stringify(t))}play(){this.sendPlaybackControl(Hi.PLAY)}pause(){this.sendPlaybackControl(Hi.PAUSE)}stop(){this.sendPlaybackControl(Hi.STOP)}resetContext(){this.sendPlaybackControl(Hi.RESET_CONTEXT)}close(){this.conn.close()}}function Kv(n){const e={};return n.forEach((t,i)=>{e[i]=t}),e}function Zv(n){const e=new Headers;for(const[t,i]of Object.entries(n))e.append(t,i);return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Qv="FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.";async function jv(n,e,t){const i=new rp;let o;t.data instanceof Blob?o=await t.data.text():t.data instanceof ArrayBuffer?o=new TextDecoder().decode(t.data):o=t.data;const r=JSON.parse(o);if(n.isVertexAI()){const s=Sg(r);Object.assign(i,s)}else Object.assign(i,r);e(i)}class e0{constructor(e,t,i){this.apiClient=e,this.auth=t,this.webSocketFactory=i,this.music=new Yv(this.apiClient,this.auth,this.webSocketFactory)}async connect(e){var t,i,o,r,s,a;if(e.config&&e.config.httpOptions)throw new Error("The Live module does not support httpOptions at request-level in LiveConnectConfig yet. Please use the client-level httpOptions configuration instead.");const u=this.apiClient.getWebsocketBaseUrl(),c=this.apiClient.getApiVersion();let f;const h=this.apiClient.getHeaders();e.config&&e.config.tools&&rf(e.config.tools)&&sf(h);const p=o0(h);if(this.apiClient.isVertexAI()){const A=this.apiClient.getProject(),x=this.apiClient.getLocation(),O=this.apiClient.getApiKey(),Y=!!A&&!!x||!!O;this.apiClient.getCustomBaseUrl()&&!Y?f=u:(f=`${u}/ws/google.cloud.aiplatform.${c}.LlmBidiService/BidiGenerateContent`,await this.auth.addAuthHeaders(p,f))}else{const A=this.apiClient.getApiKey();let x="BidiGenerateContent",O="key";A!=null&&A.startsWith("auth_tokens/")&&(console.warn("Warning: Ephemeral token support is experimental and may change in future versions."),c!=="v1alpha"&&console.warn("Warning: The SDK's ephemeral token support is in v1alpha only. Please use const ai = new GoogleGenAI({apiKey: token.name, httpOptions: { apiVersion: 'v1alpha' }}); before session connection."),x="BidiGenerateContentConstrained",O="access_token"),f=`${u}/ws/google.ai.generativelanguage.${c}.GenerativeService.${x}?${O}=${A}`}let m=()=>{};const S=new Promise(A=>{m=A}),E=e.callbacks,_=function(){var A;(A=E==null?void 0:E.onopen)===null||A===void 0||A.call(E),m({})},g=this.apiClient,w={onopen:_,onmessage:A=>{jv(g,E.onmessage,A)},onerror:(t=E==null?void 0:E.onerror)!==null&&t!==void 0?t:function(A){},onclose:(i=E==null?void 0:E.onclose)!==null&&i!==void 0?i:function(A){}},T=this.webSocketFactory.create(f,i0(p),w);T.connect(),await S;let M=lt(this.apiClient,e.model);if(this.apiClient.isVertexAI()&&M.startsWith("publishers/")){const A=this.apiClient.getProject(),x=this.apiClient.getLocation();A&&x&&(M=`projects/${A}/locations/${x}/`+M)}let L={};this.apiClient.isVertexAI()&&((o=e.config)===null||o===void 0?void 0:o.responseModalities)===void 0&&(e.config===void 0?e.config={responseModalities:[Do.AUDIO]}:e.config.responseModalities=[Do.AUDIO]),!((r=e.config)===null||r===void 0)&&r.generationConfig&&console.warn("Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).");const I=(a=(s=e.config)===null||s===void 0?void 0:s.tools)!==null&&a!==void 0?a:[],N=[];for(const A of I)if(this.isCallableTool(A)){const x=A;N.push(await x.tool())}else N.push(A);N.length>0&&(e.config.tools=N);const k={model:M,config:e.config,callbacks:e.callbacks};return this.apiClient.isVertexAI()?L=mg(this.apiClient,k):L=pg(this.apiClient,k),delete L.config,T.send(JSON.stringify(L)),new n0(T,this.apiClient)}isCallableTool(e){return"callTool"in e&&typeof e.callTool=="function"}}const t0={turnComplete:!0};class n0{constructor(e,t){this.conn=e,this.apiClient=t}tLiveClientContent(e,t){if(t.turns!==null&&t.turns!==void 0){let i=[];try{i=Qt(t.turns),e.isVertexAI()||(i=i.map(o=>Go(o)))}catch{throw new Error(`Failed to parse client content "turns", type: '${typeof t.turns}'`)}return{clientContent:{turns:i,turnComplete:t.turnComplete}}}return{clientContent:{turnComplete:t.turnComplete}}}tLiveClienttToolResponse(e,t){let i=[];if(t.functionResponses==null)throw new Error("functionResponses is required.");if(Array.isArray(t.functionResponses)?i=t.functionResponses:i=[t.functionResponses],i.length===0)throw new Error("functionResponses is required.");for(const r of i){if(typeof r!="object"||r===null||!("name"in r)||!("response"in r))throw new Error(`Could not parse function response, type '${typeof r}'.`);if(!e.isVertexAI()&&!("id"in r))throw new Error(Qv)}return{toolResponse:{functionResponses:i}}}sendClientContent(e){e=Object.assign(Object.assign({},t0),e);const t=this.tLiveClientContent(this.apiClient,e);this.conn.send(JSON.stringify(t))}sendRealtimeInput(e){let t={};this.apiClient.isVertexAI()?t={realtimeInput:yg(e)}:t={realtimeInput:vg(e)},this.conn.send(JSON.stringify(t))}sendToolResponse(e){if(e.functionResponses==null)throw new Error("Tool response parameters are required.");const t=this.tLiveClienttToolResponse(this.apiClient,e);this.conn.send(JSON.stringify(t))}close(){this.conn.close()}}function i0(n){const e={};return n.forEach((t,i)=>{e[i]=t}),e}function o0(n){const e=new Headers;for(const[t,i]of Object.entries(n))e.append(t,i);return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const uu=10;function du(n){var e,t,i;if(!((e=n==null?void 0:n.automaticFunctionCalling)===null||e===void 0)&&e.disable)return!0;let o=!1;for(const s of(t=n==null?void 0:n.tools)!==null&&t!==void 0?t:[])if(Xi(s)){o=!0;break}if(!o)return!0;const r=(i=n==null?void 0:n.automaticFunctionCalling)===null||i===void 0?void 0:i.maximumRemoteCalls;return r&&(r<0||!Number.isInteger(r))||r==0?(console.warn("Invalid maximumRemoteCalls value provided for automatic function calling. Disabled automatic function calling. Please provide a valid integer value greater than 0. maximumRemoteCalls provided:",r),!0):!1}function Xi(n){return"callTool"in n&&typeof n.callTool=="function"}function r0(n){var e,t,i;return(i=(t=(e=n.config)===null||e===void 0?void 0:e.tools)===null||t===void 0?void 0:t.some(o=>Xi(o)))!==null&&i!==void 0?i:!1}function fu(n){var e;const t=[];return!((e=n==null?void 0:n.config)===null||e===void 0)&&e.tools&&n.config.tools.forEach((i,o)=>{if(Xi(i))return;const r=i;r.functionDeclarations&&r.functionDeclarations.length>0&&t.push(o)}),t}function hu(n){var e;return!(!((e=n==null?void 0:n.automaticFunctionCalling)===null||e===void 0)&&e.ignoreCallHistory)}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class s0 extends Wn{constructor(e){super(),this.apiClient=e,this.embedContent=async t=>{if(!this.apiClient.isVertexAI())return await this.embedContentInternal(t);if(t.model.includes("gemini")&&t.model!=="gemini-embedding-001"||t.model.includes("maas")){const o=Qt(t.contents);if(o.length>1)throw new Error("The embedContent API for this model only supports one content at a time.");const r=Object.assign(Object.assign({},t),{content:o[0],embeddingApiType:Br.EMBED_CONTENT});return await this.embedContentInternal(r)}else{const o=Object.assign(Object.assign({},t),{embeddingApiType:Br.PREDICT});return await this.embedContentInternal(o)}},this.generateContent=async t=>{var i,o,r,s,a;const u=await this.processParamsMaybeAddMcpUsage(t);if(this.maybeMoveToResponseJsonSchem(t),!r0(t)||du(t.config))return await this.generateContentInternal(u);const c=fu(t);if(c.length>0){const E=c.map(_=>`tools[${_}]`).join(", ");throw new Error(`Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations is not yet supported. Incompatible tools found at ${E}.`)}let f,h;const p=Qt(u.contents),m=(r=(o=(i=u.config)===null||i===void 0?void 0:i.automaticFunctionCalling)===null||o===void 0?void 0:o.maximumRemoteCalls)!==null&&r!==void 0?r:uu;let S=0;for(;S<m&&(f=await this.generateContentInternal(u),!(!f.functionCalls||f.functionCalls.length===0));){const E=f.candidates[0].content,_=[];for(const g of(a=(s=t.config)===null||s===void 0?void 0:s.tools)!==null&&a!==void 0?a:[])if(Xi(g)){const T=await g.callTool(f.functionCalls);_.push(...T)}S++,h={role:"user",parts:_},u.contents=Qt(u.contents),u.contents.push(E),u.contents.push(h),hu(u.config)&&(p.push(E),p.push(h))}return hu(u.config)&&(f.automaticFunctionCallingHistory=p),f},this.generateContentStream=async t=>{var i,o,r,s,a;if(this.maybeMoveToResponseJsonSchem(t),du(t.config)){const h=await this.processParamsMaybeAddMcpUsage(t);return await this.generateContentStreamInternal(h)}const u=fu(t);if(u.length>0){const h=u.map(p=>`tools[${p}]`).join(", ");throw new Error(`Incompatible tools found at ${h}. Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations" is not yet supported.`)}const c=(r=(o=(i=t==null?void 0:t.config)===null||i===void 0?void 0:i.toolConfig)===null||o===void 0?void 0:o.functionCallingConfig)===null||r===void 0?void 0:r.streamFunctionCallArguments,f=(a=(s=t==null?void 0:t.config)===null||s===void 0?void 0:s.automaticFunctionCalling)===null||a===void 0?void 0:a.disable;if(c&&!f)throw new Error("Running in streaming mode with 'streamFunctionCallArguments' enabled, this feature is not compatible with automatic function calling (AFC). Please set 'config.automaticFunctionCalling.disable' to true to disable AFC or leave 'config.toolConfig.functionCallingConfig.streamFunctionCallArguments' to be undefined or set to false to disable streaming function call arguments feature.");return await this.processAfcStream(t)},this.generateImages=async t=>await this.generateImagesInternal(t).then(i=>{var o;let r;const s=[];if(i!=null&&i.generatedImages)for(const u of i.generatedImages)u&&(u!=null&&u.safetyAttributes)&&((o=u==null?void 0:u.safetyAttributes)===null||o===void 0?void 0:o.contentType)==="Positive Prompt"?r=u==null?void 0:u.safetyAttributes:s.push(u);let a;return r?a={generatedImages:s,positivePromptSafetyAttributes:r,sdkHttpResponse:i.sdkHttpResponse}:a={generatedImages:s,sdkHttpResponse:i.sdkHttpResponse},a}),this.list=async t=>{var i;const s={config:Object.assign(Object.assign({},{queryBase:!0}),t==null?void 0:t.config)};if(this.apiClient.isVertexAI()&&!s.config.queryBase){if(!((i=s.config)===null||i===void 0)&&i.filter)throw new Error("Filtering tuned models list for Vertex AI is not currently supported");s.config.filter="labels.tune-type:*"}return new Mi(zn.PAGED_ITEM_MODELS,a=>this.listInternal(a),await this.listInternal(s),s)},this.editImage=async t=>{const i={model:t.model,prompt:t.prompt,referenceImages:[],config:t.config};return t.referenceImages&&t.referenceImages&&(i.referenceImages=t.referenceImages.map(o=>o.toReferenceImageAPI())),await this.editImageInternal(i)},this.upscaleImage=async t=>{let i={numberOfImages:1,mode:"upscale"};t.config&&(i=Object.assign(Object.assign({},i),t.config));const o={model:t.model,image:t.image,upscaleFactor:t.upscaleFactor,config:i};return await this.upscaleImageInternal(o)},this.generateVideos=async t=>{var i,o,r,s,a,u;if((t.prompt||t.image||t.video)&&t.source)throw new Error("Source and prompt/image/video are mutually exclusive. Please only use source.");return this.apiClient.isVertexAI()||(!((i=t.video)===null||i===void 0)&&i.uri&&(!((o=t.video)===null||o===void 0)&&o.videoBytes)?t.video={uri:t.video.uri,mimeType:t.video.mimeType}:!((s=(r=t.source)===null||r===void 0?void 0:r.video)===null||s===void 0)&&s.uri&&(!((u=(a=t.source)===null||a===void 0?void 0:a.video)===null||u===void 0)&&u.videoBytes)&&(t.source.video={uri:t.source.video.uri,mimeType:t.source.video.mimeType})),await this.generateVideosInternal(t)}}maybeMoveToResponseJsonSchem(e){e.config&&e.config.responseSchema&&(e.config.responseJsonSchema||Object.keys(e.config.responseSchema).includes("$schema")&&(e.config.responseJsonSchema=e.config.responseSchema,delete e.config.responseSchema))}async processParamsMaybeAddMcpUsage(e){var t,i,o;const r=(t=e.config)===null||t===void 0?void 0:t.tools;if(!r)return e;const s=await Promise.all(r.map(async u=>Xi(u)?await u.tool():u)),a={model:e.model,contents:e.contents,config:Object.assign(Object.assign({},e.config),{tools:s})};if(a.config.tools=s,e.config&&e.config.tools&&rf(e.config.tools)){const u=(o=(i=e.config.httpOptions)===null||i===void 0?void 0:i.headers)!==null&&o!==void 0?o:{};let c=Object.assign({},u);Object.keys(c).length===0&&(c=this.apiClient.getDefaultHeaders()),sf(c),a.config.httpOptions=Object.assign(Object.assign({},e.config.httpOptions),{headers:c})}return a}async initAfcToolsMap(e){var t,i,o;const r=new Map;for(const s of(i=(t=e.config)===null||t===void 0?void 0:t.tools)!==null&&i!==void 0?i:[])if(Xi(s)){const a=s,u=await a.tool();for(const c of(o=u.functionDeclarations)!==null&&o!==void 0?o:[]){if(!c.name)throw new Error("Function declaration name is required.");if(r.has(c.name))throw new Error(`Duplicate tool declaration name: ${c.name}`);r.set(c.name,a)}}return r}async processAfcStream(e){var t,i,o;const r=(o=(i=(t=e.config)===null||t===void 0?void 0:t.automaticFunctionCalling)===null||i===void 0?void 0:i.maximumRemoteCalls)!==null&&o!==void 0?o:uu;let s=!1,a=0;const u=await this.initAfcToolsMap(e);return(function(c,f,h){return _n(this,arguments,function*(){for(var p,m,S,E,_,g;a<r;){s&&(a++,s=!1);const L=yield qe(c.processParamsMaybeAddMcpUsage(h)),I=yield qe(c.generateContentStreamInternal(L)),N=[],k=[];try{for(var w=!0,T=(m=void 0,vn(I)),M;M=yield qe(T.next()),p=M.done,!p;w=!0){E=M.value,w=!1;const A=E;if(yield yield qe(A),A.candidates&&(!((_=A.candidates[0])===null||_===void 0)&&_.content)){k.push(A.candidates[0].content);for(const x of(g=A.candidates[0].content.parts)!==null&&g!==void 0?g:[])if(a<r&&x.functionCall){if(!x.functionCall.name)throw new Error("Function call name was not returned by the model.");if(f.has(x.functionCall.name)){const O=yield qe(f.get(x.functionCall.name).callTool([x.functionCall]));N.push(...O)}else throw new Error(`Automatic function calling was requested, but not all the tools the model used implement the CallableTool interface. Available tools: ${f.keys()}, mising tool: ${x.functionCall.name}`)}}}}catch(A){m={error:A}}finally{try{!w&&!p&&(S=T.return)&&(yield qe(S.call(T)))}finally{if(m)throw m.error}}if(N.length>0){s=!0;const A=new vo;A.candidates=[{content:{role:"user",parts:N}}],yield yield qe(A);const x=[];x.push(...k),x.push({role:"user",parts:N});const O=Qt(h.contents).concat(x);h.contents=O}else break}})})(this,u,e)}async generateContentInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=su(this.apiClient,e);return a=Ee("{model}:generateContent",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=lu(f),p=new vo;return Object.assign(p,h),p})}else{const c=ru(this.apiClient,e);return a=Ee("{model}:generateContent",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=au(f),p=new vo;return Object.assign(p,h),p})}}async generateContentStreamInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=su(this.apiClient,e);return a=Ee("{model}:streamGenerateContent?alt=sse",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.requestStream({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}),s.then(function(h){return _n(this,arguments,function*(){var p,m,S,E;try{for(var _=!0,g=vn(h),w;w=yield qe(g.next()),p=w.done,!p;_=!0){E=w.value,_=!1;const T=E,M=lu(yield qe(T.json()),e);M.sdkHttpResponse={headers:T.headers};const L=new vo;Object.assign(L,M),yield yield qe(L)}}catch(T){m={error:T}}finally{try{!_&&!p&&(S=g.return)&&(yield qe(S.call(g)))}finally{if(m)throw m.error}}})})}else{const c=ru(this.apiClient,e);return a=Ee("{model}:streamGenerateContent?alt=sse",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.requestStream({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}),s.then(function(h){return _n(this,arguments,function*(){var p,m,S,E;try{for(var _=!0,g=vn(h),w;w=yield qe(g.next()),p=w.done,!p;_=!0){E=w.value,_=!1;const T=E,M=au(yield qe(T.json()),e);M.sdkHttpResponse={headers:T.headers};const L=new vo;Object.assign(L,M),yield yield qe(L)}}catch(T){m={error:T}}finally{try{!_&&!p&&(S=g.return)&&(yield qe(S.call(g)))}finally{if(m)throw m.error}}})})}}async embedContentInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Qg(this.apiClient,e,e),f=gp(e.model)?"{model}:embedContent":"{model}:predict";return a=Ee(f,c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(h=>h.json().then(p=>{const m=p;return m.sdkHttpResponse={headers:h.headers},m})),s.then(h=>{const p=e_(h,e),m=new Hc;return Object.assign(m,p),m})}else{const c=Zg(this.apiClient,e);return a=Ee("{model}:batchEmbedContents",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=jg(f),p=new Hc;return Object.assign(p,h),p})}}async generateImagesInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=d_(this.apiClient,e);return a=Ee("{model}:predict",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=h_(f),p=new zc;return Object.assign(p,h),p})}else{const c=u_(this.apiClient,e);return a=Ee("{model}:predict",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=f_(f),p=new zc;return Object.assign(p,h),p})}}async editImageInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=Xg(this.apiClient,e);return r=Ee("{model}:predict",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>{const c=Yg(u),f=new Xh;return Object.assign(f,c),f})}else throw new Error("This method is only supported by the Vertex AI.")}async upscaleImageInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=dv(this.apiClient,e);return r=Ee("{model}:predict",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>{const c=fv(u),f=new Yh;return Object.assign(f,c),f})}else throw new Error("This method is only supported by the Vertex AI.")}async recontextImage(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=$_(this.apiClient,e);return r=Ee("{model}:predict",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=X_(u),f=new Jh;return Object.assign(f,c),f})}else throw new Error("This method is only supported by the Vertex AI.")}async segmentImage(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=j_(this.apiClient,e);return r=Ee("{model}:predict",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=ev(u),f=new Kh;return Object.assign(f,c),f})}else throw new Error("This method is only supported by the Vertex AI.")}async get(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=b_(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>ua(f))}else{const c=I_(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>ca(f))}}async listInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=k_(this.apiClient,e);return a=Ee("{models_url}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=V_(f),p=new Wc;return Object.assign(p,h),p})}else{const c=O_(this.apiClient,e);return a=Ee("{models_url}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=G_(f),p=new Wc;return Object.assign(p,h),p})}}async update(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=cv(this.apiClient,e);return a=Ee("{model}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"PATCH",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>ua(f))}else{const c=lv(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"PATCH",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>ca(f))}}async delete(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=zg(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=qg(f),p=new qc;return Object.assign(p,h),p})}else{const c=Hg(this.apiClient,e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"DELETE",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Wg(f),p=new qc;return Object.assign(p,h),p})}}async countTokens(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=kg(this.apiClient,e);return a=Ee("{model}:countTokens",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Vg(f),p=new $c;return Object.assign(p,h),p})}else{const c=Og(this.apiClient,e);return a=Ee("{model}:countTokens",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Gg(f),p=new $c;return Object.assign(p,h),p})}}async computeTokens(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=Pg(this.apiClient,e);return r=Ee("{model}:computeTokens",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>{const c=Dg(u),f=new Zh;return Object.assign(f,c),f})}else throw new Error("This method is only supported by the Vertex AI.")}async generateVideosInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=y_(this.apiClient,e);return a=Ee("{model}:predictLongRunning",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s.then(f=>{const h=__(f),p=new Or;return Object.assign(p,h),p})}else{const c=v_(this.apiClient,e);return a=Ee("{model}:predictLongRunning",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s.then(f=>{const h=g_(f),p=new Or;return Object.assign(p,h),p})}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class a0 extends Wn{constructor(e){super(),this.apiClient=e}async getVideosOperation(e){const t=e.operation,i=e.config;if(t.name===void 0||t.name==="")throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const o=t.name.split("/operations/")[0];let r;i&&"httpOptions"in i&&(r=i.httpOptions);const s=await this.fetchPredictVideosOperationInternal({operationName:t.name,resourceName:o,config:{httpOptions:r}});return t._fromAPIResponse({apiResponse:s,_isVertexAI:!0})}else{const o=await this.getVideosOperationInternal({operationName:t.name,config:i});return t._fromAPIResponse({apiResponse:o,_isVertexAI:!1})}}async get(e){const t=e.operation,i=e.config;if(t.name===void 0||t.name==="")throw new Error("Operation name is required.");if(this.apiClient.isVertexAI()){const o=t.name.split("/operations/")[0];let r;i&&"httpOptions"in i&&(r=i.httpOptions);const s=await this.fetchPredictVideosOperationInternal({operationName:t.name,resourceName:o,config:{httpOptions:r}});return t._fromAPIResponse({apiResponse:s,_isVertexAI:!0})}else{const o=await this.getVideosOperationInternal({operationName:t.name,config:i});return t._fromAPIResponse({apiResponse:o,_isVertexAI:!1})}}async getVideosOperationInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=Vh(e);return a=Ee("{operationName}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json()),s}else{const c=Gh(e);return a=Ee("{operationName}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json()),s}}async fetchPredictVideosOperationInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=Nh(e);return r=Ee("{resourceName}:fetchPredictOperation",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o}else throw new Error("This method is only supported by the Vertex AI.")}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function l0(n){const e={},t=l(n,["apiKey"]);if(t!=null&&d(e,["apiKey"],t),l(n,["apiKeyConfig"])!==void 0)throw new Error("apiKeyConfig parameter is not supported in Gemini API.");if(l(n,["authType"])!==void 0)throw new Error("authType parameter is not supported in Gemini API.");if(l(n,["googleServiceAccountConfig"])!==void 0)throw new Error("googleServiceAccountConfig parameter is not supported in Gemini API.");if(l(n,["httpBasicAuthConfig"])!==void 0)throw new Error("httpBasicAuthConfig parameter is not supported in Gemini API.");if(l(n,["oauthConfig"])!==void 0)throw new Error("oauthConfig parameter is not supported in Gemini API.");if(l(n,["oidcConfig"])!==void 0)throw new Error("oidcConfig parameter is not supported in Gemini API.");return e}function c0(n){const e={},t=l(n,["data"]);if(t!=null&&d(e,["data"],t),l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function u0(n){const e={},t=l(n,["parts"]);if(t!=null){let o=t;Array.isArray(o)&&(o=o.map(r=>y0(r))),d(e,["parts"],o)}const i=l(n,["role"]);return i!=null&&d(e,["role"],i),e}function d0(n,e,t){const i={},o=l(e,["expireTime"]);t!==void 0&&o!=null&&d(t,["expireTime"],o);const r=l(e,["newSessionExpireTime"]);t!==void 0&&r!=null&&d(t,["newSessionExpireTime"],r);const s=l(e,["uses"]);t!==void 0&&s!=null&&d(t,["uses"],s);const a=l(e,["liveConnectConstraints"]);t!==void 0&&a!=null&&d(t,["bidiGenerateContentSetup"],v0(n,a));const u=l(e,["lockAdditionalFields"]);return t!==void 0&&u!=null&&d(t,["fieldMask"],u),i}function f0(n,e){const t={},i=l(e,["config"]);return i!=null&&d(t,["config"],d0(n,i,t)),t}function h0(n){const e={};if(l(n,["displayName"])!==void 0)throw new Error("displayName parameter is not supported in Gemini API.");const t=l(n,["fileUri"]);t!=null&&d(e,["fileUri"],t);const i=l(n,["mimeType"]);return i!=null&&d(e,["mimeType"],i),e}function p0(n){const e={},t=l(n,["id"]);t!=null&&d(e,["id"],t);const i=l(n,["args"]);i!=null&&d(e,["args"],i);const o=l(n,["name"]);if(o!=null&&d(e,["name"],o),l(n,["partialArgs"])!==void 0)throw new Error("partialArgs parameter is not supported in Gemini API.");if(l(n,["willContinue"])!==void 0)throw new Error("willContinue parameter is not supported in Gemini API.");return e}function m0(n){const e={},t=l(n,["authConfig"]);t!=null&&d(e,["authConfig"],l0(t));const i=l(n,["enableWidget"]);return i!=null&&d(e,["enableWidget"],i),e}function g0(n){const e={},t=l(n,["searchTypes"]);if(t!=null&&d(e,["searchTypes"],t),l(n,["blockingConfidence"])!==void 0)throw new Error("blockingConfidence parameter is not supported in Gemini API.");if(l(n,["excludeDomains"])!==void 0)throw new Error("excludeDomains parameter is not supported in Gemini API.");const i=l(n,["timeRangeFilter"]);return i!=null&&d(e,["timeRangeFilter"],i),e}function _0(n,e){const t={},i=l(n,["generationConfig"]);e!==void 0&&i!=null&&d(e,["setup","generationConfig"],i);const o=l(n,["responseModalities"]);e!==void 0&&o!=null&&d(e,["setup","generationConfig","responseModalities"],o);const r=l(n,["temperature"]);e!==void 0&&r!=null&&d(e,["setup","generationConfig","temperature"],r);const s=l(n,["topP"]);e!==void 0&&s!=null&&d(e,["setup","generationConfig","topP"],s);const a=l(n,["topK"]);e!==void 0&&a!=null&&d(e,["setup","generationConfig","topK"],a);const u=l(n,["maxOutputTokens"]);e!==void 0&&u!=null&&d(e,["setup","generationConfig","maxOutputTokens"],u);const c=l(n,["mediaResolution"]);e!==void 0&&c!=null&&d(e,["setup","generationConfig","mediaResolution"],c);const f=l(n,["seed"]);e!==void 0&&f!=null&&d(e,["setup","generationConfig","seed"],f);const h=l(n,["speechConfig"]);e!==void 0&&h!=null&&d(e,["setup","generationConfig","speechConfig"],pl(h));const p=l(n,["thinkingConfig"]);e!==void 0&&p!=null&&d(e,["setup","generationConfig","thinkingConfig"],p);const m=l(n,["enableAffectiveDialog"]);e!==void 0&&m!=null&&d(e,["setup","generationConfig","enableAffectiveDialog"],m);const S=l(n,["systemInstruction"]);e!==void 0&&S!=null&&d(e,["setup","systemInstruction"],u0(Dt(S)));const E=l(n,["tools"]);if(e!==void 0&&E!=null){let I=so(E);Array.isArray(I)&&(I=I.map(N=>E0(ro(N)))),d(e,["setup","tools"],I)}const _=l(n,["sessionResumption"]);e!==void 0&&_!=null&&d(e,["setup","sessionResumption"],S0(_));const g=l(n,["inputAudioTranscription"]);e!==void 0&&g!=null&&d(e,["setup","inputAudioTranscription"],g);const w=l(n,["outputAudioTranscription"]);e!==void 0&&w!=null&&d(e,["setup","outputAudioTranscription"],w);const T=l(n,["realtimeInputConfig"]);e!==void 0&&T!=null&&d(e,["setup","realtimeInputConfig"],T);const M=l(n,["contextWindowCompression"]);e!==void 0&&M!=null&&d(e,["setup","contextWindowCompression"],M);const L=l(n,["proactivity"]);if(e!==void 0&&L!=null&&d(e,["setup","proactivity"],L),l(n,["explicitVadSignal"])!==void 0)throw new Error("explicitVadSignal parameter is not supported in Gemini API.");return t}function v0(n,e){const t={},i=l(e,["model"]);i!=null&&d(t,["setup","model"],lt(n,i));const o=l(e,["config"]);return o!=null&&d(t,["config"],_0(o,t)),t}function y0(n){const e={},t=l(n,["mediaResolution"]);t!=null&&d(e,["mediaResolution"],t);const i=l(n,["codeExecutionResult"]);i!=null&&d(e,["codeExecutionResult"],i);const o=l(n,["executableCode"]);o!=null&&d(e,["executableCode"],o);const r=l(n,["fileData"]);r!=null&&d(e,["fileData"],h0(r));const s=l(n,["functionCall"]);s!=null&&d(e,["functionCall"],p0(s));const a=l(n,["functionResponse"]);a!=null&&d(e,["functionResponse"],a);const u=l(n,["inlineData"]);u!=null&&d(e,["inlineData"],c0(u));const c=l(n,["text"]);c!=null&&d(e,["text"],c);const f=l(n,["thought"]);f!=null&&d(e,["thought"],f);const h=l(n,["thoughtSignature"]);h!=null&&d(e,["thoughtSignature"],h);const p=l(n,["videoMetadata"]);return p!=null&&d(e,["videoMetadata"],p),e}function S0(n){const e={},t=l(n,["handle"]);if(t!=null&&d(e,["handle"],t),l(n,["transparent"])!==void 0)throw new Error("transparent parameter is not supported in Gemini API.");return e}function E0(n){const e={};if(l(n,["retrieval"])!==void 0)throw new Error("retrieval parameter is not supported in Gemini API.");const t=l(n,["computerUse"]);t!=null&&d(e,["computerUse"],t);const i=l(n,["fileSearch"]);i!=null&&d(e,["fileSearch"],i);const o=l(n,["googleSearch"]);o!=null&&d(e,["googleSearch"],g0(o));const r=l(n,["googleMaps"]);r!=null&&d(e,["googleMaps"],m0(r));const s=l(n,["codeExecution"]);if(s!=null&&d(e,["codeExecution"],s),l(n,["enterpriseWebSearch"])!==void 0)throw new Error("enterpriseWebSearch parameter is not supported in Gemini API.");const a=l(n,["functionDeclarations"]);if(a!=null){let h=a;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["functionDeclarations"],h)}const u=l(n,["googleSearchRetrieval"]);if(u!=null&&d(e,["googleSearchRetrieval"],u),l(n,["parallelAiSearch"])!==void 0)throw new Error("parallelAiSearch parameter is not supported in Gemini API.");const c=l(n,["urlContext"]);c!=null&&d(e,["urlContext"],c);const f=l(n,["mcpServers"]);if(f!=null){let h=f;Array.isArray(h)&&(h=h.map(p=>p)),d(e,["mcpServers"],h)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function T0(n){const e=[];for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)){const i=n[t];if(typeof i=="object"&&i!=null&&Object.keys(i).length>0){const o=Object.keys(i).map(r=>`${t}.${r}`);e.push(...o)}else e.push(t)}return e.join(",")}function x0(n,e){let t=null;const i=n.bidiGenerateContentSetup;if(typeof i=="object"&&i!==null&&"setup"in i){const r=i.setup;typeof r=="object"&&r!==null?(n.bidiGenerateContentSetup=r,t=r):delete n.bidiGenerateContentSetup}else i!==void 0&&delete n.bidiGenerateContentSetup;const o=n.fieldMask;if(t){const r=T0(t);if(Array.isArray(e==null?void 0:e.lockAdditionalFields)&&(e==null?void 0:e.lockAdditionalFields.length)===0)r?n.fieldMask=r:delete n.fieldMask;else if(e!=null&&e.lockAdditionalFields&&e.lockAdditionalFields.length>0&&o!==null&&Array.isArray(o)&&o.length>0){const s=["temperature","topK","topP","maxOutputTokens","responseModalities","seed","speechConfig"];let a=[];o.length>0&&(a=o.map(c=>s.includes(c)?`generationConfig.${c}`:c));const u=[];r&&u.push(r),a.length>0&&u.push(...a),u.length>0?n.fieldMask=u.join(","):delete n.fieldMask}else delete n.fieldMask}else o!==null&&Array.isArray(o)&&o.length>0?n.fieldMask=o.join(","):delete n.fieldMask;return n}class M0 extends Wn{constructor(e){super(),this.apiClient=e}async create(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("The client.tokens.create method is only supported by the Gemini Developer API.");{const a=f0(this.apiClient,e);r=Ee("auth_tokens",a._url),s=a._query,delete a.config,delete a._url,delete a._query;const u=x0(a,e.config);return o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(u),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(c=>c.json()),o.then(c=>c)}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function A0(n,e){const t={},i=l(n,["force"]);return e!==void 0&&i!=null&&d(e,["_query","force"],i),t}function C0(n){const e={},t=l(n,["name"]);t!=null&&d(e,["_url","name"],t);const i=l(n,["config"]);return i!=null&&A0(i,e),e}function w0(n){const e={},t=l(n,["name"]);return t!=null&&d(e,["_url","name"],t),e}function R0(n,e){const t={},i=l(n,["pageSize"]);e!==void 0&&i!=null&&d(e,["_query","pageSize"],i);const o=l(n,["pageToken"]);return e!==void 0&&o!=null&&d(e,["_query","pageToken"],o),t}function I0(n){const e={},t=l(n,["parent"]);t!=null&&d(e,["_url","parent"],t);const i=l(n,["config"]);return i!=null&&R0(i,e),e}function b0(n){const e={},t=l(n,["sdkHttpResponse"]);t!=null&&d(e,["sdkHttpResponse"],t);const i=l(n,["nextPageToken"]);i!=null&&d(e,["nextPageToken"],i);const o=l(n,["documents"]);if(o!=null){let r=o;Array.isArray(r)&&(r=r.map(s=>s)),d(e,["documents"],r)}return e}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class P0 extends Wn{constructor(e){super(),this.apiClient=e,this.list=async t=>new Mi(zn.PAGED_ITEM_DOCUMENTS,i=>this.listInternal({parent:t.parent,config:i.config}),await this.listInternal(t),t)}async get(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=w0(e);return r=Ee("{name}",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>u)}}async delete(e){var t,i;let o="",r={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const s=C0(e);o=Ee("{name}",s._url),r=s._query,delete s._url,delete s._query,await this.apiClient.request({path:o,queryParams:r,body:JSON.stringify(s),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal})}}async listInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=I0(e);return r=Ee("{parent}/documents",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=b0(u),f=new Qh;return Object.assign(f,c),f})}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class D0 extends Wn{constructor(e,t=new P0(e)){super(),this.apiClient=e,this.documents=t,this.list=async(i={})=>new Mi(zn.PAGED_ITEM_FILE_SEARCH_STORES,o=>this.listInternal(o),await this.listInternal(i),i)}async uploadToFileSearchStore(e){if(this.apiClient.isVertexAI())throw new Error("Vertex AI does not support uploading files to a file search store.");return this.apiClient.uploadFileToFileSearchStore(e.fileSearchStoreName,e.file,e.config)}async create(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=yv(e);return r=Ee("fileSearchStores",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>u)}}async get(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Tv(e);return r=Ee("{name}",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>u)}}async delete(e){var t,i;let o="",r={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const s=Ev(e);o=Ee("{name}",s._url),r=s._query,delete s._url,delete s._query,await this.apiClient.request({path:o,queryParams:r,body:JSON.stringify(s),httpMethod:"DELETE",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal})}}async listInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Rv(e);return r=Ee("fileSearchStores",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=Iv(u),f=new jh;return Object.assign(f,c),f})}}async uploadToFileSearchStoreInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=bv(e);return r=Ee("upload/v1beta/{file_search_store_name}:uploadToFileSearchStore",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=Pv(u),f=new ep;return Object.assign(f,c),f})}}async importFile(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=Av(e);return r=Ee("{file_search_store_name}:importFile",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json()),o.then(u=>{const c=Mv(u),f=new cl;return Object.assign(f,c),f})}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let af=function(){const{crypto:n}=globalThis;if(n!=null&&n.randomUUID)return af=n.randomUUID.bind(n),n.randomUUID();const e=new Uint8Array(1),t=n?()=>n.getRandomValues(e)[0]:()=>Math.random()*255&255;return"10000000-1000-4000-8000-100000000000".replace(/[018]/g,i=>(+i^t()&15>>+i/4).toString(16))};const N0=()=>af();/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function fa(n){return typeof n=="object"&&n!==null&&("name"in n&&n.name==="AbortError"||"message"in n&&String(n.message).includes("FetchRequestCanceledException"))}const ha=n=>{if(n instanceof Error)return n;if(typeof n=="object"&&n!==null){try{if(Object.prototype.toString.call(n)==="[object Error]"){const e=new Error(n.message,n.cause?{cause:n.cause}:{});return n.stack&&(e.stack=n.stack),n.cause&&!e.cause&&(e.cause=n.cause),n.name&&(e.name=n.name),e}}catch{}try{return new Error(JSON.stringify(n))}catch{}}return new Error(n)};/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class cn extends Error{}class qt extends cn{constructor(e,t,i,o){super(`${qt.makeMessage(e,t,i)}`),this.status=e,this.headers=o,this.error=t}static makeMessage(e,t,i){const o=t!=null&&t.message?typeof t.message=="string"?t.message:JSON.stringify(t.message):t?JSON.stringify(t):i;return e&&o?`${e} ${o}`:e?`${e} status code (no body)`:o||"(no status code or body)"}static generate(e,t,i,o){if(!e||!o)return new ts({message:i,cause:ha(t)});const r=t;return e===400?new cf(e,r,i,o):e===401?new uf(e,r,i,o):e===403?new df(e,r,i,o):e===404?new ff(e,r,i,o):e===409?new hf(e,r,i,o):e===422?new pf(e,r,i,o):e===429?new mf(e,r,i,o):e>=500?new gf(e,r,i,o):new qt(e,r,i,o)}}class pa extends qt{constructor({message:e}={}){super(void 0,void 0,e||"Request was aborted.",void 0)}}class ts extends qt{constructor({message:e,cause:t}){super(void 0,void 0,e||"Connection error.",void 0),t&&(this.cause=t)}}class lf extends ts{constructor({message:e}={}){super({message:e??"Request timed out."})}}class cf extends qt{}class uf extends qt{}class df extends qt{}class ff extends qt{}class hf extends qt{}class pf extends qt{}class mf extends qt{}class gf extends qt{}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const U0=/^[a-z][a-z0-9+.-]*:/i,L0=n=>U0.test(n);let ma=n=>(ma=Array.isArray,ma(n));const F0=ma;let B0=F0;const pu=B0;function O0(n){if(!n)return!0;for(const e in n)return!1;return!0}function k0(n,e){return Object.prototype.hasOwnProperty.call(n,e)}const G0=(n,e)=>{if(typeof e!="number"||!Number.isInteger(e))throw new cn(`${n} must be an integer`);if(e<0)throw new cn(`${n} must be a positive integer`);return e},V0=n=>{try{return JSON.parse(n)}catch{return}};/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const H0=n=>new Promise(e=>setTimeout(e,n));/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function z0(){if(typeof fetch<"u")return fetch;throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new GeminiNextGenAPIClient({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")}function _f(...n){const e=globalThis.ReadableStream;if(typeof e>"u")throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");return new e(...n)}function W0(n){let e=Symbol.asyncIterator in n?n[Symbol.asyncIterator]():n[Symbol.iterator]();return _f({start(){},async pull(t){const{done:i,value:o}=await e.next();i?t.close():t.enqueue(o)},async cancel(){var t;await((t=e.return)===null||t===void 0?void 0:t.call(e))}})}function vf(n){if(n[Symbol.asyncIterator])return n;const e=n.getReader();return{async next(){try{const t=await e.read();return t!=null&&t.done&&e.releaseLock(),t}catch(t){throw e.releaseLock(),t}},async return(){const t=e.cancel();return e.releaseLock(),await t,{done:!0,value:void 0}},[Symbol.asyncIterator](){return this}}}async function q0(n){var e,t;if(n===null||typeof n!="object")return;if(n[Symbol.asyncIterator]){await((t=(e=n[Symbol.asyncIterator]()).return)===null||t===void 0?void 0:t.call(e));return}const i=n.getReader(),o=i.cancel();i.releaseLock(),await o}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $0=({headers:n,body:e})=>({bodyHeaders:{"content-type":"application/json"},body:JSON.stringify(e)});/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const X0="0.0.1";/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const yf=()=>{var n;if(typeof File>"u"){const{process:e}=globalThis,t=typeof((n=e==null?void 0:e.versions)===null||n===void 0?void 0:n.node)=="string"&&parseInt(e.versions.node.split("."))<20;throw new Error("`File` is not defined as a global, which is required for file uploads."+(t?" Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`.":""))}};function gs(n,e,t){return yf(),new File(n,e??"unknown_file",t)}function Y0(n){return(typeof n=="object"&&n!==null&&("name"in n&&n.name&&String(n.name)||"url"in n&&n.url&&String(n.url)||"filename"in n&&n.filename&&String(n.filename)||"path"in n&&n.path&&String(n.path))||"").split(/[\\/]/).pop()||void 0}const J0=n=>n!=null&&typeof n=="object"&&typeof n[Symbol.asyncIterator]=="function";/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Sf=n=>n!=null&&typeof n=="object"&&typeof n.size=="number"&&typeof n.type=="string"&&typeof n.text=="function"&&typeof n.slice=="function"&&typeof n.arrayBuffer=="function",K0=n=>n!=null&&typeof n=="object"&&typeof n.name=="string"&&typeof n.lastModified=="number"&&Sf(n),Z0=n=>n!=null&&typeof n=="object"&&typeof n.url=="string"&&typeof n.blob=="function";async function Q0(n,e,t){if(yf(),n=await n,K0(n))return n instanceof File?n:gs([await n.arrayBuffer()],n.name);if(Z0(n)){const o=await n.blob();return e||(e=new URL(n.url).pathname.split(/[\\/]/).pop()),gs(await ga(o),e,t)}const i=await ga(n);if(e||(e=Y0(n)),!(t!=null&&t.type)){const o=i.find(r=>typeof r=="object"&&"type"in r&&r.type);typeof o=="string"&&(t=Object.assign(Object.assign({},t),{type:o}))}return gs(i,e,t)}async function ga(n){var e,t,i,o,r;let s=[];if(typeof n=="string"||ArrayBuffer.isView(n)||n instanceof ArrayBuffer)s.push(n);else if(Sf(n))s.push(n instanceof Blob?n:await n.arrayBuffer());else if(J0(n))try{for(var a=!0,u=vn(n),c;c=await u.next(),e=c.done,!e;a=!0){o=c.value,a=!1;const f=o;s.push(...await ga(f))}}catch(f){t={error:f}}finally{try{!a&&!e&&(i=u.return)&&await i.call(u)}finally{if(t)throw t.error}}else{const f=(r=n==null?void 0:n.constructor)===null||r===void 0?void 0:r.name;throw new Error(`Unexpected data type: ${typeof n}${f?`; constructor: ${f}`:""}${j0(n)}`)}return s}function j0(n){return typeof n!="object"||n===null?"":`; props: [${Object.getOwnPropertyNames(n).map(t=>`"${t}"`).join(", ")}]`}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ef{constructor(e){this._client=e}}Ef._key=[];/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Tf(n){return n.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g,encodeURIComponent)}const mu=Object.freeze(Object.create(null)),ey=(n=Tf)=>(function(t,...i){if(t.length===1)return t[0];let o=!1;const r=[],s=t.reduce((f,h,p)=>{var m,S,E;/[?#]/.test(h)&&(o=!0);const _=i[p];let g=(o?encodeURIComponent:n)(""+_);return p!==i.length&&(_==null||typeof _=="object"&&_.toString===((E=Object.getPrototypeOf((S=Object.getPrototypeOf((m=_.hasOwnProperty)!==null&&m!==void 0?m:mu))!==null&&S!==void 0?S:mu))===null||E===void 0?void 0:E.toString))&&(g=_+"",r.push({start:f.length+h.length,length:g.length,error:`Value of type ${Object.prototype.toString.call(_).slice(8,-1)} is not a valid path parameter`})),f+h+(p===i.length?"":g)},""),a=s.split(/[?#]/,1)[0],u=/(^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;let c;for(;(c=u.exec(a))!==null;){const f=c[0].startsWith("/"),h=f?1:0,p=f?c[0].slice(1):c[0];r.push({start:c.index+h,length:p.length,error:`Value "${p}" can't be safely passed as a path parameter`})}if(r.sort((f,h)=>f.start-h.start),r.length>0){let f=0;const h=r.reduce((p,m)=>{const S=" ".repeat(m.start-f),E="^".repeat(m.length);return f=m.start+m.length,p+S+E},"");throw new cn(`Path parameters result in path with invalid segments:
${r.map(p=>p.error).join(`
`)}
${s}
${h}`)}return s}),Zo=ey(Tf);/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class xf extends Ef{create(e,t){var i;const{api_version:o=this._client.apiVersion}=e,r=Gr(e,["api_version"]);if("model"in r&&"agent_config"in r)throw new cn("Invalid request: specified `model` and `agent_config`. If specifying `model`, use `generation_config`.");if("agent"in r&&"generation_config"in r)throw new cn("Invalid request: specified `agent` and `generation_config`. If specifying `agent`, use `agent_config`.");return this._client.post(Zo`/${o}/interactions`,Object.assign(Object.assign({body:r},t),{stream:(i=e.stream)!==null&&i!==void 0?i:!1}))}delete(e,t={},i){const{api_version:o=this._client.apiVersion}=t??{};return this._client.delete(Zo`/${o}/interactions/${e}`,i)}cancel(e,t={},i){const{api_version:o=this._client.apiVersion}=t??{};return this._client.post(Zo`/${o}/interactions/${e}/cancel`,i)}get(e,t={},i){var o;const r=t??{},{api_version:s=this._client.apiVersion}=r,a=Gr(r,["api_version"]);return this._client.get(Zo`/${s}/interactions/${e}`,Object.assign(Object.assign({query:a},i),{stream:(o=t==null?void 0:t.stream)!==null&&o!==void 0?o:!1}))}}xf._key=Object.freeze(["interactions"]);class Mf extends xf{}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ty(n){let e=0;for(const o of n)e+=o.length;const t=new Uint8Array(e);let i=0;for(const o of n)t.set(o,i),i+=o.length;return t}let Qo;function gl(n){let e;return(Qo??(e=new globalThis.TextEncoder,Qo=e.encode.bind(e)))(n)}let jo;function gu(n){let e;return(jo??(e=new globalThis.TextDecoder,jo=e.decode.bind(e)))(n)}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ns{constructor(){this.buffer=new Uint8Array,this.carriageReturnIndex=null,this.searchIndex=0}decode(e){var t;if(e==null)return[];const i=e instanceof ArrayBuffer?new Uint8Array(e):typeof e=="string"?gl(e):e;this.buffer=ty([this.buffer,i]);const o=[];let r;for(;(r=ny(this.buffer,(t=this.carriageReturnIndex)!==null&&t!==void 0?t:this.searchIndex))!=null;){if(r.carriage&&this.carriageReturnIndex==null){this.carriageReturnIndex=r.index;continue}if(this.carriageReturnIndex!=null&&(r.index!==this.carriageReturnIndex+1||r.carriage)){o.push(gu(this.buffer.subarray(0,this.carriageReturnIndex-1))),this.buffer=this.buffer.subarray(this.carriageReturnIndex),this.carriageReturnIndex=null,this.searchIndex=0;continue}const s=this.carriageReturnIndex!==null?r.preceding-1:r.preceding,a=gu(this.buffer.subarray(0,s));o.push(a),this.buffer=this.buffer.subarray(r.index),this.carriageReturnIndex=null,this.searchIndex=0}return this.searchIndex=Math.max(0,this.buffer.length-1),o}flush(){return this.buffer.length?this.decode(`
`):[]}}ns.NEWLINE_CHARS=new Set([`
`,"\r"]);ns.NEWLINE_REGEXP=/\r\n|[\n\r]/g;function ny(n,e){const o=e??0,r=n.indexOf(10,o),s=n.indexOf(13,o);if(r===-1&&s===-1)return null;let a;return r!==-1&&s!==-1?a=Math.min(r,s):a=r!==-1?r:s,n[a]===10?{preceding:a,index:a+1,carriage:!1}:{preceding:a,index:a+1,carriage:!0}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Vr={off:0,error:200,warn:300,info:400,debug:500},_u=(n,e,t)=>{if(n){if(k0(Vr,n))return n;kt(t).warn(`${e} was set to ${JSON.stringify(n)}, expected one of ${JSON.stringify(Object.keys(Vr))}`)}};function wo(){}function er(n,e,t){return!e||Vr[n]>Vr[t]?wo:e[n].bind(e)}const iy={error:wo,warn:wo,info:wo,debug:wo};let vu=new WeakMap;function kt(n){var e;const t=n.logger,i=(e=n.logLevel)!==null&&e!==void 0?e:"off";if(!t)return iy;const o=vu.get(t);if(o&&o[0]===i)return o[1];const r={error:er("error",t,i),warn:er("warn",t,i),info:er("info",t,i),debug:er("debug",t,i)};return vu.set(t,[i,r]),r}const mi=n=>(n.options&&(n.options=Object.assign({},n.options),delete n.options.headers),n.headers&&(n.headers=Object.fromEntries((n.headers instanceof Headers?[...n.headers]:Object.entries(n.headers)).map(([e,t])=>[e,e.toLowerCase()==="x-goog-api-key"||e.toLowerCase()==="authorization"||e.toLowerCase()==="cookie"||e.toLowerCase()==="set-cookie"?"***":t]))),"retryOfRequestLogID"in n&&(n.retryOfRequestLogID&&(n.retryOf=n.retryOfRequestLogID),delete n.retryOfRequestLogID),n);/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class zi{constructor(e,t,i){this.iterator=e,this.controller=t,this.client=i}static fromSSEResponse(e,t,i){let o=!1;const r=i?kt(i):console;function s(){return _n(this,arguments,function*(){var u,c,f,h;if(o)throw new cn("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");o=!0;let p=!1;try{try{for(var m=!0,S=vn(oy(e,t)),E;E=yield qe(S.next()),u=E.done,!u;m=!0){h=E.value,m=!1;const _=h;if(!p)if(_.data.startsWith("[DONE]")){p=!0;continue}else try{yield yield qe(JSON.parse(_.data))}catch(g){throw r.error("Could not parse message into JSON:",_.data),r.error("From chunk:",_.raw),g}}}catch(_){c={error:_}}finally{try{!m&&!u&&(f=S.return)&&(yield qe(f.call(S)))}finally{if(c)throw c.error}}p=!0}catch(_){if(fa(_))return yield qe(void 0);throw _}finally{p||t.abort()}})}return new zi(s,t,i)}static fromReadableStream(e,t,i){let o=!1;function r(){return _n(this,arguments,function*(){var u,c,f,h;const p=new ns,m=vf(e);try{for(var S=!0,E=vn(m),_;_=yield qe(E.next()),u=_.done,!u;S=!0){h=_.value,S=!1;const g=h;for(const w of p.decode(g))yield yield qe(w)}}catch(g){c={error:g}}finally{try{!S&&!u&&(f=E.return)&&(yield qe(f.call(E)))}finally{if(c)throw c.error}}for(const g of p.flush())yield yield qe(g)})}function s(){return _n(this,arguments,function*(){var u,c,f,h;if(o)throw new cn("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");o=!0;let p=!1;try{try{for(var m=!0,S=vn(r()),E;E=yield qe(S.next()),u=E.done,!u;m=!0){h=E.value,m=!1;const _=h;p||_&&(yield yield qe(JSON.parse(_)))}}catch(_){c={error:_}}finally{try{!m&&!u&&(f=S.return)&&(yield qe(f.call(S)))}finally{if(c)throw c.error}}p=!0}catch(_){if(fa(_))return yield qe(void 0);throw _}finally{p||t.abort()}})}return new zi(s,t,i)}[Symbol.asyncIterator](){return this.iterator()}tee(){const e=[],t=[],i=this.iterator(),o=r=>({next:()=>{if(r.length===0){const s=i.next();e.push(s),t.push(s)}return r.shift()}});return[new zi(()=>o(e),this.controller,this.client),new zi(()=>o(t),this.controller,this.client)]}toReadableStream(){const e=this;let t;return _f({async start(){t=e[Symbol.asyncIterator]()},async pull(i){try{const{value:o,done:r}=await t.next();if(r)return i.close();const s=gl(JSON.stringify(o)+`
`);i.enqueue(s)}catch(o){i.error(o)}},async cancel(){var i;await((i=t.return)===null||i===void 0?void 0:i.call(t))}})}}function oy(n,e){return _n(this,arguments,function*(){var i,o,r,s;if(!n.body)throw e.abort(),typeof globalThis.navigator<"u"&&globalThis.navigator.product==="ReactNative"?new cn("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api"):new cn("Attempted to iterate over a response with no body");const a=new sy,u=new ns,c=vf(n.body);try{for(var f=!0,h=vn(ry(c)),p;p=yield qe(h.next()),i=p.done,!i;f=!0){s=p.value,f=!1;const m=s;for(const S of u.decode(m)){const E=a.decode(S);E&&(yield yield qe(E))}}}catch(m){o={error:m}}finally{try{!f&&!i&&(r=h.return)&&(yield qe(r.call(h)))}finally{if(o)throw o.error}}for(const m of u.flush()){const S=a.decode(m);S&&(yield yield qe(S))}})}function ry(n){return _n(this,arguments,function*(){var t,i,o,r;try{for(var s=!0,a=vn(n),u;u=yield qe(a.next()),t=u.done,!t;s=!0){r=u.value,s=!1;const c=r;if(c==null)continue;const f=c instanceof ArrayBuffer?new Uint8Array(c):typeof c=="string"?gl(c):c;yield yield qe(f)}}catch(c){i={error:c}}finally{try{!s&&!t&&(o=a.return)&&(yield qe(o.call(a)))}finally{if(i)throw i.error}}})}class sy{constructor(){this.event=null,this.data=[],this.chunks=[]}decode(e){if(e.endsWith("\r")&&(e=e.substring(0,e.length-1)),!e){if(!this.event&&!this.data.length)return null;const r={event:this.event,data:this.data.join(`
`),raw:this.chunks};return this.event=null,this.data=[],this.chunks=[],r}if(this.chunks.push(e),e.startsWith(":"))return null;let[t,i,o]=ay(e,":");return o.startsWith(" ")&&(o=o.substring(1)),t==="event"?this.event=o:t==="data"&&this.data.push(o),null}}function ay(n,e){const t=n.indexOf(e);return t!==-1?[n.substring(0,t),e,n.substring(t+e.length)]:[n,"",""]}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */async function ly(n,e){const{response:t,requestLogID:i,retryOfRequestLogID:o,startTime:r}=e,s=await(async()=>{var a;if(e.options.stream)return kt(n).debug("response",t.status,t.url,t.headers,t.body),e.options.__streamClass?e.options.__streamClass.fromSSEResponse(t,e.controller,n):zi.fromSSEResponse(t,e.controller,n);if(t.status===204)return null;if(e.options.__binaryResponse)return t;const u=t.headers.get("content-type"),c=(a=u==null?void 0:u.split(";")[0])===null||a===void 0?void 0:a.trim();return(c==null?void 0:c.includes("application/json"))||(c==null?void 0:c.endsWith("+json"))?t.headers.get("content-length")==="0"?void 0:await t.json():await t.text()})();return kt(n).debug(`[${i}] response parsed`,mi({retryOfRequestLogID:o,url:t.url,status:t.status,body:s,durationMs:Date.now()-r})),s}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class _l extends Promise{constructor(e,t,i=ly){super(o=>{o(null)}),this.responsePromise=t,this.parseResponse=i,this.client=e}_thenUnwrap(e){return new _l(this.client,this.responsePromise,async(t,i)=>e(await this.parseResponse(t,i),i))}asResponse(){return this.responsePromise.then(e=>e.response)}async withResponse(){const[e,t]=await Promise.all([this.parse(),this.asResponse()]);return{data:e,response:t}}parse(){return this.parsedPromise||(this.parsedPromise=this.responsePromise.then(e=>this.parseResponse(this.client,e))),this.parsedPromise}then(e,t){return this.parse().then(e,t)}catch(e){return this.parse().catch(e)}finally(e){return this.parse().finally(e)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Af=Symbol("brand.privateNullableHeaders");function*cy(n){if(!n)return;if(Af in n){const{values:i,nulls:o}=n;yield*i.entries();for(const r of o)yield[r,null];return}let e=!1,t;n instanceof Headers?t=n.entries():pu(n)?t=n:(e=!0,t=Object.entries(n??{}));for(let i of t){const o=i[0];if(typeof o!="string")throw new TypeError("expected header name to be a string");const r=pu(i[1])?i[1]:[i[1]];let s=!1;for(const a of r)a!==void 0&&(e&&!s&&(s=!0,yield[o,null]),yield[o,a])}}const yo=n=>{const e=new Headers,t=new Set;for(const i of n){const o=new Set;for(const[r,s]of cy(i)){const a=r.toLowerCase();o.has(a)||(e.delete(r),o.add(a)),s===null?(e.delete(r),t.add(a)):(e.append(r,s),t.delete(a))}}return{[Af]:!0,values:e,nulls:t}};/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const _s=n=>{var e,t,i,o,r,s;if(typeof globalThis.process<"u")return(i=(t=(e=wh)===null||e===void 0?void 0:e[n])===null||t===void 0?void 0:t.trim())!==null&&i!==void 0?i:void 0;if(typeof globalThis.Deno<"u")return(s=(r=(o=globalThis.Deno.env)===null||o===void 0?void 0:o.get)===null||r===void 0?void 0:r.call(o,n))===null||s===void 0?void 0:s.trim()};/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var Cf;class is{constructor(e){var t,i,o,r,s,a,u,{baseURL:c=_s("GEMINI_NEXT_GEN_API_BASE_URL"),apiKey:f=(t=_s("GEMINI_API_KEY"))!==null&&t!==void 0?t:null,apiVersion:h="v1beta"}=e,p=Gr(e,["baseURL","apiKey","apiVersion"]);const m=Object.assign(Object.assign({apiKey:f,apiVersion:h},p),{baseURL:c||"https://generativelanguage.googleapis.com"});this.baseURL=m.baseURL,this.timeout=(i=m.timeout)!==null&&i!==void 0?i:is.DEFAULT_TIMEOUT,this.logger=(o=m.logger)!==null&&o!==void 0?o:console;const S="warn";this.logLevel=S,this.logLevel=(s=(r=_u(m.logLevel,"ClientOptions.logLevel",this))!==null&&r!==void 0?r:_u(_s("GEMINI_NEXT_GEN_API_LOG"),"process.env['GEMINI_NEXT_GEN_API_LOG']",this))!==null&&s!==void 0?s:S,this.fetchOptions=m.fetchOptions,this.maxRetries=(a=m.maxRetries)!==null&&a!==void 0?a:2,this.fetch=(u=m.fetch)!==null&&u!==void 0?u:z0(),this.encoder=$0,this._options=m,this.apiKey=f,this.apiVersion=h,this.clientAdapter=m.clientAdapter}withOptions(e){return new this.constructor(Object.assign(Object.assign(Object.assign({},this._options),{baseURL:this.baseURL,maxRetries:this.maxRetries,timeout:this.timeout,logger:this.logger,logLevel:this.logLevel,fetch:this.fetch,fetchOptions:this.fetchOptions,apiKey:this.apiKey,apiVersion:this.apiVersion}),e))}baseURLOverridden(){return this.baseURL!=="https://generativelanguage.googleapis.com"}defaultQuery(){return this._options.defaultQuery}validateHeaders({values:e,nulls:t}){if(!(e.has("authorization")||e.has("x-goog-api-key"))&&!(this.apiKey&&e.get("x-goog-api-key"))&&!t.has("x-goog-api-key"))throw new Error('Could not resolve authentication method. Expected the apiKey to be set. Or for the "x-goog-api-key" headers to be explicitly omitted')}async authHeaders(e){const t=yo([e.headers]);if(!(t.values.has("authorization")||t.values.has("x-goog-api-key"))){if(this.apiKey)return yo([{"x-goog-api-key":this.apiKey}]);if(this.clientAdapter.isVertexAI())return yo([await this.clientAdapter.getAuthHeaders()])}}stringifyQuery(e){return Object.entries(e).filter(([t,i])=>typeof i<"u").map(([t,i])=>{if(typeof i=="string"||typeof i=="number"||typeof i=="boolean")return`${encodeURIComponent(t)}=${encodeURIComponent(i)}`;if(i===null)return`${encodeURIComponent(t)}=`;throw new cn(`Cannot stringify type ${typeof i}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)}).join("&")}getUserAgent(){return`${this.constructor.name}/JS ${X0}`}defaultIdempotencyKey(){return`stainless-node-retry-${N0()}`}makeStatusError(e,t,i,o){return qt.generate(e,t,i,o)}buildURL(e,t,i){const o=!this.baseURLOverridden()&&i||this.baseURL,r=L0(e)?new URL(e):new URL(o+(o.endsWith("/")&&e.startsWith("/")?e.slice(1):e)),s=this.defaultQuery();return O0(s)||(t=Object.assign(Object.assign({},s),t)),typeof t=="object"&&t&&!Array.isArray(t)&&(r.search=this.stringifyQuery(t)),r.toString()}async prepareOptions(e){if(this.clientAdapter&&this.clientAdapter.isVertexAI()&&!e.path.startsWith(`/${this.apiVersion}/projects/`)){const t=e.path.slice(this.apiVersion.length+1);e.path=`/${this.apiVersion}/projects/${this.clientAdapter.getProject()}/locations/${this.clientAdapter.getLocation()}${t}`}}async prepareRequest(e,{url:t,options:i}){}get(e,t){return this.methodRequest("get",e,t)}post(e,t){return this.methodRequest("post",e,t)}patch(e,t){return this.methodRequest("patch",e,t)}put(e,t){return this.methodRequest("put",e,t)}delete(e,t){return this.methodRequest("delete",e,t)}methodRequest(e,t,i){return this.request(Promise.resolve(i).then(o=>Object.assign({method:e,path:t},o)))}request(e,t=null){return new _l(this,this.makeRequest(e,t,void 0))}async makeRequest(e,t,i){var o,r,s;const a=await e,u=(o=a.maxRetries)!==null&&o!==void 0?o:this.maxRetries;t==null&&(t=u),await this.prepareOptions(a);const{req:c,url:f,timeout:h}=await this.buildRequest(a,{retryCount:u-t});await this.prepareRequest(c,{url:f,options:a});const p="log_"+(Math.random()*(1<<24)|0).toString(16).padStart(6,"0"),m=i===void 0?"":`, retryOf: ${i}`,S=Date.now();if(kt(this).debug(`[${p}] sending request`,mi({retryOfRequestLogID:i,method:a.method,url:f,options:a,headers:c.headers})),!((r=a.signal)===null||r===void 0)&&r.aborted)throw new pa;const E=new AbortController,_=await this.fetchWithTimeout(f,c,h,E).catch(ha),g=Date.now();if(_ instanceof globalThis.Error){const T=`retrying, ${t} attempts remaining`;if(!((s=a.signal)===null||s===void 0)&&s.aborted)throw new pa;const M=fa(_)||/timed? ?out/i.test(String(_)+("cause"in _?String(_.cause):""));if(t)return kt(this).info(`[${p}] connection ${M?"timed out":"failed"} - ${T}`),kt(this).debug(`[${p}] connection ${M?"timed out":"failed"} (${T})`,mi({retryOfRequestLogID:i,url:f,durationMs:g-S,message:_.message})),this.retryRequest(a,t,i??p);throw kt(this).info(`[${p}] connection ${M?"timed out":"failed"} - error; no more retries left`),kt(this).debug(`[${p}] connection ${M?"timed out":"failed"} (error; no more retries left)`,mi({retryOfRequestLogID:i,url:f,durationMs:g-S,message:_.message})),M?new lf:new ts({cause:_})}const w=`[${p}${m}] ${c.method} ${f} ${_.ok?"succeeded":"failed"} with status ${_.status} in ${g-S}ms`;if(!_.ok){const T=await this.shouldRetry(_);if(t&&T){const A=`retrying, ${t} attempts remaining`;return await q0(_.body),kt(this).info(`${w} - ${A}`),kt(this).debug(`[${p}] response error (${A})`,mi({retryOfRequestLogID:i,url:_.url,status:_.status,headers:_.headers,durationMs:g-S})),this.retryRequest(a,t,i??p,_.headers)}const M=T?"error; no more retries left":"error; not retryable";kt(this).info(`${w} - ${M}`);const L=await _.text().catch(A=>ha(A).message),I=V0(L),N=I?void 0:L;throw kt(this).debug(`[${p}] response error (${M})`,mi({retryOfRequestLogID:i,url:_.url,status:_.status,headers:_.headers,message:N,durationMs:Date.now()-S})),this.makeStatusError(_.status,I,N,_.headers)}return kt(this).info(w),kt(this).debug(`[${p}] response start`,mi({retryOfRequestLogID:i,url:_.url,status:_.status,headers:_.headers,durationMs:g-S})),{response:_,options:a,controller:E,requestLogID:p,retryOfRequestLogID:i,startTime:S}}async fetchWithTimeout(e,t,i,o){const r=t||{},{signal:s,method:a}=r,u=Gr(r,["signal","method"]),c=this._makeAbort(o);s&&s.addEventListener("abort",c,{once:!0});const f=setTimeout(c,i),h=globalThis.ReadableStream&&u.body instanceof globalThis.ReadableStream||typeof u.body=="object"&&u.body!==null&&Symbol.asyncIterator in u.body,p=Object.assign(Object.assign(Object.assign({signal:o.signal},h?{duplex:"half"}:{}),{method:"GET"}),u);a&&(p.method=a.toUpperCase());try{return await this.fetch.call(void 0,e,p)}finally{clearTimeout(f)}}async shouldRetry(e){const t=e.headers.get("x-should-retry");return t==="true"?!0:t==="false"?!1:e.status===408||e.status===409||e.status===429||e.status>=500}async retryRequest(e,t,i,o){var r;let s;const a=o==null?void 0:o.get("retry-after-ms");if(a){const c=parseFloat(a);Number.isNaN(c)||(s=c)}const u=o==null?void 0:o.get("retry-after");if(u&&!s){const c=parseFloat(u);Number.isNaN(c)?s=Date.parse(u)-Date.now():s=c*1e3}if(!(s&&0<=s&&s<60*1e3)){const c=(r=e.maxRetries)!==null&&r!==void 0?r:this.maxRetries;s=this.calculateDefaultRetryTimeoutMillis(t,c)}return await H0(s),this.makeRequest(e,t-1,i)}calculateDefaultRetryTimeoutMillis(e,t){const r=t-e,s=Math.min(.5*Math.pow(2,r),8),a=1-Math.random()*.25;return s*a*1e3}async buildRequest(e,{retryCount:t=0}={}){var i,o,r;const s=Object.assign({},e),{method:a,path:u,query:c,defaultBaseURL:f}=s,h=this.buildURL(u,c,f);"timeout"in s&&G0("timeout",s.timeout),s.timeout=(i=s.timeout)!==null&&i!==void 0?i:this.timeout;const{bodyHeaders:p,body:m}=this.buildBody({options:s}),S=await this.buildHeaders({options:e,method:a,bodyHeaders:p,retryCount:t});return{req:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({method:a,headers:S},s.signal&&{signal:s.signal}),globalThis.ReadableStream&&m instanceof globalThis.ReadableStream&&{duplex:"half"}),m&&{body:m}),(o=this.fetchOptions)!==null&&o!==void 0?o:{}),(r=s.fetchOptions)!==null&&r!==void 0?r:{}),url:h,timeout:s.timeout}}async buildHeaders({options:e,method:t,bodyHeaders:i,retryCount:o}){let r={};this.idempotencyHeader&&t!=="get"&&(e.idempotencyKey||(e.idempotencyKey=this.defaultIdempotencyKey()),r[this.idempotencyHeader]=e.idempotencyKey);const s=await this.authHeaders(e);let a=yo([r,{Accept:"application/json","User-Agent":this.getUserAgent()},this._options.defaultHeaders,i,e.headers,s]);return this.validateHeaders(a),a.values}_makeAbort(e){return()=>e.abort()}buildBody({options:{body:e,headers:t}}){if(!e)return{bodyHeaders:void 0,body:void 0};const i=yo([t]);return ArrayBuffer.isView(e)||e instanceof ArrayBuffer||e instanceof DataView||typeof e=="string"&&i.values.has("content-type")||globalThis.Blob&&e instanceof globalThis.Blob||e instanceof FormData||e instanceof URLSearchParams||globalThis.ReadableStream&&e instanceof globalThis.ReadableStream?{bodyHeaders:void 0,body:e}:typeof e=="object"&&(Symbol.asyncIterator in e||Symbol.iterator in e&&"next"in e&&typeof e.next=="function")?{bodyHeaders:void 0,body:W0(e)}:typeof e=="object"&&i.values.get("content-type")==="application/x-www-form-urlencoded"?{bodyHeaders:{"content-type":"application/x-www-form-urlencoded"},body:this.stringifyQuery(e)}:this.encoder({body:e,headers:i})}}is.DEFAULT_TIMEOUT=6e4;class Nt extends is{constructor(){super(...arguments),this.interactions=new Mf(this)}}Cf=Nt;Nt.GeminiNextGenAPIClient=Cf;Nt.GeminiNextGenAPIClientError=cn;Nt.APIError=qt;Nt.APIConnectionError=ts;Nt.APIConnectionTimeoutError=lf;Nt.APIUserAbortError=pa;Nt.NotFoundError=ff;Nt.ConflictError=hf;Nt.RateLimitError=mf;Nt.BadRequestError=cf;Nt.AuthenticationError=uf;Nt.InternalServerError=gf;Nt.PermissionDeniedError=df;Nt.UnprocessableEntityError=pf;Nt.toFile=Q0;Nt.Interactions=Mf;/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function uy(n,e){const t={},i=l(n,["name"]);return i!=null&&d(t,["_url","name"],i),t}function dy(n,e){const t={},i=l(n,["name"]);return i!=null&&d(t,["_url","name"],i),t}function fy(n,e){const t={},i=l(n,["sdkHttpResponse"]);return i!=null&&d(t,["sdkHttpResponse"],i),t}function hy(n,e){const t={},i=l(n,["sdkHttpResponse"]);return i!=null&&d(t,["sdkHttpResponse"],i),t}function py(n,e,t){const i={};if(l(n,["validationDataset"])!==void 0)throw new Error("validationDataset parameter is not supported in Gemini API.");const o=l(n,["tunedModelDisplayName"]);if(e!==void 0&&o!=null&&d(e,["displayName"],o),l(n,["description"])!==void 0)throw new Error("description parameter is not supported in Gemini API.");const r=l(n,["epochCount"]);e!==void 0&&r!=null&&d(e,["tuningTask","hyperparameters","epochCount"],r);const s=l(n,["learningRateMultiplier"]);if(s!=null&&d(i,["tuningTask","hyperparameters","learningRateMultiplier"],s),l(n,["exportLastCheckpointOnly"])!==void 0)throw new Error("exportLastCheckpointOnly parameter is not supported in Gemini API.");if(l(n,["preTunedModelCheckpointId"])!==void 0)throw new Error("preTunedModelCheckpointId parameter is not supported in Gemini API.");if(l(n,["adapterSize"])!==void 0)throw new Error("adapterSize parameter is not supported in Gemini API.");if(l(n,["tuningMode"])!==void 0)throw new Error("tuningMode parameter is not supported in Gemini API.");if(l(n,["customBaseModel"])!==void 0)throw new Error("customBaseModel parameter is not supported in Gemini API.");const a=l(n,["batchSize"]);e!==void 0&&a!=null&&d(e,["tuningTask","hyperparameters","batchSize"],a);const u=l(n,["learningRate"]);if(e!==void 0&&u!=null&&d(e,["tuningTask","hyperparameters","learningRate"],u),l(n,["labels"])!==void 0)throw new Error("labels parameter is not supported in Gemini API.");if(l(n,["beta"])!==void 0)throw new Error("beta parameter is not supported in Gemini API.");if(l(n,["baseTeacherModel"])!==void 0)throw new Error("baseTeacherModel parameter is not supported in Gemini API.");if(l(n,["tunedTeacherModelSource"])!==void 0)throw new Error("tunedTeacherModelSource parameter is not supported in Gemini API.");if(l(n,["sftLossWeightMultiplier"])!==void 0)throw new Error("sftLossWeightMultiplier parameter is not supported in Gemini API.");if(l(n,["outputUri"])!==void 0)throw new Error("outputUri parameter is not supported in Gemini API.");if(l(n,["encryptionSpec"])!==void 0)throw new Error("encryptionSpec parameter is not supported in Gemini API.");return i}function my(n,e,t){const i={};let o=l(t,["config","method"]);if(o===void 0&&(o="SUPERVISED_FINE_TUNING"),o==="SUPERVISED_FINE_TUNING"){const I=l(n,["validationDataset"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec"],vs(I))}else if(o==="PREFERENCE_TUNING"){const I=l(n,["validationDataset"]);e!==void 0&&I!=null&&d(e,["preferenceOptimizationSpec"],vs(I))}else if(o==="DISTILLATION"){const I=l(n,["validationDataset"]);e!==void 0&&I!=null&&d(e,["distillationSpec"],vs(I))}const r=l(n,["tunedModelDisplayName"]);e!==void 0&&r!=null&&d(e,["tunedModelDisplayName"],r);const s=l(n,["description"]);e!==void 0&&s!=null&&d(e,["description"],s);let a=l(t,["config","method"]);if(a===void 0&&(a="SUPERVISED_FINE_TUNING"),a==="SUPERVISED_FINE_TUNING"){const I=l(n,["epochCount"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","hyperParameters","epochCount"],I)}else if(a==="PREFERENCE_TUNING"){const I=l(n,["epochCount"]);e!==void 0&&I!=null&&d(e,["preferenceOptimizationSpec","hyperParameters","epochCount"],I)}else if(a==="DISTILLATION"){const I=l(n,["epochCount"]);e!==void 0&&I!=null&&d(e,["distillationSpec","hyperParameters","epochCount"],I)}let u=l(t,["config","method"]);if(u===void 0&&(u="SUPERVISED_FINE_TUNING"),u==="SUPERVISED_FINE_TUNING"){const I=l(n,["learningRateMultiplier"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","hyperParameters","learningRateMultiplier"],I)}else if(u==="PREFERENCE_TUNING"){const I=l(n,["learningRateMultiplier"]);e!==void 0&&I!=null&&d(e,["preferenceOptimizationSpec","hyperParameters","learningRateMultiplier"],I)}else if(u==="DISTILLATION"){const I=l(n,["learningRateMultiplier"]);e!==void 0&&I!=null&&d(e,["distillationSpec","hyperParameters","learningRateMultiplier"],I)}let c=l(t,["config","method"]);if(c===void 0&&(c="SUPERVISED_FINE_TUNING"),c==="SUPERVISED_FINE_TUNING"){const I=l(n,["exportLastCheckpointOnly"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","exportLastCheckpointOnly"],I)}else if(c==="PREFERENCE_TUNING"){const I=l(n,["exportLastCheckpointOnly"]);e!==void 0&&I!=null&&d(e,["preferenceOptimizationSpec","exportLastCheckpointOnly"],I)}else if(c==="DISTILLATION"){const I=l(n,["exportLastCheckpointOnly"]);e!==void 0&&I!=null&&d(e,["distillationSpec","exportLastCheckpointOnly"],I)}let f=l(t,["config","method"]);if(f===void 0&&(f="SUPERVISED_FINE_TUNING"),f==="SUPERVISED_FINE_TUNING"){const I=l(n,["adapterSize"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","hyperParameters","adapterSize"],I)}else if(f==="PREFERENCE_TUNING"){const I=l(n,["adapterSize"]);e!==void 0&&I!=null&&d(e,["preferenceOptimizationSpec","hyperParameters","adapterSize"],I)}else if(f==="DISTILLATION"){const I=l(n,["adapterSize"]);e!==void 0&&I!=null&&d(e,["distillationSpec","hyperParameters","adapterSize"],I)}let h=l(t,["config","method"]);if(h===void 0&&(h="SUPERVISED_FINE_TUNING"),h==="SUPERVISED_FINE_TUNING"){const I=l(n,["tuningMode"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","tuningMode"],I)}const p=l(n,["customBaseModel"]);e!==void 0&&p!=null&&d(e,["customBaseModel"],p);let m=l(t,["config","method"]);if(m===void 0&&(m="SUPERVISED_FINE_TUNING"),m==="SUPERVISED_FINE_TUNING"){const I=l(n,["batchSize"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","hyperParameters","batchSize"],I)}let S=l(t,["config","method"]);if(S===void 0&&(S="SUPERVISED_FINE_TUNING"),S==="SUPERVISED_FINE_TUNING"){const I=l(n,["learningRate"]);e!==void 0&&I!=null&&d(e,["supervisedTuningSpec","hyperParameters","learningRate"],I)}const E=l(n,["labels"]);e!==void 0&&E!=null&&d(e,["labels"],E);const _=l(n,["beta"]);e!==void 0&&_!=null&&d(e,["preferenceOptimizationSpec","hyperParameters","beta"],_);const g=l(n,["baseTeacherModel"]);e!==void 0&&g!=null&&d(e,["distillationSpec","baseTeacherModel"],g);const w=l(n,["tunedTeacherModelSource"]);e!==void 0&&w!=null&&d(e,["distillationSpec","tunedTeacherModelSource"],w);const T=l(n,["sftLossWeightMultiplier"]);e!==void 0&&T!=null&&d(e,["distillationSpec","hyperParameters","sftLossWeightMultiplier"],T);const M=l(n,["outputUri"]);e!==void 0&&M!=null&&d(e,["outputUri"],M);const L=l(n,["encryptionSpec"]);return e!==void 0&&L!=null&&d(e,["encryptionSpec"],L),i}function gy(n,e){const t={},i=l(n,["baseModel"]);i!=null&&d(t,["baseModel"],i);const o=l(n,["preTunedModel"]);o!=null&&d(t,["preTunedModel"],o);const r=l(n,["trainingDataset"]);r!=null&&wy(r);const s=l(n,["config"]);return s!=null&&py(s,t),t}function _y(n,e){const t={},i=l(n,["baseModel"]);i!=null&&d(t,["baseModel"],i);const o=l(n,["preTunedModel"]);o!=null&&d(t,["preTunedModel"],o);const r=l(n,["trainingDataset"]);r!=null&&Ry(r,t,e);const s=l(n,["config"]);return s!=null&&my(s,t,e),t}function vy(n,e){const t={},i=l(n,["name"]);return i!=null&&d(t,["_url","name"],i),t}function yy(n,e){const t={},i=l(n,["name"]);return i!=null&&d(t,["_url","name"],i),t}function Sy(n,e,t){const i={},o=l(n,["pageSize"]);e!==void 0&&o!=null&&d(e,["_query","pageSize"],o);const r=l(n,["pageToken"]);e!==void 0&&r!=null&&d(e,["_query","pageToken"],r);const s=l(n,["filter"]);return e!==void 0&&s!=null&&d(e,["_query","filter"],s),i}function Ey(n,e,t){const i={},o=l(n,["pageSize"]);e!==void 0&&o!=null&&d(e,["_query","pageSize"],o);const r=l(n,["pageToken"]);e!==void 0&&r!=null&&d(e,["_query","pageToken"],r);const s=l(n,["filter"]);return e!==void 0&&s!=null&&d(e,["_query","filter"],s),i}function Ty(n,e){const t={},i=l(n,["config"]);return i!=null&&Sy(i,t),t}function xy(n,e){const t={},i=l(n,["config"]);return i!=null&&Ey(i,t),t}function My(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["nextPageToken"]);o!=null&&d(t,["nextPageToken"],o);const r=l(n,["tunedModels"]);if(r!=null){let s=r;Array.isArray(s)&&(s=s.map(a=>wf(a))),d(t,["tuningJobs"],s)}return t}function Ay(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["nextPageToken"]);o!=null&&d(t,["nextPageToken"],o);const r=l(n,["tuningJobs"]);if(r!=null){let s=r;Array.isArray(s)&&(s=s.map(a=>_a(a))),d(t,["tuningJobs"],s)}return t}function Cy(n,e){const t={},i=l(n,["name"]);i!=null&&d(t,["model"],i);const o=l(n,["name"]);return o!=null&&d(t,["endpoint"],o),t}function wy(n,e){const t={};if(l(n,["gcsUri"])!==void 0)throw new Error("gcsUri parameter is not supported in Gemini API.");if(l(n,["vertexDatasetResource"])!==void 0)throw new Error("vertexDatasetResource parameter is not supported in Gemini API.");const i=l(n,["examples"]);if(i!=null){let o=i;Array.isArray(o)&&(o=o.map(r=>r)),d(t,["examples","examples"],o)}return t}function Ry(n,e,t){const i={};let o=l(t,["config","method"]);if(o===void 0&&(o="SUPERVISED_FINE_TUNING"),o==="SUPERVISED_FINE_TUNING"){const s=l(n,["gcsUri"]);e!==void 0&&s!=null&&d(e,["supervisedTuningSpec","trainingDatasetUri"],s)}else if(o==="PREFERENCE_TUNING"){const s=l(n,["gcsUri"]);e!==void 0&&s!=null&&d(e,["preferenceOptimizationSpec","trainingDatasetUri"],s)}else if(o==="DISTILLATION"){const s=l(n,["gcsUri"]);e!==void 0&&s!=null&&d(e,["distillationSpec","promptDatasetUri"],s)}let r=l(t,["config","method"]);if(r===void 0&&(r="SUPERVISED_FINE_TUNING"),r==="SUPERVISED_FINE_TUNING"){const s=l(n,["vertexDatasetResource"]);e!==void 0&&s!=null&&d(e,["supervisedTuningSpec","trainingDatasetUri"],s)}else if(r==="PREFERENCE_TUNING"){const s=l(n,["vertexDatasetResource"]);e!==void 0&&s!=null&&d(e,["preferenceOptimizationSpec","trainingDatasetUri"],s)}else if(r==="DISTILLATION"){const s=l(n,["vertexDatasetResource"]);e!==void 0&&s!=null&&d(e,["distillationSpec","promptDatasetUri"],s)}if(l(n,["examples"])!==void 0)throw new Error("examples parameter is not supported in Vertex AI.");return i}function wf(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["name"]);o!=null&&d(t,["name"],o);const r=l(n,["state"]);r!=null&&d(t,["state"],Hd(r));const s=l(n,["createTime"]);s!=null&&d(t,["createTime"],s);const a=l(n,["tuningTask","startTime"]);a!=null&&d(t,["startTime"],a);const u=l(n,["tuningTask","completeTime"]);u!=null&&d(t,["endTime"],u);const c=l(n,["updateTime"]);c!=null&&d(t,["updateTime"],c);const f=l(n,["description"]);f!=null&&d(t,["description"],f);const h=l(n,["baseModel"]);h!=null&&d(t,["baseModel"],h);const p=l(n,["_self"]);return p!=null&&d(t,["tunedModel"],Cy(p)),t}function _a(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["name"]);o!=null&&d(t,["name"],o);const r=l(n,["state"]);r!=null&&d(t,["state"],Hd(r));const s=l(n,["createTime"]);s!=null&&d(t,["createTime"],s);const a=l(n,["startTime"]);a!=null&&d(t,["startTime"],a);const u=l(n,["endTime"]);u!=null&&d(t,["endTime"],u);const c=l(n,["updateTime"]);c!=null&&d(t,["updateTime"],c);const f=l(n,["error"]);f!=null&&d(t,["error"],f);const h=l(n,["description"]);h!=null&&d(t,["description"],h);const p=l(n,["baseModel"]);p!=null&&d(t,["baseModel"],p);const m=l(n,["tunedModel"]);m!=null&&d(t,["tunedModel"],m);const S=l(n,["preTunedModel"]);S!=null&&d(t,["preTunedModel"],S);const E=l(n,["supervisedTuningSpec"]);E!=null&&d(t,["supervisedTuningSpec"],E);const _=l(n,["preferenceOptimizationSpec"]);_!=null&&d(t,["preferenceOptimizationSpec"],_);const g=l(n,["distillationSpec"]);g!=null&&d(t,["distillationSpec"],g);const w=l(n,["tuningDataStats"]);w!=null&&d(t,["tuningDataStats"],w);const T=l(n,["encryptionSpec"]);T!=null&&d(t,["encryptionSpec"],T);const M=l(n,["partnerModelTuningSpec"]);M!=null&&d(t,["partnerModelTuningSpec"],M);const L=l(n,["customBaseModel"]);L!=null&&d(t,["customBaseModel"],L);const I=l(n,["evaluateDatasetRuns"]);if(I!=null){let ee=I;Array.isArray(ee)&&(ee=ee.map(re=>re)),d(t,["evaluateDatasetRuns"],ee)}const N=l(n,["experiment"]);N!=null&&d(t,["experiment"],N);const k=l(n,["fullFineTuningSpec"]);k!=null&&d(t,["fullFineTuningSpec"],k);const A=l(n,["labels"]);A!=null&&d(t,["labels"],A);const x=l(n,["outputUri"]);x!=null&&d(t,["outputUri"],x);const O=l(n,["pipelineJob"]);O!=null&&d(t,["pipelineJob"],O);const Y=l(n,["serviceAccount"]);Y!=null&&d(t,["serviceAccount"],Y);const $=l(n,["tunedModelDisplayName"]);$!=null&&d(t,["tunedModelDisplayName"],$);const j=l(n,["tuningJobState"]);j!=null&&d(t,["tuningJobState"],j);const ie=l(n,["veoTuningSpec"]);return ie!=null&&d(t,["veoTuningSpec"],ie),t}function Iy(n,e){const t={},i=l(n,["sdkHttpResponse"]);i!=null&&d(t,["sdkHttpResponse"],i);const o=l(n,["name"]);o!=null&&d(t,["name"],o);const r=l(n,["metadata"]);r!=null&&d(t,["metadata"],r);const s=l(n,["done"]);s!=null&&d(t,["done"],s);const a=l(n,["error"]);return a!=null&&d(t,["error"],a),t}function vs(n,e){const t={},i=l(n,["gcsUri"]);i!=null&&d(t,["validationDatasetUri"],i);const o=l(n,["vertexDatasetResource"]);return o!=null&&d(t,["validationDatasetUri"],o),t}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class by extends Wn{constructor(e){super(),this.apiClient=e,this.list=async(t={})=>new Mi(zn.PAGED_ITEM_TUNING_JOBS,i=>this.listInternal(i),await this.listInternal(t),t),this.get=async t=>await this.getInternal(t),this.tune=async t=>{var i;if(this.apiClient.isVertexAI())if(t.baseModel.startsWith("projects/")){const o={tunedModelName:t.baseModel};!((i=t.config)===null||i===void 0)&&i.preTunedModelCheckpointId&&(o.checkpointId=t.config.preTunedModelCheckpointId);const r=Object.assign(Object.assign({},t),{preTunedModel:o});return r.baseModel=void 0,await this.tuneInternal(r)}else{const o=Object.assign({},t);return await this.tuneInternal(o)}else{const o=Object.assign({},t),r=await this.tuneMldevInternal(o);let s="";return r.metadata!==void 0&&r.metadata.tunedModel!==void 0?s=r.metadata.tunedModel:r.name!==void 0&&r.name.includes("/operations/")&&(s=r.name.split("/operations/")[0]),{name:s,state:oa.JOB_STATE_QUEUED}}}}async getInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=yy(e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>_a(f))}else{const c=vy(e);return a=Ee("{name}",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>wf(f))}}async listInternal(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=xy(e);return a=Ee("tuningJobs",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=Ay(f),p=new Xc;return Object.assign(p,h),p})}else{const c=Ty(e);return a=Ee("tunedModels",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"GET",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=My(f),p=new Xc;return Object.assign(p,h),p})}}async cancel(e){var t,i,o,r;let s,a="",u={};if(this.apiClient.isVertexAI()){const c=dy(e);return a=Ee("{name}:cancel",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=hy(f),p=new Yc;return Object.assign(p,h),p})}else{const c=uy(e);return a=Ee("{name}:cancel",c._url),u=c._query,delete c._url,delete c._query,s=this.apiClient.request({path:a,queryParams:u,body:JSON.stringify(c),httpMethod:"POST",httpOptions:(o=e.config)===null||o===void 0?void 0:o.httpOptions,abortSignal:(r=e.config)===null||r===void 0?void 0:r.abortSignal}).then(f=>f.json().then(h=>{const p=h;return p.sdkHttpResponse={headers:f.headers},p})),s.then(f=>{const h=fy(f),p=new Yc;return Object.assign(p,h),p})}}async tuneInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI()){const a=_y(e,e);return r=Ee("tuningJobs",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>_a(u))}else throw new Error("This method is only supported by the Vertex AI.")}async tuneMldevInternal(e){var t,i;let o,r="",s={};if(this.apiClient.isVertexAI())throw new Error("This method is only supported by the Gemini Developer API.");{const a=gy(e);return r=Ee("tunedModels",a._url),s=a._query,delete a._url,delete a._query,o=this.apiClient.request({path:r,queryParams:s,body:JSON.stringify(a),httpMethod:"POST",httpOptions:(t=e.config)===null||t===void 0?void 0:t.httpOptions,abortSignal:(i=e.config)===null||i===void 0?void 0:i.abortSignal}).then(u=>u.json().then(c=>{const f=c;return f.sdkHttpResponse={headers:u.headers},f})),o.then(u=>Iy(u))}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Py{async download(e,t){throw new Error("Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.")}}const Dy=1024*1024*8,Ny=3,Uy=1e3,Ly=2,Hr="x-goog-upload-status";async function Fy(n,e,t){var i;const o=await Rf(n,e,t),r=await(o==null?void 0:o.json());if(((i=o==null?void 0:o.headers)===null||i===void 0?void 0:i[Hr])!=="final")throw new Error("Failed to upload file: Upload status is not finalized.");return r.file}async function By(n,e,t){var i;const o=await Rf(n,e,t),r=await(o==null?void 0:o.json());if(((i=o==null?void 0:o.headers)===null||i===void 0?void 0:i[Hr])!=="final")throw new Error("Failed to upload file: Upload status is not finalized.");const s=Fd(r),a=new ul;return Object.assign(a,s),a}async function Rf(n,e,t){var i,o;let r=0,s=0,a=new sa(new Response),u="upload";for(r=n.size;s<r;){const c=Math.min(Dy,r-s),f=n.slice(s,s+c);s+c>=r&&(u+=", finalize");let h=0,p=Uy;for(;h<Ny&&(a=await t.request({path:"",body:f,httpMethod:"POST",httpOptions:{apiVersion:"",baseUrl:e,headers:{"X-Goog-Upload-Command":u,"X-Goog-Upload-Offset":String(s),"Content-Length":String(c)}}}),!(!((i=a==null?void 0:a.headers)===null||i===void 0)&&i[Hr]));)h++,await ky(p),p=p*Ly;if(s+=c,((o=a==null?void 0:a.headers)===null||o===void 0?void 0:o[Hr])!=="active")break;if(r<=s)throw new Error("All content has been uploaded, but the upload status is not finalized.")}return a}async function Oy(n){return{size:n.size,type:n.type}}function ky(n){return new Promise(e=>setTimeout(e,n))}class Gy{async upload(e,t,i){if(typeof e=="string")throw new Error("File path is not supported in browser uploader.");return await Fy(e,t,i)}async uploadToFileSearchStore(e,t,i){if(typeof e=="string")throw new Error("File path is not supported in browser uploader.");return await By(e,t,i)}async stat(e){if(typeof e=="string")throw new Error("File path is not supported in browser uploader.");return await Oy(e)}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Vy{create(e,t,i){return new Hy(e,t,i)}}class Hy{constructor(e,t,i){this.url=e,this.headers=t,this.callbacks=i}connect(){this.ws=new WebSocket(this.url),this.ws.onopen=this.callbacks.onopen,this.ws.onerror=this.callbacks.onerror,this.ws.onclose=this.callbacks.onclose,this.ws.onmessage=this.callbacks.onmessage}send(e){if(this.ws===void 0)throw new Error("WebSocket is not connected");this.ws.send(e)}close(){if(this.ws===void 0)throw new Error("WebSocket is not connected");this.ws.close()}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const yu="x-goog-api-key";class zy{constructor(e){this.apiKey=e}async addAuthHeaders(e,t){if(e.get(yu)===null){if(this.apiKey.startsWith("auth_tokens/"))throw new Error("Ephemeral tokens are only supported by the live API.");if(!this.apiKey)throw new Error("API key is missing. Please provide a valid API key.");e.append(yu,this.apiKey)}}}/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wy="gl-node/";class qy{get interactions(){var e;if(this._interactions!==void 0)return this._interactions;console.warn("GoogleGenAI.interactions: Interactions usage is experimental and may change in future versions.");const t=this.httpOptions;t!=null&&t.extraBody&&console.warn("GoogleGenAI.interactions: Client level httpOptions.extraBody is not supported by the interactions client and will be ignored.");const i=new Nt({baseURL:this.apiClient.getBaseUrl(),apiKey:this.apiKey,apiVersion:this.apiClient.getApiVersion(),clientAdapter:this.apiClient,defaultHeaders:this.apiClient.getDefaultHeaders(),timeout:t==null?void 0:t.timeout,maxRetries:(e=t==null?void 0:t.retryOptions)===null||e===void 0?void 0:e.attempts});return this._interactions=i.interactions,this._interactions}constructor(e){var t;if(e.apiKey==null)throw new Error("An API Key must be set when running in a browser");if(e.project||e.location)throw new Error("Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.");this.vertexai=(t=e.vertexai)!==null&&t!==void 0?t:!1,this.apiKey=e.apiKey;const i=Ph(e.httpOptions,e.vertexai,void 0,void 0);i&&(e.httpOptions?e.httpOptions.baseUrl=i:e.httpOptions={baseUrl:i}),this.apiVersion=e.apiVersion,this.httpOptions=e.httpOptions;const o=new zy(this.apiKey);this.apiClient=new Vv({auth:o,apiVersion:this.apiVersion,apiKey:this.apiKey,vertexai:this.vertexai,httpOptions:this.httpOptions,userAgentExtra:Wy+"web",uploader:new Gy,downloader:new Py}),this.models=new s0(this.apiClient),this.live=new e0(this.apiClient,o,new Vy),this.batches=new cm(this.apiClient),this.chats=new qm(this.models,this.apiClient),this.caches=new Hm(this.apiClient),this.files=new ig(this.apiClient),this.operations=new a0(this.apiClient),this.authTokens=new M0(this.apiClient),this.tunings=new by(this.apiClient),this.fileSearchStores=new D0(this.apiClient)}}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr=globalThis,vl=Rr.ShadowRoot&&(Rr.ShadyCSS===void 0||Rr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yl=Symbol(),Su=new WeakMap;let If=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==yl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(vl&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Su.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Su.set(t,e))}return e}toString(){return this.cssText}};const $y=n=>new If(typeof n=="string"?n:n+"",void 0,yl),bf=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((i,o,r)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+n[r+1],n[0]);return new If(t,n,yl)},Xy=(n,e)=>{if(vl)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),o=Rr.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=t.cssText,n.appendChild(i)}},Eu=vl?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return $y(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Yy,defineProperty:Jy,getOwnPropertyDescriptor:Ky,getOwnPropertyNames:Zy,getOwnPropertySymbols:Qy,getPrototypeOf:jy}=Object,ni=globalThis,Tu=ni.trustedTypes,eS=Tu?Tu.emptyScript:"",ys=ni.reactiveElementPolyfillSupport,Io=(n,e)=>n,zr={toAttribute(n,e){switch(e){case Boolean:n=n?eS:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Sl=(n,e)=>!Yy(n,e),xu={attribute:!0,type:String,converter:zr,reflect:!1,useDefault:!1,hasChanged:Sl};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ni.litPropertyMetadata??(ni.litPropertyMetadata=new WeakMap);let Vi=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=xu){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);o!==void 0&&Jy(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:r}=Ky(this.prototype,e)??{get(){return this[t]},set(s){this[t]=s}};return{get:o,set(s){const a=o==null?void 0:o.call(this);r==null||r.call(this,s),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xu}static _$Ei(){if(this.hasOwnProperty(Io("elementProperties")))return;const e=jy(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Io("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Io("properties"))){const t=this.properties,i=[...Zy(t),...Qy(t)];for(const o of i)this.createProperty(o,t[o])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,o]of t)this.elementProperties.set(i,o)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const o=this._$Eu(t,i);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const o of i)t.unshift(Eu(o))}else e!==void 0&&t.push(Eu(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xy(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var r;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){const s=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:zr).toAttribute(t,i.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){var r,s;const i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const a=i.getPropertyOptions(o),u=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:zr;this._$Em=o;const c=u.fromAttribute(t,a.type);this[o]=c??((s=this._$Ej)==null?void 0:s.get(o))??c,this._$Em=null}}requestUpdate(e,t,i,o=!1,r){var s;if(e!==void 0){const a=this.constructor;if(o===!1&&(r=this[e]),i??(i=a.getPropertyOptions(e)),!((i.hasChanged??Sl)(r,t)||i.useDefault&&i.reflect&&r===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:r},s){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,s??t??this[e]),r!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[r,s]of o){const{wrapped:a}=s,u=this[r];a!==!0||this._$AL.has(r)||u===void 0||this.C(r,void 0,s,u)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostUpdated)==null?void 0:o.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};Vi.elementStyles=[],Vi.shadowRootOptions={mode:"open"},Vi[Io("elementProperties")]=new Map,Vi[Io("finalized")]=new Map,ys==null||ys({ReactiveElement:Vi}),(ni.reactiveElementVersions??(ni.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bo=globalThis,Mu=n=>n,Wr=bo.trustedTypes,Au=Wr?Wr.createPolicy("lit-html",{createHTML:n=>n}):void 0,Pf="$lit$",ei=`lit$${Math.random().toFixed(9).slice(2)}$`,Df="?"+ei,tS=`<${Df}>`,Ti=document,No=()=>Ti.createComment(""),Uo=n=>n===null||typeof n!="object"&&typeof n!="function",El=Array.isArray,nS=n=>El(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Ss=`[ 	
\f\r]`,So=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Cu=/-->/g,wu=/>/g,li=RegExp(`>|${Ss}(?:([^\\s"'>=/]+)(${Ss}*=${Ss}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ru=/'/g,Iu=/"/g,Nf=/^(?:script|style|textarea|title)$/i,iS=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),Mn=iS(1),Zi=Symbol.for("lit-noChange"),Pt=Symbol.for("lit-nothing"),bu=new WeakMap,Si=Ti.createTreeWalker(Ti,129);function Uf(n,e){if(!El(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Au!==void 0?Au.createHTML(e):e}const oS=(n,e)=>{const t=n.length-1,i=[];let o,r=e===2?"<svg>":e===3?"<math>":"",s=So;for(let a=0;a<t;a++){const u=n[a];let c,f,h=-1,p=0;for(;p<u.length&&(s.lastIndex=p,f=s.exec(u),f!==null);)p=s.lastIndex,s===So?f[1]==="!--"?s=Cu:f[1]!==void 0?s=wu:f[2]!==void 0?(Nf.test(f[2])&&(o=RegExp("</"+f[2],"g")),s=li):f[3]!==void 0&&(s=li):s===li?f[0]===">"?(s=o??So,h=-1):f[1]===void 0?h=-2:(h=s.lastIndex-f[2].length,c=f[1],s=f[3]===void 0?li:f[3]==='"'?Iu:Ru):s===Iu||s===Ru?s=li:s===Cu||s===wu?s=So:(s=li,o=void 0);const m=s===li&&n[a+1].startsWith("/>")?" ":"";r+=s===So?u+tS:h>=0?(i.push(c),u.slice(0,h)+Pf+u.slice(h)+ei+m):u+ei+(h===-2?a:m)}return[Uf(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class Lo{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let r=0,s=0;const a=e.length-1,u=this.parts,[c,f]=oS(e,t);if(this.el=Lo.createElement(c,i),Si.currentNode=this.el.content,t===2||t===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=Si.nextNode())!==null&&u.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const h of o.getAttributeNames())if(h.endsWith(Pf)){const p=f[s++],m=o.getAttribute(h).split(ei),S=/([.?@])?(.*)/.exec(p);u.push({type:1,index:r,name:S[2],strings:m,ctor:S[1]==="."?sS:S[1]==="?"?aS:S[1]==="@"?lS:os}),o.removeAttribute(h)}else h.startsWith(ei)&&(u.push({type:6,index:r}),o.removeAttribute(h));if(Nf.test(o.tagName)){const h=o.textContent.split(ei),p=h.length-1;if(p>0){o.textContent=Wr?Wr.emptyScript:"";for(let m=0;m<p;m++)o.append(h[m],No()),Si.nextNode(),u.push({type:2,index:++r});o.append(h[p],No())}}}else if(o.nodeType===8)if(o.data===Df)u.push({type:2,index:r});else{let h=-1;for(;(h=o.data.indexOf(ei,h+1))!==-1;)u.push({type:7,index:r}),h+=ei.length-1}r++}}static createElement(e,t){const i=Ti.createElement("template");return i.innerHTML=e,i}}function Qi(n,e,t=n,i){var s,a;if(e===Zi)return e;let o=i!==void 0?(s=t._$Co)==null?void 0:s[i]:t._$Cl;const r=Uo(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==r&&((a=o==null?void 0:o._$AO)==null||a.call(o,!1),r===void 0?o=void 0:(o=new r(n),o._$AT(n,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=o:t._$Cl=o),o!==void 0&&(e=Qi(n,o._$AS(n,e.values),o,i)),e}class rS{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=((e==null?void 0:e.creationScope)??Ti).importNode(t,!0);Si.currentNode=o;let r=Si.nextNode(),s=0,a=0,u=i[0];for(;u!==void 0;){if(s===u.index){let c;u.type===2?c=new Vo(r,r.nextSibling,this,e):u.type===1?c=new u.ctor(r,u.name,u.strings,this,e):u.type===6&&(c=new cS(r,this,e)),this._$AV.push(c),u=i[++a]}s!==(u==null?void 0:u.index)&&(r=Si.nextNode(),s++)}return Si.currentNode=Ti,o}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Vo{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=Pt,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Qi(this,e,t),Uo(e)?e===Pt||e==null||e===""?(this._$AH!==Pt&&this._$AR(),this._$AH=Pt):e!==this._$AH&&e!==Zi&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):nS(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Pt&&Uo(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ti.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Lo.createElement(Uf(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===o)this._$AH.p(t);else{const s=new rS(o,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(e){let t=bu.get(e.strings);return t===void 0&&bu.set(e.strings,t=new Lo(e)),t}k(e){El(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const r of e)o===t.length?t.push(i=new Vo(this.O(No()),this.O(No()),this,this.options)):i=t[o],i._$AI(r),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e!==this._$AB;){const o=Mu(e).nextSibling;Mu(e).remove(),e=o}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class os{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,r){this.type=1,this._$AH=Pt,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Pt}_$AI(e,t=this,i,o){const r=this.strings;let s=!1;if(r===void 0)e=Qi(this,e,t,0),s=!Uo(e)||e!==this._$AH&&e!==Zi,s&&(this._$AH=e);else{const a=e;let u,c;for(e=r[0],u=0;u<r.length-1;u++)c=Qi(this,a[i+u],t,u),c===Zi&&(c=this._$AH[u]),s||(s=!Uo(c)||c!==this._$AH[u]),c===Pt?e=Pt:e!==Pt&&(e+=(c??"")+r[u+1]),this._$AH[u]=c}s&&!o&&this.j(e)}j(e){e===Pt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class sS extends os{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Pt?void 0:e}}class aS extends os{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Pt)}}class lS extends os{constructor(e,t,i,o,r){super(e,t,i,o,r),this.type=5}_$AI(e,t=this){if((e=Qi(this,e,t,0)??Pt)===Zi)return;const i=this._$AH,o=e===Pt&&i!==Pt||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==Pt&&(i===Pt||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class cS{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Qi(this,e)}}const Es=bo.litHtmlPolyfillSupport;Es==null||Es(Lo,Vo),(bo.litHtmlVersions??(bo.litHtmlVersions=[])).push("3.3.2");const uS=(n,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let o=i._$litPart$;if(o===void 0){const r=(t==null?void 0:t.renderBefore)??null;i._$litPart$=o=new Vo(e.insertBefore(No(),r),r,void 0,t??{})}return o._$AI(n),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ei=globalThis;let Yi=class extends Vi{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=uS(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Zi}};var Ud;Yi._$litElement$=!0,Yi.finalized=!0,(Ud=Ei.litElementHydrateSupport)==null||Ud.call(Ei,{LitElement:Yi});const Ts=Ei.litElementPolyfillSupport;Ts==null||Ts({LitElement:Yi});(Ei.litElementVersions??(Ei.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lf=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dS={attribute:!0,type:String,converter:zr,reflect:!1,hasChanged:Sl},fS=(n=dS,e,t)=>{const{kind:i,metadata:o}=t;let r=globalThis.litPropertyMetadata.get(o);if(r===void 0&&globalThis.litPropertyMetadata.set(o,r=new Map),i==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),i==="accessor"){const{name:s}=t;return{set(a){const u=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,u,n,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,n,a),a}}}if(i==="setter"){const{name:s}=t;return function(a){const u=this[s];e.call(this,a),this.requestUpdate(s,u,n,!0,a)}}throw Error("Unsupported decorator location: "+i)};function rs(n){return(e,t)=>typeof t=="object"?fS(n,e,t):((i,o,r)=>{const s=o.hasOwnProperty(r);return o.constructor.createProperty(r,i),s?Object.getOwnPropertyDescriptor(o,r):void 0})(n,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ut(n){return rs({...n,state:!0,attribute:!1})}/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/function hS(n){let e="";const t=n.byteLength;for(let i=0;i<t;i++)e+=String.fromCharCode(n[i]);return btoa(e)}function pS(n){const e=atob(n),t=e.length,i=new Uint8Array(t);for(let o=0;o<t;o++)i[o]=e.charCodeAt(o);return i}function mS(n){const e=n.length,t=new Int16Array(e);for(let i=0;i<e;i++)t[i]=n[i]*32768;return{data:hS(new Uint8Array(t.buffer)),mimeType:"audio/pcm;rate=16000"}}async function gS(n,e,t,i){const o=e.createBuffer(i,n.length/2/i,t),r=new Int16Array(n.buffer),s=r.length,a=new Float32Array(s);for(let u=0;u<s;u++)a[u]=r[u]/32768;for(let u=0;u<i;u++){const c=a.filter((f,h)=>h%i===u);o.copyToChannel(c,u)}return o}/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/class Pu{constructor(e){this.bufferLength=0,this.analyser=e.context.createAnalyser(),this.analyser.fftSize=32,this.bufferLength=this.analyser.frequencyBinCount,this.dataArray=new Uint8Array(this.bufferLength),e.connect(this.analyser)}update(){this.analyser.getByteFrequencyData(this.dataArray)}get data(){return this.dataArray}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Tl="176",_S=0,Du=1,vS=2,Ff=1,yS=2,Ln=3,oi=0,Ht=1,Fn=2,Vn=0,Ji=1,qr=2,Nu=3,Uu=4,SS=5,vi=100,ES=101,TS=102,xS=103,MS=104,AS=200,CS=201,wS=202,RS=203,va=204,ya=205,IS=206,bS=207,PS=208,DS=209,NS=210,US=211,LS=212,FS=213,BS=214,Sa=0,Ea=1,Ta=2,ji=3,xa=4,Ma=5,Aa=6,Ca=7,Bf=0,OS=1,kS=2,ii=0,GS=1,VS=2,HS=3,zS=4,WS=5,qS=6,$S=7,Of=300,eo=301,to=302,$r=303,wa=304,ss=306,Ra=1e3,kn=1001,Ia=1002,en=1003,XS=1004,tr=1005,Gt=1006,xs=1007,ti=1008,Cn=1009,kf=1010,Gf=1011,Fo=1012,xl=1013,xi=1014,rn=1015,jt=1016,Ml=1017,Al=1018,Bo=1020,Vf=35902,Hf=1021,zf=1022,sn=1023,Oo=1026,ko=1027,Cl=1028,wl=1029,Wf=1030,Rl=1031,Il=1033,Ir=33776,br=33777,Pr=33778,Dr=33779,ba=35840,Pa=35841,Da=35842,Na=35843,Ua=36196,La=37492,Fa=37496,Ba=37808,Oa=37809,ka=37810,Ga=37811,Va=37812,Ha=37813,za=37814,Wa=37815,qa=37816,$a=37817,Xa=37818,Ya=37819,Ja=37820,Ka=37821,Nr=36492,Za=36494,Qa=36495,qf=36283,ja=36284,el=36285,tl=36286,YS=3200,JS=3201,$f=0,KS=1,Bn="",nn="srgb",ri="srgb-linear",Xr="linear",ht="srgb",wi=7680,Lu=519,ZS=512,QS=513,jS=514,Xf=515,eE=516,tE=517,nE=518,iE=519,Fu=35044,nl="300 es",Gn=2e3,Yr=2001;class lo{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const o=i[e];if(o!==void 0){const r=o.indexOf(t);r!==-1&&o.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const o=i.slice(0);for(let r=0,s=o.length;r<s;r++)o[r].call(this,e);e.target=null}}}const Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ms=Math.PI/180,il=180/Math.PI;function Ho(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Lt[n&255]+Lt[n>>8&255]+Lt[n>>16&255]+Lt[n>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]).toLowerCase()}function it(n,e,t){return Math.max(e,Math.min(t,n))}function oE(n,e){return(n%e+e)%e}function As(n,e,t){return(1-t)*n+t*e}function Eo(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function $t(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class We{constructor(e=0,t=0){We.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6],this.y=o[1]*t+o[4]*i+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(it(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(it(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),o=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*i-s*o+e.x,this.y=r*o+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,i,o,r,s,a,u,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,o,r,s,a,u,c)}set(e,t,i,o,r,s,a,u,c){const f=this.elements;return f[0]=e,f[1]=o,f[2]=a,f[3]=t,f[4]=r,f[5]=u,f[6]=i,f[7]=s,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,r=this.elements,s=i[0],a=i[3],u=i[6],c=i[1],f=i[4],h=i[7],p=i[2],m=i[5],S=i[8],E=o[0],_=o[3],g=o[6],w=o[1],T=o[4],M=o[7],L=o[2],I=o[5],N=o[8];return r[0]=s*E+a*w+u*L,r[3]=s*_+a*T+u*I,r[6]=s*g+a*M+u*N,r[1]=c*E+f*w+h*L,r[4]=c*_+f*T+h*I,r[7]=c*g+f*M+h*N,r[2]=p*E+m*w+S*L,r[5]=p*_+m*T+S*I,r[8]=p*g+m*M+S*N,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],o=e[2],r=e[3],s=e[4],a=e[5],u=e[6],c=e[7],f=e[8];return t*s*f-t*a*c-i*r*f+i*a*u+o*r*c-o*s*u}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],r=e[3],s=e[4],a=e[5],u=e[6],c=e[7],f=e[8],h=f*s-a*c,p=a*u-f*r,m=c*r-s*u,S=t*h+i*p+o*m;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/S;return e[0]=h*E,e[1]=(o*c-f*i)*E,e[2]=(a*i-o*s)*E,e[3]=p*E,e[4]=(f*t-o*u)*E,e[5]=(o*r-a*t)*E,e[6]=m*E,e[7]=(i*u-c*t)*E,e[8]=(s*t-i*r)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,o,r,s,a){const u=Math.cos(r),c=Math.sin(r);return this.set(i*u,i*c,-i*(u*s+c*a)+s+e,-o*c,o*u,-o*(-c*s+u*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Cs.makeScale(e,t)),this}rotate(e){return this.premultiply(Cs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Cs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<9;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Cs=new Ke;function Yf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Jr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function rE(){const n=Jr("canvas");return n.style.display="block",n}const Bu={};function Ur(n){n in Bu||(Bu[n]=!0,console.warn(n))}function sE(n,e,t){return new Promise(function(i,o){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:o();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function aE(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function lE(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ou=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ku=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cE(){const n={enabled:!0,workingColorSpace:ri,spaces:{},convert:function(o,r,s){return this.enabled===!1||r===s||!r||!s||(this.spaces[r].transfer===ht&&(o.r=Hn(o.r),o.g=Hn(o.g),o.b=Hn(o.b)),this.spaces[r].primaries!==this.spaces[s].primaries&&(o.applyMatrix3(this.spaces[r].toXYZ),o.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===ht&&(o.r=Ki(o.r),o.g=Ki(o.g),o.b=Ki(o.b))),o},fromWorkingColorSpace:function(o,r){return this.convert(o,this.workingColorSpace,r)},toWorkingColorSpace:function(o,r){return this.convert(o,r,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===Bn?Xr:this.spaces[o].transfer},getLuminanceCoefficients:function(o,r=this.workingColorSpace){return o.fromArray(this.spaces[r].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,r,s){return o.copy(this.spaces[r].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ri]:{primaries:e,whitePoint:i,transfer:Xr,toXYZ:Ou,fromXYZ:ku,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:e,whitePoint:i,transfer:ht,toXYZ:Ou,fromXYZ:ku,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),n}const at=cE();function Hn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ki(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ri;class uE{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ri===void 0&&(Ri=Jr("canvas")),Ri.width=e.width,Ri.height=e.height;const o=Ri.getContext("2d");e instanceof ImageData?o.putImageData(e,0,0):o.drawImage(e,0,0,e.width,e.height),i=Ri}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Jr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const o=i.getImageData(0,0,e.width,e.height),r=o.data;for(let s=0;s<r.length;s++)r[s]=Hn(r[s]/255)*255;return i.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Hn(t[i]/255)*255):t[i]=Hn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dE=0;class bl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dE++}),this.uuid=Ho(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let r;if(Array.isArray(o)){r=[];for(let s=0,a=o.length;s<a;s++)o[s].isDataTexture?r.push(ws(o[s].image)):r.push(ws(o[s]))}else r=ws(o);i.url=r}return t||(e.images[this.uuid]=i),i}}function ws(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?uE.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fE=0;class zt extends lo{constructor(e=zt.DEFAULT_IMAGE,t=zt.DEFAULT_MAPPING,i=kn,o=kn,r=Gt,s=ti,a=sn,u=Cn,c=zt.DEFAULT_ANISOTROPY,f=Bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fE++}),this.uuid=Ho(),this.name="",this.source=new bl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=u,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isTextureArray=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isTextureArray=e.isTextureArray,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Of)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ra:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case Ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ra:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case Ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}zt.DEFAULT_IMAGE=null;zt.DEFAULT_MAPPING=Of;zt.DEFAULT_ANISOTROPY=1;class dt{constructor(e=0,t=0,i=0,o=1){dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,o){return this.x=e,this.y=t,this.z=i,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*o+s[12]*r,this.y=s[1]*t+s[5]*i+s[9]*o+s[13]*r,this.z=s[2]*t+s[6]*i+s[10]*o+s[14]*r,this.w=s[3]*t+s[7]*i+s[11]*o+s[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,o,r;const u=e.elements,c=u[0],f=u[4],h=u[8],p=u[1],m=u[5],S=u[9],E=u[2],_=u[6],g=u[10];if(Math.abs(f-p)<.01&&Math.abs(h-E)<.01&&Math.abs(S-_)<.01){if(Math.abs(f+p)<.1&&Math.abs(h+E)<.1&&Math.abs(S+_)<.1&&Math.abs(c+m+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,M=(m+1)/2,L=(g+1)/2,I=(f+p)/4,N=(h+E)/4,k=(S+_)/4;return T>M&&T>L?T<.01?(i=0,o=.707106781,r=.707106781):(i=Math.sqrt(T),o=I/i,r=N/i):M>L?M<.01?(i=.707106781,o=0,r=.707106781):(o=Math.sqrt(M),i=I/o,r=k/o):L<.01?(i=.707106781,o=.707106781,r=0):(r=Math.sqrt(L),i=N/r,o=k/r),this.set(i,o,r,t),this}let w=Math.sqrt((_-S)*(_-S)+(h-E)*(h-E)+(p-f)*(p-f));return Math.abs(w)<.001&&(w=1),this.x=(_-S)/w,this.y=(h-E)/w,this.z=(p-f)/w,this.w=Math.acos((c+m+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this.w=it(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this.w=it(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(it(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hE extends lo{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth?i.depth:1,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);const o={width:e,height:t,depth:this.depth};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,multiview:!1},i);const r=new zt(o,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const s=i.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let o=0,r=this.textures.length;o<r;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const o=Object.assign({},e.textures[t].image);this.textures[t].source=new bl(o)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yn extends hE{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Jf extends zt{constructor(e=null,t=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=en,this.minFilter=en,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class pE extends zt{constructor(e=null,t=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=en,this.minFilter=en,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class co{constructor(e=0,t=0,i=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=o}static slerpFlat(e,t,i,o,r,s,a){let u=i[o+0],c=i[o+1],f=i[o+2],h=i[o+3];const p=r[s+0],m=r[s+1],S=r[s+2],E=r[s+3];if(a===0){e[t+0]=u,e[t+1]=c,e[t+2]=f,e[t+3]=h;return}if(a===1){e[t+0]=p,e[t+1]=m,e[t+2]=S,e[t+3]=E;return}if(h!==E||u!==p||c!==m||f!==S){let _=1-a;const g=u*p+c*m+f*S+h*E,w=g>=0?1:-1,T=1-g*g;if(T>Number.EPSILON){const L=Math.sqrt(T),I=Math.atan2(L,g*w);_=Math.sin(_*I)/L,a=Math.sin(a*I)/L}const M=a*w;if(u=u*_+p*M,c=c*_+m*M,f=f*_+S*M,h=h*_+E*M,_===1-a){const L=1/Math.sqrt(u*u+c*c+f*f+h*h);u*=L,c*=L,f*=L,h*=L}}e[t]=u,e[t+1]=c,e[t+2]=f,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,o,r,s){const a=i[o],u=i[o+1],c=i[o+2],f=i[o+3],h=r[s],p=r[s+1],m=r[s+2],S=r[s+3];return e[t]=a*S+f*h+u*m-c*p,e[t+1]=u*S+f*p+c*h-a*m,e[t+2]=c*S+f*m+a*p-u*h,e[t+3]=f*S-a*h-u*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,o){return this._x=e,this._y=t,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,o=e._y,r=e._z,s=e._order,a=Math.cos,u=Math.sin,c=a(i/2),f=a(o/2),h=a(r/2),p=u(i/2),m=u(o/2),S=u(r/2);switch(s){case"XYZ":this._x=p*f*h+c*m*S,this._y=c*m*h-p*f*S,this._z=c*f*S+p*m*h,this._w=c*f*h-p*m*S;break;case"YXZ":this._x=p*f*h+c*m*S,this._y=c*m*h-p*f*S,this._z=c*f*S-p*m*h,this._w=c*f*h+p*m*S;break;case"ZXY":this._x=p*f*h-c*m*S,this._y=c*m*h+p*f*S,this._z=c*f*S+p*m*h,this._w=c*f*h-p*m*S;break;case"ZYX":this._x=p*f*h-c*m*S,this._y=c*m*h+p*f*S,this._z=c*f*S-p*m*h,this._w=c*f*h+p*m*S;break;case"YZX":this._x=p*f*h+c*m*S,this._y=c*m*h+p*f*S,this._z=c*f*S-p*m*h,this._w=c*f*h-p*m*S;break;case"XZY":this._x=p*f*h-c*m*S,this._y=c*m*h-p*f*S,this._z=c*f*S+p*m*h,this._w=c*f*h+p*m*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,o=Math.sin(i);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],o=t[4],r=t[8],s=t[1],a=t[5],u=t[9],c=t[2],f=t[6],h=t[10],p=i+a+h;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(f-u)*m,this._y=(r-c)*m,this._z=(s-o)*m}else if(i>a&&i>h){const m=2*Math.sqrt(1+i-a-h);this._w=(f-u)/m,this._x=.25*m,this._y=(o+s)/m,this._z=(r+c)/m}else if(a>h){const m=2*Math.sqrt(1+a-i-h);this._w=(r-c)/m,this._x=(o+s)/m,this._y=.25*m,this._z=(u+f)/m}else{const m=2*Math.sqrt(1+h-i-a);this._w=(s-o)/m,this._x=(r+c)/m,this._y=(u+f)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(it(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const o=Math.min(1,t/i);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,o=e._y,r=e._z,s=e._w,a=t._x,u=t._y,c=t._z,f=t._w;return this._x=i*f+s*a+o*c-r*u,this._y=o*f+s*u+r*a-i*c,this._z=r*f+s*c+i*u-o*a,this._w=s*f-i*a-o*u-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,o=this._y,r=this._z,s=this._w;let a=s*e._w+i*e._x+o*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=i,this._y=o,this._z=r,this;const u=1-a*a;if(u<=Number.EPSILON){const m=1-t;return this._w=m*s+t*this._w,this._x=m*i+t*this._x,this._y=m*o+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(u),f=Math.atan2(c,a),h=Math.sin((1-t)*f)/c,p=Math.sin(t*f)/c;return this._w=s*h+this._w*p,this._x=i*h+this._x*p,this._y=o*h+this._y*p,this._z=r*h+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(o*Math.sin(e),o*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(e=0,t=0,i=0){q.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Gu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Gu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,o=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*o,this.y=r[1]*t+r[4]*i+r[7]*o,this.z=r[2]*t+r[5]*i+r[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,r=e.elements,s=1/(r[3]*t+r[7]*i+r[11]*o+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*o+r[12])*s,this.y=(r[1]*t+r[5]*i+r[9]*o+r[13])*s,this.z=(r[2]*t+r[6]*i+r[10]*o+r[14])*s,this}applyQuaternion(e){const t=this.x,i=this.y,o=this.z,r=e.x,s=e.y,a=e.z,u=e.w,c=2*(s*o-a*i),f=2*(a*t-r*o),h=2*(r*i-s*t);return this.x=t+u*c+s*h-a*f,this.y=i+u*f+a*c-r*h,this.z=o+u*h+r*f-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,o=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*o,this.y=r[1]*t+r[5]*i+r[9]*o,this.z=r[2]*t+r[6]*i+r[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(it(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,o=e.y,r=e.z,s=t.x,a=t.y,u=t.z;return this.x=o*u-r*a,this.y=r*s-i*u,this.z=i*a-o*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Rs.copy(this).projectOnVector(e),this.sub(Rs)}reflect(e){return this.sub(Rs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(it(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,o=this.z-e.z;return t*t+i*i+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const o=Math.sin(t)*e;return this.x=o*Math.sin(i),this.y=Math.cos(t)*e,this.z=o*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Rs=new q,Gu=new co;class zo{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,dn):dn.fromBufferAttribute(r,s),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),nr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),nr.copy(i.boundingBox)),nr.applyMatrix4(e.matrixWorld),this.union(nr)}const o=e.children;for(let r=0,s=o.length;r<s;r++)this.expandByObject(o[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(To),ir.subVectors(this.max,To),Ii.subVectors(e.a,To),bi.subVectors(e.b,To),Pi.subVectors(e.c,To),Xn.subVectors(bi,Ii),Yn.subVectors(Pi,bi),ci.subVectors(Ii,Pi);let t=[0,-Xn.z,Xn.y,0,-Yn.z,Yn.y,0,-ci.z,ci.y,Xn.z,0,-Xn.x,Yn.z,0,-Yn.x,ci.z,0,-ci.x,-Xn.y,Xn.x,0,-Yn.y,Yn.x,0,-ci.y,ci.x,0];return!Is(t,Ii,bi,Pi,ir)||(t=[1,0,0,0,1,0,0,0,1],!Is(t,Ii,bi,Pi,ir))?!1:(or.crossVectors(Xn,Yn),t=[or.x,or.y,or.z],Is(t,Ii,bi,Pi,ir))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(In),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const In=[new q,new q,new q,new q,new q,new q,new q,new q],dn=new q,nr=new zo,Ii=new q,bi=new q,Pi=new q,Xn=new q,Yn=new q,ci=new q,To=new q,ir=new q,or=new q,ui=new q;function Is(n,e,t,i,o){for(let r=0,s=n.length-3;r<=s;r+=3){ui.fromArray(n,r);const a=o.x*Math.abs(ui.x)+o.y*Math.abs(ui.y)+o.z*Math.abs(ui.z),u=e.dot(ui),c=t.dot(ui),f=i.dot(ui);if(Math.max(-Math.max(u,c,f),Math.min(u,c,f))>a)return!1}return!0}const mE=new zo,xo=new q,bs=new q;class as{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):mE.setFromPoints(e).getCenter(i);let o=0;for(let r=0,s=e.length;r<s;r++)o=Math.max(o,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xo.subVectors(e,this.center);const t=xo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),o=(i-this.radius)*.5;this.center.addScaledVector(xo,o/i),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xo.copy(e.center).add(bs)),this.expandByPoint(xo.copy(e.center).sub(bs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const bn=new q,Ps=new q,rr=new q,Jn=new q,Ds=new q,sr=new q,Ns=new q;class Kf{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=bn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bn.copy(this.origin).addScaledVector(this.direction,t),bn.distanceToSquared(e))}distanceSqToSegment(e,t,i,o){Ps.copy(e).add(t).multiplyScalar(.5),rr.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(Ps);const r=e.distanceTo(t)*.5,s=-this.direction.dot(rr),a=Jn.dot(this.direction),u=-Jn.dot(rr),c=Jn.lengthSq(),f=Math.abs(1-s*s);let h,p,m,S;if(f>0)if(h=s*u-a,p=s*a-u,S=r*f,h>=0)if(p>=-S)if(p<=S){const E=1/f;h*=E,p*=E,m=h*(h+s*p+2*a)+p*(s*h+p+2*u)+c}else p=r,h=Math.max(0,-(s*p+a)),m=-h*h+p*(p+2*u)+c;else p=-r,h=Math.max(0,-(s*p+a)),m=-h*h+p*(p+2*u)+c;else p<=-S?(h=Math.max(0,-(-s*r+a)),p=h>0?-r:Math.min(Math.max(-r,-u),r),m=-h*h+p*(p+2*u)+c):p<=S?(h=0,p=Math.min(Math.max(-r,-u),r),m=p*(p+2*u)+c):(h=Math.max(0,-(s*r+a)),p=h>0?r:Math.min(Math.max(-r,-u),r),m=-h*h+p*(p+2*u)+c);else p=s>0?-r:r,h=Math.max(0,-(s*p+a)),m=-h*h+p*(p+2*u)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),o&&o.copy(Ps).addScaledVector(rr,p),m}intersectSphere(e,t){bn.subVectors(e.center,this.origin);const i=bn.dot(this.direction),o=bn.dot(bn)-i*i,r=e.radius*e.radius;if(o>r)return null;const s=Math.sqrt(r-o),a=i-s,u=i+s;return u<0?null:a<0?this.at(u,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,o,r,s,a,u;const c=1/this.direction.x,f=1/this.direction.y,h=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,o=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,o=(e.min.x-p.x)*c),f>=0?(r=(e.min.y-p.y)*f,s=(e.max.y-p.y)*f):(r=(e.max.y-p.y)*f,s=(e.min.y-p.y)*f),i>s||r>o||((r>i||isNaN(i))&&(i=r),(s<o||isNaN(o))&&(o=s),h>=0?(a=(e.min.z-p.z)*h,u=(e.max.z-p.z)*h):(a=(e.max.z-p.z)*h,u=(e.min.z-p.z)*h),i>u||a>o)||((a>i||i!==i)&&(i=a),(u<o||o!==o)&&(o=u),o<0)?null:this.at(i>=0?i:o,t)}intersectsBox(e){return this.intersectBox(e,bn)!==null}intersectTriangle(e,t,i,o,r){Ds.subVectors(t,e),sr.subVectors(i,e),Ns.crossVectors(Ds,sr);let s=this.direction.dot(Ns),a;if(s>0){if(o)return null;a=1}else if(s<0)a=-1,s=-s;else return null;Jn.subVectors(this.origin,e);const u=a*this.direction.dot(sr.crossVectors(Jn,sr));if(u<0)return null;const c=a*this.direction.dot(Ds.cross(Jn));if(c<0||u+c>s)return null;const f=-a*Jn.dot(Ns);return f<0?null:this.at(f/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,i,o,r,s,a,u,c,f,h,p,m,S,E,_){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,o,r,s,a,u,c,f,h,p,m,S,E,_)}set(e,t,i,o,r,s,a,u,c,f,h,p,m,S,E,_){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=o,g[1]=r,g[5]=s,g[9]=a,g[13]=u,g[2]=c,g[6]=f,g[10]=h,g[14]=p,g[3]=m,g[7]=S,g[11]=E,g[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,o=1/Di.setFromMatrixColumn(e,0).length(),r=1/Di.setFromMatrixColumn(e,1).length(),s=1/Di.setFromMatrixColumn(e,2).length();return t[0]=i[0]*o,t[1]=i[1]*o,t[2]=i[2]*o,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,o=e.y,r=e.z,s=Math.cos(i),a=Math.sin(i),u=Math.cos(o),c=Math.sin(o),f=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const p=s*f,m=s*h,S=a*f,E=a*h;t[0]=u*f,t[4]=-u*h,t[8]=c,t[1]=m+S*c,t[5]=p-E*c,t[9]=-a*u,t[2]=E-p*c,t[6]=S+m*c,t[10]=s*u}else if(e.order==="YXZ"){const p=u*f,m=u*h,S=c*f,E=c*h;t[0]=p+E*a,t[4]=S*a-m,t[8]=s*c,t[1]=s*h,t[5]=s*f,t[9]=-a,t[2]=m*a-S,t[6]=E+p*a,t[10]=s*u}else if(e.order==="ZXY"){const p=u*f,m=u*h,S=c*f,E=c*h;t[0]=p-E*a,t[4]=-s*h,t[8]=S+m*a,t[1]=m+S*a,t[5]=s*f,t[9]=E-p*a,t[2]=-s*c,t[6]=a,t[10]=s*u}else if(e.order==="ZYX"){const p=s*f,m=s*h,S=a*f,E=a*h;t[0]=u*f,t[4]=S*c-m,t[8]=p*c+E,t[1]=u*h,t[5]=E*c+p,t[9]=m*c-S,t[2]=-c,t[6]=a*u,t[10]=s*u}else if(e.order==="YZX"){const p=s*u,m=s*c,S=a*u,E=a*c;t[0]=u*f,t[4]=E-p*h,t[8]=S*h+m,t[1]=h,t[5]=s*f,t[9]=-a*f,t[2]=-c*f,t[6]=m*h+S,t[10]=p-E*h}else if(e.order==="XZY"){const p=s*u,m=s*c,S=a*u,E=a*c;t[0]=u*f,t[4]=-h,t[8]=c*f,t[1]=p*h+E,t[5]=s*f,t[9]=m*h-S,t[2]=S*h-m,t[6]=a*f,t[10]=E*h+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gE,e,_E)}lookAt(e,t,i){const o=this.elements;return Jt.subVectors(e,t),Jt.lengthSq()===0&&(Jt.z=1),Jt.normalize(),Kn.crossVectors(i,Jt),Kn.lengthSq()===0&&(Math.abs(i.z)===1?Jt.x+=1e-4:Jt.z+=1e-4,Jt.normalize(),Kn.crossVectors(i,Jt)),Kn.normalize(),ar.crossVectors(Jt,Kn),o[0]=Kn.x,o[4]=ar.x,o[8]=Jt.x,o[1]=Kn.y,o[5]=ar.y,o[9]=Jt.y,o[2]=Kn.z,o[6]=ar.z,o[10]=Jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,r=this.elements,s=i[0],a=i[4],u=i[8],c=i[12],f=i[1],h=i[5],p=i[9],m=i[13],S=i[2],E=i[6],_=i[10],g=i[14],w=i[3],T=i[7],M=i[11],L=i[15],I=o[0],N=o[4],k=o[8],A=o[12],x=o[1],O=o[5],Y=o[9],$=o[13],j=o[2],ie=o[6],ee=o[10],re=o[14],J=o[3],pe=o[7],ve=o[11],Me=o[15];return r[0]=s*I+a*x+u*j+c*J,r[4]=s*N+a*O+u*ie+c*pe,r[8]=s*k+a*Y+u*ee+c*ve,r[12]=s*A+a*$+u*re+c*Me,r[1]=f*I+h*x+p*j+m*J,r[5]=f*N+h*O+p*ie+m*pe,r[9]=f*k+h*Y+p*ee+m*ve,r[13]=f*A+h*$+p*re+m*Me,r[2]=S*I+E*x+_*j+g*J,r[6]=S*N+E*O+_*ie+g*pe,r[10]=S*k+E*Y+_*ee+g*ve,r[14]=S*A+E*$+_*re+g*Me,r[3]=w*I+T*x+M*j+L*J,r[7]=w*N+T*O+M*ie+L*pe,r[11]=w*k+T*Y+M*ee+L*ve,r[15]=w*A+T*$+M*re+L*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],o=e[8],r=e[12],s=e[1],a=e[5],u=e[9],c=e[13],f=e[2],h=e[6],p=e[10],m=e[14],S=e[3],E=e[7],_=e[11],g=e[15];return S*(+r*u*h-o*c*h-r*a*p+i*c*p+o*a*m-i*u*m)+E*(+t*u*m-t*c*p+r*s*p-o*s*m+o*c*f-r*u*f)+_*(+t*c*h-t*a*m-r*s*h+i*s*m+r*a*f-i*c*f)+g*(-o*a*f-t*u*h+t*a*p+o*s*h-i*s*p+i*u*f)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],r=e[3],s=e[4],a=e[5],u=e[6],c=e[7],f=e[8],h=e[9],p=e[10],m=e[11],S=e[12],E=e[13],_=e[14],g=e[15],w=h*_*c-E*p*c+E*u*m-a*_*m-h*u*g+a*p*g,T=S*p*c-f*_*c-S*u*m+s*_*m+f*u*g-s*p*g,M=f*E*c-S*h*c+S*a*m-s*E*m-f*a*g+s*h*g,L=S*h*u-f*E*u-S*a*p+s*E*p+f*a*_-s*h*_,I=t*w+i*T+o*M+r*L;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/I;return e[0]=w*N,e[1]=(E*p*r-h*_*r-E*o*m+i*_*m+h*o*g-i*p*g)*N,e[2]=(a*_*r-E*u*r+E*o*c-i*_*c-a*o*g+i*u*g)*N,e[3]=(h*u*r-a*p*r-h*o*c+i*p*c+a*o*m-i*u*m)*N,e[4]=T*N,e[5]=(f*_*r-S*p*r+S*o*m-t*_*m-f*o*g+t*p*g)*N,e[6]=(S*u*r-s*_*r-S*o*c+t*_*c+s*o*g-t*u*g)*N,e[7]=(s*p*r-f*u*r+f*o*c-t*p*c-s*o*m+t*u*m)*N,e[8]=M*N,e[9]=(S*h*r-f*E*r-S*i*m+t*E*m+f*i*g-t*h*g)*N,e[10]=(s*E*r-S*a*r+S*i*c-t*E*c-s*i*g+t*a*g)*N,e[11]=(f*a*r-s*h*r-f*i*c+t*h*c+s*i*m-t*a*m)*N,e[12]=L*N,e[13]=(f*E*o-S*h*o+S*i*p-t*E*p-f*i*_+t*h*_)*N,e[14]=(S*a*o-s*E*o-S*i*u+t*E*u+s*i*_-t*a*_)*N,e[15]=(s*h*o-f*a*o+f*i*u-t*h*u-s*i*p+t*a*p)*N,this}scale(e){const t=this.elements,i=e.x,o=e.y,r=e.z;return t[0]*=i,t[4]*=o,t[8]*=r,t[1]*=i,t[5]*=o,t[9]*=r,t[2]*=i,t[6]*=o,t[10]*=r,t[3]*=i,t[7]*=o,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,o))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),o=Math.sin(t),r=1-i,s=e.x,a=e.y,u=e.z,c=r*s,f=r*a;return this.set(c*s+i,c*a-o*u,c*u+o*a,0,c*a+o*u,f*a+i,f*u-o*s,0,c*u-o*a,f*u+o*s,r*u*u+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,o,r,s){return this.set(1,i,r,0,e,1,s,0,t,o,1,0,0,0,0,1),this}compose(e,t,i){const o=this.elements,r=t._x,s=t._y,a=t._z,u=t._w,c=r+r,f=s+s,h=a+a,p=r*c,m=r*f,S=r*h,E=s*f,_=s*h,g=a*h,w=u*c,T=u*f,M=u*h,L=i.x,I=i.y,N=i.z;return o[0]=(1-(E+g))*L,o[1]=(m+M)*L,o[2]=(S-T)*L,o[3]=0,o[4]=(m-M)*I,o[5]=(1-(p+g))*I,o[6]=(_+w)*I,o[7]=0,o[8]=(S+T)*N,o[9]=(_-w)*N,o[10]=(1-(p+E))*N,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,i){const o=this.elements;let r=Di.set(o[0],o[1],o[2]).length();const s=Di.set(o[4],o[5],o[6]).length(),a=Di.set(o[8],o[9],o[10]).length();this.determinant()<0&&(r=-r),e.x=o[12],e.y=o[13],e.z=o[14],fn.copy(this);const c=1/r,f=1/s,h=1/a;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=f,fn.elements[5]*=f,fn.elements[6]*=f,fn.elements[8]*=h,fn.elements[9]*=h,fn.elements[10]*=h,t.setFromRotationMatrix(fn),i.x=r,i.y=s,i.z=a,this}makePerspective(e,t,i,o,r,s,a=Gn){const u=this.elements,c=2*r/(t-e),f=2*r/(i-o),h=(t+e)/(t-e),p=(i+o)/(i-o);let m,S;if(a===Gn)m=-(s+r)/(s-r),S=-2*s*r/(s-r);else if(a===Yr)m=-s/(s-r),S=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return u[0]=c,u[4]=0,u[8]=h,u[12]=0,u[1]=0,u[5]=f,u[9]=p,u[13]=0,u[2]=0,u[6]=0,u[10]=m,u[14]=S,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,i,o,r,s,a=Gn){const u=this.elements,c=1/(t-e),f=1/(i-o),h=1/(s-r),p=(t+e)*c,m=(i+o)*f;let S,E;if(a===Gn)S=(s+r)*h,E=-2*h;else if(a===Yr)S=r*h,E=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return u[0]=2*c,u[4]=0,u[8]=0,u[12]=-p,u[1]=0,u[5]=2*f,u[9]=0,u[13]=-m,u[2]=0,u[6]=0,u[10]=E,u[14]=-S,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<16;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Di=new q,fn=new yt,gE=new q(0,0,0),_E=new q(1,1,1),Kn=new q,ar=new q,Jt=new q,Vu=new yt,Hu=new co;class En{constructor(e=0,t=0,i=0,o=En.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,o=this._order){return this._x=e,this._y=t,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const o=e.elements,r=o[0],s=o[4],a=o[8],u=o[1],c=o[5],f=o[9],h=o[2],p=o[6],m=o[10];switch(t){case"XYZ":this._y=Math.asin(it(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-f,m),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-it(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(u,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(it(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(u,r));break;case"ZYX":this._y=Math.asin(-it(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(u,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(it(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-it(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-f,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Vu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hu.setFromEuler(this),this.setFromQuaternion(Hu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class Zf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let vE=0;const zu=new q,Ni=new co,Pn=new yt,lr=new q,Mo=new q,yE=new q,SE=new co,Wu=new q(1,0,0),qu=new q(0,1,0),$u=new q(0,0,1),Xu={type:"added"},EE={type:"removed"},Ui={type:"childadded",child:null},Us={type:"childremoved",child:null};class Wt extends lo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vE++}),this.uuid=Ho(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wt.DEFAULT_UP.clone();const e=new q,t=new En,i=new co,o=new q(1,1,1);function r(){i.setFromEuler(t,!1)}function s(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new yt},normalMatrix:{value:new Ke}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.premultiply(Ni),this}rotateX(e){return this.rotateOnAxis(Wu,e)}rotateY(e){return this.rotateOnAxis(qu,e)}rotateZ(e){return this.rotateOnAxis($u,e)}translateOnAxis(e,t){return zu.copy(e).applyQuaternion(this.quaternion),this.position.add(zu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wu,e)}translateY(e){return this.translateOnAxis(qu,e)}translateZ(e){return this.translateOnAxis($u,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?lr.copy(e):lr.set(e,t,i);const o=this.parent;this.updateWorldMatrix(!0,!1),Mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(Mo,lr,this.up):Pn.lookAt(lr,Mo,this.up),this.quaternion.setFromRotationMatrix(Pn),o&&(Pn.extractRotation(o.matrixWorld),Ni.setFromRotationMatrix(Pn),this.quaternion.premultiply(Ni.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xu),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(EE),Us.child=e,this.dispatchEvent(Us),Us.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xu),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,o=this.children.length;i<o;i++){const s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const o=this.children;for(let r=0,s=o.length;r<s;r++)o[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,e,yE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,SE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const o=this.children;for(let r=0,s=o.length;r<s;r++)o[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?{min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}:void 0,boundingSphere:a.boundingSphere?{radius:a.boundingSphere.radius,center:a.boundingSphere.center.toArray()}:void 0})),o.instanceInfo=this._instanceInfo.map(a=>({...a})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(e),o.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere={center:this.boundingSphere.center.toArray(),radius:this.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:this.boundingBox.min.toArray(),max:this.boundingBox.max.toArray()}));function r(a,u){return a[u.uuid]===void 0&&(a[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const u=a.shapes;if(Array.isArray(u))for(let c=0,f=u.length;c<f;c++){const h=u[c];r(e.shapes,h)}else r(e.shapes,u)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let u=0,c=this.material.length;u<c;u++)a.push(r(e.materials,this.material[u]));o.material=a}else o.material=r(e.materials,this.material);if(this.children.length>0){o.children=[];for(let a=0;a<this.children.length;a++)o.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let a=0;a<this.animations.length;a++){const u=this.animations[a];o.animations.push(r(e.animations,u))}}if(t){const a=s(e.geometries),u=s(e.materials),c=s(e.textures),f=s(e.images),h=s(e.shapes),p=s(e.skeletons),m=s(e.animations),S=s(e.nodes);a.length>0&&(i.geometries=a),u.length>0&&(i.materials=u),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),h.length>0&&(i.shapes=h),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),S.length>0&&(i.nodes=S)}return i.object=o,i;function s(a){const u=[];for(const c in a){const f=a[c];delete f.metadata,u.push(f)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const o=e.children[i];this.add(o.clone())}return this}}Wt.DEFAULT_UP=new q(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new q,Dn=new q,Ls=new q,Nn=new q,Li=new q,Fi=new q,Yu=new q,Fs=new q,Bs=new q,Os=new q,ks=new dt,Gs=new dt,Vs=new dt;class gn{constructor(e=new q,t=new q,i=new q){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,o){o.subVectors(i,t),hn.subVectors(e,t),o.cross(hn);const r=o.lengthSq();return r>0?o.multiplyScalar(1/Math.sqrt(r)):o.set(0,0,0)}static getBarycoord(e,t,i,o,r){hn.subVectors(o,t),Dn.subVectors(i,t),Ls.subVectors(e,t);const s=hn.dot(hn),a=hn.dot(Dn),u=hn.dot(Ls),c=Dn.dot(Dn),f=Dn.dot(Ls),h=s*c-a*a;if(h===0)return r.set(0,0,0),null;const p=1/h,m=(c*u-a*f)*p,S=(s*f-a*u)*p;return r.set(1-m-S,S,m)}static containsPoint(e,t,i,o){return this.getBarycoord(e,t,i,o,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(e,t,i,o,r,s,a,u){return this.getBarycoord(e,t,i,o,Nn)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(r,Nn.x),u.addScaledVector(s,Nn.y),u.addScaledVector(a,Nn.z),u)}static getInterpolatedAttribute(e,t,i,o,r,s){return ks.setScalar(0),Gs.setScalar(0),Vs.setScalar(0),ks.fromBufferAttribute(e,t),Gs.fromBufferAttribute(e,i),Vs.fromBufferAttribute(e,o),s.setScalar(0),s.addScaledVector(ks,r.x),s.addScaledVector(Gs,r.y),s.addScaledVector(Vs,r.z),s}static isFrontFacing(e,t,i,o){return hn.subVectors(i,t),Dn.subVectors(e,t),hn.cross(Dn).dot(o)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,o){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,i,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),hn.cross(Dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,o,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,i,o,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,o=this.b,r=this.c;let s,a;Li.subVectors(o,i),Fi.subVectors(r,i),Fs.subVectors(e,i);const u=Li.dot(Fs),c=Fi.dot(Fs);if(u<=0&&c<=0)return t.copy(i);Bs.subVectors(e,o);const f=Li.dot(Bs),h=Fi.dot(Bs);if(f>=0&&h<=f)return t.copy(o);const p=u*h-f*c;if(p<=0&&u>=0&&f<=0)return s=u/(u-f),t.copy(i).addScaledVector(Li,s);Os.subVectors(e,r);const m=Li.dot(Os),S=Fi.dot(Os);if(S>=0&&m<=S)return t.copy(r);const E=m*c-u*S;if(E<=0&&c>=0&&S<=0)return a=c/(c-S),t.copy(i).addScaledVector(Fi,a);const _=f*S-m*h;if(_<=0&&h-f>=0&&m-S>=0)return Yu.subVectors(r,o),a=(h-f)/(h-f+(m-S)),t.copy(o).addScaledVector(Yu,a);const g=1/(_+E+p);return s=E*g,a=p*g,t.copy(i).addScaledVector(Li,s).addScaledVector(Fi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Qf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},cr={h:0,s:0,l:0};function Hs(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class et{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.toWorkingColorSpace(this,t),this}setRGB(e,t,i,o=at.workingColorSpace){return this.r=e,this.g=t,this.b=i,at.toWorkingColorSpace(this,o),this}setHSL(e,t,i,o=at.workingColorSpace){if(e=oE(e,1),t=it(t,0,1),i=it(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,s=2*i-r;this.r=Hs(s,r,e+1/3),this.g=Hs(s,r,e),this.b=Hs(s,r,e-1/3)}return at.toWorkingColorSpace(this,o),this}setStyle(e,t=nn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=o[1],a=o[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=o[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const i=Qf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hn(e.r),this.g=Hn(e.g),this.b=Hn(e.b),this}copyLinearToSRGB(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return at.fromWorkingColorSpace(Ft.copy(this),e),Math.round(it(Ft.r*255,0,255))*65536+Math.round(it(Ft.g*255,0,255))*256+Math.round(it(Ft.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.fromWorkingColorSpace(Ft.copy(this),t);const i=Ft.r,o=Ft.g,r=Ft.b,s=Math.max(i,o,r),a=Math.min(i,o,r);let u,c;const f=(a+s)/2;if(a===s)u=0,c=0;else{const h=s-a;switch(c=f<=.5?h/(s+a):h/(2-s-a),s){case i:u=(o-r)/h+(o<r?6:0);break;case o:u=(r-i)/h+2;break;case r:u=(i-o)/h+4;break}u/=6}return e.h=u,e.s=c,e.l=f,e}getRGB(e,t=at.workingColorSpace){return at.fromWorkingColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=nn){at.fromWorkingColorSpace(Ft.copy(this),e);const t=Ft.r,i=Ft.g,o=Ft.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(e,t,i){return this.getHSL(Zn),this.setHSL(Zn.h+e,Zn.s+t,Zn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Zn),e.getHSL(cr);const i=As(Zn.h,cr.h,t),o=As(Zn.s,cr.s,t),r=As(Zn.l,cr.l,t);return this.setHSL(i,o,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,o=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*o,this.g=r[1]*t+r[4]*i+r[7]*o,this.b=r[2]*t+r[5]*i+r[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new et;et.NAMES=Qf;let TE=0;class uo extends lo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:TE++}),this.uuid=Ho(),this.name="",this.type="Material",this.blending=Ji,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=va,this.blendDst=ya,this.blendEquation=vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new et(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ji&&(i.blending=this.blending),this.side!==oi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==va&&(i.blendSrc=this.blendSrc),this.blendDst!==ya&&(i.blendDst=this.blendDst),this.blendEquation!==vi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(r){const s=[];for(const a in r){const u=r[a];delete u.metadata,s.push(u)}return s}if(t){const r=o(e.textures),s=o(e.images);r.length>0&&(i.textures=r),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const o=t.length;i=new Array(o);for(let r=0;r!==o;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Pl extends uo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Bf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const On=xE();function xE(){const n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),o=new Uint32Array(512);for(let u=0;u<256;++u){const c=u-127;c<-27?(i[u]=0,i[u|256]=32768,o[u]=24,o[u|256]=24):c<-14?(i[u]=1024>>-c-14,i[u|256]=1024>>-c-14|32768,o[u]=-c-1,o[u|256]=-c-1):c<=15?(i[u]=c+15<<10,i[u|256]=c+15<<10|32768,o[u]=13,o[u|256]=13):c<128?(i[u]=31744,i[u|256]=64512,o[u]=24,o[u|256]=24):(i[u]=31744,i[u|256]=64512,o[u]=13,o[u|256]=13)}const r=new Uint32Array(2048),s=new Uint32Array(64),a=new Uint32Array(64);for(let u=1;u<1024;++u){let c=u<<13,f=0;for(;(c&8388608)===0;)c<<=1,f-=8388608;c&=-8388609,f+=947912704,r[u]=c|f}for(let u=1024;u<2048;++u)r[u]=939524096+(u-1024<<13);for(let u=1;u<31;++u)s[u]=u<<23;s[31]=1199570944,s[32]=2147483648;for(let u=33;u<63;++u)s[u]=2147483648+(u-32<<23);s[63]=3347054592;for(let u=1;u<64;++u)u!==32&&(a[u]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:o,mantissaTable:r,exponentTable:s,offsetTable:a}}function ME(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=it(n,-65504,65504),On.floatView[0]=n;const e=On.uint32View[0],t=e>>23&511;return On.baseTable[t]+((e&8388607)>>On.shiftTable[t])}function AE(n){const e=n>>10;return On.uint32View[0]=On.mantissaTable[On.offsetTable[e]+(n&1023)]+On.exponentTable[e],On.floatView[0]}class Ju{static toHalfFloat(e){return ME(e)}static fromHalfFloat(e){return AE(e)}}const Tt=new q,ur=new We;let CE=0;class Sn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:CE++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Fu,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let o=0,r=this.itemSize;o<r;o++)this.array[e+o]=t.array[i+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ur.fromBufferAttribute(this,t),ur.applyMatrix3(e),this.setXY(t,ur.x,ur.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Eo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=$t(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Eo(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Eo(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Eo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Eo(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,o){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),o=$t(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this}setXYZW(e,t,i,o,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),o=$t(o,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fu&&(e.usage=this.usage),e}}class jf extends Sn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class eh extends Sn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ln extends Sn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let wE=0;const tn=new yt,zs=new Wt,Bi=new q,Kt=new zo,Ao=new zo,bt=new q;class xn extends lo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wE++}),this.uuid=Ho(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yf(e)?eh:jf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ke().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,i){return tn.makeTranslation(e,t,i),this.applyMatrix4(tn),this}scale(e,t,i){return tn.makeScale(e,t,i),this.applyMatrix4(tn),this}lookAt(e){return zs.lookAt(e),zs.updateMatrix(),this.applyMatrix4(zs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let o=0,r=e.length;o<r;o++){const s=e[o];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new ln(i,3))}else{const i=Math.min(e.length,t.count);for(let o=0;o<i;o++){const r=e[o];t.setXYZ(o,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,o=t.length;i<o;i++){const r=t[i];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new as);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){const i=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];Ao.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(Kt.min,Ao.min),Kt.expandByPoint(bt),bt.addVectors(Kt.max,Ao.max),Kt.expandByPoint(bt)):(Kt.expandByPoint(Ao.min),Kt.expandByPoint(Ao.max))}Kt.getCenter(i);let o=0;for(let r=0,s=e.count;r<s;r++)bt.fromBufferAttribute(e,r),o=Math.max(o,i.distanceToSquared(bt));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],u=this.morphTargetsRelative;for(let c=0,f=a.count;c<f;c++)bt.fromBufferAttribute(a,c),u&&(Bi.fromBufferAttribute(e,c),bt.add(Bi)),o=Math.max(o,i.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,o=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Sn(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),a=[],u=[];for(let k=0;k<i.count;k++)a[k]=new q,u[k]=new q;const c=new q,f=new q,h=new q,p=new We,m=new We,S=new We,E=new q,_=new q;function g(k,A,x){c.fromBufferAttribute(i,k),f.fromBufferAttribute(i,A),h.fromBufferAttribute(i,x),p.fromBufferAttribute(r,k),m.fromBufferAttribute(r,A),S.fromBufferAttribute(r,x),f.sub(c),h.sub(c),m.sub(p),S.sub(p);const O=1/(m.x*S.y-S.x*m.y);isFinite(O)&&(E.copy(f).multiplyScalar(S.y).addScaledVector(h,-m.y).multiplyScalar(O),_.copy(h).multiplyScalar(m.x).addScaledVector(f,-S.x).multiplyScalar(O),a[k].add(E),a[A].add(E),a[x].add(E),u[k].add(_),u[A].add(_),u[x].add(_))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let k=0,A=w.length;k<A;++k){const x=w[k],O=x.start,Y=x.count;for(let $=O,j=O+Y;$<j;$+=3)g(e.getX($+0),e.getX($+1),e.getX($+2))}const T=new q,M=new q,L=new q,I=new q;function N(k){L.fromBufferAttribute(o,k),I.copy(L);const A=a[k];T.copy(A),T.sub(L.multiplyScalar(L.dot(A))).normalize(),M.crossVectors(I,A);const O=M.dot(u[k])<0?-1:1;s.setXYZW(k,T.x,T.y,T.z,O)}for(let k=0,A=w.length;k<A;++k){const x=w[k],O=x.start,Y=x.count;for(let $=O,j=O+Y;$<j;$+=3)N(e.getX($+0)),N(e.getX($+1)),N(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Sn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const o=new q,r=new q,s=new q,a=new q,u=new q,c=new q,f=new q,h=new q;if(e)for(let p=0,m=e.count;p<m;p+=3){const S=e.getX(p+0),E=e.getX(p+1),_=e.getX(p+2);o.fromBufferAttribute(t,S),r.fromBufferAttribute(t,E),s.fromBufferAttribute(t,_),f.subVectors(s,r),h.subVectors(o,r),f.cross(h),a.fromBufferAttribute(i,S),u.fromBufferAttribute(i,E),c.fromBufferAttribute(i,_),a.add(f),u.add(f),c.add(f),i.setXYZ(S,a.x,a.y,a.z),i.setXYZ(E,u.x,u.y,u.z),i.setXYZ(_,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)o.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),s.fromBufferAttribute(t,p+2),f.subVectors(s,r),h.subVectors(o,r),f.cross(h),i.setXYZ(p+0,f.x,f.y,f.z),i.setXYZ(p+1,f.x,f.y,f.z),i.setXYZ(p+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,u){const c=a.array,f=a.itemSize,h=a.normalized,p=new c.constructor(u.length*f);let m=0,S=0;for(let E=0,_=u.length;E<_;E++){a.isInterleavedBufferAttribute?m=u[E]*a.data.stride+a.offset:m=u[E]*f;for(let g=0;g<f;g++)p[S++]=c[m++]}return new Sn(p,f,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new xn,i=this.index.array,o=this.attributes;for(const a in o){const u=o[a],c=e(u,i);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const u=[],c=r[a];for(let f=0,h=c.length;f<h;f++){const p=c[f],m=e(p,i);u.push(m)}t.morphAttributes[a]=u}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,u=s.length;a<u;a++){const c=s[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const c in u)u[c]!==void 0&&(e[c]=u[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const u in i){const c=i[u];e.data.attributes[u]=c.toJSON(e.data)}const o={};let r=!1;for(const u in this.morphAttributes){const c=this.morphAttributes[u],f=[];for(let h=0,p=c.length;h<p;h++){const m=c[h];f.push(m.toJSON(e.data))}f.length>0&&(o[u]=f,r=!0)}r&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const o=e.attributes;for(const c in o){const f=o[c];this.setAttribute(c,f.clone(t))}const r=e.morphAttributes;for(const c in r){const f=[],h=r[c];for(let p=0,m=h.length;p<m;p++)f.push(h[p].clone(t));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,f=s.length;c<f;c++){const h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ku=new yt,di=new Kf,dr=new as,Zu=new q,fr=new q,hr=new q,pr=new q,Ws=new q,mr=new q,Qu=new q,gr=new q;class an extends Wt{constructor(e=new xn,t=new Pl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=o.length;r<s;r++){const a=o[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,o=i.attributes.position,r=i.morphAttributes.position,s=i.morphTargetsRelative;t.fromBufferAttribute(o,e);const a=this.morphTargetInfluences;if(r&&a){mr.set(0,0,0);for(let u=0,c=r.length;u<c;u++){const f=a[u],h=r[u];f!==0&&(Ws.fromBufferAttribute(h,e),s?mr.addScaledVector(Ws,f):mr.addScaledVector(Ws.sub(t),f))}t.add(mr)}return t}raycast(e,t){const i=this.geometry,o=this.material,r=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),dr.copy(i.boundingSphere),dr.applyMatrix4(r),di.copy(e.ray).recast(e.near),!(dr.containsPoint(di.origin)===!1&&(di.intersectSphere(dr,Zu)===null||di.origin.distanceToSquared(Zu)>(e.far-e.near)**2))&&(Ku.copy(r).invert(),di.copy(e.ray).applyMatrix4(Ku),!(i.boundingBox!==null&&di.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,i){let o;const r=this.geometry,s=this.material,a=r.index,u=r.attributes.position,c=r.attributes.uv,f=r.attributes.uv1,h=r.attributes.normal,p=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(s))for(let S=0,E=p.length;S<E;S++){const _=p[S],g=s[_.materialIndex],w=Math.max(_.start,m.start),T=Math.min(a.count,Math.min(_.start+_.count,m.start+m.count));for(let M=w,L=T;M<L;M+=3){const I=a.getX(M),N=a.getX(M+1),k=a.getX(M+2);o=_r(this,g,e,i,c,f,h,I,N,k),o&&(o.faceIndex=Math.floor(M/3),o.face.materialIndex=_.materialIndex,t.push(o))}}else{const S=Math.max(0,m.start),E=Math.min(a.count,m.start+m.count);for(let _=S,g=E;_<g;_+=3){const w=a.getX(_),T=a.getX(_+1),M=a.getX(_+2);o=_r(this,s,e,i,c,f,h,w,T,M),o&&(o.faceIndex=Math.floor(_/3),t.push(o))}}else if(u!==void 0)if(Array.isArray(s))for(let S=0,E=p.length;S<E;S++){const _=p[S],g=s[_.materialIndex],w=Math.max(_.start,m.start),T=Math.min(u.count,Math.min(_.start+_.count,m.start+m.count));for(let M=w,L=T;M<L;M+=3){const I=M,N=M+1,k=M+2;o=_r(this,g,e,i,c,f,h,I,N,k),o&&(o.faceIndex=Math.floor(M/3),o.face.materialIndex=_.materialIndex,t.push(o))}}else{const S=Math.max(0,m.start),E=Math.min(u.count,m.start+m.count);for(let _=S,g=E;_<g;_+=3){const w=_,T=_+1,M=_+2;o=_r(this,s,e,i,c,f,h,w,T,M),o&&(o.faceIndex=Math.floor(_/3),t.push(o))}}}}function RE(n,e,t,i,o,r,s,a){let u;if(e.side===Ht?u=i.intersectTriangle(s,r,o,!0,a):u=i.intersectTriangle(o,r,s,e.side===oi,a),u===null)return null;gr.copy(a),gr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(gr);return c<t.near||c>t.far?null:{distance:c,point:gr.clone(),object:n}}function _r(n,e,t,i,o,r,s,a,u,c){n.getVertexPosition(a,fr),n.getVertexPosition(u,hr),n.getVertexPosition(c,pr);const f=RE(n,e,t,i,fr,hr,pr,Qu);if(f){const h=new q;gn.getBarycoord(Qu,fr,hr,pr,h),o&&(f.uv=gn.getInterpolatedAttribute(o,a,u,c,h,new We)),r&&(f.uv1=gn.getInterpolatedAttribute(r,a,u,c,h,new We)),s&&(f.normal=gn.getInterpolatedAttribute(s,a,u,c,h,new q),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const p={a,b:u,c,normal:new q,materialIndex:0};gn.getNormal(fr,hr,pr,p.normal),f.face=p,f.barycoord=h}return f}class Wo extends xn{constructor(e=1,t=1,i=1,o=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:o,heightSegments:r,depthSegments:s};const a=this;o=Math.floor(o),r=Math.floor(r),s=Math.floor(s);const u=[],c=[],f=[],h=[];let p=0,m=0;S("z","y","x",-1,-1,i,t,e,s,r,0),S("z","y","x",1,-1,i,t,-e,s,r,1),S("x","z","y",1,1,e,i,t,o,s,2),S("x","z","y",1,-1,e,i,-t,o,s,3),S("x","y","z",1,-1,e,t,i,o,r,4),S("x","y","z",-1,-1,e,t,-i,o,r,5),this.setIndex(u),this.setAttribute("position",new ln(c,3)),this.setAttribute("normal",new ln(f,3)),this.setAttribute("uv",new ln(h,2));function S(E,_,g,w,T,M,L,I,N,k,A){const x=M/N,O=L/k,Y=M/2,$=L/2,j=I/2,ie=N+1,ee=k+1;let re=0,J=0;const pe=new q;for(let ve=0;ve<ee;ve++){const Me=ve*O-$;for(let Be=0;Be<ie;Be++){const je=Be*x-Y;pe[E]=je*w,pe[_]=Me*T,pe[g]=j,c.push(pe.x,pe.y,pe.z),pe[E]=0,pe[_]=0,pe[g]=I>0?1:-1,f.push(pe.x,pe.y,pe.z),h.push(Be/N),h.push(1-ve/k),re+=1}}for(let ve=0;ve<k;ve++)for(let Me=0;Me<N;Me++){const Be=p+Me+ie*ve,je=p+Me+ie*(ve+1),te=p+(Me+1)+ie*(ve+1),me=p+(Me+1)+ie*ve;u.push(Be,je,me),u.push(je,te,me),J+=6}a.addGroup(m,J,A),m+=J,p+=re}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function no(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const o=n[t][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=o.clone():Array.isArray(o)?e[t][i]=o.slice():e[t][i]=o}}return e}function Ot(n){const e={};for(let t=0;t<n.length;t++){const i=no(n[t]);for(const o in i)e[o]=i[o]}return e}function IE(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function th(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}const Kr={clone:no,merge:Ot};var bE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,PE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends uo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bE,this.fragmentShader=PE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=no(e.uniforms),this.uniformsGroups=IE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const s=this.uniforms[o].value;s&&s.isTexture?t.uniforms[o]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[o]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[o]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[o]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[o]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[o]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[o]={type:"m4",value:s.toArray()}:t.uniforms[o]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class nh extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Gn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new q,ju=new We,ed=new We;class Zt extends nh{constructor(e=50,t=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=il*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return il*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,ju,ed),t.subVectors(ed,ju)}setViewOffset(e,t,i,o,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ms*.5*this.fov)/this.zoom,i=2*t,o=this.aspect*i,r=-.5*o;const s=this.view;if(this.view!==null&&this.view.enabled){const u=s.fullWidth,c=s.fullHeight;r+=s.offsetX*o/u,t-=s.offsetY*i/c,o*=s.width/u,i*=s.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+o,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Oi=-90,ki=1;class DE extends Wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new Zt(Oi,ki,e,t);o.layers=this.layers,this.add(o);const r=new Zt(Oi,ki,e,t);r.layers=this.layers,this.add(r);const s=new Zt(Oi,ki,e,t);s.layers=this.layers,this.add(s);const a=new Zt(Oi,ki,e,t);a.layers=this.layers,this.add(a);const u=new Zt(Oi,ki,e,t);u.layers=this.layers,this.add(u);const c=new Zt(Oi,ki,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,o,r,s,a,u]=t;for(const c of t)this.remove(c);if(e===Gn)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===Yr)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,u,c,f]=this.children,h=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),S=e.xr.enabled;e.xr.enabled=!1;const E=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,o),e.render(t,r),e.setRenderTarget(i,1,o),e.render(t,s),e.setRenderTarget(i,2,o),e.render(t,a),e.setRenderTarget(i,3,o),e.render(t,u),e.setRenderTarget(i,4,o),e.render(t,c),i.texture.generateMipmaps=E,e.setRenderTarget(i,5,o),e.render(t,f),e.setRenderTarget(h,p,m),e.xr.enabled=S,i.texture.needsPMREMUpdate=!0}}class ih extends zt{constructor(e=[],t=eo,i,o,r,s,a,u,c,f){super(e,t,i,o,r,s,a,u,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class NE extends yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},o=[i,i,i,i,i,i];this.texture=new ih(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new Wo(5,5,5),r=new Vt({name:"CubemapFromEquirect",uniforms:no(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ht,blending:Vn});r.uniforms.tEquirect.value=t;const s=new an(o,r),a=t.minFilter;return t.minFilter===ti&&(t.minFilter=Gt),new DE(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,i=!0,o=!0){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,i,o);e.setRenderTarget(r)}}class vr extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const UE={type:"move"};class qs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let o=null,r=null,s=null;const a=this._targetRay,u=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const E of e.hand.values()){const _=t.getJointPose(E,i),g=this._getHandJoint(c,E);_!==null&&(g.matrix.fromArray(_.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=_.radius),g.visible=_!==null}const f=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],p=f.position.distanceTo(h.position),m=.02,S=.005;c.inputState.pinching&&p>m+S?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-S&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(u.matrix.fromArray(r.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,r.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(r.linearVelocity)):u.hasLinearVelocity=!1,r.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(r.angularVelocity)):u.hasAngularVelocity=!1));a!==null&&(o=t.getPose(e.targetRaySpace,i),o===null&&r!==null&&(o=r),o!==null&&(a.matrix.fromArray(o.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,o.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(o.linearVelocity)):a.hasLinearVelocity=!1,o.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(o.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(UE)))}return a!==null&&(a.visible=o!==null),u!==null&&(u.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new vr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class LE extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class FE extends zt{constructor(e=null,t=1,i=1,o,r,s,a,u,c=en,f=en,h,p){super(null,s,a,u,c,f,o,r,h,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $s=new q,BE=new q,OE=new Ke;class gi{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,o){return this.normal.set(e,t,i),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const o=$s.subVectors(i,t).cross(BE.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta($s),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/o;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||OE.getNormalMatrix(e),o=this.coplanarPoint($s).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new as,yr=new q;class Dl{constructor(e=new gi,t=new gi,i=new gi,o=new gi,r=new gi,s=new gi){this.planes=[e,t,i,o,r,s]}set(e,t,i,o,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(o),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Gn){const i=this.planes,o=e.elements,r=o[0],s=o[1],a=o[2],u=o[3],c=o[4],f=o[5],h=o[6],p=o[7],m=o[8],S=o[9],E=o[10],_=o[11],g=o[12],w=o[13],T=o[14],M=o[15];if(i[0].setComponents(u-r,p-c,_-m,M-g).normalize(),i[1].setComponents(u+r,p+c,_+m,M+g).normalize(),i[2].setComponents(u+s,p+f,_+S,M+w).normalize(),i[3].setComponents(u-s,p-f,_-S,M-w).normalize(),i[4].setComponents(u-a,p-h,_-E,M-T).normalize(),t===Gn)i[5].setComponents(u+a,p+h,_+E,M+T).normalize();else if(t===Yr)i[5].setComponents(a,h,E,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){return fi.center.set(0,0,0),fi.radius=.7071067811865476,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const t=this.planes,i=e.center,o=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const o=t[i];if(yr.x=o.normal.x>0?e.max.x:e.min.x,yr.y=o.normal.y>0?e.max.y:e.min.y,yr.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(yr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class oh extends uo{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const td=new yt,ol=new Kf,Sr=new as,Er=new q;class kE extends Wt{constructor(e=new xn,t=new oh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,o=this.matrixWorld,r=e.params.Points.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Sr.copy(i.boundingSphere),Sr.applyMatrix4(o),Sr.radius+=r,e.ray.intersectsSphere(Sr)===!1)return;td.copy(o).invert(),ol.copy(e.ray).applyMatrix4(td);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),u=a*a,c=i.index,h=i.attributes.position;if(c!==null){const p=Math.max(0,s.start),m=Math.min(c.count,s.start+s.count);for(let S=p,E=m;S<E;S++){const _=c.getX(S);Er.fromBufferAttribute(h,_),nd(Er,_,u,o,e,t,this)}}else{const p=Math.max(0,s.start),m=Math.min(h.count,s.start+s.count);for(let S=p,E=m;S<E;S++)Er.fromBufferAttribute(h,S),nd(Er,S,u,o,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=o.length;r<s;r++){const a=o[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function nd(n,e,t,i,o,r,s){const a=ol.distanceSqToPoint(n);if(a<t){const u=new q;ol.closestPointToPoint(n,u),u.applyMatrix4(i);const c=o.ray.origin.distanceTo(u);if(c<o.near||c>o.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:u,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class rh extends zt{constructor(e,t,i=xi,o,r,s,a=en,u=en,c,f=Oo){if(f!==Oo&&f!==ko)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,o,r,s,a,u,f,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Nl extends xn{constructor(e=[],t=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:o};const r=[],s=[];a(o),c(i),f(),this.setAttribute("position",new ln(r,3)),this.setAttribute("normal",new ln(r.slice(),3)),this.setAttribute("uv",new ln(s,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function a(w){const T=new q,M=new q,L=new q;for(let I=0;I<t.length;I+=3)m(t[I+0],T),m(t[I+1],M),m(t[I+2],L),u(T,M,L,w)}function u(w,T,M,L){const I=L+1,N=[];for(let k=0;k<=I;k++){N[k]=[];const A=w.clone().lerp(M,k/I),x=T.clone().lerp(M,k/I),O=I-k;for(let Y=0;Y<=O;Y++)Y===0&&k===I?N[k][Y]=A:N[k][Y]=A.clone().lerp(x,Y/O)}for(let k=0;k<I;k++)for(let A=0;A<2*(I-k)-1;A++){const x=Math.floor(A/2);A%2===0?(p(N[k][x+1]),p(N[k+1][x]),p(N[k][x])):(p(N[k][x+1]),p(N[k+1][x+1]),p(N[k+1][x]))}}function c(w){const T=new q;for(let M=0;M<r.length;M+=3)T.x=r[M+0],T.y=r[M+1],T.z=r[M+2],T.normalize().multiplyScalar(w),r[M+0]=T.x,r[M+1]=T.y,r[M+2]=T.z}function f(){const w=new q;for(let T=0;T<r.length;T+=3){w.x=r[T+0],w.y=r[T+1],w.z=r[T+2];const M=_(w)/2/Math.PI+.5,L=g(w)/Math.PI+.5;s.push(M,1-L)}S(),h()}function h(){for(let w=0;w<s.length;w+=6){const T=s[w+0],M=s[w+2],L=s[w+4],I=Math.max(T,M,L),N=Math.min(T,M,L);I>.9&&N<.1&&(T<.2&&(s[w+0]+=1),M<.2&&(s[w+2]+=1),L<.2&&(s[w+4]+=1))}}function p(w){r.push(w.x,w.y,w.z)}function m(w,T){const M=w*3;T.x=e[M+0],T.y=e[M+1],T.z=e[M+2]}function S(){const w=new q,T=new q,M=new q,L=new q,I=new We,N=new We,k=new We;for(let A=0,x=0;A<r.length;A+=9,x+=6){w.set(r[A+0],r[A+1],r[A+2]),T.set(r[A+3],r[A+4],r[A+5]),M.set(r[A+6],r[A+7],r[A+8]),I.set(s[x+0],s[x+1]),N.set(s[x+2],s[x+3]),k.set(s[x+4],s[x+5]),L.copy(w).add(T).add(M).divideScalar(3);const O=_(L);E(I,x+0,w,O),E(N,x+2,T,O),E(k,x+4,M,O)}}function E(w,T,M,L){L<0&&w.x===1&&(s[T]=w.x-1),M.x===0&&M.z===0&&(s[T]=L/2/Math.PI+.5)}function _(w){return Math.atan2(w.z,-w.x)}function g(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nl(e.vertices,e.indices,e.radius,e.details)}}class Zr extends Nl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,o=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(o,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zr(e.radius,e.detail)}}class ls extends xn{constructor(e=1,t=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:o};const r=e/2,s=t/2,a=Math.floor(i),u=Math.floor(o),c=a+1,f=u+1,h=e/a,p=t/u,m=[],S=[],E=[],_=[];for(let g=0;g<f;g++){const w=g*p-s;for(let T=0;T<c;T++){const M=T*h-r;S.push(M,-w,0),E.push(0,0,1),_.push(T/a),_.push(1-g/u)}}for(let g=0;g<u;g++)for(let w=0;w<a;w++){const T=w+c*g,M=w+c*(g+1),L=w+1+c*(g+1),I=w+1+c*g;m.push(T,M,I),m.push(M,L,I)}this.setIndex(m),this.setAttribute("position",new ln(S,3)),this.setAttribute("normal",new ln(E,3)),this.setAttribute("uv",new ln(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ls(e.width,e.height,e.widthSegments,e.heightSegments)}}class GE extends Vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class VE extends uo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$f,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class HE extends uo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=YS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class zE extends uo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const id={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class WE{constructor(e,t,i){const o=this;let r=!1,s=0,a=0,u;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(f){a++,r===!1&&o.onStart!==void 0&&o.onStart(f,s,a),r=!0},this.itemEnd=function(f){s++,o.onProgress!==void 0&&o.onProgress(f,s,a),s===a&&(r=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(f){o.onError!==void 0&&o.onError(f)},this.resolveURL=function(f){return u?u(f):f},this.setURLModifier=function(f){return u=f,this},this.addHandler=function(f,h){return c.push(f,h),this},this.removeHandler=function(f){const h=c.indexOf(f);return h!==-1&&c.splice(h,2),this},this.getHandler=function(f){for(let h=0,p=c.length;h<p;h+=2){const m=c[h],S=c[h+1];if(m.global&&(m.lastIndex=0),m.test(f))return S}return null}}}const qE=new WE;class Ul{constructor(e){this.manager=e!==void 0?e:qE,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(o,r){i.load(e,o,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ul.DEFAULT_MATERIAL_NAME="__DEFAULT";const Un={};class $E extends Error{constructor(e,t){super(e),this.response=t}}class XE extends Ul{constructor(e){super(e),this.mimeType="",this.responseType=""}load(e,t,i,o){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=id.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Un[e]!==void 0){Un[e].push({onLoad:t,onProgress:i,onError:o});return}Un[e]=[],Un[e].push({onLoad:t,onProgress:i,onError:o});const s=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,u=this.responseType;fetch(s).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const f=Un[e],h=c.body.getReader(),p=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),m=p?parseInt(p):0,S=m!==0;let E=0;const _=new ReadableStream({start(g){w();function w(){h.read().then(({done:T,value:M})=>{if(T)g.close();else{E+=M.byteLength;const L=new ProgressEvent("progress",{lengthComputable:S,loaded:E,total:m});for(let I=0,N=f.length;I<N;I++){const k=f[I];k.onProgress&&k.onProgress(L)}g.enqueue(M),w()}},T=>{g.error(T)})}}});return new Response(_)}else throw new $E(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(u){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(f=>new DOMParser().parseFromString(f,a));case"json":return c.json();default:if(a==="")return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),p=h&&h[1]?h[1].toLowerCase():void 0,m=new TextDecoder(p);return c.arrayBuffer().then(S=>m.decode(S))}}}).then(c=>{id.add(e,c);const f=Un[e];delete Un[e];for(let h=0,p=f.length;h<p;h++){const m=f[h];m.onLoad&&m.onLoad(c)}}).catch(c=>{const f=Un[e];if(f===void 0)throw this.manager.itemError(e),c;delete Un[e];for(let h=0,p=f.length;h<p;h++){const m=f[h];m.onError&&m.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class YE extends Ul{constructor(e){super(e)}load(e,t,i,o){const r=this,s=new FE,a=new XE(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(u){let c;try{c=r.parse(u)}catch(f){if(o!==void 0)o(f);else{console.error(f);return}}c.image!==void 0?s.image=c.image:c.data!==void 0&&(s.image.width=c.width,s.image.height=c.height,s.image.data=c.data),s.wrapS=c.wrapS!==void 0?c.wrapS:kn,s.wrapT=c.wrapT!==void 0?c.wrapT:kn,s.magFilter=c.magFilter!==void 0?c.magFilter:Gt,s.minFilter=c.minFilter!==void 0?c.minFilter:Gt,s.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(s.colorSpace=c.colorSpace),c.flipY!==void 0&&(s.flipY=c.flipY),c.format!==void 0&&(s.format=c.format),c.type!==void 0&&(s.type=c.type),c.mipmaps!==void 0&&(s.mipmaps=c.mipmaps,s.minFilter=ti),c.mipmapCount===1&&(s.minFilter=Gt),c.generateMipmaps!==void 0&&(s.generateMipmaps=c.generateMipmaps),s.needsUpdate=!0,t&&t(s,c)},i,o),s}}class sh extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new et(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Xs=new yt,od=new q,rd=new q;class JE{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.mapType=Cn,this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dl,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;od.setFromMatrixPosition(e.matrixWorld),t.position.copy(od),rd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(rd),t.updateMatrixWorld(),Xs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xs),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Xs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const sd=new yt,Co=new q,Ys=new q;class KE extends JE{constructor(){super(new Zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new We(4,2),this._viewportCount=6,this._viewports=[new dt(2,1,1,1),new dt(0,1,1,1),new dt(3,1,1,1),new dt(1,1,1,1),new dt(3,0,1,1),new dt(1,0,1,1)],this._cubeDirections=[new q(1,0,0),new q(-1,0,0),new q(0,0,1),new q(0,0,-1),new q(0,1,0),new q(0,-1,0)],this._cubeUps=[new q(0,1,0),new q(0,1,0),new q(0,1,0),new q(0,1,0),new q(0,0,1),new q(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,o=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Co.setFromMatrixPosition(e.matrixWorld),i.position.copy(Co),Ys.copy(i.position),Ys.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ys),i.updateMatrixWorld(),o.makeTranslation(-Co.x,-Co.y,-Co.z),sd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sd)}}class ad extends sh{constructor(e,t,i=0,o=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=o,this.shadow=new KE}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class ah extends nh{constructor(e=-1,t=1,i=1,o=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=o,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,o,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let r=i-e,s=i+e,a=o+t,u=o-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,a-=f*this.view.offsetY,u=a-f*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,u,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ZE extends sh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class QE extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class jE{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ld(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=ld();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function ld(){return performance.now()}function cd(n,e,t,i){const o=eT(i);switch(t){case Hf:return n*e;case Cl:return n*e/o.components*o.byteLength;case wl:return n*e/o.components*o.byteLength;case Wf:return n*e*2/o.components*o.byteLength;case Rl:return n*e*2/o.components*o.byteLength;case zf:return n*e*3/o.components*o.byteLength;case sn:return n*e*4/o.components*o.byteLength;case Il:return n*e*4/o.components*o.byteLength;case Ir:case br:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Pr:case Dr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Pa:case Na:return Math.max(n,16)*Math.max(e,8)/4;case ba:case Da:return Math.max(n,8)*Math.max(e,8)/2;case Ua:case La:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Fa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ba:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Oa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ka:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ga:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Va:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ha:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case za:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Wa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case qa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case $a:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Xa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ya:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ja:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ka:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Nr:case Za:case Qa:return Math.ceil(n/4)*Math.ceil(e/4)*16;case qf:case ja:return Math.ceil(n/4)*Math.ceil(e/4)*8;case el:case tl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function eT(n){switch(n){case Cn:case kf:return{byteLength:1,components:1};case Fo:case Gf:case jt:return{byteLength:2,components:1};case Ml:case Al:return{byteLength:2,components:4};case xi:case xl:case rn:return{byteLength:4,components:1};case Vf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tl);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function lh(){let n=null,e=!1,t=null,i=null;function o(r,s){t(r,s),i=n.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(o),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function tT(n){const e=new WeakMap;function t(a,u){const c=a.array,f=a.usage,h=c.byteLength,p=n.createBuffer();n.bindBuffer(u,p),n.bufferData(u,c,f),a.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,u,c){const f=u.array,h=u.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,f);else{h.sort((m,S)=>m.start-S.start);let p=0;for(let m=1;m<h.length;m++){const S=h[p],E=h[m];E.start<=S.start+S.count+1?S.count=Math.max(S.count,E.start+E.count-S.start):(++p,h[p]=E)}h.length=p+1;for(let m=0,S=h.length;m<S;m++){const E=h[m];n.bufferSubData(c,E.start*f.BYTES_PER_ELEMENT,f,E.start,E.count)}u.clearUpdateRanges()}u.onUploadCallback()}function o(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const u=e.get(a);u&&(n.deleteBuffer(u.buffer),e.delete(a))}function s(a,u){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const f=e.get(a);(!f||f.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,u));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,u),c.version=a.version}}return{get:o,remove:r,update:s}}var nT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iT=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,oT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,aT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lT=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,uT=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,dT=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fT=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hT=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pT=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mT=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gT=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,_T=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,vT=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yT=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ST=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ET=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,TT=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xT=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,MT=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,AT=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,CT=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,wT=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,RT=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,IT=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bT=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,PT=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,DT="gl_FragColor = linearToOutputTexel( gl_FragColor );",NT=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,UT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,LT=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,FT=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,BT=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kT=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,GT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,VT=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,HT=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zT=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,WT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$T=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,XT=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,YT=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,JT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,KT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ZT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,QT=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ex=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ix=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ox=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ax=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ux=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,px=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_x=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ax=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ix=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Px=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Dx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Nx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ux=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ox=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,zx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$x=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Jx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Kx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,eM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,dM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_M=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,SM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,TM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,MM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,CM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,RM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,PM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,NM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,UM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qe={alphahash_fragment:nT,alphahash_pars_fragment:iT,alphamap_fragment:oT,alphamap_pars_fragment:rT,alphatest_fragment:sT,alphatest_pars_fragment:aT,aomap_fragment:lT,aomap_pars_fragment:cT,batching_pars_vertex:uT,batching_vertex:dT,begin_vertex:fT,beginnormal_vertex:hT,bsdfs:pT,iridescence_fragment:mT,bumpmap_pars_fragment:gT,clipping_planes_fragment:_T,clipping_planes_pars_fragment:vT,clipping_planes_pars_vertex:yT,clipping_planes_vertex:ST,color_fragment:ET,color_pars_fragment:TT,color_pars_vertex:xT,color_vertex:MT,common:AT,cube_uv_reflection_fragment:CT,defaultnormal_vertex:wT,displacementmap_pars_vertex:RT,displacementmap_vertex:IT,emissivemap_fragment:bT,emissivemap_pars_fragment:PT,colorspace_fragment:DT,colorspace_pars_fragment:NT,envmap_fragment:UT,envmap_common_pars_fragment:LT,envmap_pars_fragment:FT,envmap_pars_vertex:BT,envmap_physical_pars_fragment:YT,envmap_vertex:OT,fog_vertex:kT,fog_pars_vertex:GT,fog_fragment:VT,fog_pars_fragment:HT,gradientmap_pars_fragment:zT,lightmap_pars_fragment:WT,lights_lambert_fragment:qT,lights_lambert_pars_fragment:$T,lights_pars_begin:XT,lights_toon_fragment:JT,lights_toon_pars_fragment:KT,lights_phong_fragment:ZT,lights_phong_pars_fragment:QT,lights_physical_fragment:jT,lights_physical_pars_fragment:ex,lights_fragment_begin:tx,lights_fragment_maps:nx,lights_fragment_end:ix,logdepthbuf_fragment:ox,logdepthbuf_pars_fragment:rx,logdepthbuf_pars_vertex:sx,logdepthbuf_vertex:ax,map_fragment:lx,map_pars_fragment:cx,map_particle_fragment:ux,map_particle_pars_fragment:dx,metalnessmap_fragment:fx,metalnessmap_pars_fragment:hx,morphinstance_vertex:px,morphcolor_vertex:mx,morphnormal_vertex:gx,morphtarget_pars_vertex:_x,morphtarget_vertex:vx,normal_fragment_begin:yx,normal_fragment_maps:Sx,normal_pars_fragment:Ex,normal_pars_vertex:Tx,normal_vertex:xx,normalmap_pars_fragment:Mx,clearcoat_normal_fragment_begin:Ax,clearcoat_normal_fragment_maps:Cx,clearcoat_pars_fragment:wx,iridescence_pars_fragment:Rx,opaque_fragment:Ix,packing:bx,premultiplied_alpha_fragment:Px,project_vertex:Dx,dithering_fragment:Nx,dithering_pars_fragment:Ux,roughnessmap_fragment:Lx,roughnessmap_pars_fragment:Fx,shadowmap_pars_fragment:Bx,shadowmap_pars_vertex:Ox,shadowmap_vertex:kx,shadowmask_pars_fragment:Gx,skinbase_vertex:Vx,skinning_pars_vertex:Hx,skinning_vertex:zx,skinnormal_vertex:Wx,specularmap_fragment:qx,specularmap_pars_fragment:$x,tonemapping_fragment:Xx,tonemapping_pars_fragment:Yx,transmission_fragment:Jx,transmission_pars_fragment:Kx,uv_pars_fragment:Zx,uv_pars_vertex:Qx,uv_vertex:jx,worldpos_vertex:eM,background_vert:tM,background_frag:nM,backgroundCube_vert:iM,backgroundCube_frag:oM,cube_vert:rM,cube_frag:sM,depth_vert:aM,depth_frag:lM,distanceRGBA_vert:cM,distanceRGBA_frag:uM,equirect_vert:dM,equirect_frag:fM,linedashed_vert:hM,linedashed_frag:pM,meshbasic_vert:mM,meshbasic_frag:gM,meshlambert_vert:_M,meshlambert_frag:vM,meshmatcap_vert:yM,meshmatcap_frag:SM,meshnormal_vert:EM,meshnormal_frag:TM,meshphong_vert:xM,meshphong_frag:MM,meshphysical_vert:AM,meshphysical_frag:CM,meshtoon_vert:wM,meshtoon_frag:RM,points_vert:IM,points_frag:bM,shadow_vert:PM,shadow_frag:DM,sprite_vert:NM,sprite_frag:UM},ye={common:{diffuse:{value:new et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new et(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},An={basic:{uniforms:Ot([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Ot([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new et(0)}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Ot([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new et(0)},specular:{value:new et(1118481)},shininess:{value:30}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Ot([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Ot([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new et(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Ot([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Ot([ye.points,ye.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Ot([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Ot([ye.common,ye.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Ot([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Ot([ye.sprite,ye.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distanceRGBA:{uniforms:Ot([ye.common,ye.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distanceRGBA_vert,fragmentShader:Qe.distanceRGBA_frag},shadow:{uniforms:Ot([ye.lights,ye.fog,{color:{value:new et(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};An.physical={uniforms:Ot([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new et(0)},specularColor:{value:new et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};const Tr={r:0,b:0,g:0},hi=new En,LM=new yt;function FM(n,e,t,i,o,r,s){const a=new et(0);let u=r===!0?0:1,c,f,h=null,p=0,m=null;function S(T){let M=T.isScene===!0?T.background:null;return M&&M.isTexture&&(M=(T.backgroundBlurriness>0?t:e).get(M)),M}function E(T){let M=!1;const L=S(T);L===null?g(a,u):L&&L.isColor&&(g(L,1),M=!0);const I=n.xr.getEnvironmentBlendMode();I==="additive"?i.buffers.color.setClear(0,0,0,1,s):I==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(T,M){const L=S(M);L&&(L.isCubeTexture||L.mapping===ss)?(f===void 0&&(f=new an(new Wo(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:no(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(I,N,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(f)),hi.copy(M.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),f.material.uniforms.envMap.value=L,f.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(LM.makeRotationFromEuler(hi)),f.material.toneMapped=at.getTransfer(L.colorSpace)!==ht,(h!==L||p!==L.version||m!==n.toneMapping)&&(f.material.needsUpdate=!0,h=L,p=L.version,m=n.toneMapping),f.layers.enableAll(),T.unshift(f,f.geometry,f.material,0,0,null)):L&&L.isTexture&&(c===void 0&&(c=new an(new ls(2,2),new Vt({name:"BackgroundMaterial",uniforms:no(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(c)),c.material.uniforms.t2D.value=L,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=at.getTransfer(L.colorSpace)!==ht,L.matrixAutoUpdate===!0&&L.updateMatrix(),c.material.uniforms.uvTransform.value.copy(L.matrix),(h!==L||p!==L.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,h=L,p=L.version,m=n.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function g(T,M){T.getRGB(Tr,th(n)),i.buffers.color.setClear(Tr.r,Tr.g,Tr.b,M,s)}function w(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(T,M=1){a.set(T),u=M,g(a,u)},getClearAlpha:function(){return u},setClearAlpha:function(T){u=T,g(a,u)},render:E,addToRenderList:_,dispose:w}}function BM(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},o=p(null);let r=o,s=!1;function a(x,O,Y,$,j){let ie=!1;const ee=h($,Y,O);r!==ee&&(r=ee,c(r.object)),ie=m(x,$,Y,j),ie&&S(x,$,Y,j),j!==null&&e.update(j,n.ELEMENT_ARRAY_BUFFER),(ie||s)&&(s=!1,M(x,O,Y,$),j!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function u(){return n.createVertexArray()}function c(x){return n.bindVertexArray(x)}function f(x){return n.deleteVertexArray(x)}function h(x,O,Y){const $=Y.wireframe===!0;let j=i[x.id];j===void 0&&(j={},i[x.id]=j);let ie=j[O.id];ie===void 0&&(ie={},j[O.id]=ie);let ee=ie[$];return ee===void 0&&(ee=p(u()),ie[$]=ee),ee}function p(x){const O=[],Y=[],$=[];for(let j=0;j<t;j++)O[j]=0,Y[j]=0,$[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:Y,attributeDivisors:$,object:x,attributes:{},index:null}}function m(x,O,Y,$){const j=r.attributes,ie=O.attributes;let ee=0;const re=Y.getAttributes();for(const J in re)if(re[J].location>=0){const ve=j[J];let Me=ie[J];if(Me===void 0&&(J==="instanceMatrix"&&x.instanceMatrix&&(Me=x.instanceMatrix),J==="instanceColor"&&x.instanceColor&&(Me=x.instanceColor)),ve===void 0||ve.attribute!==Me||Me&&ve.data!==Me.data)return!0;ee++}return r.attributesNum!==ee||r.index!==$}function S(x,O,Y,$){const j={},ie=O.attributes;let ee=0;const re=Y.getAttributes();for(const J in re)if(re[J].location>=0){let ve=ie[J];ve===void 0&&(J==="instanceMatrix"&&x.instanceMatrix&&(ve=x.instanceMatrix),J==="instanceColor"&&x.instanceColor&&(ve=x.instanceColor));const Me={};Me.attribute=ve,ve&&ve.data&&(Me.data=ve.data),j[J]=Me,ee++}r.attributes=j,r.attributesNum=ee,r.index=$}function E(){const x=r.newAttributes;for(let O=0,Y=x.length;O<Y;O++)x[O]=0}function _(x){g(x,0)}function g(x,O){const Y=r.newAttributes,$=r.enabledAttributes,j=r.attributeDivisors;Y[x]=1,$[x]===0&&(n.enableVertexAttribArray(x),$[x]=1),j[x]!==O&&(n.vertexAttribDivisor(x,O),j[x]=O)}function w(){const x=r.newAttributes,O=r.enabledAttributes;for(let Y=0,$=O.length;Y<$;Y++)O[Y]!==x[Y]&&(n.disableVertexAttribArray(Y),O[Y]=0)}function T(x,O,Y,$,j,ie,ee){ee===!0?n.vertexAttribIPointer(x,O,Y,j,ie):n.vertexAttribPointer(x,O,Y,$,j,ie)}function M(x,O,Y,$){E();const j=$.attributes,ie=Y.getAttributes(),ee=O.defaultAttributeValues;for(const re in ie){const J=ie[re];if(J.location>=0){let pe=j[re];if(pe===void 0&&(re==="instanceMatrix"&&x.instanceMatrix&&(pe=x.instanceMatrix),re==="instanceColor"&&x.instanceColor&&(pe=x.instanceColor)),pe!==void 0){const ve=pe.normalized,Me=pe.itemSize,Be=e.get(pe);if(Be===void 0)continue;const je=Be.buffer,te=Be.type,me=Be.bytesPerElement,ge=te===n.INT||te===n.UNSIGNED_INT||pe.gpuType===xl;if(pe.isInterleavedBufferAttribute){const _e=pe.data,Pe=_e.stride,tt=pe.offset;if(_e.isInstancedInterleavedBuffer){for(let He=0;He<J.locationSize;He++)g(J.location+He,_e.meshPerAttribute);x.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let He=0;He<J.locationSize;He++)_(J.location+He);n.bindBuffer(n.ARRAY_BUFFER,je);for(let He=0;He<J.locationSize;He++)T(J.location+He,Me/J.locationSize,te,ve,Pe*me,(tt+Me/J.locationSize*He)*me,ge)}else{if(pe.isInstancedBufferAttribute){for(let _e=0;_e<J.locationSize;_e++)g(J.location+_e,pe.meshPerAttribute);x.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let _e=0;_e<J.locationSize;_e++)_(J.location+_e);n.bindBuffer(n.ARRAY_BUFFER,je);for(let _e=0;_e<J.locationSize;_e++)T(J.location+_e,Me/J.locationSize,te,ve,Me*me,Me/J.locationSize*_e*me,ge)}}else if(ee!==void 0){const ve=ee[re];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(J.location,ve);break;case 3:n.vertexAttrib3fv(J.location,ve);break;case 4:n.vertexAttrib4fv(J.location,ve);break;default:n.vertexAttrib1fv(J.location,ve)}}}}w()}function L(){k();for(const x in i){const O=i[x];for(const Y in O){const $=O[Y];for(const j in $)f($[j].object),delete $[j];delete O[Y]}delete i[x]}}function I(x){if(i[x.id]===void 0)return;const O=i[x.id];for(const Y in O){const $=O[Y];for(const j in $)f($[j].object),delete $[j];delete O[Y]}delete i[x.id]}function N(x){for(const O in i){const Y=i[O];if(Y[x.id]===void 0)continue;const $=Y[x.id];for(const j in $)f($[j].object),delete $[j];delete Y[x.id]}}function k(){A(),s=!0,r!==o&&(r=o,c(r.object))}function A(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:a,reset:k,resetDefaultState:A,dispose:L,releaseStatesOfGeometry:I,releaseStatesOfProgram:N,initAttributes:E,enableAttribute:_,disableUnusedAttributes:w}}function OM(n,e,t){let i;function o(c){i=c}function r(c,f){n.drawArrays(i,c,f),t.update(f,i,1)}function s(c,f,h){h!==0&&(n.drawArraysInstanced(i,c,f,h),t.update(f,i,h))}function a(c,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,f,0,h);let m=0;for(let S=0;S<h;S++)m+=f[S];t.update(m,i,1)}function u(c,f,h,p){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let S=0;S<c.length;S++)s(c[S],f[S],p[S]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,f,0,p,0,h);let S=0;for(let E=0;E<h;E++)S+=f[E]*p[E];t.update(S,i,1)}}this.setMode=o,this.render=r,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=u}function kM(n,e,t,i){let o;function r(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const N=e.get("EXT_texture_filter_anisotropic");o=n.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function s(N){return!(N!==sn&&i.convert(N)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(N){const k=N===jt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(N!==Cn&&i.convert(N)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==rn&&!k)}function u(N){if(N==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const f=u(c);f!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const h=t.logarithmicDepthBuffer===!0,p=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),L=S>0,I=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:u,textureFormatReadable:s,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:p,maxTextures:m,maxVertexTextures:S,maxTextureSize:E,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:w,maxVaryings:T,maxFragmentUniforms:M,vertexTextures:L,maxSamples:I}}function GM(n){const e=this;let t=null,i=0,o=!1,r=!1;const s=new gi,a=new Ke,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(h,p){const m=h.length!==0||p||i!==0||o;return o=p,i=h.length,m},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,p){t=f(h,p,0)},this.setState=function(h,p,m){const S=h.clippingPlanes,E=h.clipIntersection,_=h.clipShadows,g=n.get(h);if(!o||S===null||S.length===0||r&&!_)r?f(null):c();else{const w=r?0:i,T=w*4;let M=g.clippingState||null;u.value=M,M=f(S,p,T,m);for(let L=0;L!==T;++L)M[L]=t[L];g.clippingState=M,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=w}};function c(){u.value!==t&&(u.value=t,u.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(h,p,m,S){const E=h!==null?h.length:0;let _=null;if(E!==0){if(_=u.value,S!==!0||_===null){const g=m+E*4,w=p.matrixWorldInverse;a.getNormalMatrix(w),(_===null||_.length<g)&&(_=new Float32Array(g));for(let T=0,M=m;T!==E;++T,M+=4)s.copy(h[T]).applyMatrix4(w,a),s.normal.toArray(_,M),_[M+3]=s.constant}u.value=_,u.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,_}}function VM(n){let e=new WeakMap;function t(s,a){return a===$r?s.mapping=eo:a===wa&&(s.mapping=to),s}function i(s){if(s&&s.isTexture){const a=s.mapping;if(a===$r||a===wa)if(e.has(s)){const u=e.get(s).texture;return t(u,s.mapping)}else{const u=s.image;if(u&&u.height>0){const c=new NE(u.height);return c.fromEquirectangularTexture(n,s),e.set(s,c),s.addEventListener("dispose",o),t(c.texture,s.mapping)}else return null}}return s}function o(s){const a=s.target;a.removeEventListener("dispose",o);const u=e.get(a);u!==void 0&&(e.delete(a),u.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Wi=4,ud=[.125,.215,.35,.446,.526,.582],yi=20,Js=new ah,dd=new et;let Ks=null,Zs=0,Qs=0,js=!1;const _i=(1+Math.sqrt(5))/2,Gi=1/_i,fd=[new q(-_i,Gi,0),new q(_i,Gi,0),new q(-Gi,0,_i),new q(Gi,0,_i),new q(0,_i,-Gi),new q(0,_i,Gi),new q(-1,1,-1),new q(1,1,-1),new q(-1,1,1),new q(1,1,1)],HM=new q;class rl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,o=100,r={}){const{size:s=256,position:a=HM}=r;Ks=this._renderer.getRenderTarget(),Zs=this._renderer.getActiveCubeFace(),Qs=this._renderer.getActiveMipmapLevel(),js=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,i,o,u,a),t>0&&this._blur(u,0,0,t),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=md(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ks,Zs,Qs),this._renderer.xr.enabled=js,e.scissorTest=!1,xr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===eo||e.mapping===to?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ks=this._renderer.getRenderTarget(),Zs=this._renderer.getActiveCubeFace(),Qs=this._renderer.getActiveMipmapLevel(),js=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:jt,format:sn,colorSpace:ri,depthBuffer:!1},o=hd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hd(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=zM(r)),this._blurMaterial=WM(r,e,t)}return o}_compileMaterial(e){const t=new an(this._lodPlanes[0],e);this._renderer.compile(t,Js)}_sceneToCubeUV(e,t,i,o,r){const u=new Zt(90,1,t,i),c=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],h=this._renderer,p=h.autoClear,m=h.toneMapping;h.getClearColor(dd),h.toneMapping=ii,h.autoClear=!1;const S=new Pl({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),E=new an(new Wo,S);let _=!1;const g=e.background;g?g.isColor&&(S.color.copy(g),e.background=null,_=!0):(S.color.copy(dd),_=!0);for(let w=0;w<6;w++){const T=w%3;T===0?(u.up.set(0,c[w],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x+f[w],r.y,r.z)):T===1?(u.up.set(0,0,c[w]),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y+f[w],r.z)):(u.up.set(0,c[w],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y,r.z+f[w]));const M=this._cubeSize;xr(o,T*M,w>2?M:0,M,M),h.setRenderTarget(o),_&&h.render(E,u),h.render(e,u)}E.geometry.dispose(),E.material.dispose(),h.toneMapping=m,h.autoClear=p,e.background=g}_textureToCubeUV(e,t){const i=this._renderer,o=e.mapping===eo||e.mapping===to;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=md()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pd());const r=o?this._cubemapMaterial:this._equirectMaterial,s=new an(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const u=this._cubeSize;xr(t,0,0,3*u,2*u),i.setRenderTarget(t),i.render(s,Js)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let r=1;r<o;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=fd[(o-r-1)%fd.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,o,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,i,o,"latitudinal",r),this._halfBlur(s,e,i,i,o,"longitudinal",r)}_halfBlur(e,t,i,o,r,s,a){const u=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,h=new an(this._lodPlanes[o],c),p=c.uniforms,m=this._sizeLods[i]-1,S=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*yi-1),E=r/S,_=isFinite(r)?1+Math.floor(f*E):yi;_>yi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${yi}`);const g=[];let w=0;for(let N=0;N<yi;++N){const k=N/E,A=Math.exp(-k*k/2);g.push(A),N===0?w+=A:N<_&&(w+=2*A)}for(let N=0;N<g.length;N++)g[N]=g[N]/w;p.envMap.value=e.texture,p.samples.value=_,p.weights.value=g,p.latitudinal.value=s==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:T}=this;p.dTheta.value=S,p.mipInt.value=T-i;const M=this._sizeLods[o],L=3*M*(o>T-Wi?o-T+Wi:0),I=4*(this._cubeSize-M);xr(t,L,I,3*M,2*M),u.setRenderTarget(t),u.render(h,Js)}}function zM(n){const e=[],t=[],i=[];let o=n;const r=n-Wi+1+ud.length;for(let s=0;s<r;s++){const a=Math.pow(2,o);t.push(a);let u=1/a;s>n-Wi?u=ud[s-n+Wi-1]:s===0&&(u=0),i.push(u);const c=1/(a-2),f=-c,h=1+c,p=[f,f,h,f,h,h,f,f,h,h,f,h],m=6,S=6,E=3,_=2,g=1,w=new Float32Array(E*S*m),T=new Float32Array(_*S*m),M=new Float32Array(g*S*m);for(let I=0;I<m;I++){const N=I%3*2/3-1,k=I>2?0:-1,A=[N,k,0,N+2/3,k,0,N+2/3,k+1,0,N,k,0,N+2/3,k+1,0,N,k+1,0];w.set(A,E*S*I),T.set(p,_*S*I);const x=[I,I,I,I,I,I];M.set(x,g*S*I)}const L=new xn;L.setAttribute("position",new Sn(w,E)),L.setAttribute("uv",new Sn(T,_)),L.setAttribute("faceIndex",new Sn(M,g)),e.push(L),o>Wi&&o--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function hd(n,e,t){const i=new yn(n,e,t);return i.texture.mapping=ss,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function xr(n,e,t,i,o){n.viewport.set(e,t,i,o),n.scissor.set(e,t,i,o)}function WM(n,e,t){const i=new Float32Array(yi),o=new q(0,1,0);return new Vt({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function pd(){return new Vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function md(){return new Vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Ll(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function qM(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const u=a.mapping,c=u===$r||u===wa,f=u===eo||u===to;if(c||f){let h=e.get(a);const p=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return t===null&&(t=new rl(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const m=a.image;return c&&m&&m.height>0||f&&m&&o(m)?(t===null&&(t=new rl(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function o(a){let u=0;const c=6;for(let f=0;f<c;f++)a[f]!==void 0&&u++;return u===c}function r(a){const u=a.target;u.removeEventListener("dispose",r);const c=e.get(u);c!==void 0&&(e.delete(u),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:s}}function $M(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let o;switch(i){case"WEBGL_depth_texture":o=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=n.getExtension(i)}return e[i]=o,o}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const o=t(i);return o===null&&Ur("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function XM(n,e,t,i){const o={},r=new WeakMap;function s(h){const p=h.target;p.index!==null&&e.remove(p.index);for(const S in p.attributes)e.remove(p.attributes[S]);p.removeEventListener("dispose",s),delete o[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(h,p){return o[p.id]===!0||(p.addEventListener("dispose",s),o[p.id]=!0,t.memory.geometries++),p}function u(h){const p=h.attributes;for(const m in p)e.update(p[m],n.ARRAY_BUFFER)}function c(h){const p=[],m=h.index,S=h.attributes.position;let E=0;if(m!==null){const w=m.array;E=m.version;for(let T=0,M=w.length;T<M;T+=3){const L=w[T+0],I=w[T+1],N=w[T+2];p.push(L,I,I,N,N,L)}}else if(S!==void 0){const w=S.array;E=S.version;for(let T=0,M=w.length/3-1;T<M;T+=3){const L=T+0,I=T+1,N=T+2;p.push(L,I,I,N,N,L)}}else return;const _=new(Yf(p)?eh:jf)(p,1);_.version=E;const g=r.get(h);g&&e.remove(g),r.set(h,_)}function f(h){const p=r.get(h);if(p){const m=h.index;m!==null&&p.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:u,getWireframeAttribute:f}}function YM(n,e,t){let i;function o(p){i=p}let r,s;function a(p){r=p.type,s=p.bytesPerElement}function u(p,m){n.drawElements(i,m,r,p*s),t.update(m,i,1)}function c(p,m,S){S!==0&&(n.drawElementsInstanced(i,m,r,p*s,S),t.update(m,i,S))}function f(p,m,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,p,0,S);let _=0;for(let g=0;g<S;g++)_+=m[g];t.update(_,i,1)}function h(p,m,S,E){if(S===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let g=0;g<p.length;g++)c(p[g]/s,m[g],E[g]);else{_.multiDrawElementsInstancedWEBGL(i,m,0,r,p,0,E,0,S);let g=0;for(let w=0;w<S;w++)g+=m[w]*E[w];t.update(g,i,1)}}this.setMode=o,this.setIndex=a,this.render=u,this.renderInstances=c,this.renderMultiDraw=f,this.renderMultiDrawInstances=h}function JM(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:i}}function KM(n,e,t){const i=new WeakMap,o=new dt;function r(s,a,u){const c=s.morphTargetInfluences,f=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=f!==void 0?f.length:0;let p=i.get(a);if(p===void 0||p.count!==h){let x=function(){k.dispose(),i.delete(a),a.removeEventListener("dispose",x)};var m=x;p!==void 0&&p.texture.dispose();const S=a.morphAttributes.position!==void 0,E=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],w=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let M=0;S===!0&&(M=1),E===!0&&(M=2),_===!0&&(M=3);let L=a.attributes.position.count*M,I=1;L>e.maxTextureSize&&(I=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const N=new Float32Array(L*I*4*h),k=new Jf(N,L,I,h);k.type=rn,k.needsUpdate=!0;const A=M*4;for(let O=0;O<h;O++){const Y=g[O],$=w[O],j=T[O],ie=L*I*4*O;for(let ee=0;ee<Y.count;ee++){const re=ee*A;S===!0&&(o.fromBufferAttribute(Y,ee),N[ie+re+0]=o.x,N[ie+re+1]=o.y,N[ie+re+2]=o.z,N[ie+re+3]=0),E===!0&&(o.fromBufferAttribute($,ee),N[ie+re+4]=o.x,N[ie+re+5]=o.y,N[ie+re+6]=o.z,N[ie+re+7]=0),_===!0&&(o.fromBufferAttribute(j,ee),N[ie+re+8]=o.x,N[ie+re+9]=o.y,N[ie+re+10]=o.z,N[ie+re+11]=j.itemSize===4?o.w:1)}}p={count:h,texture:k,size:new We(L,I)},i.set(a,p),a.addEventListener("dispose",x)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)u.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let S=0;for(let _=0;_<c.length;_++)S+=c[_];const E=a.morphTargetsRelative?1:1-S;u.getUniforms().setValue(n,"morphTargetBaseInfluence",E),u.getUniforms().setValue(n,"morphTargetInfluences",c)}u.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),u.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:r}}function ZM(n,e,t,i){let o=new WeakMap;function r(u){const c=i.render.frame,f=u.geometry,h=e.get(u,f);if(o.get(h)!==c&&(e.update(h),o.set(h,c)),u.isInstancedMesh&&(u.hasEventListener("dispose",a)===!1&&u.addEventListener("dispose",a),o.get(u)!==c&&(t.update(u.instanceMatrix,n.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,n.ARRAY_BUFFER),o.set(u,c))),u.isSkinnedMesh){const p=u.skeleton;o.get(p)!==c&&(p.update(),o.set(p,c))}return h}function s(){o=new WeakMap}function a(u){const c=u.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:s}}const ch=new zt,gd=new rh(1,1),uh=new Jf,dh=new pE,fh=new ih,_d=[],vd=[],yd=new Float32Array(16),Sd=new Float32Array(9),Ed=new Float32Array(4);function fo(n,e,t){const i=n[0];if(i<=0||i>0)return n;const o=e*t;let r=_d[o];if(r===void 0&&(r=new Float32Array(o),_d[o]=r),e!==0){i.toArray(r,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(r,a)}return r}function At(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ct(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function cs(n,e){let t=vd[e];t===void 0&&(t=new Int32Array(e),vd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function QM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function jM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2fv(this.addr,e),Ct(t,e)}}function eA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;n.uniform3fv(this.addr,e),Ct(t,e)}}function tA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4fv(this.addr,e),Ct(t,e)}}function nA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,i))return;Ed.set(i),n.uniformMatrix2fv(this.addr,!1,Ed),Ct(t,i)}}function iA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,i))return;Sd.set(i),n.uniformMatrix3fv(this.addr,!1,Sd),Ct(t,i)}}function oA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,i))return;yd.set(i),n.uniformMatrix4fv(this.addr,!1,yd),Ct(t,i)}}function rA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function sA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2iv(this.addr,e),Ct(t,e)}}function aA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3iv(this.addr,e),Ct(t,e)}}function lA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4iv(this.addr,e),Ct(t,e)}}function cA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function uA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2uiv(this.addr,e),Ct(t,e)}}function dA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3uiv(this.addr,e),Ct(t,e)}}function fA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4uiv(this.addr,e),Ct(t,e)}}function hA(n,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o);let r;this.type===n.SAMPLER_2D_SHADOW?(gd.compareFunction=Xf,r=gd):r=ch,t.setTexture2D(e||r,o)}function pA(n,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),t.setTexture3D(e||dh,o)}function mA(n,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),t.setTextureCube(e||fh,o)}function gA(n,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),t.setTexture2DArray(e||uh,o)}function _A(n){switch(n){case 5126:return QM;case 35664:return jM;case 35665:return eA;case 35666:return tA;case 35674:return nA;case 35675:return iA;case 35676:return oA;case 5124:case 35670:return rA;case 35667:case 35671:return sA;case 35668:case 35672:return aA;case 35669:case 35673:return lA;case 5125:return cA;case 36294:return uA;case 36295:return dA;case 36296:return fA;case 35678:case 36198:case 36298:case 36306:case 35682:return hA;case 35679:case 36299:case 36307:return pA;case 35680:case 36300:case 36308:case 36293:return mA;case 36289:case 36303:case 36311:case 36292:return gA}}function vA(n,e){n.uniform1fv(this.addr,e)}function yA(n,e){const t=fo(e,this.size,2);n.uniform2fv(this.addr,t)}function SA(n,e){const t=fo(e,this.size,3);n.uniform3fv(this.addr,t)}function EA(n,e){const t=fo(e,this.size,4);n.uniform4fv(this.addr,t)}function TA(n,e){const t=fo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function xA(n,e){const t=fo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function MA(n,e){const t=fo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function AA(n,e){n.uniform1iv(this.addr,e)}function CA(n,e){n.uniform2iv(this.addr,e)}function wA(n,e){n.uniform3iv(this.addr,e)}function RA(n,e){n.uniform4iv(this.addr,e)}function IA(n,e){n.uniform1uiv(this.addr,e)}function bA(n,e){n.uniform2uiv(this.addr,e)}function PA(n,e){n.uniform3uiv(this.addr,e)}function DA(n,e){n.uniform4uiv(this.addr,e)}function NA(n,e,t){const i=this.cache,o=e.length,r=cs(t,o);At(i,r)||(n.uniform1iv(this.addr,r),Ct(i,r));for(let s=0;s!==o;++s)t.setTexture2D(e[s]||ch,r[s])}function UA(n,e,t){const i=this.cache,o=e.length,r=cs(t,o);At(i,r)||(n.uniform1iv(this.addr,r),Ct(i,r));for(let s=0;s!==o;++s)t.setTexture3D(e[s]||dh,r[s])}function LA(n,e,t){const i=this.cache,o=e.length,r=cs(t,o);At(i,r)||(n.uniform1iv(this.addr,r),Ct(i,r));for(let s=0;s!==o;++s)t.setTextureCube(e[s]||fh,r[s])}function FA(n,e,t){const i=this.cache,o=e.length,r=cs(t,o);At(i,r)||(n.uniform1iv(this.addr,r),Ct(i,r));for(let s=0;s!==o;++s)t.setTexture2DArray(e[s]||uh,r[s])}function BA(n){switch(n){case 5126:return vA;case 35664:return yA;case 35665:return SA;case 35666:return EA;case 35674:return TA;case 35675:return xA;case 35676:return MA;case 5124:case 35670:return AA;case 35667:case 35671:return CA;case 35668:case 35672:return wA;case 35669:case 35673:return RA;case 5125:return IA;case 36294:return bA;case 36295:return PA;case 36296:return DA;case 35678:case 36198:case 36298:case 36306:case 35682:return NA;case 35679:case 36299:case 36307:return UA;case 35680:case 36300:case 36308:case 36293:return LA;case 36289:case 36303:case 36311:case 36292:return FA}}class OA{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=_A(t.type)}}class kA{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=BA(t.type)}}class GA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const o=this.seq;for(let r=0,s=o.length;r!==s;++r){const a=o[r];a.setValue(e,t[a.id],i)}}}const ea=/(\w+)(\])?(\[|\.)?/g;function Td(n,e){n.seq.push(e),n.map[e.id]=e}function VA(n,e,t){const i=n.name,o=i.length;for(ea.lastIndex=0;;){const r=ea.exec(i),s=ea.lastIndex;let a=r[1];const u=r[2]==="]",c=r[3];if(u&&(a=a|0),c===void 0||c==="["&&s+2===o){Td(t,c===void 0?new OA(a,n,e):new kA(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new GA(a),Td(t,h)),t=h}}}class Lr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const r=e.getActiveUniform(t,o),s=e.getUniformLocation(t,r.name);VA(r,s,this)}}setValue(e,t,i,o){const r=this.map[t];r!==void 0&&r.setValue(e,i,o)}setOptional(e,t,i){const o=t[i];o!==void 0&&this.setValue(e,i,o)}static upload(e,t,i,o){for(let r=0,s=t.length;r!==s;++r){const a=t[r],u=i[a.id];u.needsUpdate!==!1&&a.setValue(e,u.value,o)}}static seqWithValue(e,t){const i=[];for(let o=0,r=e.length;o!==r;++o){const s=e[o];s.id in t&&i.push(s)}return i}}function xd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const HA=37297;let zA=0;function WA(n,e){const t=n.split(`
`),i=[],o=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=o;s<r;s++){const a=s+1;i.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return i.join(`
`)}const Md=new Ke;function qA(n){at._getMatrix(Md,at.workingColorSpace,n);const e=`mat3( ${Md.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(n)){case Xr:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ad(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),o=n.getShaderInfoLog(e).trim();if(i&&o==="")return"";const r=/ERROR: 0:(\d+)/.exec(o);if(r){const s=parseInt(r[1]);return t.toUpperCase()+`

`+o+`

`+WA(n.getShaderSource(e),s)}else return o}function $A(n,e){const t=qA(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function XA(n,e){let t;switch(e){case GS:t="Linear";break;case VS:t="Reinhard";break;case HS:t="Cineon";break;case zS:t="ACESFilmic";break;case qS:t="AgX";break;case $S:t="Neutral";break;case WS:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Mr=new q;function YA(){at.getLuminanceCoefficients(Mr);const n=Mr.x.toFixed(4),e=Mr.y.toFixed(4),t=Mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function JA(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ro).join(`
`)}function KA(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ZA(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const r=n.getActiveAttrib(e,o),s=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[s]={type:r.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function Ro(n){return n!==""}function Cd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function wd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const QA=/^[ \t]*#include +<([\w\d./]+)>/gm;function sl(n){return n.replace(QA,eC)}const jA=new Map;function eC(n,e){let t=Qe[e];if(t===void 0){const i=jA.get(e);if(i!==void 0)t=Qe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return sl(t)}const tC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rd(n){return n.replace(tC,nC)}function nC(n,e,t,i){let o="";for(let r=parseInt(e);r<parseInt(t);r++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return o}function Id(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function iC(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ff?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===yS?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ln&&(e="SHADOWMAP_TYPE_VSM"),e}function oC(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case eo:case to:e="ENVMAP_TYPE_CUBE";break;case ss:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rC(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case to:e="ENVMAP_MODE_REFRACTION";break}return e}function sC(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Bf:e="ENVMAP_BLENDING_MULTIPLY";break;case OS:e="ENVMAP_BLENDING_MIX";break;case kS:e="ENVMAP_BLENDING_ADD";break}return e}function aC(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function lC(n,e,t,i){const o=n.getContext(),r=t.defines;let s=t.vertexShader,a=t.fragmentShader;const u=iC(t),c=oC(t),f=rC(t),h=sC(t),p=aC(t),m=JA(t),S=KA(r),E=o.createProgram();let _,g,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S].filter(Ro).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S].filter(Ro).join(`
`),g.length>0&&(g+=`
`)):(_=[Id(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ro).join(`
`),g=[Id(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+f:"",t.envMap?"#define "+h:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ii?"#define TONE_MAPPING":"",t.toneMapping!==ii?Qe.tonemapping_pars_fragment:"",t.toneMapping!==ii?XA("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,$A("linearToOutputTexel",t.outputColorSpace),YA(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ro).join(`
`)),s=sl(s),s=Cd(s,t),s=wd(s,t),a=sl(a),a=Cd(a,t),a=wd(a,t),s=Rd(s),a=Rd(a),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,_=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const T=w+_+s,M=w+g+a,L=xd(o,o.VERTEX_SHADER,T),I=xd(o,o.FRAGMENT_SHADER,M);o.attachShader(E,L),o.attachShader(E,I),t.index0AttributeName!==void 0?o.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(E,0,"position"),o.linkProgram(E);function N(O){if(n.debug.checkShaderErrors){const Y=o.getProgramInfoLog(E).trim(),$=o.getShaderInfoLog(L).trim(),j=o.getShaderInfoLog(I).trim();let ie=!0,ee=!0;if(o.getProgramParameter(E,o.LINK_STATUS)===!1)if(ie=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(o,E,L,I);else{const re=Ad(o,L,"vertex"),J=Ad(o,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(E,o.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+Y+`
`+re+`
`+J)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):($===""||j==="")&&(ee=!1);ee&&(O.diagnostics={runnable:ie,programLog:Y,vertexShader:{log:$,prefix:_},fragmentShader:{log:j,prefix:g}})}o.deleteShader(L),o.deleteShader(I),k=new Lr(o,E),A=ZA(o,E)}let k;this.getUniforms=function(){return k===void 0&&N(this),k};let A;this.getAttributes=function(){return A===void 0&&N(this),A};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=o.getProgramParameter(E,HA)),x},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=zA++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=L,this.fragmentShader=I,this}let cC=0;class uC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,o=this._getShaderStage(t),r=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(o)===!1&&(s.add(o),o.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new dC(e),t.set(e,i)),i}}class dC{constructor(e){this.id=cC++,this.code=e,this.usedTimes=0}}function fC(n,e,t,i,o,r,s){const a=new Zf,u=new uC,c=new Set,f=[],h=o.logarithmicDepthBuffer,p=o.vertexTextures;let m=o.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(A){return c.add(A),A===0?"uv":`uv${A}`}function _(A,x,O,Y,$){const j=Y.fog,ie=$.geometry,ee=A.isMeshStandardMaterial?Y.environment:null,re=(A.isMeshStandardMaterial?t:e).get(A.envMap||ee),J=re&&re.mapping===ss?re.image.height:null,pe=S[A.type];A.precision!==null&&(m=o.getMaxPrecision(A.precision),m!==A.precision&&console.warn("THREE.WebGLProgram.getParameters:",A.precision,"not supported, using",m,"instead."));const ve=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,Me=ve!==void 0?ve.length:0;let Be=0;ie.morphAttributes.position!==void 0&&(Be=1),ie.morphAttributes.normal!==void 0&&(Be=2),ie.morphAttributes.color!==void 0&&(Be=3);let je,te,me,ge;if(pe){const ct=An[pe];je=ct.vertexShader,te=ct.fragmentShader}else je=A.vertexShader,te=A.fragmentShader,u.update(A),me=u.getVertexShaderID(A),ge=u.getFragmentShaderID(A);const _e=n.getRenderTarget(),Pe=n.state.buffers.depth.getReversed(),tt=$.isInstancedMesh===!0,He=$.isBatchedMesh===!0,pt=!!A.map,ft=!!A.matcap,Ze=!!re,G=!!A.aoMap,Bt=!!A.lightMap,ot=!!A.bumpMap,nt=!!A.normalMap,Fe=!!A.displacementMap,mt=!!A.emissiveMap,Ue=!!A.metalnessMap,D=!!A.roughnessMap,C=A.anisotropy>0,X=A.clearcoat>0,se=A.dispersion>0,ue=A.iridescence>0,ne=A.sheen>0,De=A.transmission>0,Se=C&&!!A.anisotropyMap,Oe=X&&!!A.clearcoatMap,ze=X&&!!A.clearcoatNormalMap,fe=X&&!!A.clearcoatRoughnessMap,Ce=ue&&!!A.iridescenceMap,be=ue&&!!A.iridescenceThicknessMap,Ne=ne&&!!A.sheenColorMap,Ae=ne&&!!A.sheenRoughnessMap,$e=!!A.specularMap,ke=!!A.specularColorMap,Xe=!!A.specularIntensityMap,H=De&&!!A.transmissionMap,K=De&&!!A.thicknessMap,Q=!!A.gradientMap,le=!!A.alphaMap,xe=A.alphaTest>0,Te=!!A.alphaHash,Ye=!!A.extensions;let vt=ii;A.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(vt=n.toneMapping);const Rt={shaderID:pe,shaderType:A.type,shaderName:A.name,vertexShader:je,fragmentShader:te,defines:A.defines,customVertexShaderID:me,customFragmentShaderID:ge,isRawShaderMaterial:A.isRawShaderMaterial===!0,glslVersion:A.glslVersion,precision:m,batching:He,batchingColor:He&&$._colorsTexture!==null,instancing:tt,instancingColor:tt&&$.instanceColor!==null,instancingMorph:tt&&$.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:_e===null?n.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:ri,alphaToCoverage:!!A.alphaToCoverage,map:pt,matcap:ft,envMap:Ze,envMapMode:Ze&&re.mapping,envMapCubeUVHeight:J,aoMap:G,lightMap:Bt,bumpMap:ot,normalMap:nt,displacementMap:p&&Fe,emissiveMap:mt,normalMapObjectSpace:nt&&A.normalMapType===KS,normalMapTangentSpace:nt&&A.normalMapType===$f,metalnessMap:Ue,roughnessMap:D,anisotropy:C,anisotropyMap:Se,clearcoat:X,clearcoatMap:Oe,clearcoatNormalMap:ze,clearcoatRoughnessMap:fe,dispersion:se,iridescence:ue,iridescenceMap:Ce,iridescenceThicknessMap:be,sheen:ne,sheenColorMap:Ne,sheenRoughnessMap:Ae,specularMap:$e,specularColorMap:ke,specularIntensityMap:Xe,transmission:De,transmissionMap:H,thicknessMap:K,gradientMap:Q,opaque:A.transparent===!1&&A.blending===Ji&&A.alphaToCoverage===!1,alphaMap:le,alphaTest:xe,alphaHash:Te,combine:A.combine,mapUv:pt&&E(A.map.channel),aoMapUv:G&&E(A.aoMap.channel),lightMapUv:Bt&&E(A.lightMap.channel),bumpMapUv:ot&&E(A.bumpMap.channel),normalMapUv:nt&&E(A.normalMap.channel),displacementMapUv:Fe&&E(A.displacementMap.channel),emissiveMapUv:mt&&E(A.emissiveMap.channel),metalnessMapUv:Ue&&E(A.metalnessMap.channel),roughnessMapUv:D&&E(A.roughnessMap.channel),anisotropyMapUv:Se&&E(A.anisotropyMap.channel),clearcoatMapUv:Oe&&E(A.clearcoatMap.channel),clearcoatNormalMapUv:ze&&E(A.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&E(A.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&E(A.iridescenceMap.channel),iridescenceThicknessMapUv:be&&E(A.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&E(A.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&E(A.sheenRoughnessMap.channel),specularMapUv:$e&&E(A.specularMap.channel),specularColorMapUv:ke&&E(A.specularColorMap.channel),specularIntensityMapUv:Xe&&E(A.specularIntensityMap.channel),transmissionMapUv:H&&E(A.transmissionMap.channel),thicknessMapUv:K&&E(A.thicknessMap.channel),alphaMapUv:le&&E(A.alphaMap.channel),vertexTangents:!!ie.attributes.tangent&&(nt||C),vertexColors:A.vertexColors,vertexAlphas:A.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!ie.attributes.uv&&(pt||le),fog:!!j,useFog:A.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:A.flatShading===!0,sizeAttenuation:A.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Pe,skinning:$.isSkinnedMesh===!0,morphTargets:ie.morphAttributes.position!==void 0,morphNormals:ie.morphAttributes.normal!==void 0,morphColors:ie.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:Be,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:A.dithering,shadowMapEnabled:n.shadowMap.enabled&&O.length>0,shadowMapType:n.shadowMap.type,toneMapping:vt,decodeVideoTexture:pt&&A.map.isVideoTexture===!0&&at.getTransfer(A.map.colorSpace)===ht,decodeVideoTextureEmissive:mt&&A.emissiveMap.isVideoTexture===!0&&at.getTransfer(A.emissiveMap.colorSpace)===ht,premultipliedAlpha:A.premultipliedAlpha,doubleSided:A.side===Fn,flipSided:A.side===Ht,useDepthPacking:A.depthPacking>=0,depthPacking:A.depthPacking||0,index0AttributeName:A.index0AttributeName,extensionClipCullDistance:Ye&&A.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ye&&A.extensions.multiDraw===!0||He)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:A.customProgramCacheKey()};return Rt.vertexUv1s=c.has(1),Rt.vertexUv2s=c.has(2),Rt.vertexUv3s=c.has(3),c.clear(),Rt}function g(A){const x=[];if(A.shaderID?x.push(A.shaderID):(x.push(A.customVertexShaderID),x.push(A.customFragmentShaderID)),A.defines!==void 0)for(const O in A.defines)x.push(O),x.push(A.defines[O]);return A.isRawShaderMaterial===!1&&(w(x,A),T(x,A),x.push(n.outputColorSpace)),x.push(A.customProgramCacheKey),x.join()}function w(A,x){A.push(x.precision),A.push(x.outputColorSpace),A.push(x.envMapMode),A.push(x.envMapCubeUVHeight),A.push(x.mapUv),A.push(x.alphaMapUv),A.push(x.lightMapUv),A.push(x.aoMapUv),A.push(x.bumpMapUv),A.push(x.normalMapUv),A.push(x.displacementMapUv),A.push(x.emissiveMapUv),A.push(x.metalnessMapUv),A.push(x.roughnessMapUv),A.push(x.anisotropyMapUv),A.push(x.clearcoatMapUv),A.push(x.clearcoatNormalMapUv),A.push(x.clearcoatRoughnessMapUv),A.push(x.iridescenceMapUv),A.push(x.iridescenceThicknessMapUv),A.push(x.sheenColorMapUv),A.push(x.sheenRoughnessMapUv),A.push(x.specularMapUv),A.push(x.specularColorMapUv),A.push(x.specularIntensityMapUv),A.push(x.transmissionMapUv),A.push(x.thicknessMapUv),A.push(x.combine),A.push(x.fogExp2),A.push(x.sizeAttenuation),A.push(x.morphTargetsCount),A.push(x.morphAttributeCount),A.push(x.numDirLights),A.push(x.numPointLights),A.push(x.numSpotLights),A.push(x.numSpotLightMaps),A.push(x.numHemiLights),A.push(x.numRectAreaLights),A.push(x.numDirLightShadows),A.push(x.numPointLightShadows),A.push(x.numSpotLightShadows),A.push(x.numSpotLightShadowsWithMaps),A.push(x.numLightProbes),A.push(x.shadowMapType),A.push(x.toneMapping),A.push(x.numClippingPlanes),A.push(x.numClipIntersection),A.push(x.depthPacking)}function T(A,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),A.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),A.push(a.mask)}function M(A){const x=S[A.type];let O;if(x){const Y=An[x];O=Kr.clone(Y.uniforms)}else O=A.uniforms;return O}function L(A,x){let O;for(let Y=0,$=f.length;Y<$;Y++){const j=f[Y];if(j.cacheKey===x){O=j,++O.usedTimes;break}}return O===void 0&&(O=new lC(n,x,A,r),f.push(O)),O}function I(A){if(--A.usedTimes===0){const x=f.indexOf(A);f[x]=f[f.length-1],f.pop(),A.destroy()}}function N(A){u.remove(A)}function k(){u.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:M,acquireProgram:L,releaseProgram:I,releaseShaderCache:N,programs:f,dispose:k}}function hC(){let n=new WeakMap;function e(s){return n.has(s)}function t(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function i(s){n.delete(s)}function o(s,a,u){n.get(s)[a]=u}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:o,dispose:r}}function pC(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function bd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Pd(){const n=[];let e=0;const t=[],i=[],o=[];function r(){e=0,t.length=0,i.length=0,o.length=0}function s(h,p,m,S,E,_){let g=n[e];return g===void 0?(g={id:h.id,object:h,geometry:p,material:m,groupOrder:S,renderOrder:h.renderOrder,z:E,group:_},n[e]=g):(g.id=h.id,g.object=h,g.geometry=p,g.material=m,g.groupOrder=S,g.renderOrder=h.renderOrder,g.z=E,g.group=_),e++,g}function a(h,p,m,S,E,_){const g=s(h,p,m,S,E,_);m.transmission>0?i.push(g):m.transparent===!0?o.push(g):t.push(g)}function u(h,p,m,S,E,_){const g=s(h,p,m,S,E,_);m.transmission>0?i.unshift(g):m.transparent===!0?o.unshift(g):t.unshift(g)}function c(h,p){t.length>1&&t.sort(h||pC),i.length>1&&i.sort(p||bd),o.length>1&&o.sort(p||bd)}function f(){for(let h=e,p=n.length;h<p;h++){const m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:o,init:r,push:a,unshift:u,finish:f,sort:c}}function mC(){let n=new WeakMap;function e(i,o){const r=n.get(i);let s;return r===void 0?(s=new Pd,n.set(i,[s])):o>=r.length?(s=new Pd,r.push(s)):s=r[o],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function gC(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new q,color:new et};break;case"SpotLight":t={position:new q,direction:new q,color:new et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new et,groundColor:new et};break;case"RectAreaLight":t={color:new et,position:new q,halfWidth:new q,halfHeight:new q};break}return n[e.id]=t,t}}}function _C(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let vC=0;function yC(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function SC(n){const e=new gC,t=_C(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new q);const o=new q,r=new yt,s=new yt;function a(c){let f=0,h=0,p=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let m=0,S=0,E=0,_=0,g=0,w=0,T=0,M=0,L=0,I=0,N=0;c.sort(yC);for(let A=0,x=c.length;A<x;A++){const O=c[A],Y=O.color,$=O.intensity,j=O.distance,ie=O.shadow&&O.shadow.map?O.shadow.map.texture:null;if(O.isAmbientLight)f+=Y.r*$,h+=Y.g*$,p+=Y.b*$;else if(O.isLightProbe){for(let ee=0;ee<9;ee++)i.probe[ee].addScaledVector(O.sh.coefficients[ee],$);N++}else if(O.isDirectionalLight){const ee=e.get(O);if(ee.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){const re=O.shadow,J=t.get(O);J.shadowIntensity=re.intensity,J.shadowBias=re.bias,J.shadowNormalBias=re.normalBias,J.shadowRadius=re.radius,J.shadowMapSize=re.mapSize,i.directionalShadow[m]=J,i.directionalShadowMap[m]=ie,i.directionalShadowMatrix[m]=O.shadow.matrix,w++}i.directional[m]=ee,m++}else if(O.isSpotLight){const ee=e.get(O);ee.position.setFromMatrixPosition(O.matrixWorld),ee.color.copy(Y).multiplyScalar($),ee.distance=j,ee.coneCos=Math.cos(O.angle),ee.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),ee.decay=O.decay,i.spot[E]=ee;const re=O.shadow;if(O.map&&(i.spotLightMap[L]=O.map,L++,re.updateMatrices(O),O.castShadow&&I++),i.spotLightMatrix[E]=re.matrix,O.castShadow){const J=t.get(O);J.shadowIntensity=re.intensity,J.shadowBias=re.bias,J.shadowNormalBias=re.normalBias,J.shadowRadius=re.radius,J.shadowMapSize=re.mapSize,i.spotShadow[E]=J,i.spotShadowMap[E]=ie,M++}E++}else if(O.isRectAreaLight){const ee=e.get(O);ee.color.copy(Y).multiplyScalar($),ee.halfWidth.set(O.width*.5,0,0),ee.halfHeight.set(0,O.height*.5,0),i.rectArea[_]=ee,_++}else if(O.isPointLight){const ee=e.get(O);if(ee.color.copy(O.color).multiplyScalar(O.intensity),ee.distance=O.distance,ee.decay=O.decay,O.castShadow){const re=O.shadow,J=t.get(O);J.shadowIntensity=re.intensity,J.shadowBias=re.bias,J.shadowNormalBias=re.normalBias,J.shadowRadius=re.radius,J.shadowMapSize=re.mapSize,J.shadowCameraNear=re.camera.near,J.shadowCameraFar=re.camera.far,i.pointShadow[S]=J,i.pointShadowMap[S]=ie,i.pointShadowMatrix[S]=O.shadow.matrix,T++}i.point[S]=ee,S++}else if(O.isHemisphereLight){const ee=e.get(O);ee.skyColor.copy(O.color).multiplyScalar($),ee.groundColor.copy(O.groundColor).multiplyScalar($),i.hemi[g]=ee,g++}}_>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ye.LTC_FLOAT_1,i.rectAreaLTC2=ye.LTC_FLOAT_2):(i.rectAreaLTC1=ye.LTC_HALF_1,i.rectAreaLTC2=ye.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=h,i.ambient[2]=p;const k=i.hash;(k.directionalLength!==m||k.pointLength!==S||k.spotLength!==E||k.rectAreaLength!==_||k.hemiLength!==g||k.numDirectionalShadows!==w||k.numPointShadows!==T||k.numSpotShadows!==M||k.numSpotMaps!==L||k.numLightProbes!==N)&&(i.directional.length=m,i.spot.length=E,i.rectArea.length=_,i.point.length=S,i.hemi.length=g,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=M+L-I,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=N,k.directionalLength=m,k.pointLength=S,k.spotLength=E,k.rectAreaLength=_,k.hemiLength=g,k.numDirectionalShadows=w,k.numPointShadows=T,k.numSpotShadows=M,k.numSpotMaps=L,k.numLightProbes=N,i.version=vC++)}function u(c,f){let h=0,p=0,m=0,S=0,E=0;const _=f.matrixWorldInverse;for(let g=0,w=c.length;g<w;g++){const T=c[g];if(T.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(T.matrixWorld),o.setFromMatrixPosition(T.target.matrixWorld),M.direction.sub(o),M.direction.transformDirection(_),h++}else if(T.isSpotLight){const M=i.spot[m];M.position.setFromMatrixPosition(T.matrixWorld),M.position.applyMatrix4(_),M.direction.setFromMatrixPosition(T.matrixWorld),o.setFromMatrixPosition(T.target.matrixWorld),M.direction.sub(o),M.direction.transformDirection(_),m++}else if(T.isRectAreaLight){const M=i.rectArea[S];M.position.setFromMatrixPosition(T.matrixWorld),M.position.applyMatrix4(_),s.identity(),r.copy(T.matrixWorld),r.premultiply(_),s.extractRotation(r),M.halfWidth.set(T.width*.5,0,0),M.halfHeight.set(0,T.height*.5,0),M.halfWidth.applyMatrix4(s),M.halfHeight.applyMatrix4(s),S++}else if(T.isPointLight){const M=i.point[p];M.position.setFromMatrixPosition(T.matrixWorld),M.position.applyMatrix4(_),p++}else if(T.isHemisphereLight){const M=i.hemi[E];M.direction.setFromMatrixPosition(T.matrixWorld),M.direction.transformDirection(_),E++}}}return{setup:a,setupView:u,state:i}}function Dd(n){const e=new SC(n),t=[],i=[];function o(f){c.camera=f,t.length=0,i.length=0}function r(f){t.push(f)}function s(f){i.push(f)}function a(){e.setup(t)}function u(f){e.setupView(t,f)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:c,setupLights:a,setupLightsView:u,pushLight:r,pushShadow:s}}function EC(n){let e=new WeakMap;function t(o,r=0){const s=e.get(o);let a;return s===void 0?(a=new Dd(n),e.set(o,[a])):r>=s.length?(a=new Dd(n),s.push(a)):a=s[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const TC=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xC=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function MC(n,e,t){let i=new Dl;const o=new We,r=new We,s=new dt,a=new HE({depthPacking:JS}),u=new zE,c={},f=t.maxTextureSize,h={[oi]:Ht,[Ht]:oi,[Fn]:Fn},p=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:TC,fragmentShader:xC}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const S=new xn;S.setAttribute("position",new Sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new an(S,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ff;let g=this.type;this.render=function(I,N,k){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||I.length===0)return;const A=n.getRenderTarget(),x=n.getActiveCubeFace(),O=n.getActiveMipmapLevel(),Y=n.state;Y.setBlending(Vn),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const $=g!==Ln&&this.type===Ln,j=g===Ln&&this.type!==Ln;for(let ie=0,ee=I.length;ie<ee;ie++){const re=I[ie],J=re.shadow;if(J===void 0){console.warn("THREE.WebGLShadowMap:",re,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;o.copy(J.mapSize);const pe=J.getFrameExtents();if(o.multiply(pe),r.copy(J.mapSize),(o.x>f||o.y>f)&&(o.x>f&&(r.x=Math.floor(f/pe.x),o.x=r.x*pe.x,J.mapSize.x=r.x),o.y>f&&(r.y=Math.floor(f/pe.y),o.y=r.y*pe.y,J.mapSize.y=r.y)),J.map===null||$===!0||j===!0){const Me=this.type!==Ln?{minFilter:en,magFilter:en}:{};J.map!==null&&J.map.dispose(),J.map=new yn(o.x,o.y,Me),J.map.texture.name=re.name+".shadowMap",J.camera.updateProjectionMatrix()}n.setRenderTarget(J.map),n.clear();const ve=J.getViewportCount();for(let Me=0;Me<ve;Me++){const Be=J.getViewport(Me);s.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),Y.viewport(s),J.updateMatrices(re,Me),i=J.getFrustum(),M(N,k,J.camera,re,this.type)}J.isPointLightShadow!==!0&&this.type===Ln&&w(J,k),J.needsUpdate=!1}g=this.type,_.needsUpdate=!1,n.setRenderTarget(A,x,O)};function w(I,N){const k=e.update(E);p.defines.VSM_SAMPLES!==I.blurSamples&&(p.defines.VSM_SAMPLES=I.blurSamples,m.defines.VSM_SAMPLES=I.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new yn(o.x,o.y)),p.uniforms.shadow_pass.value=I.map.texture,p.uniforms.resolution.value=I.mapSize,p.uniforms.radius.value=I.radius,n.setRenderTarget(I.mapPass),n.clear(),n.renderBufferDirect(N,null,k,p,E,null),m.uniforms.shadow_pass.value=I.mapPass.texture,m.uniforms.resolution.value=I.mapSize,m.uniforms.radius.value=I.radius,n.setRenderTarget(I.map),n.clear(),n.renderBufferDirect(N,null,k,m,E,null)}function T(I,N,k,A){let x=null;const O=k.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(O!==void 0)x=O;else if(x=k.isPointLight===!0?u:a,n.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const Y=x.uuid,$=N.uuid;let j=c[Y];j===void 0&&(j={},c[Y]=j);let ie=j[$];ie===void 0&&(ie=x.clone(),j[$]=ie,N.addEventListener("dispose",L)),x=ie}if(x.visible=N.visible,x.wireframe=N.wireframe,A===Ln?x.side=N.shadowSide!==null?N.shadowSide:N.side:x.side=N.shadowSide!==null?N.shadowSide:h[N.side],x.alphaMap=N.alphaMap,x.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,x.map=N.map,x.clipShadows=N.clipShadows,x.clippingPlanes=N.clippingPlanes,x.clipIntersection=N.clipIntersection,x.displacementMap=N.displacementMap,x.displacementScale=N.displacementScale,x.displacementBias=N.displacementBias,x.wireframeLinewidth=N.wireframeLinewidth,x.linewidth=N.linewidth,k.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const Y=n.properties.get(x);Y.light=k}return x}function M(I,N,k,A,x){if(I.visible===!1)return;if(I.layers.test(N.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&x===Ln)&&(!I.frustumCulled||i.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,I.matrixWorld);const $=e.update(I),j=I.material;if(Array.isArray(j)){const ie=$.groups;for(let ee=0,re=ie.length;ee<re;ee++){const J=ie[ee],pe=j[J.materialIndex];if(pe&&pe.visible){const ve=T(I,pe,A,x);I.onBeforeShadow(n,I,N,k,$,ve,J),n.renderBufferDirect(k,null,$,ve,I,J),I.onAfterShadow(n,I,N,k,$,ve,J)}}}else if(j.visible){const ie=T(I,j,A,x);I.onBeforeShadow(n,I,N,k,$,ie,null),n.renderBufferDirect(k,null,$,ie,I,null),I.onAfterShadow(n,I,N,k,$,ie,null)}}const Y=I.children;for(let $=0,j=Y.length;$<j;$++)M(Y[$],N,k,A,x)}function L(I){I.target.removeEventListener("dispose",L);for(const k in c){const A=c[k],x=I.target.uuid;x in A&&(A[x].dispose(),delete A[x])}}}const AC={[Sa]:Ea,[Ta]:Aa,[xa]:Ca,[ji]:Ma,[Ea]:Sa,[Aa]:Ta,[Ca]:xa,[Ma]:ji};function CC(n,e){function t(){let H=!1;const K=new dt;let Q=null;const le=new dt(0,0,0,0);return{setMask:function(xe){Q!==xe&&!H&&(n.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){H=xe},setClear:function(xe,Te,Ye,vt,Rt){Rt===!0&&(xe*=vt,Te*=vt,Ye*=vt),K.set(xe,Te,Ye,vt),le.equals(K)===!1&&(n.clearColor(xe,Te,Ye,vt),le.copy(K))},reset:function(){H=!1,Q=null,le.set(-1,0,0,0)}}}function i(){let H=!1,K=!1,Q=null,le=null,xe=null;return{setReversed:function(Te){if(K!==Te){const Ye=e.get("EXT_clip_control");Te?Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.ZERO_TO_ONE_EXT):Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.NEGATIVE_ONE_TO_ONE_EXT),K=Te;const vt=xe;xe=null,this.setClear(vt)}},getReversed:function(){return K},setTest:function(Te){Te?_e(n.DEPTH_TEST):Pe(n.DEPTH_TEST)},setMask:function(Te){Q!==Te&&!H&&(n.depthMask(Te),Q=Te)},setFunc:function(Te){if(K&&(Te=AC[Te]),le!==Te){switch(Te){case Sa:n.depthFunc(n.NEVER);break;case Ea:n.depthFunc(n.ALWAYS);break;case Ta:n.depthFunc(n.LESS);break;case ji:n.depthFunc(n.LEQUAL);break;case xa:n.depthFunc(n.EQUAL);break;case Ma:n.depthFunc(n.GEQUAL);break;case Aa:n.depthFunc(n.GREATER);break;case Ca:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}le=Te}},setLocked:function(Te){H=Te},setClear:function(Te){xe!==Te&&(K&&(Te=1-Te),n.clearDepth(Te),xe=Te)},reset:function(){H=!1,Q=null,le=null,xe=null,K=!1}}}function o(){let H=!1,K=null,Q=null,le=null,xe=null,Te=null,Ye=null,vt=null,Rt=null;return{setTest:function(ct){H||(ct?_e(n.STENCIL_TEST):Pe(n.STENCIL_TEST))},setMask:function(ct){K!==ct&&!H&&(n.stencilMask(ct),K=ct)},setFunc:function(ct,Yt,un){(Q!==ct||le!==Yt||xe!==un)&&(n.stencilFunc(ct,Yt,un),Q=ct,le=Yt,xe=un)},setOp:function(ct,Yt,un){(Te!==ct||Ye!==Yt||vt!==un)&&(n.stencilOp(ct,Yt,un),Te=ct,Ye=Yt,vt=un)},setLocked:function(ct){H=ct},setClear:function(ct){Rt!==ct&&(n.clearStencil(ct),Rt=ct)},reset:function(){H=!1,K=null,Q=null,le=null,xe=null,Te=null,Ye=null,vt=null,Rt=null}}}const r=new t,s=new i,a=new o,u=new WeakMap,c=new WeakMap;let f={},h={},p=new WeakMap,m=[],S=null,E=!1,_=null,g=null,w=null,T=null,M=null,L=null,I=null,N=new et(0,0,0),k=0,A=!1,x=null,O=null,Y=null,$=null,j=null;const ie=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ee=!1,re=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(J)[1]),ee=re>=1):J.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),ee=re>=2);let pe=null,ve={};const Me=n.getParameter(n.SCISSOR_BOX),Be=n.getParameter(n.VIEWPORT),je=new dt().fromArray(Me),te=new dt().fromArray(Be);function me(H,K,Q,le){const xe=new Uint8Array(4),Te=n.createTexture();n.bindTexture(H,Te),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ye=0;Ye<Q;Ye++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(K,0,n.RGBA,1,1,le,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(K+Ye,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return Te}const ge={};ge[n.TEXTURE_2D]=me(n.TEXTURE_2D,n.TEXTURE_2D,1),ge[n.TEXTURE_CUBE_MAP]=me(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ge[n.TEXTURE_2D_ARRAY]=me(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ge[n.TEXTURE_3D]=me(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),_e(n.DEPTH_TEST),s.setFunc(ji),ot(!1),nt(Du),_e(n.CULL_FACE),G(Vn);function _e(H){f[H]!==!0&&(n.enable(H),f[H]=!0)}function Pe(H){f[H]!==!1&&(n.disable(H),f[H]=!1)}function tt(H,K){return h[H]!==K?(n.bindFramebuffer(H,K),h[H]=K,H===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=K),H===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=K),!0):!1}function He(H,K){let Q=m,le=!1;if(H){Q=p.get(K),Q===void 0&&(Q=[],p.set(K,Q));const xe=H.textures;if(Q.length!==xe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let Te=0,Ye=xe.length;Te<Ye;Te++)Q[Te]=n.COLOR_ATTACHMENT0+Te;Q.length=xe.length,le=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,le=!0);le&&n.drawBuffers(Q)}function pt(H){return S!==H?(n.useProgram(H),S=H,!0):!1}const ft={[vi]:n.FUNC_ADD,[ES]:n.FUNC_SUBTRACT,[TS]:n.FUNC_REVERSE_SUBTRACT};ft[xS]=n.MIN,ft[MS]=n.MAX;const Ze={[AS]:n.ZERO,[CS]:n.ONE,[wS]:n.SRC_COLOR,[va]:n.SRC_ALPHA,[NS]:n.SRC_ALPHA_SATURATE,[PS]:n.DST_COLOR,[IS]:n.DST_ALPHA,[RS]:n.ONE_MINUS_SRC_COLOR,[ya]:n.ONE_MINUS_SRC_ALPHA,[DS]:n.ONE_MINUS_DST_COLOR,[bS]:n.ONE_MINUS_DST_ALPHA,[US]:n.CONSTANT_COLOR,[LS]:n.ONE_MINUS_CONSTANT_COLOR,[FS]:n.CONSTANT_ALPHA,[BS]:n.ONE_MINUS_CONSTANT_ALPHA};function G(H,K,Q,le,xe,Te,Ye,vt,Rt,ct){if(H===Vn){E===!0&&(Pe(n.BLEND),E=!1);return}if(E===!1&&(_e(n.BLEND),E=!0),H!==SS){if(H!==_||ct!==A){if((g!==vi||M!==vi)&&(n.blendEquation(n.FUNC_ADD),g=vi,M=vi),ct)switch(H){case Ji:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qr:n.blendFunc(n.ONE,n.ONE);break;case Nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Ji:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}w=null,T=null,L=null,I=null,N.set(0,0,0),k=0,_=H,A=ct}return}xe=xe||K,Te=Te||Q,Ye=Ye||le,(K!==g||xe!==M)&&(n.blendEquationSeparate(ft[K],ft[xe]),g=K,M=xe),(Q!==w||le!==T||Te!==L||Ye!==I)&&(n.blendFuncSeparate(Ze[Q],Ze[le],Ze[Te],Ze[Ye]),w=Q,T=le,L=Te,I=Ye),(vt.equals(N)===!1||Rt!==k)&&(n.blendColor(vt.r,vt.g,vt.b,Rt),N.copy(vt),k=Rt),_=H,A=!1}function Bt(H,K){H.side===Fn?Pe(n.CULL_FACE):_e(n.CULL_FACE);let Q=H.side===Ht;K&&(Q=!Q),ot(Q),H.blending===Ji&&H.transparent===!1?G(Vn):G(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),s.setFunc(H.depthFunc),s.setTest(H.depthTest),s.setMask(H.depthWrite),r.setMask(H.colorWrite);const le=H.stencilWrite;a.setTest(le),le&&(a.setMask(H.stencilWriteMask),a.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),a.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),mt(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?_e(n.SAMPLE_ALPHA_TO_COVERAGE):Pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function ot(H){x!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),x=H)}function nt(H){H!==_S?(_e(n.CULL_FACE),H!==O&&(H===Du?n.cullFace(n.BACK):H===vS?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Pe(n.CULL_FACE),O=H}function Fe(H){H!==Y&&(ee&&n.lineWidth(H),Y=H)}function mt(H,K,Q){H?(_e(n.POLYGON_OFFSET_FILL),($!==K||j!==Q)&&(n.polygonOffset(K,Q),$=K,j=Q)):Pe(n.POLYGON_OFFSET_FILL)}function Ue(H){H?_e(n.SCISSOR_TEST):Pe(n.SCISSOR_TEST)}function D(H){H===void 0&&(H=n.TEXTURE0+ie-1),pe!==H&&(n.activeTexture(H),pe=H)}function C(H,K,Q){Q===void 0&&(pe===null?Q=n.TEXTURE0+ie-1:Q=pe);let le=ve[Q];le===void 0&&(le={type:void 0,texture:void 0},ve[Q]=le),(le.type!==H||le.texture!==K)&&(pe!==Q&&(n.activeTexture(Q),pe=Q),n.bindTexture(H,K||ge[H]),le.type=H,le.texture=K)}function X(){const H=ve[pe];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function se(){try{n.compressedTexImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ue(){try{n.compressedTexImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ne(){try{n.texSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function De(){try{n.texSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Se(){try{n.compressedTexSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Oe(){try{n.compressedTexSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ze(){try{n.texStorage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function fe(){try{n.texStorage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ce(){try{n.texImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function be(){try{n.texImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ne(H){je.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),je.copy(H))}function Ae(H){te.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),te.copy(H))}function $e(H,K){let Q=c.get(K);Q===void 0&&(Q=new WeakMap,c.set(K,Q));let le=Q.get(H);le===void 0&&(le=n.getUniformBlockIndex(K,H.name),Q.set(H,le))}function ke(H,K){const le=c.get(K).get(H);u.get(K)!==le&&(n.uniformBlockBinding(K,le,H.__bindingPointIndex),u.set(K,le))}function Xe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),s.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},pe=null,ve={},h={},p=new WeakMap,m=[],S=null,E=!1,_=null,g=null,w=null,T=null,M=null,L=null,I=null,N=new et(0,0,0),k=0,A=!1,x=null,O=null,Y=null,$=null,j=null,je.set(0,0,n.canvas.width,n.canvas.height),te.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:_e,disable:Pe,bindFramebuffer:tt,drawBuffers:He,useProgram:pt,setBlending:G,setMaterial:Bt,setFlipSided:ot,setCullFace:nt,setLineWidth:Fe,setPolygonOffset:mt,setScissorTest:Ue,activeTexture:D,bindTexture:C,unbindTexture:X,compressedTexImage2D:se,compressedTexImage3D:ue,texImage2D:Ce,texImage3D:be,updateUBOMapping:$e,uniformBlockBinding:ke,texStorage2D:ze,texStorage3D:fe,texSubImage2D:ne,texSubImage3D:De,compressedTexSubImage2D:Se,compressedTexSubImage3D:Oe,scissor:Ne,viewport:Ae,reset:Xe}}function wC(n,e,t,i,o,r,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,f=new WeakMap;let h;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(D,C){return m?new OffscreenCanvas(D,C):Jr("canvas")}function E(D,C,X){let se=1;const ue=Ue(D);if((ue.width>X||ue.height>X)&&(se=X/Math.max(ue.width,ue.height)),se<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ne=Math.floor(se*ue.width),De=Math.floor(se*ue.height);h===void 0&&(h=S(ne,De));const Se=C?S(ne,De):h;return Se.width=ne,Se.height=De,Se.getContext("2d").drawImage(D,0,0,ne,De),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ue.width+"x"+ue.height+") to ("+ne+"x"+De+")."),Se}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ue.width+"x"+ue.height+")."),D;return D}function _(D){return D.generateMipmaps}function g(D){n.generateMipmap(D)}function w(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function T(D,C,X,se,ue=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ne=C;if(C===n.RED&&(X===n.FLOAT&&(ne=n.R32F),X===n.HALF_FLOAT&&(ne=n.R16F),X===n.UNSIGNED_BYTE&&(ne=n.R8)),C===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(ne=n.R8UI),X===n.UNSIGNED_SHORT&&(ne=n.R16UI),X===n.UNSIGNED_INT&&(ne=n.R32UI),X===n.BYTE&&(ne=n.R8I),X===n.SHORT&&(ne=n.R16I),X===n.INT&&(ne=n.R32I)),C===n.RG&&(X===n.FLOAT&&(ne=n.RG32F),X===n.HALF_FLOAT&&(ne=n.RG16F),X===n.UNSIGNED_BYTE&&(ne=n.RG8)),C===n.RG_INTEGER&&(X===n.UNSIGNED_BYTE&&(ne=n.RG8UI),X===n.UNSIGNED_SHORT&&(ne=n.RG16UI),X===n.UNSIGNED_INT&&(ne=n.RG32UI),X===n.BYTE&&(ne=n.RG8I),X===n.SHORT&&(ne=n.RG16I),X===n.INT&&(ne=n.RG32I)),C===n.RGB_INTEGER&&(X===n.UNSIGNED_BYTE&&(ne=n.RGB8UI),X===n.UNSIGNED_SHORT&&(ne=n.RGB16UI),X===n.UNSIGNED_INT&&(ne=n.RGB32UI),X===n.BYTE&&(ne=n.RGB8I),X===n.SHORT&&(ne=n.RGB16I),X===n.INT&&(ne=n.RGB32I)),C===n.RGBA_INTEGER&&(X===n.UNSIGNED_BYTE&&(ne=n.RGBA8UI),X===n.UNSIGNED_SHORT&&(ne=n.RGBA16UI),X===n.UNSIGNED_INT&&(ne=n.RGBA32UI),X===n.BYTE&&(ne=n.RGBA8I),X===n.SHORT&&(ne=n.RGBA16I),X===n.INT&&(ne=n.RGBA32I)),C===n.RGB&&X===n.UNSIGNED_INT_5_9_9_9_REV&&(ne=n.RGB9_E5),C===n.RGBA){const De=ue?Xr:at.getTransfer(se);X===n.FLOAT&&(ne=n.RGBA32F),X===n.HALF_FLOAT&&(ne=n.RGBA16F),X===n.UNSIGNED_BYTE&&(ne=De===ht?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT_4_4_4_4&&(ne=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(ne=n.RGB5_A1)}return(ne===n.R16F||ne===n.R32F||ne===n.RG16F||ne===n.RG32F||ne===n.RGBA16F||ne===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function M(D,C){let X;return D?C===null||C===xi||C===Bo?X=n.DEPTH24_STENCIL8:C===rn?X=n.DEPTH32F_STENCIL8:C===Fo&&(X=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===xi||C===Bo?X=n.DEPTH_COMPONENT24:C===rn?X=n.DEPTH_COMPONENT32F:C===Fo&&(X=n.DEPTH_COMPONENT16),X}function L(D,C){return _(D)===!0||D.isFramebufferTexture&&D.minFilter!==en&&D.minFilter!==Gt?Math.log2(Math.max(C.width,C.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?C.mipmaps.length:1}function I(D){const C=D.target;C.removeEventListener("dispose",I),k(C),C.isVideoTexture&&f.delete(C)}function N(D){const C=D.target;C.removeEventListener("dispose",N),x(C)}function k(D){const C=i.get(D);if(C.__webglInit===void 0)return;const X=D.source,se=p.get(X);if(se){const ue=se[C.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&A(D),Object.keys(se).length===0&&p.delete(X)}i.remove(D)}function A(D){const C=i.get(D);n.deleteTexture(C.__webglTexture);const X=D.source,se=p.get(X);delete se[C.__cacheKey],s.memory.textures--}function x(D){const C=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(C.__webglFramebuffer[se]))for(let ue=0;ue<C.__webglFramebuffer[se].length;ue++)n.deleteFramebuffer(C.__webglFramebuffer[se][ue]);else n.deleteFramebuffer(C.__webglFramebuffer[se]);C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer[se])}else{if(Array.isArray(C.__webglFramebuffer))for(let se=0;se<C.__webglFramebuffer.length;se++)n.deleteFramebuffer(C.__webglFramebuffer[se]);else n.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&n.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let se=0;se<C.__webglColorRenderbuffer.length;se++)C.__webglColorRenderbuffer[se]&&n.deleteRenderbuffer(C.__webglColorRenderbuffer[se]);C.__webglDepthRenderbuffer&&n.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const X=D.textures;for(let se=0,ue=X.length;se<ue;se++){const ne=i.get(X[se]);ne.__webglTexture&&(n.deleteTexture(ne.__webglTexture),s.memory.textures--),i.remove(X[se])}i.remove(D)}let O=0;function Y(){O=0}function $(){const D=O;return D>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+o.maxTextures),O+=1,D}function j(D){const C=[];return C.push(D.wrapS),C.push(D.wrapT),C.push(D.wrapR||0),C.push(D.magFilter),C.push(D.minFilter),C.push(D.anisotropy),C.push(D.internalFormat),C.push(D.format),C.push(D.type),C.push(D.generateMipmaps),C.push(D.premultiplyAlpha),C.push(D.flipY),C.push(D.unpackAlignment),C.push(D.colorSpace),C.join()}function ie(D,C){const X=i.get(D);if(D.isVideoTexture&&Fe(D),D.isRenderTargetTexture===!1&&D.version>0&&X.__version!==D.version){const se=D.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(X,D,C);return}}t.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+C)}function ee(D,C){const X=i.get(D);if(D.version>0&&X.__version!==D.version){te(X,D,C);return}t.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+C)}function re(D,C){const X=i.get(D);if(D.version>0&&X.__version!==D.version){te(X,D,C);return}t.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+C)}function J(D,C){const X=i.get(D);if(D.version>0&&X.__version!==D.version){me(X,D,C);return}t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+C)}const pe={[Ra]:n.REPEAT,[kn]:n.CLAMP_TO_EDGE,[Ia]:n.MIRRORED_REPEAT},ve={[en]:n.NEAREST,[XS]:n.NEAREST_MIPMAP_NEAREST,[tr]:n.NEAREST_MIPMAP_LINEAR,[Gt]:n.LINEAR,[xs]:n.LINEAR_MIPMAP_NEAREST,[ti]:n.LINEAR_MIPMAP_LINEAR},Me={[ZS]:n.NEVER,[iE]:n.ALWAYS,[QS]:n.LESS,[Xf]:n.LEQUAL,[jS]:n.EQUAL,[nE]:n.GEQUAL,[eE]:n.GREATER,[tE]:n.NOTEQUAL};function Be(D,C){if(C.type===rn&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===Gt||C.magFilter===xs||C.magFilter===tr||C.magFilter===ti||C.minFilter===Gt||C.minFilter===xs||C.minFilter===tr||C.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,pe[C.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,pe[C.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,pe[C.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,ve[C.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,ve[C.minFilter]),C.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,Me[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===en||C.minFilter!==tr&&C.minFilter!==ti||C.type===rn&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,o.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function je(D,C){let X=!1;D.__webglInit===void 0&&(D.__webglInit=!0,C.addEventListener("dispose",I));const se=C.source;let ue=p.get(se);ue===void 0&&(ue={},p.set(se,ue));const ne=j(C);if(ne!==D.__cacheKey){ue[ne]===void 0&&(ue[ne]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,X=!0),ue[ne].usedTimes++;const De=ue[D.__cacheKey];De!==void 0&&(ue[D.__cacheKey].usedTimes--,De.usedTimes===0&&A(C)),D.__cacheKey=ne,D.__webglTexture=ue[ne].texture}return X}function te(D,C,X){let se=n.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(se=n.TEXTURE_2D_ARRAY),C.isData3DTexture&&(se=n.TEXTURE_3D);const ue=je(D,C),ne=C.source;t.bindTexture(se,D.__webglTexture,n.TEXTURE0+X);const De=i.get(ne);if(ne.version!==De.__version||ue===!0){t.activeTexture(n.TEXTURE0+X);const Se=at.getPrimaries(at.workingColorSpace),Oe=C.colorSpace===Bn?null:at.getPrimaries(C.colorSpace),ze=C.colorSpace===Bn||Se===Oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let fe=E(C.image,!1,o.maxTextureSize);fe=mt(C,fe);const Ce=r.convert(C.format,C.colorSpace),be=r.convert(C.type);let Ne=T(C.internalFormat,Ce,be,C.colorSpace,C.isVideoTexture);Be(se,C);let Ae;const $e=C.mipmaps,ke=C.isVideoTexture!==!0,Xe=De.__version===void 0||ue===!0,H=ne.dataReady,K=L(C,fe);if(C.isDepthTexture)Ne=M(C.format===ko,C.type),Xe&&(ke?t.texStorage2D(n.TEXTURE_2D,1,Ne,fe.width,fe.height):t.texImage2D(n.TEXTURE_2D,0,Ne,fe.width,fe.height,0,Ce,be,null));else if(C.isDataTexture)if($e.length>0){ke&&Xe&&t.texStorage2D(n.TEXTURE_2D,K,Ne,$e[0].width,$e[0].height);for(let Q=0,le=$e.length;Q<le;Q++)Ae=$e[Q],ke?H&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,Ae.width,Ae.height,Ce,be,Ae.data):t.texImage2D(n.TEXTURE_2D,Q,Ne,Ae.width,Ae.height,0,Ce,be,Ae.data);C.generateMipmaps=!1}else ke?(Xe&&t.texStorage2D(n.TEXTURE_2D,K,Ne,fe.width,fe.height),H&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe.width,fe.height,Ce,be,fe.data)):t.texImage2D(n.TEXTURE_2D,0,Ne,fe.width,fe.height,0,Ce,be,fe.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){ke&&Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,K,Ne,$e[0].width,$e[0].height,fe.depth);for(let Q=0,le=$e.length;Q<le;Q++)if(Ae=$e[Q],C.format!==sn)if(Ce!==null)if(ke){if(H)if(C.layerUpdates.size>0){const xe=cd(Ae.width,Ae.height,C.format,C.type);for(const Te of C.layerUpdates){const Ye=Ae.data.subarray(Te*xe/Ae.data.BYTES_PER_ELEMENT,(Te+1)*xe/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,Te,Ae.width,Ae.height,1,Ce,Ye)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,Ae.width,Ae.height,fe.depth,Ce,Ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,Ne,Ae.width,Ae.height,fe.depth,0,Ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?H&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,Ae.width,Ae.height,fe.depth,Ce,be,Ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,Ne,Ae.width,Ae.height,fe.depth,0,Ce,be,Ae.data)}else{ke&&Xe&&t.texStorage2D(n.TEXTURE_2D,K,Ne,$e[0].width,$e[0].height);for(let Q=0,le=$e.length;Q<le;Q++)Ae=$e[Q],C.format!==sn?Ce!==null?ke?H&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,Ae.width,Ae.height,Ce,Ae.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,Ne,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?H&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,Ae.width,Ae.height,Ce,be,Ae.data):t.texImage2D(n.TEXTURE_2D,Q,Ne,Ae.width,Ae.height,0,Ce,be,Ae.data)}else if(C.isDataArrayTexture)if(ke){if(Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,K,Ne,fe.width,fe.height,fe.depth),H)if(C.layerUpdates.size>0){const Q=cd(fe.width,fe.height,C.format,C.type);for(const le of C.layerUpdates){const xe=fe.data.subarray(le*Q/fe.data.BYTES_PER_ELEMENT,(le+1)*Q/fe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,le,fe.width,fe.height,1,Ce,be,xe)}C.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,fe.width,fe.height,fe.depth,Ce,be,fe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ne,fe.width,fe.height,fe.depth,0,Ce,be,fe.data);else if(C.isData3DTexture)ke?(Xe&&t.texStorage3D(n.TEXTURE_3D,K,Ne,fe.width,fe.height,fe.depth),H&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,fe.width,fe.height,fe.depth,Ce,be,fe.data)):t.texImage3D(n.TEXTURE_3D,0,Ne,fe.width,fe.height,fe.depth,0,Ce,be,fe.data);else if(C.isFramebufferTexture){if(Xe)if(ke)t.texStorage2D(n.TEXTURE_2D,K,Ne,fe.width,fe.height);else{let Q=fe.width,le=fe.height;for(let xe=0;xe<K;xe++)t.texImage2D(n.TEXTURE_2D,xe,Ne,Q,le,0,Ce,be,null),Q>>=1,le>>=1}}else if($e.length>0){if(ke&&Xe){const Q=Ue($e[0]);t.texStorage2D(n.TEXTURE_2D,K,Ne,Q.width,Q.height)}for(let Q=0,le=$e.length;Q<le;Q++)Ae=$e[Q],ke?H&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,Ce,be,Ae):t.texImage2D(n.TEXTURE_2D,Q,Ne,Ce,be,Ae);C.generateMipmaps=!1}else if(ke){if(Xe){const Q=Ue(fe);t.texStorage2D(n.TEXTURE_2D,K,Ne,Q.width,Q.height)}H&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ce,be,fe)}else t.texImage2D(n.TEXTURE_2D,0,Ne,Ce,be,fe);_(C)&&g(se),De.__version=ne.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function me(D,C,X){if(C.image.length!==6)return;const se=je(D,C),ue=C.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+X);const ne=i.get(ue);if(ue.version!==ne.__version||se===!0){t.activeTexture(n.TEXTURE0+X);const De=at.getPrimaries(at.workingColorSpace),Se=C.colorSpace===Bn?null:at.getPrimaries(C.colorSpace),Oe=C.colorSpace===Bn||De===Se?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);const ze=C.isCompressedTexture||C.image[0].isCompressedTexture,fe=C.image[0]&&C.image[0].isDataTexture,Ce=[];for(let le=0;le<6;le++)!ze&&!fe?Ce[le]=E(C.image[le],!0,o.maxCubemapSize):Ce[le]=fe?C.image[le].image:C.image[le],Ce[le]=mt(C,Ce[le]);const be=Ce[0],Ne=r.convert(C.format,C.colorSpace),Ae=r.convert(C.type),$e=T(C.internalFormat,Ne,Ae,C.colorSpace),ke=C.isVideoTexture!==!0,Xe=ne.__version===void 0||se===!0,H=ue.dataReady;let K=L(C,be);Be(n.TEXTURE_CUBE_MAP,C);let Q;if(ze){ke&&Xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,K,$e,be.width,be.height);for(let le=0;le<6;le++){Q=Ce[le].mipmaps;for(let xe=0;xe<Q.length;xe++){const Te=Q[xe];C.format!==sn?Ne!==null?ke?H&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe,0,0,Te.width,Te.height,Ne,Te.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe,$e,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?H&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe,0,0,Te.width,Te.height,Ne,Ae,Te.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe,$e,Te.width,Te.height,0,Ne,Ae,Te.data)}}}else{if(Q=C.mipmaps,ke&&Xe){Q.length>0&&K++;const le=Ue(Ce[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,K,$e,le.width,le.height)}for(let le=0;le<6;le++)if(fe){ke?H&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Ce[le].width,Ce[le].height,Ne,Ae,Ce[le].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,$e,Ce[le].width,Ce[le].height,0,Ne,Ae,Ce[le].data);for(let xe=0;xe<Q.length;xe++){const Ye=Q[xe].image[le].image;ke?H&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe+1,0,0,Ye.width,Ye.height,Ne,Ae,Ye.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe+1,$e,Ye.width,Ye.height,0,Ne,Ae,Ye.data)}}else{ke?H&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Ne,Ae,Ce[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,$e,Ne,Ae,Ce[le]);for(let xe=0;xe<Q.length;xe++){const Te=Q[xe];ke?H&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe+1,0,0,Ne,Ae,Te.image[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,xe+1,$e,Ne,Ae,Te.image[le])}}}_(C)&&g(n.TEXTURE_CUBE_MAP),ne.__version=ue.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function ge(D,C,X,se,ue,ne){const De=r.convert(X.format,X.colorSpace),Se=r.convert(X.type),Oe=T(X.internalFormat,De,Se,X.colorSpace),ze=i.get(C),fe=i.get(X);if(fe.__renderTarget=C,!ze.__hasExternalTextures){const Ce=Math.max(1,C.width>>ne),be=Math.max(1,C.height>>ne);ue===n.TEXTURE_3D||ue===n.TEXTURE_2D_ARRAY?t.texImage3D(ue,ne,Oe,Ce,be,C.depth,0,De,Se,null):t.texImage2D(ue,ne,Oe,Ce,be,0,De,Se,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),nt(C)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,ue,fe.__webglTexture,0,ot(C)):(ue===n.TEXTURE_2D||ue>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,se,ue,fe.__webglTexture,ne),t.bindFramebuffer(n.FRAMEBUFFER,null)}function _e(D,C,X){if(n.bindRenderbuffer(n.RENDERBUFFER,D),C.depthBuffer){const se=C.depthTexture,ue=se&&se.isDepthTexture?se.type:null,ne=M(C.stencilBuffer,ue),De=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Se=ot(C);nt(C)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Se,ne,C.width,C.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,Se,ne,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,ne,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,De,n.RENDERBUFFER,D)}else{const se=C.textures;for(let ue=0;ue<se.length;ue++){const ne=se[ue],De=r.convert(ne.format,ne.colorSpace),Se=r.convert(ne.type),Oe=T(ne.internalFormat,De,Se,ne.colorSpace),ze=ot(C);X&&nt(C)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ze,Oe,C.width,C.height):nt(C)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ze,Oe,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,Oe,C.width,C.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Pe(D,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const se=i.get(C.depthTexture);se.__renderTarget=C,(!se.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),ie(C.depthTexture,0);const ue=se.__webglTexture,ne=ot(C);if(C.depthTexture.format===Oo)nt(C)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ue,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ue,0);else if(C.depthTexture.format===ko)nt(C)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ue,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ue,0);else throw new Error("Unknown depthTexture format")}function tt(D){const C=i.get(D),X=D.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==D.depthTexture){const se=D.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),se){const ue=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,se.removeEventListener("dispose",ue)};se.addEventListener("dispose",ue),C.__depthDisposeCallback=ue}C.__boundDepthTexture=se}if(D.depthTexture&&!C.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");const se=D.texture.mipmaps;se&&se.length>0?Pe(C.__webglFramebuffer[0],D):Pe(C.__webglFramebuffer,D)}else if(X){C.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[se]),C.__webglDepthbuffer[se]===void 0)C.__webglDepthbuffer[se]=n.createRenderbuffer(),_e(C.__webglDepthbuffer[se],D,!1);else{const ue=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=C.__webglDepthbuffer[se];n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,ue,n.RENDERBUFFER,ne)}}else{const se=D.texture.mipmaps;if(se&&se.length>0?t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=n.createRenderbuffer(),_e(C.__webglDepthbuffer,D,!1);else{const ue=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=C.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,ue,n.RENDERBUFFER,ne)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function He(D,C,X){const se=i.get(D);C!==void 0&&ge(se.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&tt(D)}function pt(D){const C=D.texture,X=i.get(D),se=i.get(C);D.addEventListener("dispose",N);const ue=D.textures,ne=D.isWebGLCubeRenderTarget===!0,De=ue.length>1;if(De||(se.__webglTexture===void 0&&(se.__webglTexture=n.createTexture()),se.__version=C.version,s.memory.textures++),ne){X.__webglFramebuffer=[];for(let Se=0;Se<6;Se++)if(C.mipmaps&&C.mipmaps.length>0){X.__webglFramebuffer[Se]=[];for(let Oe=0;Oe<C.mipmaps.length;Oe++)X.__webglFramebuffer[Se][Oe]=n.createFramebuffer()}else X.__webglFramebuffer[Se]=n.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){X.__webglFramebuffer=[];for(let Se=0;Se<C.mipmaps.length;Se++)X.__webglFramebuffer[Se]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(De)for(let Se=0,Oe=ue.length;Se<Oe;Se++){const ze=i.get(ue[Se]);ze.__webglTexture===void 0&&(ze.__webglTexture=n.createTexture(),s.memory.textures++)}if(D.samples>0&&nt(D)===!1){X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let Se=0;Se<ue.length;Se++){const Oe=ue[Se];X.__webglColorRenderbuffer[Se]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[Se]);const ze=r.convert(Oe.format,Oe.colorSpace),fe=r.convert(Oe.type),Ce=T(Oe.internalFormat,ze,fe,Oe.colorSpace,D.isXRRenderTarget===!0),be=ot(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,be,Ce,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.RENDERBUFFER,X.__webglColorRenderbuffer[Se])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),_e(X.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,se.__webglTexture),Be(n.TEXTURE_CUBE_MAP,C);for(let Se=0;Se<6;Se++)if(C.mipmaps&&C.mipmaps.length>0)for(let Oe=0;Oe<C.mipmaps.length;Oe++)ge(X.__webglFramebuffer[Se][Oe],D,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Oe);else ge(X.__webglFramebuffer[Se],D,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0);_(C)&&g(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let Se=0,Oe=ue.length;Se<Oe;Se++){const ze=ue[Se],fe=i.get(ze);t.bindTexture(n.TEXTURE_2D,fe.__webglTexture),Be(n.TEXTURE_2D,ze),ge(X.__webglFramebuffer,D,ze,n.COLOR_ATTACHMENT0+Se,n.TEXTURE_2D,0),_(ze)&&g(n.TEXTURE_2D)}t.unbindTexture()}else{let Se=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Se=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Se,se.__webglTexture),Be(Se,C),C.mipmaps&&C.mipmaps.length>0)for(let Oe=0;Oe<C.mipmaps.length;Oe++)ge(X.__webglFramebuffer[Oe],D,C,n.COLOR_ATTACHMENT0,Se,Oe);else ge(X.__webglFramebuffer,D,C,n.COLOR_ATTACHMENT0,Se,0);_(C)&&g(Se),t.unbindTexture()}D.depthBuffer&&tt(D)}function ft(D){const C=D.textures;for(let X=0,se=C.length;X<se;X++){const ue=C[X];if(_(ue)){const ne=w(D),De=i.get(ue).__webglTexture;t.bindTexture(ne,De),g(ne),t.unbindTexture()}}}const Ze=[],G=[];function Bt(D){if(D.samples>0){if(nt(D)===!1){const C=D.textures,X=D.width,se=D.height;let ue=n.COLOR_BUFFER_BIT;const ne=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,De=i.get(D),Se=C.length>1;if(Se)for(let ze=0;ze<C.length;ze++)t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);const Oe=D.texture.mipmaps;Oe&&Oe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let ze=0;ze<C.length;ze++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ue|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ue|=n.STENCIL_BUFFER_BIT)),Se){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,De.__webglColorRenderbuffer[ze]);const fe=i.get(C[ze]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,fe,0)}n.blitFramebuffer(0,0,X,se,0,0,X,se,ue,n.NEAREST),u===!0&&(Ze.length=0,G.length=0,Ze.push(n.COLOR_ATTACHMENT0+ze),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Ze.push(ne),G.push(ne),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ze))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Se)for(let ze=0;ze<C.length;ze++){t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,De.__webglColorRenderbuffer[ze]);const fe=i.get(C[ze]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,fe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&u){const C=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[C])}}}function ot(D){return Math.min(o.maxSamples,D.samples)}function nt(D){const C=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Fe(D){const C=s.render.frame;f.get(D)!==C&&(f.set(D,C),D.update())}function mt(D,C){const X=D.colorSpace,se=D.format,ue=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||X!==ri&&X!==Bn&&(at.getTransfer(X)===ht?(se!==sn||ue!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),C}function Ue(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=Y,this.setTexture2D=ie,this.setTexture2DArray=ee,this.setTexture3D=re,this.setTextureCube=J,this.rebindTextures=He,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Bt,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=nt}function RC(n,e){function t(i,o=Bn){let r;const s=at.getTransfer(o);if(i===Cn)return n.UNSIGNED_BYTE;if(i===Ml)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Al)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Vf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===kf)return n.BYTE;if(i===Gf)return n.SHORT;if(i===Fo)return n.UNSIGNED_SHORT;if(i===xl)return n.INT;if(i===xi)return n.UNSIGNED_INT;if(i===rn)return n.FLOAT;if(i===jt)return n.HALF_FLOAT;if(i===Hf)return n.ALPHA;if(i===zf)return n.RGB;if(i===sn)return n.RGBA;if(i===Oo)return n.DEPTH_COMPONENT;if(i===ko)return n.DEPTH_STENCIL;if(i===Cl)return n.RED;if(i===wl)return n.RED_INTEGER;if(i===Wf)return n.RG;if(i===Rl)return n.RG_INTEGER;if(i===Il)return n.RGBA_INTEGER;if(i===Ir||i===br||i===Pr||i===Dr)if(s===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ir)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ir)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Dr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ba||i===Pa||i===Da||i===Na)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ba)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Pa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ua||i===La||i===Fa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ua||i===La)return s===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Fa)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ba||i===Oa||i===ka||i===Ga||i===Va||i===Ha||i===za||i===Wa||i===qa||i===$a||i===Xa||i===Ya||i===Ja||i===Ka)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ba)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Oa)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ka)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ga)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Va)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ha)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===za)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wa)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qa)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$a)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Xa)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ya)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ja)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ka)return s===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Nr||i===Za||i===Qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Nr)return s===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qf||i===ja||i===el||i===tl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Nr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ja)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===el)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===tl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Bo?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const IC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bC=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const o=new zt,r=e.properties.get(o);r.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vt({vertexShader:IC,fragmentShader:bC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new an(new ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class DC extends lo{constructor(e,t){super();const i=this;let o=null,r=1,s=null,a="local-floor",u=1,c=null,f=null,h=null,p=null,m=null,S=null;const E=new PC,_=t.getContextAttributes();let g=null,w=null;const T=[],M=[],L=new We;let I=null;const N=new Zt;N.viewport=new dt;const k=new Zt;k.viewport=new dt;const A=[N,k],x=new QE;let O=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let me=T[te];return me===void 0&&(me=new qs,T[te]=me),me.getTargetRaySpace()},this.getControllerGrip=function(te){let me=T[te];return me===void 0&&(me=new qs,T[te]=me),me.getGripSpace()},this.getHand=function(te){let me=T[te];return me===void 0&&(me=new qs,T[te]=me),me.getHandSpace()};function $(te){const me=M.indexOf(te.inputSource);if(me===-1)return;const ge=T[me];ge!==void 0&&(ge.update(te.inputSource,te.frame,c||s),ge.dispatchEvent({type:te.type,data:te.inputSource}))}function j(){o.removeEventListener("select",$),o.removeEventListener("selectstart",$),o.removeEventListener("selectend",$),o.removeEventListener("squeeze",$),o.removeEventListener("squeezestart",$),o.removeEventListener("squeezeend",$),o.removeEventListener("end",j),o.removeEventListener("inputsourceschange",ie);for(let te=0;te<T.length;te++){const me=M[te];me!==null&&(M[te]=null,T[te].disconnect(me))}O=null,Y=null,E.reset(),e.setRenderTarget(g),m=null,p=null,h=null,o=null,w=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(I),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){a=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(te){c=te},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return h},this.getFrame=function(){return S},this.getSession=function(){return o},this.setSession=async function(te){if(o=te,o!==null){if(g=e.getRenderTarget(),o.addEventListener("select",$),o.addEventListener("selectstart",$),o.addEventListener("selectend",$),o.addEventListener("squeeze",$),o.addEventListener("squeezestart",$),o.addEventListener("squeezeend",$),o.addEventListener("end",j),o.addEventListener("inputsourceschange",ie),_.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(L),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,_e=null,Pe=null;_.depth&&(Pe=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=_.stencil?ko:Oo,_e=_.stencil?Bo:xi);const tt={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:r};h=new XRWebGLBinding(o,t),p=h.createProjectionLayer(tt),o.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),w=new yn(p.textureWidth,p.textureHeight,{format:sn,type:Cn,depthTexture:new rh(p.textureWidth,p.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const ge={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(o,t,ge),o.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),w=new yn(m.framebufferWidth,m.framebufferHeight,{format:sn,type:Cn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(u),c=null,s=await o.requestReferenceSpace(a),je.setContext(o),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function ie(te){for(let me=0;me<te.removed.length;me++){const ge=te.removed[me],_e=M.indexOf(ge);_e>=0&&(M[_e]=null,T[_e].disconnect(ge))}for(let me=0;me<te.added.length;me++){const ge=te.added[me];let _e=M.indexOf(ge);if(_e===-1){for(let tt=0;tt<T.length;tt++)if(tt>=M.length){M.push(ge),_e=tt;break}else if(M[tt]===null){M[tt]=ge,_e=tt;break}if(_e===-1)break}const Pe=T[_e];Pe&&Pe.connect(ge)}}const ee=new q,re=new q;function J(te,me,ge){ee.setFromMatrixPosition(me.matrixWorld),re.setFromMatrixPosition(ge.matrixWorld);const _e=ee.distanceTo(re),Pe=me.projectionMatrix.elements,tt=ge.projectionMatrix.elements,He=Pe[14]/(Pe[10]-1),pt=Pe[14]/(Pe[10]+1),ft=(Pe[9]+1)/Pe[5],Ze=(Pe[9]-1)/Pe[5],G=(Pe[8]-1)/Pe[0],Bt=(tt[8]+1)/tt[0],ot=He*G,nt=He*Bt,Fe=_e/(-G+Bt),mt=Fe*-G;if(me.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(mt),te.translateZ(Fe),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Pe[10]===-1)te.projectionMatrix.copy(me.projectionMatrix),te.projectionMatrixInverse.copy(me.projectionMatrixInverse);else{const Ue=He+Fe,D=pt+Fe,C=ot-mt,X=nt+(_e-mt),se=ft*pt/D*Ue,ue=Ze*pt/D*Ue;te.projectionMatrix.makePerspective(C,X,se,ue,Ue,D),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function pe(te,me){me===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(me.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(o===null)return;let me=te.near,ge=te.far;E.texture!==null&&(E.depthNear>0&&(me=E.depthNear),E.depthFar>0&&(ge=E.depthFar)),x.near=k.near=N.near=me,x.far=k.far=N.far=ge,(O!==x.near||Y!==x.far)&&(o.updateRenderState({depthNear:x.near,depthFar:x.far}),O=x.near,Y=x.far),N.layers.mask=te.layers.mask|2,k.layers.mask=te.layers.mask|4,x.layers.mask=N.layers.mask|k.layers.mask;const _e=te.parent,Pe=x.cameras;pe(x,_e);for(let tt=0;tt<Pe.length;tt++)pe(Pe[tt],_e);Pe.length===2?J(x,N,k):x.projectionMatrix.copy(N.projectionMatrix),ve(te,x,_e)};function ve(te,me,ge){ge===null?te.matrix.copy(me.matrixWorld):(te.matrix.copy(ge.matrixWorld),te.matrix.invert(),te.matrix.multiply(me.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(me.projectionMatrix),te.projectionMatrixInverse.copy(me.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=il*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(p===null&&m===null))return u},this.setFoveation=function(te){u=te,p!==null&&(p.fixedFoveation=te),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=te)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(x)};let Me=null;function Be(te,me){if(f=me.getViewerPose(c||s),S=me,f!==null){const ge=f.views;m!==null&&(e.setRenderTargetFramebuffer(w,m.framebuffer),e.setRenderTarget(w));let _e=!1;ge.length!==x.cameras.length&&(x.cameras.length=0,_e=!0);for(let He=0;He<ge.length;He++){const pt=ge[He];let ft=null;if(m!==null)ft=m.getViewport(pt);else{const G=h.getViewSubImage(p,pt);ft=G.viewport,He===0&&(e.setRenderTargetTextures(w,G.colorTexture,G.depthStencilTexture),e.setRenderTarget(w))}let Ze=A[He];Ze===void 0&&(Ze=new Zt,Ze.layers.enable(He),Ze.viewport=new dt,A[He]=Ze),Ze.matrix.fromArray(pt.transform.matrix),Ze.matrix.decompose(Ze.position,Ze.quaternion,Ze.scale),Ze.projectionMatrix.fromArray(pt.projectionMatrix),Ze.projectionMatrixInverse.copy(Ze.projectionMatrix).invert(),Ze.viewport.set(ft.x,ft.y,ft.width,ft.height),He===0&&(x.matrix.copy(Ze.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),_e===!0&&x.cameras.push(Ze)}const Pe=o.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&h){const He=h.getDepthInformation(ge[0]);He&&He.isValid&&He.texture&&E.init(e,He,o.renderState)}}for(let ge=0;ge<T.length;ge++){const _e=M[ge],Pe=T[ge];_e!==null&&Pe!==void 0&&Pe.update(_e,me,c||s)}Me&&Me(te,me),me.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:me}),S=null}const je=new lh;je.setAnimationLoop(Be),this.setAnimationLoop=function(te){Me=te},this.dispose=function(){}}}const pi=new En,NC=new yt;function UC(n,e){function t(_,g){_.matrixAutoUpdate===!0&&_.updateMatrix(),g.value.copy(_.matrix)}function i(_,g){g.color.getRGB(_.fogColor.value,th(n)),g.isFog?(_.fogNear.value=g.near,_.fogFar.value=g.far):g.isFogExp2&&(_.fogDensity.value=g.density)}function o(_,g,w,T,M){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(_,g):g.isMeshToonMaterial?(r(_,g),h(_,g)):g.isMeshPhongMaterial?(r(_,g),f(_,g)):g.isMeshStandardMaterial?(r(_,g),p(_,g),g.isMeshPhysicalMaterial&&m(_,g,M)):g.isMeshMatcapMaterial?(r(_,g),S(_,g)):g.isMeshDepthMaterial?r(_,g):g.isMeshDistanceMaterial?(r(_,g),E(_,g)):g.isMeshNormalMaterial?r(_,g):g.isLineBasicMaterial?(s(_,g),g.isLineDashedMaterial&&a(_,g)):g.isPointsMaterial?u(_,g,w,T):g.isSpriteMaterial?c(_,g):g.isShadowMaterial?(_.color.value.copy(g.color),_.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(_,g){_.opacity.value=g.opacity,g.color&&_.diffuse.value.copy(g.color),g.emissive&&_.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.bumpMap&&(_.bumpMap.value=g.bumpMap,t(g.bumpMap,_.bumpMapTransform),_.bumpScale.value=g.bumpScale,g.side===Ht&&(_.bumpScale.value*=-1)),g.normalMap&&(_.normalMap.value=g.normalMap,t(g.normalMap,_.normalMapTransform),_.normalScale.value.copy(g.normalScale),g.side===Ht&&_.normalScale.value.negate()),g.displacementMap&&(_.displacementMap.value=g.displacementMap,t(g.displacementMap,_.displacementMapTransform),_.displacementScale.value=g.displacementScale,_.displacementBias.value=g.displacementBias),g.emissiveMap&&(_.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,_.emissiveMapTransform)),g.specularMap&&(_.specularMap.value=g.specularMap,t(g.specularMap,_.specularMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest);const w=e.get(g),T=w.envMap,M=w.envMapRotation;T&&(_.envMap.value=T,pi.copy(M),pi.x*=-1,pi.y*=-1,pi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),_.envMapRotation.value.setFromMatrix4(NC.makeRotationFromEuler(pi)),_.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,_.reflectivity.value=g.reflectivity,_.ior.value=g.ior,_.refractionRatio.value=g.refractionRatio),g.lightMap&&(_.lightMap.value=g.lightMap,_.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,_.lightMapTransform)),g.aoMap&&(_.aoMap.value=g.aoMap,_.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,_.aoMapTransform))}function s(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform))}function a(_,g){_.dashSize.value=g.dashSize,_.totalSize.value=g.dashSize+g.gapSize,_.scale.value=g.scale}function u(_,g,w,T){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.size.value=g.size*w,_.scale.value=T*.5,g.map&&(_.map.value=g.map,t(g.map,_.uvTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function c(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.rotation.value=g.rotation,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function f(_,g){_.specular.value.copy(g.specular),_.shininess.value=Math.max(g.shininess,1e-4)}function h(_,g){g.gradientMap&&(_.gradientMap.value=g.gradientMap)}function p(_,g){_.metalness.value=g.metalness,g.metalnessMap&&(_.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,_.metalnessMapTransform)),_.roughness.value=g.roughness,g.roughnessMap&&(_.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,_.roughnessMapTransform)),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)}function m(_,g,w){_.ior.value=g.ior,g.sheen>0&&(_.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),_.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(_.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,_.sheenColorMapTransform)),g.sheenRoughnessMap&&(_.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,_.sheenRoughnessMapTransform))),g.clearcoat>0&&(_.clearcoat.value=g.clearcoat,_.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(_.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,_.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(_.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ht&&_.clearcoatNormalScale.value.negate())),g.dispersion>0&&(_.dispersion.value=g.dispersion),g.iridescence>0&&(_.iridescence.value=g.iridescence,_.iridescenceIOR.value=g.iridescenceIOR,_.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(_.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,_.iridescenceMapTransform)),g.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),g.transmission>0&&(_.transmission.value=g.transmission,_.transmissionSamplerMap.value=w.texture,_.transmissionSamplerSize.value.set(w.width,w.height),g.transmissionMap&&(_.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,_.transmissionMapTransform)),_.thickness.value=g.thickness,g.thicknessMap&&(_.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=g.attenuationDistance,_.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(_.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(_.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=g.specularIntensity,_.specularColor.value.copy(g.specularColor),g.specularColorMap&&(_.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,_.specularColorMapTransform)),g.specularIntensityMap&&(_.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,_.specularIntensityMapTransform))}function S(_,g){g.matcap&&(_.matcap.value=g.matcap)}function E(_,g){const w=e.get(g).light;_.referencePosition.value.setFromMatrixPosition(w.matrixWorld),_.nearDistance.value=w.shadow.camera.near,_.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function LC(n,e,t,i){let o={},r={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function u(w,T){const M=T.program;i.uniformBlockBinding(w,M)}function c(w,T){let M=o[w.id];M===void 0&&(S(w),M=f(w),o[w.id]=M,w.addEventListener("dispose",_));const L=T.program;i.updateUBOMapping(w,L);const I=e.render.frame;r[w.id]!==I&&(p(w),r[w.id]=I)}function f(w){const T=h();w.__bindingPointIndex=T;const M=n.createBuffer(),L=w.__size,I=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,L,I),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,M),M}function h(){for(let w=0;w<a;w++)if(s.indexOf(w)===-1)return s.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(w){const T=o[w.id],M=w.uniforms,L=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let I=0,N=M.length;I<N;I++){const k=Array.isArray(M[I])?M[I]:[M[I]];for(let A=0,x=k.length;A<x;A++){const O=k[A];if(m(O,I,A,L)===!0){const Y=O.__offset,$=Array.isArray(O.value)?O.value:[O.value];let j=0;for(let ie=0;ie<$.length;ie++){const ee=$[ie],re=E(ee);typeof ee=="number"||typeof ee=="boolean"?(O.__data[0]=ee,n.bufferSubData(n.UNIFORM_BUFFER,Y+j,O.__data)):ee.isMatrix3?(O.__data[0]=ee.elements[0],O.__data[1]=ee.elements[1],O.__data[2]=ee.elements[2],O.__data[3]=0,O.__data[4]=ee.elements[3],O.__data[5]=ee.elements[4],O.__data[6]=ee.elements[5],O.__data[7]=0,O.__data[8]=ee.elements[6],O.__data[9]=ee.elements[7],O.__data[10]=ee.elements[8],O.__data[11]=0):(ee.toArray(O.__data,j),j+=re.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,Y,O.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(w,T,M,L){const I=w.value,N=T+"_"+M;if(L[N]===void 0)return typeof I=="number"||typeof I=="boolean"?L[N]=I:L[N]=I.clone(),!0;{const k=L[N];if(typeof I=="number"||typeof I=="boolean"){if(k!==I)return L[N]=I,!0}else if(k.equals(I)===!1)return k.copy(I),!0}return!1}function S(w){const T=w.uniforms;let M=0;const L=16;for(let N=0,k=T.length;N<k;N++){const A=Array.isArray(T[N])?T[N]:[T[N]];for(let x=0,O=A.length;x<O;x++){const Y=A[x],$=Array.isArray(Y.value)?Y.value:[Y.value];for(let j=0,ie=$.length;j<ie;j++){const ee=$[j],re=E(ee),J=M%L,pe=J%re.boundary,ve=J+pe;M+=pe,ve!==0&&L-ve<re.storage&&(M+=L-ve),Y.__data=new Float32Array(re.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=M,M+=re.storage}}}const I=M%L;return I>0&&(M+=L-I),w.__size=M,w.__cache={},this}function E(w){const T={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(T.boundary=4,T.storage=4):w.isVector2?(T.boundary=8,T.storage=8):w.isVector3||w.isColor?(T.boundary=16,T.storage=12):w.isVector4?(T.boundary=16,T.storage=16):w.isMatrix3?(T.boundary=48,T.storage=48):w.isMatrix4?(T.boundary=64,T.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),T}function _(w){const T=w.target;T.removeEventListener("dispose",_);const M=s.indexOf(T.__bindingPointIndex);s.splice(M,1),n.deleteBuffer(o[T.id]),delete o[T.id],delete r[T.id]}function g(){for(const w in o)n.deleteBuffer(o[w]);s=[],o={},r={}}return{bind:u,update:c,dispose:g}}class FC{constructor(e={}){const{canvas:t=rE(),context:i=null,depth:o=!0,stencil:r=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=s;const S=new Uint32Array(4),E=new Int32Array(4);let _=null,g=null;const w=[],T=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ii,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let L=!1;this._outputColorSpace=nn;let I=0,N=0,k=null,A=-1,x=null;const O=new dt,Y=new dt;let $=null;const j=new et(0);let ie=0,ee=t.width,re=t.height,J=1,pe=null,ve=null;const Me=new dt(0,0,ee,re),Be=new dt(0,0,ee,re);let je=!1;const te=new Dl;let me=!1,ge=!1;const _e=new yt,Pe=new yt,tt=new q,He=new dt,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ft=!1;function Ze(){return k===null?J:1}let G=i;function Bt(y,b){return t.getContext(y,b)}try{const y={alpha:!0,depth:o,stencil:r,antialias:a,premultipliedAlpha:u,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Tl}`),t.addEventListener("webglcontextlost",le,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",Te,!1),G===null){const b="webgl2";if(G=Bt(b,y),G===null)throw Bt(b)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let ot,nt,Fe,mt,Ue,D,C,X,se,ue,ne,De,Se,Oe,ze,fe,Ce,be,Ne,Ae,$e,ke,Xe,H;function K(){ot=new $M(G),ot.init(),ke=new RC(G,ot),nt=new kM(G,ot,e,ke),Fe=new CC(G,ot),nt.reverseDepthBuffer&&p&&Fe.buffers.depth.setReversed(!0),mt=new JM(G),Ue=new hC,D=new wC(G,ot,Fe,Ue,nt,ke,mt),C=new VM(M),X=new qM(M),se=new tT(G),Xe=new BM(G,se),ue=new XM(G,se,mt,Xe),ne=new ZM(G,ue,se,mt),Ne=new KM(G,nt,D),fe=new GM(Ue),De=new fC(M,C,X,ot,nt,Xe,fe),Se=new UC(M,Ue),Oe=new mC,ze=new EC(ot),be=new FM(M,C,X,Fe,ne,m,u),Ce=new MC(M,ne,nt),H=new LC(G,mt,nt,Fe),Ae=new OM(G,ot,mt),$e=new YM(G,ot,mt),mt.programs=De.programs,M.capabilities=nt,M.extensions=ot,M.properties=Ue,M.renderLists=Oe,M.shadowMap=Ce,M.state=Fe,M.info=mt}K();const Q=new DC(M,G);this.xr=Q,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const y=ot.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ot.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(y){y!==void 0&&(J=y,this.setSize(ee,re,!1))},this.getSize=function(y){return y.set(ee,re)},this.setSize=function(y,b,P=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ee=y,re=b,t.width=Math.floor(y*J),t.height=Math.floor(b*J),P===!0&&(t.style.width=y+"px",t.style.height=b+"px"),this.setViewport(0,0,y,b)},this.getDrawingBufferSize=function(y){return y.set(ee*J,re*J).floor()},this.setDrawingBufferSize=function(y,b,P){ee=y,re=b,J=P,t.width=Math.floor(y*P),t.height=Math.floor(b*P),this.setViewport(0,0,y,b)},this.getCurrentViewport=function(y){return y.copy(O)},this.getViewport=function(y){return y.copy(Me)},this.setViewport=function(y,b,P,B){y.isVector4?Me.set(y.x,y.y,y.z,y.w):Me.set(y,b,P,B),Fe.viewport(O.copy(Me).multiplyScalar(J).round())},this.getScissor=function(y){return y.copy(Be)},this.setScissor=function(y,b,P,B){y.isVector4?Be.set(y.x,y.y,y.z,y.w):Be.set(y,b,P,B),Fe.scissor(Y.copy(Be).multiplyScalar(J).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(y){Fe.setScissorTest(je=y)},this.setOpaqueSort=function(y){pe=y},this.setTransparentSort=function(y){ve=y},this.getClearColor=function(y){return y.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(y=!0,b=!0,P=!0){let B=0;if(y){let U=!1;if(k!==null){const V=k.texture.format;U=V===Il||V===Rl||V===wl}if(U){const V=k.texture.type,z=V===Cn||V===xi||V===Fo||V===Bo||V===Ml||V===Al,W=be.getClearColor(),Z=be.getClearAlpha(),ae=W.r,oe=W.g,ce=W.b;z?(S[0]=ae,S[1]=oe,S[2]=ce,S[3]=Z,G.clearBufferuiv(G.COLOR,0,S)):(E[0]=ae,E[1]=oe,E[2]=ce,E[3]=Z,G.clearBufferiv(G.COLOR,0,E))}else B|=G.COLOR_BUFFER_BIT}b&&(B|=G.DEPTH_BUFFER_BIT),P&&(B|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",le,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),be.dispose(),Oe.dispose(),ze.dispose(),Ue.dispose(),C.dispose(),X.dispose(),ne.dispose(),Xe.dispose(),H.dispose(),De.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",Xo),Q.removeEventListener("sessionend",Yo),wn.stop()};function le(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const y=mt.autoReset,b=Ce.enabled,P=Ce.autoUpdate,B=Ce.needsUpdate,U=Ce.type;K(),mt.autoReset=y,Ce.enabled=b,Ce.autoUpdate=P,Ce.needsUpdate=B,Ce.type=U}function Te(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ye(y){const b=y.target;b.removeEventListener("dispose",Ye),vt(b)}function vt(y){Rt(y),Ue.remove(y)}function Rt(y){const b=Ue.get(y).programs;b!==void 0&&(b.forEach(function(P){De.releaseProgram(P)}),y.isShaderMaterial&&De.releaseShaderCache(y))}this.renderBufferDirect=function(y,b,P,B,U,V){b===null&&(b=pt);const z=U.isMesh&&U.matrixWorld.determinant()<0,W=ds(y,b,P,B,U);Fe.setMaterial(B,z);let Z=P.index,ae=1;if(B.wireframe===!0){if(Z=ue.getWireframeAttribute(P),Z===void 0)return;ae=2}const oe=P.drawRange,ce=P.attributes.position;let de=oe.start*ae,he=(oe.start+oe.count)*ae;V!==null&&(de=Math.max(de,V.start*ae),he=Math.min(he,(V.start+V.count)*ae)),Z!==null?(de=Math.max(de,0),he=Math.min(he,Z.count)):ce!=null&&(de=Math.max(de,0),he=Math.min(he,ce.count));const Re=he-de;if(Re<0||Re===1/0)return;Xe.setup(U,B,W,P,Z);let Ge,Le=Ae;if(Z!==null&&(Ge=se.get(Z),Le=$e,Le.setIndex(Ge)),U.isMesh)B.wireframe===!0?(Fe.setLineWidth(B.wireframeLinewidth*Ze()),Le.setMode(G.LINES)):Le.setMode(G.TRIANGLES);else if(U.isLine){let we=B.linewidth;we===void 0&&(we=1),Fe.setLineWidth(we*Ze()),U.isLineSegments?Le.setMode(G.LINES):U.isLineLoop?Le.setMode(G.LINE_LOOP):Le.setMode(G.LINE_STRIP)}else U.isPoints?Le.setMode(G.POINTS):U.isSprite&&Le.setMode(G.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Ur("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Le.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))Le.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const we=U._multiDrawStarts,Je=U._multiDrawCounts,Ie=U._multiDrawCount,ut=Z?se.get(Z).bytesPerElement:1,xt=Ue.get(B).currentProgram.getUniforms();for(let st=0;st<Ie;st++)xt.setValue(G,"_gl_DrawID",st),Le.render(we[st]/ut,Je[st])}else if(U.isInstancedMesh)Le.renderInstances(de,Re,U.count);else if(P.isInstancedBufferGeometry){const we=P._maxInstanceCount!==void 0?P._maxInstanceCount:1/0,Je=Math.min(P.instanceCount,we);Le.renderInstances(de,Re,Je)}else Le.render(de,Re)};function ct(y,b,P){y.transparent===!0&&y.side===Fn&&y.forceSinglePass===!1?(y.side=Ht,y.needsUpdate=!0,Ci(y,b,P),y.side=oi,y.needsUpdate=!0,Ci(y,b,P),y.side=Fn):Ci(y,b,P)}this.compile=function(y,b,P=null){P===null&&(P=y),g=ze.get(P),g.init(b),T.push(g),P.traverseVisible(function(U){U.isLight&&U.layers.test(b.layers)&&(g.pushLight(U),U.castShadow&&g.pushShadow(U))}),y!==P&&y.traverseVisible(function(U){U.isLight&&U.layers.test(b.layers)&&(g.pushLight(U),U.castShadow&&g.pushShadow(U))}),g.setupLights();const B=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const V=U.material;if(V)if(Array.isArray(V))for(let z=0;z<V.length;z++){const W=V[z];ct(W,P,U),B.add(W)}else ct(V,P,U),B.add(V)}),g=T.pop(),B},this.compileAsync=function(y,b,P=null){const B=this.compile(y,b,P);return new Promise(U=>{function V(){if(B.forEach(function(z){Ue.get(z).currentProgram.isReady()&&B.delete(z)}),B.size===0){U(y);return}setTimeout(V,10)}ot.get("KHR_parallel_shader_compile")!==null?V():setTimeout(V,10)})};let Yt=null;function un(y){Yt&&Yt(y)}function Xo(){wn.stop()}function Yo(){wn.start()}const wn=new lh;wn.setAnimationLoop(un),typeof self<"u"&&wn.setContext(self),this.setAnimationLoop=function(y){Yt=y,Q.setAnimationLoop(y),y===null?wn.stop():wn.start()},Q.addEventListener("sessionstart",Xo),Q.addEventListener("sessionend",Yo),this.render=function(y,b){if(b!==void 0&&b.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),b.parent===null&&b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(b),b=Q.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,b,k),g=ze.get(y,T.length),g.init(b),T.push(g),Pe.multiplyMatrices(b.projectionMatrix,b.matrixWorldInverse),te.setFromProjectionMatrix(Pe),ge=this.localClippingEnabled,me=fe.init(this.clippingPlanes,ge),_=Oe.get(y,w.length),_.init(),w.push(_),Q.enabled===!0&&Q.isPresenting===!0){const V=M.xr.getDepthSensingMesh();V!==null&&ho(V,b,-1/0,M.sortObjects)}ho(y,b,0,M.sortObjects),_.finish(),M.sortObjects===!0&&_.sort(pe,ve),ft=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,ft&&be.addToRenderList(_,y),this.info.render.frame++,me===!0&&fe.beginShadows();const P=g.state.shadowsArray;Ce.render(P,y,b),me===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=_.opaque,U=_.transmissive;if(g.setupLights(),b.isArrayCamera){const V=b.cameras;if(U.length>0)for(let z=0,W=V.length;z<W;z++){const Z=V[z];Jo(B,U,y,Z)}ft&&be.render(y);for(let z=0,W=V.length;z<W;z++){const Z=V[z];po(_,y,Z,Z.viewport)}}else U.length>0&&Jo(B,U,y,b),ft&&be.render(y),po(_,y,b);k!==null&&N===0&&(D.updateMultisampleRenderTarget(k),D.updateRenderTargetMipmap(k)),y.isScene===!0&&y.onAfterRender(M,y,b),Xe.resetDefaultState(),A=-1,x=null,T.pop(),T.length>0?(g=T[T.length-1],me===!0&&fe.setGlobalState(M.clippingPlanes,g.state.camera)):g=null,w.pop(),w.length>0?_=w[w.length-1]:_=null};function ho(y,b,P,B){if(y.visible===!1)return;if(y.layers.test(b.layers)){if(y.isGroup)P=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(b);else if(y.isLight)g.pushLight(y),y.castShadow&&g.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||te.intersectsSprite(y)){B&&He.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Pe);const z=ne.update(y),W=y.material;W.visible&&_.push(y,z,W,P,He.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||te.intersectsObject(y))){const z=ne.update(y),W=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),He.copy(y.boundingSphere.center)):(z.boundingSphere===null&&z.computeBoundingSphere(),He.copy(z.boundingSphere.center)),He.applyMatrix4(y.matrixWorld).applyMatrix4(Pe)),Array.isArray(W)){const Z=z.groups;for(let ae=0,oe=Z.length;ae<oe;ae++){const ce=Z[ae],de=W[ce.materialIndex];de&&de.visible&&_.push(y,z,de,P,He.z,ce)}}else W.visible&&_.push(y,z,W,P,He.z,null)}}const V=y.children;for(let z=0,W=V.length;z<W;z++)ho(V[z],b,P,B)}function po(y,b,P,B){const U=y.opaque,V=y.transmissive,z=y.transparent;g.setupLightsView(P),me===!0&&fe.setGlobalState(M.clippingPlanes,P),B&&Fe.viewport(O.copy(B)),U.length>0&&Ai(U,b,P),V.length>0&&Ai(V,b,P),z.length>0&&Ai(z,b,P),Fe.buffers.depth.setTest(!0),Fe.buffers.depth.setMask(!0),Fe.buffers.color.setMask(!0),Fe.setPolygonOffset(!1)}function Jo(y,b,P,B){if((P.isScene===!0?P.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[B.id]===void 0&&(g.state.transmissionRenderTarget[B.id]=new yn(1,1,{generateMipmaps:!0,type:ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float")?jt:Cn,minFilter:ti,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:at.workingColorSpace}));const V=g.state.transmissionRenderTarget[B.id],z=B.viewport||O;V.setSize(z.z*M.transmissionResolutionScale,z.w*M.transmissionResolutionScale);const W=M.getRenderTarget();M.setRenderTarget(V),M.getClearColor(j),ie=M.getClearAlpha(),ie<1&&M.setClearColor(16777215,.5),M.clear(),ft&&be.render(P);const Z=M.toneMapping;M.toneMapping=ii;const ae=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),g.setupLightsView(B),me===!0&&fe.setGlobalState(M.clippingPlanes,B),Ai(y,P,B),D.updateMultisampleRenderTarget(V),D.updateRenderTargetMipmap(V),ot.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let ce=0,de=b.length;ce<de;ce++){const he=b[ce],Re=he.object,Ge=he.geometry,Le=he.material,we=he.group;if(Le.side===Fn&&Re.layers.test(B.layers)){const Je=Le.side;Le.side=Ht,Le.needsUpdate=!0,Ko(Re,P,B,Ge,Le,we),Le.side=Je,Le.needsUpdate=!0,oe=!0}}oe===!0&&(D.updateMultisampleRenderTarget(V),D.updateRenderTargetMipmap(V))}M.setRenderTarget(W),M.setClearColor(j,ie),ae!==void 0&&(B.viewport=ae),M.toneMapping=Z}function Ai(y,b,P){const B=b.isScene===!0?b.overrideMaterial:null;for(let U=0,V=y.length;U<V;U++){const z=y[U],W=z.object,Z=z.geometry,ae=z.group;let oe=z.material;oe.allowOverride===!0&&B!==null&&(oe=B),W.layers.test(P.layers)&&Ko(W,b,P,Z,oe,ae)}}function Ko(y,b,P,B,U,V){y.onBeforeRender(M,b,P,B,U,V),y.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(M,b,P,B,y,V),U.transparent===!0&&U.side===Fn&&U.forceSinglePass===!1?(U.side=Ht,U.needsUpdate=!0,M.renderBufferDirect(P,b,B,U,y,V),U.side=oi,U.needsUpdate=!0,M.renderBufferDirect(P,b,B,U,y,V),U.side=Fn):M.renderBufferDirect(P,b,B,U,y,V),y.onAfterRender(M,b,P,B,U,V)}function Ci(y,b,P){b.isScene!==!0&&(b=pt);const B=Ue.get(y),U=g.state.lights,V=g.state.shadowsArray,z=U.state.version,W=De.getParameters(y,U.state,V,b,P),Z=De.getProgramCacheKey(W);let ae=B.programs;B.environment=y.isMeshStandardMaterial?b.environment:null,B.fog=b.fog,B.envMap=(y.isMeshStandardMaterial?X:C).get(y.envMap||B.environment),B.envMapRotation=B.environment!==null&&y.envMap===null?b.environmentRotation:y.envMapRotation,ae===void 0&&(y.addEventListener("dispose",Ye),ae=new Map,B.programs=ae);let oe=ae.get(Z);if(oe!==void 0){if(B.currentProgram===oe&&B.lightsStateVersion===z)return go(y,W),oe}else W.uniforms=De.getUniforms(y),y.onBeforeCompile(W,M),oe=De.acquireProgram(W,Z),ae.set(Z,oe),B.uniforms=W.uniforms;const ce=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(ce.clippingPlanes=fe.uniform),go(y,W),B.needsLights=$n(y),B.lightsStateVersion=z,B.needsLights&&(ce.ambientLightColor.value=U.state.ambient,ce.lightProbe.value=U.state.probe,ce.directionalLights.value=U.state.directional,ce.directionalLightShadows.value=U.state.directionalShadow,ce.spotLights.value=U.state.spot,ce.spotLightShadows.value=U.state.spotShadow,ce.rectAreaLights.value=U.state.rectArea,ce.ltc_1.value=U.state.rectAreaLTC1,ce.ltc_2.value=U.state.rectAreaLTC2,ce.pointLights.value=U.state.point,ce.pointLightShadows.value=U.state.pointShadow,ce.hemisphereLights.value=U.state.hemi,ce.directionalShadowMap.value=U.state.directionalShadowMap,ce.directionalShadowMatrix.value=U.state.directionalShadowMatrix,ce.spotShadowMap.value=U.state.spotShadowMap,ce.spotLightMatrix.value=U.state.spotLightMatrix,ce.spotLightMap.value=U.state.spotLightMap,ce.pointShadowMap.value=U.state.pointShadowMap,ce.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=oe,B.uniformsList=null,oe}function mo(y){if(y.uniformsList===null){const b=y.currentProgram.getUniforms();y.uniformsList=Lr.seqWithValue(b.seq,y.uniforms)}return y.uniformsList}function go(y,b){const P=Ue.get(y);P.outputColorSpace=b.outputColorSpace,P.batching=b.batching,P.batchingColor=b.batchingColor,P.instancing=b.instancing,P.instancingColor=b.instancingColor,P.instancingMorph=b.instancingMorph,P.skinning=b.skinning,P.morphTargets=b.morphTargets,P.morphNormals=b.morphNormals,P.morphColors=b.morphColors,P.morphTargetsCount=b.morphTargetsCount,P.numClippingPlanes=b.numClippingPlanes,P.numIntersection=b.numClipIntersection,P.vertexAlphas=b.vertexAlphas,P.vertexTangents=b.vertexTangents,P.toneMapping=b.toneMapping}function ds(y,b,P,B,U){b.isScene!==!0&&(b=pt),D.resetTextureUnits();const V=b.fog,z=B.isMeshStandardMaterial?b.environment:null,W=k===null?M.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:ri,Z=(B.isMeshStandardMaterial?X:C).get(B.envMap||z),ae=B.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,oe=!!P.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),ce=!!P.morphAttributes.position,de=!!P.morphAttributes.normal,he=!!P.morphAttributes.color;let Re=ii;B.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(Re=M.toneMapping);const Ge=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,Le=Ge!==void 0?Ge.length:0,we=Ue.get(B),Je=g.state.lights;if(me===!0&&(ge===!0||y!==x)){const gt=y===x&&B.id===A;fe.setState(B,y,gt)}let Ie=!1;B.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Je.state.version||we.outputColorSpace!==W||U.isBatchedMesh&&we.batching===!1||!U.isBatchedMesh&&we.batching===!0||U.isBatchedMesh&&we.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&we.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&we.instancing===!1||!U.isInstancedMesh&&we.instancing===!0||U.isSkinnedMesh&&we.skinning===!1||!U.isSkinnedMesh&&we.skinning===!0||U.isInstancedMesh&&we.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&we.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&we.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&we.instancingMorph===!1&&U.morphTexture!==null||we.envMap!==Z||B.fog===!0&&we.fog!==V||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==fe.numPlanes||we.numIntersection!==fe.numIntersection)||we.vertexAlphas!==ae||we.vertexTangents!==oe||we.morphTargets!==ce||we.morphNormals!==de||we.morphColors!==he||we.toneMapping!==Re||we.morphTargetsCount!==Le)&&(Ie=!0):(Ie=!0,we.__version=B.version);let ut=we.currentProgram;Ie===!0&&(ut=Ci(B,b,U));let xt=!1,st=!1,rt=!1;const Ve=ut.getUniforms(),St=we.uniforms;if(Fe.useProgram(ut.program)&&(xt=!0,st=!0,rt=!0),B.id!==A&&(A=B.id,st=!0),xt||x!==y){Fe.buffers.depth.getReversed()?(_e.copy(y.projectionMatrix),aE(_e),lE(_e),Ve.setValue(G,"projectionMatrix",_e)):Ve.setValue(G,"projectionMatrix",y.projectionMatrix),Ve.setValue(G,"viewMatrix",y.matrixWorldInverse);const Mt=Ve.map.cameraPosition;Mt!==void 0&&Mt.setValue(G,tt.setFromMatrixPosition(y.matrixWorld)),nt.logarithmicDepthBuffer&&Ve.setValue(G,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Ve.setValue(G,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,st=!0,rt=!0)}if(U.isSkinnedMesh){Ve.setOptional(G,U,"bindMatrix"),Ve.setOptional(G,U,"bindMatrixInverse");const gt=U.skeleton;gt&&(gt.boneTexture===null&&gt.computeBoneTexture(),Ve.setValue(G,"boneTexture",gt.boneTexture,D))}U.isBatchedMesh&&(Ve.setOptional(G,U,"batchingTexture"),Ve.setValue(G,"batchingTexture",U._matricesTexture,D),Ve.setOptional(G,U,"batchingIdTexture"),Ve.setValue(G,"batchingIdTexture",U._indirectTexture,D),Ve.setOptional(G,U,"batchingColorTexture"),U._colorsTexture!==null&&Ve.setValue(G,"batchingColorTexture",U._colorsTexture,D));const It=P.morphAttributes;if((It.position!==void 0||It.normal!==void 0||It.color!==void 0)&&Ne.update(U,P,ut),(st||we.receiveShadow!==U.receiveShadow)&&(we.receiveShadow=U.receiveShadow,Ve.setValue(G,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(St.envMap.value=Z,St.flipEnvMap.value=Z.isCubeTexture&&Z.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&b.environment!==null&&(St.envMapIntensity.value=b.environmentIntensity),st&&(Ve.setValue(G,"toneMappingExposure",M.toneMappingExposure),we.needsLights&&Rn(St,rt),V&&B.fog===!0&&Se.refreshFogUniforms(St,V),Se.refreshMaterialUniforms(St,B,J,re,g.state.transmissionRenderTarget[y.id]),Lr.upload(G,mo(we),St,D)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Lr.upload(G,mo(we),St,D),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Ve.setValue(G,"center",U.center),Ve.setValue(G,"modelViewMatrix",U.modelViewMatrix),Ve.setValue(G,"normalMatrix",U.normalMatrix),Ve.setValue(G,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const gt=B.uniformsGroups;for(let Mt=0,fs=gt.length;Mt<fs;Mt++){const ai=gt[Mt];H.update(ai,ut),H.bind(ai,ut)}}return ut}function Rn(y,b){y.ambientLightColor.needsUpdate=b,y.lightProbe.needsUpdate=b,y.directionalLights.needsUpdate=b,y.directionalLightShadows.needsUpdate=b,y.pointLights.needsUpdate=b,y.pointLightShadows.needsUpdate=b,y.spotLights.needsUpdate=b,y.spotLightShadows.needsUpdate=b,y.rectAreaLights.needsUpdate=b,y.hemisphereLights.needsUpdate=b}function $n(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(y,b,P){const B=Ue.get(y);B.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),Ue.get(y.texture).__webglTexture=b,Ue.get(y.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:P,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,b){const P=Ue.get(y);P.__webglFramebuffer=b,P.__useDefaultFramebuffer=b===void 0};const v=G.createFramebuffer();this.setRenderTarget=function(y,b=0,P=0){k=y,I=b,N=P;let B=!0,U=null,V=!1,z=!1;if(y){const Z=Ue.get(y);if(Z.__useDefaultFramebuffer!==void 0)Fe.bindFramebuffer(G.FRAMEBUFFER,null),B=!1;else if(Z.__webglFramebuffer===void 0)D.setupRenderTarget(y);else if(Z.__hasExternalTextures)D.rebindTextures(y,Ue.get(y.texture).__webglTexture,Ue.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const ce=y.depthTexture;if(Z.__boundDepthTexture!==ce){if(ce!==null&&Ue.has(ce)&&(y.width!==ce.image.width||y.height!==ce.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(y)}}const ae=y.texture;(ae.isData3DTexture||ae.isDataArrayTexture||ae.isCompressedArrayTexture)&&(z=!0);const oe=Ue.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(oe[b])?U=oe[b][P]:U=oe[b],V=!0):y.samples>0&&D.useMultisampledRTT(y)===!1?U=Ue.get(y).__webglMultisampledFramebuffer:Array.isArray(oe)?U=oe[P]:U=oe,O.copy(y.viewport),Y.copy(y.scissor),$=y.scissorTest}else O.copy(Me).multiplyScalar(J).floor(),Y.copy(Be).multiplyScalar(J).floor(),$=je;if(P!==0&&(U=v),Fe.bindFramebuffer(G.FRAMEBUFFER,U)&&B&&Fe.drawBuffers(y,U),Fe.viewport(O),Fe.scissor(Y),Fe.setScissorTest($),V){const Z=Ue.get(y.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+b,Z.__webglTexture,P)}else if(z){const Z=Ue.get(y.texture),ae=b;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Z.__webglTexture,P,ae)}else if(y!==null&&P!==0){const Z=Ue.get(y.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Z.__webglTexture,P)}A=-1},this.readRenderTargetPixels=function(y,b,P,B,U,V,z){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let W=Ue.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&z!==void 0&&(W=W[z]),W){Fe.bindFramebuffer(G.FRAMEBUFFER,W);try{const Z=y.texture,ae=Z.format,oe=Z.type;if(!nt.textureFormatReadable(ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}b>=0&&b<=y.width-B&&P>=0&&P<=y.height-U&&G.readPixels(b,P,B,U,ke.convert(ae),ke.convert(oe),V)}finally{const Z=k!==null?Ue.get(k).__webglFramebuffer:null;Fe.bindFramebuffer(G.FRAMEBUFFER,Z)}}},this.readRenderTargetPixelsAsync=async function(y,b,P,B,U,V,z){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let W=Ue.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&z!==void 0&&(W=W[z]),W)if(b>=0&&b<=y.width-B&&P>=0&&P<=y.height-U){Fe.bindFramebuffer(G.FRAMEBUFFER,W);const Z=y.texture,ae=Z.format,oe=Z.type;if(!nt.textureFormatReadable(ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!nt.textureTypeReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,ce),G.bufferData(G.PIXEL_PACK_BUFFER,V.byteLength,G.STREAM_READ),G.readPixels(b,P,B,U,ke.convert(ae),ke.convert(oe),0);const de=k!==null?Ue.get(k).__webglFramebuffer:null;Fe.bindFramebuffer(G.FRAMEBUFFER,de);const he=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await sE(G,he,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,ce),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,V),G.deleteBuffer(ce),G.deleteSync(he),V}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,b=null,P=0){const B=Math.pow(2,-P),U=Math.floor(y.image.width*B),V=Math.floor(y.image.height*B),z=b!==null?b.x:0,W=b!==null?b.y:0;D.setTexture2D(y,0),G.copyTexSubImage2D(G.TEXTURE_2D,P,0,0,z,W,U,V),Fe.unbindTexture()};const R=G.createFramebuffer(),F=G.createFramebuffer();this.copyTextureToTexture=function(y,b,P=null,B=null,U=0,V=null){V===null&&(U!==0?(Ur("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),V=U,U=0):V=0);let z,W,Z,ae,oe,ce,de,he,Re;const Ge=y.isCompressedTexture?y.mipmaps[V]:y.image;if(P!==null)z=P.max.x-P.min.x,W=P.max.y-P.min.y,Z=P.isBox3?P.max.z-P.min.z:1,ae=P.min.x,oe=P.min.y,ce=P.isBox3?P.min.z:0;else{const It=Math.pow(2,-U);z=Math.floor(Ge.width*It),W=Math.floor(Ge.height*It),y.isDataArrayTexture?Z=Ge.depth:y.isData3DTexture?Z=Math.floor(Ge.depth*It):Z=1,ae=0,oe=0,ce=0}B!==null?(de=B.x,he=B.y,Re=B.z):(de=0,he=0,Re=0);const Le=ke.convert(b.format),we=ke.convert(b.type);let Je;b.isData3DTexture?(D.setTexture3D(b,0),Je=G.TEXTURE_3D):b.isDataArrayTexture||b.isCompressedArrayTexture?(D.setTexture2DArray(b,0),Je=G.TEXTURE_2D_ARRAY):(D.setTexture2D(b,0),Je=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,b.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,b.unpackAlignment);const Ie=G.getParameter(G.UNPACK_ROW_LENGTH),ut=G.getParameter(G.UNPACK_IMAGE_HEIGHT),xt=G.getParameter(G.UNPACK_SKIP_PIXELS),st=G.getParameter(G.UNPACK_SKIP_ROWS),rt=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ge.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Ge.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,ae),G.pixelStorei(G.UNPACK_SKIP_ROWS,oe),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ce);const Ve=y.isDataArrayTexture||y.isData3DTexture,St=b.isDataArrayTexture||b.isData3DTexture;if(y.isDepthTexture){const It=Ue.get(y),gt=Ue.get(b),Mt=Ue.get(It.__renderTarget),fs=Ue.get(gt.__renderTarget);Fe.bindFramebuffer(G.READ_FRAMEBUFFER,Mt.__webglFramebuffer),Fe.bindFramebuffer(G.DRAW_FRAMEBUFFER,fs.__webglFramebuffer);for(let ai=0;ai<Z;ai++)Ve&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ue.get(y).__webglTexture,U,ce+ai),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ue.get(b).__webglTexture,V,Re+ai)),G.blitFramebuffer(ae,oe,z,W,de,he,z,W,G.DEPTH_BUFFER_BIT,G.NEAREST);Fe.bindFramebuffer(G.READ_FRAMEBUFFER,null),Fe.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(U!==0||y.isRenderTargetTexture||Ue.has(y)){const It=Ue.get(y),gt=Ue.get(b);Fe.bindFramebuffer(G.READ_FRAMEBUFFER,R),Fe.bindFramebuffer(G.DRAW_FRAMEBUFFER,F);for(let Mt=0;Mt<Z;Mt++)Ve?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,It.__webglTexture,U,ce+Mt):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,It.__webglTexture,U),St?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,gt.__webglTexture,V,Re+Mt):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,gt.__webglTexture,V),U!==0?G.blitFramebuffer(ae,oe,z,W,de,he,z,W,G.COLOR_BUFFER_BIT,G.NEAREST):St?G.copyTexSubImage3D(Je,V,de,he,Re+Mt,ae,oe,z,W):G.copyTexSubImage2D(Je,V,de,he,ae,oe,z,W);Fe.bindFramebuffer(G.READ_FRAMEBUFFER,null),Fe.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else St?y.isDataTexture||y.isData3DTexture?G.texSubImage3D(Je,V,de,he,Re,z,W,Z,Le,we,Ge.data):b.isCompressedArrayTexture?G.compressedTexSubImage3D(Je,V,de,he,Re,z,W,Z,Le,Ge.data):G.texSubImage3D(Je,V,de,he,Re,z,W,Z,Le,we,Ge):y.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,V,de,he,z,W,Le,we,Ge.data):y.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,V,de,he,Ge.width,Ge.height,Le,Ge.data):G.texSubImage2D(G.TEXTURE_2D,V,de,he,z,W,Le,we,Ge);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ie),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ut),G.pixelStorei(G.UNPACK_SKIP_PIXELS,xt),G.pixelStorei(G.UNPACK_SKIP_ROWS,st),G.pixelStorei(G.UNPACK_SKIP_IMAGES,rt),V===0&&b.generateMipmaps&&G.generateMipmap(Je),Fe.unbindTexture()},this.copyTextureToTexture3D=function(y,b,P=null,B=null,U=0){return Ur('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,b,P,B,U)},this.initRenderTarget=function(y){Ue.get(y).__webglFramebuffer===void 0&&D.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?D.setTextureCube(y,0):y.isData3DTexture?D.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?D.setTexture2DArray(y,0):D.setTexture2D(y,0),Fe.unbindTexture()},this.resetState=function(){I=0,N=0,k=null,Fe.reset(),Xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.2
*/var on=Uint8Array,qi=Uint16Array,BC=Int32Array,hh=new on([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ph=new on([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),OC=new on([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),mh=function(n,e){for(var t=new qi(31),i=0;i<31;++i)t[i]=e+=1<<n[i-1];for(var o=new BC(t[30]),i=1;i<30;++i)for(var r=t[i];r<t[i+1];++r)o[r]=r-t[i]<<5|i;return{b:t,r:o}},gh=mh(hh,2),_h=gh.b,kC=gh.r;_h[28]=258,kC[258]=28;var GC=mh(ph,0),VC=GC.b,al=new qi(32768);for(var _t=0;_t<32768;++_t){var jn=(_t&43690)>>1|(_t&21845)<<1;jn=(jn&52428)>>2|(jn&13107)<<2,jn=(jn&61680)>>4|(jn&3855)<<4,al[_t]=((jn&65280)>>8|(jn&255)<<8)>>1}var Po=(function(n,e,t){for(var i=n.length,o=0,r=new qi(e);o<i;++o)n[o]&&++r[n[o]-1];var s=new qi(e);for(o=1;o<e;++o)s[o]=s[o-1]+r[o-1]<<1;var a;if(t){a=new qi(1<<e);var u=15-e;for(o=0;o<i;++o)if(n[o])for(var c=o<<4|n[o],f=e-n[o],h=s[n[o]-1]++<<f,p=h|(1<<f)-1;h<=p;++h)a[al[h]>>u]=c}else for(a=new qi(i),o=0;o<i;++o)n[o]&&(a[o]=al[s[n[o]-1]++]>>15-n[o]);return a}),qo=new on(288);for(var _t=0;_t<144;++_t)qo[_t]=8;for(var _t=144;_t<256;++_t)qo[_t]=9;for(var _t=256;_t<280;++_t)qo[_t]=7;for(var _t=280;_t<288;++_t)qo[_t]=8;var vh=new on(32);for(var _t=0;_t<32;++_t)vh[_t]=5;var HC=Po(qo,9,1),zC=Po(vh,5,1),ta=function(n){for(var e=n[0],t=1;t<n.length;++t)n[t]>e&&(e=n[t]);return e},pn=function(n,e,t){var i=e/8|0;return(n[i]|n[i+1]<<8)>>(e&7)&t},na=function(n,e){var t=e/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(e&7)},WC=function(n){return(n+7)/8|0},qC=function(n,e,t){return(t==null||t>n.length)&&(t=n.length),new on(n.subarray(e,t))},$C=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],mn=function(n,e,t){var i=new Error(e||$C[n]);if(i.code=n,Error.captureStackTrace&&Error.captureStackTrace(i,mn),!t)throw i;return i},XC=function(n,e,t,i){var o=n.length,r=0;if(!o||e.f&&!e.l)return t||new on(0);var s=!t,a=s||e.i!=2,u=e.i;s&&(t=new on(o*3));var c=function(pt){var ft=t.length;if(pt>ft){var Ze=new on(Math.max(ft*2,pt));Ze.set(t),t=Ze}},f=e.f||0,h=e.p||0,p=e.b||0,m=e.l,S=e.d,E=e.m,_=e.n,g=o*8;do{if(!m){f=pn(n,h,1);var w=pn(n,h+1,3);if(h+=3,w)if(w==1)m=HC,S=zC,E=9,_=5;else if(w==2){var I=pn(n,h,31)+257,N=pn(n,h+10,15)+4,k=I+pn(n,h+5,31)+1;h+=14;for(var A=new on(k),x=new on(19),O=0;O<N;++O)x[OC[O]]=pn(n,h+O*3,7);h+=N*3;for(var Y=ta(x),$=(1<<Y)-1,j=Po(x,Y,1),O=0;O<k;){var ie=j[pn(n,h,$)];h+=ie&15;var T=ie>>4;if(T<16)A[O++]=T;else{var ee=0,re=0;for(T==16?(re=3+pn(n,h,3),h+=2,ee=A[O-1]):T==17?(re=3+pn(n,h,7),h+=3):T==18&&(re=11+pn(n,h,127),h+=7);re--;)A[O++]=ee}}var J=A.subarray(0,I),pe=A.subarray(I);E=ta(J),_=ta(pe),m=Po(J,E,1),S=Po(pe,_,1)}else mn(1);else{var T=WC(h)+4,M=n[T-4]|n[T-3]<<8,L=T+M;if(L>o){u&&mn(0);break}a&&c(p+M),t.set(n.subarray(T,L),p),e.b=p+=M,e.p=h=L*8,e.f=f;continue}if(h>g){u&&mn(0);break}}a&&c(p+131072);for(var ve=(1<<E)-1,Me=(1<<_)-1,Be=h;;Be=h){var ee=m[na(n,h)&ve],je=ee>>4;if(h+=ee&15,h>g){u&&mn(0);break}if(ee||mn(2),je<256)t[p++]=je;else if(je==256){Be=h,m=null;break}else{var te=je-254;if(je>264){var O=je-257,me=hh[O];te=pn(n,h,(1<<me)-1)+_h[O],h+=me}var ge=S[na(n,h)&Me],_e=ge>>4;ge||mn(3),h+=ge&15;var pe=VC[_e];if(_e>3){var me=ph[_e];pe+=na(n,h)&(1<<me)-1,h+=me}if(h>g){u&&mn(0);break}a&&c(p+131072);var Pe=p+te;if(p<pe){var tt=r-pe,He=Math.min(pe,Pe);for(tt+p<0&&mn(3);p<He;++p)t[p]=i[tt+p]}for(;p<Pe;++p)t[p]=t[p-pe]}}e.l=m,e.p=Be,e.b=p,e.f=f,m&&(f=1,e.m=E,e.d=S,e.n=_)}while(!f);return p!=t.length&&s?qC(t,0,p):t.subarray(0,p)},YC=new on(0),JC=function(n,e){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&mn(6,"invalid zlib data"),(n[1]>>5&1)==1&&mn(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function Ar(n,e){return XC(n.subarray(JC(n),-4),{i:2},e,e)}var KC=typeof TextDecoder<"u"&&new TextDecoder,ZC=0;try{KC.decode(YC,{stream:!0}),ZC=1}catch{}class QC extends YE{constructor(e){super(e),this.type=jt}parse(e){const A=Math.pow(2.7182818,2.2);function x(v,R){let F=0;for(let b=0;b<65536;++b)(b==0||v[b>>3]&1<<(b&7))&&(R[F++]=b);const y=F-1;for(;F<65536;)R[F++]=0;return y}function O(v){for(let R=0;R<16384;R++)v[R]={},v[R].len=0,v[R].lit=0,v[R].p=null}const Y={l:0,c:0,lc:0};function $(v,R,F,y,b){for(;F<v;)R=R<<8|Ae(y,b),F+=8;F-=v,Y.l=R>>F&(1<<v)-1,Y.c=R,Y.lc=F}const j=new Array(59);function ie(v){for(let F=0;F<=58;++F)j[F]=0;for(let F=0;F<65537;++F)j[v[F]]+=1;let R=0;for(let F=58;F>0;--F){const y=R+j[F]>>1;j[F]=R,R=y}for(let F=0;F<65537;++F){const y=v[F];y>0&&(v[F]=y|j[y]++<<6)}}function ee(v,R,F,y,b,P){const B=R;let U=0,V=0;for(;y<=b;y++){if(B.value-R.value>F)return!1;$(6,U,V,v,B);const z=Y.l;if(U=Y.c,V=Y.lc,P[y]=z,z==63){if(B.value-R.value>F)throw new Error("Something wrong with hufUnpackEncTable");$(8,U,V,v,B);let W=Y.l+6;if(U=Y.c,V=Y.lc,y+W>b+1)throw new Error("Something wrong with hufUnpackEncTable");for(;W--;)P[y++]=0;y--}else if(z>=59){let W=z-59+2;if(y+W>b+1)throw new Error("Something wrong with hufUnpackEncTable");for(;W--;)P[y++]=0;y--}}ie(P)}function re(v){return v&63}function J(v){return v>>6}function pe(v,R,F,y){for(;R<=F;R++){const b=J(v[R]),P=re(v[R]);if(b>>P)throw new Error("Invalid table entry");if(P>14){const B=y[b>>P-14];if(B.len)throw new Error("Invalid table entry");if(B.lit++,B.p){const U=B.p;B.p=new Array(B.lit);for(let V=0;V<B.lit-1;++V)B.p[V]=U[V]}else B.p=new Array(1);B.p[B.lit-1]=R}else if(P){let B=0;for(let U=1<<14-P;U>0;U--){const V=y[(b<<14-P)+B];if(V.len||V.p)throw new Error("Invalid table entry");V.len=P,V.lit=R,B++}}}return!0}const ve={c:0,lc:0};function Me(v,R,F,y){v=v<<8|Ae(F,y),R+=8,ve.c=v,ve.lc=R}const Be={c:0,lc:0};function je(v,R,F,y,b,P,B,U,V){if(v==R){y<8&&(Me(F,y,b,P),F=ve.c,y=ve.lc),y-=8;let z=F>>y;if(z=new Uint8Array([z])[0],U.value+z>V)return!1;const W=B[U.value-1];for(;z-- >0;)B[U.value++]=W}else if(U.value<V)B[U.value++]=v;else return!1;Be.c=F,Be.lc=y}function te(v){return v&65535}function me(v){const R=te(v);return R>32767?R-65536:R}const ge={a:0,b:0};function _e(v,R){const F=me(v),b=me(R),P=F+(b&1)+(b>>1),B=P,U=P-b;ge.a=B,ge.b=U}function Pe(v,R){const F=te(v),y=te(R),b=F-(y>>1)&65535,P=y+b-32768&65535;ge.a=P,ge.b=b}function tt(v,R,F,y,b,P,B){const U=B<16384,V=F>b?b:F;let z=1,W,Z;for(;z<=V;)z<<=1;for(z>>=1,W=z,z>>=1;z>=1;){Z=0;const ae=Z+P*(b-W),oe=P*z,ce=P*W,de=y*z,he=y*W;let Re,Ge,Le,we;for(;Z<=ae;Z+=ce){let Je=Z;const Ie=Z+y*(F-W);for(;Je<=Ie;Je+=he){const ut=Je+de,xt=Je+oe,st=xt+de;U?(_e(v[Je+R],v[xt+R]),Re=ge.a,Le=ge.b,_e(v[ut+R],v[st+R]),Ge=ge.a,we=ge.b,_e(Re,Ge),v[Je+R]=ge.a,v[ut+R]=ge.b,_e(Le,we),v[xt+R]=ge.a,v[st+R]=ge.b):(Pe(v[Je+R],v[xt+R]),Re=ge.a,Le=ge.b,Pe(v[ut+R],v[st+R]),Ge=ge.a,we=ge.b,Pe(Re,Ge),v[Je+R]=ge.a,v[ut+R]=ge.b,Pe(Le,we),v[xt+R]=ge.a,v[st+R]=ge.b)}if(F&z){const ut=Je+oe;U?_e(v[Je+R],v[ut+R]):Pe(v[Je+R],v[ut+R]),Re=ge.a,v[ut+R]=ge.b,v[Je+R]=Re}}if(b&z){let Je=Z;const Ie=Z+y*(F-W);for(;Je<=Ie;Je+=he){const ut=Je+de;U?_e(v[Je+R],v[ut+R]):Pe(v[Je+R],v[ut+R]),Re=ge.a,v[ut+R]=ge.b,v[Je+R]=Re}}W=z,z>>=1}return Z}function He(v,R,F,y,b,P,B,U,V){let z=0,W=0;const Z=B,ae=Math.trunc(y.value+(b+7)/8);for(;y.value<ae;)for(Me(z,W,F,y),z=ve.c,W=ve.lc;W>=14;){const ce=z>>W-14&16383,de=R[ce];if(de.len)W-=de.len,je(de.lit,P,z,W,F,y,U,V,Z),z=Be.c,W=Be.lc;else{if(!de.p)throw new Error("hufDecode issues");let he;for(he=0;he<de.lit;he++){const Re=re(v[de.p[he]]);for(;W<Re&&y.value<ae;)Me(z,W,F,y),z=ve.c,W=ve.lc;if(W>=Re&&J(v[de.p[he]])==(z>>W-Re&(1<<Re)-1)){W-=Re,je(de.p[he],P,z,W,F,y,U,V,Z),z=Be.c,W=Be.lc;break}}if(he==de.lit)throw new Error("hufDecode issues")}}const oe=8-b&7;for(z>>=oe,W-=oe;W>0;){const ce=R[z<<14-W&16383];if(ce.len)W-=ce.len,je(ce.lit,P,z,W,F,y,U,V,Z),z=Be.c,W=Be.lc;else throw new Error("hufDecode issues")}return!0}function pt(v,R,F,y,b,P){const B={value:0},U=F.value,V=Ne(R,F),z=Ne(R,F);F.value+=4;const W=Ne(R,F);if(F.value+=4,V<0||V>=65537||z<0||z>=65537)throw new Error("Something wrong with HUF_ENCSIZE");const Z=new Array(65537),ae=new Array(16384);O(ae);const oe=y-(F.value-U);if(ee(v,F,oe,V,z,Z),W>8*(y-(F.value-U)))throw new Error("Something wrong with hufUncompress");pe(Z,V,z,ae),He(Z,ae,v,F,W,z,P,b,B)}function ft(v,R,F){for(let y=0;y<F;++y)R[y]=v[R[y]]}function Ze(v){for(let R=1;R<v.length;R++){const F=v[R-1]+v[R]-128;v[R]=F}}function G(v,R){let F=0,y=Math.floor((v.length+1)/2),b=0;const P=v.length-1;for(;!(b>P||(R[b++]=v[F++],b>P));)R[b++]=v[y++]}function Bt(v){let R=v.byteLength;const F=new Array;let y=0;const b=new DataView(v);for(;R>0;){const P=b.getInt8(y++);if(P<0){const B=-P;R-=B+1;for(let U=0;U<B;U++)F.push(b.getUint8(y++))}else{const B=P;R-=2;const U=b.getUint8(y++);for(let V=0;V<B+1;V++)F.push(U)}}return F}function ot(v,R,F,y,b,P){let B=new DataView(P.buffer);const U=F[v.idx[0]].width,V=F[v.idx[0]].height,z=3,W=Math.floor(U/8),Z=Math.ceil(U/8),ae=Math.ceil(V/8),oe=U-(Z-1)*8,ce=V-(ae-1)*8,de={value:0},he=new Array(z),Re=new Array(z),Ge=new Array(z),Le=new Array(z),we=new Array(z);for(let Ie=0;Ie<z;++Ie)we[Ie]=R[v.idx[Ie]],he[Ie]=Ie<1?0:he[Ie-1]+Z*ae,Re[Ie]=new Float32Array(64),Ge[Ie]=new Uint16Array(64),Le[Ie]=new Uint16Array(Z*64);for(let Ie=0;Ie<ae;++Ie){let ut=8;Ie==ae-1&&(ut=ce);let xt=8;for(let rt=0;rt<Z;++rt){rt==Z-1&&(xt=oe);for(let Ve=0;Ve<z;++Ve)Ge[Ve].fill(0),Ge[Ve][0]=b[he[Ve]++],nt(de,y,Ge[Ve]),Fe(Ge[Ve],Re[Ve]),mt(Re[Ve]);Ue(Re);for(let Ve=0;Ve<z;++Ve)D(Re[Ve],Le[Ve],rt*64)}let st=0;for(let rt=0;rt<z;++rt){const Ve=F[v.idx[rt]].type;for(let St=8*Ie;St<8*Ie+ut;++St){st=we[rt][St];for(let It=0;It<W;++It){const gt=It*64+(St&7)*8;B.setUint16(st+0*Ve,Le[rt][gt+0],!0),B.setUint16(st+2*Ve,Le[rt][gt+1],!0),B.setUint16(st+4*Ve,Le[rt][gt+2],!0),B.setUint16(st+6*Ve,Le[rt][gt+3],!0),B.setUint16(st+8*Ve,Le[rt][gt+4],!0),B.setUint16(st+10*Ve,Le[rt][gt+5],!0),B.setUint16(st+12*Ve,Le[rt][gt+6],!0),B.setUint16(st+14*Ve,Le[rt][gt+7],!0),st+=16*Ve}}if(W!=Z)for(let St=8*Ie;St<8*Ie+ut;++St){const It=we[rt][St]+8*W*2*Ve,gt=W*64+(St&7)*8;for(let Mt=0;Mt<xt;++Mt)B.setUint16(It+Mt*2*Ve,Le[rt][gt+Mt],!0)}}}const Je=new Uint16Array(U);B=new DataView(P.buffer);for(let Ie=0;Ie<z;++Ie){F[v.idx[Ie]].decoded=!0;const ut=F[v.idx[Ie]].type;if(F[Ie].type==2)for(let xt=0;xt<V;++xt){const st=we[Ie][xt];for(let rt=0;rt<U;++rt)Je[rt]=B.getUint16(st+rt*2*ut,!0);for(let rt=0;rt<U;++rt)B.setFloat32(st+rt*2*ut,K(Je[rt]),!0)}}}function nt(v,R,F){let y,b=1;for(;b<64;)y=R[v.value],y==65280?b=64:y>>8==255?b+=y&255:(F[b]=y,b++),v.value++}function Fe(v,R){R[0]=K(v[0]),R[1]=K(v[1]),R[2]=K(v[5]),R[3]=K(v[6]),R[4]=K(v[14]),R[5]=K(v[15]),R[6]=K(v[27]),R[7]=K(v[28]),R[8]=K(v[2]),R[9]=K(v[4]),R[10]=K(v[7]),R[11]=K(v[13]),R[12]=K(v[16]),R[13]=K(v[26]),R[14]=K(v[29]),R[15]=K(v[42]),R[16]=K(v[3]),R[17]=K(v[8]),R[18]=K(v[12]),R[19]=K(v[17]),R[20]=K(v[25]),R[21]=K(v[30]),R[22]=K(v[41]),R[23]=K(v[43]),R[24]=K(v[9]),R[25]=K(v[11]),R[26]=K(v[18]),R[27]=K(v[24]),R[28]=K(v[31]),R[29]=K(v[40]),R[30]=K(v[44]),R[31]=K(v[53]),R[32]=K(v[10]),R[33]=K(v[19]),R[34]=K(v[23]),R[35]=K(v[32]),R[36]=K(v[39]),R[37]=K(v[45]),R[38]=K(v[52]),R[39]=K(v[54]),R[40]=K(v[20]),R[41]=K(v[22]),R[42]=K(v[33]),R[43]=K(v[38]),R[44]=K(v[46]),R[45]=K(v[51]),R[46]=K(v[55]),R[47]=K(v[60]),R[48]=K(v[21]),R[49]=K(v[34]),R[50]=K(v[37]),R[51]=K(v[47]),R[52]=K(v[50]),R[53]=K(v[56]),R[54]=K(v[59]),R[55]=K(v[61]),R[56]=K(v[35]),R[57]=K(v[36]),R[58]=K(v[48]),R[59]=K(v[49]),R[60]=K(v[57]),R[61]=K(v[58]),R[62]=K(v[62]),R[63]=K(v[63])}function mt(v){const R=.5*Math.cos(.7853975),F=.5*Math.cos(3.14159/16),y=.5*Math.cos(3.14159/8),b=.5*Math.cos(3*3.14159/16),P=.5*Math.cos(5*3.14159/16),B=.5*Math.cos(3*3.14159/8),U=.5*Math.cos(7*3.14159/16),V=new Array(4),z=new Array(4),W=new Array(4),Z=new Array(4);for(let ae=0;ae<8;++ae){const oe=ae*8;V[0]=y*v[oe+2],V[1]=B*v[oe+2],V[2]=y*v[oe+6],V[3]=B*v[oe+6],z[0]=F*v[oe+1]+b*v[oe+3]+P*v[oe+5]+U*v[oe+7],z[1]=b*v[oe+1]-U*v[oe+3]-F*v[oe+5]-P*v[oe+7],z[2]=P*v[oe+1]-F*v[oe+3]+U*v[oe+5]+b*v[oe+7],z[3]=U*v[oe+1]-P*v[oe+3]+b*v[oe+5]-F*v[oe+7],W[0]=R*(v[oe+0]+v[oe+4]),W[3]=R*(v[oe+0]-v[oe+4]),W[1]=V[0]+V[3],W[2]=V[1]-V[2],Z[0]=W[0]+W[1],Z[1]=W[3]+W[2],Z[2]=W[3]-W[2],Z[3]=W[0]-W[1],v[oe+0]=Z[0]+z[0],v[oe+1]=Z[1]+z[1],v[oe+2]=Z[2]+z[2],v[oe+3]=Z[3]+z[3],v[oe+4]=Z[3]-z[3],v[oe+5]=Z[2]-z[2],v[oe+6]=Z[1]-z[1],v[oe+7]=Z[0]-z[0]}for(let ae=0;ae<8;++ae)V[0]=y*v[16+ae],V[1]=B*v[16+ae],V[2]=y*v[48+ae],V[3]=B*v[48+ae],z[0]=F*v[8+ae]+b*v[24+ae]+P*v[40+ae]+U*v[56+ae],z[1]=b*v[8+ae]-U*v[24+ae]-F*v[40+ae]-P*v[56+ae],z[2]=P*v[8+ae]-F*v[24+ae]+U*v[40+ae]+b*v[56+ae],z[3]=U*v[8+ae]-P*v[24+ae]+b*v[40+ae]-F*v[56+ae],W[0]=R*(v[ae]+v[32+ae]),W[3]=R*(v[ae]-v[32+ae]),W[1]=V[0]+V[3],W[2]=V[1]-V[2],Z[0]=W[0]+W[1],Z[1]=W[3]+W[2],Z[2]=W[3]-W[2],Z[3]=W[0]-W[1],v[0+ae]=Z[0]+z[0],v[8+ae]=Z[1]+z[1],v[16+ae]=Z[2]+z[2],v[24+ae]=Z[3]+z[3],v[32+ae]=Z[3]-z[3],v[40+ae]=Z[2]-z[2],v[48+ae]=Z[1]-z[1],v[56+ae]=Z[0]-z[0]}function Ue(v){for(let R=0;R<64;++R){const F=v[0][R],y=v[1][R],b=v[2][R];v[0][R]=F+1.5747*b,v[1][R]=F-.1873*y-.4682*b,v[2][R]=F+1.8556*y}}function D(v,R,F){for(let y=0;y<64;++y)R[F+y]=Ju.toHalfFloat(C(v[y]))}function C(v){return v<=1?Math.sign(v)*Math.pow(Math.abs(v),2.2):Math.sign(v)*Math.pow(A,Math.abs(v)-1)}function X(v){return new DataView(v.array.buffer,v.offset.value,v.size)}function se(v){const R=v.viewer.buffer.slice(v.offset.value,v.offset.value+v.size),F=new Uint8Array(Bt(R)),y=new Uint8Array(F.length);return Ze(F),G(F,y),new DataView(y.buffer)}function ue(v){const R=v.array.slice(v.offset.value,v.offset.value+v.size),F=Ar(R),y=new Uint8Array(F.length);return Ze(F),G(F,y),new DataView(y.buffer)}function ne(v){const R=v.viewer,F={value:v.offset.value},y=new Uint16Array(v.columns*v.lines*(v.inputChannels.length*v.type)),b=new Uint8Array(8192);let P=0;const B=new Array(v.inputChannels.length);for(let ce=0,de=v.inputChannels.length;ce<de;ce++)B[ce]={},B[ce].start=P,B[ce].end=B[ce].start,B[ce].nx=v.columns,B[ce].ny=v.lines,B[ce].size=v.type,P+=B[ce].nx*B[ce].ny*B[ce].size;const U=Q(R,F),V=Q(R,F);if(V>=8192)throw new Error("Something is wrong with PIZ_COMPRESSION BITMAP_SIZE");if(U<=V)for(let ce=0;ce<V-U+1;ce++)b[ce+U]=$e(R,F);const z=new Uint16Array(65536),W=x(b,z),Z=Ne(R,F);pt(v.array,R,F,Z,y,P);for(let ce=0;ce<v.inputChannels.length;++ce){const de=B[ce];for(let he=0;he<B[ce].size;++he)tt(y,de.start+he,de.nx,de.size,de.ny,de.nx*de.size,W)}ft(z,y,P);let ae=0;const oe=new Uint8Array(y.buffer.byteLength);for(let ce=0;ce<v.lines;ce++)for(let de=0;de<v.inputChannels.length;de++){const he=B[de],Re=he.nx*he.size,Ge=new Uint8Array(y.buffer,he.end*2,Re*2);oe.set(Ge,ae),ae+=Re*2,he.end+=Re}return new DataView(oe.buffer)}function De(v){const R=v.array.slice(v.offset.value,v.offset.value+v.size),F=Ar(R),y=v.inputChannels.length*v.lines*v.columns*v.totalBytes,b=new ArrayBuffer(y),P=new DataView(b);let B=0,U=0;const V=new Array(4);for(let z=0;z<v.lines;z++)for(let W=0;W<v.inputChannels.length;W++){let Z=0;switch(v.inputChannels[W].pixelType){case 1:V[0]=B,V[1]=V[0]+v.columns,B=V[1]+v.columns;for(let oe=0;oe<v.columns;++oe){const ce=F[V[0]++]<<8|F[V[1]++];Z+=ce,P.setUint16(U,Z,!0),U+=2}break;case 2:V[0]=B,V[1]=V[0]+v.columns,V[2]=V[1]+v.columns,B=V[2]+v.columns;for(let oe=0;oe<v.columns;++oe){const ce=F[V[0]++]<<24|F[V[1]++]<<16|F[V[2]++]<<8;Z+=ce,P.setUint32(U,Z,!0),U+=4}break}}return P}function Se(v){const R=v.viewer,F={value:v.offset.value},y=new Uint8Array(v.columns*v.lines*(v.inputChannels.length*v.type*2)),b={version:ke(R,F),unknownUncompressedSize:ke(R,F),unknownCompressedSize:ke(R,F),acCompressedSize:ke(R,F),dcCompressedSize:ke(R,F),rleCompressedSize:ke(R,F),rleUncompressedSize:ke(R,F),rleRawSize:ke(R,F),totalAcUncompressedCount:ke(R,F),totalDcUncompressedCount:ke(R,F),acCompression:ke(R,F)};if(b.version<2)throw new Error("EXRLoader.parse: "+Rn.compression+" version "+b.version+" is unsupported");const P=new Array;let B=Q(R,F)-2;for(;B>0;){const de=Oe(R.buffer,F),he=$e(R,F),Re=he>>2&3,Ge=(he>>4)-1,Le=new Int8Array([Ge])[0],we=$e(R,F);P.push({name:de,index:Le,type:we,compression:Re}),B-=de.length+3}const U=Rn.channels,V=new Array(v.inputChannels.length);for(let de=0;de<v.inputChannels.length;++de){const he=V[de]={},Re=U[de];he.name=Re.name,he.compression=0,he.decoded=!1,he.type=Re.pixelType,he.pLinear=Re.pLinear,he.width=v.columns,he.height=v.lines}const z={idx:new Array(3)};for(let de=0;de<v.inputChannels.length;++de){const he=V[de];for(let Re=0;Re<P.length;++Re){const Ge=P[Re];he.name==Ge.name&&(he.compression=Ge.compression,Ge.index>=0&&(z.idx[Ge.index]=de),he.offset=de)}}let W,Z,ae;if(b.acCompressedSize>0)switch(b.acCompression){case 0:W=new Uint16Array(b.totalAcUncompressedCount),pt(v.array,R,F,b.acCompressedSize,W,b.totalAcUncompressedCount);break;case 1:const de=v.array.slice(F.value,F.value+b.totalAcUncompressedCount),he=Ar(de);W=new Uint16Array(he.buffer),F.value+=b.totalAcUncompressedCount;break}if(b.dcCompressedSize>0){const de={array:v.array,offset:F,size:b.dcCompressedSize};Z=new Uint16Array(ue(de).buffer),F.value+=b.dcCompressedSize}if(b.rleRawSize>0){const de=v.array.slice(F.value,F.value+b.rleCompressedSize),he=Ar(de);ae=Bt(he.buffer),F.value+=b.rleCompressedSize}let oe=0;const ce=new Array(V.length);for(let de=0;de<ce.length;++de)ce[de]=new Array;for(let de=0;de<v.lines;++de)for(let he=0;he<V.length;++he)ce[he].push(oe),oe+=V[he].width*v.type*2;ot(z,ce,V,W,Z,y);for(let de=0;de<V.length;++de){const he=V[de];if(!he.decoded)switch(he.compression){case 2:let Re=0,Ge=0;for(let Le=0;Le<v.lines;++Le){let we=ce[de][Re];for(let Je=0;Je<he.width;++Je){for(let Ie=0;Ie<2*he.type;++Ie)y[we++]=ae[Ge+Ie*he.width*he.height];Ge++}Re++}break;case 1:default:throw new Error("EXRLoader.parse: unsupported channel compression")}}return new DataView(y.buffer)}function Oe(v,R){const F=new Uint8Array(v);let y=0;for(;F[R.value+y]!=0;)y+=1;const b=new TextDecoder().decode(F.slice(R.value,R.value+y));return R.value=R.value+y+1,b}function ze(v,R,F){const y=new TextDecoder().decode(new Uint8Array(v).slice(R.value,R.value+F));return R.value=R.value+F,y}function fe(v,R){const F=be(v,R),y=Ne(v,R);return[F,y]}function Ce(v,R){const F=Ne(v,R),y=Ne(v,R);return[F,y]}function be(v,R){const F=v.getInt32(R.value,!0);return R.value=R.value+4,F}function Ne(v,R){const F=v.getUint32(R.value,!0);return R.value=R.value+4,F}function Ae(v,R){const F=v[R.value];return R.value=R.value+1,F}function $e(v,R){const F=v.getUint8(R.value);return R.value=R.value+1,F}const ke=function(v,R){let F;return"getBigInt64"in DataView.prototype?F=Number(v.getBigInt64(R.value,!0)):F=v.getUint32(R.value+4,!0)+Number(v.getUint32(R.value,!0)<<32),R.value+=8,F};function Xe(v,R){const F=v.getFloat32(R.value,!0);return R.value+=4,F}function H(v,R){return Ju.toHalfFloat(Xe(v,R))}function K(v){const R=(v&31744)>>10,F=v&1023;return(v>>15?-1:1)*(R?R===31?F?NaN:1/0:Math.pow(2,R-15)*(1+F/1024):6103515625e-14*(F/1024))}function Q(v,R){const F=v.getUint16(R.value,!0);return R.value+=2,F}function le(v,R){return K(Q(v,R))}function xe(v,R,F,y){const b=F.value,P=[];for(;F.value<b+y-1;){const B=Oe(R,F),U=be(v,F),V=$e(v,F);F.value+=3;const z=be(v,F),W=be(v,F);P.push({name:B,pixelType:U,pLinear:V,xSampling:z,ySampling:W})}return F.value+=1,P}function Te(v,R){const F=Xe(v,R),y=Xe(v,R),b=Xe(v,R),P=Xe(v,R),B=Xe(v,R),U=Xe(v,R),V=Xe(v,R),z=Xe(v,R);return{redX:F,redY:y,greenX:b,greenY:P,blueX:B,blueY:U,whiteX:V,whiteY:z}}function Ye(v,R){const F=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],y=$e(v,R);return F[y]}function vt(v,R){const F=be(v,R),y=be(v,R),b=be(v,R),P=be(v,R);return{xMin:F,yMin:y,xMax:b,yMax:P}}function Rt(v,R){const F=["INCREASING_Y","DECREASING_Y","RANDOM_Y"],y=$e(v,R);return F[y]}function ct(v,R){const F=["ENVMAP_LATLONG","ENVMAP_CUBE"],y=$e(v,R);return F[y]}function Yt(v,R){const F=["ONE_LEVEL","MIPMAP_LEVELS","RIPMAP_LEVELS"],y=["ROUND_DOWN","ROUND_UP"],b=Ne(v,R),P=Ne(v,R),B=$e(v,R);return{xSize:b,ySize:P,levelMode:F[B&15],roundingMode:y[B>>4]}}function un(v,R){const F=Xe(v,R),y=Xe(v,R);return[F,y]}function Xo(v,R){const F=Xe(v,R),y=Xe(v,R),b=Xe(v,R);return[F,y,b]}function Yo(v,R,F,y,b){if(y==="string"||y==="stringvector"||y==="iccProfile")return ze(R,F,b);if(y==="chlist")return xe(v,R,F,b);if(y==="chromaticities")return Te(v,F);if(y==="compression")return Ye(v,F);if(y==="box2i")return vt(v,F);if(y==="envmap")return ct(v,F);if(y==="tiledesc")return Yt(v,F);if(y==="lineOrder")return Rt(v,F);if(y==="float")return Xe(v,F);if(y==="v2f")return un(v,F);if(y==="v3f")return Xo(v,F);if(y==="int")return be(v,F);if(y==="rational")return fe(v,F);if(y==="timecode")return Ce(v,F);if(y==="preview")return F.value+=b,"skipped";F.value+=b}function wn(v,R){const F=Math.log2(v);return R=="ROUND_DOWN"?Math.floor(F):Math.ceil(F)}function ho(v,R,F){let y=0;switch(v.levelMode){case"ONE_LEVEL":y=1;break;case"MIPMAP_LEVELS":y=wn(Math.max(R,F),v.roundingMode)+1;break;case"RIPMAP_LEVELS":throw new Error("THREE.EXRLoader: RIPMAP_LEVELS tiles currently unsupported.")}return y}function po(v,R,F,y){const b=new Array(v);for(let P=0;P<v;P++){const B=1<<P;let U=R/B|0;y=="ROUND_UP"&&U*B<R&&(U+=1);const V=Math.max(U,1);b[P]=(V+F-1)/F|0}return b}function Jo(){const v=this,R=v.offset,F={value:0};for(let y=0;y<v.tileCount;y++){const b=be(v.viewer,R),P=be(v.viewer,R);R.value+=8,v.size=Ne(v.viewer,R);const B=b*v.blockWidth,U=P*v.blockHeight;v.columns=B+v.blockWidth>v.width?v.width-B:v.blockWidth,v.lines=U+v.blockHeight>v.height?v.height-U:v.blockHeight;const V=v.columns*v.totalBytes,W=v.size<v.lines*V?v.uncompress(v):X(v);R.value+=v.size;for(let Z=0;Z<v.lines;Z++){const ae=Z*v.columns*v.totalBytes;for(let oe=0;oe<v.inputChannels.length;oe++){const ce=Rn.channels[oe].name,de=v.channelByteOffsets[ce]*v.columns,he=v.decodeChannels[ce];if(he===void 0)continue;F.value=ae+de;const Re=(v.height-(1+U+Z))*v.outLineWidth;for(let Ge=0;Ge<v.columns;Ge++){const Le=Re+(Ge+B)*v.outputChannels+he;v.byteArray[Le]=v.getter(W,F)}}}}}function Ai(){const v=this,R=v.offset,F={value:0};for(let y=0;y<v.height/v.blockHeight;y++){const b=be(v.viewer,R)-Rn.dataWindow.yMin;v.size=Ne(v.viewer,R),v.lines=b+v.blockHeight>v.height?v.height-b:v.blockHeight;const P=v.columns*v.totalBytes,U=v.size<v.lines*P?v.uncompress(v):X(v);R.value+=v.size;for(let V=0;V<v.blockHeight;V++){const z=y*v.blockHeight,W=V+v.scanOrder(z);if(W>=v.height)continue;const Z=V*P,ae=(v.height-1-W)*v.outLineWidth;for(let oe=0;oe<v.inputChannels.length;oe++){const ce=Rn.channels[oe].name,de=v.channelByteOffsets[ce]*v.columns,he=v.decodeChannels[ce];if(he!==void 0){F.value=Z+de;for(let Re=0;Re<v.columns;Re++){const Ge=ae+Re*v.outputChannels+he;v.byteArray[Ge]=v.getter(U,F)}}}}}}function Ko(v,R,F){const y={};if(v.getUint32(0,!0)!=20000630)throw new Error("THREE.EXRLoader: Provided file doesn't appear to be in OpenEXR format.");y.version=v.getUint8(4);const b=v.getUint8(5);y.spec={singleTile:!!(b&2),longName:!!(b&4),deepFormat:!!(b&8),multiPart:!!(b&16)},F.value=8;let P=!0;for(;P;){const B=Oe(R,F);if(B==="")P=!1;else{const U=Oe(R,F),V=Ne(v,F),z=Yo(v,R,F,U,V);z===void 0?console.warn(`THREE.EXRLoader: Skipped unknown header attribute type '${U}'.`):y[B]=z}}if((b&-7)!=0)throw console.error("THREE.EXRHeader:",y),new Error("THREE.EXRLoader: Provided file is currently unsupported.");return y}function Ci(v,R,F,y,b){const P={size:0,viewer:R,array:F,offset:y,width:v.dataWindow.xMax-v.dataWindow.xMin+1,height:v.dataWindow.yMax-v.dataWindow.yMin+1,inputChannels:v.channels,channelByteOffsets:{},scanOrder:null,totalBytes:null,columns:null,lines:null,type:null,uncompress:null,getter:null,format:null,colorSpace:ri};switch(v.compression){case"NO_COMPRESSION":P.blockHeight=1,P.uncompress=X;break;case"RLE_COMPRESSION":P.blockHeight=1,P.uncompress=se;break;case"ZIPS_COMPRESSION":P.blockHeight=1,P.uncompress=ue;break;case"ZIP_COMPRESSION":P.blockHeight=16,P.uncompress=ue;break;case"PIZ_COMPRESSION":P.blockHeight=32,P.uncompress=ne;break;case"PXR24_COMPRESSION":P.blockHeight=16,P.uncompress=De;break;case"DWAA_COMPRESSION":P.blockHeight=32,P.uncompress=Se;break;case"DWAB_COMPRESSION":P.blockHeight=256,P.uncompress=Se;break;default:throw new Error("EXRLoader.parse: "+v.compression+" is unsupported")}const B={};for(const W of v.channels)switch(W.name){case"Y":case"R":case"G":case"B":case"A":B[W.name]=!0,P.type=W.pixelType}let U=!1;if(B.R&&B.G&&B.B)U=!B.A,P.outputChannels=4,P.decodeChannels={R:0,G:1,B:2,A:3};else if(B.Y)P.outputChannels=1,P.decodeChannels={Y:0};else throw new Error("EXRLoader.parse: file contains unsupported data channels.");if(P.type==1)switch(b){case rn:P.getter=le;break;case jt:P.getter=Q;break}else if(P.type==2)switch(b){case rn:P.getter=Xe;break;case jt:P.getter=H}else throw new Error("EXRLoader.parse: unsupported pixelType "+P.type+" for "+v.compression+".");P.columns=P.width;const V=P.width*P.height*P.outputChannels;switch(b){case rn:P.byteArray=new Float32Array(V),U&&P.byteArray.fill(1,0,V);break;case jt:P.byteArray=new Uint16Array(V),U&&P.byteArray.fill(15360,0,V);break;default:console.error("THREE.EXRLoader: unsupported type: ",b);break}let z=0;for(const W of v.channels)P.decodeChannels[W.name]!==void 0&&(P.channelByteOffsets[W.name]=z),z+=W.pixelType*2;if(P.totalBytes=z,P.outLineWidth=P.width*P.outputChannels,v.lineOrder==="INCREASING_Y"?P.scanOrder=W=>W:P.scanOrder=W=>P.height-1-W,P.outputChannels==4?(P.format=sn,P.colorSpace=ri):(P.format=Cl,P.colorSpace=Bn),v.spec.singleTile){P.blockHeight=v.tiles.ySize,P.blockWidth=v.tiles.xSize;const W=ho(v.tiles,P.width,P.height),Z=po(W,P.width,v.tiles.xSize,v.tiles.roundingMode),ae=po(W,P.height,v.tiles.ySize,v.tiles.roundingMode);P.tileCount=Z[0]*ae[0];for(let oe=0;oe<W;oe++)for(let ce=0;ce<ae[oe];ce++)for(let de=0;de<Z[oe];de++)ke(R,y);P.decode=Jo.bind(P)}else{P.blockWidth=P.width;const W=Math.ceil(P.height/P.blockHeight);for(let Z=0;Z<W;Z++)ke(R,y);P.decode=Ai.bind(P)}return P}const mo={value:0},go=new DataView(e),ds=new Uint8Array(e),Rn=Ko(go,e,mo),$n=Ci(Rn,go,ds,mo,this.type);return $n.decode(),{header:Rn,width:$n.width,height:$n.height,data:$n.byteArray,format:$n.format,colorSpace:$n.colorSpace,type:this.type}}setDataType(e){return this.type=e,this}load(e,t,i,o){function r(s,a){s.colorSpace=a.colorSpace,s.minFilter=Gt,s.magFilter=Gt,s.generateMipmaps=!1,s.flipY=!1,t&&t(s,a)}return super.load(e,r,i,o)}}const Fr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class $o{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const jC=new ah(-1,1,1,-1,0,1);class ew extends xn{constructor(){super(),this.setAttribute("position",new ln([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ln([0,2,0,0,2,0],2))}}const tw=new ew;class yh{constructor(e){this._mesh=new an(tw,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jC)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Sh extends $o{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Kr.clone(e.uniforms),this.material=new Vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new yh(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Nd extends $o{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const o=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),r.buffers.stencil.setFunc(o.ALWAYS,s,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(o.EQUAL,1,4294967295),r.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),r.buffers.stencil.setLocked(!0)}}class nw extends $o{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class iw{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new We);this._width=i.width,this._height=i.height,t=new yn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:jt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Sh(Fr),this.copyPass.material.blending=Vn,this.clock=new jE}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let o=0,r=this.passes.length;o<r;o++){const s=this.passes[o];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),s.needsSwap){if(i){const a=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Nd!==void 0&&(s instanceof Nd?i=!0:s instanceof nw&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new We);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(i,o),this.renderTarget2.setSize(i,o);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ow extends $o{constructor(e,t,i=null,o=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=o,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new et}render(e,t,i){const o=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=o}}const rw={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new et(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class io extends $o{constructor(e,t=1,i,o){super(),this.strength=t,this.radius=i,this.threshold=o,this.resolution=e!==void 0?new We(e.x,e.y):new We(256,256),this.clearColor=new et(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new yn(r,s,{type:jt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const h=new yn(r,s,{type:jt});h.texture.name="UnrealBloomPass.h"+f,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const p=new yn(r,s,{type:jt});p.texture.name="UnrealBloomPass.v"+f,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),s=Math.round(s/2)}const a=rw;this.highPassUniforms=Kr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Vt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(u[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new We(1/r,1/s),r=Math.round(r/2),s=Math.round(s/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new q(1,1,1),new q(1,1,1),new q(1,1,1),new q(1,1,1),new q(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Kr.clone(Fr.uniforms),this.blendMaterial=new Vt({uniforms:this.copyUniforms,vertexShader:Fr.vertexShader,fragmentShader:Fr.fragmentShader,blending:qr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new et,this._oldClearAlpha=1,this._basic=new Pl,this._fsQuad=new yh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),o=Math.round(t/2);this.renderTargetBright.setSize(i,o);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,o),this.renderTargetsVertical[r].setSize(i,o),this.separableBlurMaterials[r].uniforms.invSize.value=new We(1/i,1/o),i=Math.round(i/2),o=Math.round(o/2)}render(e,t,i,o,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this._fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[u].uniforms.direction.value=io.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=io.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[u];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=s}_getSeparableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new Vt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new We(.5,.5)},direction:{value:new We(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Vt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}io.BlurDirectionX=new We(1,0);io.BlurDirectionY=new We(0,1);const sw={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new We(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/const aw=`precision highp float;

in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`,lw=`precision highp float;

out vec4 fragmentColor;

uniform vec2 resolution;
uniform float rand;

void main() {
  float aspectRatio = resolution.x / resolution.y; 
  vec2 vUv = gl_FragCoord.xy / resolution;
  float noise = (fract(sin(dot(vUv, vec2(12.9898 + rand,78.233)*2.0)) * 43758.5453));

  vUv -= .5;
  vUv.x *= aspectRatio;

  float factor = 4.;
  float d = factor * length(vUv);
  vec3 from = vec3(3.) / 255.;
  vec3 to = vec3(16., 12., 20.) / 2550.;

  fragmentColor = vec4(mix(from, to, d) + .005 * noise, 1.);
}
`;/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/const cw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
  varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform float time;

uniform vec4 inputData;
uniform vec4 outputData;

vec3 calc( vec3 pos ) {

  vec3 dir = normalize( pos );
  vec3 p = dir + vec3( time, 0., 0. );
  return pos +
    1. * inputData.x * inputData.y * dir * (.5 + .5 * sin(inputData.z * pos.x + time)) +
    1. * outputData.x * outputData.y * dir * (.5 + .5 * sin(outputData.z * pos.y + time))
  ;
}

vec3 spherical( float r, float theta, float phi ) {
  return r * vec3(
    cos( theta ) * cos( phi ),
    sin( theta ) * cos( phi ),
    sin( phi )
  );
}

void main() {
  #include <uv_vertex>
  #include <color_vertex>
  #include <morphinstance_vertex>
  #include <morphcolor_vertex>
  #include <batching_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>

  float inc = 0.001;

  float r = length( position );
  float theta = ( uv.x + 0.5 ) * 2. * PI;
  float phi = -( uv.y + 0.5 ) * PI;

  vec3 np = calc( spherical( r, theta, phi )  );

  vec3 tangent = normalize( calc( spherical( r, theta + inc, phi ) ) - np );
  vec3 bitangent = normalize( calc( spherical( r, theta, phi + inc ) ) - np );
  transformedNormal = -normalMatrix * normalize( cross( tangent, bitangent ) );

  vNormal = normalize( transformedNormal );

  transformed = np;

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  vViewPosition = - mvPosition.xyz;
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>
  #ifdef USE_TRANSMISSION
    vWorldPosition = worldPosition.xyz;
  #endif
}`;var uw=Object.defineProperty,dw=Object.getOwnPropertyDescriptor,us=(n,e,t,i)=>{for(var o=i>1?void 0:i?dw(e,t):e,r=n.length-1,s;r>=0;r--)(s=n[r])&&(o=(i?s(e,t,o):s(o))||o);return i&&o&&uw(e,t,o),o};let oo=class extends Yi{constructor(){super(...arguments),this.lights=[],this.lastThresholdTime=0,this.prevTime=0,this.hueOffset=0,this.rotation=new q(0,0,0),this.isWakeWordListening=!1}set outputNode(n){this._outputNode=n,this.outputAnalyser=new Pu(this._outputNode)}get outputNode(){return this._outputNode}set inputNode(n){this._inputNode=n,this.inputAnalyser=new Pu(this._inputNode)}get inputNode(){return this._inputNode}connectedCallback(){super.connectedCallback()}init(){const n=new LE;n.background=new et(1051668);const e=new an(new Zr(10,5),new GE({uniforms:{resolution:{value:new We(1,1)},rand:{value:0}},vertexShader:aw,fragmentShader:lw,glslVersion:nl}));e.material.side=Ht,n.add(e),this.backdrop=e;const t=new Zt(75,window.innerWidth/window.innerHeight,.1,1e3);t.position.set(2,-2,5),this.camera=t;const i=new FC({canvas:this.canvas,antialias:!1});i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(window.devicePixelRatio/1);const o=new Zr(1,10);new QC().load("piz_compressed.exr",T=>{T.mapping=$r;const M=r.fromEquirectangular(T);s.envMap=M.texture,a.visible=!0});const r=new rl(i);r.compileEquirectangularShader();const s=new VE({color:16,metalness:.5,roughness:.1,emissive:16,emissiveIntensity:1.5});s.onBeforeCompile=T=>{T.uniforms.time={value:0},T.uniforms.inputData={value:new dt},T.uniforms.outputData={value:new dt},s.userData.shader=T,T.vertexShader=cw};const a=new an(o,s);n.add(a),a.visible=!1,this.sphere=a;const u=1e3,c=new xn;this.particlePositions=new Float32Array(u*3),this.particleVelocities=new Float32Array(u*3);for(let T=0;T<u;T++)this.particlePositions[T*3]=(Math.random()-.5)*10,this.particlePositions[T*3+1]=(Math.random()-.5)*10,this.particlePositions[T*3+2]=(Math.random()-.5)*10,this.particleVelocities[T*3]=(Math.random()-.5)*.02,this.particleVelocities[T*3+1]=(Math.random()-.5)*.02,this.particleVelocities[T*3+2]=(Math.random()-.5)*.02;c.setAttribute("position",new Sn(this.particlePositions,3));const f=new oh({color:16777215,size:.05,transparent:!0,opacity:.5,blending:qr,depthWrite:!1});this.particles=new kE(c,f),n.add(this.particles);const h=new ad(3900150,10,10),p=new ad(15680580,10,10);n.add(h),n.add(p),this.lights.push(h,p);const m=new ZE(1052688);n.add(m);const S=new ow(n,t),E=new io(new We(window.innerWidth,window.innerHeight),5,.5,0),_=new Sh(sw),g=new iw(i);g.addPass(S),g.addPass(E),this.composer=g,this.bloomPass=E;function w(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix();const T=i.getPixelRatio(),M=window.innerWidth,L=window.innerHeight;e.material.uniforms.resolution.value.set(M*T,L*T),i.setSize(M,L),g.setSize(M,L),_.material.uniforms.resolution.value.set(1/(M*T),1/(L*T))}window.addEventListener("resize",w),w(),this.animation()}animation(){requestAnimationFrame(()=>this.animation()),this.inputAnalyser.update(),this.outputAnalyser.update();const n=performance.now(),e=(n-this.prevTime)/(1e3/60);this.prevTime=n;const t=(this.inputAnalyser.data[0]+this.outputAnalyser.data[0])/510;this.hueOffset+=e*.001*(1+t*5);const i=this.backdrop.material,o=this.sphere.material;if(i.uniforms.rand.value=Math.random()*1e4,o.userData.shader){const r=(A,x,O)=>{let Y=0;for(let $=x;$<=O;$++)Y+=A[$];return Y/(O-x+1)/255};r(this.inputAnalyser.data,0,3);const s=r(this.inputAnalyser.data,4,9),a=r(this.inputAnalyser.data,10,15);r(this.outputAnalyser.data,0,3);const u=r(this.outputAnalyser.data,4,9),c=r(this.outputAnalyser.data,10,15),f=.001;this.rotation.x+=e*f*.5*this.outputAnalyser.data[1]/255,this.rotation.z+=e*f*.5*this.inputAnalyser.data[1]/255,this.rotation.y+=e*f*.25*this.inputAnalyser.data[2]/255,this.rotation.y+=e*f*.25*this.outputAnalyser.data[2]/255;const h=new En(this.rotation.x,this.rotation.y,this.rotation.z),p=new co().setFromEuler(h),m=new q(0,0,5);m.applyQuaternion(p),this.camera.position.copy(m),this.camera.lookAt(this.sphere.position),o.userData.shader.uniforms.time.value+=e*.1*this.outputAnalyser.data[0]/255,o.userData.shader.uniforms.inputData.value.set(2.5*this.inputAnalyser.data[0]/255,.2*this.inputAnalyser.data[1]/255,15*this.inputAnalyser.data[2]/255,0),o.userData.shader.uniforms.outputData.value.set(2*this.outputAnalyser.data[0]/255,.1*this.outputAnalyser.data[1]/255,10*this.outputAnalyser.data[2]/255,0);const S=this.inputAnalyser.data[0]/255,E=this.outputAnalyser.data[0]/255;if(this.sphere.scale.setScalar(1+.2*E+.15*S),this.isWakeWordListening&&!S&&!E){const A=Math.sin(n*.002)*.5+.5;this.lights[0].intensity=2+10*A,this.lights[1].intensity=2+10*A,this.lights[0].color.setHSL(.5,1,.5),this.lights[1].color.setHSL(.5,1,.5)}else this.lights[0].intensity=5+50*E,this.lights[1].intensity=5+50*S;const _=n*.001;this.lights[0].position.set(Math.cos(_)*3,Math.sin(_*.5)*3,Math.sin(_)*3),this.lights[1].position.set(Math.sin(_*.7)*4,Math.cos(_*.3)*4,Math.cos(_*.5)*4);const g=(.6+this.hueOffset+u*.2)%1,w=(.95+this.hueOffset+s*.2)%1;o.emissive.setHSL(g,.8,.1+.4*E),o.emissiveIntensity=1.5+5*E,o.color.setHSL(w,.8,.05+.3*S),this.lights[0].color.setHSL(g,.9,.5),this.lights[1].color.setHSL(w,.9,.5),this.bloomPass.strength=1.5+4*E+2*S,this.isWakeWordListening&&!S&&!E&&(this.bloomPass.strength+=Math.sin(n*.005)*.5+.5);const T=this.particles.geometry.attributes.position.array,M=this.particles.material,L=(S+E)*.5;M.opacity=.1+.9*L;const I=(this.hueOffset+(S>E?w:g))%1;M.color.setHSL(I,.8,.4+.6*E),M.size=.01+.15*(S+E+a+c);const N=1+15*L,k=3*L;for(let A=0;A<T.length/3;A++){const x=A*3,O=T[x],Y=T[x+1],$=T[x+2],j=-$*k*.05,ie=O*k*.05;T[x]+=(this.particleVelocities[x]*N+j)*e,T[x+1]+=this.particleVelocities[x+1]*N*e,T[x+2]+=(this.particleVelocities[x+2]*N+ie)*e;const ee=O*O+Y*Y+$*$,re=Math.sqrt(ee),J=.002+.08*L;if(re>8||re<.3||Math.random()<J){const pe=Math.random()*Math.PI*2,ve=Math.random()*Math.PI,Me=.8+Math.random()*.4;T[x]=Me*Math.sin(ve)*Math.cos(pe),T[x+1]=Me*Math.sin(ve)*Math.sin(pe),T[x+2]=Me*Math.cos(ve);const Be=.01+.03*Math.random();this.particleVelocities[x]=T[x]/Me*Be,this.particleVelocities[x+1]=T[x+1]/Me*Be,this.particleVelocities[x+2]=T[x+2]/Me*Be}}this.particles.geometry.attributes.position.needsUpdate=!0,L>.7&&(this.camera.position.x+=(Math.random()-.5)*.15*L,this.camera.position.y+=(Math.random()-.5)*.15*L,this.camera.position.z+=(Math.random()-.5)*.15*L),(S>.8||E>.8)&&n-this.lastThresholdTime>500&&(this.playThresholdSound(),this.lastThresholdTime=n)}this.composer.render()}playThresholdSound(){const n=this.inputNode.context,e=n.createOscillator(),t=n.createGain();e.type="triangle",e.frequency.setValueAtTime(1200+Math.random()*400,n.currentTime),e.frequency.exponentialRampToValueAtTime(2e3,n.currentTime+.05),t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.02,n.currentTime+.01),t.gain.linearRampToValueAtTime(0,n.currentTime+.1),e.connect(t),t.connect(n.destination),e.start(),e.stop(n.currentTime+.1)}firstUpdated(){this.canvas=this.shadowRoot.querySelector("canvas"),this.init()}render(){return Mn`<canvas></canvas>`}};oo.styles=bf`
    canvas {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      inset: 0;
      image-rendering: pixelated;
    }
  `;us([rs({type:Boolean})],oo.prototype,"isWakeWordListening",2);us([rs()],oo.prototype,"outputNode",1);us([rs()],oo.prototype,"inputNode",1);oo=us([Lf("gdm-live-audio-visuals-3d")],oo);var fw=Object.defineProperty,hw=Object.getOwnPropertyDescriptor,wt=(n,e,t,i)=>{for(var o=i>1?void 0:i?hw(e,t):e,r=n.length-1,s;r>=0;r--)(s=n[r])&&(o=(i?s(e,t,o):s(o))||o);return i&&o&&fw(e,t,o),o};let Et=class extends Yi{constructor(){super(),this.isRecording=!1,this.isWakeWordListening=!1,this.isMusicPlaying=!1,this.ambientVolume=.5,this.ambientTrack=0,this.showMusicControls=!1,this.status="",this.error="",this.serverStatus="checking",this.currentUser=null,this.authMode="none",this.authUsername="",this.authPassword="",this.authError="",this.isProcessing=!1,this.memories=[],this.currentTurnTranscript="",this.currentModelTranscript="",this.inputAudioContext=new(window.AudioContext||window.webkitAudioContext)({sampleRate:16e3}),this.outputAudioContext=new(window.AudioContext||window.webkitAudioContext)({sampleRate:24e3}),this.inputNode=this.inputAudioContext.createGain(),this.outputNode=this.outputAudioContext.createGain(),this.nextStartTime=0,this.sources=new Set,this.isModelSpeaking=!1,this.ambientNodes=[],this.initClient()}initAudio(){this.nextStartTime=this.outputAudioContext.currentTime}async initClient(){this.initAudio(),this.initWakeWord(),this.client=new qy({apiKey:"MY_GEMINI_API_KEY"}),this.ambientMasterGain=this.outputAudioContext.createGain(),this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume*.05,this.outputAudioContext.currentTime),this.ambientMasterGain.connect(this.outputAudioContext.destination),this.outputNode.connect(this.outputAudioContext.destination),this.initSession()}initWakeWord(){const n=window.SpeechRecognition||window.webkitSpeechRecognition;if(!n){console.warn("Speech Recognition not supported in this browser.");return}this.recognition=new n,this.recognition.continuous=!0,this.recognition.interimResults=!0,this.recognition.lang="en-US",this.recognition.onresult=e=>{const t=Array.from(e.results).map(i=>i[0]).map(i=>i.transcript).join("").toLowerCase();(t.includes("hey orb")||t.includes("wake up")||t.includes("hello orb")||t.includes("hey google"))&&(this.isRecording||(this.startRecording(),this.playWakeUpSound()))},this.recognition.onend=()=>{this.isWakeWordListening&&!this.isRecording&&this.recognition.start()},this.recognition.onerror=e=>{console.error("Speech recognition error:",e.error),e.error==="not-allowed"&&(this.isWakeWordListening=!1)}}toggleWakeWord(){var n,e;if(this.isWakeWordListening)(n=this.recognition)==null||n.stop(),this.isWakeWordListening=!1,this.updateStatus("Wake word listening disabled.");else try{(e=this.recognition)==null||e.start(),this.isWakeWordListening=!0,this.updateStatus('Listening for "Hey Orb"...')}catch(t){console.error("Failed to start recognition:",t)}}playWakeUpSound(){const n=this.outputAudioContext,e=n.createOscillator(),t=n.createGain();e.type="sine",e.frequency.setValueAtTime(880,n.currentTime),e.frequency.exponentialRampToValueAtTime(1320,n.currentTime+.1),t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.1,n.currentTime+.05),t.gain.linearRampToValueAtTime(0,n.currentTime+.3),e.connect(t),t.connect(n.destination),e.start(),e.stop(n.currentTime+.3)}playResponseSound(){const n=this.outputAudioContext,e=n.createOscillator(),t=n.createGain();e.type="sine",e.frequency.setValueAtTime(440,n.currentTime),e.frequency.exponentialRampToValueAtTime(880,n.currentTime+.1),t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.05,n.currentTime+.05),t.gain.linearRampToValueAtTime(0,n.currentTime+.2),e.connect(t),t.connect(n.destination),e.start(),e.stop(n.currentTime+.2)}async initSession(){if(this.session)try{this.session.close()}catch{}const n="gemini-2.5-flash-native-audio-preview-09-2025",e=[{name:"get_time",description:"Get the current local time and date.",parameters:{type:Xt.OBJECT,properties:{}}},{name:"set_ambient_music",description:"Change the ambient background music track.",parameters:{type:Xt.OBJECT,properties:{track_index:{type:Xt.INTEGER,description:"The index of the track (0: Deep, 1: Ethereal, 2: Cosmic)."}},required:["track_index"]}},{name:"set_ambient_volume",description:"Change the volume of the ambient background music.",parameters:{type:Xt.OBJECT,properties:{volume:{type:Xt.NUMBER,description:"The volume level from 0.0 to 1.0."}},required:["volume"]}},{name:"toggle_recording",description:"Stop the current recording session.",parameters:{type:Xt.OBJECT,properties:{}}}];try{this.session=await this.client.live.connect({model:n,callbacks:{onopen:()=>{this.updateStatus("Opened")},onmessage:async t=>{var r,s,a,u,c,f,h,p,m,S,E;if((s=(r=t.serverContent)==null?void 0:r.inputTranscription)!=null&&s.text&&(this.currentTurnTranscript=t.serverContent.inputTranscription.text),(f=(c=(u=(a=t.serverContent)==null?void 0:a.modelTurn)==null?void 0:u.parts)==null?void 0:c[0])!=null&&f.text&&(this.currentModelTranscript+=t.serverContent.modelTurn.parts[0].text),t.toolCall){const _=[];for(const g of t.toolCall.functionCalls){let w={status:"success"};if(g.name==="get_time")w={time:new Date().toLocaleString()};else if(g.name==="set_ambient_music"){const T=g.args.track_index;T>=0&&T<=2?(this.ambientTrack=T,this.isMusicPlaying&&(this.stopAmbientMusic(),setTimeout(()=>this.startAmbientMusic(),100)),w={status:"success",track:T}):w={status:"error",message:"Invalid track index"}}else if(g.name==="set_ambient_volume"){const T=g.args.volume;this.ambientVolume=Math.max(0,Math.min(1,T)),this.ambientMasterGain&&this.ambientMasterGain.gain.setTargetAtTime(this.ambientVolume*.05,this.outputAudioContext.currentTime,.1),w={status:"success",volume:T}}else g.name==="toggle_recording"&&(this.stopRecording(),w={status:"success"});_.push({id:g.id,name:g.name,response:w})}this.session.sendToolResponse({functionResponses:_})}const i=(m=(p=(h=t.serverContent)==null?void 0:h.modelTurn)==null?void 0:p.parts[0])==null?void 0:m.inlineData;if(i){this.isProcessing=!1,this.isModelSpeaking||(this.isModelSpeaking=!0,this.playResponseSound()),this.nextStartTime=Math.max(this.nextStartTime,this.outputAudioContext.currentTime);const _=await gS(pS(i.data),this.outputAudioContext,24e3,1),g=this.outputAudioContext.createBufferSource();g.buffer=_,g.connect(this.outputNode),g.addEventListener("ended",()=>{this.sources.delete(g)}),g.start(this.nextStartTime),this.nextStartTime=this.nextStartTime+_.duration,this.sources.add(g)}if((S=t.serverContent)!=null&&S.turnComplete&&(this.isModelSpeaking=!1,this.isProcessing=!1,this.currentTurnTranscript&&(this.saveMemory("user",this.currentTurnTranscript),this.currentTurnTranscript=""),this.currentModelTranscript&&(this.saveMemory("assistant",this.currentModelTranscript),this.currentModelTranscript="")),(E=t.serverContent)==null?void 0:E.interrupted){this.isModelSpeaking=!1,this.isProcessing=!1,this.currentModelTranscript&&(this.saveMemory("assistant",this.currentModelTranscript+" (interrupted)"),this.currentModelTranscript="");for(const _ of this.sources.values())_.stop(),this.sources.delete(_);this.nextStartTime=0}},onerror:t=>{this.updateError(t.message)},onclose:t=>{this.updateStatus("Close:"+t.reason)}},config:{systemInstruction:`You are the Orbital Assistant, a helpful and proactive AI agent living inside this interactive 3D orb. 
          You can help users with various tasks, answer questions, and control your own environment.
          
          ${this.memories.length>0?`HISTORY OF PREVIOUS CONVERSATIONS WITH ${this.currentUser}:
          ${this.memories.slice().reverse().map(t=>`[${new Date(t.timestamp).toLocaleDateString()}] ${t.role}: ${t.content}`).join(`
`)}
          
          Use this history to provide context, remember user preferences, and continue previous discussions.`:""}

          Capabilities:
          - You can tell the user the current time.
          - You can change the ambient background music (Deep, Ethereal, or Cosmic).
          - You can adjust the ambient volume.
          - You can stop recording if the user is done talking.
          
          Be concise, friendly, and helpful. Use your voice to express personality.`,responseModalities:[Do.AUDIO],inputAudioTranscription:{},outputAudioTranscription:{},tools:[{functionDeclarations:e}],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:"Orus"}}}}})}catch(t){console.error(t)}}connectedCallback(){super.connectedCallback(),this.checkServer(),this.checkAuth()}async checkAuth(){try{const n=await fetch("/api/auth/me");if(n.ok){const e=await n.json();this.currentUser=e.username,await this.loadUserSettings(),await this.loadMemories(),this.initSession()}}catch{}}async loadMemories(){try{const n=await fetch("/api/memories");n.ok&&(this.memories=await n.json())}catch{}}async saveMemory(n,e){if(!(!this.currentUser||!e.trim()))try{await fetch("/api/memories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:n,content:e})})}catch{}}async loadUserSettings(){try{const n=await fetch("/api/user/settings");if(n.ok){const e=await n.json();e&&(this.ambientVolume=e.ambient_volume,this.ambientTrack=e.ambient_track,this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume,this.outputAudioContext.currentTime))}}catch{}}async saveUserSettings(){if(this.currentUser)try{await fetch("/api/user/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ambient_volume:this.ambientVolume,ambient_track:this.ambientTrack})})}catch{}}async handleAuth(){this.authError="";const n=this.authMode==="login"?"/api/auth/login":"/api/auth/register";try{const e=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.authUsername,password:this.authPassword})}),t=await e.json();e.ok?(this.currentUser=t.username,this.authMode="none",await this.loadUserSettings(),await this.loadMemories(),this.initSession()):this.authError=t.error}catch{this.authError="Connection error"}}async logout(){await fetch("/api/auth/logout",{method:"POST"}),this.currentUser=null,window.location.reload()}async checkServer(){try{(await fetch("/api/health")).ok?this.serverStatus="online":this.serverStatus="offline"}catch{this.serverStatus="offline"}}updateStatus(n){this.status=n}updateError(n){this.error=n}async startRecording(){var n;if(!this.isRecording){this.isProcessing=!1,this.isWakeWordListening&&((n=this.recognition)==null||n.stop()),this.inputAudioContext.resume(),this.updateStatus("Requesting microphone access...");try{this.mediaStream=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1}),this.updateStatus("Microphone access granted. Starting capture..."),this.sourceNode=this.inputAudioContext.createMediaStreamSource(this.mediaStream),this.sourceNode.connect(this.inputNode);const e=256;this.scriptProcessorNode=this.inputAudioContext.createScriptProcessor(e,1,1),this.scriptProcessorNode.onaudioprocess=t=>{if(!this.isRecording)return;const o=t.inputBuffer.getChannelData(0);this.session.sendRealtimeInput({media:mS(o)})},this.sourceNode.connect(this.scriptProcessorNode),this.scriptProcessorNode.connect(this.inputAudioContext.destination),this.isRecording=!0,this.updateStatus("🔴 Recording... Capturing PCM chunks.")}catch(e){console.error("Error starting recording:",e),this.updateStatus(`Error: ${e.message}`),this.stopRecording()}}}stopRecording(){!this.isRecording&&!this.mediaStream&&!this.inputAudioContext||(this.updateStatus("Stopping recording..."),this.isRecording=!1,this.isProcessing=!0,this.isWakeWordListening&&setTimeout(()=>{var n;try{(n=this.recognition)==null||n.start()}catch{}},500),this.scriptProcessorNode&&this.sourceNode&&this.inputAudioContext&&(this.scriptProcessorNode.disconnect(),this.sourceNode.disconnect()),this.scriptProcessorNode=null,this.sourceNode=null,this.mediaStream&&(this.mediaStream.getTracks().forEach(n=>n.stop()),this.mediaStream=null),this.updateStatus("Recording stopped. Click Start to begin again."))}reset(){var n;(n=this.session)==null||n.close(),this.initSession(),this.updateStatus("Session cleared.")}toggleMusic(){this.isMusicPlaying?this.stopAmbientMusic():this.startAmbientMusic(),this.isMusicPlaying=!this.isMusicPlaying}toggleMusicControls(){this.showMusicControls=!this.showMusicControls}handleVolumeChange(n){const e=n.target;this.ambientVolume=parseFloat(e.value),this.ambientMasterGain&&this.ambientMasterGain.gain.setTargetAtTime(this.ambientVolume*.05,this.outputAudioContext.currentTime,.1),this.saveUserSettings()}handleTrackChange(n){const e=n.target;this.ambientTrack=parseInt(e.value),this.isMusicPlaying&&(this.stopAmbientMusic(),setTimeout(()=>this.startAmbientMusic(),1200)),this.saveUserSettings()}startAmbientMusic(){const n=this.outputAudioContext,t=[{name:"Deep",freqs:[65.41,98,130.81,196],type:"sine"},{name:"Ethereal",freqs:[130.81,164.81,196,246.94],type:"triangle"},{name:"Cosmic",freqs:[32.7,49,65.41,82.41],type:"sine"}][this.ambientTrack];t.freqs.forEach((i,o)=>{const r=n.createOscillator(),s=n.createGain(),a=n.createOscillator(),u=n.createGain();r.type=t.type,r.frequency.setValueAtTime(i,n.currentTime),a.type="sine",a.frequency.setValueAtTime(.1+o*.05,n.currentTime),u.gain.setValueAtTime(.02,n.currentTime),s.gain.setValueAtTime(0,n.currentTime),s.gain.linearRampToValueAtTime(1,n.currentTime+2),a.connect(u),u.connect(s.gain),r.connect(s),s.connect(this.ambientMasterGain),r.start(),a.start(),this.ambientNodes.push(r,a,s,u)})}stopAmbientMusic(){const n=this.outputAudioContext;this.ambientNodes.forEach(e=>{e instanceof GainNode&&e.gain.linearRampToValueAtTime(0,n.currentTime+1)}),setTimeout(()=>{this.ambientNodes.forEach(e=>{e instanceof OscillatorNode&&e.stop(),e.disconnect()}),this.ambientNodes=[]},1100)}render(){return Mn`
      <div>
        ${this.currentUser?Mn`
            <div class="user-badge">
              <span>${this.currentUser}</span>
              <button @click=${this.logout}>Logout</button>
            </div>
          `:Mn`
            <div class="user-badge" style="cursor: pointer" @click=${()=>this.authMode="login"}>
              <span>Login to save settings</span>
            </div>
          `}

        ${this.authMode!=="none"?Mn`
          <div class="auth-modal">
            <h2>${this.authMode==="login"?"Login":"Register"}</h2>
            <input 
              type="text" 
              placeholder="Username" 
              .value=${this.authUsername}
              @input=${n=>this.authUsername=n.target.value}
            />
            <input 
              type="password" 
              placeholder="Password" 
              .value=${this.authPassword}
              @input=${n=>this.authPassword=n.target.value}
            />
            ${this.authError?Mn`<div style="color: #f87171; font-size: 12px; margin-bottom: 10px;">${this.authError}</div>`:""}
            <button @click=${this.handleAuth}>
              ${this.authMode==="login"?"Login":"Create Account"}
            </button>
            <div class="switch-mode" @click=${()=>this.authMode=this.authMode==="login"?"register":"login"}>
              ${this.authMode==="login"?"Don't have an account? Register":"Already have an account? Login"}
            </div>
            <div class="switch-mode" @click=${()=>this.authMode="none"}>Cancel</div>
          </div>
        `:""}

        <div class="loader ${this.isProcessing?"visible":""}"></div>

        <button
          class="music-toggle ${this.isMusicPlaying?"active":""}"
          @click=${this.toggleMusic}
          @contextmenu=${n=>{n.preventDefault(),this.toggleMusicControls()}}
          title="Toggle Ambient Music (Right-click for controls)">
          ${this.isMusicPlaying?Mn`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>`:Mn`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z" />
              </svg>`}
        </button>

        <div
          class="music-controls-panel ${this.showMusicControls?"visible":""}">
          <div class="control-group">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              .value=${this.ambientVolume}
              @input=${this.handleVolumeChange} />
          </div>
          <div class="control-group">
            <label>Ambient Track</label>
            <select @change=${this.handleTrackChange} .value=${this.ambientTrack}>
              <option value="0">Deep Pad</option>
              <option value="1">Ethereal Triangle</option>
              <option value="2">Cosmic Sub</option>
            </select>
          </div>
          <button
            style="background: none; border: none; color: white; opacity: 0.5; font-size: 10px; cursor: pointer; padding: 0;"
            @click=${this.toggleMusicControls}>
            Close Controls
          </button>
        </div>

        <div class="controls">
          <button
            class="music-toggle ${this.isWakeWordListening?"active":""}"
            style="position: static; margin-bottom: 10px;"
            @click=${this.toggleWakeWord}
            title="Toggle Voice Wake Up ('Hey Orb')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24px"
              height="24px">
              <path
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path
                d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
          <button
            id="resetButton"
            @click=${this.reset}
            ?disabled=${this.isRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff">
              <path
                d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          <button
            id="startButton"
            @click=${this.startRecording}
            ?disabled=${this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          <button
            id="stopButton"
            @click=${this.stopRecording}
            ?disabled=${!this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="100" height="100" rx="15" />
            </svg>
          </button>
        </div>

        <div id="status">
          ${this.serverStatus==="online"?Mn`<span style="color: #4ade80; font-size: 10px; opacity: 0.8;">● Server Online</span>`:Mn`<span style="color: #f87171; font-size: 10px; opacity: 0.8;">● Server Offline</span>`}
          <br />
          ${this.error}
        </div>
        <gdm-live-audio-visuals-3d
          .inputNode=${this.inputNode}
          .outputNode=${this.outputNode}
          .isWakeWordListening=${this.isWakeWordListening}></gdm-live-audio-visuals-3d>
      </div>
    `}};Et.styles=bf`
    .auth-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 15, 15, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 24px;
      z-index: 100;
      width: 300px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }

    .auth-modal h2 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }

    .auth-modal input {
      width: 100%;
      padding: 12px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      box-sizing: border-box;
    }

    .auth-modal button {
      width: 100%;
      padding: 12px;
      background: white;
      color: black;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }

    .auth-modal .switch-mode {
      text-align: center;
      margin-top: 15px;
      font-size: 12px;
      opacity: 0.6;
      cursor: pointer;
    }

    .user-badge {
      position: fixed;
      top: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 14px;
    }

    .user-badge button {
      background: none;
      border: none;
      color: #f87171;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
    }

    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
    }

    .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 260px;
      height: 260px;
      border: 2px solid transparent;
      border-top-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: spin 2s linear infinite;
      pointer-events: none;
      z-index: 5;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .loader.visible {
      opacity: 1;
    }

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 64px;
        height: 64px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      button[disabled] {
        display: none;
      }

      .music-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 100;

        &.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .music-controls-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 200px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 16px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 16px;
        color: white;
        font-family: sans-serif;
        font-size: 14px;
        transform: translateY(-10px);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;

        &.visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;

          label {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        }

        input[type='range'] {
          width: 100%;
          cursor: pointer;
        }

        select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;

          option {
            background: #1a1a1a;
          }
        }
      }
    }
  `;wt([Ut()],Et.prototype,"isRecording",2);wt([Ut()],Et.prototype,"isWakeWordListening",2);wt([Ut()],Et.prototype,"isMusicPlaying",2);wt([Ut()],Et.prototype,"ambientVolume",2);wt([Ut()],Et.prototype,"ambientTrack",2);wt([Ut()],Et.prototype,"showMusicControls",2);wt([Ut()],Et.prototype,"status",2);wt([Ut()],Et.prototype,"error",2);wt([Ut()],Et.prototype,"serverStatus",2);wt([Ut()],Et.prototype,"currentUser",2);wt([Ut()],Et.prototype,"authMode",2);wt([Ut()],Et.prototype,"authUsername",2);wt([Ut()],Et.prototype,"authPassword",2);wt([Ut()],Et.prototype,"authError",2);wt([Ut()],Et.prototype,"isProcessing",2);wt([Ut()],Et.prototype,"memories",2);wt([Ut()],Et.prototype,"inputNode",2);wt([Ut()],Et.prototype,"outputNode",2);Et=wt([Lf("gdm-live-audio")],Et);
