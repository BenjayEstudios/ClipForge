# ClipForge — QA Intensivo 1000 Bucles

Este documento define 1000 micro-revisiones reproducibles. Cada bucle revisa exactamente un criterio. Se ejecutan como checklist de producto sobre la implementación actual; no implica que cada criterio tenga cobertura automatizada.

## Bucle 001–100 · Timeline y navegación

001. Revisar que el playhead pueda moverse por clic en la regla.
002. Revisar que el playhead pueda arrastrarse continuamente.
003. Revisar que el playhead nunca salga del rango del proyecto.
004. Revisar que el timecode refleje el playhead.
005. Revisar que la barra de progreso use el mismo reloj que la timeline.
006. Revisar que Espacio reproduzca/pausa.
007. Revisar que Home vaya al inicio.
008. Revisar que End vaya al final.
009. Revisar que Flecha Izquierda avance hacia atrás con precisión.
010. Revisar que Flecha Derecha avance hacia delante con precisión.
011. Revisar que Shift+flecha use un paso de mayor precisión.
012. Revisar que el scroll horizontal no mueva el tiempo del proyecto.
013. Revisar que el zoom de timeline no altere la duración.
014. Revisar que el snap respete el playhead.
015. Revisar que el snap respete bordes de clips.
016. Revisar que Shift pueda omitir snap.
017. Revisar que un clic en una pista vacía busque ese tiempo.
018. Revisar que un doble clic no cambie accidentalmente la selección.
019. Revisar que el playhead sea visible sobre todas las pistas.
020. Revisar que el playhead se actualice durante reproducción.
021. Revisar que el transporte muestre Reproducir al detenerse.
022. Revisar que el transporte muestre Pausar al reproducir.
023. Revisar que no existan dos botones de reproducción competidores.
024. Revisar que el final del proyecto detenga reproducción.
025. Revisar que reiniciar no cree un segundo request de reproducción.
026. Revisar que el seeking durante pausa sea inmediato.
027. Revisar que el seeking durante reproducción sea estable.
028. Revisar que el tiempo mostrado soporte centésimas.
029. Revisar que el tiempo mostrado sea legible en ventana pequeña.
030. Revisar que el playhead sobreviva al redibujado de timeline.
031. Revisar que la timeline no desaparezca al importar.
032. Revisar que los clips aparezcan en su pista.
033. Revisar que los clips respeten start/end.
034. Revisar que no existan clips con duración negativa.
035. Revisar que un clip de 0.01 s siga siendo visible.
036. Revisar que los handles de trim sean accionables.
037. Revisar que el trim izquierdo conserve el contenido fuente.
038. Revisar que el trim derecho conserve el contenido fuente.
039. Revisar que mover un clip conserve duración.
040. Revisar que mover un clip conserve sourceStart/sourceEnd.
041. Revisar que dividir genere dos clips válidos.
042. Revisar que dividir no duplique contenido.
043. Revisar que dividir respete el playhead.
044. Revisar que dividir conserve la pista.
045. Revisar que dividir conserve volumen de audio.
046. Revisar que dividir conserve texto.
047. Revisar que eliminar respete la selección.
048. Revisar que Delete no borre una entrada de formulario.
049. Revisar que undo revierta una edición de timeline.
050. Revisar que redo restaure una edición de timeline.
051. Revisar que la selección múltiple sea visual.
052. Revisar que Ctrl+clic agregue selección.
053. Revisar que Ctrl+clic quite selección.
054. Revisar que la selección múltiple se conserve al redibujar.
055. Revisar que mover varios clips conserve relaciones temporales.
056. Revisar que ripple desplace clips posteriores.
057. Revisar que ripple no cambie la duración de clips desplazados.
058. Revisar que ripple respete el límite 0.
059. Revisar que ripple respete el final del proyecto.
060. Revisar que ripple no toque clips bloqueados.
061. Revisar que una pista bloqueada rechace drops.
062. Revisar que una pista bloqueada rechace movimiento.
063. Revisar que una pista bloqueada pueda reproducirse.
064. Revisar que mute no elimine el clip.
065. Revisar que solo no mutee pistas visuales.
066. Revisar que solo afecte pistas de audio.
067. Revisar que colapsar una pista no borre clips.
068. Revisar que expandir una pista conserve su altura.
069. Revisar que altura pequeña funcione.
070. Revisar que altura normal funcione.
071. Revisar que altura grande funcione.
072. Revisar que reordenar pista conserve clips.
073. Revisar que reordenar pista conserve trackId.
074. Revisar que color de pista sea estable.
075. Revisar que nombre de pista no se pierda.
076. Revisar que contador de clips sea correcto.
077. Revisar que crear pista nueva no cree IDs duplicados.
078. Revisar que eliminar pista reubique clips.
079. Revisar que no se pueda eliminar la última pista válida de un tipo.
080. Revisar que menú contextual de pista funcione fuera de un clip.
081. Revisar que menú contextual de clip tenga acciones del tipo correcto.
082. Revisar que un clic derecho no dispare selección accidental.
083. Revisar que menú se cierre al hacer clic fuera.
084. Revisar que menú se mantenga dentro de la ventana.
085. Revisar que Escape cierre menús.
086. Revisar que marcadores puedan añadirse con M.
087. Revisar que marcadores sean clicables.
088. Revisar que marcadores respeten orden temporal.
089. Revisar que marcador no se duplique por pulsación repetida inesperada.
090. Revisar que la pista de silencio no cubra los clips.
091. Revisar que las pausas estén alineadas al tiempo real.
092. Revisar que mantener/eliminar pausa sea reversible.
093. Revisar que modo Editado salte solo pausas marcadas.
094. Revisar que modo Original no altere reproducción.
095. Revisar que la navegación a una pausa sea exacta.
096. Revisar que zoom grande permita precisión.
097. Revisar que zoom pequeño permita visión global.
098. Revisar que la regla no se desplace verticalmente de forma extraña.
099. Revisar que la timeline mantenga fondo estable.
100. Revisar que no existan filas legacy visibles superpuestas.

