#!/bin/bash

current=$(
  cd $(dirname $0)
  pwd
)

if ! command -v firebase &>/dev/null; then
  echo "firebaseコマンドが見つかりません。firebase-toolsをインストールしてください。"
  exit 1
fi

cd $current
firebase emulators:start --import emulator_database --export-on-exit emulator_database
