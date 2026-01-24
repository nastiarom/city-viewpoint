const comments = [
  { id: 1, user_id: 20, review_id: 1, reply_id: null, text: 'Очень полезный отзыв, спасибо!' },
  { id: 2, user_id: 10, review_id: 1, reply_id: 1, text: 'Рад, что помог!' },
  { id: 3, user_id: 30, review_id: 1, reply_id: null, text: 'Добавлю, что летом там тоже классно.' },
  { id: 4, user_id: 40, review_id: 1, reply_id: 3, text: 'Согласна, особенно природа впечатляет.' },
  { id: 5, user_id: 20, review_id: 1, reply_id: null, text: 'Планирую туда поездку, ваш отзыв вдохновил.' },

  { id: 6, user_id: 10, review_id: 2, reply_id: null, text: 'Отличное место для семейного отдыха.' },
  { id: 7, user_id: 20, review_id: 2, reply_id: 6, text: 'Да, особенно для детей.' },
  { id: 8, user_id: 30, review_id: 2, reply_id: null, text: 'Рекомендую посетить летом.' },

  { id: 9, user_id: 40, review_id: 3, reply_id: null, text: 'Спасибо за подробный отзыв!' },
  { id: 10, user_id: 30, review_id: 3, reply_id: 9, text: 'Пожалуйста! Надеюсь, будет полезно.' },
  { id: 11, user_id: 20, review_id: 3, reply_id: null, text: 'Интересно узнать про еду в Коломне.' },

  { id: 12, user_id: 30, review_id: 4, reply_id: null, text: 'Красивый город и хорошие отзывы.' },
  { id: 13, user_id: 40, review_id: 4, reply_id: 12, text: 'Согласна, особенно понравились достопримечательности.' },
  { id: 14, user_id: 10, review_id: 4, reply_id: null, text: 'Планирую поездку туда в следующем году.' },

  { id: 15, user_id: 20, review_id: 5, reply_id: null, text: 'Отличный отзыв, много полезной информации.' },
  { id: 16, user_id: 40, review_id: 5, reply_id: 15, text: 'Спасибо! Был там летом, советую всем.' },
  { id: 17, user_id: 30, review_id: 5, reply_id: null, text: 'А как с транспортом в Зарайске?' },

  { id: 18, user_id: 10, review_id: 6, reply_id: null, text: 'Очень атмосферное место зимой.' },
  { id: 19, user_id: 20, review_id: 6, reply_id: 18, text: 'Да, особенно красивые заснеженные улицы.' },
  { id: 20, user_id: 40, review_id: 6, reply_id: null, text: 'Спасибо за отзыв, теперь хочу туда съездить.' },
  { id: 21, user_id: 30, review_id: 6, reply_id: 20, text: 'Рад, что отзыв вдохновил!' },
];
export default comments;