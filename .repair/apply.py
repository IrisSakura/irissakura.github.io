import base64
import gzip
import hashlib
import json
import pathlib
import subprocess
import sys

BASE = '0dca968176e4b942308aab75ea91a7cbba5dad6b'
MANIFEST_HASH = '34e0cd98d04cb5d72fd9c5a91ff0603a43f4051be1e3e999f7a2e07e43bfe64a'
encoded = pathlib.Path(sys.argv[1]).read_text()
# Restore transport transcription only; the full manifest checksum remains mandatory.
for before, after in {
    'U/pGr8G+': 'U/PGr8G+',
    'HlXVkTCQy': 'HlXVkCQy',
    'DoviHfSKuyoLM': 'DoviHfSK9RZXuyoLM',
    'GS/PG1+MySDF': 'GS/PG1+9MySDF',
    'ZdPNr/GiWT': 'ZdPNr//GiWT',
    'nHR/42Pzx': 'nHR//42Pzx',
    '294z5D/0/u': '294z5D//0/u',
    'GdzYza/7L50': 'GdzYza//7L50',
}.items():
    encoded = encoded.replace(before, after)
raw = gzip.decompress(base64.b64decode(encoded, validate=False))
if hashlib.sha256(raw).hexdigest() != MANIFEST_HASH:
    raise SystemExit('Repair manifest checksum mismatch')
manifest = json.loads(raw)
if manifest['base'] != BASE or subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip() != BASE:
    raise SystemExit('Repair baseline mismatch')
root = pathlib.Path.cwd().resolve()
for entry in manifest['files']:
    relative = pathlib.PurePosixPath(entry['path'])
    if relative.is_absolute() or '..' in relative.parts or relative.parts[0] in ['.git', '.github', '.repair']:
        raise SystemExit('Unsafe repair path')
    target = root.joinpath(*relative.parts)
    if entry['blob'] is None:
        if target.exists():
            raise SystemExit('New repair target already exists: ' + entry['path'])
        original = b''
    else:
        original = target.read_bytes()
        blob = hashlib.sha1(b'blob ' + str(len(original)).encode() + b'\0' + original).hexdigest()
        if blob != entry['blob']:
            raise SystemExit('Repair source mismatch: ' + entry['path'])
    lines = original.decode('utf-8').splitlines(keepends=True)
    previous = len(lines) + 1
    for edit in reversed(entry['edits']):
        if not 0 <= edit['start'] <= edit['end'] <= len(lines) or edit['end'] > previous:
            raise SystemExit('Invalid edit range: ' + entry['path'])
        lines[edit['start']:edit['end']] = edit['text'].splitlines(keepends=True)
        previous = edit['start']
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(''.join(lines).encode('utf-8'))
print('Applied approved edits to', len(manifest['files']), 'source files')
