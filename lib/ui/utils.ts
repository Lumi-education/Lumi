import * as classnames from 'classnames';

export function state_color(state: string): string {
    switch (state) {
        case 'disabled':
            return '#95a5a6';
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

export function random_bg(): string {
    const bgs = [
        'linear-gradient(to bottom right, #973999, #f8598b, #f7bf00)',
        'linear-gradient(120deg, #8e44ad, #3498db)',
        'linear-gradient(120deg, #3498db, #1abc9c)',
        'linear-gradient(230deg, #4b79cf, #4bc5cf)'
    ];
    const n = Math.floor(Math.random() * bgs.length);

    return bgs[n];
}

export function get_grade_color(g: number) {
    if (g === null) {
        return 'grey';
    }

    const grade = Math.ceil(g / 5) * 5;
    return classnames({
        '#2ecc71': grade >= 85,
        '#27ae60': grade >= 70 && grade < 85,
        '#f1c40e': grade >= 55 && grade < 70,
        '#e67e21': grade >= 40 && grade < 55,
        '#e74c3c': grade >= 25 && grade < 40,
        '#c0392b': grade < 25
    });
}
