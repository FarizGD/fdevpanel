// Defense in depth: the static copy must never open backend HTTP or Wings sockets.
const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input), window.location.href);
    const directory = window.location.pathname.replace(/[^/]*$/, '');
    if (url.origin !== window.location.origin || !url.pathname.startsWith(directory) || !/\.(json|js|css|svg|woff2)$/.test(url.pathname)) {
        return Promise.reject(new Error('Backend requests are disabled in FDevPanel demo mode'));
    }
    return originalFetch(input, init);
};
XMLHttpRequest.prototype.open = function () { throw new Error('Network uploads and backend requests are disabled in this demo'); };
window.WebSocket = class { constructor() { throw new Error('Real Wings connections are disabled in this demo'); } } as any;
