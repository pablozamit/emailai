# AI Email Copywriter: Manual de Usuario y Funcionamiento

Bienvenido al AI Email Copywriter, una herramienta sofisticada diseñada para generar newsletters de alta calidad utilizando un modelo de IA avanzado. Esta aplicación no es un simple generador de texto; es un completo panel de control creativo que te permite dirigir a la IA con la precisión de un copywriter experto, aprendiendo de tu feedback para mejorar con cada uso.

## ✨ Características Principales

- **Generación por IA Avanzada**: Utiliza el modelo `gemini-2.5-flash` de Google para crear cuerpos y asuntos de email coherentes y persuasivos.
- **Panel de Control Creativo**: Múltiples controles granulares para moldear el resultado final, desde la estrategia narrativa hasta el tono y las fórmulas de copywriting.
- **Mecanismo de Auto-entrenamiento**: La IA aprende de tus puntuaciones (rating de 1-5 estrellas) y comentarios de texto para afinar y mejorar las futuras generaciones de emails.
- **Flujo de Trabajo Estratégico**: La interfaz está organizada para seguir el proceso mental de un copywriter, separando la estrategia, la audiencia, el contenido y el estilo.
- **Sugerencias Inteligentes**: Cada campo de texto cuenta con un botón de "varita mágica" para obtener sugerencias creativas de la IA basadas en el contexto que ya has proporcionado.
- **Gestión de Contenido Dinámico**:
    - **Bloqueo de Campos**: Fija cualquier instrucción que te guste para que no se altere en futuras generaciones o al generar ejemplos.
    - **Subida de Imágenes**: Sube tus propias imágenes para que la IA las inserte en el lugar más apropiado del texto.
    - **Referencias de Servicios Configurables**: Añade o elimina dinámicamente servicios o productos para que la IA los mencione de forma natural en el email.
- **Generador de Ejemplos**: Un botón para rellenar automáticamente todos los campos no bloqueados con un caso de uso realista y generar un email de muestra al instante.

---

## 🚀 Cómo Funciona: El Flujo de Trabajo

El objetivo de la aplicación es permitirte "pensar como un copywriter" y traducir esa estrategia en instrucciones precisas para la IA. El flujo está organizado de manera lógica y secuencial.

### 1. El Panel de Control

Es el centro de operaciones. Se divide en tarjetas, cada una representando una parte del brief creativo.

#### Sección 1: Estrategia Central
Aquí se define el núcleo del email.

- **Tema o Premisa del Email**: **Este es el campo más importante.** No se trata solo del "tópico" (ej: "vender curso"), sino de la **estrategia narrativa o el ángulo creativo**.
  - *Mal ejemplo*: "Lanzamiento del curso X".
  - *Buen ejemplo*: "Usar un testimonio potente para justificar una inminente subida de precio y crear urgencia".
  - *Buen ejemplo*: "Contar mi mayor fracaso profesional para introducir mi nuevo servicio de consultoría".
- **Objetivo del Email**: ¿Qué acción específica quieres que realice el lector? (Ej: "Que se apunten a un webinar", "Que compren el producto con descuento").

#### Sección 2: Audiencia
Define a quién le estás hablando.

- **Avatar del Cliente**: Describe a tu lector ideal.
- **Dolores del Avatar**: ¿Qué problemas, miedos o frustraciones tiene tu avatar que tu email puede resolver?

#### Sección 3: Contenido Principal (Opcional)
Los bloques de construcción del email.

- **Detalles a Incluir**: Información factual que debe aparecer sí o sí (fechas, precios, características específicas).
- **Anécdota**: Una historia personal o relevante para conectar emocionalmente.
- **Testimonio**: Prueba social para generar confianza.
- **Imagen**: Tienes dos opciones:
    1.  **Dejar que la IA sugiera**: La IA decidirá dónde colocar una sugerencia de imagen.
    2.  **Subir tu propia imagen**: Se mostrará una vista previa y la IA recibirá instrucciones para insertar un marcador `[IMAGEN: nombre_de_tu_archivo.jpg]` en el lugar más apropiado.

#### Sección 4: Cierre y Conversión
Aquí se define la parte final del email.

