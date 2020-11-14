#!/bin/bash
publisher="synker"
ext_id="sonar-project-build-release-task"

npm prune --production
cp -r node_modules ./tasks/sonar
rm *.vsix

tsc

tfx extension create --manifest-globs vss-extension.json #--rev-version
tfx extension publish --manifest-globs vss-extension.json --share-with henifazzani --token $AZ_DEVOPS_MARKET_PLACE #--rev-version
tfx extension show --publisher $publisher --extension-id $ext_id --token $AZ_DEVOPS_MARKET_PLACE