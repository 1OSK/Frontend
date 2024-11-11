import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы данных для сервиса
export interface Service {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
}

// Тип состояния слайса
interface DataState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
  minPrice: string;
  maxPrice: string;
  menuActive: boolean; // Добавляем состояние для бургер-меню
}

// Моковые данные
export const mockData: Service[] = [
  {
    id: 1,
    name: 'Коммутатор  G610',
    description: 'Поддержка до 24 портов, высокая производительность, возможность объединения в стеки.',
    image_url: '/images/1.png',
    price: 815400,
  },
  {
    id: 2,
    name: 'Сервер DELL R650 10SFF',
    description: 'Процессоры Intel Xeon Scalable, до 1.5 ТБ оперативной памяти, поддержка NVMe.',
    image_url: '/images/1.png',
    price: 515905,
  },
  {
    id: 3,
    name: 'СХД DELL PowerVault MD1400 External SAS 12 Bays',
    description: 'До 12 дисков, интерфейс SAS 12 Гбит/с, высокая отказоустойчивость.',
    image_url: '/images/1.png',
    price: 124800,
  },
  {
    id: 4,
    name: 'Конфигуратор Dell R250',
    description: 'Поддержка до 10 ядер, до 2 ТБ памяти DDR4, компактный корпус.',
    image_url: '/images/1.png',
    price: 166372,
  },
  {
    id: 5,
    name: 'Серверный Настенный шкаф 15U',
    description: '15 юнитов, высококачественная сталь, возможность установки на стену.',
    image_url: '/images/1.png',
    price: 326590,
  },
  {
    id: 6,
    name: 'Патч-корд iOpen ANP612B-BK-50M',
    description: 'Длина 50 м, оболочка из ПВХ, защита от помех.',
    image_url: '/images/1.png',
    price: 5199,
  },
  {
    id: 6,
    name: 'Патч-корд iOpen ANP612B-BK-50M',
    description: 'Длина 50 м, оболочка из ПВХ, защита от помех.',
    image_url: null,
    price: 5199,
  },
];

// Начальное состояние с типом DataState
const initialState: DataState = {
  services: mockData,
  selectedService: null,
  loading: false,
  error: null,
  minPrice: '',
  maxPrice: '',
  menuActive: false, // Начальное состояние меню
};

// Создание слайса
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
    },
    setSelectedService(state, action: PayloadAction<Service | null>) {
      state.selectedService = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload;
    },
    toggleMenu(state) {
      state.menuActive = !state.menuActive; // Меняем состояние меню
    },
  },
});

// Экспорт редьюсеров
export const {
  setServices,
  setSelectedService,
  setLoading,
  setError,
  setMinPrice,
  setMaxPrice,
  toggleMenu, // Экспортируем action для изменения состояния меню
} = dataSlice.actions;

// Экспорт редьюсера
export default dataSlice.reducer;