## Bucle 101–200 · Multimedia e importación

101. Revisar importación de MP4.
102. Revisar importación de MOV.
103. Revisar importación de WebM.
104. Revisar importación de MP3.
105. Revisar importación de WAV.
106. Revisar importación de M4A.
107. Revisar importación de imagen JPG.
108. Revisar importación de imagen PNG.
109. Revisar importación de imagen WebP.
110. Revisar que video con audio cree VIDEO + AUDIO.
111. Revisar que audio de video conserve duración.
112. Revisar que audio de video use sourceId correcto.
113. Revisar que video importado aparezca en Multimedia.
114. Revisar que audio extraído aparezca en Multimedia.
115. Revisar que imagen aparezca en Multimedia.
116. Revisar que drag desde Multimedia cree clip.
117. Revisar que drop de audio vaya a pista de audio.
118. Revisar que drop de imagen vaya a pista de imagen.
119. Revisar que drop de video vaya a pista de video.
120. Revisar que drop sobre pista incorrecta sea rechazado o corregido.
121. Revisar feedback visual durante drag.
122. Revisar cursor grab.
123. Revisar cursor grabbing.
124. Revisar que Escape cancele drag.
125. Revisar que Shift permita precisión durante drag.
126. Revisar que drop respete el punto temporal.
127. Revisar que drop no genere clip negativo.
128. Revisar que drop no supere la duración sin intención.
129. Revisar que importar no bloquee la UI.
130. Revisar que se pueda importar mientras se visualiza otro recurso.
131. Revisar que recursos tengan nombre estable.
132. Revisar que IDs de media sean únicos.
133. Revisar que rutas inválidas sean reportadas.
134. Revisar que error de lectura sea visible.
135. Revisar que el progreso de importación sea visible cuando aplique.
136. Revisar que importación no vuelva a subir el mismo archivo innecesariamente.
137. Revisar que la app no pierda la ruta local del recurso inmediatamente.
138. Revisar que archivos grandes no congelen el render.
139. Revisar que 4K pueda importarse sin bloquear la UI.
140. Revisar que alta tasa de bits pueda importarse.
141. Revisar que audio multicanal no rompa metadata básica.
142. Revisar que framerate variable no rompa duración.
143. Revisar que orientación metadata no deforme preview.
144. Revisar que video vertical mantenga composición.
145. Revisar que video horizontal tenga crop controlado.
146. Revisar que video cuadrado se visualice correctamente.
147. Revisar que imagen mantenga relación de aspecto.
148. Revisar que texto importado o creado no dependa de media.
149. Revisar que duplicar media no duplique el archivo físico sin necesidad.
150. Revisar que eliminar media no rompa clips existentes.
151. Revisar que media usada en clip permanezca disponible.
152. Revisar que Multimedia soporte muchos recursos.
153. Revisar que filtros no cambien la data.
154. Revisar que tabs mantengan estado.
155. Revisar que la biblioteca pueda colapsarse.
156. Revisar que Inspector pueda colapsarse.
157. Revisar que tamaños de panel sean persistentes.
158. Revisar que layout sobreviva al reinicio.
159. Revisar que ventana normal siga usable.
160. Revisar que 1120 px de ancho siga siendo funcional.
161. Revisar que 1280 px de ancho aproveche el espacio.
162. Revisar que la altura baja preserve timeline.
163. Revisar que el preview no invada la timeline.
164. Revisar que el panel multimedia no aplaste el preview.
165. Revisar que Inspector no aplaste el preview.
166. Revisar que scroll del panel no mueva la timeline.
167. Revisar que scroll de timeline no mueva el preview.
168. Revisar que el foco de teclado sea predecible.
169. Revisar que Escape cierre drag y menús.
170. Revisar que Enter confirme renombrados.
171. Revisar que cancelar renombrado no cambie nombre.
172. Revisar que nombre largo tenga ellipsis.
173. Revisar que tooltip aparezca en controles ambiguos.
174. Revisar que estados disabled sean claros.
175. Revisar que botones activos sean distinguibles.
176. Revisar que la paleta oscura mantenga contraste.
177. Revisar que el texto secundario siga siendo legible.
178. Revisar que no haya emojis inconsistentes como iconografía principal.
179. Revisar que los iconos no cambien de tamaño por contenido.
180. Revisar que la barra superior no salte al importar.
181. Revisar que Media drag no cree un clip si el drop fue inválido.
182. Revisar que la fuente local siga funcionando tras reabrir proyecto.
183. Revisar que URL blob revocable no sea revocada demasiado pronto.
184. Revisar que revocar blob no mate el preview activo.
185. Revisar que cache no sirva JS viejo.
186. Revisar que query versioning se incremente cuando haya cambios.
187. Revisar que assets faltantes den error claro.
188. Revisar que editor-entry falle de forma visible si un módulo falta.
189. Revisar que no exista dependencia circular peligrosa entre módulos.
190. Revisar que MutationObserver no cree trabajo infinito.
191. Revisar que setInterval no crezca con cada reinicio.
192. Revisar que handlers no se dupliquen.
193. Revisar que un clip tenga un solo binding por acción.
194. Revisar que listeners de pointer se limpien.
195. Revisar que drag termine aunque salga fuera del elemento.
196. Revisar que window blur cancele drag.
197. Revisar que importar media actualice el contador.
198. Revisar que importar mantenga selección razonable.
199. Revisar que el recurso seleccionado sea identificable.
200. Revisar que la biblioteca siga usable con cientos de recursos.

## Bucle 201–300 · Preview y composición

