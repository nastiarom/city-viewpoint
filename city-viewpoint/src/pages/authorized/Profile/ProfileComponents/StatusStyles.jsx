export default function getStatusStyles(status) {
    switch (status) {
        case 'Новичок':
            return { borderColor: '#4ed40f', backgroundColor: '#c1f8b0', color: '#06ad00' };
        case 'Исследователь':
            return { borderColor: '#ffe371', backgroundColor: '#fcf2b4', color: '#f08e06' };
        case 'Пилигрим':
            return { borderColor: '#40c2ff', backgroundColor: '#c3edfc', color: '#14aef5' };
        case 'Легенда дорог':
            return { borderColor: '#9c27b0', backgroundColor: '#f3e5f5', color: '#6a1b9a' };
        case 'Вечный странник':
            return { borderColor: '#f44336', backgroundColor: '#ffebee', color: '#c62828' };
        default:
            return { borderColor: '#ccc', backgroundColor: '#f5f5f5', color: '#666' };
    }
}