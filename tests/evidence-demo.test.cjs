const assert = require('node:assert/strict');
const {buildRun,config} = require('../assets/evidence-demo.js');
for (const environment of Object.keys(config)) {
  for (const [scenario] of config[environment].cases) {
    const a=buildRun(environment,scenario,'a'),b=buildRun(environment,scenario,'b');
    assert.deepEqual(a.before,b.before,'Comparisons must use identical input records');
    assert.equal(a.steps.length,4); assert.equal(b.steps.length,4);
    assert.equal(b.failed,0,`${environment}/${scenario}: guarded version should satisfy example rules`);
    if(scenario==='standard')assert.equal(a.failed,0);
    else assert.ok(a.failed>0,`${environment}/${scenario}: baseline must expose the specified defect`);
    if(b.outcomeKind==='paused')assert.deepEqual(b.before,b.after,'Clarification must not write records');
    assert.deepEqual(b,buildRun(environment,scenario,'b'),'Runs must be deterministic');
  }
}
const duplicate=buildRun('salesforce','duplicate','a');
assert.equal(duplicate.before.tasks.length,1);assert.equal(duplicate.after.tasks.length,2);
assert.equal(buildRun('salesforce','duplicate','b').after.tasks.length,1);
assert.equal(buildRun('salesforce','missing','a').after.tasks[0].owner,'Alex Rivera');
assert.equal(buildRun('salesforce','missing','b').after.tasks.length,0);
assert.equal(buildRun('linear','ambiguous','a').after.issue.project,'Billing API');
assert.equal(buildRun('linear','ambiguous','b').after.issue.project,null);
assert.throws(()=>buildRun('salesforce','ambiguous','a'));
assert.throws(()=>buildRun('unknown','standard','a'));
console.log('PASS: 12 deterministic runs, matched comparison inputs, edge-case failures, no-write clarification, and input validation.');
