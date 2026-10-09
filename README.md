# FDevPanel

**Your phone. Your servers. Your control space.**

FDevPanel adapts the real Pterodactyl Panel and Wings for native, unrooted Android
ARM64 Termux. The native stack has no container daemon, proot, systemd or root
requirement. This repository hosts its homepage, interactive demo and signed APT
repository publication workflow.

- Homepage: https://farizgd.github.io/fdevpanel/
- Try Demo: https://farizgd.github.io/fdevpanel/demo/#/
- Releases: https://github.com/FarizGD/fdevpanel/releases

## Installation

In native Termux:

```sh
command -v curl >/dev/null || pkg install -y curl
curl -fsSL https://farizgd.github.io/fdevpanel/install.sh -o "$PREFIX/tmp/fdevpanel-install.sh"
bash "$PREFIX/tmp/fdevpanel-install.sh"
```

The installer verifies the repository public-key fingerprint, adds a dedicated
`signed-by` APT source in `$PREFIX/etc/apt/sources.list.d/fdevpanel.list`, updates
the Termux main and FDevPanel indexes, installs the `fdev-vsc` package and opens its interactive wizard. The release
asset is `panel.deb`, containing both the modified Panel and native Wings.
Dependencies are resolved from Termux repositories. No `sudo` or `apt-key`.

```sh
fdev-service start
fdev-service status
fdev-service restart
fdev-service logs
fdev-service stop
```

Defaults: Panel `http://localhost:8000`, Wings8080, SFTP2022, source in `~/panel`
and `~/wings`. Administrator credentials are generated privately in
`~/panel/.termux/admin-login.txt`. Existing source edits, credentials and server
files are preserved. The package never includes the maintainer's configuration,
databases, node tokens or hosted server data. Existing project sources are not
silently replaced during package upgrades; consult the packaged setup documentation
before deliberately replacing local source.

The wizard configures MariaDB, Redis, HTTP service, queue worker, scheduler and
Wings. It can create `~/.termux/boot/20-fdev-vsc`. Install **Termux:Boot from the
same source/signing family as Termux and open it once** for Android boot delivery.
Wake locks consume battery, and Android may stop background processes. The boot
script starts the stack; it does not automatically start game servers.

Native servers share Termux user permissions. They have no Docker-style filesystem
or process isolation and no enforced cgroup CPU/RAM limits. A Java heap setting
limits heap only. Eggs must be compatible with native Termux; arbitrary Docker
image eggs are not supported. Supported native Minecraft and Python/Node.js/PHP/Bash
application eggs are bundled. Runtime packages may be installed on demand. Paper
requires sufficient memory and separate acceptance of Minecraft's EULA. SMTP
credentials are configured by the operator, not baked into the package.

## What the demo is

The existing built Panel assets and its actual React frontend source were **copied
first** into `panel-demo/`, with the live installation left untouched. The copy
uses the same console, server rows, forms, file manager, dialogs, startup editor,
responsive styles and client navigation. Hash history and the `/fdevpanel/demo/`
asset path make it work on GitHub Pages.

`panel-demo/resources/scripts/demo/` replaces the HTTP/WebSocket transports with
in-memory fixtures. It never executes a shell, launches a server, uploads files
or connects to real Panel/Wings endpoints. A persistent demo ribbon, network guards
and `connect-src 'none'` make that boundary explicit. Metrics and server activity
are simulated. Edits reset on reload. Demo uploads read small text files locally
(up to256KiB), with no network transfer. Account/API responses are sample data;
security credentials shown in the demo are deliberately invalid.

The demo supports sample power controls, console commands (`help`, `list`, `status`,
`echo`, `stop`), file browsing/editing/rename/create/delete, startup variables,
schedule creation and resource views. Some operations requiring a real daemon
return a clear demo-only error. Empty databases, backups and users are preview
states; they do not provision real resources. Server-rendered Blade admin pages
are not served on GitHub Pages; admin links lead to the homepage feature overview.
The live native application is inside the downloadable package, not executed here.

## Local development

Node22+ and Yarn1.22.22 are required to rebuild the copied frontend:

