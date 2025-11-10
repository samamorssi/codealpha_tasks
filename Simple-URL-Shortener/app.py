from flask import Flask, request, redirect, jsonify, render_template
import sqlite3
import string, random

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('urls.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS urls
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  short_code TEXT UNIQUE,
                  long_url TEXT)''')
    conn.commit()
    conn.close()

init_db()

# 3️⃣ Helper function
def generate_short_code(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# 4️⃣ Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    long_url = data.get('url')

    if not long_url:
        return jsonify({'error': 'URL is required'}), 400

    short_code = generate_short_code()
    conn = sqlite3.connect('urls.db')
    c = conn.cursor()
    c.execute("INSERT INTO urls (short_code, long_url) VALUES (?, ?)", (short_code, long_url))
    conn.commit()
    conn.close()

    short_url = request.host_url + short_code
    return jsonify({'short_url': short_url})

@app.route('/<short_code>')
def redirect_to_url(short_code):
    conn = sqlite3.connect('urls.db')
    c = conn.cursor()

    # 1️⃣ Get long URL
    c.execute("SELECT long_url, visits FROM urls WHERE short_code=?", (short_code,))
    row = c.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Invalid short URL'}), 404

    long_url, visits = row

    # 2️⃣ Increment visit count
    new_visits = visits + 1
    c.execute("UPDATE urls SET visits=? WHERE short_code=?", (new_visits, short_code))
    conn.commit()
    conn.close()

    # 3️⃣ Redirect user
    return redirect(long_url)
@app.route('/stats/<short_code>')
def get_stats(short_code):
    conn = sqlite3.connect('urls.db')
    c = conn.cursor()
    c.execute("SELECT long_url, visits FROM urls WHERE short_code=?", (short_code,))
    row = c.fetchone()
    conn.close()

    if row:
        long_url, visits = row
        return jsonify({
            'short_code': short_code,
            'long_url': long_url,
            'visits': visits
        })
    else:
        return jsonify({'error': 'Short code not found'}), 404


@app.route('/all')
def get_all_links():
    conn = sqlite3.connect('urls.db')
    c = conn.cursor()
    c.execute("SELECT short_code, long_url, visits FROM urls")
    rows = c.fetchall()
    conn.close()

    links = []
    for short_code, long_url, visits in rows:
        links.append({
            'short_url': request.host_url + short_code,
            'long_url': long_url,
            'visits': visits
        })
    return jsonify(links)




# 5️⃣ Run the app
if __name__ == '__main__':
    app.run(debug=True)
