import json
import os
import pathlib
import subprocess
import urllib.request

BASE = '0dca968176e4b942308aab75ea91a7cbba5dad6b'
EXPECTED = '19cf4d252980497c2b14e225e5a77c16ec8b9b35'
REPO = 'IrisSakura/irissakura.github.io'
def git(*args):
    return subprocess.check_output(['git', *args])
if git('rev-parse', 'HEAD').decode().strip() != BASE:
    raise SystemExit('Unexpected baseline')
if git('write-tree').decode().strip() != EXPECTED:
    raise SystemExit('Verified tree does not match approved candidate')
entries = []
for raw_path in git('diff', '--cached', '--name-only', '-z').split(b'\0'):
    if not raw_path:
        continue
    name = raw_path.decode('utf-8')
    if name.startswith(('.github/', '.repair/')):
        raise SystemExit('Temporary workflow cannot enter candidate')
    staged = git('show', ':' + name).decode('utf-8')
    entries.append({'path': name, 'mode': '100644', 'type': 'blob', 'content': staged})

def post(endpoint, payload):
    request = urllib.request.Request(
        'https://api.github.com/repos/' + REPO + endpoint,
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        headers={'Authorization': 'Bearer ' + os.environ['GITHUB_TOKEN'],
                 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28',
                 'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)

tree = post('/git/trees', {'base_tree': git('rev-parse', BASE + '^{tree}').decode().strip(), 'tree': entries})
if tree['sha'] != EXPECTED:
    raise SystemExit('GitHub tree mismatch; no commit published')
commit = post('/git/commits', {
    'message': 'fix(site): clear hero navigation overlap and remove internal presentation copy',
    'tree': tree['sha'], 'parents': [BASE]})
result = {'commit': commit['sha'], 'tree': tree['sha'], 'parent': BASE, 'files': len(entries)}
pathlib.Path('/tmp/verified-candidate.json').write_text(json.dumps(result, indent=2) + '\n')
print('VERIFIED_CANDIDATE=' + commit['sha'])
print('Created verified commit object; main has not been advanced.')
