import csv
import json
import math
from collections import defaultdict

# GENERATE WORDS LIST FROM LEXIQUE383

accents = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c',
    'ñ': 'n',
    'ý': 'y', 'ÿ': 'y',
    'œ': 'oe', 'æ': 'ae',
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A', 'Å': 'A',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'Ç': 'C',
    'Ñ': 'N',
    'Ý': 'Y',
    'Œ': 'OE', 'Æ': 'AE'
}

words = set()

with open('Lexique383.tsv', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        word = row['ortho']
        if len(word) < 5 or '-' in word or ' ' in word or '\'' in word:
            continue
        if row['cgram'] == 'VER' and row['genre'] == '' and row['lemme'] != word and not word.endswith('ant'):
            continue
        word = word.upper()
        word = ''.join(accents.get(c, c) for c in word)
        if word.isalpha():
            words.add(word)

print(len(words), 'words found')
sorted_words = sorted(list(words))  # facultatif : tri alphabétique

# GENERATE WEIGHTED LETTERS

vowels = 'AEIOUY'
consonants = 'BCDFGHJKLMNPQRSTVWXZ'

total_vow = 0
total_cons = 0
letter_count = defaultdict(int)

# Suppose "words" est une liste de mots en majuscules
for word in words:
    for letter in word:
        letter_count[letter] += 1
        if letter in vowels:
            total_vow += 1
        elif letter in consonants:
            total_cons += 1

# Appliquer la pondération
for letter in letter_count:
    total_c = total_vow if letter in vowels else total_cons
    freq = letter_count[letter] / total_c
    # Formula to adjust the frequency: ceil(100 * f ^ 0.75)
    letter_count[letter] = math.ceil(100 * (freq ** 0.75))

print('Letter frequencies:', dict(letter_count))

# Générer les chaînes pondérées
weighted_vowels = ''.join(
    letter * letter_count[letter] for letter in vowels if letter in letter_count
)
print('Weighted vowels:', weighted_vowels)
print('Weighted vowels length:', len(weighted_vowels))

weighted_consonants = ''.join(
    letter * letter_count[letter] for letter in consonants if letter in letter_count
)
print('Weighted consonants:', weighted_consonants)
print('Weighted consonants length:', len(weighted_consonants))


# On écrit dans un fichier
with open('data.json', 'w', encoding='utf-8') as f:
    data = {
        'letters': {
            'vowels': weighted_vowels,
            'consonants': weighted_consonants
        },
        'words': sorted_words,
    }
    json.dump(data, f, ensure_ascii=False, indent=2)
