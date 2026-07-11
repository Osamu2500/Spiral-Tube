import os, re
from collections import Counter

matches = []
for root, dirs, files in os.walk('src/content'):
    for file in files:
        if file.endswith('.js'):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                content = f.read()
                found = re.findall(r"querySelector\(['\"](.*?)['\"]\)", content)
                matches.extend(found)
                found_all = re.findall(r"querySelectorAll\(['\"](.*?)['\"]\)", content)
                matches.extend(found_all)

c = Counter(matches)
for k, v in c.most_common(20):
    print(f"{v}: {k}")
