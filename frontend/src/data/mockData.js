export const mockPosts = [
  {
    id: 1,
    title: "Тюнинг BMW E46",
    content: "Обсуждение модификаций двигателя...",
    author: "Иван",
    likes: 15,
    comments: [
      { id: 1, text: "Отличный гайд!", author: "Петр" },
      { id: 2, text: "Очень полезно, спасибо!", author: "Алексей" }
    ]
  },
  {
    id: 2,
    title: "Тюнинг Audi A4",
    content: "Обсуждение улучшений подвески...",
    author: "Андрей",
    likes: 20,
    comments: [
      { id: 1, text: "Хочу установить это на свою A4", author: "Дмитрий" }
    ]
  }
];
  
export const mockNews = [
  {
    id: 1,
    title: 'Новая серия турбин от HKS',
    author: 'Иван Моторин',
    content: 'Компания HKS представила новую линейку турбин...',
    date: '2024-04-15',
    image: '/images/news1.jpg',
    likes: 45,
    comments: []
  },
  {
    id: 2,
    title: 'Как выбрать колеса для дрифта',
    author: 'DriftQueen',
    content: 'В статье разбираем важные параметры колес...',
    date: '2024-03-30',
    image: '/images/news2.jpg',
    likes: 30,
    comments: []
  },
  {
    id: 3,
    title: 'Форсаж 11 – слив фото со съемок',
    author: 'MovieLeak',
    content: 'В сеть попали кадры со съемочной площадки...',
    date: '2024-04-01',
    image: '/images/news3.jpg',
    likes: 102,
    comments: []
  },
  {
    id: 4,
    title: 'Сравнение тормозных систем Brembo vs Wilwood',
    author: 'AutoExpert',
    content: 'Детальный разбор систем: эффективность, ресурс...',
    date: '2024-02-14',
    image: '/images/news4.jpg',
    likes: 65,
    comments: []
  },
  {
    id: 5,
    title: '10 легендарных японских авто',
    author: 'RetroCar',
    content: 'Вспомним культовые машины, изменившие автотюнинг...',
    date: '2024-01-12',
    image: '/images/news5.jpg',
    likes: 150,
    comments: []
  },
  {
    id: 6,
    title: 'Настройка выхлопа: громко, но по закону',
    author: 'ГлушительПро',
    content: 'Как прокачать звук и не попасть под штраф...',
    date: '2024-03-22',
    image: '/images/news6.jpg',
    likes: 28,
    comments: []
  },
  {
    id: 7,
    title: 'Новая Supra GR в продаже',
    author: 'Тойота Центр',
    content: 'Обновленная Toyota Supra уже в России...',
    date: '2024-04-02',
    image: '/images/news7.jpg',
    likes: 87,
    comments: []
  },
  {
    id: 8,
    title: 'Покраска раптором: плюсы и минусы',
    author: 'Кузовщик33',
    content: 'Преимущества и подводные камни антигравийного покрытия...',
    date: '2024-02-25',
    image: '/images/news8.jpg',
    likes: 13,
    comments: []
  },
  {
    id: 9,
    title: 'Настройка ECU: чип-тюнинг без последствий',
    author: 'МозгМашины',
    content: 'Как грамотно перепрошить блок управления двигателем...',
    date: '2024-01-18',
    image: '/images/news9.jpg',
    likes: 72,
    comments: []
  },
  {
    id: 10,
    title: 'Запчасти для Silvia S15 — где взять?',
    author: 'SilviaClub',
    content: 'Собрали список самых надёжных поставщиков...',
    date: '2024-04-10',
    image: '/images/news10.jpg',
    likes: 56,
    comments: []
  }
];

  
  // src/data/mockData.js
  export const tuningParts = [
    {
      "id": 1,
      "brand": "BMW",
      "model": "X5",
      "category": "Двигатель",
      "name": "Турбокит GT35",
      "price": "120 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Turbo+Kit",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 2,
      "brand": "BMW",
      "model": "M5",
      "category": "Тормоза",
      "name": "Тормозные диски Brembo",
      "price": "85 000 ₽",
      "rating": 5,
      "image": "https://via.placeholder.com/300x200?text=Brakes",
      "rarity": "Обычная",
      "comments": [
        {
          "id": 1,
          "author": "Слава",
          "text": "Уже установил — доволен."
        }
      ]
    },
    {
      "id": 3,
      "brand": "Audi",
      "model": "A4",
      "category": "Подвеска",
      "name": "Койловеры KW V3",
      "price": "145 000 ₽",
      "rating": 5,
      "image": "https://via.placeholder.com/300x200?text=Suspension",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 4,
      "brand": "Mercedes",
      "model": "C-Class",
      "category": "Аэродинамика",
      "name": "Спойлер карбоновый",
      "price": "67 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Spoiler",
      "rarity": "Редкая",
      "comments": [
        {
          "id": 1,
          "author": "Игорь",
          "text": "Идеально подходит для моего авто."
        }
      ]
    },
    {
      "id": 5,
      "brand": "Ford",
      "model": "Focus",
      "category": "Выхлопная система",
      "name": "Глушитель Remus",
      "price": "42 000 ₽",
      "rating": 3,
      "image": "https://via.placeholder.com/300x200?text=Exhaust",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 6,
      "brand": "Toyota",
      "model": "Camry",
      "category": "Оптика",
      "name": "LED фары",
      "price": "89 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Lights",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 7,
      "brand": "BMW",
      "model": "X3",
      "category": "Двигатель",
      "name": "Интеркулер Forge",
      "price": "55 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Intercooler",
      "rarity": "Обычная",
      "comments": [
        {
          "id": 1,
          "author": "Андрей",
          "text": "Очень качественная вещь."
        }
      ]
    },
    {
      "id": 8,
      "brand": "Audi",
      "model": "Q7",
      "category": "Подвеска",
      "name": "Пневмоподвеска Air Lift",
      "price": "210 000 ₽",
      "rating": 5,
      "image": "https://via.placeholder.com/300x200?text=Air+Suspension",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 9,
      "brand": "Mercedes",
      "model": "E-Class",
      "category": "Тормоза",
      "name": "Комплект тормозных колодок",
      "price": "32 000 ₽",
      "rating": 3,
      "image": "https://via.placeholder.com/300x200?text=Brake+Pads",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 10,
      "brand": "Ford",
      "model": "Mustang",
      "category": "Двигатель",
      "name": "Чип-тюнинг Stage 2",
      "price": "28 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Chip+Tuning",
      "rarity": "Редкая",
      "comments": [
        {
          "id": 1,
          "author": "Петр",
          "text": "Установка заняла 15 минут!"
        },
        {
          "id": 2,
          "author": "Игорь",
          "text": "Это must-have!"
        }
      ]
    },
    {
      "id": 11,
      "brand": "Toyota",
      "model": "Land Cruiser",
      "category": "Подвеска",
      "name": "Лифт-комплект 3 дюйма",
      "price": "78 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Lift+Kit",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 12,
      "brand": "BMW",
      "model": "X6",
      "category": "Аэродинамика",
      "name": "Диффузор карбоновый",
      "price": "94 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Diffuser",
      "rarity": "Обычная",
      "comments": [
        {
          "id": 1,
          "author": "Сергей",
          "text": "Очень качественная вещь."
        }
      ]
    },
    {
      "id": 13,
      "brand": "Audi",
      "model": "A6",
      "category": "Выхлопная система",
      "name": "Гофра выхлопной системы",
      "price": "23 000 ₽",
      "rating": 3,
      "image": "https://via.placeholder.com/300x200?text=Exhaust+Part",
      "rarity": "Редкая",
      "comments": [
        {
          "id": 1,
          "author": "Андрей",
          "text": "Хочу такую себе!"
        }
      ]
    },
    {
      "id": 14,
      "brand": "Mercedes",
      "model": "G-Class",
      "category": "Оптика",
      "name": "Противотуманные фары",
      "price": "45 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Fog+Lights",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 15,
      "brand": "Ford",
      "model": "Focus",
      "category": "Двигатель",
      "name": "Воздушный фильтр K&N",
      "price": "12 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Air+Filter",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 16,
      "brand": "Toyota",
      "model": "Camry",
      "category": "Подвеска",
      "name": "Стойки амортизаторов KYB",
      "price": "65 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Shock+Absorbers",
      "rarity": "Уникальная",
      "comments": [
        {
          "id": 1,
          "author": "Петр",
          "text": "Супер! Спасибо за обзор."
        }
      ]
    },
    {
      "id": 17,
      "brand": "BMW",
      "model": "320i",
      "category": "Тормоза",
      "name": "Тормозные колодки Textar",
      "price": "18 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Brake+Pads",
      "rarity": "Обычная",
      "comments": []
    },
    {
      "id": 18,
      "brand": "Audi",
      "model": "RS6",
      "category": "Аэродинамика",
      "name": "Сплиттер передний",
      "price": "112 000 ₽",
      "rating": 5,
      "image": "https://via.placeholder.com/300x200?text=Front+Splitter",
      "rarity": "Редкая",
      "comments": [
        {
          "id": 1,
          "author": "Влад",
          "text": "Крутая доработка!"
        }
      ]
    },
    {
      "id": 19,
      "brand": "Mercedes",
      "model": "S-Class",
      "category": "Оптика",
      "name": "Лазерные фары",
      "price": "325 000 ₽",
      "rating": 5,
      "image": "https://via.placeholder.com/300x200?text=Laser+Lights",
      "rarity": "Уникальная",
      "comments": [
        {
          "id": 1,
          "author": "Михаил",
          "text": "Светят лучше солнца!"
        }
      ]
    },
    {
      "id": 20,
      "brand": "Ford",
      "model": "Mustang",
      "category": "Выхлопная система",
      "name": "Прямоточный глушитель",
      "price": "64 000 ₽",
      "rating": 4,
      "image": "https://via.placeholder.com/300x200?text=Straight+Exhaust",
      "rarity": "Обычная",
      "comments": []
    }
  ];