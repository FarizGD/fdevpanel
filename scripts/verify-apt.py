"""Verify published signatures and download through native APT without changing system sources."""
import hashlib
import json
from pathlib import Path
import subprocess
import urllib.request

root = Path(__file__).resolve().parent.parent
out = root/'.local/apt-verification'
out.mkdir(parents=True, exist_ok=True)
release = json.loads((root/'release.json').read_text())
base = 'https://farizgd.github.io/fdevpanel'

for name in ['public.key', 'apt/dists/termux/Release', 'apt/dists/termux/Release.gpg']:
    target = out/Path(name).name
    with urllib.request.urlopen(base+'/'+name, timeout=30) as response:
        target.write_bytes(response.read())
fingerprints = subprocess.check_output(['gpg', '--batch', '--with-colons', '--show-keys', str(out/'public.key')], stderr=subprocess.DEVNULL, text=True)
fingerprint = next(line.split(':')[9] for line in fingerprints.splitlines() if line.startswith('fpr:'))
assert fingerprint == release['apt_fingerprint'], 'Unexpected repository key'
subprocess.run(['gpg', '--batch', '--yes', '--dearmor', '--output', str(out/'keyring.gpg'), str(out/'public.key')], check=True)
subprocess.run(['gpgv', '--keyring', str(out/'keyring.gpg'), str(out/'Release.gpg'), str(out/'Release')], check=True)
print('PASS: published repository signature and pinned fingerprint', flush=True)
source = out/'sources.list'
source.write_text(f'deb [arch=aarch64 signed-by={out}/keyring.gpg] {base}/apt termux main\n')
(out/'lists/partial').mkdir(parents=True, exist_ok=True)
(out/'cache/archives/partial').mkdir(parents=True, exist_ok=True)
options = ['-o', f'Dir::Etc::sourcelist={source}', '-o', 'Dir::Etc::sourceparts=-',
           '-o', f'Dir::State::lists={out}/lists', '-o', f'Dir::Cache={out}/cache', '-o', 'Debug::NoLocking=true']
subprocess.run(['apt-get', *options, 'update'], cwd=out, check=True)
subprocess.run(['apt-get', *options, 'download', release['package']+'='+release['version']], cwd=out, check=True)
package = out/f"{release['package']}_{release['version']}_aarch64.deb"
with package.open('rb') as stream:
    assert hashlib.file_digest(stream, 'sha256').hexdigest() == release['sha256'], 'APT-downloaded package checksum mismatch'
assert subprocess.check_output(['dpkg-deb', '-f', str(package), 'Architecture'], text=True).strip() == 'aarch64'
print('PASS: native APT authenticated metadata and downloaded the exact tested ARM64 package', flush=True)
(out/'result.json').write_text(json.dumps({'passed': True, 'version': release['version'], 'fingerprint': fingerprint,
                                        'sha256': release['sha256'], 'system_sources_changed': False}, indent=2))
