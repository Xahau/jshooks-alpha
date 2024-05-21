#!/bin/bash

# Get the input file name from the command line argument
input_file="$1"

# Strip the .js extension and replace it with .bc
output_file="/build/${input_file%.js}.bc"

# Generate the hex output and convert it to bytes
hex_output=$(/quickjslite/qjsc -c -o /dev/stdout "/contracts/$input_file" | tr -d '\n' | grep -Eo '\{[^}]+\}' | grep -Eo '0x[a-fA-F0-9]+' | sed -e 's/0x//g' | tr -d '\n')

# Convert the hex to bytes and write it to the output file
echo "$hex_output" | xxd -r -p > "$output_file"

echo "      > Output written to: $output_file"
