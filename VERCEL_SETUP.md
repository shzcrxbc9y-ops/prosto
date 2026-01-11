# Развертывание на Vercel

Инструкция по развертыванию веб-приложения для сохранения данных на Vercel.

## Быстрое развертывание

### Способ 1: Через Vercel Dashboard (рекомендуется)

1. **Загрузите код в GitHub** (если еще не загружен):
   ```bash
   git add .
   git commit -m "Add Vercel support"
   git push
   ```

2. **Войдите в Vercel**:
   - Перейдите на https://vercel.com
   - Войдите через GitHub

3. **Импортируйте проект**:
   - Нажмите **"Add New..."** → **"Project"**
   - Выберите репозиторий `shzcrxbc9y-ops/prosto`
   - Vercel автоматически определит настройки

4. **Настройки проекта**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (корень)
   - **Build Command**: (оставьте пустым)
   - **Output Directory**: `.` (точка)
   - Нажмите **"Deploy"**

5. **Дождитесь развертывания** (обычно 1-2 минуты)

### Способ 2: Через Vercel CLI

1. **Установите Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Войдите в Vercel**:
   ```bash
   vercel login
   ```

3. **Разверните проект**:
   ```bash
   vercel
   ```

4. **Для продакшена**:
   ```bash
   vercel --prod
   ```

## Настройка сохранения данных в GitHub

Для того, чтобы данные сохранялись в файл `data.txt`, нужно настроить переменные окружения:

### Шаг 1: Создайте GitHub Personal Access Token

1. Перейдите: https://github.com/settings/tokens
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Заполните:
   - **Note**: `Vercel Data Saver`
   - **Expiration**: выберите срок (или No expiration)
   - **Select scopes**: отметьте **`repo`** (полный доступ)
4. Нажмите **"Generate token"**
5. **Скопируйте токен** (показывается только один раз!)

### Шаг 2: Настройте переменные в Vercel

1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменные:

   **Переменная 1:**
   - **Key**: `GITHUB_TOKEN`
   - **Value**: ваш GitHub токен
   - **Environment**: выберите все (Production, Preview, Development)

   **Переменная 2:**
   - **Key**: `GITHUB_REPO`
   - **Value**: `shzcrxbc9y-ops/prosto`
   - **Environment**: все

   **Переменная 3 (опционально):**
   - **Key**: `GITHUB_BRANCH`
   - **Value**: `main`
   - **Environment**: все

4. Нажмите **"Save"** для каждой переменной

### Шаг 3: Пересоберите проект

1. В Vercel Dashboard перейдите в **Deployments**
2. Нажмите на последний деплой
3. Нажмите **"Redeploy"** → **"Use existing Build Cache"** (или **"Redeploy"** для полной пересборки)

## Проверка работы

1. Откройте ваш сайт на Vercel (URL будет показан после развертывания)
2. Введите данные в форму
3. Нажмите "Сохранить"
4. Проверьте файл `data.txt` в GitHub: https://github.com/shzcrxbc9y-ops/prosto

Данные должны появиться в файле через несколько секунд!

## Структура проекта для Vercel

- `index.html` - главная страница
- `api/save.js` - Vercel Serverless Function для сохранения данных
- `vercel.json` - конфигурация Vercel
- `package.json` - зависимости проекта

## Отличия от Netlify

- **API функции**: в папке `api/` вместо `netlify/functions/`
- **Формат функции**: `export default function handler(req, res)` вместо `exports.handler`
- **Конфигурация**: `vercel.json` вместо `netlify.toml`
- **URL API**: `/api/save` вместо `/.netlify/functions/save`

## Просмотр логов

1. В Vercel Dashboard: **Deployments** → выберите деплой
2. Перейдите на вкладку **Functions**
3. Выберите функцию `api/save`
4. Там будут видны все логи и запросы

## Безопасность

⚠️ **Важно**: GitHub токен имеет полный доступ к репозиториям. Храните его в секрете!

Если токен скомпрометирован:
1. Удалите его в https://github.com/settings/tokens
2. Создайте новый токен
3. Обновите переменную `GITHUB_TOKEN` в Vercel
