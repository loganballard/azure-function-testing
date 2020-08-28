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

async function get_pipeline_id_by_name(name: string): Promise<number> {
    let pipelines = await list_pipelines(pipelineListUrl)
        .then(data => data);
    for (var i = 0; i < pipelines.length; i++) {
        if (pipelines[i]['name'] === name) {
            return pipelines[i]['id'];
        }
    }
    return -1;
}

get_pipeline_id_by_name('testing-pipeline-vars').then(data => console.log(data));
