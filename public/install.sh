#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${HOME:?Run inside native Termux}" "${PREFIX:?Run inside native Termux}"
command -v pkg >/dev/null || { echo 'Native Termux is required.' >&2; exit 1; }
[ "$(dpkg --print-architecture)" = aarch64 ] || { echo 'FDevPanel currently supports Termux ARM64 only.' >&2; exit 1; }
APT_BASE=https://farizgd.github.io/fdevpanel
EXPECTED_FINGERPRINT=D97D66095EB7DCD5E5728823600B3837C2A7DA78
apt install -y -o DPkg::Lock::Timeout=120 curl gnupg
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
curl --proto '=https' --tlsv1.2 -fsSL "$APT_BASE/public.key" -o "$work/public.key"
actual=$(gpg --batch --with-colons --show-keys "$work/public.key" | awk -F: '/^fpr:/{print $10; exit}')
[ "$actual" = "$EXPECTED_FINGERPRINT" ] || { echo 'Repository signing key fingerprint mismatch; installation stopped.' >&2; exit 1; }
gpg --batch --yes --dearmor --output "$work/fdevpanel.gpg" "$work/public.key"
mkdir -p "$PREFIX/etc/apt/keyrings" "$PREFIX/etc/apt/sources.list.d"
install -m 644 "$work/fdevpanel.gpg" "$PREFIX/etc/apt/keyrings/fdevpanel.gpg"
printf 'deb [arch=aarch64 signed-by=%s] https://farizgd.github.io/fdevpanel/apt termux main\n' "$PREFIX/etc/apt/keyrings/fdevpanel.gpg" > "$work/fdevpanel.list"
install -m 644 "$work/fdevpanel.list" "$PREFIX/etc/apt/sources.list.d/fdevpanel.list"
apt update
apt install -y -o DPkg::Lock::Timeout=120 fdev-vsc
exec fdev-setup "$@"
