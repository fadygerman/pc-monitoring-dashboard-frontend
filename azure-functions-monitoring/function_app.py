import azure.functions as func
import json
import logging
import pyodbc
from azure.identity import DefaultAzureCredential

app = func.FunctionApp()

@app.route(route="ReadPC", auth_level=func.AuthLevel.ANONYMOUS)
def ReadPC(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    headers = {
        "Access-Control-Allow-Origin": "https://gray-plant-0cded9103.4.azurestaticapps.net",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true"
    }

    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=headers)

    try:
        server = 'tcp:pc-dashboard-server.database.windows.net,1433'
        database = 'monitoring-db'
        credential = DefaultAzureCredential()
        token = credential.get_token("https://database.windows.net/.default").token
        
        conn_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};Authentication=ActiveDirectoryMsi;TrustServerCertificate=no;Connection Timeout=30;'
        conn = pyodbc.connect(conn_str, attrs_before={1256: token})
        
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PC")
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            result.append({
                'id': row[0],
                'name': row[1],
                'status': row[2],
                'group_id': row[3],
                'currentUser': row[4],
                'since': str(row[5]) if row[5] else None,
                'verbose_name': row[6],
                'verbose_name_plural': row[7]
            })
            
        return func.HttpResponse(
            body=json.dumps(result),
            mimetype="application/json",
            status_code=200,
            headers=headers
        )
    except pyodbc.Error as e:
        logging.error(f"ODBC Error: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": "Database connection error. Please check ODBC driver installation."}),
            status_code=500,
            headers=headers
        )
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            status_code=500,
            headers=headers
        )