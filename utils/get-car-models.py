import requests
from bs4 import BeautifulSoup
from collections import defaultdict

website_url = requests.get('https://en.wikipedia.org/wiki/List_of_electric_cars_currently_available').text
soup = BeautifulSoup(website_url,'lxml')
# print(soup.prettify())

table = soup.find('table', {'class':'wikitable sortable'})
# print(table)

rows = table.findAll('tr')
# print(rows)

header_row = rows[0]
column_titles_raw = header_row.findAll('th')
# print(column_titles_raw)

column_titles = []
for raw in column_titles_raw:
    column_titles.append(raw.text.replace('\n', ''))
# print(column_titles)

make_index = column_titles.index('Manufacturer')
model_index = column_titles.index('Model')
# print(make_index, model_index)

cars = []
for row in rows[1:]:
    columns = row.findAll('td')
    make = columns[make_index].text.replace('\n', '')
    model = columns[model_index].text.replace('\n', '')
    cars.append([make, model])
# print(cars)

by_manufacturer = defaultdict(list)
for make, model in cars:
    by_manufacturer[make].append(model)
print(by_manufacturer)
