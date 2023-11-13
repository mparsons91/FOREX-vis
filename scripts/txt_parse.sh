#!/usr/bin/env sh

# The contents of the txt file is
# Gap of <#>s found between <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND> and <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND>
# where
#    <#> is some arbitrary natural number (can be multiple digits)
#    <YEAR> is 4 digits
#    <MONTH> is 2 digits
#    <DAY> is 2 digits
#    <HOUR> is 2 digits
#    <MINUTE> is 2 digits
#    <SECOND> is 2 digits

#NOTE: Can consider using xargs if the current approach does not work.

# Reference: https://stackoverflow.com/questions/53980780/how-to-use-back-reference-of-sed-replacement-command-correctly-considering-a-spe

print_csv_format() (
  echo "gap,year_start,month_start,day_start,hour_start,minute_start,second_start,year_end,month_end,day_end,hour_end,minute_end,second_end"
)

# This strips the top part of the file
#tail -n +4

# This strips the bottom part of the file
#head -n -3

# Get rid of leading "Gap of"
#sed s/"Gap of "//g
# Get rid of "s"
#sed s/"s"//g
# Get rid of "found between "
#sed s/"found between "//g
# Get rid of "and "
#sed s/"and "//g
# Get rid of "." Have to escape it, otherwise, sed interprets it as a regex.
#sed s/\.//g

# Should be given the entire file as input
trim_input() (
  echo "$@" | tail -n +4 | head -n -3 | sed s/"Gap of "//g | sed s/"s"//g | sed s/"found between "//g | sed s/"and "//g | sed s/\.//g
)

# At this point, we should have data in the form of
# <#> <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND> <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND>

# Now, our goal is to put that information into a tsv or csv format. This would likely be better through sed or awk, but I don't want to learn new languages right now. So we're going to tediously use the cut command as our swiss-army knife

get_gap() (
  echo "$1"
)

# These get_* functions expect input in the following format:
# <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND>
get_year() (
  echo "$@" | cut -c 1-4
)

get_month() (
  echo "$@" | cut -c 5-6
)

get_day() (
  echo "$@" | cut -c 7-8
)

get_hour() (
  echo "$@" | cut -c 9-10
)

get_minute() (
  echo "$@" | cut -c 11-12
)

get_second() (
  echo "$@" | cut -c 13-14
)

# Expects input in the following format:
# <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND>
transform_raw_timestamp_to_csv_format() (
  echo "$(get_year $1),$(get_month $1),$(get_day $1),$(get_hour $1),$(get_minute $1),$(get_second $1)"
)

# Expects input in the following format:
# <#> <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND> <YEAR><MONTH><DAY><HOUR><MINUTE><SECOND>
transform_parsed_input_to_csv_format() (
  echo "$(get_gap $1),$(transform_raw_timestamp_to_csv_format $2),$(transform_raw_timestamp_to_csv_format $3)"
)

main () (
  # If input is empty, exit the script
  if test -z "$@"
  then
    echo "[Error]: No input was provided. Please provide an input file to read the data from."
  else
    print_csv_format
    DATA="$(cat $1)"
    echo "$DATA" | tail -n +4 | head -n -3 | sed s/"Gap of "//g | sed s/"s"//g | sed s/"found between "//g | sed s/"and "//g | sed 's/\.//g' | while read each_line
    do
      echo "$each_line"
      #transform_parsed_input_to_csv_format $each_line
    done
  fi
)

main "$@"
