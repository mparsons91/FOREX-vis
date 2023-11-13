#!/usr/bin/env sh

#This is a convenience script that runs csv_parse on an M1 txt status file.

parse_M1_txt() (
  ./txt_parse.sh "$1"/*_"$1"_M1_2020.txt >> "$1"/parsed/"$1"_M1_2020_STATUS.csv &
)

main() (
  # If input is empty, exit the script
  if test -z "$1"
  then
    echo "[Error]: No input was provided. Please provide an input directory to read the data from."
  else
    parse_M1_txt "$1"
  fi
)

main "$1"
