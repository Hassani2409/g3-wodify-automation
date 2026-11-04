import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
function load(path, deps={}) { const m={exports:{}};const code=ts.transpileModule(fs.readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module:m,exports:m.exports,Date,Error,setTimeout:fn=>{fn();},require:n=>deps[n]});return m.exports; }
const core=load('../src/lib/trial-demo.ts');
const {executeTrial}=load('../src/lib/trial-execution.ts',{'./trial-demo':core});
const input={eventId:'execution-test-event-123',name:'Alex Demo',email:'alex@example.com',consent:true};
async function collect(...args){const all=[];for await(const event of executeTrial(...args))all.push(event);return all;}
test('automatic sender is awaited and its real response appears in email output',async()=>{let calls=0;const events=await collect(input,undefined,false,async()=>{calls++;return {accepted:true,id:'provider-id'};});assert.equal(calls,1);assert.equal(events.at(-1).status,'completed');assert.equal(events.find(e=>e.node?.id==='email'&&e.node.status==='success').node.output.id,'provider-id');});
test('CRM failure and invalid input never trigger a real email',async()=>{const sender=async()=>{throw Error('should not run');};for(const args of [[input,undefined,true,sender],[{...input,consent:false},undefined,false,sender]]){const events=await collect(...args);assert.equal(events.some(e=>e.node?.id==='email'),false);}});
test('mail error is visible and keeps request retryable; success then suppresses duplicate send',async()=>{let calls=0;const failed=await collect(input,undefined,false,async()=>{throw Error('provider unavailable');});assert.equal(failed.at(-1).status,'email_failed');assert.equal(failed.at(-1).state.records[0].state,'pending');const success=await collect(input,failed.at(-1).state,false,async()=>{calls++;return {accepted:true};});const duplicate=await collect(input,success.at(-1).state,false,async()=>{calls++;});assert.equal(calls,1);assert.equal(duplicate.at(-1).status,'duplicate');});
