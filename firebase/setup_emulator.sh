#!/bin/bash
gcp_project_id=jourmie-181d8

current=$(
  cd $(dirname $0)
  pwd
)

cd $current

firebase login
firebase init emulators --project $gcp_project_id --non-interactive
./migrate.sh
