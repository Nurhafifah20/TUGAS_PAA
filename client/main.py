from dotenv import load_dotenv
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL


load_dotenv()
app = Flask(__name__, static_url_path="", static_folder="display/build")
CORS(app)

app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
app.config['MYSQL_USER'] = os.getenv('DB_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('DB_NAME')

mysql = MySQL(app)


@app.route('/', methods=['GET'])
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/get-current', methods=['GET'])
def getData():
    cur = mysql.connection.cursor()
    cur.execute("""SELECT * FROM employees""")
    rv = cur.fetchall()
    cur.close()
    return jsonify(rv)


@app.route('/sync', methods=['POST'])
def syncData():
    try:
        datas = request.json

        for row in datas:
            cur = mysql.connection.cursor()
            queryString = """INSERT INTO employees(employee_id, last_name, first_name, address) VALUES ({id}, '{last}', '{first}', '{addr}') ON DUPLICATE KEY UPDATE last_name = '{last}', first_name = '{first}', address = '{addr}', last_update=NOW();""".format(
                id=row["EmployeeID"], last=row["LastName"], first=row["FirstName"], addr=row["Address"])

            print(queryString)

            cur.execute(queryString)
            cur.fetchall()
            mysql.connection.commit()
            cur.close()

        return jsonify('yeah')
    except Exception as e:
        print(e)
        return jsonify('meh')


if __name__ == '__main__':
    app.run(port=3300)