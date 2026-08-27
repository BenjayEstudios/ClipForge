# Perfil de edición Benjiwi v1

Este documento convierte observaciones extraídas del proyecto de referencia `BENJIWI REAL.veg` en reglas de producto para ClipForge. No intenta abrir ni reproducir el proyecto de VEGAS; funciona como una especificación de estilo.

## Patrones observados

- Proyecto vertical orientado a contenido corto.
- Uso frecuente de **Titles & Text** de VEGAS para mensajes y pasos.
- Textos de énfasis y estructura como `paso 1`, `paso 2`, `paso 3` y `50/50`.
- Biblioteca de SFX con categorías de **Impact** y **Risers**.
- Uso de transiciones/efectos de movimiento y daño digital.
- Presencia de freeze frames y composición adicional en segmentos concretos.

## Cómo lo traduce ClipForge

1. El **Auto Edit** prioriza cortes limpios y pausas largas revisables.
2. Los textos son objetos independientes en la timeline y se editan desde Inspector.
3. Los efectos agresivos se representan como futuras capas/markers de estilo, nunca como cambios destructivos sobre el video original.
4. Música y SFX viven en pistas separadas para poder mezclar, mover y silenciar independientemente.
5. La revisión ocurre en la timeline antes del render final.

## Reglas de UX

- Todo cambio importante debe poder deshacerse.
- Arrastrar debe ser la interacción principal para mover clips.
- `Shift` permite movimiento de precisión sin snap.
- `Esc` cancela un arrastre.
- Clic derecho muestra acciones contextuales.
- El preview debe representar 9:16 y respetar el encuadre sin deformar el material.

## Próximas extensiones

- Punch-in automático por frase/énfasis.
- Markers de impacto y riser.
- Freeze-frame editable.
- Presets de texto de énfasis.
- Subtítulos automáticos con palabras destacadas.
- Ducking de música guiado por voz.
