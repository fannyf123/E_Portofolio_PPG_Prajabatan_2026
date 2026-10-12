from pathlib import Path
import argparse
import hashlib
import json

from PIL import Image

MEETINGS = {'PMAL': 8, 'PPL': 9, 'KEPEMIMPINAN': 10, 'PSE': 11, 'INOVASI': 12}


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def attach_hotspots(deck, navigation):
    course = navigation['courses'][deck['course']]
    deck['sections'] = course['sections']
    for slide in deck['slides']:
        mapped = course['slides'][str(slide['number'])]
        assert mapped['sourceSha256'] == slide['sourceSha256'], 'Hotspot geometry belongs to an older image'
        slide['hotspots'] = mapped['hotspots']
    deck['revision'] = sha(json.dumps(deck['slides'], ensure_ascii=False).encode())[:12]


def convert_course(course, root):
    slug = course['slug'].lower()
    rows = []
    sizes = []
    for slide in course['slides']:
        source = Path(slide['image'])
        source_sha = sha(source.read_bytes())
        name = f"{slide['number']:02d}-{source_sha[:12]}.webp"
        relative = Path('seminar/semester2/assets') / slug / name
        thumb_relative = relative.parent / 'thumbs' / name
        target, thumb = root / 'public' / relative, root / 'public' / thumb_relative
        target.parent.mkdir(parents=True, exist_ok=True)
        thumb.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            original = image.convert('RGB')
            assert original.size == (1920, 1080)
            if not target.exists():
                original.save(target, 'WEBP', lossless=True, method=4)
            with Image.open(target) as decoded:
                assert decoded.size == original.size
                assert decoded.convert('RGB').tobytes() == original.tobytes()
            original.resize((320, 180), Image.Resampling.LANCZOS).save(thumb, 'WEBP', quality=85, method=4)
        rows.append({'number': slide['number'], 'src': relative.as_posix(),
                     'thumbnail': thumb_relative.as_posix(), 'alt': slide['title'],
                     'title': slide['title'], 'notes': slide['notes'], 'hotspots': [],
                     'sourceSha256': source_sha})
        sizes.append({'course': course['slug'], 'slide': slide['number'],
                      'source_bytes': source.stat().st_size, 'web_bytes': target.stat().st_size,
                      'thumbnail_bytes': thumb.stat().st_size, 'pixel_equal': True})
    revision = sha(json.dumps(rows, ensure_ascii=False).encode())[:12]
    deck = {'id': f"meeting-{MEETINGS[course['slug']]:02d}", 'meeting': MEETINGS[course['slug']],
            'course': course['slug'], 'title': 'Refleksi MK — ' + course['title'],
            'subtitle': 'Refleksi 4C dan analisis artefak · Semester II · 10 slide final',
            'status': 'available', 'revision': revision, 'sourcePptx': Path(course['pptx']).name,
            'slides': rows}
    return deck, sizes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--metadata-only', action='store_true')
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text(encoding='utf-8'))
    output = args.repo / 'public/seminar/semester2'
    map_path = output / 'hotspot-map.json'
    navigation = json.loads(map_path.read_text(encoding='utf-8')) if map_path.exists() else None
    if args.metadata_only:
        assert navigation is not None
        data = json.loads((output / 'decks.json').read_text(encoding='utf-8'))
        for deck in data['decks']:
            attach_hotspots(deck, navigation)
        (output / 'decks.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps({'decks': len(data['decks']), 'hotspots': sum(len(s['hotspots']) for d in data['decks'] for s in d['slides'])}), flush=True)
        return
    decks, receipts = [], []
    for course in manifest['courses']:
        deck, sizes = convert_course(course, args.repo)
        if navigation is not None:
            attach_hotspots(deck, navigation)
        decks.append(deck)
        receipts.extend(sizes)
        print(json.dumps({'course': course['slug'], 'slides': len(deck['slides']), 'pixel_equal': True}), flush=True)
    decks.sort(key=lambda deck: deck['meeting'])
    assert len(decks) == manifest['course_count']
    assert sum(len(deck['slides']) for deck in decks) == manifest['image_count']
    output = args.repo / 'public/seminar/semester2'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'decks.json').write_text(json.dumps({'version': 'final-guru-laki-laki', 'decks': decks}, ensure_ascii=False, indent=2), encoding='utf-8')
    (output / 'conversion-receipts.json').write_text(json.dumps(receipts, indent=2), encoding='utf-8')
    print(json.dumps({'decks': len(decks), 'slides': len(receipts),
                      'source_bytes': sum(row['source_bytes'] for row in receipts),
                      'web_bytes': sum(row['web_bytes'] for row in receipts),
                      'all_pixels_equal': all(row['pixel_equal'] for row in receipts)}), flush=True)


if __name__ == '__main__':
    main()
