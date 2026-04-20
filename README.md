# Analizador de Texto

Una aplicación web construida con Node.js + Express que realiza análisis de texto en tiempo real. Escribe o pega texto en la interfaz y obtén al instante conteos de palabras, tiempo estimado de lectura y análisis de frecuencia de palabras.

## Características

- Conteo de caracteres, palabras, oraciones y párrafos
- Tiempo estimado de lectura (palabras por minuto configurable)
- Análisis de las palabras más frecuentes (filtra palabras vacías en español e inglés)
- Estadísticas actualizadas en tiempo real mientras escribes (300ms de debounce)
- Diseño responsivo, compatible con dispositivos móviles

## Stack tecnológico

- **Backend:** Node.js >= 20, Express 4.21.1
- **Frontend:** HTML5, JavaScript puro, CSS3 (sin frameworks)

## Inicio rápido

### Local

```bash
npm install
npm start
```

El servidor corre en `http://localhost:8080` por defecto.

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `PORT` | `8080` | Puerto del servidor |
| `APP_VERSION` | `1.0.0` | Versión de la aplicación |
| `WORDS_PER_MINUTE` | `200` | Velocidad de lectura para estimar tiempos |
| `TOP_WORDS_COUNT` | `5` | Número de palabras frecuentes a mostrar |
| `NODE_ENV` | `production` | Entorno de Node |

## API

### `POST /api/analyze`

Analiza un bloque de texto.

**Solicitud:**
```json
{ "text": "Tu texto aquí..." }
```

**Respuesta:**
```json
{
  "characters": 18,
  "characters_no_spaces": 15,
  "words": 3,
  "sentences": 1,
  "paragraphs": 1,
  "reading_time_minutes": 0.015,
  "reading_time_seconds": 1,
  "top_words": [{ "word": "texto", "count": 1 }]
}
```

### `GET /api/config`

Devuelve la configuración actual de la aplicación (`app_version`, `words_per_minute`, `top_words_count`).

### `GET /health`

Health check — devuelve `{ "status": "healthy" }`.

## Estructura del proyecto

```
ejemplo-text-analyzer/
├── app.js          # Servidor Express y lógica de análisis de texto
├── package.json
└── public/
    └── index.html  # Frontend de una sola página (HTML + CSS + JS)
```
