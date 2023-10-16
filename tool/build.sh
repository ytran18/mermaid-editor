#!/bin/bash

export curDir=$(pwd)
export dist=${curDir}/dist
export destFolder=${curDir}/release/mermaid

# Clean
rm -rf ${dist} > /dev/null
rm -rf ${destFolder} > /dev/null

# Build source code
npm run build

mkdir -p ${destFolder} > /dev/null

cd ${destFolder}

cp ${dist}/*.ttf ./ > /dev/null
cp ${dist}/main.css ./ > /dev/null
cp ${dist}/index.html ./ > /dev/null
cp ${dist}/index.bundle.js ./ > /dev/null
cp ${dist}/index.bundle.js.LICENSE.txt ./ > /dev/null

cd ${destFolder}/../..

# Copy to Web-Front
export webfrontPath="${curDir}/../PMS-WebFront/public"
if [[ -d "$webfrontPath" ]]; then
    mkdir -p ${webfrontPath}/ > /dev/null
    cp -R ./release/mermaid ${webfrontPath}/ > /dev/null
fi

# Copy to Wrapper.Dev
export desktopPath="${curDir}/../PMS-Wrapper/build.dev/src/main/web/public"
if [[ -d "$desktopPath" ]]; then
    mkdir -p ${desktopPath}/ > /dev/null
    cp -R ./release/mermaid ${desktopPath}/ > /dev/null
fi

# Copy to Wrapper.Prod
export desktopPath="${curDir}/../PMS-Wrapper/build.prod/src/main/web/public"
if [[ -d "$desktopPath" ]]; then
    mkdir -p ${desktopPath}/ > /dev/null
    cp -R ./release/mermaid ${desktopPath}/ > /dev/null
fi

# Copy to Wrapper Local Dev
export desktopPath="${curDir}/../PMS-Wrapper/src/main/web/public"
if [[ -d "$desktopPath" ]]; then
    mkdir -p ${desktopPath}/ > /dev/null
    cp -R ./release/mermaid ${desktopPath}/ > /dev/null
fi

# Copy to Mobile App
export mobilePath="${curDir}/../PMS-Mobile-Core/assets/web/public"
if [[ -d "${mobilePath}" ]]; then
    mkdir -p ${mobilePath}/ > /dev/null
    cp -R ./release/mermaid ${mobilePath}/ > /dev/null
fi