- **CTA y Link**: El texto del botón o enlace final.
- **Referencias de Servicios (Opcional)**: Una sección dinámica donde puedes añadir múltiples servicios. Para cada uno, defines un título, descripción, link y si está activo. La IA los mencionará de forma natural si encaja en el texto.
- **Postdata (Opcional)**: Un último gancho o recordatorio.

#### Sección 5: Voz y Estilo
La personalidad del email.

- **Tono y Voz**: Describe la personalidad de quien escribe.
- **Ejemplos de Tono**: Pega aquí frases o párrafos de emails anteriores que capturen tu voz. Puedes pegar directamente desde Google Docs.
- **Negative Prompt**: Instrucciones claras de lo que la IA **no** debe hacer (ej: "No usar un tono formal", "No usar emojis").

#### Sección 6: Ajustes Finos para la IA
El ajuste técnico y creativo.

- **Principio de Copywriting**: Un campo de texto libre donde describes el enfoque psicológico clave que la IA deberá priorizar (ej: "Crear un sentimiento de pertenencia a un grupo exclusivo", "Usar la prueba social mostrando cuánta gente ya se ha apuntado").
- **Fórmulas (Panel DJ)**: Un mezclador donde ajustas la "intensidad" (de 0 a 10) de 10 fórmulas de copywriting clásicas (AIDA, PAS, Storytelling, etc.). Esto permite a la IA saber qué estructuras priorizar.
- **Longitud**: Define si el email será corto, normal o largo, y ajusta la longitud media de los párrafos con un slider.
- **Asunto**: Elige las técnicas que la IA debe usar para crear el asunto (Intriga, Dolor, Actualidad, etc.).

### 2. Panel de Acciones

Ubicado a la derecha, contiene los controles para generar y gestionar la salida.

- **Número de emails**: Cuántas variantes quieres que genere la IA (de 1 a 5).
- **Generar**: Inicia el proceso de creación.
- **Generar Ejemplo**: Un atajo increíblemente útil. Rellena todos los campos no bloqueados con un ejemplo práctico y lanza la generación para que veas la app en acción.

### 3. Resultados y Feedback (El Aprendizaje)

Una vez generados, los emails aparecen a la derecha.

- **Cada email generado es una tarjeta individual.** Puedes copiar el asunto, el cuerpo o todo el email con un solo clic.
- **Sistema de Feedback**: Debajo de cada email, puedes puntuarlo de 1 a 5 estrellas y dejar un comentario de texto.
  - **¿Cómo aprende la IA?**: Este feedback no se pierde. Cada vez que generas nuevos emails, todo tu historial de puntuaciones y comentarios se envía a la IA como parte del prompt. Se le instruye explícitamente: "Has generado emails para mí antes. Aquí está el feedback que recibiste. Aprende de él y no cometas los mismos errores. Mejora el resultado basándote en lo que me gustó y lo que no". Este ciclo de feedback es lo que hace que la herramienta sea "auto-entrenada".

---

## 🛠️ Stack Técnico y Configuración

- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **Motor de IA**: Google Gemini API (`gemini-2.5-flash`).
- **Entorno**: La aplicación funciona directamente en el navegador sin necesidad de un paso de compilación (build), utilizando `importmap` para la gestión de módulos.

### Cómo ejecutar la aplicación localmente

1.  **Clonar el repositorio.**
2.  **Configurar la API Key**:
    - La aplicación está configurada para obtener la clave de la API de Google Gemini de una variable de entorno llamada `process.env.API_KEY`.
    - En un entorno de desarrollo o producción real, esta variable debe estar configurada en el servidor o en el sistema donde se ejecuta la aplicación.
3.  **Servir los archivos**:
    - Al no haber un proceso de `build`, simplemente necesitas servir el directorio raíz con un servidor local. La forma más sencilla es usando `npx`:
      ```bash
      # Navega a la carpeta del proyecto en tu terminal
      cd /ruta/a/tu/proyecto

      # Ejecuta un servidor local
      npx serve
      ```
    - Abre la URL que te proporciona `serve` (normalmente `http://localhost:3000`) en tu navegador.
