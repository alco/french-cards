#!/usr/bin/env python

import json

MAIN_LANG = 'fr'

def convert(data):
    """Takes the raw text data and returns its JSON representation"""
    lines = data.splitlines()

    # Ignore all blank lines
    lines = filter(lambda x: x.strip(), lines)

    # Find the title
    title = ''
    for i, line in enumerate(lines):
        if line.startswith('==='):
            title = lines[i-1]
            lines = lines[i+1:]
            break

    sections = []
    current_phrase = {}

    # Extract all sections
    while lines:
        line = lines.pop(0)
        if line.startswith('##'):
            # this is an alternative version of our main language phrase
            # TODO: don't ignore it like this
            pass
        elif line.startswith('#'):
            current_phrase = {}
            current_phrase[MAIN_LANG] = line[2:].strip()
            sections.append(current_phrase)
        else:
            lang, content = line.split(':', 1)
            current_phrase[lang] = content.strip()

    result = {
        'title': title,
        'cards': sections,
    }
    return json.dumps(result, ensure_ascii=False, indent=4)


def main(argv):
    import argparse
    import codecs

    parser = argparse.ArgumentParser('Flash card converter')
    parser.add_argument('card', type=str, help='A .card file to convert')
    parser.add_argument('output', type=str, help='An output file to write to')
    args = parser.parse_args(argv)

    with codecs.open(args.card, encoding='utf-8') as in_file:
        data = in_file.read()
    with codecs.open(args.output, 'w', encoding='utf-8') as out_file:
        out_file.write(convert(data))

if __name__ == '__main__':
    import sys
    main(sys.argv[1:])
