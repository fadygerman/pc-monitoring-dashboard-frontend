import azure.functions as func
import datetime
import json
import logging
import os
import pyodbc
from azure.identity import DefaultAzureCredential

app = func.FunctionApp()

server = 'tcp:pc-dashboard-server.database.windows.net'
database = 'monitoring-db'

def get_connection():
    credential = DefaultAzureCredential()
    access_token = credential.get_token("https://database.windows.net/.default").token
    connection_string = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server},1433;DATABASE={database};Authentication=ActiveDirectoryMsi;TrustServerCertificate=no;'
    conn = pyodbc.connect(connection_string, attrs_before={1256: access_token})
    return conn

@app.route(route="ReadPC", auth_level=func.AuthLevel.ANONYMOUS)
def ReadPC(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    headers = {
        "Access-Control-Allow-Origin": "https://gray-plant-0cded9103.4.azurestaticapps.net",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
    }
    
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=headers)
        
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PC")
        rows = cursor.fetchall()
        conn.close()

        result = []
        for row in rows:
            result.append({
                'id': row[0],
                'name': row[1],
                'status': row[2],
                'group': row[3],  # Changed from group_id to group
                'currentUser': row[4],
                'since': row[5],
                'verbose_name': row[6],
                'verbose_name_plural': row[7]
            })

        return func.HttpResponse(
            body=json.dumps(result),
            mimetype="application/json",
            status_code=200,
            headers=headers

        )
    except Exception as e:
        return func.HttpResponse(
            str(e),
            status_code=500,
            headers=headers
        )