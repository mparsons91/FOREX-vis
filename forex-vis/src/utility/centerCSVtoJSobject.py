import csv

csv_file = 'country-centers.csv'
js_file = 'CountryCenters.js'

data = {}

with open(csv_file, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        country = row['COUNTRY']
        longitude = float(row['longitude'])
        latitude = float(row['latitude'])
        data[country] = [latitude, longitude]

with open(js_file, 'w') as js_file:
    js_file.write('const centers = {\n')
    for country, coordinates in data.items():
        js_file.write(f'    "{country}": {coordinates},\n')
    js_file.write('};\n\n')
    js_file.write('export default centers;\n')

print(f'JavaScript object saved to {js_file}')

# drag the output file into data folder !!