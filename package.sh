#!/bin/bash
tfx extension create --manifest-globs vss-extension.json #--rev-version
tfx extension publish --manifest-globs vss-extension.json --share-with henifazzani --token $AZ_DEVOPS_MARKET_PLACE #--rev-version