#!/usr/bin/env python3
"""
Comprehensive live backend functionality test suite for Grupo AAA.
Tests security, authentication, public APIs, admin CRUD, media upload, and error handling.
"""
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
import os
import uuid

BASE_URL = os.getenv("BASE_URL", "http://localhost:8080/api/v1")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "andresbermu211@gmail.com")
ADMIN_PASS = os.getenv("ADMIN_PASS", "Andres22*")

passed = 0
failed = 0

def test(name, condition, details=""):
    global passed, failed
    if condition:
        print(f"  \033[32m✔ PASS\033[0m: {name}")
        passed += 1
    else:
        print(f"  \033[31m✘ FAIL\033[0m: {name} - {details}")
        failed += 1

def request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    body = None
    if data is not None:
        if isinstance(data, (dict, list)):
            body = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(data, bytes):
            body = data
        elif isinstance(data, str):
            body = data.encode("utf-8")
            
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            code = resp.getcode()
            resp_body = resp.read().decode("utf-8")
            try:
                parsed = json.loads(resp_body) if resp_body else None
            except:
                parsed = resp_body
            return code, parsed
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_body) if err_body else None
        except:
            parsed = err_body
        return e.code, parsed
    except Exception as e:
        return 0, str(e)

print("\n" + "="*70)
print("  SUITE DE PRUEBAS DE FUNCIONALIDAD DEL BACKEND (GRUPO AAA)")
print("="*70 + "\n")

# 1. Health & Actuator
print("--- 1. Health & Monitoreo ---")
code, body = request("http://localhost:8080/actuator/health")
test("Actuator Health responde 200", code == 200, f"code={code}")
test("Estado del servidor es UP", isinstance(body, dict) and body.get("status") == "UP", f"body={body}")

# 2. Seguridad & Auth
print("\n--- 2. Autenticación & Seguridad ---")
# Credenciales erróneas
code, body = request(f"{BASE_URL}/auth/login", method="POST", data={"email": ADMIN_EMAIL, "password": "WrongPassword!"})
test("Rechaza contraseña incorrecta con 401", code == 401, f"code={code}")

