import sqlite3
import os

db_path = 'backend/medichain.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("Columns in 'users' table:")
    for col in columns:
        print(f" - {col[1]}")
    conn.close()
else:
    print(f"File {db_path} does not exist")
