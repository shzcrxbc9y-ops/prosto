// Используем fetch (доступен в Node.js 18+ в Netlify Functions)
// Если нужна поддержка старых версий, можно использовать node-fetch

exports.handler = async (event, context) => {
    // Разрешаем только POST запросы
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { data } = JSON.parse(event.body);
        
        if (!data || !data.trim()) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Данные не предоставлены' })
            };
        }

        // Получаем переменные окружения
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = process.env.GITHUB_REPO; // формат: owner/repo
        const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
        
        // Если GitHub токен не настроен, используем простое логирование
        if (!GITHUB_TOKEN || !GITHUB_REPO) {
            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
            const logEntry = `[${timestamp}] ${data.trim()}\n`;
            
            // Просто логируем в консоль Netlify
            console.log('DATA_SAVE:', logEntry);
            
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Данные залогированы (настройте GitHub для постоянного хранения)',
                    timestamp: timestamp
                })
            };
        }

        // Получаем текущую дату и время
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
        const newEntry = `[${timestamp}] ${data.trim()}\n`;
        
        // Получаем текущее содержимое файла через GitHub API
        let existingContent = '';
        let fileSha = null;
        
        try {
            const getFileResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/data.txt?ref=${GITHUB_BRANCH}`,
                {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Netlify-Function'
                    }
                }
            );
            
            if (getFileResponse.ok) {
                const fileData = await getFileResponse.json();
                existingContent = Buffer.from(fileData.content, 'base64').toString('utf8');
                fileSha = fileData.sha;
            }
        } catch (err) {
            // Файл не существует, создадим новый
            console.log('File does not exist, will create new one');
        }
        
        // Добавляем новую запись
        const updatedContent = existingContent + newEntry;
        const contentBase64 = Buffer.from(updatedContent).toString('base64');
        
        // Обновляем файл через GitHub API
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/data.txt`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Netlify-Function'
                },
                body: JSON.stringify({
                    message: `Add data entry: ${data.trim().substring(0, 50)}`,
                    content: contentBase64,
                    branch: GITHUB_BRANCH,
                    ...(fileSha && { sha: fileSha })
                })
            }
        );
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.text();
            throw new Error(`GitHub API error: ${updateResponse.status} - ${errorData}`);
        }
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: true, 
                message: 'Данные сохранены в репозиторий',
                timestamp: timestamp
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Внутренняя ошибка сервера',
                details: error.message 
            })
        };
    }
};
