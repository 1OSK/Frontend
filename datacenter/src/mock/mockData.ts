export interface Service {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    price: number;
  }
  

  
  // Моковые данные
  export const mockData: Service[] = [
    {
      id: 1,
      name: 'Коммутатор  G610',
      description: 'Поддержка до 24 портов, высокая производительность, возможность объединения в стеки.',
      image_url: 'https://1osk.github.io/Frontend/images/1.png',
      price: 815400,
    },
    {
      id: 2,
      name: 'Сервер DELL R650 10SFF',
      description: 'Процессоры Intel Xeon Scalable, до 1.5 ТБ оперативной памяти, поддержка NVMe.',
      image_url: 'https://1osk.github.io/Frontend/images/2.png',
      price: 515905,
    },
    {
      id: 3,
      name: 'СХД DELL PowerVault MD1400 External SAS 12 Bays',
      description: 'До 12 дисков, интерфейс SAS 12 Гбит/с, высокая отказоустойчивость.',
      image_url: 'https://1osk.github.io/Frontend/images/3.png',
      price: 124800,
    },
    {
      id: 4,
      name: 'Конфигуратор Dell R250',
      description: 'Поддержка до 10 ядер, до 2 ТБ памяти DDR4, компактный корпус.',
      image_url: 'https://1osk.github.io/Frontend/images/4.png',
      price: 166372,
    },
    {
      id: 5,
      name: 'Серверный Настенный шкаф 15U',
      description: '15 юнитов, высококачественная сталь, возможность установки на стену.',
      image_url: 'https://1osk.github.io/Frontend/images/5.png',
      price: 326590,
    },
    {
      id: 6,
      name: 'Патч-корд iOpen ANP612B-BK-50M',
      description: 'Длина 50 м, оболочка из ПВХ, защита от помех.',
      image_url: 'https://1osk.github.io/Frontend/images/6.png',
      price: 5199,
    },
    {
      id: 7,
      name: 'Патч-корд iOpen ANP612B-BK-50M',
      description: 'Длина 50 м, оболочка из ПВХ, защита от помех.',
      image_url: 'https://1osk.github.io/Frontend/images/default.png',
      price: 5199,
    },
  ];
  