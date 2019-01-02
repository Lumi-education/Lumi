export function avg(a, c, i, ar) {
    return a + c / ar.length;
}

export function sum(a, c, i, ar) {
    return a + c;
}

export function compare(o, c): boolean {
    for (const key in c) {
        if (c[key] !== o[key]) {
            return false;
        }
    }
    return true;
}

export function arrayToObject(array) {
    if (!array) {
        return {};
    }
    return array.reduce((a, c, i) => {
        a[c._id] = c;
        return a;
    }, {});
}

export function alphabetically(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

export function convert_files_url(markdown: string, ref_id: string): string {
    return markdown
        ? markdown.replace(/\.\//g, '/api/v0/core/attachment/' + ref_id + '/')
        : undefined;
}
