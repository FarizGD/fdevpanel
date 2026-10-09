"""Render actual copied Panel and homepage in native Firefox; no live credentials used."""
import base64
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.request

root = Path(__file__).resolve().parent.parent
out = root/'.local/browser'
out.mkdir(parents=True, exist_ok=True)
endpoint = 'http://127.0.0.1:4447'
site = os.environ.get('FDEV_DEMO_URL', 'http://localhost:4173/fdevpanel/')
checkpoint = out/('progress-live.json' if site.startswith('https:') else 'progress-local.json')
revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
completed = []
if '--resume' in sys.argv and checkpoint.exists():
    saved = json.loads(checkpoint.read_text())
    if saved.get('site') == site and saved.get('revision') == revision:
        completed = saved.get('pages', [])
env = dict(os.environ, LD_LIBRARY_PATH=os.environ['PREFIX']+'/lib', MOZ_HEADLESS='1',
           MOZ_DISABLE_CONTENT_SANDBOX='1', MOZ_DISABLE_RDD_SANDBOX='1')
log = (out/'driver.log').open('w')
process = subprocess.Popen(['geckodriver', '--allow-system-access', '--host', '127.0.0.1',
                            '--port', '4447', '--log', 'error'], env=env, stdout=log, stderr=log)
session = None


def call(path, value=None, method=None):
    payload = None if value is None else json.dumps(value).encode()
    request = urllib.request.Request(endpoint+path, data=payload, method=method or ('POST' if value is not None else 'GET'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return json.load(response)['value']
    except urllib.error.HTTPError as error:
        print(error.read().decode()[:700], flush=True)
        raise


try:
    for _ in range(50):
        try:
            call('/status')
            break
        except Exception:
            if process.poll() is not None: raise RuntimeError('Driver exited')
            time.sleep(.2)
    result = call('/session', {'capabilities': {'alwaysMatch': {'browserName': 'firefox', 'moz:firefoxOptions': {'args': ['-headless'], 'prefs': {'security.sandbox.content.level': 0, 'security.sandbox.gpu.level': 0, 'media.rdd-process.enabled': False, 'layers.acceleration.disabled': True, 'layout.css.devPixelsPerPx': '1.0'}}}}})
    session = result['sessionId']
    prefix = '/session/'+session
    def execute(script, args=None): return call(prefix+'/execute/sync', {'script': script, 'args': args or []})
    def navigate(path):
        call(prefix+'/url', {'url': site+path})
        time.sleep(2)
    def element(selector): return call(prefix+'/element', {'using': 'css selector', 'value': selector})['element-6066-11e4-a52e-4f735466cecf']
    def click(selector): call(prefix+'/element/'+element(selector)+'/click', {})
    def screenshot(name):
        image = base64.b64decode(call(prefix+'/screenshot'))
        (out/(name+'.png')).write_bytes(image)
        return image
    def viewport(width, height):
        call(prefix+'/window/rect', {'width': max(width,600), 'height': height})
        call(prefix+'/moz/context', {'context': 'chrome'})
        execute("const b=gBrowser.selectedBrowser;for(const p of ['width','min-width','max-width'])b.parentElement.style.setProperty(p,arguments[0]+'px','important');", [width])
        call(prefix+'/moz/context', {'context': 'content'})
    # Use a screenshot of the real copied frontend, not a fabricated mockup.
    viewport(1280, 900)
    navigate('demo/#/')
    assert execute("return document.body.innerText.includes('Survival SMP')"), 'Real dashboard failed to load'
    image = screenshot('panel-preview')
    if site.startswith('http://localhost:'):
        (root/'public/panel-preview.png').write_bytes(image)
        (root/'dist/assets/panel-preview.png').write_bytes(image)
    reports = completed[:]
    paths = ['', 'demo/#/', 'demo/#/account', 'demo/#/account/api', 'demo/#/server/demo0001',
             'demo/#/server/demo0001/files', 'demo/#/server/demo0001/startup',
             'demo/#/server/demo0001/network', 'demo/#/server/demo0001/schedules',
             'demo/#/server/demo0001/backups']
    for width,height in [(390,844),(320,740),(1280,900)]:
        viewport(width,height)
        for index,path in enumerate(paths):
            if any(r['viewport'] == width and r['path'] == path for r in completed):
                continue
            navigate(path)
            info = execute("return {width:innerWidth,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,text:document.body.innerText.slice(0,160),main:!!document.querySelector('main,#fdev-main'),errors:document.body.innerText.includes('Something went wrong'),resources:performance.getEntriesByType('resource').map(r=>r.name)};")
            assert info['width'] == width, 'Wrong viewport'
            assert info['scroll'] <= info['client']+1, f'Horizontal overflow at {width}: {path}'
            assert info['main'] and not info['errors'], f'Missing or crashed page: {path}'
            assert all('/api/' not in r and ':8000' not in r and ':8080' not in r for r in info['resources']), 'Backend request escaped demo adapter'
            if path.startswith('demo/'):
                assert execute("return document.querySelector('.demo-ribbon').innerText.includes('DEMO MODE')")
            else:
                execute("document.querySelector('#panel-preview').scrollIntoView()")
                time.sleep(.5)
                assert execute("return document.querySelector('#panel-preview').complete && document.querySelector('#panel-preview').naturalWidth > 0"), 'Preview image missing'
                execute("window.scrollTo(0,0)")
                click('[data-action="install"]')
                assert execute("return document.querySelector('#install-dialog').open")
                assert execute("return document.querySelector('#command-fallback').value.includes('https://farizgd.github.io/fdevpanel/install.sh')")
                screenshot(str(width)+'-install')
                click('[data-action="close"]')
            if path.endswith('/files'):
                click('button[aria-label="Actions for README.txt"]')
                assert execute("return [...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Rename')")
                execute("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Rename').click()")
                time.sleep(.3)
                assert execute("return !!document.querySelector('[role=dialog]')")
                click('button[aria-label="Close dialog"]')
            screenshot(str(width)+'-page-'+str(index))
            reports.append({'viewport':width,'path':path,'passed':True})
            checkpoint.write_text(json.dumps({'site':site,'revision':revision,'pages':reports},indent=2))
            print('PASS:',width,path or 'homepage',flush=True)
    viewport(390,844)
    navigate('demo/#/server/demo0001')
    # Real console input and rendered output, through the copied Panel components.
    target = 'input[aria-label="Console command input."]'
    call(prefix+'/element/'+element(target)+'/value', {'text':'echo FDEV_DEMO_CONSOLE\ue007'})
    time.sleep(.6)
    assert execute("return document.body.textContent.includes('FDEV_DEMO_CONSOLE')"), 'Console echo missing'
    print('PASS: copied xterm console accepts input and renders simulated output',flush=True)
    execute("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Stop').click()")
    time.sleep(1)
    assert execute("return [...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Start')?.disabled===false"), 'Stop did not update controls'
    execute("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Start').click()")
    time.sleep(1)
    print('PASS: real power controls update simulated lifecycle',flush=True)
    (out/'result.json').write_text(json.dumps({'passed':True,'pages':len(reports),'viewports':[320,390,1280],'site':site,'console_and_power':True},indent=2))
finally:
    if session:
        try: call('/session/'+session,method='DELETE')
        except Exception: pass
    process.terminate()
    try: process.wait(timeout=10)
    except subprocess.TimeoutExpired: process.kill();process.wait()
    log.close()
