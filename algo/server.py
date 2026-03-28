import http.server
import socketserver
import json
import os
from urllib.parse import urlparse
import sys

# Import logic from problema1.py
sys.path.append(os.getcwd())
import problema1

PORT = 8000
DIRECTORY = "app"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/scan':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data)
                targets = data.get('targets', [])
                
                results = []
                for target in targets:
                    # Execute real TLS analysis logic
                    # We assume port 443 and type "real" for everything supplied by user
                    servicio = {
                        "service": "On-demand Scan",
                        "host": target,
                        "port": 443,
                        "type": "real"
                    }
                    resultado = problema1.analizar_servicio(servicio)
                    results.append(resultado)
                
                # Send JSON response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(results).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        # Handle CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Servidor TLS Analyzer iniciado en puerto {PORT}")
        print(f"Sirviendo interfaz web desde: {os.path.abspath(DIRECTORY)}")
        print(f"API endpoint listo en: http://localhost:{PORT}/api/scan")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            httpd.server_close()
