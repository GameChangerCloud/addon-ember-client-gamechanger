'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
//const emberGenerate = blueprintHelpers.emberGenerate;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy graphql-import', function() {
  setupTestHooks(this);

  it('graphql-import website.graphql', function() {
    let args = ['graphql-import', process.env.PWD+'/graphql/blog.graphql'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('mirage/scenarios/default.js')).to.contain('createBlog(server, NUMBER_ENTITY)');
        expect(file('mirage/scenarios/default.js')).to.contain('import createBlog from \'./blog\'');
    }));
  });
});