201. Revisar que preview sea 9:16.
202. Revisar que preview no se estire.
203. Revisar que crop sea centrado por defecto.
204. Revisar que letterbox sea consistente.
205. Revisar que preview cargue primer frame.
206. Revisar que preview muestre frame correcto al seek.
207. Revisar que preview refleje clip activo.
208. Revisar que preview respete sourceStart.
209. Revisar que preview respete sourceEnd.
210. Revisar que split cambie preview.
211. Revisar que trim cambie preview.
212. Revisar que mover clip cambie preview.
213. Revisar que ripple cambie preview.
214. Revisar que imagen aparezca en preview.
215. Revisar que texto aparezca en preview.
216. Revisar que texto se pueda mover libremente.
217. Revisar que X/Y no salga del canvas por defecto.
218. Revisar que escala sea visible.
219. Revisar que opacidad sea visible.
220. Revisar que keyframes de posición interpolen.
221. Revisar que keyframes de escala interpolen.
222. Revisar que keyframes de opacidad interpolen.
223. Revisar que keyframes no reescriban incorrectamente datos base.
224. Revisar que Preview Original ignore edición temporal.
225. Revisar que Preview Editado aplique pausas eliminadas.
226. Revisar que Play use Preview Editado cuando corresponda.
227. Revisar que detener reproducción pause todos los audios.
228. Revisar que video y audio mantengan sync.
229. Revisar que sync no haga seeks excesivos.
230. Revisar que buffering sea tolerable.
231. Revisar que error de video sea visible.
232. Revisar que error de audio sea visible.
233. Revisar que preview no se quede negro sin diagnosticar.
234. Revisar que overlay de transición aparezca en el intervalo.
235. Revisar que Dissolve sea visual.
236. Revisar que Dip sea visual.
237. Revisar que Flash sea visual.
238. Revisar que transición tenga duración coherente.
239. Revisar que transición no ocupe tiempo negativo.
240. Revisar que transición entre clips sea editable.
241. Revisar que el Preview no recorte overlays por overflow incorrecto.
242. Revisar que texto quede por encima del video.
243. Revisar que texto conserve posición al cambiar tamaño de ventana.
244. Revisar que preview responda al resize de panel.
245. Revisar que el frame no salte por cambios de layout.
246. Revisar que toolbar no tape preview.
247. Revisar que timeline no tape preview.
248. Revisar que inspector no tape preview.
249. Revisar que control de calidad no deje overlay permanente molesto.
250. Revisar que Preview tenga indicador de modo.
251. Revisar que timecode sea preciso durante reproducción.
252. Revisar que el final de cada clip pueda visualizarse.
253. Revisar que el inicio de cada clip pueda visualizarse.
254. Revisar que navegar a marcador actualice preview.
255. Revisar que navegar a pausa actualice preview.
256. Revisar que doble clic sobre clip vaya a clip.
257. Revisar que click en timeline cambie preview sin reproducir.
258. Revisar que no haya reproducción automática accidental al importar.
259. Revisar que autoplay no viole políticas de audio del navegador.
260. Revisar que Audio se reanude tras interacción del usuario.
261. Revisar que master mute sea reversible.
262. Revisar que master volume afecte audio audible.
263. Revisar que volume de clip afecte audio audible.
264. Revisar que fade in sea perceptible.
265. Revisar que fade out sea perceptible.
266. Revisar que ducking sea perceptible cuando esté implementado.
267. Revisar que pistas muteadas no suenen.
268. Revisar que pista solo aislé audio.
269. Revisar que múltiples audios puedan reproducirse simultáneamente.
270. Revisar que no haya clipping visual del waveform.
271. Revisar que waveform siga longitud del clip.
272. Revisar que waveform sea distinta cuando la amplitud cambia.
273. Revisar que waveform pueda generarse en background.
274. Revisar que generar waveform no bloquee la UI.
275. Revisar que waveform cachee resultados.
276. Revisar que preview responda con muchos clips.
277. Revisar que 20 clips no degraden drásticamente.
278. Revisar que 100 clips no congelen la UI.
279. Revisar que selección múltiple no vuelva lento preview.
280. Revisar que MutationObserver no degrade preview.
281. Revisar que el monitor de preview tenga borde sutil.
282. Revisar que fondo del monitor sea oscuro.
283. Revisar que controles tengan estados hover.
284. Revisar que controles tengan estados focus.
285. Revisar que controles tengan estados active.
286. Revisar que preview sea usable a 100% DPI.
287. Revisar que preview sea usable a 125% DPI.
288. Revisar que preview sea usable a 150% DPI.
289. Revisar que preview no quede microscópico en 1280×720.
290. Revisar que preview no sea gigantesco en 1920×1080.
291. Revisar que el espacio central se use eficientemente.
292. Revisar que el timecode no choque con otros controles.
293. Revisar que el mixer no empuje el monitor fuera de lugar.
294. Revisar que el mixer pueda ocultarse si se desea.
295. Revisar que el preview muestre estado sin audio si falta fuente.
296. Revisar que los overlays no interfieran con interacción de transporte.
297. Revisar que el click de preview pueda definir playhead si se diseña así.
298. Revisar que el focus de preview no robe shortcuts indeseados.
299. Revisar que reinicio de editor limpie objetos transitorios.
300. Revisar que preview sea consistentemente determinista.

## Bucle 301–400 · Audio y mezcla

