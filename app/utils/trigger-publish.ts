import { Octokit } from 'octokit'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
  owner: 'computerization',
  repo: 'enspire',
  workflow_id: 'on-release.yml',
  ref: 'next',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
  },
}).catch(console.error)
