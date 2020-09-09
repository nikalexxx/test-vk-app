import 'core-js/features/map';
import 'core-js/features/set';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';

// import registerServiceWorker from './sw';

// Init VK  Mini App
connect.send('VKWebAppInit');

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
// registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));

console.log(`
Это приложение нерабочее от слова совсем.
Тут нет хранилища, заказы не имеют отдельной сущности.
При желании тут можно переписать всё с нуля.
Кратко о фиксах из задания:
1. Скрываем кнопки по условию.
2. Ставим тип time(поддержано почти для всех браузеров), + валидируем и скрываем кнопку при неверном формате.
3. Совпадали id, в reduce перезапись поля объекта, просто меняем.
4. Меняем на CANCELED при отмене.
5. Прикапываем параметры в localStorage по ключу.
`);
