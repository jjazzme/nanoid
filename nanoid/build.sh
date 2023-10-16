#!/bin/bash
directory="../c1/node/nanoid"
rm -f "../c1/node/tsconfig.tsbuildinfo"
rm -rf "__temp"
mkdir "__temp"

if [ -f "$directory/p/counter.html" ]; then
    mv "$directory/p/counter.html" "./__temp"
else
    echo "0" > "$directory/p/counter.html"
fi

if [ -d "$directory/node_modules" ]; then
    mv "$directory/node_modules" "./__temp"
else
    mkdir "./__temp/node_modules"
fi

rm -rf "$directory"
mkdir "$directory"
cp -r "./src/p" "$directory"
cp -r "./src/pages" "$directory"

mv "./__temp/node_modules" "$directory"
mv "./__temp/counter.html"  "$directory/p"
rm -rf "__temp"

cp "./public.json" "$directory/package.json"

tsc --build