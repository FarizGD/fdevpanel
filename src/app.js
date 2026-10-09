export const installCommand = '(command -v curl >/dev/null || pkg install -y curl) && curl -fsSL https://farizgd.github.io/fdevpanel/install.sh -o "$PREFIX/tmp/fdevpanel-install.sh" && bash "$PREFIX/tmp/fdevpanel-install.sh"';
const modal = document.querySelector('#install-dialog');
document.querySelector('#install-command').textContent = installCommand;
document.querySelector('#command-fallback').value = installCommand;
async function copy() {
    try {
        await navigator.clipboard.writeText(installCommand);
        document.querySelector('#copy-status').textContent = 'Copied. Paste the command into Termux to install.';
    } catch {
        document.querySelector('#copy-status').textContent = 'Select and copy the command below. Your browser did not allow clipboard access.';
        const field = document.querySelector('#command-fallback');
        field.focus(); field.select();
    }
}
document.addEventListener('click', async event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'install') { if (!modal.open) modal.showModal(); await copy(); }
    if (action === 'copy-again') await copy();
    if (action === 'close') modal.close();
});
modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
});