301. Revisar creación de AUDIO 1 al importar video.
302. Revisar sincronización de AUDIO 1 con VIDEO 1.
303. Revisar volumen inicial de voz original en 100%.
304. Revisar volumen inicial de música por defecto más bajo.
305. Revisar master volume.
306. Revisar master mute.
307. Revisar indicador de nivel.
308. Revisar mute por pista.
309. Revisar solo por pista.
310. Revisar volumen por clip.
311. Revisar fade in por clip.
312. Revisar fade out por clip.
313. Revisar que volumen sea persistente en proyecto.
314. Revisar que fade sea persistente en proyecto.
315. Revisar que clip de audio duplicado conserve volumen.
316. Revisar que recortar audio conserve volumen.
317. Revisar que dividir audio conserve volumen.
318. Revisar que audio externo pueda coexistir con voz.
319. Revisar que audio externo pueda ser video con audio.
320. Revisar extracción de audio desde video externo.
321. Revisar que audio externo no requiera pista de video.
322. Revisar que pista de audio pueda renombrarse.
323. Revisar que múltiples pistas de audio sean reproducibles.
324. Revisar que mute de una pista no afecte las demás.
325. Revisar que solo active una o más pistas explícitamente.
326. Revisar clip audio fuera de rango.
327. Revisar audio al inicio del proyecto.
328. Revisar audio al final del proyecto.
329. Revisar audio sobre silencio de voz.
330. Revisar ducking automático.
331. Revisar ducking con dos músicas.
332. Revisar sidechain estable.
333. Revisar que ducking no genere distorsión.
334. Revisar normalización de audio.
335. Revisar clipping y headroom.
336. Revisar paneo básico si está disponible.
337. Revisar EQ si está disponible.
338. Revisar buses si están disponibles.
339. Revisar routing consistente entre preview y render.
340. Revisar que reproducción use Audio API real.
341. Revisar que no existan fuentes silenciosas por accidente.
342. Revisar que autoplay policy sea manejada.
343. Revisar que usuario pueda iniciar audio con click.
344. Revisar que cambiar volumen durante reproducción sea inmediato.
345. Revisar que cambiar mute durante reproducción sea inmediato.
346. Revisar que cambiar solo durante reproducción sea inmediato.
347. Revisar que quitar clip de audio pause su player.
348. Revisar limpieza de players al eliminar clips.
349. Revisar que no haya memory leak por Audio objects.
350. Revisar que solo exista un player por clip.
351. Revisar que players no cambien de fuente sin necesidad.
352. Revisar que seek de audio sea preciso.
353. Revisar que scrubber siga audio y video.
354. Revisar que pausa deje audio donde corresponde.
355. Revisar que loop de reproducción no duplique sonido.
356. Revisar que fin de proyecto pause todos los players.
357. Revisar que proyecto sin audio siga reproduciéndose.
358. Revisar que audio roto muestre error.
359. Revisar que audio corrupto no tumbe editor.
360. Revisar que archivo grande no bloquee mixer.
361. Revisar que mixer sea usable en ventana pequeña.
362. Revisar que sliders tengan suficiente área de interacción.
363. Revisar que outputs muestren valor actual.
364. Revisar que 0% sea silencio real.
365. Revisar que 100% sea nivel completo sin NaN.
366. Revisar que valores mayores a 100% sean controlados.
367. Revisar que valores negativos sean controlados.
368. Revisar que NaN sea controlado.
369. Revisar que Infinity sea controlado.
370. Revisar que fades no superen duración.
371. Revisar que fade no genere duración negativa.
372. Revisar que el audio original no dependa del archivo duplicado incorrecto.
373. Revisar que sourceStart de audio sea respetado.
374. Revisar que sourceEnd de audio sea respetado.
375. Revisar que dos clips de la misma fuente puedan tener offsets distintos.
376. Revisar que transiciones de audio no maten voz.
377. Revisar que crossfade tenga curva razonable.
378. Revisar que waveform corresponda al archivo correcto.
379. Revisar que waveform no sea siempre igual.
380. Revisar que waveform se actualice si cambia fuente.
381. Revisar que waveform no se regenere en cada frame.
382. Revisar que waveform sea cacheable.
383. Revisar que analyzer de silencio no repita trabajo innecesario.
384. Revisar que análisis de silencio no bloquee interacción.
385. Revisar que pausas se vinculen a la voz correcta.
386. Revisar que voz original no sea silenciada al activar música.
387. Revisar que música no sea silenciosa por master mute accidental.
388. Revisar que labels de audio sean claros.
389. Revisar que mute/solo sean visibles.
390. Revisar que master se distinga de clip.
391. Revisar que medidor sea estable sin audio.
392. Revisar que medidor no mienta sobre peak real si se presenta como peak.
393. Revisar que el estado del mixer se persista.
394. Revisar que resetear mixer vuelva a valores válidos.
395. Revisar que undo cubra cambios de audio.
396. Revisar que redo cubra cambios de audio.
397. Revisar que eliminar audio preserve otros clips.
398. Revisar que duplicar audio no duplique players accidentalmente.
399. Revisar que proyecto con 20 pistas de audio siga estable.
400. Revisar que render de audio use mismo mix que preview.

## Bucle 401–500 · Texto y gráficos

