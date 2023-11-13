import csv
import types
import sqlite3
import pandas as pd

# Resources
# https://www.geeksforgeeks.org/how-to-import-a-csv-file-into-a-sqlite-database-table-using-python/#
# https://docs.python.org/3/library/csv.html
# https://docs.python.org/3/library/sqlite3.html
# https://www.sqlite.org/datatype3.html
# https://docs.python.org/3/library/typing.html
# https://www.scaler.com/topics/f-string-in-python/
# https://sqlite.org/lang_keywords.html
# https://docs.python.org/3/tutorial/errors.html

# Table Definition
# year,month,day,hour,minute,second,open,high,low,close,volume
# FIXME: Insert the following column without outer double quotes, if necessary
# "\'id\' INTEGER PRIMARY KEY AUTOINCREMENT,"

def create_table(table_name: str) -> str:
    return f'''CREATE TABLE {table_name}(
           \'year\' INTEGER NOT NULL,
           \'month\' INTEGER NOT NULL,
           \'day\' INTEGER NOT NULL,
           \'hour\' INTEGER NOT NULL,
           \'minute\' INTEGER NOT NULL,
           \'second\' INTEGER NOT NULL,
           \'open\' REAL NOT NULL,
           \'high\' REAL NOT NULL,
           \'low\' REAL NOT NULL,
           \'close\' REAL NOT NULL,
           \'volume\' INTEGER NOT NULL);
           '''

# Can't figure out how to make cursor explicitly typed as a Cursor object, so just going to leave it alone for now
def execute_table_creation(connection, cursor, table_names: list[str]):
    for name in table_names:
        cursor.executescript(create_table(name))
        connection.commit()

def list_of_forex_pairs() -> list[str]:
# List of forex pairs
    forex_pairs = [ "eurusd"
                  , "usdcad"
                  , "usdchf"
                  , "usdjpy"
                  , "usdmxn"
                  ]
    return forex_pairs

def name_to_csv_file_path(name: str):
    return "data/" + name.upper() + "_M1_2020.csv"


# https://datacarpentry.org/python-ecology-lesson/instructor/09-working-with-sql.html
def read_m1_csv_file(connection, name: str):
    table_name = pd.read_csv(name_to_csv_file_path("eurusd"))
    table_name.to_sql(name, connection, if_exists='append', index = False)

def read_m1_csv_files(connection, names: list[str]):
    for name in names:
        pd.read_csv(name_to_csv_file_path(name)).to_sql(name, connection, if_exists='append', index = False)

def print_table_names(connection):
    print(pd.read_sql_query("""SELECT name FROM sqlite_schema WHERE type='table';""", connection))

# https://stackoverflow.com/questions/37051516/printing-a-properly-formatted-sqlite-table-in-python
def print_table_contents(connection, table_name: str):
    print(pd.read_sql_query(f"SELECT * FROM {table_name}", connection))

def print_tables_contents(connection, names: list[str]):
    for name in names:
        print_table_contents(connection, name)

def main():
    try:
        #Create an in-memory database
        connection = sqlite3.connect(":memory:")
        cursor = connection.cursor()

        execute_table_creation(connection, cursor, list_of_forex_pairs())
        read_m1_csv_files(connection, list_of_forex_pairs())

        print_table_names(connection)
        print_tables_contents(connection, list_of_forex_pairs())
    finally:
        connection.close()

main()
