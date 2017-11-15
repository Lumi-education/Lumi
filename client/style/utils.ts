import * as classnames from 'classnames';

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

export function get_grade_color(grade: number) {
    grade = Math.ceil(grade / 5) * 5;
    return classnames({
        '#2ecc71': grade >= 85,
        '#27ae60': grade >= 70 && grade < 85,
        '#f1c40e': grade >= 55 && grade < 70,
        '#e67e21': grade >= 40 && grade < 55,
        '#e74c3c': grade >= 25 && grade < 40,
        '#c0392b': grade < 25
    });
}
