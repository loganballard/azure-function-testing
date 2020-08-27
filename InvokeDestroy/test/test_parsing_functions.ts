import { expect } from 'chai';
import 'mocha';
import { Option, none } from 'fp-ts/lib/Option';

import { get_repo_name, get_source_branch, get_target_branch } from '../parse_webhook';
import example_webhook from './example_webhook_pr_merge.json';

describe('parse the webhook', () => {
    it('has a name for the repo', () => {
        expect(get_repo_name(example_webhook)).to.eq("Fabrikam");
        expect(get_repo_name({})).to.eq(none);
    });
    
    it('has source and target ref', () => {
        expect(get_source_branch(example_webhook)).to.eq("refs/heads/mytopic");
        expect(get_target_branch(example_webhook)).to.eq("refs/heads/master");
        expect(get_source_branch({})).to.eq(none);
        expect(get_target_branch({})).to.eq(none);
    });
    
    

  });
