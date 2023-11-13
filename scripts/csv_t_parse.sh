#!/usr/bin/env sh

#This is a convenience script that runs csv_parse on a collection of T csv files in a directory.

parse_month_collection() (
  for i in $(seq 1 9); do
    ./csv_parse.sh "$1"/*_"$1"_T_2020"0$i".csv >> "$1"/parsed/"$1"_T_2020"0$i".csv &
  done
  for i in $(seq 10 12); do
    ./csv_parse.sh "$1"/*_"$1"_T_2020"$i".csv >> "$1"/parsed/"$1"_T_2020"$i".csv &
  done
)

main() (
  # If input is empty, exit the script
  if test -z "$1"
  then
    echo "[Error]: No input was provided. Please provide an input directory to read the data from."
  else
    parse_month_collection "$1"
  fi
)

main "$1"
