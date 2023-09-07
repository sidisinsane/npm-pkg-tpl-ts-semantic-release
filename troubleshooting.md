# Troubleshooting

## Create Release fails

```
Run pnpm exec semantic-release
...
npm ERR! code ENEEDAUTH
npm ERR! need auth This command requires you to be logged in.
npm ERR! need auth You need to authorize this machine using `npm adduser`
...
Please make sure to set the NPM_TOKEN environment variable in your CI with the exact value of the npm token.

AggregateError:
    SemanticReleaseError: Invalid npm token.
...
Error: Process completed with exit code 1.
```

1. When creating the secret token at npmjs.com, select accessToken type as **automation** option not publish to bypass 2FA, otherwise it will not work.
2. When adding npm created accessToken secret to github: What I have found going to settings > secrets, there are two ways to add secrets: In the environment or to the repository. Adding secrets to the environment will not work. You need to add it as repository secret...

Source: [github action for npm publish fails](https://stackoverflow.com/questions/70631423/github-action-for-npm-publish-fails/71449878#71449878)
