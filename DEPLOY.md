# Инструкция по развертыванию на Netlify

## Быстрое развертывание

### Шаг 1: Загрузите код в GitHub

1. Создайте новый репозиторий на GitHub
2. Загрузите все файлы проекта в репозиторий:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/ВАШ_РЕПОЗИТОРИЙ.git
   git push -u origin main
   ```

### Шаг 2: Развертывание в Netlify

1. Войдите в [Netlify Dashboard](https://app.netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите **GitHub** и авторизуйтесь
4. Выберите ваш репозиторий
5. Настройки сборки:
   - **Build command**: (оставьте пустым)
   - **Publish directory**: `.` (точка)
6. Нажмите **"Deploy site"**

### Шаг 3: Настройка переменных окружения (для сохранения в GitHub)

Если вы хотите, чтобы данные сохранялись в файл `data.txt` в вашем репозитории:

1. В Netlify Dashboard перейдите в **Site settings** → **Environment variables**
2. Добавьте переменные:
   - `GITHUB_TOKEN` - ваш GitHub Personal Access Token
   - `GITHUB_REPO` - формат: `username/repository-name` (например: `user/fish`)
   - `GITHUB_BRANCH` - ветка (обычно `main`)

#### Как создать GitHub Token:

1. Перейдите: https://github.com/settings/tokens
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Дайте имя токену (например: "Netlify Data Saver")
4. Выберите срок действия
5. Отметьте права: **`repo`** (полный доступ к репозиториям)
6. Нажмите **"Generate token"**
7. Скопируйте токен (он показывается только один раз!)

### Шаг 4: Пересборка

После добавления переменных окружения:
1. Перейдите в **Deploys**
2. Нажмите **"Trigger deploy"** → **"Clear cache and deploy site"**

## Проверка работы

1. Откройте ваш сайт на Netlify (URL будет показан после развертывания)
2. Введите данные в форму
3. Нажмите "Сохранить"
4. Если настроен GitHub, проверьте файл `data.txt` в репозитории

## Без GitHub Token

Если вы не настроите GitHub Token, данные будут только логироваться в консоль Netlify:
- Перейдите в **Functions** → **save** → **Logs**
- Там вы увидите все сохраненные данные

## Просмотр логов

1. В Netlify Dashboard: **Functions** → выберите функцию **save**
2. Перейдите на вкладку **Logs**
3. Там будут видны все запросы и сохраненные данные