401. Revisar creación de texto.
402. Revisar texto con caracteres especiales.
403. Revisar texto multilinea.
404. Revisar texto largo.
405. Revisar texto corto.
406. Revisar cambio de fuente si está disponible.
407. Revisar tamaño de texto.
408. Revisar color de texto.
409. Revisar negrita.
410. Revisar sombra.
411. Revisar posición X.
412. Revisar posición Y.
413. Revisar arrastre libre en preview.
414. Revisar límites del canvas.
415. Revisar duración del texto.
416. Revisar recorte de inicio del texto.
417. Revisar recorte de final del texto.
418. Revisar mover texto en timeline.
419. Revisar duplicar texto.
420. Revisar eliminar texto.
421. Revisar undo del texto.
422. Revisar redo del texto.
423. Revisar texto durante reproducción.
424. Revisar texto con cambio de playhead.
425. Revisar texto visible solo en su intervalo.
426. Revisar texto fuera de intervalo no visible.
427. Revisar selección de texto en timeline.
428. Revisar selección de texto en preview.
429. Revisar inspector contextual de texto.
430. Revisar keyframe de posición.
431. Revisar keyframe de escala.
432. Revisar keyframe de opacidad.
433. Revisar interpolación de posición.
434. Revisar interpolación de escala.
435. Revisar interpolación de opacidad.
436. Revisar keyframe en el mismo tiempo.
437. Revisar reemplazo de keyframe existente.
438. Revisar orden temporal de keyframes.
439. Revisar exportación de texto básico.
440. Revisar posición de texto en exportación.
441. Revisar escala de texto en exportación.
442. Revisar opacidad de texto en exportación.
443. Revisar fuente de fallback si Arial no existe.
444. Revisar ruta Windows a fuente.
445. Revisar escape de caracteres para drawtext.
446. Revisar emojis no compatibles con drawtext.
447. Revisar texto con dos puntos.
448. Revisar texto con comillas.
449. Revisar texto con porcentaje.
450. Revisar texto con barra invertida.
451. Revisar texto con salto de línea.
452. Revisar texto con acentos.
453. Revisar texto con ñ.
454. Revisar texto con símbolos monetarios.
455. Revisar alineación central.
456. Revisar texto superior.
457. Revisar texto central.
458. Revisar texto inferior.
459. Revisar texto con clip de imagen.
460. Revisar texto sobre dos videos.
461. Revisar texto sobre música.
462. Revisar texto durante transición.
463. Revisar texto en recorte de silencio.
464. Revisar texto al mover el clip padre.
465. Revisar texto al aplicar ripple.
466. Revisar texto dentro de selección múltiple.
467. Revisar duplicar texto con offset correcto.
468. Revisar drag del texto no mueve la ventana.
469. Revisar drag del texto no cambia tiempo accidentalmente.
470. Revisar pointerup fuera del preview.
471. Revisar cancelación de drag de texto.
472. Revisar que texto no quede perdido fuera de pantalla.
473. Revisar bounding box si se introduce.
474. Revisar handles de texto si se introduce.
475. Revisar presets de texto.
476. Revisar presets inspirados en el perfil Benjiwi.
477. Revisar numeración de pasos.
478. Revisar texto destacado.
479. Revisar CTA.
480. Revisar títulos cortos.
481. Revisar jerarquía de texto.
482. Revisar legibilidad sobre fondo claro.
483. Revisar legibilidad sobre fondo oscuro.
484. Revisar contraste suficiente.
485. Revisar sombra no excesiva.
486. Revisar ancho máximo de texto.
487. Revisar overflow controlado.
488. Revisar que inspector no se rompa con texto largo.
489. Revisar que edición inline sea estable.
490. Revisar Enter en textarea.
491. Revisar Escape en edición de texto.
492. Revisar foco de texto.
493. Revisar shortcuts mientras se edita texto.
494. Revisar que Delete no borre clip al editar texto.
495. Revisar guardar texto en proyecto.
496. Revisar abrir proyecto con texto.
497. Revisar exportar proyecto con texto.
498. Revisar múltiples textos simultáneos.
499. Revisar 100 textos sin crash.
500. Revisar que la composición visual siga siendo determinista.

## Bucle 501–600 · Auto Edit y estilo Benjiwi

501. Revisar entrada Auto Edit.
502. Revisar estado visible de Auto Edit.
503. Revisar análisis de silencio.
504. Revisar reuso del análisis existente.
505. Revisar que Auto Edit no vuelva a subir el video innecesariamente.
506. Revisar manejo de error de análisis.
507. Revisar feedback de progreso.
508. Revisar salida de segmentos.
509. Revisar continuidad temporal de segmentos.
510. Revisar que segmentos no se solapen por error.
511. Revisar que segmentos no dejen huecos no deseados cuando corresponda.
512. Revisar que pausas marcadas se respeten.
513. Revisar opción mantener pausas.
514. Revisar opción eliminar pausas.
515. Revisar presets de ritmo.
516. Revisar perfil Benjiwi.
517. Revisar cortes rápidos.
518. Revisar texto de énfasis.
519. Revisar pasos numerados.
520. Revisar punch-in sugerido.
521. Revisar impactos sugeridos.
522. Revisar risers sugeridos.
523. Revisar freeze frame sugerido.
524. Revisar transiciones sugeridas.
525. Revisar que sugerencias sean editables.
526. Revisar que Auto Edit deje el resultado en timeline.
527. Revisar que Auto Edit no exporte automáticamente.
528. Revisar que usuario pueda previsualizar antes de exportar.
529. Revisar que pueda deshacer Auto Edit.
530. Revisar que pueda rehacer Auto Edit.
531. Revisar que Auto Edit sea repetible.
532. Revisar que repetir Auto Edit no duplique clips.
533. Revisar que Auto Edit preserve audio separado.
534. Revisar que Auto Edit preserve textos manuales.
535. Revisar que Auto Edit preserve música manual.
536. Revisar que Auto Edit preserve pistas bloqueadas.
537. Revisar que Auto Edit respete markers.
538. Revisar que Auto Edit respete ripple seleccionado.
539. Revisar que Auto Edit muestre resumen.
540. Revisar número de cortes.
541. Revisar segundos eliminados.
542. Revisar duración final.
543. Revisar número de pausas.
544. Revisar sugerencias aplicadas.
545. Revisar sugerencias descartadas.
546. Revisar control granular de cada sugerencia.
547. Revisar nivel agresivo del ritmo.
548. Revisar modo limpio.
549. Revisar modo dinámico.
550. Revisar modo Benjiwi.
551. Revisar consistencia entre modo y timeline.
552. Revisar que Auto Edit respete relación de aspecto.
553. Revisar que no cree texto fuera del canvas.
554. Revisar que no cree audio negativo.
555. Revisar que no cree transiciones imposibles.
556. Revisar que clips pequeños no se rompan.
557. Revisar que silencios muy cortos no se eliminen indiscriminadamente.
558. Revisar umbral configurable.
559. Revisar duración mínima de clip.
560. Revisar protección de hook inicial.
561. Revisar protección de CTA final.
562. Revisar protección de texto existente.
563. Revisar protección de música.
564. Revisar que análisis pueda cancelarse si se implementa.
565. Revisar que Auto Edit no bloquee UI.
566. Revisar logs de Auto Edit.
567. Revisar diagnóstico de Auto Edit.
568. Revisar estado vacío.
569. Revisar Auto Edit sin audio.
570. Revisar Auto Edit con audio externo.
571. Revisar Auto Edit con voz separada.
572. Revisar Auto Edit con múltiples voces.
573. Revisar Auto Edit con video muy largo.
574. Revisar Auto Edit con video corto.
575. Revisar Auto Edit con pausas largas.
576. Revisar Auto Edit sin pausas.
577. Revisar Auto Edit con audio corrupto.
578. Revisar Auto Edit tras trim manual.
579. Revisar Auto Edit tras split manual.
580. Revisar Auto Edit tras mover clips.
581. Revisar Auto Edit tras importar música.
582. Revisar Auto Edit tras agregar texto.
583. Revisar Auto Edit después de reabrir proyecto.
584. Revisar consistencia del perfil Benjiwi.
585. Revisar documentación del perfil.
586. Revisar no copiar efectos propietarios literalmente.
587. Revisar que presets sean parámetros.
588. Revisar que presets sean reversibles.
589. Revisar que presets no escondan estado.
590. Revisar control de intensidad de estilo.
591. Revisar preview del estilo.
592. Revisar exportación del estilo.
593. Revisar timeline del estilo.
594. Revisar indicadores visuales de sugerencia.
595. Revisar aceptación individual.
596. Revisar aceptación masiva.
597. Revisar rechazo individual.
598. Revisar rechazo masivo.
599. Revisar historial de cambios Auto Edit.
600. Revisar que Auto Edit se comporte como modo de trabajo profesional.

