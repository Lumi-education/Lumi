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

export function get_grade_color(g: number) {
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

export function get_grade_string(g: number, with_points: boolean = true) {
    const grade = Math.ceil(g / 5) * 5;

    if (grade >= 95) {
        return '1+' + (with_points ? '(15 Punkte)' : '');
    }
    if (grade >= 90) {
        return '1' + (with_points ? '(14 Punkte)' : '');
    }
    if (grade >= 85) {
        return '1-' + (with_points ? '(13 Punkte)' : '');
    }
    if (grade >= 80) {
        return '2+' + (with_points ? '(12 Punkte)' : '');
    }
    if (grade >= 75) {
        return '2' + (with_points ? '(11 Punkte)' : '');
    }
    if (grade >= 70) {
        return '2-' + (with_points ? '(10 Punkte)' : '');
    }
    if (grade >= 65) {
        return '3+' + (with_points ? '(9 Punkte)' : '');
    }
    if (grade >= 60) {
        return '3' + (with_points ? '(8 Punkte)' : '');
    }
    if (grade >= 55) {
        return '3-' + (with_points ? '(7 Punkte)' : '');
    }
    if (grade >= 50) {
        return '4+' + (with_points ? '(6 Punkte)' : '');
    }
    if (grade >= 45) {
        return '4' + (with_points ? '(5 Punkte)' : '');
    }
    if (grade >= 39) {
        return '4-' + (with_points ? '(4 Punkte)' : '');
    }
    if (grade >= 33) {
        return '5+' + (with_points ? '(3 Punkte)' : '');
    }
    if (grade < 33 && grade >= 10) {
        return '5' + (with_points ? '(1 Punkte)' : '');
    }
    if (grade < 10) {
        return '6' + (with_points ? '(0 Punkte)' : '');
    }

    return 'error';
}
