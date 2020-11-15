#!/bin/bash
publisher="synker"
ext_id="sonar-project-build-release-task"
share_with_orgs="henifazzani"

npm prune --production
cp -r node_modules ./tasks/sonar
rm *.vsix || echo "No vsix detected"

tsc

filePath="tasks/sonar/task.json"
command -v jq > /dev/null || sudo apt-get jq -yq
echo "Updating $filePath version"
contents="$(jq '.version.Patch = (.version.Patch | .+1)' ${filePath})" && echo "${contents}" > ${filePath}
git add $filePath

filePath="./vss-extension.json"
echo "Updating $filePath version"
version=$(jq -r '.version' ${filePath} | awk 'BEGIN{FS=OFS="."} {$3+=1} 1')
contents="$(jq --arg v $version '.version = $v' ${filePath})" && echo "${contents}" > ${filePath}
git add $filePath

npm i -g tfx-cli && \
#--rev-version
tfx extension create --manifest-globs vss-extension.json && \
tfx extension publish --manifest-globs vss-extension.json --share-with $share_with_orgs --token $(AZ_DEVOPS_MARKET_PLACE) && \
echo "Commit the new version" && \
git config --global user.email "heni.fazzani@gmail.com" && \
git config --global user.name "Fazzani" && \
git commit -m "[skip ci] Bump new version" && \
git push origin master

# tfx extension show --publisher $publisher --extension-id $ext_id --token $(AZ_DEVOPS_MARKET_PLACE)

