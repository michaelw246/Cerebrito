"""Country table for the geography puzzles, index-aligned with geo.json names.
Output: assets/data/countries.json  [[display name, iso2, region, pool, [aliases]], ...]
region: sa na eu as af oc  (na = North & Central America + Caribbean)
pool: 1 if fair as a mystery answer (recognisable, sizeable on the 110m map)
Needs: pip install pycountry pycountry-convert"""
import json, os
import pycountry, pycountry_convert as pc
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
geo = json.load(open(f"{ROOT}/assets/data/geo.json"))
src = json.load(open(f"{ROOT}/assets/data/source/world-atlas-countries-110m.json"))
num = {g["properties"]["name"]: g.get("id") for g in src["objects"]["countries"]["geometries"]}
NAME = {"United States of America": "United States", "Dem. Rep. Congo": "DR Congo", "Dominican Rep.": "Dominican Republic",
        "Falkland Is.": "Falkland Islands", "Fr. S. Antarctic Lands": "French Southern Lands", "Central African Rep.": "Central African Republic",
        "Eq. Guinea": "Equatorial Guinea", "eSwatini": "Eswatini", "Côte d'Ivoire": "Ivory Coast", "Solomon Is.": "Solomon Islands",
        "N. Cyprus": "Northern Cyprus", "Bosnia and Herz.": "Bosnia and Herzegovina", "Macedonia": "North Macedonia", "S. Sudan": "South Sudan",
        "W. Sahara": "Western Sahara", "Turkey": "Türkiye", "Congo": "Republic of the Congo"}
ISO = {"N. Cyprus": "CY", "Somaliland": "SO", "Kosovo": "XK"}
ALIAS = {"United States": ["USA", "US", "America", "United States of America"], "United Kingdom": ["UK", "Britain", "Great Britain", "England", "Scotland", "Wales"],
         "DR Congo": ["Democratic Republic of the Congo", "Congo-Kinshasa", "Zaire"], "Republic of the Congo": ["Congo", "Congo-Brazzaville"],
         "Ivory Coast": ["Côte d'Ivoire", "Cote d'Ivoire"], "Czechia": ["Czech Republic"], "Türkiye": ["Turkey", "Turkiye"], "Myanmar": ["Burma"],
         "Netherlands": ["Holland"], "Eswatini": ["Swaziland"], "North Macedonia": ["Macedonia"], "Timor-Leste": ["East Timor"],
         "United Arab Emirates": ["UAE", "Emirates"], "South Korea": ["Korea"], "Bosnia and Herzegovina": ["Bosnia"], "Cape Verde": ["Cabo Verde"],
         "Russia": ["Russian Federation"], "Vietnam": ["Viet Nam"], "Laos": ["Lao"], "Iran": ["Persia"], "Sri Lanka": ["Ceylon"], "Taiwan": ["Formosa"]}
REG = {"SA": "sa", "NA": "na", "EU": "eu", "AS": "as", "AF": "af", "OC": "oc"}
NOT_POOL = {"Western Sahara", "Falkland Islands", "French Southern Lands", "Northern Cyprus", "Somaliland", "Palestine", "Puerto Rico",
            "New Caledonia", "Greenland", "Kosovo", "Vanuatu", "Solomon Islands", "Brunei", "Gambia", "Lebanon", "Luxembourg", "Cyprus",
            "Trinidad and Tobago", "Djibouti", "Timor-Leste", "Eswatini", "Lesotho", "Bahamas", "Fiji", "Qatar", "Kuwait", "Belize", "El Salvador"}
wp = json.load(open(f"{ROOT}/assets/data/worldpaths.json"))["c"]
out = []
for n in geo["names"]:
    iso = ISO.get(n) or pycountry.countries.get(numeric=str(num[n]).zfill(3)).alpha_2
    disp = NAME.get(n, n)
    reg = {"XK": "eu", "TW": "as", "TL": "as", "CY": "eu", "EH": "af", "TF": "af"}.get(iso) or REG[pc.country_alpha2_to_continent_code(iso)]
    if iso == "RU": reg = "eu"
    pool = int(disp not in NOT_POOL and len(wp[n]) > 250)
    out.append([disp, iso, reg, pool, ALIAS.get(disp, [])])
json.dump(out, open(f"{ROOT}/assets/data/countries.json", "w"), ensure_ascii=False, separators=(",", ":"))
print(len(out), "countries,", sum(o[3] for o in out), "in the answer pool")
