import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import test from 'node:test';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync(new URL('../src/app/api/demo/trial/email/route.ts', import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function load(fetcher = () => { throw Error('unexpected provider call'); }) {
 const m={exports:{}};
 vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>crypto,URL,Response,AbortSignal,Date,fetch:fetcher,process:{env:{G3_DEMO_EMAIL_ENABLED:'true',G3_DEMO_EMAIL_RECIPIENT:'owner@example.com',G3_DEMO_RESEND_API_KEY:'test-only',G3_DEMO_EMAIL_FROM:'Demo <demo@example.com>'}}});return m.exports.POST;
}
const body={name:'Alex Demo',email:'owner@example.com',eventId:'test-demo-event-1234',confirm:true};
function req(patch={},origin='http://localhost:3050',url='http://localhost:3050/api/demo/trial/email'){return new Request(url,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({...body,...patch})});}
test('real test mail rejects malformed addresses and missing confirmation',async()=>{const post=load();assert.equal((await post(req({email:'invalid'}))).status,422);assert.equal((await post(req({confirm:false}))).status,422);});
test('customer can send to own address without allowlist',async()=>{let recipient;const post=load(async(u,o)=>{recipient=JSON.parse(o.body).to[0];return Response.json({id:'mail-id'});});assert.equal((await post(req({email:'customer@example.org'}))).status,200);assert.equal(recipient,'customer@example.org');});
test('foreign origins cannot invoke test send',async()=>{const post=load();assert.equal((await post(req({},'https://evil.example'))).status,403);});
test('provider acceptance is distinguished from delivery and retries use stable idempotency',async()=>{const keys=[];const post=load(async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');keys.push(options.headers['Idempotency-Key']);return Response.json({id:'provider-id'});});const first=await (await post(req())).json();await post(req());assert.equal(first.delivery,'accepted_not_delivery_confirmed');assert.equal(keys[0],keys[1]);});
test('provider rejection is not reported as success',async()=>{const post=load(async()=>Response.json({message:'denied'},{status:403}));assert.equal((await post(req())).status,502);});

test('different events to same recipient are rate limited',async()=>{const post=load(async()=>Response.json({id:'mail-id'}));assert.equal((await post(req())).status,200);assert.equal((await post(req({eventId:'another-event-123456'}))).status,429);});
