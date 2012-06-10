#!/usr/bin/env python

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

    return {
        'title': title,
        'cards': sections,
    }


### MAIN part ###

import argparse
import codecs
import os
import os.path as path
from collections import OrderedDict
from functools import partial


def read_file(filename):
    with codecs.open(filename, encoding='utf-8') as in_file:
        return in_file.read()

def write_json(root, filename):
    import json
    with codecs.open(filename, 'w', encoding='utf-8') as out_file:
        json.dump(root, out_file, ensure_ascii=False, indent=2)


def main(argv):
    parser = argparse.ArgumentParser('Flash card converter')
    parser.add_argument('input', type=str, help='A .card file or a directory to convert')
    parser.add_argument('output', type=str, help='An output file to write to')
    args = parser.parse_args(argv)

    root = OrderedDict()
    if path.isdir(args.input):
        items = map(partial(path.join, args.input), os.listdir(args.input))
        items = filter(path.isfile, items)
        for filename in items:
            key = path.splitext(path.basename(filename))[0]
            data = read_file(filename)
            root[key] = convert(data)
    else:
        root = convert(read_file(args.input))

    write_json(root, args.output)


if __name__ == '__main__':
    import sys
    main(sys.argv[1:])
