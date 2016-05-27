#!/bin/sh
mkdir -p dist/assets
cp -r src/assets dist

for file in $(find dist/assets -regex '.*/[^/]*.obj')
do
    path=${file%/*}
    name=$(basename -s .obj $file)
    echo $file $name

    python scripts/convert_obj_three.py -i $file -o ${path}/${name}.json -t ascii
done
