import * as azdev from "azure-devops-node-api";
import * as ba from "azure-devops-node-api/BuildApi";
import secrets from '../secrets.json';
import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

const adoProj = "testing";
const adoOrg = "https://dev.azure.com/loganballard0423";
const token = secrets.PAT;


function get_connection(): azdev.WebApi {
    let authHandler = azdev.getPersonalAccessTokenHandler(token); 
    return new azdev.WebApi(adoOrg, authHandler);    
}

async function get_recent_build_by_repo_and_branch(repo_id: string, branch: string): Promise<Build> {
    let connection = get_connection();
    let build: ba.IBuildApi = await connection.getBuildApi();
    return await build.getBuilds(adoProj, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, undefined, undefined, undefined, undefined, branch, undefined, repo_id, "TfsGit")
        .then(builds => builds[0])
}

function create_new_build_definition(buildDefinition: Build, params: object): object {
    let new_build = {
        parameters: JSON.stringify(params),
        resources: {
            repositories: {
                self: {
                    refName: buildDefinition.sourceBranch,
                },
            },
        },
        sourceBranch: buildDefinition.sourceBranch,
        sourceVesion: buildDefinition.sourceVersion,
        definition: {
            id: buildDefinition.definition.id
        }
    }
    return new_build;
}

async function queue_new_build(buildDefinition: object) {
    let connection = get_connection();
    let build: ba.IBuildApi = await connection.getBuildApi();
    const url = `${adoOrg}/${adoProj}/_apis/build/builds?api-version=6.1-preview.6`;
    const reqOpts = {
      acceptHeader: 'application/json'
    };
    build.rest.create(url, buildDefinition, reqOpts)
        .then()
        .catch(e => console.log(e));
}

function trigger_destroy_build(repo_id: string, repo_branch: string) {
    get_recent_build_by_repo_and_branch(repo_id, repo_branch)
        .then(most_recent_build => {
            let params = {"DESTROY_BRANCH_BUILD": "DO I EXIST"};
            let destructive_build = create_new_build_definition(most_recent_build, params);
            queue_new_build(destructive_build);
        })
}

trigger_destroy_build("a026d561-aeb3-4772-a7d9-b05c89a61511", "refs/heads/auth");