## Bucle 601–700 · Render, FFmpeg y salida

601. Revisar render 1080×1920.
602. Revisar fps 30.
603. Revisar pix_fmt yuv420p.
604. Revisar AAC 192k.
605. Revisar audio 48 kHz.
606. Revisar 2 canales de salida.
607. Revisar faststart.
608. Revisar existencia de archivo final.
609. Revisar URL de salida.
610. Revisar manejo de error FFmpeg.
611. Revisar captura de stderr.
612. Revisar que no se silencie el error real.
613. Revisar render sin audio externo.
614. Revisar render con audio externo.
615. Revisar render con voz + música.
616. Revisar render con ducking.
617. Revisar render con fade.
618. Revisar render con texto.
619. Revisar render con múltiples textos.
620. Revisar render con cortes.
621. Revisar render con trims.
622. Revisar render con transición.
623. Revisar render con imagen.
624. Revisar render con múltiples pistas de video.
625. Revisar que el render refleje la timeline.
626. Revisar que ningún clip omitido se renderice.
627. Revisar que ningún clip visible falte del render.
628. Revisar que el orden de pistas sea correcto.
629. Revisar que audio respetado mute.
630. Revisar que audio respete solo.
631. Revisar que clips bloqueados sigan renderizándose.
632. Revisar que ripple cambie el render.
633. Revisar keyframe de posición en render.
634. Revisar keyframe de escala en render.
635. Revisar keyframe de opacidad en render.
636. Revisar transición al inicio.
637. Revisar transición al final.
638. Revisar transición entre clips.
639. Revisar recortes con sourceStart.
640. Revisar recortes con sourceEnd.
641. Revisar que sourceStart no sea reseteado erróneamente.
642. Revisar que sourceEnd no exceda fuente.
643. Revisar audio sourceStart.
644. Revisar audio sourceEnd.
645. Revisar clips muy cortos en concat.
646. Revisar clips muy largos en concat.
647. Revisar muchos segmentos.
648. Revisar muchos filtros.
649. Revisar escaping de filter_complex.
650. Revisar escaping de texto.
651. Revisar rutas con espacios.
652. Revisar rutas con caracteres especiales.
653. Revisar Windows Fonts.
654. Revisar FFmpeg detectado por env.
655. Revisar FFmpeg integrado en runtime.
656. Revisar fallback a rutas conocidas.
657. Revisar exportación sin FFmpeg.
658. Revisar mensaje si FFmpeg no existe.
659. Revisar proceso PHP durante render.
660. Revisar timeout en archivo grande.
661. Revisar render de 1 GB.
662. Revisar render de 4K fuente.
663. Revisar render de VFR.
664. Revisar render de HEVC.
665. Revisar render de H264.
666. Revisar audio AAC.
667. Revisar audio PCM.
668. Revisar audio MP3.
669. Revisar entrada MOV.
670. Revisar entrada MP4.
671. Revisar salida reproducible en reproductor estándar.
672. Revisar salida importable de nuevo.
673. Revisar duración de salida.
674. Revisar sincronía A/V final.
675. Revisar frame inicial.
676. Revisar frame final.
677. Revisar primer corte.
678. Revisar último corte.
679. Revisar transición de audio alrededor de cortes.
680. Revisar ausencia de clicks.
681. Revisar ausencia de frames negros accidentales.
682. Revisar ausencia de frames duplicados accidentales.
683. Revisar ausencia de audio duplicado.
684. Revisar ausencia de canales invertidos.
685. Revisar mezcla de volumen estable.
686. Revisar exportación con texto fuera de pantalla.
687. Revisar exportación con imagen fuera de pantalla.
688. Revisar exportación con transparencia si aplica.
689. Revisar exportación después de reabrir proyecto.
690. Revisar exportación con layout diferente.
691. Revisar que layout no afecte render.
692. Revisar cancelación si se implementa.
693. Revisar progreso real si se implementa.
694. Revisar estado de render en UI.
695. Revisar botón exportar durante render.
696. Revisar doble click exportar.
697. Revisar nombres de salida únicos.
698. Revisar limpieza de temporales.
699. Revisar almacenamiento de outputs.
700. Revisar que render sea un reflejo determinista de la composición.

## Bucle 701–800 · Electron, rendimiento y Windows