```sh
cd ~/demo-page
yarn --cwd panel-demo install --frozen-lockfile
npm test
npm run build:panel
npm run build
npm run preview
```

Preview: `http://localhost:4173/fdevpanel/`. Only loopback is bound. The homepage
and demo do not need PHP, a database or Wings. Local development may reuse the live
Panel's Node modules through an ignored symlink; CI installs its own dependencies.

On native Termux with Firefox and geckodriver:

```sh
python scripts/browser-audit.py
```

This checks the actual copied frontend and homepage at320/390/1280px, the install
dialog, file-menu dialog and real xterm input/simulated power controls. Private
screenshots and logs are under `.local/browser`. The homepage preview image is
an actual rendered screenshot of the copied demo, not an invented dashboard.

## GitHub Actions publication

The workflow builds the homepage and copied Panel, tests the fixture adapter and
TypeScript, downloads the checksummed native release, and invokes the requested
[Host your own APT repo on GitHub](https://github.com/marketplace/actions/host-your-own-apt-repo-on-github)
action. Its v4 implementation is pinned to commit
`2ced6fde712c7fe3f572e2e611a4f2a879d86595` after source inspection. It runs on a
GitHub-hosted Ubuntu runner; its Docker implementation is never run on the phone.

APT metadata is generated on the `apt-repository` branch, signed with the
`APT_PRIVATE_KEY` Actions secret, and independently checked with `gpgv`. The build
then merges the APT pool/index into the homepage artifact at `/apt/`, preserving
the custom homepage instead of publishing the action's generic root page. GitHub
Pages must use **GitHub Actions** as its publishing source. PR builds run tests
without accessing signing secrets or publishing. Production workflow permissions
are limited to the relevant build, APT-write and Pages-deploy jobs.

For a new package release, upload the native-built binary as `panel.deb`, update
`release.json` with its tag/version/SHA256, and push main. The action records
package-version metadata; do not reuse a version for different package contents.
The initial native release is v1.0.0; v1.0.1 adds Section/priority metadata required for the signed APT repository. Hosted Linux CI does not cross-build Wings or pretend
a generic Linux binary works on Android; it publishes the package tested in Termux.

Keep the private APT signing key backed up privately. Only its public half is in
source; the private export and local GPG home are ignored in `.local/`. Key loss
requires deliberate key rotation, public fingerprint/installer updates and operator
instructions for existing installations. Never commit private keys or tokens.

## Licenses

Copied Panel source and assets retain the Pterodactyl MIT notice in
`panel-demo/LICENSE.md` and `public/LICENSE-PTERODACTYL.txt`. IBM Plex font licensing
is included in `public/LICENSE-IBM-Plex.txt`. Existing component notices are retained.

## Verification

Local native-Termux checks passed on2026-10-09: copied Panel production build,
TypeScript, four API fixture/guard/lifecycle/file tests, and30 rendered page checks
at320/390/1280px. Install-dialog and file-menu interactions passed, and the actual
copied xterm console accepted input and displayed simulated output. Real UI power
controls changed the simulated lifecycle. Browser resource checks found no escaped
backend requests. The native package itself previously passed a fresh database/node
installation and authenticated real Panel/Wings lifecycle integration.

The installer scopes its APT calls to Termux main and FDevPanel; it does not refresh or alter optional X11/root repositories. This avoids blocking native server installation on unrelated optional-mirror failures. Errors in either required repository still stop installation.

Published-site checks also passed: all30 browser route/viewport checks plus actual
copied xterm input/output and simulated power controls on the HTTPS site. Native
Termux APT verified the published Release signature and pinned public-key fingerprint,
then downloaded the exact v1.0.1 ARM64 package with a matching SHA256. The complete
installer added the signed GitHub repository, installed1.0.1 through APT and completed
setup; existing Panel/Wings credentials remained unchanged and all six services ran.
The unrelated X11 source remained unchanged. Actual Android reboot delivery remains
untested and requires the Termux:Boot companion app.

For an interrupted browser audit, add `--resume` to continue saved passing cases
for the same site and source revision. Verify the real published APT repository
without changing system sources with `python scripts/verify-apt.py`.