# Credenciales correctas
code, body = request(f"{BASE_URL}/auth/login", method="POST", data={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
test("Login exitoso con credenciales de admin (200)", code == 200, f"code={code}")
token = body.get("accessToken") if isinstance(body, dict) else None
test("Token JWT generado correctamente", token is not None and len(token) > 20)

auth_headers = {"Authorization": f"Bearer {token}"}

# Acceso sin token a endpoint admin protegido
code, _ = request(f"{BASE_URL}/admin/dashboard/stats")
test("Protección: Acceso sin token a /admin retorna 401/403", code in (401, 403), f"code={code}")

# 3. APIs Públicas
print("\n--- 3. APIs Públicas (Sitio Web) ---")
code, body = request(f"{BASE_URL}/public/company")
test("GET /public/company retorna 200", code == 200, f"code={code}")
test("Información de la empresa presente", isinstance(body, dict) and "company" in body)

code, body = request(f"{BASE_URL}/public/projects")
test("GET /public/projects retorna 200", code == 200, f"code={code}")
test("Lista de proyectos públicos disponible", isinstance(body, dict) and "content" in body)

code, body = request(f"{BASE_URL}/public/projects/corales-del-viento")
test("GET /public/projects/corales-del-viento retorna 200", code == 200, f"code={code}")
test("Datos de Corales del Viento completos", isinstance(body, dict) and body.get("slug") == "corales-del-viento")
corales_id = body.get("id") if isinstance(body, dict) else None

code, body = request(f"{BASE_URL}/public/properties?projectId={corales_id}&page=0&size=10")
test("GET /public/properties (Lotes de Corales del Viento) retorna 200", code == 200, f"code={code}")
test("Lotes devueltos con paginación", isinstance(body, dict) and "content" in body)

# Registro de Lead público
test_lead_name = f"QA Test User {uuid.uuid4().hex[:6]}"
code, body = request(f"{BASE_URL}/public/leads", method="POST", data={
    "fullName": test_lead_name,
    "email": "testqa@aaasas.com",
    "phone": "3001234567",
    "message": "Mensaje de prueba automatizada",
    "dataConsent": True,
    "projectId": corales_id
})
test("POST /public/leads registra nuevo prospecto (201)", code == 201, f"code={code}")

# 4. Dashboard Stats en tiempo real
print("\n--- 4. Dashboard Stats (Datos Reales de Base de Datos) ---")
code, body = request(f"{BASE_URL}/admin/dashboard/stats", headers=auth_headers)
test("GET /admin/dashboard/stats retorna 200", code == 200, f"code={code}")
test("Estadísticas contienen activeProjects, availableLots, soldLots, newLeads", 
     isinstance(body, dict) and all(k in body for k in ["activeProjects", "availableLots", "soldLots", "newLeads"]),
     f"body={body}")
if isinstance(body, dict):
    print(f"      -> Datos reales en BD: Proyectos={body.get('activeProjects')}, Disponibles={body.get('availableLots')}, Vendidos={body.get('soldLots')}, Leads={body.get('newLeads')}")

# 5. CRUD de Proyectos (Admin)
print("\n--- 5. Flujo CRUD Completo: Proyecto (Admin) ---")
proj_name = f"Proyecto QA Test {uuid.uuid4().hex[:6]}"
code, body = request(f"{BASE_URL}/admin/projects", method="POST", headers=auth_headers, data={
    "name": proj_name,
    "shortDescription": "Proyecto creado durante test de funcionalidad",
    "longDescription": "Descripción larga de prueba para verificación exhaustiva",
    "status": "EN_VENTA",
    "minPrice": 50000000,
    "maxPrice": 120000000,
    "featured": False,
    "published": True
})
test("Crear proyecto POST /admin/projects (201)", code == 201, f"code={code}")
test_proj_id = body.get("id") if isinstance(body, dict) else None
test("ID de proyecto generado", test_proj_id is not None)

# Obtener proyecto creado
code, body = request(f"{BASE_URL}/admin/projects/{test_proj_id}", headers=auth_headers)
test("Obtener proyecto creado GET /admin/projects/{id} (200)", code == 200, f"code={code}")

# Actualizar proyecto
code, body = request(f"{BASE_URL}/admin/projects/{test_proj_id}", method="PUT", headers=auth_headers, data={
    "name": f"{proj_name} - Editado",
    "shortDescription": "Descripción actualizada",
    "status": "EN_VENTA"
})
test("Actualizar proyecto PUT /admin/projects/{id} (200)", code == 200, f"code={code}")

# 6. CRUD de Lotes / Propiedades (Admin)
print("\n--- 6. Flujo CRUD Completo: Lote / Inmueble (Admin) ---")
lot_name = f"Lote Test-{uuid.uuid4().hex[:4]}"
code, body = request(f"{BASE_URL}/admin/properties", method="POST", headers=auth_headers, data={
    "projectId": test_proj_id,
    "name": lot_name,
    "type": "LOTE",
    "builtArea": 180.5,
    "price": 65000000,
    "status": "DISPONIBLE"
})
test("Crear lote POST /admin/properties (201)", code == 201, f"code={code}")
test_lot_id = body.get("id") if isinstance(body, dict) else None
test("ID de lote generado", test_lot_id is not None)

# Actualizar estado de lote a VENDIDO
code, body = request(f"{BASE_URL}/admin/properties/{test_lot_id}", method="PUT", headers=auth_headers, data={
    "projectId": test_proj_id,
    "name": lot_name,
    "type": "LOTE",
    "status": "VENDIDO",
    "price": 70000000
})
test("Actualizar lote PUT /admin/properties/{id} a VENDIDO (200)", code == 200, f"code={code}")

# Eliminar lote
code, _ = request(f"{BASE_URL}/admin/properties/{test_lot_id}", method="DELETE", headers=auth_headers)
test("Eliminar lote DELETE /admin/properties/{id} (204)", code == 204, f"code={code}")

# 7. Subida de Medios y Validación
print("\n--- 7. Subida y Eliminación de Multimedia (Admin) ---")
# Intentar subir tipo inválido
boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
raw_file_content = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"

multipart_data = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="file"; filename="test.png"\r\n'
    f"Content-Type: image/png\r\n\r\n"
).encode("utf-8") + raw_file_content + (
    f"\r\n--{boundary}\r\n"
    f'Content-Disposition: form-data; name="mediaType"\r\n\r\n'
    f"GALLERY_IMAGE\r\n"
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="entityType"\r\n\r\n'
    f"PROJECT\r\n"
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="entityId"\r\n\r\n'
    f"{test_proj_id}\r\n"
    f"--{boundary}--\r\n"
).encode("utf-8")

headers_mp = {
    "Authorization": f"Bearer {token}",
    "Content-Type": f"multipart/form-data; boundary={boundary}"
}

code, body = request(f"{BASE_URL}/admin/media", method="POST", headers=headers_mp, data=multipart_data)
test("Subir imagen POST /admin/media (201)", code == 201, f"code={code}")
test_media_id = body.get("id") if isinstance(body, dict) else None

if test_media_id:
    # Eliminar medio subido
    code, _ = request(f"{BASE_URL}/admin/media/{test_media_id}", method="DELETE", headers=auth_headers)
    test("Eliminar imagen DELETE /admin/media/{id} (204)", code == 204, f"code={code}")

# 8. Limpieza de Proyecto de Prueba
print("\n--- 8. Eliminación y Soft Delete de Proyecto ---")
code, _ = request(f"{BASE_URL}/admin/projects/{test_proj_id}", method="DELETE", headers=auth_headers)
test("Eliminar proyecto de prueba DELETE /admin/projects/{id} (204)", code == 204, f"code={code}")

# 9. Leads (CRM)
print("\n--- 9. Gestión de Leads (CRM Admin) ---")
code, body = request(f"{BASE_URL}/admin/leads?page=0&size=10", headers=auth_headers)
test("Listar leads GET /admin/leads (200)", code == 200, f"code={code}")
test("Lista contiene el lead creado en pruebas", 
     isinstance(body, dict) and any(l.get("fullName") == test_lead_name for l in body.get("content", [])))

print("\n" + "="*70)
print(f"  RESULTADO FINAL: {passed} PASADAS | {failed} FALLIDAS")
print("="*70 + "\n")

if failed > 0:
    sys.exit(1)
sys.exit(0)
