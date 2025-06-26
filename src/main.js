import './css/main.css';
import './css/styles.css';
import { shuffle, pick, debounce } from 'lodash';

// Пример 1: Работа с массивами
const numbers = [1, 2, 3, 4, 5];
const shuffledNumbers = shuffle(numbers);

console.log('Original numbers:', numbers);
console.log('Shuffled numbers:', shuffledNumbers);

// Пример 2: Работа с объектами
const user = {
  name: 'John Doe',
  age: 30,
  city: 'New York',
};

const pickedProperties = pick(user, ['name', 'age']);
console.log('Picked properties:', pickedProperties);

// Пример 3: Утилиты
const debouncedFunction = debounce(() => {
  console.log('This function is debounced!');
}, 1000);

debouncedFunction();
debouncedFunction();
debouncedFunction();
