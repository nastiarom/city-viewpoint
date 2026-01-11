import kolomna from '/src/assets/kolomna.jpg'
import nizhniy from '/src/assets/nizhniy-novgorod.jpg'
import posad from '/src/assets/sergiev-posad.jpg'
import yaroslavl from '/src/assets/yaroslavl.jpg'
import zaraysk from '/src/assets/zaraysk.jpg'

const reviews = [
{
    id: 1,
    date: "2026-01-05",
    city: "Ярославль",
    like_count: 52,
    city_rating: 4.9,
    type: "Активный",
    main_photo: yaroslavl,
},
{
    id: 2,
    date: "2025-08-20",
    city: "Сергиев Посад",
    like_count: 67,
    city_rating: 4.8,
    type: "Паломнический",
    main_photo: posad,
},
{
    id:3,
    date: "2025-06-10",
    city: "Коломна",
    like_count: 45,
    city_rating: 4.9,
    type: "Семейный",
    main_photo: kolomna
},
{
    id:4,
    date: "2025-05-19",
    city: "Нижний Новгород",
    like_count: 28,
    city_rating: 4.7,
    type: "Активный",
    main_photo: nizhniy,
},
{
    id:5,
    date: "2025-04-25",
    city: "Зарайск",
    like_count: 45,
    city_rating: 4.5,
    type: "Семейный",
    main_photo: zaraysk,
}
];

export default reviews;