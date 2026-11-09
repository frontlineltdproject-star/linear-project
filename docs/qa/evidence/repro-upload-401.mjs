import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const client='frontline-forwarding-client/src/';
const serviceSource=readFileSync(client+'features/creation-uploads/creation-upload-service.ts','utf8');
const hookSource=readFileSync(client+'features/creation-uploads/use-staged-files.ts','utf8');
const securitySource=readFileSync(client+'lib/security/security-service.ts','utf8');
const formSource=readFileSync(client+'features/purchase-orders/components/creation/purchase-order-creation-form.tsx','utf8');
const documentSource=readFileSync(client+'features/purchase-orders/components/creation/creation-documents.tsx','utf8');
function compile(s) { return stripTypeScriptTypes(s.replace(/^import[\s\S]*?from [^\n]+\r?\n/gm,'')).replace(/\bexport /g,''); }
for (const scenario of ['open401','upload401','upload403','network','success']) {
 let cells=[], index=0, calls=[];
 const ctx=vm.createContext({URL,FormData,File,Response,crypto,console,
 env:{apiBaseUrl:'https://fixture.invalid/backend-prefix'},
 securityStore:{state:{token:'audit-fixture-only'}, setState(fn){this.state=fn(this.state)}}, writeStoredToken(){},
 useRef(value){const i=index++; return cells[i]??=( {current:value} );},
 useState(value){const i=index++; if(!(i in cells)) cells[i]=value; return [cells[i], v=>{cells[i]=typeof v==='function'?v(cells[i]):v;}];},
 useCallback(fn){return fn;}, useEffect(){},
 fetch:async(url,init)=>{calls.push({url,method:init.method,authorization:init.headers.authorization,multipart:init.body instanceof FormData,contentType:init.headers['Content-Type']});
   if(scenario==='open401' || (init.method==='POST'&&scenario==='upload401'))return new Response('',{status:401});
   if(init.method==='POST'&&scenario==='upload403')return new Response('',{status:403});
   if(init.method==='POST'&&scenario==='network')throw new TypeError('Failed to fetch');
   return new Response(JSON.stringify(init.method==='PUT'?{id:'fixture',state:'OPEN'}:{id:7,state:'READY'}),{status:200});
 }});
 vm.runInContext(compile(securitySource)+compile(serviceSource)+compile(hookSource),ctx);
 const render=()=>{index=0;return vm.runInContext("useStagedFiles('PURCHASE_ORDER')",ctx)};
 let staged=render();staged.add([new File(['fixture'],'fixture.pdf',{type:'application/pdf'})]);
 await new Promise(resolve=>setImmediate(resolve));staged=render();
 assert(calls.every(c=>c.authorization==='Bearer audit-fixture-only'));
 assert(calls.every(c=>new URL(c.url).pathname.startsWith('/api/v1/creation-contexts/')));
 if(scenario==='open401'){assert.equal(calls.length,1);assert.equal(staged.contextId(),null);}
 if(scenario==='upload401'){assert.equal(calls.length,2);assert(staged.contextId());assert.equal(calls[1].contentType,undefined);}
 const labelSource=documentSource.slice(documentSource.indexOf('  const statusText ='),documentSource.indexOf('\n  return ('));
 const label=vm.runInContext(compile(labelSource)+';statusText',vm.createContext({t:en=>en}))(staged.files[0]);
 const guardSource=formSource.slice(formSource.indexOf('  function requestCreate()'),formSource.indexOf('  async function create('));
 let creates=0;
 const guard=vm.createContext({pending:false,unknown:false,setAttempted(){},setRejection(){},allErrors:()=>staged.blocked||staged.uploading?[{tab:'documents'}]:[],reveal(){},draft:{initialStatus:'PENDING'},PurchaseOrderStatus:{PENDING:'PENDING'},create(){creates++},setReview(){}});
 vm.runInContext(guardSource+';requestCreate()',guard);
 assert.equal(creates,scenario==='success'?1:0);
 const before={scenario,methods:calls.map(c=>c.method),label,blocked:staged.blocked,contextExists:!!staged.contextId(),createCalls:creates,bearerPresent:true};
 await staged.remove(staged.files[0].key);staged=render();vm.runInContext('requestCreate()',guard);
 assert.equal(staged.blocked,false);
 console.log(JSON.stringify({...before,blockedAfterRemove:staged.blocked,createCallsAfterRemove:creates}));
}
console.log('PASS: actual service/hook code executed with in-memory fetch and hook shims; actual Create guard executed; no network or filesystem writes.');
