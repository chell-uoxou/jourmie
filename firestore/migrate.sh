#!/bin/bash

target_dir_name="emulator_database"

current=$(
  cd $(dirname $0)
  pwd
)

target_dir_path=$current/$target_dir_name
echo $target_dir_path

if [ -d $target_dir_path ]; then
  read -p "すでにエミュレーター用のデータベースが存在します。上書きしますか？(y/N): " answer
  case $answer in
  [yY])
    rm -rf $target_dir_path
    ;;
  *)
    echo "キャンセルしました。"
    exit
    ;;
  esac
fi

# gsutilコマンドの有無をチェック
if ! command -v gsutil &>/dev/null; then
  echo "gsutilコマンドが見つかりません。Google Cloud SDKをインストールしてください。"
  exit 1
fi

# firestoreのエクスポートが入っている、cloud strageの20241117_exportバケットをローカルにコピーする
gsutil -m cp -r gs://jourmie-181d8.appspot.com/20241117_export $current
mv $current/20241117_export $target_dir_path
