import test from 'node:test';
import assert from 'node:assert/strict';
import { leadWasAccepted } from '../src/lib/lead-response.mjs';

test('an HTTP-success response with success:false must not confirm a request', () => {
  assert.equal(leadWasAccepted({success:false, message:'Rejected'}), false);
});
test('only an explicit acceptance with a lead identifier confirms a request', () => {
  assert.equal(leadWasAccepted({success:true, lead_id:'local_12', wodify_synced:false}), true);
  for (const value of [null, {}, {success:'true'}, {success:true}, {success:true,lead_id:''}]) {
    assert.equal(leadWasAccepted(value), false);
  }
});
