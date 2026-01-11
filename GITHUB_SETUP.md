# Настройка сохранения данных в GitHub

Для того, чтобы данные сохранялись в файл `data.txt` в вашем GitHub репозитории, нужно настроить переменные окружения в Netlify.

## Шаг 1: Создайте GitHub Personal Access Token

1. Перейдите на: https://github.com/settings/tokens
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Заполните форму:
   - **Note**: `Netlify Data Saver` (любое имя)
   - **Expiration**: выберите срок действия (например, 90 дней или No expiration)
   - **Select scopes**: отметьте **`repo`** (полный доступ к репозиториям)
4. Нажмите **"Generate token"**
5. **ВАЖНО**: Скопируйте токен сразу! Он показывается только один раз.

## Шаг 2: Настройте переменные в Netlify

1. Откройте ваш проект в [Netlify Dashboard](https://app.netlify.com)
2. Перейдите в **Site settings** → **Environment variables**
3. Нажмите **"Add a variable"** и добавьте:

   **Переменная 1:**
   - **Key**: `GITHUB_TOKEN`
   - **Value**: вставьте ваш GitHub токен (который скопировали в шаге 1)
   - **Scopes**: выберите **"All scopes"** или **"Production, Deploy previews, Branch deploys"**

   **Переменная 2:**
   - **Key**: `GITHUB_REPO`
   - **Value**: `shzcrxbc9y-ops/prosto` (ваш username/repository)
   - **Scopes**: выберите **"All scopes"**

   **Переменная 3 (опционально):**
   - **Key**: `GITHUB_BRANCH`
   - **Value**: `main` (или другая ветка, если используете другую)
   - **Scopes**: выберите **"All scopes"**

4. Нажмите **"Save"** для каждой переменной

## Шаг 3: Пересоберите сайт

1. В Netlify Dashboard перейдите в **Deploys**
2. Нажмите **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Дождитесь завершения развертывания

## Проверка

После настройки:
1. Откройте ваш сайт на Netlify
2. Введите данные в форму
3. Нажмите "Сохранить"
4. Проверьте файл `data.txt` в вашем GitHub репозитории: https://github.com/shzcrxbc9y-ops/prosto

Данные должны появиться в файле через несколько секунд!

## Безопасность

⚠️ **Важно**: GitHub токен имеет полный доступ к вашим репозиториям. Храните его в секрете и не публикуйте в коде!

Если токен скомпрометирован:
1. Перейдите в https://github.com/settings/tokens
2. Найдите токен и удалите его
3. Создайте новый токен
4. Обновите переменную `GITHUB_TOKEN` в Netlify
