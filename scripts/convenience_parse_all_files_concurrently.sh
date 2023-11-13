#!/usr/bin/env sh

#This is a convenience script that concurrently runs csv_parse on an M csv file and a collection of T csv files in a directory, and saves them to the correct locations.

dispatch() (
  ./csv_m_parse.sh "$1"
  ./csv_t_parse.sh "$1"
  #txt_m_parse.sh "$1"
  #txt_t_parse.sh "$1"
)

main() (
  # If input is empty, exit the script
  if test -z "$1"
  then
    echo "[Error]: No input was provided. Please provide an input directory to read the data from."
  else
    dispatch "$1"
  fi
)

main "$1"
