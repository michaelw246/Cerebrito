# Explanations for the knowledge bank, keyed by card id (the same djb2/base36 hash of the question the app uses).
# compile_bank.py merges these into each card's "why" and fails if a key no longer matches a question,
# so an edited question can't silently lose its explanation. revise.py explanations take precedence.
X = {}

# ---------- Egypt ----------
X.update({
 "wx9x7k": "Founded by the Fatimids in AD 969, Cairo is now the largest city in the Arab world. The pyramids sit on its western edge at Giza.",
 "1ofhkp7": "Egyptian Arabic is the most widely understood dialect in the Arab world, thanks to decades of Egyptian films and TV.",
 "insv82": "Locals call it the 'geneih'. It's split into 100 piastres, and prices are often quoted in both.",
 "drmcdq": "Egypt's Stella has been brewed in Cairo since 1897 and has nothing to do with Belgium's Stella Artois.",
 "455000": "A carb feast that mixes Italian pasta with an Indian-style rice and lentil dish, topped with crispy onions. It's cheap, filling and everywhere.",
 "9pt1bl": "Built under Ferdinand de Lesseps, the 193 km canal spares ships the long voyage around Africa. About an eighth of world trade passes through it.",
 "1imheia": "French soldiers found it in 1799 near Rashid (Rosetta). Because the same text appears in a known language, Champollion could decode the hieroglyphs.",
 "rq5jdo": "When the French surrendered in Egypt in 1801, the stone passed to the British. It has been in the British Museum since 1802, and Egypt has asked for it back.",
 "11osq38": "The decree, issued in 196 BC for Ptolemy V, was copied in three scripts. Scholars could read the Greek, which made it the key to the other two.",
 "hc0kmn": "In a UNESCO rescue from 1964 to 1968, engineers sawed Ramses II's temples into over a thousand blocks and rebuilt them 65 m higher.",
 "1v4s7g0": "Lake Nasser stretches about 500 km into Sudan and is one of the largest man-made lakes on Earth. The dam ended the Nile's yearly floods.",
 "pnd2im": "It flows north into the Mediterranean, and whether it or the Amazon is the world's longest river is still argued over.",
})
# ---------- Nimsdai ----------
X.update({
 "1g89p07": "Nirmal 'Nims' Purja, born in Nepal in 1983, became one of the most famous mountaineers in the world within a few years of his first 8,000er.",
 "5chjzh": "The name was a challenge to everyone who said it couldn't be done: all fourteen 8,000 m peaks in under seven months.",
 "fk6frw": "He joined the Gurkhas at 18 and in 2009 became the first Gurkha selected for the Special Boat Service, the Royal Navy's special forces.",
 "9yopc0": "On 16 January 2021 ten Nepali climbers stepped onto K2's summit together, singing their national anthem. It was the last 8,000er unclimbed in winter.",
 "4gfoir": "Norwegian Kristin Harila and Tenjen Lama Sherpa climbed all fourteen in 92 days in 2023, roughly half Nimsdai's time.",
})
# ---------- Pyramids ----------
X.update({
 "wv43k3": "Imhotep was Djoser's vizier. Centuries later Egyptians worshipped him as a god of wisdom and medicine.",
 "1hutmay": "Saqqara was the vast burial ground of the old capital Memphis, about 20 km south of modern Cairo.",
 "ofjogu": "Around 2670 BC, in the 3rd Dynasty: about a century before the Great Pyramid.",
 "14qiv9r": "Meidum was probably finished by Sneferu. Its outer casing later slumped, leaving the tower-like core you see today.",
 "1ov0tlf": "It starts at about 54 degrees, then eases to about 43 halfway up, probably after cracks appeared during construction.",
 "14vnu5e": "Built at the gentler 43-degree angle learned from the Bent Pyramid, it's named for its reddish limestone.",
 "129q05q": "Sneferu's three pyramids were the learning curve. His son Khufu used the lessons to build the biggest of them all.",
 "hpgtjs": "Dahshur is about 40 km south of Cairo and far quieter than Giza, so you can see both pyramids almost alone.",
 "wan3w": "Khufu (Cheops in Greek) ruled in the 4th Dynasty. His pyramid used roughly 2.3 million blocks.",
 "1ds6rvj": "Around 2560 BC, after about 20 years of work. Cleopatra lived closer in time to us than to its building.",
 "5nexme": "It was about 146 m tall. Losing its smooth casing stones and capstone has cut it to about 139 m today.",
 "qjyo0i": "It held the record until Lincoln Cathedral's spire rose higher around 1311.",
 "185naeh": "Menkaure was probably Khafre's son, so the three pyramids span three generations of one family.",
 "1vz764g": "At about 65 m it's less than half the height of the other two, though it was cased partly in costly red granite.",
 "1nejso9": "Khafre's pyramid stands on bedrock about 10 m higher, and still has original casing stones near its tip.",
 "1sn0zdr": "The other six, including the Colossus of Rhodes and the Lighthouse of Alexandria, were destroyed long ago.",
})
# ---------- The 8,000ers ----------
X.update({
 "y2s1vz": "Both ranges were pushed up as the Indian plate rammed into Asia, a collision still lifting them a few millimetres a year.",
 "1wcukzx": "Everest, Kangchenjunga, Lhotse, Makalu, Cho Oyu, Dhaulagiri, Manaslu and Annapurna all stand in Nepal or on its borders.",
 "yf9qzn": "At 8,586 m on the Nepal–India border, Kangchenjunga was thought to be the world's highest mountain until 1852.",
 "1ibo5z3": "8,091 m, the tenth highest. Its south face is one of the biggest walls in the Himalaya.",
 "s9aahf": "Tenth of fourteen. It's not among the tallest, but for decades it was the most lethal.",
 "mnjsdd": "A French team climbed it in June 1950, three years before Everest.",
 "w0mm7c": "Herzog and Lachenal summited without oxygen and lost fingers and toes to frostbite. His book 'Annapurna' became a classic.",
 "1gzho2z": "Avalanche-prone slopes gave it a historic death rate of around one climber for every three summits, though it has fallen recently.",
 "1i1rxcu": "Shishapangma, 8,027 m, is the only one of the fourteen entirely inside Tibet.",
 "1ew9wq3": "After a deadly 1953 attempt, American climber George Bell said: 'It's a savage mountain that tries to kill you.'",
 "4k8z32": "It rises on the border of Pakistan's Gilgit-Baltistan and China's Xinjiang, deep in the Karakoram.",
 "ha0iyx": "They reached the top on 29 May 1953 with a British expedition led by John Hunt. News broke on the Queen's coronation day.",
 "1inxlow": "A beekeeper from Auckland, Hillary later spent decades building schools and hospitals in Nepal. He's on NZ's $5 note.",
 "75ey1h": "Doctors had warned the brain might not survive without bottled oxygen. In 1980 Messner climbed it again, alone.",
 "9ho2op": "The glacier moves about a metre a day, so 'icefall doctors' rebuild ladder routes through it all season.",
 "1fcgho6": "Sagarmatha means roughly 'forehead of the sky', a name adopted in Nepal in the 1960s.",
 "i0qnj8": "Chomolungma means 'goddess mother of the world'. The English name honours George Everest, a British surveyor.",
})
# ---------- AI & robotics ----------
X.update({
 "122p8fx": "McCarthy coined the term for the 1956 Dartmouth workshop and later created the LISP programming language.",
 "1dfuz2d": "Kasparov beat it in 1996, then lost the 1997 rematch 3.5 to 2.5: the first time a world champion lost a match to a computer.",
 "1sg5gi5": "AlphaGo won 4 to 1. Its 'move 37' in game two looked like a mistake to experts, then turned out to be brilliant.",
 "1c5079p": "Released on 30 November 2022, it reached about 100 million users in two months, then the fastest-growing app ever.",
 "7u9mw7": "Graphics chips do thousands of small calculations in parallel, which happens to be exactly what neural networks need.",
 "1qkvjhp": "Asimov set them out in his 1942 story 'Runaround'. Many of his stories are about how the laws go wrong.",
 "1v4g65m": "They kept faith in neural networks through decades when most of the field had given up on them.",
 "1rdtnon": "Hinton shared it with John Hopfield for foundational work that made modern machine learning with neural networks possible.",
 "wn7j7d": "Working out a protein's 3D shape used to take years in the lab. AlphaFold has predicted structures for about 200 million proteins.",
 "232dkc": "A child chess prodigy and video game designer, Hassabis shared the prize with John Jumper and David Baker.",
 "142w7y": "Atlas became famous for parkour and backflip videos. The hydraulic version retired in 2024 for an all-electric one.",
 "xxvfbd": "Spot has been sold commercially since 2020 and is used to inspect power plants, mines and construction sites.",
 "noyqa": "Tesla announced it in 2021, memorably with a person dancing in a robot suit. It's meant to do repetitive factory work.",
 "1lggmae": "ASIMO could walk, run and climb stairs. Honda ended its development in 2018.",
})
# ---------- Huberman: light & sleep ----------
X.update({
 "r2rktn": "Even through cloud, outdoor light is far brighter than indoors, but it takes longer to deliver the same signal to your body clock.",
 "nt7n0u": "Window glass and sunglasses dim the light that reaches the cells setting your clock. Glasses or contacts for vision are fine.",
 "xnspkn": "A warm bath or shower before bed can help: it draws heat to the skin, then the body cools faster afterwards.",
 "gmzky0": "Melatonin doesn't knock you out. It tells the body that night has begun, helping time when sleep comes.",
})
# ---------- Pablo Escobar ----------
X.update({
 "1uftpja": "At its height in the 1980s the Medellín Cartel is often said to have supplied around 80% of the cocaine reaching the US.",
 "1uxlh2q": "He negotiated his 1991 surrender on condition he built the jail himself. It had a football pitch and a bar, and he walked out in 1992.",
 "erbzv9": "He was shot by Colombian police the day after his 44th birthday, ending a 16-month manhunt.",
 "lwnvuv": "A police unit traced his radio call to a house in Los Olivos, Medellín. He died fleeing across the rooftops.",
 "1k6os1l": "Forbes listed him among the world's billionaires every year from 1987 to 1993.",
 "h9pd3k": "Narcos, starring Wagner Moura as Escobar, followed the DEA agents on his trail from 2015.",
 "vjtljt": "'Perseguidos por Pablo Escobar', people persecuted by Pablo. The group was backed by the rival Cali Cartel and paramilitaries.",
 "1s1b38n": "Their slogan was 'Better a grave in Colombia than a jail cell in the United States'. Colombia banned extradition in 1991.",
})
# ---------- Italy ----------
X.update({
 "zr50je": "Rome became the capital of unified Italy in 1871. Legend dates its founding to 753 BC.",
 "6pf0zj": "Peroni has been brewed in Rome since 1846 and Moretti in Udine since 1859.",
 "yycjrl": "Victor Emmanuel II became king of Italy in 1861 after campaigns led by Garibaldi and Cavour. Rome joined in 1870.",
 "5l5qcp": "Italians voted in a referendum on 2 June 1946, now celebrated as Festa della Repubblica.",
 "1kczryw": "The stone bridge was finished in 1591, replacing wooden ones. For centuries it was the only way across the Grand Canal on foot.",
 "1qzqlzv": "In the 1400s Florence's wealth and rivalries drew Brunelleschi, Donatello, Botticelli and later Leonardo and Michelangelo.",
 "1yg68ux": "The Medici banked for the Pope, ran Florence for generations and produced four popes of their own.",
 "1y4t8kd": "Built from 1420 to 1436 without a supporting wooden frame, it's still the largest brick dome ever built.",
 "1oai23o": "Carved from 1501 to 1504, the 5 m statue moved indoors in 1873. The one in Piazza della Signoria is a copy.",
 "1ajk5ex": "Butchers once worked there. In 1593 the Medici replaced them with goldsmiths, and it was the only Florence bridge the Germans spared in 1944.",
 "1slh2uh": "Cinque Terre means 'five lands'. The villages are linked by cliff paths and a train through the hillside.",
 "1ol6k07": "Riomaggiore is the southernmost of the five, its pastel houses stacked up a steep ravine.",
 "wtjt12": "Liguria is the crescent of Italian Riviera around Genoa.",
 "39f0p5": "Puglia is the heel of Italy's boot, known for trulli houses, olive oil and orecchiette pasta.",
 "17tyn0r": "Pane di Altamura, made from local durum wheat semolina, was the first bread in Europe to get protected (DOP) status.",
 "ta34pf": "Altamura Man is a Neanderthal skeleton over 130,000 years old, so encrusted in limestone it has never been removed from the cave.",
 "1b49rri": "The Uffizi was built as offices ('uffizi') for the Medici government, then became one of the world's first public galleries.",
 "1wn5g9l": "It began tilting in the 1170s while still being built. Engineers stabilised it around 2001 by removing soil from under the high side.",
})
# ---------- Huberman: caffeine & chemistry ----------
X.update({
 "od3khn": "Caffeine only hides adenosine. Drinking it while adenosine is high means the full backlog lands when it wears off.",
 "1p4t8g9": "With a half-life of about 5 hours, a quarter of the caffeine is still active after 10. It cuts deep sleep even if you fall asleep.",
 "kudy1c": "Stacking stimulants with everything you enjoy makes the baseline drop, so the activity alone starts to feel flat.",
 "cqzgdk": "Roughly an hour a week, split over two or three sessions in a hot sauna, mirroring the Finnish studies he cites.",
 "ba6r26": "Attention seems to run in roughly 90-minute ultradian cycles, so longer deep-focus blocks hit diminishing returns.",
 "b0ftxg": "Cold water can raise norepinephrine several-fold, which explains the alert, focused feeling that lasts after a plunge.",
})
# ---------- Alexander the Great ----------
X.update({
 "rsadrd": "Pella was the capital of Macedon, a kingdom the southern Greeks regarded as half-barbarian.",
 "bjm9cw": "Philip hired Aristotle in 343 BC. He gave Alexander a lifelong love of Homer and curiosity about science.",
 "lhq32k": "Philip II built the Macedonian army with its long-speared phalanx, then was assassinated in 336 BC.",
 "1dp3bat": "He took the throne at 20 after his father's murder and crushed rebellions before invading Persia two years later.",
 "18tn8hq": "Young Alexander tamed him by noticing the horse was afraid of its own shadow and turning him towards the sun.",
 "6e489v": "He beat Darius at Issus in 333 BC and Gaugamela in 331 BC. Darius was later killed by his own nobles.",
 "1hdky7": "Legend said whoever untied the knot at Gordium would rule Asia. A bold, lateral answer to an impossible puzzle.",
 "19ovni8": "In about 15 years of campaigning he never lost a battle he commanded, often against much larger armies.",
 "1vbh067": "He died in 323 BC after a fever. Whether it was illness, drink or poison is still debated.",
 "x213ko": "Plutarch says he slept with a copy of the Iliad, annotated by Aristotle, under his pillow.",
})
# ---------- Sphinx ----------
X.update({
 "1967y4d": "It sits beside Khafre's causeway, and its face is generally thought to be his.",
 "15i4uhj": "A lion's body with a king's head: royal power and strength combined, guarding the pyramids.",
 "1kvl9xy": "About 73 m long and 20 m high, it's the largest monolithic statue in the world.",
 "cgl9wc": "Drawings from the 1730s show it already noseless. A 15th-century writer blamed a Sufi zealot who damaged it in 1378.",
 "b26a75": "Builders quarried the limestone around an outcrop and shaped what remained, so the Sphinx is part of the plateau itself.",
})
# ---------- Tech essentials ----------
X.update({
 "1xh5m1y": "Each artificial 'neuron' adds up weighted inputs and passes on a signal, a loose sketch of how brain cells fire.",
 "10vgudw": "AlexNet cut the ImageNet error rate from about 26% to 15% using GPUs. Hinton, Sutskever and Krizhevsky built it.",
 "3csxxj": "Training is the expensive learning phase. Inference is every time the finished model answers a question.",
 "1qey9hp": "Anthropic is an AI safety and research company founded in 2021.",
 "tmlck": "Both siblings came from OpenAI. Dario is CEO and Daniela is president.",
 "tpc1xt": "Altman has led OpenAI since 2019. In November 2023 the board fired him and he was reinstated within days.",
 "p7ljx9": "Huang co-founded Nvidia in 1993, reportedly over a meal at a Denny's. Its chips now power most AI training.",
 "w5uvh0": "Google reportedly paid around £400 million in 2014. DeepMind went on to build AlphaGo and AlphaFold.",
 "9wqk22": "Founded by Morris Chang in 1987, TSMC builds chips other companies design, including Apple's and Nvidia's.",
 "48m5wh": "In 1843 she published what's seen as the first algorithm, for Charles Babbage's never-built Analytical Engine.",
 "w72t81": "He proposed it at CERN in 1989 to share documents between scientists, and gave it away without a patent.",
 "k5llri": "Steve Jobs unveiled it in January 2007 as 'an iPod, a phone and an internet communicator', all in one.",
 "1ykbpmw": "Waymo grew out of Google's 2009 self-driving project and runs paid rides with nobody in the driver's seat.",
 "1ibif98": "A qubit can hold a blend of 0 and 1 at once, which lets quantum computers attack certain problems in new ways.",
 "gs81yr": "A surgeon sits at a console and steers tiny instruments through small incisions, with tremor filtered out.",
 "16juvyo": "Large models have billions of these numbers. Training nudges each one until the model's predictions improve.",
})
# ---------- Annapurna & Nepal ----------
X.update({
 "oqdi67": "Most trekkers reach it in about a week from Pokhara, climbing through rhododendron forest and bamboo.",
 "13r0bfv": "A high glacial basin ringed by Annapurna I, Hiunchuli and Machapuchare. You only enter through one narrow gorge.",
 "zj3r9g": "At 6,993 m it's sacred to Shiva. A 1957 team stopped just short of the top, and climbing has been banned since.",
 "zkgqwu": "Pokhara sits on Phewa Lake with the Annapurnas reflected in it, the base for most treks in the region.",
 "12pd29z": "The Kathmandu Valley holds seven UNESCO-listed monument zones, including Durbar Squares and the Boudhanath stupa.",
 "1nx7ifc": "Two stacked pennants represent the Himalaya and the country's two great religions. The constitution explains how to draw it.",
 "1ry2ov4": "Nepal keeps its own time, 15 minutes ahead of India, based on a meridian close to its own longitude.",
 "1lks8e1": "'Dal bhat power, 24 hour' say the porters. On treks, refills are usually free, which makes it the best value meal on the trail.",
 "pb8jxr": "Momos came from Tibet with Newar traders and are now Nepal's favourite snack, steamed or fried with spicy chutney.",
 "4ji0a9": "Most trekkers' summit-day beer is a Gorkha or an Everest, brewed in Nepal.",
 "1u7a9d7": "Siddhartha Gautama was born in Lumbini around the 5th or 6th century BC. A pillar by Emperor Ashoka marks the spot.",
 "1hdlj2s": "After a decade-long Maoist insurgency, Nepal ended 240 years of Shah kings and became a federal republic in 2008.",
 "1re114h": "It lost territory to Britain in 1816 but stayed independent, and its soldiers so impressed the British that they recruited them.",
 "2x9904": "Gurkhas have served Britain since 1815. They carry the curved kukri knife and are famed for courage.",
 "x1r1k3": "The Gorkha earthquake of 25 April 2015 killed nearly 9,000 people and triggered a deadly avalanche at Everest base camp.",
 "19aq1w9": "The Nepalese rupee is pegged to the Indian rupee, at 1.6 to 1.",
})
# ---------- Valley of the Kings ----------
X.update({
 "j4i7pc": "Ancient Thebes straddled the Nile: temples for the living on the east bank, tombs for the dead in the western hills.",
 "h8nicu": "New Kingdom pharaohs, roughly 1550 to 1070 BC, were buried here in over 60 hidden rock-cut tombs.",
 "1pw466z": "Peering in by candlelight in November 1922, Carter said he could see 'wonderful things'.",
 "7znf9x": "The Earl of Carnarvon paid for years of fruitless digging and was about to give up when the tomb turned up.",
 "c9y7ds": "KV means Kings' Valley. Tutankhamun's was the 62nd tomb found there.",
 "1mkcfza": "A boy king of about nine, he reigned for around ten years, guided by powerful advisers.",
 "1ontxzw": "Scans show a broken leg and signs of malaria. How he died is still debated.",
 "1rd5vjk": "The innermost coffin is solid gold and weighs about 110 kg.",
 "2erw18": "DNA tests point to Akhenaten, who tried to replace Egypt's gods with the single sun disc, the Aten.",
 "1h9fl19": "Carnarvon died of an infected mosquito bite in 1923 and the press did the rest. Carter lived until 1939.",
})
# ---------- Genghis Khan ----------
X.update({
 "17r4s5b": "Born around 1162, Temüjin grew up an outcast after his father was poisoned, then united the Mongol tribes.",
 "16esjp1": "A great assembly, the kurultai, named him Genghis Khan in 1206, probably meaning 'universal' or 'fierce' ruler.",
 "b4dur9": "Riders changing horses at relay stations could carry messages hundreds of kilometres a day across the empire.",
 "kvmdv5": "Each warrior had several horses and a powerful composite bow, and the armies used feigned retreats to break enemy lines.",
 "34jkio": "He died in 1227 during a campaign against the Western Xia kingdom, possibly after a fall from his horse.",
 "3wkcrw": "Legend says his funeral escort killed anyone who saw it, then horses trampled the grave flat. It has never been found.",
 "z1bmce": "Kublai founded the Yuan dynasty in 1271 and ruled from Khanbaliq, today's Beijing.",
 "1dvw1wh": "Marco Polo spent about 17 years in China. His book amazed Europe with tales of paper money and vast cities.",
 "wo9sb3": "Under the 'Pax Mongolica' merchants could cross Eurasia under Mongol protection.",
})
# ---------- Sleep ----------
X.update({
 "151a9l4": "Magnesium threonate, apigenin (found in chamomile) and theanine. He stresses that light, timing and temperature come first.",
 "1dyqev2": "He argues seeing the low evening sun makes your eyes less sensitive to artificial light later that night.",
 "19b4h5b": "Waking at the same time anchors the body clock, which then times your sleepiness the next night.",
 "vwasif": "Sleep medicine bodies recommend 7 to 9 hours for adults. Regularly getting less raises the risk of many diseases.",
 "1o5vakc": "Sunlight is about 200 times brighter than a typical room, which is why indoor light barely registers with your body clock.",
 "1otnsql": "A 2011 study found a week of five-hour nights cut young men's daytime testosterone by 10 to 15%, like ageing 10 to 15 years.",
})
# ---------- San Francisco ----------
X.update({
 "3roztt": "On opening in 1937 it had the longest suspension span in the world, a record it held until 1964.",
 "9q6gmb": "It was meant to be a temporary primer. The architect kept it because it suits the setting and stands out in fog.",
 "mckdt7": "The 1906 earthquake broke gas and water mains. Fires burned for days and destroyed about 80% of the city.",
 "dpb4xu": "Since 1873 a gripman has pulled a lever to clamp onto a cable running under the street. They're a National Historic Landmark.",
 "11t72jq": "The eight hairpin bends were built in 1922 because the hill was too steep for cars to climb straight up.",
 "1uqrmq7": "Named in the 1970s after the silicon chip makers that clustered around Stanford and Palo Alto.",
 "ngv8n8": "In 1967 around 100,000 young people poured into Haight-Ashbury, the heart of the hippie movement.",
 "5mxm0c": "Anchor made 'steam beer', a style unique to California. Its owner Sapporo closed the brewery in 2023.",
})
# ---------- Karnak ----------
X.update({
 "1fy0gsf": "Amun-Ra was the king of the gods in the New Kingdom, and his priests at Karnak became enormously wealthy.",
 "1ckn18u": "Covering about 80 hectares, it's one of the largest religious sites ever built.",
 "1pi0232": "134 columns in 16 rows, the central ones about 21 m tall. Their carvings were once brightly painted.",
 "11opst0": "A road lined with hundreds of sphinxes ran about 2.7 km between the two temples. It reopened to the public in 2021.",
 "1inh0e2": "From the Middle Kingdom to the Ptolemies, pharaohs added halls, pylons and obelisks for about two thousand years.",
})
# ---------- Napoleon ----------
X.update({
 "52denr": "He was born in Ajaccio in 1769, just a year after France took Corsica from Genoa, and spoke French with an accent.",
 "zkjmem": "At Notre-Dame in 1804 he took the crown from Pope Pius VII and placed it on his own head.",
 "1fepmyi": "Called the Battle of the Three Emperors, it crushed Austria and Russia on 2 December 1805.",
 "18a3jr0": "Around 600,000 men marched into Russia. Burned cities, winter and disease destroyed all but a fraction of them.",
 "1ix4vp0": "Exiled to Elba off Tuscany in 1814, he was even allowed to rule the little island. He escaped within a year.",
 "1ycjwh2": "He landed in France in March 1815 and marched on Paris as the army rallied to him, until Waterloo ended it.",
 "sufedu": "Wellington's Anglo-allied army held on all day until Blücher's Prussians arrived on Napoleon's flank.",
 "vsx8kh": "Saint Helena is a speck in the South Atlantic, nearly 2,000 km from Africa, chosen so he couldn't escape again.",
 "1tkl0yu": "The 1804 Civil Code set out equality before the law and property rights, and shaped legal systems around the world.",
 "128tl6x": "His savants and soldiers found it in 1799, but the British took it as spoils when the French surrendered in 1801.",
})
# ---------- Huaraz & Cordillera Blanca ----------
X.update({
 "wvk5xq": "Huascarán is the highest point in the tropics, and its summit is the furthest spot from Earth's centre after Chimborazo.",
 "1nzjpxp": "Huascarán Sur is 6,768 m. Its slightly lower north summit was first climbed by Annie Peck in 1908.",
 "1tmpauw": "Hundreds of glaciers sit within about 10 degrees of the equator here, though they're shrinking fast.",
 "17ko7ks": "At 5,686 m it's popular as a first glaciated summit, climbed from a high camp above Huaraz.",
 "16rd40v": "Glaciers grind rock into fine 'flour' that stays suspended in the water and scatters light, turning it turquoise.",
 "15k72hi": "The 1970 quake sent an avalanche off Huascarán that buried Yungay in minutes. Only the cemetery hill survived.",
 "1o3nnrf": "A 1966 vote in a German climbing magazine chose Alpamayo's near-perfect ice pyramid.",
})
# ---------- Hatshepsut ----------
X.update({
 "1xknk2y": "Her terraced temple climbs into the cliffs at Deir el-Bahari, across the river from Luxor.",
 "1lodnas": "She ruled for about 20 years around 1479 to 1458 BC, taking full kingly titles rather than acting as regent.",
 "1xn8tqp": "Kingship was traditionally male, so official images showed her with the false beard and regalia of a pharaoh.",
 "1t7gi1a": "Punt was probably on the Red Sea coast of the Horn of Africa. Her ships returned with myrrh trees, incense and ebony.",
 "8bd7q3": "Senenmut was her steward and trusted adviser, and possibly much more, if the gossip is to be believed.",
})
# ---------- Quechua ----------
X.update({
 "66ltn4": "Quechua, which speakers call 'runa simi', the people's language, was the empire's common tongue.",
 "13wsyfr": "Mostly in Peru, Bolivia and Ecuador. It's the most widely spoken Indigenous language family in the Americas.",
 "1q9m0g": "Añay is common in Cusco. Learn one Quechua word before a trek and people's faces light up.",
 "z019xm": "Quechua expresses parting as a promise to meet again, rather than a flat 'goodbye'.",
 "dq4wjh": "'Jerky' comes from 'ch'arki', dried meat. Quechua also gave English 'quinine' and 'guano'.",
 "1txf06m": "Aymara is spoken by about two million people around Lake Titicaca in Peru and Bolivia.",
})
# ---------- Stress & breathing ----------
X.update({
 "1lem0gq": "Former SEAL Mark Divine popularised it as a way to stay calm and think clearly under pressure.",
 "1me73g": "Deliberate overbreathing raises adrenaline. A 2014 study found trained volunteers could dampen their inflammatory response.",
 "sb7m2r": "In her studies, seeing stress as something that sharpens you improved health and performance, even with the same stress.",
 "3m42ne": "The nose filters, warms and humidifies air and tends to slow your breathing, which calms the nervous system.",
})
# ---------- Alexander & the Ptolemies ----------
X.update({
 "kvci9b": "Egyptians resented Persian rule, so Alexander was welcomed in 332 BC as a liberator and crowned as pharaoh.",
 "1bp6obc": "He trekked across the Western Desert to Siwa's oracle of Amun, which reportedly greeted him as the god's son.",
 "kp6wx": "Laid out on a grid by the architect Dinocrates, it became the greatest city of the Greek world.",
 "yuexjo": "Ptolemy even hijacked Alexander's body for Egypt. His dynasty ruled for nearly 300 years, ending with Cleopatra.",
 "tcg5z7": "The lighthouse was about 100 m tall. 'Pharos' still means lighthouse in several languages, like French 'phare'.",
 "1t4n8vc": "Scrolls found on ships were copied. Often the library kept the originals and handed back the copies.",
 "qwxl1b": "The Ptolemies were Macedonian Greeks who often married their own siblings to keep power in the family.",
 "1y9o43f": "Plutarch says she spoke many languages and was the first of her family to learn Egyptian, after nearly 300 years.",
})
# ---------- Death Road & Bolivian summits ----------
X.update({
 "1cqzcvc": "It runs about 64 km from La Cumbre pass down to Coroico in the Yungas cloud forest.",
 "vw68mu": "Paraguayan prisoners captured in the 1930s Chaco War were made to cut it into the mountainside.",
 "s687js": "With sheer drops and no guardrails, the Inter-American Development Bank gave it the title in 1995. The name stuck.",
 "1e0lqzl": "You start in snow at about 4,650 m and finish in humid jungle around 1,200 m, all in one day of downhill riding.",
 "1nu5r6z": "Buses and trucks squeezing past each other on a single lane above huge drops made it notoriously deadly.",
 "hr7504": "With traffic on the new road, the old one became Bolivia's most famous mountain-bike ride.",
 "1yjgbkq": "6,088 m, and the trailhead is about an hour from La Paz, which is why it's called an accessible 6,000er.",
 "3y3x9b": "The Cordillera Real is the snowy wall of peaks east of La Paz, including Illimani and Huayna Potosí.",
 "11wmot7": "Sajama, an extinct volcano at 6,542 m, rises from a national park that holds some of the world's highest-altitude trees.",
 "1vwzbue": "Illimani's triple summit, about 6,438 m, looms over the city and appears in its anthem and art.",
 "1tdqp0p": "About 10,500 km², the remains of prehistoric lakes. In the wet season a thin film of water turns it into a giant mirror.",
 "1o7e3ix": "The brine beneath holds one of the world's biggest lithium resources, the metal in rechargeable batteries.",
})
# ---------- Peru ----------
X.update({
 "1ckdmr7": "Pizarro founded Lima in 1535 as the 'City of Kings'. It sits in a coastal desert where it almost never rains.",
 "n7uqab": "Cusqueña is the one you'll see at every trekking lodge, and Pilsen Callao is the classic everyday lager.",
 "1ftxh2y": "Pisco, lime, sugar syrup and egg white, finished with drops of bitters. Peru even has a national Pisco Sour Day.",
 "1qxgk96": "Launched in 1935 and flavoured with lemon verbena, it outsold Coca-Cola in Peru until Coke bought a stake in 1999.",
 "w2wzex": "Purple corn is boiled with pineapple, cinnamon and cloves, then sweetened and served cold.",
 "1iihnmx": "Lime acid firms the fish's proteins like gentle cooking. The leftover juice, 'leche de tigre', is drunk as a pick-me-up.",
 "gmn79f": "Andean people have eaten guinea pig for millennia. Cusco Cathedral's Last Supper painting even shows one on the table.",
 "572hzh": "Chinese immigrants from the 1800s brought the wok and soy sauce. It's served, very Peruvian-style, with both chips and rice.",
 "13ti9ya": "Ica is the heart of Peru's grape and pisco country, a few minutes from the dunes of Huacachina.",
 "1fbeshk": "Made roughly 500 BC to AD 500 by clearing reddish stones, figures like the hummingbird are best seen from the air.",
 "1qbkjol": "'Sol' means sun, a nod to the Inca sun god. It replaced hyperinflation-hit currencies in 1991.",
 "1hpq4wa": "Potatoes were domesticated near Lake Titicaca thousands of years ago, and Peru grows around 4,000 kinds.",
 "1y3hh7d": "At about 3,812 m, Titicaca is home to the Uros people's floating islands woven from totora reeds.",
})
# ---------- Other great leaders ----------
X.update({
 "kmtmgp": "Hannibal crossed with about 37 elephants, then crushed the Romans at Cannae in 216 BC, yet never took Rome.",
 "1b4cg3o": "After taking Babylon in 539 BC, Cyrus let the exiled Jews return home and rebuild their temple.",
 "m4hk2k": "Pope Leo III crowned him in St Peter's, reviving the title of emperor in the West for the first time since 476.",
 "1smu9ty": "After the Battle of Hattin, Saladin retook Jerusalem in 1187 and spared its people, unlike the Crusaders in 1099.",
 "8vimrd": "Aged just 21, Mehmed breached Constantinople's walls with giant cannons, ending the Byzantine Empire.",
 "1lgfenk": "He standardised writing, coins, weights and even cart axle widths across China, and began linking its walls.",
 "na9uw9": "He became prime minister in May 1940 as France fell, and refused to negotiate with Hitler.",
 "244lm7": "Leonidas held the narrow pass for three days until a local showed the Persians a mountain path around it.",
 "16k4pxl": "'Tamerlane' comes from the Persian 'Timur-i Lang', Timur the Lame, after injuries to his leg and arm.",
 "x7k42k": "Attila's Huns terrorised both halves of the Roman Empire. He died in 453, reportedly on his wedding night.",
 "138wg59": "Shaka introduced a short stabbing spear and the 'horns of the bull' formation, building the Zulu into a powerful kingdom.",
 "16njxm6": "On his 1324 pilgrimage to Mecca he gave away so much gold that its price in Cairo stayed depressed for years.",
})
# ---------- Focus, learning & mind ----------
X.update({
 "19c6fhy": "Practice flags which connections to change; the strengthening itself happens offline, during sleep and deep rest.",
 "1m9zc7f": "Visual focus pulls mental focus along with it, so a minute of holding your gaze on one spot can sharpen attention.",
 "1qbtwx": "Just 13 minutes a day for 8 weeks improved attention, memory and mood in non-meditators in a 2019 study.",
 "1f6hfso": "A short session of non-sleep deep rest after learning appears to help the brain consolidate what was just practised.",
 "8a5rmt": "If you learn to feel rewarded by effort itself, the struggle fuels you instead of draining you.",
 "g3g8j5": "Oxytocin rises with touch, eye contact and closeness, and helps build trust and bonds between people.",
 "tlzzev": "Studies he cites find receiving gratitude, or hearing a moving story of someone being helped, shifts mood more than listing things.",
})
# ---------- Caesar & Cleopatra ----------
X.update({
 "1tmrf29": "Plutarch describes a bedding sack. The rolled-up carpet is a later, more cinematic retelling.",
 "t6dyz": "Her loyal friend Apollodorus rowed her into Alexandria at dusk and carried her into the palace.",
 "1m89lna": "Cleopatra was about 21 and Caesar 52 when they met in 48 BC, while he was chasing Pompey's supporters.",
 "ucunt8": "Ptolemy XIII lost to Caesar's forces and drowned in the Nile in 47 BC, leaving Cleopatra in charge.",
 "12pugxc": "'Little Caesar' was a threat to Octavian, who had him killed in 30 BC.",
 "10g0uir": "Antony and Cleopatra had three children and ruled the East together, which Octavian painted as Rome betrayed.",
 "1cigx7z": "Octavian's admiral Agrippa won off western Greece. Antony and Cleopatra fled back to Egypt.",
 "v7fgo": "Plutarch reports an asp, the Egyptian cobra, but admits nobody knew for sure. Poison is just as likely.",
 "1cenvh2": "Egypt became Augustus' personal province and Rome's breadbasket, shipping grain to feed the city.",
})
# ---------- Pumas, jaguars & Andean wildlife ----------
X.update({
 "1syc8v7": "Open steppe, plenty of guanacos and expert local trackers make Torres del Paine the best place to see wild pumas.",
 "1l3gmr": "One species, Puma concolor. It holds the record for the animal with the most names.",
 "fkg80g": "Pumas lack the specialised voice box of lions and tigers, so they purr, hiss, whistle and scream instead.",
 "1q1n9hn": "The jaguar is the third-largest cat in the world after the tiger and lion.",
 "lx9bkg": "Its bite is extraordinarily strong for its size, enough to crack skulls and turtle shells.",
 "1qv2m1n": "Jaguars are strong swimmers and hunt caimans and fish along rivers, especially in Brazil's Pantanal.",
 "f9k8de": "Guanacos make up most of a Patagonian puma's diet, which keeps the two closely linked across the steppe.",
 "132c4h": "Llamas were domesticated from wild guanacos thousands of years ago in the Andes.",
 "10su5jh": "Up to about 3.3 m, among the widest of any land bird. Condors ride thermals for hours, hardly flapping.",
 "kw1vlj": "A jaguar's rosettes are larger with a dot inside, a quick way to tell it from a leopard.",
})
# ---------- Alan Turing & Enigma ----------
X.update({
 "1i3tnvl": "By 1945 nearly 10,000 people, most of them women, worked at the Buckinghamshire estate in total secrecy.",
 "1tquylu": "Building on a Polish design, Turing and Gordon Welchman's Bombe ran through Enigma settings far faster than people could.",
 "1cy42fr": "The film named it after Christopher Morcom, Turing's close school friend who died young. That's dramatic licence.",
 "kmwpb6": "Cumberbatch's performance earned him an Oscar nomination.",
 "1j24p46": "'Ultra' signalled a classification above Top Secret. Its existence wasn't made public until the 1970s.",
 "jgayup": "In a 1950 paper he proposed the 'imitation game': if you can't tell machine from human in conversation, call it thinking.",
 "14lpne7": "The 2013 royal pardon was followed in 2017 by 'Turing's law', pardoning thousands of others convicted under the same laws.",
 "1h2cl4i": "The note was issued on 23 June 2021, his birthday, with a quote: 'This is only a foretaste of what is to come.'",
})
# ---------- La Paz & El Alto ----------
X.update({
 "1268sgy": "Bolivia declared independence in Sucre in 1825. The Supreme Court still sits there.",
 "1b3ujyg": "The president, congress and most ministries are in La Paz, so in practice it runs the country.",
 "1gmcet0": "At about 3,600 m, visitors often feel the altitude walking uphill from the airport, which is even higher.",
 "abh45": "Held on Thursdays and Sundays, it sprawls over kilometres of streets selling everything from car parts to puppies.",
 "l79i99": "The Mercado de las Brujas sells charms, herbs and offerings for Pachamama, mixing Aymara and Catholic tradition.",
 "nxf5p1": "Many people still bury an offering called a sullu under new buildings for the earth goddess's blessing.",
 "xwgidd": "Women wrestle in traditional pollera skirts and bowler hats, a show that's also a statement of Indigenous pride.",
 "5ig00x": "Paceña has been brewed in La Paz since 1886. Huari is the premium choice.",
 "986yg": "An Aymara former coca farmers' union leader, Morales governed from 2006 until 2019.",
 "kzdder": "Freshly independent in 1825, the country named itself after its liberator, Simón Bolívar.",
 "xbv7bn": "Che was captured and executed in October 1967 near La Higuera after a failed guerrilla campaign.",
 "gs69pc": "Bolivia lost its coast to Chile in 1884 but never let go of the claim. Every 23 March is its Day of the Sea.",
 "1mj1dtb": "Silver from Cerro Rico made Potosí one of the world's largest cities by the 1600s. 'Vale un Potosí' means 'worth a fortune'.",
})
# ---------- Hawara Labyrinth ----------
X.update({
 "4xhxkr": "Amenemhat III, of the Middle Kingdom's 12th Dynasty, built his pyramid and a huge temple complex at Hawara.",
 "16629so": "Herodotus visited in the 5th century BC and claimed it had 3,000 rooms, half of them underground.",
 "49e5da": "The Faiyum is a fertile basin fed by a branch of the Nile, south-west of Cairo.",
 "6z0dq8": "Flinders Petrie found its vast foundations in 1888. Much of the stone had been carted off for building in Roman times.",
 "vlotbv": "The Mataha expedition used ground-penetrating scans in 2008 and reported structures below the surface. It's never been excavated.",
})
# ---------- Gym & training ----------
X.update({
 "1tu4orx": "Large studies find people with low fitness have far higher death rates than fit people, more than smoking does.",
 "84seli": "Heavy sets of 3 to 5 reps train the nervous system to recruit more muscle fibres at once.",
 "1pl1gze": "Muscles need a few minutes to rebuild their fastest energy stores, so short rests sap heavy lifts.",
 "1a87fz7": "Training is the signal; muscle protein is built over the following day or two, helped by food and sleep.",
 "10pqr2g": "A compound lift moves several joints at once, like squats, deadlifts and presses, training more muscle per set.",
 "166flaa": "He argues that past about an hour of hard training, returns fall as fatigue and stress hormones climb.",
 "1tj7hkq": "Andy Galpin is a professor of kinesiology who studies how muscle adapts to training.",
 "131a0kt": "Cold dampens the inflammation and signalling that drive muscle growth, so separate the two by several hours.",
 "l0c934": "Published in 2023, Outlive argues for training strength, cardio and stability early to protect the last decade of life.",
 "utfcvc": "Pick the ten things you want to do at 90, like lifting a grandchild or climbing stairs, then train for them now.",
 "rj3jb1": "Non-exercise activity thermogenesis can differ between people by several hundred calories a day.",
})
# ---------- Amazon ----------
X.update({
 "ng8ydq": "About 5.5 million km², larger than the whole European Union.",
 "ipmzsq": "Brazil, Peru, Colombia, Venezuela, Ecuador, Bolivia, Guyana, Suriname and France, through French Guiana.",
 "wb7yfb": "Most of the forest, and most of the deforestation, is in Brazil.",
 "1rnaqro": "The Amazon carries more water than the next several largest rivers combined.",
 "1vuh0x6": "A 2013 survey estimated around 390 billion trees from about 16,000 species.",
 "7vjwdh": "About one in ten known species lives in the Amazon, and many more remain undescribed.",
 "1mizhd7": "Botos get pinker with age, and local legend says they turn into charming men at night.",
 "13lctu0": "Capybaras weigh up to about 65 kg and are semi-aquatic, with webbed feet.",
 "13db2eq": "Female green anacondas are much bigger than males and can outweigh a grown man.",
 "1nurqcj": "Arapaima can grow to about 3 m. They must surface every few minutes to gulp air.",
 "c0lmkv": "Moving so slowly helps them hide from eagles and jaguars, and the green algae adds camouflage.",
 "1846f86": "Bright colours advertise poison, a strategy called aposematism. Captive-bred frogs aren't toxic because they lack their wild diet.",
 "1p39kcj": "Rurrenabaque sits on the Beni River, the jumping-off point for Madidi's jungle and the pampas wetlands.",
})
# ---------- Colosseum ----------
X.update({
 "19mpph5": "Named after the Flavian emperors who built it. 'Colosseum' probably came from a colossal statue of Nero next door.",
 "1ekbahm": "Vespasian funded it partly with treasure taken from Jerusalem in AD 70.",
 "1xvasob": "Vespasian died before it was finished; his son Titus opened it in AD 80.",
 "1332ce1": "According to Cassius Dio, about 9,000 animals were killed during the 100 days of opening games.",
 "cedznn": "Estimates run from about 50,000 to 80,000, roughly a modern football stadium.",
 "q5uo21": "Sailors from the Roman fleet rigged the vast canvas awning to shade spectators.",
 "ha63f8": "Dozens of lifts worked by winches raised animals and scenery through trapdoors in the floor.",
 "1kpk2qc": "Latin 'harena' meant sand. It soaked up blood and gave fighters grip.",
 "1mszpdh": "Hunts with exotic beasts usually filled the morning programme.",
 "rx8uch": "Animals were shipped in from across the empire, draining parts of North Africa of big wildlife.",
 "1742d83": "Senators sat at the front and women and the poor right at the top, as Augustus' laws required.",
 "1uutwmj": "Early on the arena may have been flooded for mock sea battles, before the underground hypogeum was built.",
})
# ---------- Elon Musk ----------
X.update({
 "1xiqekp": "Born in Pretoria in 1971, Musk moved to Canada at 17 and then to the US for university.",
 "jvylie": "X.com merged with Confinity in 2000 to form PayPal. eBay bought it in 2002 for $1.5 billion.",
 "1356x8q": "He founded SpaceX in 2002 with money from the PayPal sale.",
 "1ajt8yp": "After three failures, the fourth launch in September 2008 reached orbit when the company was nearly bankrupt.",
 "nqlarx": "In December 2015 a Falcon 9 first stage landed upright at Cape Canaveral, the start of rocket reuse.",
 "1q744xe": "Bob Behnken and Doug Hurley flew in May 2020, the first crew launched from the US since the Space Shuttle retired.",
 "gnb9lv": "Starlink uses thousands of satellites in low orbit to beam internet almost anywhere.",
 "h3w1rp": "The Roadster was built on a Lotus chassis. Musk's own was later launched into space on a Falcon Heavy.",
 "13xbedq": "Neuralink implanted its first device in a human in 2024, letting a paralysed man move a cursor by thought.",
 "u03b04": "Musk founded xAI in 2023. Its chatbot Grok is built into X.",
 "ccv3gu": "He was an early co-founder and funder, left the board in 2018, and later sued the company.",
 "1bvj9zk": "The deal closed in October 2022. The bird logo was replaced by an X the following year.",
 "1dw1bw5": "The name is a pun. Its best-known project is a tunnel loop under the Las Vegas Convention Center.",
})
# ---------- San Pedro prison ----------
X.update({
 "etjbn3": "There are few guards inside. Inmates run the place, pay for their cells, and some have families living with them.",
 "12kk0g4": "Marching Powder, published in 2003, became a backpacker classic.",
 "1itb5fh": "Rusty Young, a young Australian law graduate, lived inside the prison for months to write it.",
 "1sspll2": "Thomas McFadden was arrested at La Paz airport with cocaine and spent years in San Pedro.",
 "1xadhvc": "He bribed guards to let backpackers in for tours, which even made it into guidebooks.",
})
# ---------- Argentina ----------
X.update({
 "qhr12o": "People from Buenos Aires are 'porteños', people of the port, a nod to its history as a trading hub.",
 "z91pdt": "Brewed since 1890 in the town of Quilmes, its blue and white label matches the national team.",
 "syr8e1": "Argentina drinks more Fernet than anywhere, and Fernet con Coca is practically Córdoba's official drink.",
 "7imm5o": "Mate is shared: one person, the cebador, refills the gourd and passes it round the group.",
 "jso22w": "The bombilla has a filter at the bottom so you sip the infusion without the leaves.",
 "1thd7yi": "Malbec came from south-west France and thrived in Mendoza's high, sunny vineyards.",
 "rcgxrs": "At 6,961 m it's the highest mountain outside Asia and one of the Seven Summits.",
 "g47q3d": "Its normal route isn't technical, but altitude, cold and fierce winds turn back many climbers.",
 "1b9of29": "Bariloche on Lake Nahuel Huapi looks like a slice of the Alps, chalets and chocolate shops included.",
 "1pxnbdw": "Unlike most glaciers it isn't shrinking much. Every few years its ice dam ruptures in a spectacular collapse.",
 "1544294": "El Chaltén was founded in 1985, partly to secure Argentina's claim to the area. It's built for hikers.",
 "jwivrb": "Ushuaia, on Tierra del Fuego, is the main departure port for Antarctic cruises.",
 "bk3ui0": "Eva Perón championed workers and women's suffrage and died of cancer in 1952, aged just 33.",
 "jrlz6q": "Argentina invaded in April 1982; Britain retook the islands after a 74-day war. Argentina still claims them.",
 "1ucewx5": "The houses were painted with leftover ship paint. The street is named after a famous tango.",
 "5o4h20": "Recoleta Cemetery is a city of marble mausoleums. Evita lies in her family's tomb, the Duarte vault.",
 "mevent": "About 275 falls stretch nearly 3 km. Eleanor Roosevelt is said to have exclaimed 'Poor Niagara!'",
 "1s68vbu": "Copado means cool or great. You'll hear it constantly alongside 'genial' and 're bueno'.",
 "oif3wa": "Born in Rosario in 1928, he was nicknamed for the Argentine habit of saying 'che', roughly 'hey, mate'.",
 "ijurwc": "With about 5,000 men he crossed the Andes in 1817 to free Chile, then sailed north to liberate Peru.",
 "1q3emza": "Milk and sugar simmered for hours until the sugars caramelise. Argentines put it on everything.",
})
# ---------- Nutrition, hydration & supplements ----------
X.update({
 "1iyxvfe": "0.8 g per kg is the minimum to avoid deficiency, not the amount that best supports muscle as you age.",
 "1ccu51k": "1 g per pound is about 2.2 g per kg. Research suggests most of the benefit comes by about 1.6 g per kg.",
 "14sced2": "The brain also runs on creatine-based energy, and benefits seem clearest when sleep-deprived or on a meat-free diet.",
 "aryz9u": "So someone weighing 180 lb drinks about 6 oz, roughly 180 ml, every 15 minutes of exercise.",
 "1ivcstp": "Nerves fire using sodium and potassium, so being low can cause fatigue, cramps and brain fog.",
 "lmuyr6": "Trials suggest a gram or more of EPA a day can lift mood, sometimes as an add-on to other treatment.",
 "zg2s5d": "UVB on the skin makes vitamin D. Far from the equator in winter there's too little, so supplements are common.",
 "vzdt6x": "Satchin Panda's research suggests eating within a consistent window of 8 to 12 hours helps metabolic health.",
 "z227e3": "Acetaldehyde causes much of a hangover. People with a slower enzyme to clear it get the 'Asian flush'.",
 "u8y64u": "In a 2022 episode he summarised research showing even moderate drinking harms the brain and body.",
 "hq9u0t": "Leptin is made by fat cells and signals the brain that energy stores are full.",
 "puryqk": "The pancreas releases insulin after a meal so muscles, liver and fat can take up the glucose.",
})
# ---------- Gladiators ----------
X.update({
 "s2k7jc": "The retiarius fought nearly unarmoured, relying on speed, reach and the net. He was often seen as the lowest rank.",
 "z5p29g": "The secutor, 'chaser', wore a smooth round helmet so the net couldn't snag it.",
 "1eooya7": "The murmillo's crest was shaped like a fish, the 'mormylos', a natural foe for the net-man.",
 "1uqujdy": "The thraex fought with a curved sica, a weapon associated with Thracian warriors.",
 "1t2nis8": "The wooden rudis marked a gladiator's release from the arena, sometimes awarded on the spot by the crowd.",
 "8xpcbp": "Spartacus's army grew to tens of thousands. After it was defeated, 6,000 rebels were crucified along the Appian Way.",
 "116g3zu": "Commodus fought staged bouts as a gladiator, a scandal for an emperor. The film Gladiator is loosely based on him.",
 "qrqbc1": "Bones from a gladiator cemetery at Ephesus show a mostly plant-based diet, and possibly a plant-ash drink for calcium.",
 "gkoakw": "The biggest, the Ludus Magnus, was connected to the Colosseum by a tunnel.",
 "5mhhqb": "'Ave, imperator, morituri te salutant.' Suetonius records it once, at a mock sea battle under Claudius, so it may not have been routine.",
})
# ---------- Aqueducts ----------
X.update({
 "299r2r": "Built by Appius Claudius, who also built the Appian Way, it ran almost entirely underground.",
 "qomrub": "Legend says a young girl, a 'virgo', showed thirsty soldiers the spring that still feeds it.",
 "553hjc": "Marcus Agrippa, Augustus' right-hand man, also built the original Pantheon.",
 "y41bdf": "Together they delivered enough water for baths, fountains and public toilets across a city of a million people.",
 "1qdmwtg": "The 49 m-high bridge near Nîmes was built without mortar, its stones simply cut to fit.",
})
# ---------- Chile ----------
X.update({
 "vn1aqk": "Founded by Pedro de Valdivia in 1541, Santiago has the snowy Andes as a backdrop on clear days.",
 "f31igw": "Both are brewed by CCU, Chile's dominant brewer.",
 "1c53l9e": "About 4,300 km long but only around 177 km wide on average, from the Atacama Desert to Cape Horn.",
 "gnwhgh": "Most date from the late 1800s and early 1900s and still haul people up Valparaíso's steep hills.",
 "bhg8qt": "Neruda had three houses, each crammed with collections: La Sebastiana, La Chascona in Santiago and Isla Negra.",
 "1q7iaxi": "Some weather stations there have never recorded rain, and NASA tests Mars rover equipment in its soil.",
 "yikzxf": "The towers are in Magallanes, Chile's southernmost region. The park is famous for its fierce wind.",
 "1cyk2lh": "About 3,500 km off Chile, Rapa Nui has around 900 moai, carved by Polynesian settlers.",
 "r6ubhg": "Pinochet ruled from the 1973 coup until 1990, after losing a 1988 referendum on staying in power.",
 "1l89o37": "From the verb 'cachar', borrowed from English 'catch'. Chileans tag it onto sentences all the time.",
 "1ankvwd": "The name comes from the Peruvian port of Pisco, and both countries protect their own versions.",
 "vnracj": "Built from 1976, the Carretera Austral winds about 1,200 km through fjords, glaciers and rainforest.",
})
# ---------- Monuments of Rome ----------
X.update({
 "mg50cd": "Nicola Salvi died before it was finished. It was completed by Giuseppe Pannini in 1762.",
 "3i1xjr": "The custom is one coin, thrown with the right hand over the left shoulder, to make sure you return.",
 "17vfxc": "Over a million euros a year is collected and given to Caritas, which uses it to help people in need.",
 "gr7vp8": "Oceanus stands in a shell chariot pulled by sea horses, guided by tritons.",
 "2i2966": "Hadrian rebuilt it but kept Agrippa's original inscription on the front, which still credits Agrippa.",
 "tzi9yl": "The 9 m oculus is the only light source. When it rains, water falls in and drains through holes in the floor.",
 "14f1r7j": "Emperors built their palaces on the Palatine, which is where the word 'palace' comes from.",
})
X.update({
 "adn60n": "The date was worked out by Roman scholars centuries later. Rome still celebrates its birthday on 21 April.",
 "aoxnqi": "In the legend Remus mocked his brother's new city wall by jumping over it, and Romulus killed him.",
 "1r4twr5": "The bronze Capitoline Wolf is Rome's emblem. The suckling twins were added during the Renaissance.",
 "znlb8p": "The Circus Maximus held perhaps 150,000 people, far more than the Colosseum. Chariot teams had fanatical fans.",
 "13e5azz": "The Ides fell on 15 March. Suetonius says Caesar was stabbed 23 times.",
 "ftq4so": "The Senate was meeting in a hall in Pompey's theatre complex. The site, Largo di Torre Argentina, is now a cat sanctuary.",
 "6p2wjn": "Octavian took the name Augustus, 'revered one', in 27 BC and ruled for about 40 years while keeping a republican front.",
 "1tjcl9n": "Roman law forbade generals bringing their armies into Italy. Crossing the little river was a declaration of war.",
 "15p8zxv": "'Alea iacta est': once the dice are thrown there's no taking it back. Caesar may actually have quoted it in Greek.",
 "e10f1q": "The Germanic general Odoacer deposed the last emperor and didn't bother naming another.",
 "19mxj2x": "A teenager named after both Rome's founder and its first emperor, which makes the ending rather poetic.",
 "1njmkeq": "The Eastern, or Byzantine, Empire outlived the West by nearly a thousand years until the Ottomans took Constantinople.",
 "1rq4i4p": "The Edict of Milan ended persecution of Christians. Constantine later founded Constantinople as a new capital.",
 "1sov0xl": "No European city matched that size again until London around 1800.",
 "1goh8un": "'Senatus Populusque Romanus'. You can still see SPQR stamped on Rome's manhole covers.",
 "5rwvqk": "Cold enough that you really want to get out, but safe to stay in. There's no prize for going colder.",
 "1r98oxz": "Huberman Lab launched in January 2021 and quickly became one of the world's most popular podcasts.",
 "19gf2j6": "Matthew Walker is a neuroscience professor at UC Berkeley. His 2017 book made sleep science mainstream.",
})
# ---------- Colombia ----------
X.update({
 "7uktnh": "Bogotá sits at about 2,640 m in the Andes, so it's cool all year despite being near the equator.",
 "21mqap": "All three are brewed by Bavaria, a company founded in Colombia by German immigrants in 1889.",
 "3yfp8m": "Beans, rice, chicharrón, ground meat, chorizo, fried egg, plantain, avocado and arepa: a farmworker's feast.",
 "35n78y": "Once one of Medellín's most violent areas, it was transformed after outdoor escalators arrived in 2011.",
 "11x25oo": "His 1967 novel set in the town of Macondo defined magical realism. He won the Nobel in 1982.",
 "agqxzj": "'¡Qué chévere!' and '¡Qué bacano!' both mean 'how great!'. Bacano is especially Colombian.",
 "1r2bbkw": "Short for 'parcero', partner. In Medellín you'll hear '¿Qué más, parce?' constantly.",
 "1l1ben7": "Bolívar's 1819 victory at Boyacá freed Colombia. He dreamed of uniting the continent as Gran Colombia.",
 "d4o72j": "Its peaks rise to about 5,700 m only around 40 km from the Caribbean beaches near Tayrona.",
 "1ouktrr": "Mines like Muzo have produced prized emeralds for centuries, and Colombian stones are famous for their colour.",
})
# ---------- Brazil ----------
X.update({
 "ynd2ij": "Brasília was planned from scratch, its layout often compared to an aeroplane or a bird with outstretched wings.",
 "ds8870": "Built in about 41 months, it moved the capital inland from Rio to open up Brazil's vast interior.",
 "udil76": "Niemeyer loved free-flowing curves in concrete and kept working until he died at 104.",
 "1vmtk7a": "A 1494 treaty gave Portugal the eastern part of South America. Brazil is now the world's largest Portuguese-speaking country.",
 "1gvucsf": "All three belong to AB InBev and are usually served very cold in small bottles or cans.",
 "1gsaq2h": "Cachaça is distilled from fresh sugarcane juice. Muddled with lime and sugar it makes Brazil's classic drink.",
 "iy1cxe": "Black beans slow-cooked with many cuts of pork, traditionally eaten on Wednesdays and Saturdays.",
 "gr51bf": "São Paulo's metro area has over 20 million people and the largest Japanese community outside Japan.",
 "c129og": "The 30 m Art Deco statue was designed by Paul Landowski and built from reinforced concrete and soapstone.",
 "fem69v": "Corcovado means 'hunchback'. A cog railway has carried visitors up since 1884.",
 "19f26jf": "Oscar Niemeyer designed the Sambadrome in 1984 as a purpose-built parade avenue lined with stands.",
 "13mrdtc": "Most of 'Floripa' is on Santa Catarina Island, which has over 40 beaches.",
 "qy2xso": "1958, 1962, 1970, 1994 and 2002, more than any other country.",
 "1v0kpul": "Italo Ferreira won the first Olympic surfing gold in 2021. He learned to surf on the lid of a polystyrene cooler.",
 "2xkb1g": "Brazilian surfers dominated the tour from Gabriel Medina's first world title in 2014.",
 "sssymf": "Medina won world titles in 2014, 2018 and 2021, and his photo flying above a wave at Tokyo 2020 went viral.",
 "aht3jy": "Saquarema is nicknamed the 'Maracanã of surfing' for its powerful beach break.",
 "tcvdw": "Pedro Álvares Cabral landed in 1500. Rio was even the capital of the whole Portuguese Empire from 1808 to 1821.",
 "17k50ml": "The real arrived in 1994 with a plan that finally ended years of hyperinflation.",
 "9e4hm5": "Princess Isabel signed the 'Golden Law' in 1888. Brazil had received more enslaved Africans than any other country.",
 "1fuhfuq": "Enslaved Africans developed it, possibly disguising fighting as dance. It's played to the berimbau.",
})
# ---------- Pompeii & Vesuvius ----------
X.update({
 "otdkj4": "Vesuvius buried Pompeii under metres of ash in AD 79, preserving a Roman town almost frozen in time.",
 "1k5kylb": "Herculaneum was buried deeper by hot flows that carbonised wood, food and even papyrus scrolls.",
 "pt4g5p": "His letters to the historian Tacitus describe the towering cloud, which is why such eruptions are called 'Plinian'.",
 "u83c1z": "Commander of the fleet at Misenum, he sailed towards the eruption to help and died on the shore at Stabiae.",
 "1mj0rwi": "Victims' bodies decayed inside the hardened ash, leaving hollows. Pouring plaster in captured their final poses.",
 "314dt": "Giuseppe Fiorelli, director of the excavations, began making the casts in 1863.",
 "oimrx1": "The 1944 eruption destroyed dozens of Allied bombers parked at a nearby airfield.",
 "1g7109s": "Hundreds of thousands of people live in Vesuvius's official danger zone around Naples.",
 "xvdgx6": "A charcoal graffito dated mid-October and autumn fruits found in the ruins suggest a later eruption date.",
})
# ---------- Vatican ----------
X.update({
 "mp6vuq": "About 0.44 km², with around 800 residents. You can walk around its walls in under an hour.",
 "gleknt": "The 1929 treaty settled the 'Roman Question' that began when Italy took Rome from the Pope in 1870.",
 "1z0qupq": "Mussolini's government signed for Italy, and Catholicism became Italy's state religion until 1984.",
 "3tzacr": "In the 1527 sack of Rome, 147 Swiss Guards died covering the Pope's escape. Recruits still swear in on 6 May.",
 "ac659a": "Excavations in the 1940s found a Roman cemetery under the basilica, where Peter's grave is traditionally placed.",
 "1mhn33d": "Michelangelo designed it in his 70s. It was finished after his death by Giacomo della Porta.",
 "1uc0dfa": "Bernini's 284 columns form two arms that symbolically embrace the faithful.",
 "1knk7nl": "About 29 m tall, it's said to use bronze stripped from the Pantheon, which inspired the jibe: 'What the barbarians didn't do, the Barberini did.'",
 "utc4h8": "He reportedly carved his name on Mary's sash after overhearing visitors credit someone else.",
 "11ge72t": "Michelangelo saw himself as a sculptor, not a painter, and worked standing on scaffolding rather than lying down.",
 "375jiu": "Some doctors argue the shape around God resembles a human brain, an apt image for Cerebrito.",
 "izpfyg": "Painted from 1536 to 1541, its nudity caused outrage, and some figures were later covered up.",
 "fjf1xe": "From Latin 'cum clave', with a key: the cardinals are locked in until they choose.",
 "ebnnip": "Plato points to the sky and Aristotle gestures at the earth. Plato's face is thought to be modelled on Leonardo.",
 "1b5pzth": "Robert Prevost was born in Chicago but spent many years as a missionary and bishop in Peru, where he took citizenship.",
 "omrw64": "Jorge Mario Bergoglio, from Buenos Aires, was also the first Jesuit pope. He was elected in 2013.",
 "1x4zftz": "Luther posted his 95 Theses in Wittenberg in 1517. The printing press spread them across Europe in weeks.",
 "1mt72ev": "Preachers like Johann Tetzel sold indulgences, promised time off in purgatory, to raise money for the new St Peter's.",
})
# ---------- Mexico ----------
X.update({
 "1ciyujg": "Built on a drained lake bed at about 2,240 m, parts of Mexico City are sinking several centimetres a year.",
 "e1mdwc": "Corona, from Grupo Modelo, is Mexico's best-known export beer, sold in well over 100 countries.",
 "18jrpvw": "Tequila must use blue agave. The cheaper 'mixto' needs only 51%, so look for '100% agave'.",
 "ig65uq": "Most tequila comes from Jalisco, named after the town of Tequila near Guadalajara.",
 "6uuq5p": "Mezcal's agave hearts are roasted in earth pits, giving the smoke. Technically, tequila is a type of mezcal.",
 "1ww4iid": "Lebanese immigrants brought shawarma. Mexicans swapped in pork, chilli marinade and pineapple.",
 "df37gc": "Families build altars with marigolds, photos and favourite foods to welcome the spirits of the dead home.",
 "8fkdge": "About 130 million people, more Spanish speakers than Spain has inhabitants twice over.",
 "s5mv0x": "A bus accident at 18 left her in lifelong pain. Many of her paintings were made from bed.",
})
# ---------- Guatemala ----------
X.update({
 "1f9xrgo": "Guatemala City became the capital after earthquakes wrecked Antigua in 1773.",
 "1a8tpoh": "The resplendent quetzal was sacred to the Maya and is a symbol of liberty.",
 "yt8grd": "Gallo, 'rooster', has been brewed since 1896 and is a national icon.",
 "wzect9": "Antigua's cobbled streets and ruined churches are a UNESCO site, overlooked by the volcanoes Agua, Fuego and Acatenango.",
 "3xbxj7": "Atitlán fills a huge volcanic caldera, ringed by three volcanoes and Maya villages.",
 "1xnk9a5": "Tikal peaked around AD 200 to 850. Its temples rise above the canopy, and one view appeared in Star Wars.",
})
# ---------- Alcatraz ----------
X.update({
 "onkcm6": "It held the country's most troublesome prisoners for 29 years.",
 "1tv8pva": "'The Rock' sits about 2 km from San Francisco in the cold, fast waters of the bay.",
 "qpotg": "Jailed for tax evasion, Capone spent about four and a half years there, sometimes playing banjo in the prison band.",
 "122rzpk": "Robert Stroud studied birds at Leavenworth prison. At Alcatraz he wasn't allowed to keep any.",
 "zvc50z": "They chipped through vents with sharpened spoons over months and paddled off on a raft of glued raincoats.",
 "11od6gs": "The FBI closed its case in 1979. The US Marshals still keep a file open.",
 "1dbmg3s": "Lifelike papier-mâché heads in their beds fooled the guards until morning roll call.",
 "ewoazj": "Everything had to be shipped in, and salt air was eating the buildings. It cost about three times more than other federal prisons.",
 "ka25k8": "The bay is around 10 to 15 °C with powerful tidal currents, enough to exhaust a swimmer before reaching shore.",
 "d0tcr6": "The 'Indians of All Tribes' occupation drew national attention to Native American rights.",
 "4j0fzv": "From the 1850s it was a fort guarding San Francisco Bay, then a military prison.",
 "4v71o2": "Its lighthouse first shone in 1854.",
 "1sgg6b7": "An escape attempt in May 1946 turned into a two-day siege. Marines were called in, and five people died.",
 "jgdj4n": "36 men tried. Most were caught or killed, and the 1962 trio's fate is still unknown.",
 "24igkn": "Clint Eastwood played Frank Morris in the 1979 film.",
})
# ---------- Nicaragua ----------
X.update({
 "1813u4i": "After a 1972 earthquake levelled the centre, many addresses are still given by landmarks, some of which no longer exist.",
 "901jhi": "Toña and Victoria are the two big lagers, ideally drunk ice-cold.",
 "c0yruw": "Flor de Caña has been made since 1890 and is aged at the foot of the San Cristóbal volcano.",
 "1cdyqy2": "Cerro Negro is Central America's youngest volcano, born in 1850. You hike up and slide down its black gravel on a board.",
 "jsx5an": "Ometepe is formed by the volcanoes Concepción and Maderas, joined by a narrow isthmus.",
 "10sn7zo": "It's named after Francisco Hernández de Córdoba, the Spaniard who founded Granada and León.",
 "8oq2it": "'Spotted rooster': rice and beans fried together, eaten at breakfast across Nicaragua and Costa Rica.",
})
# ---------- Costa Rica ----------
X.update({
 "1tqotqo": "San José sits in the cool Central Valley, ringed by coffee farms and volcanoes.",
 "2k41xv": "'Pure life' works as hello, thanks, goodbye and a whole philosophy of taking it easy.",
 "1u584j5": "After a short civil war, José Figueres abolished the army and put the money into education and health.",
 "1abtrr5": "Imperial's black eagle logo is everywhere, from T-shirts to beach bars.",
 "138117a": "Roughly 5% of the world's species live on about 0.03% of its land, and around a quarter of the country is protected.",
 "1330ui3": "Arenal erupted in 1968 after centuries of quiet and stayed active until 2010.",
 "1y8h5r6": "The colón is named after Christopher Columbus, Cristóbal Colón in Spanish.",
})
# ---------- Incas ----------
X.update({
 "1by5n5h": "Cusco may mean 'navel' in Quechua: the centre of the Inca world, where the four regions met.",
 "1k9pe7s": "His name means roughly 'he who remakes the world'. He turned a small kingdom into an empire.",
 "l2wm2k": "The emperor was seen as the son of Inti, and temples to the sun were coated in gold.",
 "4kxldr": "People still offer Pachamama the first drops of a drink, spilled on the ground.",
 "1trw1xa": "Knots recorded numbers in a base-10 system. Some quipus may also have stored stories, still undeciphered.",
 "1iv9evr": "UNESCO listed the Qhapaq Ñan in 2014 across six countries, from Colombia to Argentina.",
 "1h48bpf": "Amazingly, it was built by a people with no wheeled vehicles or horses.",
 "1i2g89z": "Relays of runners could carry a message a couple of hundred kilometres in a day. Legend says the emperor got fresh fish from the coast.",
 "3zfsxw": "Sapa Inca means 'the only Inca'. He was thought to be descended from the sun.",
 "58a91r": "Atahualpa had just won the civil war when Pizarro arrived, leaving the empire divided and weakened.",
 "dkn6ux": "June is winter in the Andes. Banned by the Spanish, the festival was revived in 1944 and is staged at Sacsayhuamán.",
})
# ---------- Vietnam ----------
X.update({
 "1qrj4dn": "Hanoi has been a capital since 1010, when it was called Thăng Long, 'ascending dragon'.",
 "1a0nn99": "Ho Chi Minh City has around 9 million people and even more motorbikes.",
 "hesd2m": "It was renamed in 1976 after reunification, but most locals still call the centre Saigon.",
 "r2c5j1": "Notes run into the hundreds of thousands, so everyone is briefly a millionaire.",
 "1832u7a": "Bia Hà Nội rules the north and 333 and Saigon the south.",
 "gt9ivz": "Brewed daily and drunk on tiny plastic stools on the pavement for well under a dollar a glass.",
 "1bn6b59": "It was invented at a Hanoi café in 1946, when milk was scarce, by whisking egg yolk and sugar into a cream.",
 "161x5p9": "Phở came from northern Vietnam in the early 1900s. The broth simmers for hours with star anise and charred ginger.",
 "5h2iuh": "In 2016 Obama and Anthony Bourdain shared bún chả and beers at a plain Hanoi shop for about $6.",
 "1giwgdx": "Around 1,600 limestone islands rise from the bay. Its name means 'descending dragon'.",
 "1v51is6": "A busy port from the 1400s to the 1700s. On full-moon nights the old town switches off its lights for lanterns.",
 "92mskq": "The Viet Cong dug about 250 km of tunnels with kitchens, hospitals and meeting rooms.",
 "1vh2jzm": "North Vietnamese tanks rolled into Saigon on 30 April 1975, ending the war.",
 "1sy958l": "The siege of Dien Bien Phu in 1954 ended French Indochina, and Vietnam was split at the 17th parallel.",
 "1j41asm": "The Latin-based script, Quốc ngữ, was developed by European missionaries in the 1600s.",
 "ldi6zj": "The loop winds through limestone mountains near China, including the dramatic Mã Pí Lèng Pass.",
})
# ---------- Pizarro & the conquest ----------
X.update({
 "1mli1xs": "Stuck on Isla del Gallo off Colombia's coast in 1527, he drew his line and asked who would go on.",
 "14v8ssd": "They fell out over who got Cusco. Pizarro's brothers executed Almagro in 1538.",
 "1yj5cw6": "Signed in Toledo in 1529, it named Pizarro governor of the lands he hoped to conquer.",
 "1ixoet2": "About 168 men, 62 of them on horseback, faced an Inca army of tens of thousands.",
 "1mzhtpc": "In November 1532 the Spanish ambushed Atahualpa's unarmed escort in Cajamarca's square and seized him.",
 "1d5xq9": "The biggest Andean animal was the llama, which can't be ridden, so mounted charges were terrifying.",
 "1dou7lp": "He was garrotted in July 1533, after being baptised to avoid being burned.",
 "sd1q2m": "Followers of Almagro's son broke into his Lima palace in 1541 to avenge the elder Almagro.",
 "yvlld2": "He chose the coast so the capital could be reached by sea from Panama and Spain.",
 "cqhz1t": "Installed as a puppet ruler, Manco Inca rebelled in 1536 and then fought on from the jungle at Vilcabamba.",
 "1ozuedc": "Túpac Amaru was executed in Cusco's main square in 1572. A rebel leader took his name in 1780.",
})
# ---------- Thailand ----------
X.update({
 "1n9bcs": "Thais call it Krung Thep, 'city of angels'.",
 "1a5gqfi": "The baht started as a unit of weight for silver, and gold is still sold by the baht.",
 "1xw8hq4": "Singha has been brewed since 1933. Chang, with its elephants, is the cheaper and stronger rival.",
 "1tflqp6": "Siam was a buffer between British Burma and French Indochina, and shrewd kings modernised to keep it independent.",
 "1ar5x3q": "Songkran, 13 to 15 April, began as a gentle sprinkling of water for blessing. Now it's a nationwide water fight.",
 "1oa84lk": "People float little banana-leaf baskets with candles on rivers. In Chiang Mai it coincides with Yi Peng sky lanterns.",
 "15oavjk": "The eight limbs are fists, elbows, knees and shins.",
 "et6r5b": "Lemongrass, galangal, lime leaves and chilli give tom yum its hot and sour kick.",
 "ly3n4r": "The ceremonial name runs to 168 letters in its romanised form. Thais shorten it to Krung Thep.",
 "1bb4kfo": "Founded in 1296 as capital of the Lanna kingdom, Chiang Mai has over 300 temples.",
 "zptw49": "King Vajiralongkorn, Rama X, succeeded his father Bhumibol, who reigned for 70 years.",
 "1do523z": "Siam was renamed Thailand, 'land of the free', in 1939.",
})
# ---------- Bali & Indonesia ----------
X.update({
 "vqggnk": "Bali is one of about 38 Indonesian provinces, with around 4 million people.",
 "tbu3ha": "Most Balinese practise their own form of Hinduism, while Indonesia as a whole is mostly Muslim.",
 "fe2goy": "Bintang, 'star', descends from a Heineken brewery of the Dutch colonial era.",
 "sucwbn": "With tens of thousands of rupiah to the dollar, everyday prices have a lot of zeros.",
 "1w1lfm": "On Nyepi even the airport closes. No lights, no work, no travel: a day for reflection.",
 "aopos2": "Climbers start in the dark to watch the sun rise behind Mount Agung from Batur's rim.",
 "1jykkn0": "At about 3,031 m, Agung is home to Besakih, Bali's mother temple. Its 1963 eruption killed over a thousand people.",
 "1e6k8r9": "Babi guling is stuffed with spices and turned over a fire, a Balinese ceremonial dish.",
 "15g5tfy": "Ubud's rice terraces use subak, a centuries-old cooperative irrigation system listed by UNESCO.",
 "7w6p4o": "Uluwatu Temple sits on a 70 m cliff. Kecak fire dances are performed there at sunset.",
 "h5li70": "Fewer than 7,000 of its islands are inhabited, spread across a span wider than Australia.",
 "1eqr11i": "Indonesia has well over 200 million Muslims, more than any other country.",
})
# ---------- Cusco & Sacred Valley ----------
X.update({
 "dxg68x": "Pachacuti is said to have planned Cusco in the shape of a puma, a symbol of strength and the earthly world.",
 "195no1u": "Its zigzag walls are said to be the puma's teeth. Some stones weigh over 100 tonnes.",
 "1w2a51u": "Its walls were sheathed in gold. In the 1950 earthquake the Spanish convent cracked but the Inca walls held.",
 "12xwbpu": "About 3,400 m. Travellers sip coca tea and take it slow for the first days.",
 "1cgru4l": "The Urubamba, or Vilcanota, flows past Machu Picchu and on into the Amazon basin.",
 "1v2y8wz": "Each terrace has its own microclimate, with big temperature differences from top to bottom: ideal for testing crops.",
 "2ar2t4": "Thousands of pools are fed by a salty spring. Local families still own and harvest them.",
 "1dlyr38": "In 1537 Manco Inca flooded the plain and drove off the Spanish. Ollantaytambo is still a living Inca town.",
 "qihsc0": "Snake for the underworld, puma for this world and condor for the heavens: the three realms of Andean belief.",
})
# ---------- Machu Picchu ----------
X.update({
 "ao04gz": "It was probably a royal estate and religious retreat for Pachacuti, the emperor who built the empire.",
 "1a94791": "Built around 1450, it was occupied for less than a century before being abandoned.",
 "669snv": "Locals farming the terraces guided the Yale lecturer there. Bingham called it a 'lost city'; it wasn't lost to them.",
 "8szx61": "The Spanish never found it, so it escaped the looting and destruction that hit other Inca sites.",
 "n5eg1u": "Huayna Picchu, 'young mountain', has a steep path to temple ruins at the top.",
 "1g8xjml": "A worldwide public vote in 2007 named it one of the New Seven Wonders.",
 "1ht2w1o": "It's named after the mountain on the other side of the ruins from Huayna Picchu, the 'young mountain'.",
 "aw0e8m": "Inca Trail hikers reach Intipunku at dawn on their final day for their first view of the ruins below.",
})
# ---------- Laos ----------
X.update({
 "1chgt0m": "Vientiane's Patuxai monument was famously built with American cement meant for an airport runway.",
 "r65f8l": "Brewed with local jasmine rice, Beerlao is a point of national pride.",
 "1mbbfaw": "Thousands of kip make a dollar. Thai baht and US dollars are often accepted too.",
 "1tfuooo": "About a third failed to explode. Unexploded bombs still injure people today, and clearance will take decades.",
 "frnr0s": "At dawn, saffron-robed monks file through the streets to receive sticky rice. Visitors should watch quietly.",
 "qfrz3s": "Limestone in the water makes the turquoise pools, and a bear rescue centre sits at the entrance.",
 "yyxre": "Laos eats more sticky rice per person than anywhere, rolled into balls by hand and dipped in sauces.",
 "1gj5712": "Minced meat with lime, fish sauce, herbs and toasted rice powder for crunch.",
 "12t03xc": "The Mekong River is its lifeline for trade and travel.",
 "dy8bfp": "After deaths in 2012 the riverside bars were closed. Today it's known for karst scenery and hot-air balloons.",
})
# ---------- Aztecs & pyramids ----------
X.update({
 "1jszlge": "Linked to the shore by causeways, Tenochtitlan had perhaps 200,000 people, bigger than any city in Spain at the time.",
 "1uz8jov": "Their god Huitzilopochtli told them to settle where they saw this sign. They found it on a swampy island in Lake Texcoco.",
 "1vs189x": "The image sits at the centre of Mexico's flag and coat of arms.",
 "cnz4yc": "The Spanish built over the ruins. Remains of the Templo Mayor were rediscovered beside the cathedral in 1978.",
 "f9ti13": "Cortés had a few hundred Spaniards but tens of thousands of Indigenous allies, especially the Tlaxcalans.",
 "165ndxk": "Moctezuma II welcomed Cortés into the city in 1519 and died in Spanish custody the next year.",
 "12ze9ow": "Nahuatl is still spoken by about 1.7 million people in Mexico.",
 "17ctddz": "From xocolatl, tomatl, ahuacatl and chīlli. Coyote and chipotle come from Nahuatl too.",
 "25c7wi": "Huitzilopochtli shared the top of the Templo Mayor with the rain god Tlaloc.",
 "1lsujig": "Quetzalcoatl, the feathered serpent, was worshipped across Mesoamerica. The Maya called him Kukulkan.",
 "18rtbmp": "At its peak around AD 450 Teotihuacan may have had over 100,000 people. Its Pyramid of the Sun is one of the largest in the Americas.",
 "1a3x18c": "The Aztecs named it, believing the platforms along it were tombs. They were actually temples and palaces.",
 "1uq81cp": "Its four stairways of 91 steps plus the top platform add up to 365, one for each day of the year.",
 "82d7jl": "Cholula is so overgrown it looks like a hill, with a Spanish church on top. By volume it beats Giza.",
 "10gh2f6": "The Maya developed writing, astronomy and a precise calendar. Millions of Maya people still live in the region.",
 "8kk6kl": "The Olmecs flourished from about 1200 BC. Their basalt heads stand up to about 3 m tall and weigh many tonnes.",
})
# ---------- Sri Lanka ----------
X.update({
 "32ij8e": "Colombo is the commercial hub and main port. Parliament sits next door in Sri Jayawardenepura Kotte.",
 "1cfmj0p": "Both are official languages. Sinhala speakers are the majority and Tamil speakers live mostly in the north and east.",
 "1p5ws2": "It became Sri Lanka, 'resplendent island', in 1972, though Ceylon tea kept the old name.",
 "1p5jrp5": "Lion has been brewed since 1881, originally for British planters in the hill country.",
 "bmbzpz": "King Kashyapa built a palace on top of the 200 m rock in the 5th century, entered between giant lion's paws.",
 "jvbc6w": "The relic is paraded through Kandy during the Esala Perahera festival, with elephants and dancers.",
 "489mgt": "Completed in 1921 from brick and stone, a popular story says the steel meant for it went to the First World War.",
 "1t42ve1": "When disease wiped out coffee in the 1870s, planters switched to tea, and Ceylon tea became world-famous.",
 "mzj1ge": "The rupee crashed in the 2022 economic crisis, which brought down the government.",
})
# ---------- England ----------
X.update({
 "1n1kwtg": "The Romans founded Londinium around AD 47 at a good crossing point on the Thames.",
 "cyv3ir": "Despite being a British staple, Carling started out as a Canadian beer.",
 "1d50u6j": "Barons forced King John to seal it at Runnymede. Four original copies survive.",
 "7xtpn5": "The 13.7-tonne bell is Big Ben. The tower was renamed the Elizabeth Tower in 2012.",
 "zwexn4": "After 1066 the elite spoke French for centuries, which is why English has 'beef' alongside 'cow'.",
 "1tqblfh": "King Harold was killed, famously shown with an arrow in his eye on the Bayeux Tapestry.",
 "14vq4t7": "Built in stages from about 3000 BC, some of its stones were dragged from Wales, over 200 km away. It aligns with the solstices.",
 "1fjoywa": "When the Pope refused an annulment, Henry made himself head of the Church of England in 1534.",
 "1oeimmj": "Elizabeth II reigned for 70 years, from 1952 until 2022.",
 "8gabn3": "Charles III became king in September 2022, aged 73, the oldest person to take the British throne.",
 "12paiay": "Sterling is the world's oldest currency still in use, dating back over 1,200 years.",
})
# ---------- Berlin Wall ----------
X.update({
 "15gxu33": "Berliners woke on 13 August 1961 to find barbed wire across their streets. Concrete followed within days.",
 "13z2mb7": "It's not a national holiday because 9 November is also the anniversary of Kristallnacht.",
 "x89t0x": "3 October is now the Day of German Unity, Germany's national day.",
 "afpozj": "East Germany built it with Soviet approval. Families were split overnight.",
 "106k8xe": "'Antifaschistischer Schutzwall': the regime claimed it kept fascists out. Everyone knew it kept people in.",
 "14mu8ye": "'Charlie' is C in the military alphabet. In 1961 US and Soviet tanks faced off there for 16 hours.",
 "1rj9iz4": "Artists painted about 1.3 km of the Wall in 1990, including the famous Brezhnev-Honecker kiss.",
 "igzngb": "Kennedy declared solidarity with West Berlin in June 1963. The 'jelly doughnut' joke about it is a myth.",
 "1hgt26g": "Reagan spoke at the Brandenburg Gate in June 1987. Two years later the Wall was open.",
 "1qeej56": "American, British, French and Soviet sectors. Berlin sat deep inside the Soviet zone.",
 "mmioya": "Over about 15 months, Allied planes flew some 270,000 flights to feed the city. Some pilots dropped sweets for children.",
})
# ---------- Norway ----------
X.update({
 "57tqnr": "Oslo was called Christiania for about 300 years until 1925.",
 "95hrmx": "Norway kept its krone and stayed out of the euro, like the EU itself.",
 "12oz6a": "Aass, brewed in Drammen since 1834, is Norway's oldest brewery.",
 "o31k8i": "Norwegians voted no in 1972 and 1994 but trade with the EU through the European Economic Area.",
 "1iccz33": "Oil and gas money is invested abroad for future generations. The fund is worth well over a trillion dollars.",
 "1988eyg": "Amundsen beat Robert Scott's team by about five weeks, using sled dogs and skis.",
 "16hydp5": "Nobel's will gave the Peace Prize to a Norwegian committee. The other prizes are awarded in Stockholm.",
 "no2gls": "The flat rock juts 604 m straight above Lysefjord.",
 "wl74qm": "Brunost is made by boiling whey until its sugars caramelise. It's sliced thin with a special cheese slicer.",
 "qxz04q": "Across the fjord from the Seven Sisters is a waterfall called the Suitor, said to be wooing them.",
 "1miutmj": "The Viking age is usually dated from the raid on Lindisfarne in 793 to the Battle of Stamford Bridge in 1066.",
})
# ---------- Hitler & the Nazis ----------
X.update({
 "iryoq1": "He was born in Braunau am Inn, Austria, in 1889 and later moved to Germany.",
 "6y4hfh": "President Hindenburg appointed him on 30 January 1933. Within months the Nazis had dismantled democracy.",
 "2mso8b": "The November 1923 coup failed and Hitler was jailed, but the trial made him nationally known.",
 "1hxor0b": "He dictated it in Landsberg prison after the failed putsch. It set out his racist worldview.",
 "44yapc": "'Night of broken glass', 9 to 10 November 1938, when synagogues, homes and shops were attacked across Germany.",
 "whjlhb": "About six million Jews were murdered, roughly two-thirds of Europe's Jewish population.",
 "qk0fkg": "About 1.1 million people were murdered at Auschwitz. Its liberation date, 27 January, is Holocaust Memorial Day.",
 "agoj2j": "He killed himself in his bunker on 30 April 1945 as Soviet troops closed in. Germany surrendered a week later.",
 "1j0qerw": "The trials in 1945 and 1946 established that following orders was no defence for crimes against humanity.",
})
# ---------- Denmark ----------
X.update({
 "akzkgp": "Copenhagen means 'merchants' harbour'.",
 "5j7m3v": "Danes voted to keep the krone in a 2000 referendum, though it's tightly pegged to the euro.",
 "ryz4w3": "Carlsberg dates from 1847. It merged with its old rival Tuborg in 1970.",
 "t9fgkt": "Carpenter Ole Kirk Christiansen founded LEGO in Billund in 1932, starting with wooden toys.",
 "1jv3g0h": "Candles, blankets, good company: a big part of how Danes cope with long, dark winters.",
 "19k7inq": "Walt Disney visited Tivoli in the 1950s, and it helped shape his plans for Disneyland.",
 "1057mcu": "Unveiled in 1913, the statue is only about 1.25 m tall. It has been vandalised and even beheaded.",
 "r98uir": "Dense rye bread topped with herring, egg, roast beef or shrimp, eaten with a knife and fork.",
 "nnygad": "Hans Christian Andersen lived at Nyhavn for years.",
})
# ---------- Samurai & katana ----------
X.update({
 "sxdcw2": "'The way of the warrior' stressed loyalty, courage and honour. It was mostly codified during the peaceful Edo period.",
 "k855uy": "Ronin means 'wave man', drifting like a wave, a disgraced status after a master's death or fall.",
 "herwau": "Daishō means 'big-little'. Wearing the pair was the badge of the samurai class.",
 "tunpcr": "Tamahagane was smelted from iron sand in a clay tatara furnace over days of continuous firing.",
 "smp5nj": "A thicker clay coat on the spine kept it softer while the edge cooled fast and hard. The edge's expansion helps create the curve.",
 "uxeu39": "Also known as harakiri, it let a samurai die with honour rather than be captured or disgraced.",
 "7kn21x": "Musashi claimed over 60 duels undefeated. He reportedly beat Sasaki Kojirō with a wooden sword carved from an oar.",
 "1k394je": "Tokugawa Ieyasu's victory at Sekigahara in 1600 led to over 250 years of peace under his family's rule.",
 "2tuopq": "Ieyasu became shogun in 1603. His family ruled from Edo, now Tokyo, until 1868.",
 "14h28ls": "Yasuke arrived with Jesuit missionaries in 1579 and became a retainer of the warlord Oda Nobunaga.",
 "7on6nw": "Japan modernised rapidly after 1868, and in 1876 samurai were banned from carrying swords in public.",
 "2af1ec": "Saigō Takamori led the last samurai revolt in 1877 and died at the Battle of Shiroyama.",
 "xn9e86": "In 1703 they avenged their lord's forced suicide. Their graves at Sengaku-ji in Tokyo still draw visitors.",
 "10zh16w": "The storms saved Japan twice. In WWII the name was given to suicide pilots.",
})
# ---------- Sweden ----------
X.update({
 "19w2cwt": "Stockholm is spread across islands where Lake Mälaren meets the Baltic, earning it the nickname 'Venice of the North'.",
 "ab1y4v": "Swedes voted against the euro in 2003, so the krona stayed.",
 "1qn3qju": "Fika is a sacred daily break for coffee and something sweet, often a cinnamon bun.",
 "pen4z1": "Only Systembolaget may sell drinks over 3.5% alcohol in shops, and it closes early, to curb heavy drinking.",
 "1osmw98": "The top-heavy Vasa sank barely 1,300 m into its voyage. Raised in 1961, it's about 98% original.",
 "1q0fvgl": "For a country of about 10 million, Sweden has produced a remarkable list of global brands.",
 "xdlv5n": "ABBA won in Brighton in 1974 and became one of the best-selling acts in music history.",
})
# ---------- China ----------
X.update({
 "vn1cbe": "Beijing means 'northern capital'. It has been China's capital for most of the last 800 years.",
 "nelj57": "Xi'an, once Chang'an, was the capital of several dynasties and the eastern end of the Silk Road.",
 "h8sti1": "In 1974 farmers digging a well near Xi'an struck clay fragments. Thousands of soldiers lay beneath.",
 "1kp0iub": "The brick-and-stone wall in photos is mostly Ming, built after the Mongols were driven out in 1368.",
 "pnm9mz": "Home to 24 emperors over nearly 500 years, its roughly 980 buildings form the world's largest palace complex.",
 "vzpl8i": "Gunpowder was reportedly discovered by alchemists searching for an elixir of immortality.",
 "1sh35xv": "Mao proclaimed the People's Republic on 1 October 1949 after winning the civil war.",
 "1kcnxgn": "Tsingtao was founded in 1903 by German settlers in the port city of Qingdao.",
 "1fjvnsj": "Silk, spices, ideas and religions travelled along it. The name was coined by a German geographer in 1877.",
 "35t2ne": "His most quoted advice: know your enemy and know yourself, and you need not fear a hundred battles.",
})
# ---------- Germany ----------
X.update({
 "1vrojm2": "Bonn was West Germany's capital. Parliament voted in 1991 to move back to Berlin.",
 "1q339x1": "Germany has well over a thousand breweries, so even its biggest brands have modest national shares.",
 "10hsig5": "Issued in 1516, it's often called the oldest food-quality law still referenced today.",
 "bxceq6": "The first Oktoberfest celebrated a royal wedding in October 1810. It moved earlier to catch warmer weather.",
 "1vvro1f": "Legend credits Herta Heuwer in 1949, who mixed ketchup and curry powder from British soldiers.",
 "uwriu1": "Built in 1791, the gate stood in the death strip behind the Wall, then became the symbol of reunification.",
 "1qu6unc": "Norman Foster's glass dome opened in 1999. Visitors can walk above the debating chamber, a symbol of transparency.",
})
# ---------- Spain ----------
X.update({
 "165bc42": "Philip II made Madrid capital in 1561, partly because it sits near the geographic centre of Spain.",
 "1af3yj3": "Traditional Valencian paella uses chicken, rabbit and green beans. The crispy crust at the bottom is the socarrat.",
 "18xdly0": "Gaudí worked on it for over 40 years until his death in 1926. Construction continues, funded by visitors.",
 "qevu54": "Built by the Nasrid dynasty, the last Muslim rulers in Spain until Granada fell in 1492.",
 "1j07f7r": "Franco won the 1936 to 1939 civil war. After his death, Spain moved to democracy under King Juan Carlos.",
 "101krv4": "Held on the last Wednesday of August, it began with a street brawl in 1945 and now draws thousands.",
 "11mhl3h": "Held from 6 to 14 July, Hemingway's 'The Sun Also Rises' made it world-famous.",
 "1axira0": "Catalan is an official language in Catalonia, used in schools, signs and parliament.",
 "77wcnc": "Columbus landed in the Bahamas in October 1492, convinced he had reached Asia.",
 "19p765x": "The best, 'de bellota', comes from black Iberian pigs fattened on acorns and cured for years.",
})
# ---------- WWI ----------
X.update({
 "kvc2xr": "About 9 million soldiers died. Contemporaries called it 'the war to end all wars'.",
 "pg4z3k": "The heir to Austria-Hungary was shot on 28 June 1914. Alliances turned a regional crisis into a world war within weeks.",
 "1acdjz0": "Princip was a 19-year-old Bosnian Serb. He had a chance shot after the archduke's driver took a wrong turn.",
 "1nt0kkw": "The Ottoman Empire joined the Central Powers in late 1914. Its defeat led to its break-up.",
 "1whj1lk": "The Triple Entente were bound by a web of agreements, joined later by Italy, the US and others.",
 "1e2cqu9": "Britain and France promised Italy territory in the secret 1915 Treaty of London.",
 "1agmh08": "Unrestricted German submarine warfare and the Zimmermann Telegram brought the US in, in April 1917.",
 "kd0k54": "After the Bolshevik Revolution, Russia signed a separate peace at Brest-Litovsk in March 1918.",
 "156f78": "The landings began on 25 April 1915. After eight months the Allies withdrew.",
 "pt31ax": "Dawn services mark the hour of the Gallipoli landings in Australia and New Zealand.",
 "nm8t1w": "Signed in a railway carriage at Compiègne at about 5am, it took effect at the 11th hour of the 11th day of the 11th month.",
 "1t392eu": "It blamed Germany for the war and imposed heavy reparations, a resentment Hitler later exploited.",
 "1m4daxb": "About 19,000 British soldiers were killed on 1 July 1916, the bloodiest day in British military history.",
 "tukgy5": "Machine guns and artillery made advances suicidal, so armies dug in along lines from the Channel to Switzerland.",
})
# ---------- Portugal ----------
X.update({
 "1qclezp": "Lisbon is one of the oldest cities in western Europe, older than Rome by some accounts.",
 "1nyxip5": "Super Bock is the Porto favourite and Sagres the Lisbon one, a friendly national rivalry.",
 "1avavk8": "Monks at Lisbon's Jerónimos Monastery are credited with the recipe, using yolks left over from starching clothes with egg whites.",
 "1qvvret": "Fado expresses 'saudade', a longing for something lost. UNESCO recognised it in 2011.",
 "154veuh": "Da Gama sailed around Africa to Calicut in 1498, opening Portugal's sea route for the spice trade.",
 "1mj7e7w": "On All Saints' Day 1755 a massive quake, then a tsunami and fires killed tens of thousands and levelled the city.",
 "qbu5bz": "On 25 April 1974 soldiers ended the dictatorship almost without bloodshed. People put carnations in their rifles.",
 "1eeirj3": "Adding brandy stops fermentation, keeping the wine sweet and strong. British merchants made it famous.",
})
# ---------- WWII ----------
X.update({
 "1vvru6g": "The deadliest conflict in history killed an estimated 70 to 85 million people.",
 "33pv29": "Britain and France declared war on Germany two days later, on 3 September.",
 "8vxc3j": "They formalised their alliance in the 1940 Tripartite Pact.",
 "1t8bfk8": "Churchill, Roosevelt and Stalin met at Tehran and Yalta to plan the war and the post-war world.",
 "sbn5oq": "Signed in August 1939, it freed Hitler to invade Poland without fighting the USSR, until he invaded in 1941.",
 "e4k4w0": "The RAF beat back the Luftwaffe. Churchill said never had so much been owed by so many to so few.",
 "c9x8py": "Hundreds of civilian 'little ships' helped carry soldiers off the beaches in 1940.",
 "yejd1o": "About 156,000 Allied troops landed on five Normandy beaches on the first day.",
 "odu32h": "Overlord was the whole invasion. Neptune was the name of the naval landing phase.",
 "d87tca": "Launched on 22 June 1941, it was the largest land invasion in history.",
 "acz3sw": "Because Germany signed late in the evening, Russia marks Victory Day on 9 May.",
 "zrg6fs": "Australian troops fought along about 96 km of jungle track over the Owen Stanley Range in 1942.",
 "1drbzy1": "The ceremony in Tokyo Bay formally ended the war, weeks after Japan announced its surrender.",
 "1krp89q": "German propaganda mocked them as rats in holes, and they adopted the 'Rats of Tobruk' name with pride.",
 "sarsi3": "Swiss armed neutrality and mountain defences helped keep it out of the war.",
})
# ---------- Albania ----------
X.update({
 "qgx96n": "In the 2000s the mayor had Tirana's grey communist blocks painted in bright colours.",
 "bwxmq9": "The lek is named after Alexander the Great, 'Leka' in Albanian.",
 "jpui9r": "Hoxha cut Albania off from almost the entire world, breaking with Yugoslavia, the USSR and finally China.",
 "1yv8njt": "Under Hoxha, private cars were banned, so roads were nearly empty apart from official vehicles.",
 "15aykxw": "After communism fell, cars flooded in. Second-hand Mercedes quickly became the car of choice.",
 "1brexb8": "That's roughly one bunker for every 17 people at the time. Many are now cafés, studios or storage.",
 "1etsqpt": "Born in Skopje in 1910, she won the Nobel Peace Prize in 1979 for her work in Calcutta.",
 "1jhkhwb": "Skanderbeg held off the Ottomans for about 25 years in the 1400s.",
 "xblvja": "The eagle comes from Skanderbeg's seal. Albanians call their country Shqipëria, roughly 'land of eagles'.",
 "1h678m6": "Small islands sit just offshore in turquoise water, across the strait from Corfu.",
 "19eitge": "Butrint layers Greek, Roman, Byzantine and Venetian ruins in a lagoon-side forest. It's UNESCO-listed.",
 "1tdhe0g": "Filo pastry filled with cheese, spinach or meat, eaten at any time of day.",
})
# ---------- Montenegro ----------
X.update({
 "1jazkid": "Podgorica was called Titograd from 1946 to 1992, after Yugoslavia's leader Tito.",
 "1u86q3k": "Cetinje was the royal capital until 1918. Former embassies still line its streets.",
 "11hjdcr": "Montenegro adopted the Deutsche Mark in 1999, then switched to the euro, without joining the EU.",
 "1r3bu8g": "Venetians named it after the dark forests of Mount Lovćen. In Montenegrin it's Crna Gora.",
 "ym42r8": "A 2006 referendum passed with about 55.5%, just over the 55% threshold the EU had set.",
 "1lbgjss": "The bay is really a drowned river canyon. Kotor's old town is UNESCO-listed.",
 "ff6ug6": "Nikšićko has been brewed in the town of Nikšić since 1896.",
})
# ---------- Croatia ----------
X.update({
 "a0raey": "Zagreb's upper town has a church with a colourful tiled roof showing the city and national coats of arms.",
 "147pwlh": "In 2023 Croatia switched from the kuna to the euro and joined the Schengen zone on the same day.",
 "1t6ivw5": "Ožujsko comes from Zagreb and Karlovačko from Karlovac.",
 "19g9aww": "Dubrovnik's walls and Old Town played King's Landing, and tourism boomed.",
 "10ovj83": "Diocletian retired to his seaside palace around AD 305. People later built a whole town inside its walls.",
 "1u2tug7": "Sixteen terraced lakes are joined by waterfalls, their colours shifting with minerals and light.",
 "5zfjo1": "Croatian mercenaries in 17th-century France wore knotted scarves, and the French called them 'cravates'.",
 "1emxoqi": "They lost the 2018 final to France 4 to 2, a huge achievement for a country of about 4 million.",
 "a33izj": "Named after Dalmatia, Croatia's Adriatic coast. They once ran alongside horse-drawn carriages.",
})
# ---------- Japan ----------
X.update({
 "101c5tt": "Edo was renamed Tokyo, 'eastern capital', in 1868 when the emperor moved there.",
 "1hs38wz": "Kyoto was the imperial capital from 794 to 1868 and was spared from the atomic bombing for its cultural treasures.",
 "1r5hnpv": "Fuji is an active volcano that last erupted in 1707. Climbing season runs only July to early September.",
 "1sp8cyc": "The Shinkansen opened just before the 1964 Tokyo Olympics and has an extraordinary safety record.",
 "1ives9f": "'Yen' means 'round', as in a round coin. Its symbol is ¥.",
 "lwz1ez": "Nagasaki became the target on 9 August after clouds hid the primary target, Kokura.",
 "1nrka25": "Most Japanese people mix Shinto and Buddhist practices rather than choosing one.",
 "8am8hs": "Tradition traces the line back to 660 BC. It is the oldest continuing hereditary monarchy in the world.",
 "beppre": "The term was coined in 1982. Studies link time among trees to lower stress hormones.",
})
