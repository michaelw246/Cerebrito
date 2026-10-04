# Cards retired from the knowledge bank, applied by compile_bank.py (keyed by the final question text).
# A card earns its place if it's worth learning: it teaches something most people don't already know, and it has
# a story or a reason behind it. Retired here: facts nearly everyone knows (famous capitals, currencies and languages,
# "Who is Andrew Huberman?"), brand trivia (which beer a country drinks), answers given away by the question, and
# cards that duplicate another card. Review history for these ids is simply ignored by the app.
RETIRE = {
 # AI & tech
 "Which company makes Claude?", "OpenAI's CEO?", "When did the first iPhone launch?",
 "Neural networks are loosely inspired by…?", "What's machine learning, in one line?",
 # famous capitals, currencies, languages
 "Capital of Argentina?", "Capital of Chile?", "Capital of Colombia?", "Capital of Denmark?", "Capital of Egypt?",
 "Capital of England and the UK?", "Capital of Germany?", "Capital of Guatemala?", "Capital of Italy?", "Capital of Japan?",
 "Capital of Mexico?", "Capital of Norway?", "Capital of Peru?", "Capital of Portugal?", "Capital of Spain?",
 "Capital of Sweden?", "Capital of Thailand?", "Capital of Vietnam?", "Capital of China?", "Capital of Nepal?",
 "Indonesia's capital?", "Bali belongs to which country?",
 "Japan's currency?", "The UK's currency?", "Egypt's currency?",
 "Brazil's language?", "Main language of Egypt?", "Brazil was a colony of which country?",
 # beer brands
 "Albania's popular beers?", "Argentina's most common beer?", "Indonesia's most common beer?", "Brazil's most common beers?",
 "Chile's most common beers?", "Colombia's most common beers?", "Costa Rica's most common beer?", "Croatia's popular beers?",
 "Denmark's famous beer brands?", "The UK's best-selling lager?", "Germany's best-selling beers include…?",
 "Guatemala's most common beer?", "Italy's best-known mass-market beers?", "Japan's big beer brands?",
 "Bolivia's most common beers?", "Laos's dominant beer?", "Mexico's best-known beers?", "Montenegro's most common beer?",
 "Nicaragua's most common beers?", "Norway's popular beers?", "Peru's best-known beers?", "Portugal's two big beers?",
 "Spain's popular beers?", "Sri Lanka's best-known beer?", "Sweden's popular beers?", "Thailand's best-known beers?",
 "Vietnam's popular beers?", "China's best-known beer?", "Popular Nepali beers?",
 "The best-known local Egyptian lager, unrelated to the Belgian brand of the same name?",
 # common knowledge, or the question gives the answer away
 "Who is Andrew Huberman?", "Huberman's podcast first launched in…?", "Current UK monarch?", "Britain's longest-reigning monarch?",
 "WWI years?", "WWII years?", "The main Axis powers?", "Who led Britain through most of WWII?",
 "The style of fighting that defined the Western Front?", "The prehistoric stone circle on Salisbury Plain?",
 "Which Pisa landmark leans because of soft ground?", "How many villages make up the Cinque Terre?",
 "Norway's famous seafaring raiders of 793–1066?", "Ho Chi Minh City's old name?", "Vietnam's noodle soup, usually beef or chicken?",
 "Sri Lanka's world-famous export crop?", "Famous Swedish companies?", "Argentina's famous caramel spread?",
 "The Great Sphinx has the body of which animal?", "What signals that a new pope has been elected?",
 "What animal nursed Romulus and Remus?", "Turing's famous test for machine intelligence (1950)?",
 "Who played Turing in The Imitation Game (2014)?", "SpaceX's satellite internet service?",
 "What did Musk buy for about $44 billion in 2022 and rename X?", "The hit Netflix series about the hunt for Escobar?",
 "Second-highest mountain in the world?", "The hormone of darkness that signals sleep?", "How much sleep do most adults need?",
 "Bedroom temperature for good sleep should be…?", "Which is a compound lift?",
 # duplicates of another card
 "Who's the Argentine-born revolutionary famed in Cuba?", "Three-time world surfing champion Gabriel Medina is from…?",
 "Who painted the Sistine Chapel ceiling, 1508–1512?",
}
