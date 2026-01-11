from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
import os

app = Flask(__name__)

# Имя файла для сохранения данных
DATA_FILE = "data.txt"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save', methods=['POST'])
def save_data():
    # Получаем данные из формы
    user_input = request.form.get('input_data', '').strip()
    
    if user_input:
        # Добавляем дату и время к записи
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Записываем в файл (добавляем к существующим данным)
        with open(DATA_FILE, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {user_input}\n")
        
        return redirect(url_for('success'))
    
    return redirect(url_for('index'))

@app.route('/success')
def success():
    return render_template('success.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
