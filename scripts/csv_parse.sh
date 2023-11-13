#!/usr/bin/env sh

#The format of the data per line is
#<YEAR><MONTH><DAY> <HOUR><MINUTE><SECOND>;<QUOTE>;<QUOTE>;<QUOTE>;<QUOTE>;<VOLUME>
# where
#    <YEAR> is 4 digits
#    <MONTH> is 2 digits
#    <DAY> is 2 digits
#    <HOUR> is 2 digits
#    <MINUTE> is 2 digits
#    <SECOND> is 2 digits
#    <QUOTE> is a 7 significant figure number generally in the form of #.######

# Before doing any actual extraction, I will modify the format of the data per line to be
#<YEAR><MONTH><DAY>,<HOUR><MINUTE><SECOND>,<QUOTE>,<QUOTE>,<QUOTE>,<QUOTE>,<VOLUME>

# CSV format
# - DateTime Stamp;
# - Bar OPEN Bid Quote;
# - Bar HIGH Bid Quote;
# - Bar LOW Bid Quote;
# - Bar CLOSE Bid Quote;
# - Volume

#So I think the columns we should have are
# - year
# - month
# - day
# - hour
# - minute
# - second
# - open
# - high
# - low
# - close
# - volume

print_csv_format() (
  echo "year,month,day,hour,minute,second,open,high,low,close,volume"
)

# These functions expect input in the following format:
# <YEAR><MONTH><DAY>
get_year() {
  cut -c 1-4 <<< "$@"
}

get_month() {
  cut -c 5-6 <<< "$@"
}

get_day() {
  cut -c 7-8 <<< "$@"
}

# Expects input in the following format:
# <YEAR><MONTH><DAY>
transform_ymd_to_csv_format() {
  printf "$(get_year $@),$(get_month $@),$(get_day $@)"
}

transform_ymd_to_csv_format_alt() {
  printf "$(cut -c 1-4 <<< $@),$(cut -c 5-6 <<< $@),$(cut -c 7-8 <<< $@)"
}

# These functions expect input in the following format:
# <HOUR><MINUTE><SECOND>;<QUOTE>;<QUOTE>;<QUOTE>;<QUOTE>;<VOLUME>
# Note: The semicolons are at positions 7, 16, 25, 34, 43
get_hour() {
  cut -c 1-2 <<< "$@"
}

get_minute() {
  cut -c 3-4 <<< "$@"
}

get_second() {
  cut -c 5-6 <<< "$@"
}

# Expects input in the following format:
# <HOUR><MINUTE><SECOND>
transform_hms_to_csv_format() {
  printf "$(get_hour $@),$(get_minute $@),$(get_second $@)"
}

transform_hms_to_csv_format_alt() {
  printf "$(cut -c 1-2 <<< $@),$(cut -c 3-4 <<< $@),$(cut -c 5-6 <<< $@)"
}

# Expects input in the following format:
# <YEAR><<MONTH><DAY>,<HOUR><MINUTE><SECOND>,<QUOTE>,<QUOTE>,<QUOTE>,<QUOTE>,<VOLUME>
transform_rest_to_csv_format() {
  cut -d , -f 3- <<< "$@"
}

transform_line_to_csv_format() {
  transform_ymd_to_csv_format "$(cut -d , -f 1 <<< $@)"
  printf ","
  transform_hms_to_csv_format "$(cut -d , -f 2 <<< $@)"
  printf ","
  transform_rest_to_csv_format "$@"
}

transform_line_to_csv_format_alt() {
  transform_ymd_to_csv_format_alt "$(cut -d , -f 1 <<< $@)"
  printf ","
  transform_hms_to_csv_format_alt "$(cut -d , -f 2 <<< $@)"
  printf ","
  transform_rest_to_csv_format "$@"
}

main () {
  # If input is empty, exit the script
  if test -z "$@"
  then
    echo "[Error]: No input was provided. Please provide an input file to read the data from."
  else
    print_csv_format
    DATA="$(cat $1)"
    echo "$DATA" | sed s/\;/\,/g | sed s/" "/\,/g | while read each_line
    do
      transform_line_to_csv_format $each_line
    done
  fi
}

main "$@"
