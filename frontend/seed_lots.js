const projectId = "8b6c778a-7393-415d-9bb2-ba01dcdf6a41";
const email = "andresbermu211@gmail.com";
const password = "Andres22*";

const csvData = `lote,estado,area_m2,valor_cop
1,vendido,167.51,
2,vendido,151.65,
3,disponible,196.27,51030200
4,disponible,195.34,50788400
5,vendido,168.57,
6,vendido,164.25,
7,vendido,164.31,
8,vendido,177.46,
9,vendido,198.99,
10,vendido,166.89,
11,vendido,163.96,
12,vendido,152.49,
13,vendido,139.60,
14,vendido,194.49,
15,vendido,167.59,
16,vendido,166.99,
17,vendido,140,
18,vendido,144.61,
19,vendido,165.30,
20,vendido,168,
21,vendido,166.99,
22,vendido,140,
23,vendido,147,
24,vendido,179.34,
25,vendido,140,
26,vendido,137.64,
27,vendido,146.59,
28,vendido,146.86,
29,vendido,150,
30,vendido,140,
31,vendido,138.27,
32,vendido,145.32,
33,vendido,148.83,
34,vendido,205.64,
35,vendido,182.04,
36,vendido,144.19,
37,vendido,156.01,
38,vendido,189.00,
39,vendido,167.81,
40,vendido,144.31,
41,vendido,159.01,
42,vendido,148.47,
43,vendido,203,
44,vendido,,
45,vendido,,
46,vendido,234.63,
47,disponible,212.54,55260400
48,disponible,193.10,50206000
49,disponible,196.62,51121200
50,vendido,177.44,
51,disponible,186.32,48443200
52,disponible,253.17,65824200
53,disponible,377.88,98248800
54,disponible,405,105300000
55,vendido,228.67,
56,vendido,,
57,vendido,235.28,
58,vendido,265.09,
59,vendido,278.41,
60,disponible,294.46,76559600
61,vendido,303.79,
62,vendido,303.58,
63,disponible,257.08,66840800
64,vendido,259.70,
65,vendido,504.34,
66,disponible,432.19,112369400`;

async function seed() {
  console.log("Iniciando login...");
  const loginRes = await fetch("http://localhost:8080/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  
  if (!loginRes.ok) {
    console.error("Fallo el login", await loginRes.text());
    return;
  }
  
  const { token, accessToken } = await loginRes.json();
  const authToken = accessToken || token;
  console.log("Login exitoso.");

  // Paso 1: Eliminar lotes existentes para el proyecto Corales del Viento
  console.log("Buscando lotes existentes...");
  const getRes = await fetch(`http://localhost:8080/api/v1/public/properties?projectId=${projectId}&page=0&size=1000`);
  if (getRes.ok) {
    const data = await getRes.json();
    if (data.content && data.content.length > 0) {
      console.log(`Eliminando ${data.content.length} lotes existentes...`);
      for (const prop of data.content) {
        await fetch(`http://localhost:8080/api/v1/admin/properties/${prop.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${authToken}` }
        });
      }
    }
  }

  console.log("Insertando 66 lotes reales...");
  const lines = csvData.trim().split("\n").slice(1); // skip header
  for (const line of lines) {
    const [num, est, area, valor] = line.split(",");
    
    // Convert estado to enum format
    let status = "DISPONIBLE";
    if (est === "vendido") status = "VENDIDO";
    else if (est === "separado") status = "SEPARADO";
    
    const lotData = {
      projectId,
      name: `Lote ${num}`,
      type: "LOTE",
      status: status,
      privateArea: area ? parseFloat(area) : null,
      price: valor ? parseFloat(valor) : null,
      floorOrTower: "Corales del Viento",
    };

    const res = await fetch("http://localhost:8080/api/v1/admin/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(lotData)
    });

    if (res.ok) {
      console.log(`Lote ${num} creado con éxito.`);
    } else {
      console.error(`Error creando Lote ${num}:`, await res.text());
    }
  }
  
  console.log("Seed completado.");
}

seed();
