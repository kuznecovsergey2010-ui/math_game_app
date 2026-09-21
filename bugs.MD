# 🧩 Баг: после первого ответа проверяется не текущий пример

## 🧪 Как воспроизвести

1. Открыть `index.html` в браузере.
2. Нажать кнопку `начать`.
3. Решить показанный пример и нажать `Отправить`.
4. Ввести ответ для нового примера, который появился после проверки.
5. Снова нажать `Отправить`.

## 🎯 Ожидаемое поведение

- После отправки ответа показывается один статус: `Правильно!` или `Неправильно!`.
- После этого появляется следующий пример.
- Повторная проверка использует поле ввода и правильный ответ именно для нового примера.
- Старый пример, поле ввода, скрытый ответ и кнопка не остаются на странице.

## 🚨 Фактическое поведение

- После проверки функция `checkAnswer()` всегда запускает `startPlay(1)`. Поэтому программа каждый раз создаёт новый пример и новое поле ответа, не удаляя старые.
- На странице накапливаются несколько `input`, кнопок отправки и скрытых элементов с одинаковым `id="correct"`.
- `document.querySelector("input")` всегда возвращает первый `input`, а `document.getElementById("correct")` — первый найденный элемент. Поэтому второй и последующие ответы проверяются по данным первого примера, а не текущего.
- Каждый новый ответ добавляет ещё один заголовок `Правильно!` или `Неправильно!`; предыдущий статус не заменяется.
- Кнопка `Отправить` имеет `type="text"` вместо типа `button`, что не является причиной основной ошибки, но является отдельным дефектом разметки.

## 🕵️ Причина

`startPlay()` каждый раз создаёт новые элементы вместо обновления одной игровой области. При этом `checkAnswer()` ищет элементы по всей странице через `querySelector()` и `getElementById()`. То есть программа не ищет поле и ответ рядом с нажатой кнопкой, а берёт первый найденный дом элемент. Поэтому после первого раунда она может выбрать старые элементы.

## 🛠 Как исправить

ЕЩЁ РАЗ Проблема в том, что код создаёт новые дом элементы заново каждый раз, а потом пытается найти старые. Поэтому проверка идёт не по текущему примеру, а по самому первому, который был создан.

### 1) ⚠️ Что сейчас происходит неправильно

Функция `startPlay()` каждый раз делает новое: новый текст, новый `input`, новую кнопку и новый скрытый элемент с `id="correct"`.

Вот кусок из `script.js`:

```js
function startPlay(event) {
    const bodyElement = document.querySelector("body")
    const newElement = document.createElement("p")
    bodyElement.append(newElement)

    const correctAnswerElement = document.createElement("p")
    correctAnswerElement.id = "correct"
    bodyElement.append(correctAnswerElement)

    const windowInput = document.createElement("input")
    bodyElement.append(windowInput)

    const submitButton = document.createElement("button")
    bodyElement.append(submitButton)
}
```

То есть после каждого ответа на странице появляются ещё копии. Это видно по `bodyElement.append(...)` — элементы постоянно добавляются в конец страницы.

### 2) 🔍 Почему это ломает проверку

В функции `checkAnswer()` стоит так:

```js
const windowInput = document.querySelector("input")
const correct_way = document.getElementById("correct")
```

`querySelector("input")` берёт первый `input` на странице. А `getElementById("correct")` тоже берёт первый элемент с таким `id`.

Если на странице уже есть несколько `input` и несколько `id="correct"`, то код берёт не тот элемент. В итоге проверка идёт по старому примеру, а не по текущему.

Проблема в том, что `id` должен быть уникальным. На странице нельзя иметь два одинаковых `id`.

### 3) 🧠 Как правильно мыслить

Нужно не создавать заново всё на странице, а обновлять уже существующее.

Правильная логика такая:
- есть один пример;
- есть одно поле для ввода;
- есть один ответ для текущего примера;
- после проверки пример меняется, а старые элементы не копируются.

### 🧭 Что должно происходить в игре

Сначала сформулируем решение простыми словами, без кода.

Нам нужно:

1. Показать игроку один пример.
2. Запомнить правильный ответ для этого примера.
3. Проверить ответ игрока именно с этим сохранённым ответом.
4. Показать результат проверки.
5. Заменить старый пример новым, не создавая копии поля и кнопки.

Это и есть логика игры. Мы не добавляем новую сложную функцию. Мы добавляем память о правильном ответе текущего примера и обновляем уже существующие элементы страницы. 🧱

Хранить правильный ответ можно двумя способами. Первый способ — использовать объект `state (это типа аналог словарей в питоне но в js)`, второй — обычную переменную `correctAnswer`. С точки зрения логики игры оба способа делают одно и то же: сохраняют ответ текущего примера, чтобы потом его проверить.

