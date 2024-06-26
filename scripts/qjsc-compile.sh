#!/bin/bash

# Get the input file name from the command line argument
input_file="$1"

# Strip the .js extension and replace it with .bc
output_file="/build/${input_file%.js}.bc"

# Strip imports, esmodule, etc.
cat "/contracts/$input_file" \
    | grep -v -E 'Object.defineProperty.+exports.+__esModule' \
    | grep -v -E '^exports\..+=.+' \
    | perl -0777pe 's/export.*?{[^}]+}/\/\/ Exports were here/sg' \
    | sed 's/var Hook =/var __Hook =/g' \
    | sed 's/var Callback =/var __Callback =/g' \
    > temp.js \
    && echo 'var Hook = (reserved) => __Hook(otxn_json(), reserved)' >> temp.js \
    && echo 'var Callback = (code) => __Callback(otxn_json(), code)' >> temp.js \
    && echo '' >> temp.js \
    && mv temp.js "/contracts/$input_file"

# Generate the hex output and convert it to bytes
hex_output=$(/quickjslite/qjsc -c -o /dev/stdout "/contracts/$input_file" | tr -d '\n' | grep -Eo '\{[^}]+\}' | grep -Eo '0x[a-fA-F0-9]+' | sed -e 's/0x//g' | tr -d '\n')

# Convert the hex to bytes and write it to the output file
echo "$hex_output" | xxd -r -p > "$output_file"

echo "      > Output written to: $output_file"
