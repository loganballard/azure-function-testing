import { Option, none } from 'fp-ts/lib/Option';

export function get_repo_name(webhook: Object): Option<string> {
    return ("resource" in webhook) && ("repository" in webhook["resource"]) && ("name" in webhook["resource"]["repository"]) ? webhook["resource"]["repository"]["name"] : none ;
}

export function get_source_branch(webhook: Object): Option<string> {
    return ("resource" in webhook) && ("sourceRefName" in webhook["resource"]) ? webhook["resource"]["sourceRefName"] : none;
}

export function get_target_branch(webhook: Object): Option<string> {
    return ("resource" in webhook) && ("targetRefName" in webhook["resource"]) ? webhook["resource"]["targetRefName"] : none;
}
