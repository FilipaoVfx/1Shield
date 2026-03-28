import json
import ssl
import socket

def cargar_servicios():
    try:
        with open("problema1.json", 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    
def obtener_tls_servicio(servicio):
    if servicio["type"] == "real":
        return obtener_tls_real(servicio["host"], servicio["port"])
    else:
        return servicio.get("tls_version", "ERROR")
    
def obtener_tls_real(host, port):
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    try:
        with socket.create_connection((host, port), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                return ssock.version()
    except Exception:
        return "ERROR"

def analizar_servicio(servicio):
    version = obtener_tls_servicio(servicio)

    if version in ["TLSv1", "TLSv1.1"]:
        riesgo = "Alta"
        explicacion = "Protocolo obsoleto vulnerable a interceptación (POODLE/BEAST)."
        recomendacion = "Deshabilitar TLS 1.0/1.1 y actualizar a TLS 1.2 o 1.3."
    
    elif version == "TLSv1.2":
        riesgo = "Media"
        explicacion = "Seguro pero no óptimo. Protocolo estándar actual."
        recomendacion = "Se recomienda habilitar TLS 1.3 para mayor seguridad y rendimiento."
    
    elif version == "TLSv1.3":
        riesgo = "Baja"
        explicacion = "Protocolo moderno y altamente seguro."
        recomendacion = "Configuración óptima detectada."
    
    else:
        riesgo = "Alta"
        explicacion = f"Error de conexión o versión no reconocida: {version}"
        recomendacion = "Verificar disponibilidad del puerto 443 y configuración TLS."

    return {
        "target": servicio["host"],
        "tlsVersion": version.replace("TLSv", ""),
        "status": "Habilitado" if version != "ERROR" else "Deshabilitado",
        "criticality": riesgo,
        "riskDesc": explicacion,
        "recommendation": recomendacion
    }

def generar_reporte(resultados):
    for r in resultados:
        print("-------")
        print(f"Host: {r['target']}")
        print(f"TLS: {r['tlsVersion']}")
        print(f"Riesgo: {r['criticality']}")

def main():
    try:
        with open("problema1.json") as f:
            servicios = json.load(f)
    except Exception:
        servicios = [{"service": "Default", "host": "google.com", "port": 443, "type": "real"}]

    resultados = []
    for s in servicios:
        resultados.append(analizar_servicio(s))

    for r in resultados:
        print("\n------------------")
        print(f"Host: {r['target']}")
        print(f"TLS: {r['tlsVersion']}")
        print(f"Riesgo: {r['criticality']}")
        print(f"Explicación: {r['riskDesc']}")
        print(f"Recomendación: {r['recommendation']}")

if __name__ == "__main__":
    main()