#!/bin/bash
cat 201810* > 0.yaml
./go.sh > db.json
#https://unix.stackexchange.com/questions/162377/sed-remove-the-very-last-occurrence-of-a-string-a-comma-in-a-file
#remove extra ,
sed -i 'x;${s/,$//;p;x;};1d' db.json
rm 0.yaml

# to query the json db do as follows
#jq '.[] | select(.category=="ballet")' db.json  | less
