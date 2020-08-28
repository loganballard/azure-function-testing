import secrets from '../secrets.json';
import fetch from 'node-fetch';
import { encode } from 'js-base64';
import { none } from 'fp-ts/lib/Option';

const adoOrg = "loganballard0423";
const adoProj = "testing";
var tokenAuthBody = `grant_type=client_credentials&client_id=${secrets.SP.appId}&client_secret=${secrets.SP.password}&resource=https://management.azure.com/`;
var tokenUrl = `https://login.microsoftonline.com/${secrets.SP.tenant}/oauth2/token`;
var pipelineListUrl = `https://dev.azure.com/${adoOrg}/${adoProj}/_apis/pipelines?api-version=6.1-preview.1`;


async function get_access_token(accessTokenUrl: string, tokenBody: string): Promise<string> {
    return await fetch(accessTokenUrl, {
        method: 'post',
        body: tokenAuthBody,
        headers: {  'Content-type': 'application/x-www-form-urlencoded' }
    })
        .then(res => res.json())
        .then(data => data.access_token)
        .catch();
}

async function list_pipelines(pipelineUrl: string): Promise<Array<Object>> {
    return await fetch(pipelineUrl, {
        method: 'get',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encode(":" + secrets.PAT)
        }
    })
        .then(res => res.json())
        .then(data => data['value'])
}

async function get_pipeline_id_by_repo_name(repo_name: string): Promise<number> {
    let pipelines = await list_pipelines(pipelineListUrl)
        .then(data => data);
    for (var i = 0; i < pipelines.length; i++) {
        if (pipelines[i]['name'] === repo_name) {
            return pipelines[i]['id'];
        }
    }
    return -1;
}

async function get_pipeline_runs_by_id(pipeline_id: number): Promise<Array<Object>> {
    let pipelineRunListUrl = `https://dev.azure.com/${adoOrg}/${adoProj}/_apis/pipelines/${pipeline_id}/runs?api-version=6.1-preview.1`;
    return await fetch(pipelineRunListUrl, {
        method: 'get',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encode(":" + secrets.PAT)
        }
    })
        .then(res => res.json())
        .then(data => data);
}

async function get_most_recent_pipeline_runs_by_id(pipeline_id: number): Promise<Array<number>> {
    return await get_pipeline_runs_by_id(pipeline_id)
        .then(data => {
            var id_arr = [];
            for (var i = 0; i < data['count']; i++) {
                // console.log(data['value'][i]['id']);
                id_arr.push(data['value'][i]['id']);
            }
            return id_arr;
        })
}

async function get_most_recent_pipeline_run_id_by_repo_and_branch(repo_name: string, branch_name: string): Promise<number> {
    let pipeline_id = await get_pipeline_id_by_repo_name(repo_name)
        .then(id => id);
    let run_ids = await get_most_recent_pipeline_runs_by_id(pipeline_id);
    for (var i = 0; i < run_ids.length; i++) {
        let id = run_ids[i];
        var getPipelineRunByIdUrl = `https://dev.azure.com/${adoOrg}/${adoProj}/_apis/pipelines/${pipeline_id}/runs/${id}?api-version=6.1-preview.1`;
        let found_the_run = await fetch(getPipelineRunByIdUrl, {
            method: 'get',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + encode(":" + secrets.PAT)
            }
        })
            .then(res => res.json())
            .then(data => {
                let branch = data['resources']['repositories']['self']['refName'];
                if (branch == branch_name) {
                    return true;
                }
                return false;
            })
        if (found_the_run === true) {
            return id;
        }
    }
    return -1;
}

get_most_recent_pipeline_run_id_by_repo_and_branch('testing-pipeline-vars', 'refs/heads/auth').then(data => console.log(data));
