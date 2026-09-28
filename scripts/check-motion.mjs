import assert from 'node:assert/strict';
import { LightingReveal,MOTION } from '../src/motion.js';

const reveal=new LightingReveal();
assert.equal(reveal.sample(1000,true),0);
assert.equal(reveal.sample(1499,true),0,'the lamp must not start before 500ms');
assert.equal(reveal.sample(1500,true),0);
assert.equal(reveal.startedAt,1500);
assert.equal(reveal.sample(1950,true),.5,'delay must not lengthen the 900ms fade');
assert.equal(reveal.sample(2400,true),1);
reveal.sample(2500,false);
assert.equal(reveal.enteredAt,null,'leaving clears the pending/finished reveal');
assert.equal(reveal.sample(5000,true),0,'reentry starts a fresh delay');
reveal.sample(5300,false);
assert.equal(reveal.sample(7000,true),0,'a cancelled delay must not fire on reentry');
assert.equal(reveal.sample(7500,true,true),1,'reduced motion retains delay but skips the fade');
assert.equal(MOTION.lightDelay,500);
console.log('Lighting delay, fade duration, cancellation, reentry, and reduced-motion checks passed.');