Вариант с объектом:

```js
const state = {
    correctAnswer: 0,
}
```

Это объект. Он хранит данные игры. Внутри него есть поле `correctAnswer`.

Словами проще:

```js
const state = {
    correctAnswer: 0,
}
```

Это значит: "создай объект, в котором будет переменная `correctAnswer`, и пока она равна 0".

Для этой маленькой игры объект не обязателен. Можно хранить правильный ответ в обычной переменной:

```js
let correctAnswer = 0
```

`let` означает, что значение переменной можно изменить. Сначала `correctAnswer` равно `0`, а после создания примера в него записывается настоящий ответ:

```js
function generateExample() {
    const a = 5
    const b = 7
    correctAnswer = a + b
}
```

Теперь `correctAnswer` равно `12`. Проверка ответа будет такой:

```js
function checkAnswer() {
    const userAnswer = Number(inputElement.value)

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Правильно!"
    } else {
        feedbackElement.textContent = "Неправильно!"
    }
}
```

Объект `state` удобен, если данных станет больше: например, появятся очки или количество ошибок. Но для хранения только одного правильного ответа достаточно обычной переменной `correctAnswer`.

Потом мы запишем в неё правильный ответ текущего примера:

```js
function generateExample() {
    const a = 5
    const b = 7
    state.correctAnswer = a + b
    exampleElement.textContent = a + " + " + b + " = ?"
}
```

Теперь `state.correctAnswer` равно `12`. Мы можем сравнивать ответ пользователя именно с этим числом.

### 4) ✅ Как исправить код

Вот правильный принцип:

```js
function checkAnswer() {
    const userAnswer = Number(inputElement.value)

    if (userAnswer === state.correctAnswer) {
        feedbackElement.textContent = "Правильно!"
    } else {
        feedbackElement.textContent = "Неправильно!"
    }
}
```

То есть:
- читаем число из `input`;
- сравниваем его с `correctAnswer`;
- выводим результат в одно место.

Этот вариант читается проще. Он говорит прямо: если ответ равен правильному, показываем "Правильно!", иначе показываем "Неправильно!".

### 5) 🧷 Ошибка с типом кнопки

В коде ещё есть отдельная проблема:

```js
const submitButton = document.createElement("button")
submitButton.type = "text"
```

`type="text"` у кнопки неверный. У `button` тип должен быть `button` или `submit`.

Правильно так:

```js
submitButton.type = "button"
```

Это не главная причина бага, но это ещё один дефект.

### 6) 📌 Как должен выглядеть один результат

Сейчас код создаёт новый `h1` каждый раз:

```js
const textLoose = document.createElement("h1")
textLoose.innerText = "Неправильно!"
bodyElement.append(textLoose)
```

Так на странице копятся сообщения. Нужно один блок для статуса и просто менять его текст:

```js
const feedbackElement = document.getElementById("feedback")
feedbackElement.textContent = "Правильно!"
```


### 7) 🧰 Пример правильного решения

Вот короткая рабочая схема:

```js
const state = {
    correctAnswer: 0,
}

const exampleElement = document.getElementById("example")
const inputElement = document.getElementById("answer-input")
const feedbackElement = document.getElementById("feedback")
const submitButton = document.getElementById("submit-button")

function generateExample() {
    const a = Math.floor(Math.random() * 20)
    const b = Math.floor(Math.random() * 20)
    state.correctAnswer = a + b
    exampleElement.textContent = a + "+" + b + "=?"
    inputElement.value = ""
    feedbackElement.textContent = ""
}

function checkAnswer() {
    const userAnswer = Number(inputElement.value)

    if (userAnswer === state.correctAnswer) {
        feedbackElement.textContent = "Правильно!"
    } else {
        feedbackElement.textContent = "Неправильно!"
    }

    generateExample()
}

submitButton.type = "button"
submitButton.onclick = checkAnswer
```

Что здесь важно: 🎯
- один пример;
- один input;
- один статус;
- один правильный ответ для текущего примера;
- старые элементы не плодятся.

### 8) 🗺 Где это в проекте

Это видно в реальном коде проекта:
- `index.html` — базовая страница игры;
- `script.js` — логика генерации и проверки ответов.

То есть баг в работе с DOM элементами страницы.

## ✅ Критерии готовности

- один пример = один ответ;
- при каждом ответе не появляется новая копия input и кнопки;
- проверка идёт именно по текущему примеру;
- на странице только один статус сообщения;
- кнопка `Отправить` имеет корректный тип `button`;
- в консоли браузера нет ошибок.