701. Revisar arranque Electron.
702. Revisar creación de ventana.
703. Revisar ventana centrada.
704. Revisar tamaño 1280×820 por defecto.
705. Revisar mínimo 1120×720.
706. Revisar persistencia de posición.
707. Revisar persistencia de tamaño.
708. Revisar maximizado/restaurado.
709. Revisar cerrar ventana.
710. Revisar relanzar ventana.
711. Revisar limpieza de PHP.
712. Revisar cierre de PHP al salir.
713. Revisar PHP stdout.
714. Revisar PHP stderr.
715. Revisar error de PHP.
716. Revisar puerto local libre.
717. Revisar conflicto de puerto.
718. Revisar root web.
719. Revisar modo empaquetado.
720. Revisar modo desarrollo.
721. Revisar detección de FFmpeg.
722. Revisar detección de PHP.
723. Revisar GPU feature status.
724. Revisar GPU rasterization.
725. Revisar zero-copy.
726. Revisar estabilidad con GPU deshabilitada.
727. Revisar estabilidad con GPU habilitada.
728. Revisar DevTools console logs.
729. Revisar console-message bridge.
730. Revisar error de carga de página.
731. Revisar render-process-gone.
732. Revisar crash recovery si aplica.
733. Revisar contexto aislado.
734. Revisar nodeIntegration false.
735. Revisar superficie IPC mínima.
736. Revisar acceso a filesystem restringido.
737. Revisar que el renderer no dependa de Node.
738. Revisar logs con prefijo ClipForge.
739. Revisar errores UI estructurados.
740. Revisar timeouts largos sin bloqueo.
741. Revisar CPU durante importación.
742. Revisar CPU durante thumbnails.
743. Revisar CPU durante waveform.
744. Revisar CPU durante análisis.
745. Revisar CPU durante reproducción.
746. Revisar CPU durante render.
747. Revisar memoria al importar.
748. Revisar memoria con muchas pistas.
749. Revisar memoria con muchos clips.
750. Revisar memoria con muchos players.
751. Revisar memory leak de timers.
752. Revisar memory leak de listeners.
753. Revisar memory leak de Audio objects.
754. Revisar memory leak de Blob URLs.
755. Revisar mutation observer overhead.
756. Revisar interval overhead.
757. Revisar requestAnimationFrame cleanup.
758. Revisar render timeline throttling.
759. Revisar inspector throttling.
760. Revisar preview seek throttling.
761. Revisar waveform throttling.
762. Revisar scroll suave.
763. Revisar drag fluido.
764. Revisar resize de panel fluido.
765. Revisar resize de ventana fluido.
766. Revisar densidad UI en 720p.
767. Revisar densidad UI en 1080p.
768. Revisar densidad UI en 1440p.
769. Revisar DPI 100%.
770. Revisar DPI 125%.
771. Revisar DPI 150%.
772. Revisar fuentes instaladas.
773. Revisar fallback de fuente UI.
774. Revisar scrollbar visible.
775. Revisar scrollbar oscura.
776. Revisar contraste UI.
777. Revisar focus visible.
778. Revisar navegación teclado.
779. Revisar botones accesibles.
780. Revisar tooltips.
781. Revisar cursor de drag.
782. Revisar cursor de trim.
783. Revisar cursor de resize.
784. Revisar estados de hover.
785. Revisar estados active.
786. Revisar estados disabled.
787. Revisar estados loading.
788. Revisar estados error.
789. Revisar estados success.
790. Revisar toasts no obstructivos.
791. Revisar toasts no duplicados.
792. Revisar modal de error.
793. Revisar que la app no dependa de fullscreen.
794. Revisar uso eficiente del ancho.
795. Revisar uso eficiente del alto.
796. Revisar colapsado de paneles.
797. Revisar persistencia de paneles.
798. Revisar persistencia de preferencias.
799. Revisar compatibilidad Windows 10/11 objetivo.
800. Revisar que el producto se sienta nativo de escritorio.

## Bucle 801–900 · Proyecto, persistencia y UX profesional

801. Revisar Nuevo proyecto.
802. Revisar proyecto vacío.
803. Revisar proyecto con video.
804. Revisar proyecto con video+audio.
805. Revisar proyecto con imagen.
806. Revisar proyecto con texto.
807. Revisar proyecto multicapa.
808. Revisar Guardar proyecto.
809. Revisar Abrir proyecto.
810. Revisar autosave si aplica.
811. Revisar snapshot consistente.
812. Revisar serialización de clips.
813. Revisar serialización de tracks.
814. Revisar serialización de textos.
815. Revisar serialización de markers.
816. Revisar serialización de keyframes.
817. Revisar serialización de audio settings.
818. Revisar serialización de layout.
819. Revisar serialización de ripple.
820. Revisar restauración de sourceId.
821. Revisar restauración de trackId.
822. Revisar restauración de sourceStart.
823. Revisar restauración de sourceEnd.
824. Revisar restauración de volumen.
825. Revisar restauración de fade.
826. Revisar restauración de texto.
827. Revisar restauración de posición.
828. Revisar restauración de escala.
829. Revisar restauración de opacidad.
830. Revisar restauración de transitions.
831. Revisar restauración de mute/solo.
832. Revisar restauración de collapsed.
833. Revisar restauración de colores.
834. Revisar restauración de markers.
835. Revisar proyecto con media ausente.
836. Revisar mensaje de media ausente.
837. Revisar reemplazo de media ausente.
838. Revisar proyecto corrupto.
839. Revisar JSON inválido.
840. Revisar versión de proyecto incompatible.
841. Revisar migración de esquema.
842. Revisar IDs estables.
843. Revisar historial de undo.
844. Revisar límite razonable de historial.
845. Revisar redo después de nueva acción.
846. Revisar undo después de drag.
847. Revisar undo después de trim.
848. Revisar undo después de split.
849. Revisar undo después de audio change.
850. Revisar undo después de text change.
851. Revisar undo después de transition.
852. Revisar undo después de track change.
853. Revisar UX de selección.
854. Revisar UX de multi-selección.
855. Revisar UX de arrastre.
856. Revisar UX de trim.
857. Revisar UX de snap.
858. Revisar UX de ripple.
859. Revisar UX de context menu.
860. Revisar UX de inspector.
861. Revisar UX de biblioteca.
862. Revisar UX de preview.
863. Revisar UX del mixer.
864. Revisar UX del export.
865. Revisar que los controles primarios sean obvios.
866. Revisar que los controles avanzados no saturen.
867. Revisar que el sistema sea descubrible sin tutorial.
868. Revisar que los menús tengan lenguaje claro.
869. Revisar que acciones destructivas estén separadas.
870. Revisar confirmación solo donde aporte valor.
871. Revisar que no existan diálogos innecesarios.
872. Revisar que los defaults sean buenos.
873. Revisar que la densidad sea consistente.
874. Revisar que el foco visual sea claro.
875. Revisar que el preview sea protagonista.
876. Revisar que timeline sea protagonista secundaria.
877. Revisar que Inspector sea contextual.
878. Revisar que Multimedia sea utilitaria.
879. Revisar que Exportar sea visible.
880. Revisar que reproducir sea visible.
881. Revisar que estado del proyecto sea visible.
882. Revisar indicador de proyecto modificado.
883. Revisar guardado seguro.
884. Revisar salida segura del programa.
885. Revisar prevención de pérdida accidental.
886. Revisar que atajos no sean peligrosos sin contexto.
887. Revisar que R no active ripple mientras se edita texto.
888. Revisar que S no divida mientras se escribe.
889. Revisar que Espacio no agregue espacios en inputs.
890. Revisar que Delete no destruya texto en edición.
891. Revisar que Ctrl+S guarde proyecto.
892. Revisar que Ctrl+Z deshaga una sola acción.
893. Revisar que Ctrl+Y o equivalente rehaga.
894. Revisar que context menu respete selección.
895. Revisar que selección múltiple respete track locks.
896. Revisar que grupos preserven sync cuando se implementen.
897. Revisar que colapsado no cambie tiempo.
898. Revisar que reordenar pistas no cambie tiempo.
899. Revisar que color no cambie comportamiento.
900. Revisar que la experiencia sea coherente de principio a fin.

