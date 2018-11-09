import * as classnames from 'classnames';

export function get_grade_string(grade: number) {
    const grade_strings = {
        '100': '1+ (15 Punkte)',
        '95': '1+ (15 Punkte)',
        '90': '1 (14 Punkte)',
        '85': '1- (13 Punkte)',
        '80': '2+ (12 Punkte)',
        '75': '2 (11 Punkte)',
        '70': '2- (10 Punkte)',
        '65': '3+ (9 Punkte)',
        '60': '3 (8 Punkte)',
        '55': '3- (7 Punkte)',
        '50': '4+ (6 Punkte)',
        '45': '4 (5 Punkte)',
        '40': '4- (4 Punkte)',
        '35': '5+ (3 Punkte)',
        '30': '5 (2 Punkte)',
        '25': '5- (1 Punkt)',
        '20': '6 (0 Punkte)',
        '15': '6 (0 Punkte)',
        '10': '6 (0 Punkte)',
        '5': '6 (0 Punkte)',
        '0': 'Keine Note'
    };

    const _grade = Math.ceil(grade / 5) * 5;
    const grade_string = grade_strings[_grade];

    return grade_string;
}

export function get_grade_string_without_points(grade: number) {
    const grade_strings = {
        '100': '1+',
        '95': '1+',
        '90': '1',
        '85': '1-',
        '80': '2+',
        '75': '2',
        '70': '2-',
        '65': '3+',
        '60': '3',
        '55': '3-',
        '50': '4+',
        '45': '4',
        '40': '4-',
        '35': '5+',
        '30': '5',
        '25': '5-',
        '20': '6',
        '15': '6',
        '10': '6',
        '5': '6',
        '0': 'Keine Note'
    };

    const _grade = Math.ceil(grade / 5) * 5;
    const grade_string = grade_strings[_grade];

    return grade_string;
}

export function get_grade_color(g: number) {
    const grade = Math.ceil(g / 5) * 5;
    return classnames({
        '#2ecc71': grade >= 85,
        '#27ae60': grade >= 70 && grade < 85,
        '#f1c40e': grade >= 55 && grade < 70,
        '#e67e21': grade >= 40 && grade < 55,
        '#e74c3c': grade >= 25 && grade < 40,
        '#c0392b': grade < 25 && grade !== 0,
        '#FFFFFF': grade === 0
    });
}

export function state_color(state: string): string {
    switch (state) {
        case 'init':
        default:
            return '#2c80b9';
        case 'pending':
            return '#f39c12';
        case 'error':
            return '#c0392c';
        case 'success':
            return '#27ae60';
    }
}

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
