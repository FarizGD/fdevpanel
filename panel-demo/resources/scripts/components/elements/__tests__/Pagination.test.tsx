import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Pagination from '@/components/elements/Pagination';

const render = (currentPage: number, totalPages: number) =>
    renderToStaticMarkup(
        <Pagination
            data={{ items: [], pagination: { total: 100, count: 10, perPage: 10, currentPage, totalPages } }}
            onPageSelect={() => undefined}
        >
            {() => <span>Items</span>}
        </Pagination>
    );

test('middle pages keep a compact window and expose both boundary controls', () => {
    const html = render(5, 10);
    expect([...html.matchAll(/<button\b/g)]).toHaveLength(5);
    expect(html).toContain('aria-label="First page"');
    expect(html).toContain('aria-label="Last page"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Page 5"');
});

test('short windows still expose the last page, and the last page has no next boundary', () => {
    expect(render(1, 3)).toContain('aria-label="Last page"');
    expect(render(3, 3)).not.toContain('aria-label="Last page"');
    expect(render(1, 1)).not.toContain('<button');
});
