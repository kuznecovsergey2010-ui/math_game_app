const startButton = document.getElementById("start")
function startPlay(event) {
            // Запрещаем повторно нажимать кнопку «начать».
            startButton.disabled = true

            // Создаём два случайных числа от 0 до 19.
            const numbOne = Math.floor(Math.random() * 20)
            const numbTwo = Math.floor(Math.random() * 20)

            // Находим body, чтобы добавлять в него новые элементы.
            const bodyElement = document.querySelector("body")


            // ----- Создаём и показываем пример -----

            const newElement = document.createElement("p")
            newElement.innerText = String(numbOne) + "+" + String(numbTwo) + "=?"
            newElement.id = "example"
            bodyElement.append(newElement)


            // ----- Сохраняем правильный ответ -----

            // Ответ находится на странице, но скрыт от пользователя.
            const correctAnswerElement = document.createElement("p")
            correctAnswerElement.innerText = numbOne + numbTwo
            correctAnswerElement.hidden = true
            correctAnswerElement.id = "correct"
            bodyElement.append(correctAnswerElement)


            // ----- Создаём поле для ввода ответа -----

            const windowInput = document.createElement("input")
            windowInput.type = "text"
            windowInput.placeholder = "Введите ответ: "
            bodyElement.append(windowInput)


            // ----- Создаём кнопку отправки ответа -----

            const submitButton = document.createElement("button")
            submitButton.type = "button"
            submitButton.innerText = "Отправить"
            submitButton.onclick = checkAnswer
            submitButton.id = "submit"
            bodyElement.append(submitButton)
        }


        // ==================================================
        // 3. ПРОВЕРКА ОТВЕТА
        // ==================================================

        function checkAnswer(event) {
            // Находим нужные элементы страницы.
            const bodyElement = document.querySelector("body")
            const windowInput = document.querySelector("input")
            const oldResult = document.getElementById("result")
            if (oldResult) {
                oldResult.remove()
            }
            

            // Если ответ неправильный, выводим сообщение об ошибке.
            if (windowInput.value != correct_way.innerText) {
                const textLoose = document.createElement("h1")
                textLoose.innerText = "Неправильно!"
                textLoose.id = "result"
                bodyElement.append(textLoose)
            }

            // Если ответ правильный, выводим сообщение об успехе.
            if (windowInput.value === correct_way.innerText) {
                const textWinner = document.createElement("h1")
                textWinner.innerText = "Правильно!"
                textWinner.id = "result"
                bodyElement.append(textWinner)
            }
            document.getElementById("example").remove()
            correct_way.remove()
            windowInput.remove()
            document.getElementById("submit").remove()

            startPlay(1) 
        }
        


        // ==================================================
        // 4. НАЗНАЧАЕМ ОБРАБОТЧИК КНОПКЕ «НАЧАТЬ»
        // ==================================================

        startButton.onclick = startPlay