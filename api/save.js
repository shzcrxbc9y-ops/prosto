// Vercel Serverless Function для сохранения данных

export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Включаем CORS для всех доменов
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { data } = req.body;
        
        if (!data || !data.trim()) {
            return res.status(400).json({ error: 'Данные не предоставлены' });
        }

        // Получаем переменные окружения
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = process.env.GITHUB_REPO; // формат: owner/repo
        const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
        
        // Если GitHub токен не настроен, возвращаем ошибку
        if (!GITHUB_TOKEN || !GITHUB_REPO) {
            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
            const logEntry = `[${timestamp}] ${data.trim()}\n`;
            
            // Логируем в консоль Vercel для отладки
            console.log('DATA_SAVE (no GitHub config):', logEntry);
            console.log('GITHUB_TOKEN:', GITHUB_TOKEN ? 'SET' : 'NOT SET');
            console.log('GITHUB_REPO:', GITHUB_REPO || 'NOT SET');
            
            return res.status(200).json({ 
                success: false, 
                error: 'GitHub не настроен',
                message: 'Для сохранения данных в файл необходимо настроить переменные окружения GITHUB_TOKEN и GITHUB_REPO в Vercel. Данные залогированы в консоль Vercel.',
                timestamp: timestamp,
                help: 'См. инструкцию в VERCEL_SETUP.md'
            });
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
                        'User-Agent': 'Vercel-Function'
                    }
                }
            );
            
            if (getFileResponse.ok) {
                const fileData = await getFileResponse.json();
                // Декодируем base64 содержимое
                const contentBuffer = Buffer.from(fileData.content.replace(/\n/g, ''), 'base64');
                existingContent = contentBuffer.toString('utf8');
                fileSha = fileData.sha;
                console.log('Existing file found, SHA:', fileSha);
            } else if (getFileResponse.status === 404) {
                // Файл не существует, создадим новый
                console.log('File does not exist, will create new one');
            } else {
                const errorText = await getFileResponse.text();
                console.error('GitHub API error (GET):', getFileResponse.status, errorText);
                throw new Error(`Не удалось прочитать файл: ${getFileResponse.status}`);
            }
        } catch (err) {
            console.error('Error reading file:', err);
            if (err.message && !err.message.includes('Не удалось прочитать файл')) {
                throw new Error(`Ошибка при чтении файла: ${err.message}`);
            }
            throw err;
        }
        
        // Добавляем новую запись
        const updatedContent = existingContent + newEntry;
        // Кодируем в base64 для GitHub API
        const contentBase64 = Buffer.from(updatedContent, 'utf8').toString('base64');
        
        // Подготавливаем данные для обновления
        const updateData = {
            message: `Add data entry: ${data.trim().substring(0, 50)}`,
            content: contentBase64,
            branch: GITHUB_BRANCH
        };
        
        // Если файл существует, добавляем SHA для обновления
        if (fileSha) {
            updateData.sha = fileSha;
        }
        
        console.log('Updating file on GitHub, branch:', GITHUB_BRANCH, 'has SHA:', !!fileSha);
        
        // Обновляем файл через GitHub API
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/data.txt`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Vercel-Function'
                },
                body: JSON.stringify(updateData)
            }
        );
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.text();
            console.error('GitHub API error (PUT):', updateResponse.status, errorData);
            
            // Пытаемся распарсить ошибку для более понятного сообщения
            let errorMessage = `Ошибка GitHub API (${updateResponse.status})`;
            try {
                const errorJson = JSON.parse(errorData);
                if (errorJson.message) {
                    errorMessage = errorJson.message;
                }
            } catch (e) {
                // Игнорируем ошибку парсинга
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await updateResponse.json();
        console.log('File updated successfully, commit SHA:', result.commit?.sha);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Данные сохранены в репозиторий',
            timestamp: timestamp
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Внутренняя ошибка сервера',
            details: error.message 
        });
    }
}
