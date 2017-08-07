#!/bin/bash

pids=`ps -ef | grep node | grep -v "grep" | awk '{print $2}'`

for pid in ${pids}
do
  cwd_path=`ls -l /proc/${pid}/cwd | awk '{print $NF}'`
  echo "cwd_path: "${cwd_path}
done