## Bucle 901–1000 · Seguridad, mantenimiento y release

901. Revisar validación de file IDs.
902. Revisar sanitización de nombres.
903. Revisar sanitización de rutas.
904. Revisar escaping de comandos shell.
905. Revisar escaping de FFmpeg.
906. Revisar que no se concatenen rutas sin escapar.
907. Revisar que PHP rechace métodos incorrectos.
908. Revisar límites de upload.
909. Revisar límites de post.
910. Revisar límites de memoria.
911. Revisar timeout de procesos.
912. Revisar error handling consistente.
913. Revisar mensajes de error seguros.
914. Revisar que no se expongan secretos.
915. Revisar logs sin datos sensibles.
916. Revisar limpieza de temporales.
917. Revisar archivos temporales huérfanos.
918. Revisar outputs huérfanos.
919. Revisar almacenamiento de proyectos.
920. Revisar permisos de escritura.
921. Revisar rutas con espacios.
922. Revisar rutas unicode.
923. Revisar rutas muy largas.
924. Revisar archivos muy grandes.
925. Revisar archivos cero bytes.
926. Revisar archivos corruptos.
927. Revisar archivos sin extensión.
928. Revisar extensión engañosa.
929. Revisar MIME inconsistente.
930. Revisar que parser no confíe solo en extensión.
931. Revisar que FFprobe sea usado donde corresponda.
932. Revisar detección de streams.
933. Revisar ausencia de video.
934. Revisar ausencia de audio.
935. Revisar múltiples streams.
936. Revisar stream de subtítulos desconocido.
937. Revisar framerate inválido.
938. Revisar resolución inválida.
939. Revisar duración inválida.
940. Revisar NaN en tiempos.
941. Revisar Infinity en tiempos.
942. Revisar start<end.
943. Revisar clips dentro del proyecto.
944. Revisar source offsets válidos.
945. Revisar track IDs válidos.
946. Revisar media IDs válidos.
947. Revisar estados booleanos normalizados.
948. Revisar arrays siempre inicializados.
949. Revisar snapshots profundos.
950. Revisar mutación accidental de referencias compartidas.
951. Revisar compatibilidad entre módulos legacy y Pro.
952. Revisar duplicación de listeners.
953. Revisar duplicación de timers.
954. Revisar assets versionados.
955. Revisar cache busting.
956. Revisar orden de carga JS.
957. Revisar orden de carga CSS.
958. Revisar dependencia implícita entre módulos.
959. Revisar globals expuestos.
960. Revisar `window.clipforge` estable.
961. Revisar compatibilidad con editor-entry.
962. Revisar comportamiento si falta un módulo opcional.
963. Revisar fallback si no hay audio player.
964. Revisar fallback si no hay timeline.
965. Revisar fallback si no hay preview.
966. Revisar fallback si no hay Inspector.
967. Revisar fallback si no hay ruler.
968. Revisar que la app pueda reportar estado QA.
969. Revisar que los logs de QA sean útiles.
970. Revisar build de desarrollo.
971. Revisar build empaquetado.
972. Revisar installer NSIS.
973. Revisar runtime PHP empaquetado.
974. Revisar runtime FFmpeg empaquetado.
975. Revisar assets web empaquetados.
976. Revisar `prepare-build.js`.
977. Revisar `npm start`.
978. Revisar `npm run pack`.
979. Revisar `npm run dist`.
980. Revisar versión desktop.
981. Revisar changelog de release.
982. Revisar documentación del producto.
983. Revisar documentación de Auto Edit.
984. Revisar documentación del perfil Benjiwi.
985. Revisar documentación de QA.
986. Revisar licencia y notices.
987. Revisar dependencias de Node.
988. Revisar versiones de Electron.
989. Revisar compatibilidad del runtime Windows.
990. Revisar ausencia de archivos de backup accidentales.
991. Revisar ausencia de temporales en git.
992. Revisar nombres de commits.
993. Revisar historial de cambios.
994. Revisar cambios no relacionados mezclados.
995. Revisar que main sea reproducible.
996. Revisar que README describa el estado real.
997. Revisar que funciones experimentales estén marcadas.
998. Revisar que no se presenten mocks como funciones finales.
999. Revisar pruebas manuales críticas antes de release.
1000. Revisar que Preview, Timeline, Audio y Render representen el mismo proyecto.

## Criterio de release

Los bucles 999 y 1000 son bloqueantes para una etiqueta de producto: no se debe presentar una función como terminada si el resultado visual en Preview y el resultado exportado no coinciden.
