-- =====================================================
-- DATOS INICIALES - APP PARA BRILLAR
-- Seed data para catálogos y configuración inicial
-- =====================================================

USE app_para_brillar;

-- =====================================================
-- CATÁLOGO DE COLORES DE TEMAS
-- =====================================================

INSERT INTO catalogo_colores_temas (nombre_tema, nombre_display, colores_tema, es_activo) VALUES
('lime-vibes', 'Autenticamente Candy', 
'{
  "primary": "#c4ef1a",
  "primaryHover": "#a8d30f",
  "accent": "#FFFFFF",
  "accentLight": "#E0E0E0",
  "bgGradientFrom": "#121212",
  "bgGradientVia": "#000000",
  "bgGradientTo": "#121212",
  "textGradientFrom": "#c4ef1a",
  "textGradientTo": "#FFFFFF",
  "scrollbarThumb": "#c4ef1a",
  "scrollbarThumbHover": "#a8d30f",
  "selectionBg": "#c4ef1a",
  "selectionText": "#000000",
  "dailyMessageBgFrom": "rgba(196, 239, 26, 0.25)",
  "dailyMessageBgVia": "rgba(26, 26, 26, 0.5)",
  "dailyMessageBgTo": "rgba(196, 239, 26, 0.15)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.08)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.15)",
  "buttonSecondaryText": "#c4ef1a",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#A0A0A0",
  "bgBase": "#000000",
  "bgSurface": "#1A1A1A",
  "bgOverlay": "rgba(26, 26, 26, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.1)",
  "ringColor": "#c4ef1a"
}', TRUE),

('purple-reign', 'Magia Púrpura',
'{
  "primary": "#8B5CF6",
  "primaryHover": "#7C3AED",
  "accent": "#EC4899",
  "accentLight": "#A78BFA",
  "bgGradientFrom": "#1E1B4B",
  "bgGradientVia": "#5B21B6",
  "bgGradientTo": "#1E293B",
  "textGradientFrom": "#A78BFA",
  "textGradientTo": "#F472B6",
  "scrollbarThumb": "#8B5CF6",
  "scrollbarThumbHover": "#7C3AED",
  "selectionBg": "#8B5CF6",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(139, 92, 246, 0.3)",
  "dailyMessageBgVia": "rgba(30, 41, 59, 0.5)",
  "dailyMessageBgTo": "rgba(236, 72, 153, 0.3)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.1)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.2)",
  "buttonSecondaryText": "#A78BFA",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#D1D5DB",
  "bgBase": "#111827",
  "bgSurface": "#1F2937",
  "bgOverlay": "rgba(30, 27, 75, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.15)",
  "ringColor": "#8B5CF6"
}', TRUE),

('blue-breeze', 'Claridad Celeste',
'{
  "primary": "#3B82F6",
  "primaryHover": "#2563EB",
  "accent": "#60A5FA",
  "accentLight": "#93C5FD",
  "bgGradientFrom": "#1E3A8A",
  "bgGradientVia": "#1D4ED8",
  "bgGradientTo": "#1E293B",
  "textGradientFrom": "#60A5FA",
  "textGradientTo": "#34D399",
  "scrollbarThumb": "#3B82F6",
  "scrollbarThumbHover": "#2563EB",
  "selectionBg": "#3B82F6",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(59, 130, 246, 0.3)",
  "dailyMessageBgVia": "rgba(30, 41, 59, 0.5)",
  "dailyMessageBgTo": "rgba(96, 165, 250, 0.3)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.1)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.2)",
  "buttonSecondaryText": "#60A5FA",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#E5E7EB",
  "bgBase": "#172554",
  "bgSurface": "#1E3A8A",
  "bgOverlay": "rgba(30, 58, 138, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.15)",
  "ringColor": "#3B82F6"
}', TRUE),

('emerald-glow', 'Brillo Esmeralda',
'{
  "primary": "#10B981",
  "primaryHover": "#059669",
  "accent": "#34D399",
  "accentLight": "#6EE7B7",
  "bgGradientFrom": "#064E3B",
  "bgGradientVia": "#047857",
  "bgGradientTo": "#1E293B",
  "textGradientFrom": "#34D399",
  "textGradientTo": "#A3E635",
  "scrollbarThumb": "#10B981",
  "scrollbarThumbHover": "#059669",
  "selectionBg": "#10B981",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(16, 185, 129, 0.3)",
  "dailyMessageBgVia": "rgba(30, 41, 59, 0.5)",
  "dailyMessageBgTo": "rgba(52, 211, 153, 0.3)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.1)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.2)",
  "buttonSecondaryText": "#34D399",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#D1D5DB",
  "bgBase": "#065F46",
  "bgSurface": "#047857",
  "bgOverlay": "rgba(4, 120, 87, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.15)",
  "ringColor": "#10B981"
}', TRUE),

('sunset-orange', 'Energía Ámbar',
'{
  "primary": "#F97316",
  "primaryHover": "#EA580C",
  "accent": "#EF4444",
  "accentLight": "#FB923C",
  "bgGradientFrom": "#7C2D12",
  "bgGradientVia": "#C2410C",
  "bgGradientTo": "#1E293B",
  "textGradientFrom": "#FB923C",
  "textGradientTo": "#F87171",
  "scrollbarThumb": "#F97316",
  "scrollbarThumbHover": "#EA580C",
  "selectionBg": "#F97316",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(249, 115, 22, 0.3)",
  "dailyMessageBgVia": "rgba(30, 41, 59, 0.5)",
  "dailyMessageBgTo": "rgba(239, 68, 68, 0.3)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.1)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.2)",
  "buttonSecondaryText": "#FB923C",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#F3F4F6",
  "bgBase": "#7F1D1D",
  "bgSurface": "#991B1B",
  "bgOverlay": "rgba(194, 65, 12, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.15)",
  "ringColor": "#F97316"
}', TRUE),

('pink-serenity', 'Poder Rosa',
'{
  "primary": "#FF69B4",
  "primaryHover": "#FF1493",
  "accent": "#FFB6C1",
  "accentLight": "#FFD6DD",
  "bgGradientFrom": "#C71585",
  "bgGradientVia": "#DB7093",
  "bgGradientTo": "#E63995",
  "textGradientFrom": "#FFFFFF",
  "textGradientTo": "#FFD6DD",
  "scrollbarThumb": "#FF69B4",
  "scrollbarThumbHover": "#FF1493",
  "selectionBg": "#FF69B4",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(255, 105, 180, 0.35)",
  "dailyMessageBgVia": "rgba(219, 112, 147, 0.45)",
  "dailyMessageBgTo": "rgba(255, 105, 180, 0.25)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.15)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.25)",
  "buttonSecondaryText": "#FFD6DD",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#FFE4E9",
  "bgBase": "#D1177A",
  "bgSurface": "#E63995",
  "bgOverlay": "rgba(199, 21, 133, 0.8)",
  "borderColor": "rgba(255, 105, 180, 0.4)",
  "ringColor": "#FF1493"
}', TRUE),

('pure-canvas', 'Luz Clara',
'{
  "primary": "#B0B0B0",
  "primaryHover": "#909090",
  "accent": "#9CA3AF",
  "accentLight": "#D1D5DB",
  "bgGradientFrom": "#FFFFFF",
  "bgGradientVia": "#F9FAFB",
  "bgGradientTo": "#FFFFFF",
  "textGradientFrom": "#B0B0B0",
  "textGradientTo": "#909090",
  "scrollbarThumb": "#D1D5DB",
  "scrollbarThumbHover": "#9CA3AF",
  "selectionBg": "#E5E7EB",
  "selectionText": "#1F2937",
  "dailyMessageBgFrom": "rgba(209, 213, 219, 0.7)",
  "dailyMessageBgVia": "rgba(229, 231, 235, 0.8)",
  "dailyMessageBgTo": "rgba(209, 213, 219, 0.7)",
  "buttonSecondaryBg": "rgba(0, 0, 0, 0.04)",
  "buttonSecondaryHoverBg": "rgba(0, 0, 0, 0.06)",
  "buttonSecondaryText": "#B0B0B0",
  "textPrimary": "#111827",
  "textSecondary": "#4B5563",
  "bgBase": "#FFFFFF",
  "bgSurface": "#F9FAFB",
  "bgOverlay": "rgba(249, 250, 251, 0.8)",
  "borderColor": "rgba(0, 0, 0, 0.1)",
  "ringColor": "#B0B0B0"
}', TRUE),

('modern-steel', 'Acero Brillante',
'{
  "primary": "#00BFFF",
  "primaryHover": "#009ACD",
  "accent": "#E5E7EB",
  "accentLight": "#F3F4F6",
  "bgGradientFrom": "#6B7280",
  "bgGradientVia": "#4B5563",
  "bgGradientTo": "#6B7280",
  "textGradientFrom": "#00BFFF",
  "textGradientTo": "#FFFFFF",
  "scrollbarThumb": "#4B5563",
  "scrollbarThumbHover": "#374151",
  "selectionBg": "#00BFFF",
  "selectionText": "#FFFFFF",
  "dailyMessageBgFrom": "rgba(75, 85, 99, 0.5)",
  "dailyMessageBgVia": "rgba(55, 65, 81, 0.7)",
  "dailyMessageBgTo": "rgba(75, 85, 99, 0.5)",
  "buttonSecondaryBg": "rgba(255, 255, 255, 0.08)",
  "buttonSecondaryHoverBg": "rgba(255, 255, 255, 0.12)",
  "buttonSecondaryText": "#00BFFF",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#D1D5DB",
  "bgBase": "#374151",
  "bgSurface": "#4B5563",
  "bgOverlay": "rgba(75, 85, 99, 0.8)",
  "borderColor": "rgba(255, 255, 255, 0.1)",
  "ringColor": "#00BFFF"
}', TRUE);

-- =====================================================
-- CATÁLOGO DE SENTIMIENTOS
-- =====================================================

INSERT INTO catalogo_sentimientos (nombre_sentimiento, emoji, descripcion, es_activo) VALUES
('Bien / Contenta', '🙂', 'Sentimiento de bienestar y contento general', TRUE),
('¡Fantástico! / Emocionada', '🤩', 'Sentimiento de gran alegría y emoción', TRUE),
('Me siento desconectada', '😔', 'Sentimiento de desconexión o tristeza', TRUE),
('Solo quiero una dosis de inspiración', '✨', 'Buscando motivación e inspiración', TRUE),
('Ansiosa / Nerviosa', '😰', 'Sentimiento de ansiedad o nerviosismo', TRUE),
('Enojada / Frustrada', '😤', 'Sentimiento de enojo o frustración', TRUE),
('Cansada / Agotada', '😴', 'Sentimiento de cansancio o agotamiento', TRUE),
('Agradecida', '🙏', 'Sentimiento de gratitud y agradecimiento', TRUE),
('Motivada / Energizada', '💪', 'Sentimiento de motivación y energía', TRUE),
('Paz / Tranquila', '😌', 'Sentimiento de paz y tranquilidad', TRUE);

-- =====================================================
-- CATÁLOGO DE LOGROS
-- =====================================================

INSERT INTO catalogo_logros (nombre_logro, descripcion, categoria, icono_nombre, mensaje_desbloqueo, condicion_activacion, es_premium, es_activo) VALUES
-- Constancia Emocional
('Brilla por Dentro', 'Escribir tu diario 7 días consecutivos.', 'constancia', 'Sunrise', '¡7 días brillando desde adentro! Tu constancia ilumina tu camino.', 'Usuario escribe su diario 7 días consecutivos.', TRUE, TRUE),
('Ritual Cumplido', 'Visualizar el mensaje del día por 30 días seguidos.', 'constancia', 'Repeat', 'Tu constancia es poderosa. ¡Has cumplido 30 días de brillo diario!', 'Usuario visualiza el mensaje del día por 30 días seguidos.', FALSE, TRUE),
('Constancia Dorada', 'Escribir tu diario 30 días consecutivos.', 'constancia', 'Award', '¡30 días de constancia! Eres un ejemplo de perseverancia.', 'Usuario escribe su diario 30 días consecutivos.', FALSE, TRUE),

-- Acción Inspiradora
('Eco de Luz', 'Compartir una frase en redes desde la app.', 'accion', 'Share2', 'Tu luz ya está tocando a otros. ¡Gracias por compartir tu brillo!', 'Usuario comparte una frase en redes desde la app.', FALSE, TRUE),
('Multiplicadora de Brillo', 'Compartir 10 frases diferentes.', 'accion', 'Speaker', 'Tu mensaje está llegando más lejos de lo que imaginas. ¡Sigue brillando!', 'Usuario comparte 10 frases diferentes.', FALSE, TRUE),
('Influencer de Luz', 'Compartir 50 frases diferentes.', 'accion', 'Star', 'Tu impacto es real. ¡Sigues inspirando a más personas cada día!', 'Usuario comparte 50 frases diferentes.', FALSE, TRUE),

-- Crecimiento Personal
('Tu Primer Reto', 'Completar tu primer reto semanal.', 'crecimiento', 'Target', '¡Has dado el primer paso hacia tu crecimiento!', 'Usuario completa su primer reto semanal.', FALSE, TRUE),
('Retadora Consistente', 'Completar 5 retos semanales.', 'crecimiento', 'TrendingUp', 'Tu compromiso con el crecimiento es admirable.', 'Usuario completa 5 retos semanales.', FALSE, TRUE),
('Maestra de Retos', 'Completar 20 retos semanales.', 'crecimiento', 'Crown', '¡Eres una maestra del crecimiento personal!', 'Usuario completa 20 retos semanales.', FALSE, TRUE),

-- Premium
('Brilla Libro', 'Acceder a contenido premium de Candy Díaz.', 'premium', 'BookOpen', '¡Bienvenida al contenido exclusivo! Tu crecimiento merece lo mejor.', 'Usuario accede a contenido premium.', TRUE, TRUE),
('Mentora Personal', 'Recibir coaching personalizado de Candy Díaz.', 'premium', 'UserCheck', '¡Tienes acceso directo a la mentora! Tu transformación está garantizada.', 'Usuario recibe coaching personalizado.', TRUE, TRUE),
('Comunidad VIP', 'Unirse a la comunidad exclusiva de crecimiento.', 'premium', 'Users', '¡Bienvenida a la comunidad VIP! Aquí encontrarás tu tribu.', 'Usuario se une a la comunidad exclusiva.', TRUE, TRUE);

-- =====================================================
-- CATÁLOGO DE FRASES MOTIVACIONALES
-- =====================================================

INSERT INTO catalogo_frases (nombre_frase, autor, categoria, es_activo) VALUES
-- 🌿 Reconectando contigo
('TU MARCA NO SE CONSTRUYE SOLO CON LO QUE MUESTRAS, SINO CON TODO LO QUE HAS SANADO.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('LAS CREENCIAS HEREDADAS NO DEFINEN QUIÉN ERES SI TÚ ELIGES ESCRIBIR TU HISTORIA.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('NO PUEDES CONSTRUIR AUTENTICIDAD SI SIGUES ESCONDIENDO LO QUE AÚN NO ACEPTAS EN TI.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('TUS HERIDAS NO TE HACEN MENOS; SON LA PUERTA HACIA TU PODER MÁS GENUINO Y HUMANO.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('NO IMPORTA LO QUE OTROS PIENSAN DE TI, SI TÚ SABES QUIÉN ERES Y HACIA DÓNDE VAS.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('NO PUEDES SANAR LO QUE AÚN OCULTAS; TU BRILLO EMPIEZA CON LA VERDAD QUE ABRAZAS.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),
('TUS SOMBRAS PIERDEN PODER CUANDO TE ATREVES A MIRARLAS SIN MIEDO NI JUICIO.', 'Candy Díaz', '🌿 Reconectando contigo', TRUE),

-- 🧠 Mentalidad Resiliente
('EL MIEDO AL CAMBIO ES LA PRUEBA INEQUÍVOCA DE QUE ESTÁS EN CAMINO AL CRECIMIENTO.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('NO ERES LO QUE TE PASÓ, ERES LO QUE DECIDES CONSTRUIR A PARTIR DE ESO.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('FRACASAR NO ES EL FINAL: ES PARTE DEL CAMINO QUE TE FORTALECE SIN QUE TE DES CUENTA.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('CADA VEZ QUE AVANZAS A PESAR DEL MIEDO, ENTRENAS TU MENTE PARA CONFIAR EN TI.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('PUEDES MOLDEAR TU MENTALIDAD PARA VIVIR DESDE TU MEJOR VERSIÓN.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('TU CUERPO INFLUYE EN TU MENTE, MOVERTE PUEDE CAMBIAR TU ENERGÍA Y CLARIDAD MENTAL.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('A VECES NO NECESITAS MÁS QUE CAMBIAR LA HISTORIA QUE TE ESTÁS CONTANDO.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),
('SALIR DE DONDE NO TE VALORAN TAMBIÉN ES UN ACTO DE AMOR PROPIO Y RECONEXIÓN.', 'Candy Díaz', '🧠 Mentalidad Resiliente', TRUE),

-- 🔄 Cambiando tu camino
('NO PUEDES CAMBIAR TU HISTORIA SI REPITES LAS MISMAS CREENCIAS DE SIEMPRE.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),
('LA ZONA DE CONFORT NO SIEMPRE ES COMODIDAD, A VECES ES SOLO MIEDO DISFRAZADO.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),
('ROMPER CON TUS LÍMITES MENTALES ES EL PRIMER PASO PARA CONSTRUIR TU NUEVA VERSIÓN.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),
('EL MOMENTO PERFECTO NO EXISTE. AVANZA AHORA, AUNQUE NO SEPAS CÓMO SALDRÁ.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),
('LA MAGIA ESTÁ EN MOVERTE INCLUSO CUANDO EL MIEDO TE DICE QUE NO LO HAGAS.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),
('CADA SALTO QUE DAS SIN CERTEZA ROMPE UNA CADENA QUE TE TENÍA DETENIDO.', 'Candy Díaz', '🔄 Cambiando tu camino', TRUE),

-- 🎯 Propósito con sentido
('TU PROPÓSITO NO SIEMPRE GRITA, A VECES SUSURRA EN LO QUE HACES CON EL CORAZÓN.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('TU PROPÓSITO ESTÁ DONDE SE CRUZA LO QUE AMAS, LO QUE HACES BIEN Y LO QUE EL MUNDO NECESITA.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('TU HISTORIA GUARDA PISTAS DEL IMPACTO QUE VINISTE A DEJAR EN EL MUNDO.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('CADA PASO CON INTENCIÓN TE ACERCA A LA VIDA ALINEADA QUE SABES QUE MERECES VIVIR.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('EL PROPÓSITO MÁS FUERTE NACE DE TU HISTORIA Y DEL DESEO DE APORTAR A LOS DEMÁS.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('TU LEGADO EMPIEZA HOY, EN CADA DECISIÓN QUE TOMAS CON CONCIENCIA Y PROPÓSITO.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),
('CUANDO SABES PARA QUÉ ESTÁS AQUÍ, HASTA LOS DÍAS DIFÍCILES COBRAN OTRO SENTIDO.', 'Candy Díaz', '🎯 Propósito con sentido', TRUE),

-- ✨ Auténticamente brillante
('BRILLAR NO ES MOSTRAR PERFECCIÓN, ES ATREVERTE A SER TÚ SIN PEDIR PERMISO.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('NO NECESITAS VOLVERTE ALGUIEN MÁS, SOLO NECESITAS SER MÁS TÚ CON INTENCIÓN.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('SER AUTÉNTICA NO ES CONTARLO TODO, ES DECIR TU VERDAD CON CLARIDAD Y COHERENCIA.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('TU HISTORIA PERSONAL ES TU MAYOR DIFERENCIADOR SI DECIDES COMPARTIRLA CON VALENTÍA.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('MOSTRARTE SIN MÁSCARAS NO ES DEBILIDAD, ES LA RAÍZ DE TU CONEXIÓN MÁS PODEROSA.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('LO QUE PROYECTAS IMPACTA MÁS CUANDO ESTÁ ALINEADO CON LO QUE REALMENTE ERES.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),
('NO CONECTAMOS CON LO PERFECTO, CONECTAMOS CON QUIENES SE MUESTRAN CON EL CORAZÓN.', 'Candy Díaz', '✨ Auténticamente brillante', TRUE),

-- 🔥 Poder Interior
('NO NECESITAS VALIDACIÓN EXTERNA SI TÚ SABES QUIÉN ERES Y LO QUE MERECES.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('CADA VEZ QUE ELIGES AVANZAR, ESTÁS ENTRENANDO TU CONFIANZA Y TU FUERZA INTERIOR.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('PONER LÍMITES ES UN ACTO DE AMOR PROPIO Y DE RESPETO HACIA TI MISMO.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('TU VOZ TIENE PODER, ÚSALA PARA CONSTRUIR LA VIDA QUE SABES QUE PUEDES LOGRAR.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('NO NECESITAS SER PERFECTO PARA AVANZAR, SOLO SEGUIR CRECIENDO DESDE QUIEN YA ERES.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('TU PODER NO ESTÁ EN AGRADAR, ESTÁ EN SER FIEL A TU VISIÓN, INCLUSO SI INCOMODA.', 'Candy Díaz', '🔥 Poder Interior', TRUE),
('LO QUE CREES DE TI VALE MÁS QUE CUALQUIER COSA QUE PUEDAN DECIR LOS DEMÁS.', 'Candy Díaz', '🔥 Poder Interior', TRUE),

-- 🌗 Equilibrio Consciente
('EL DESCANSO ES UNA PARTE VITAL DE CUALQUIER PROCESO DE CAMBIO Y CRECIMIENTO.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('AGRADECER LO QUE TIENES CAMBIA LA ENERGÍA CON LA QUE ENFRENTAS LO QUE VIENE.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('NO NECESITAS IR RÁPIDO, SOLO NECESITAS AVANZAR EN SINTONÍA CON TU ENERGÍA REAL.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('TU EVOLUCIÓN TAMBIÉN OCURRE EN LOS DÍAS GRISES, NO SOLO CUANDO TODO BRILLA.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('HASTA LA TORMENTA MÁS LARGA TERMINA. TU LUZ VOLVERÁ A BRILLAR CON MÁS FUERZA.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('TOMAR PAUSAS NO TE HACE MENOS COMPROMETIDO, TE HACE MÁS CONSCIENTE Y FUERTE.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE),
('EL EQUILIBRIO NO ES HACER TODO, ES SABER QUÉ SOLTAR PARA SOSTENER LO QUE IMPORTA.', 'Candy Díaz', '🌗 Equilibrio Consciente', TRUE);

-- =====================================================
-- CATÁLOGO DE RETOS SEMANALES
-- =====================================================

INSERT INTO catalogo_retos (nombre_reto, descripcion, categoria, duracion_dias, es_activo) VALUES
('Conecta con tus Valores', 'Identifica 3 valores fundamentales que guían tus decisiones y reflexiona sobre cómo vives cada uno de ellos en tu día a día.', 'Crecimiento Personal', 7, TRUE),
('Practica la Gratitud', 'Escribe 3 cosas por las que estés agradecida cada día y profundiza en por qué te hacen sentir agradecida.', 'Bienestar Emocional', 7, TRUE),
('Desconecta para Reconectar', 'Dedica 30 minutos al día a actividades sin tecnología y observa cómo te sientes durante y después.', 'Equilibrio Digital', 7, TRUE),
('Cultiva tu Autenticidad', 'Identifica una situación diaria donde puedas ser más auténtica y actúa desde tu verdad.', 'Desarrollo Personal', 7, TRUE),
('Construye tu Confianza', 'Haz algo cada día que te saque de tu zona de confort y celebra tu valentía.', 'Empoderamiento', 7, TRUE),
('Practica la Autocompasión', 'Trátate con la misma bondad que tratarías a una amiga cercana durante toda la semana.', 'Bienestar Emocional', 7, TRUE),
('Define tu Propósito', 'Reflexiona sobre tu propósito de vida y cómo puedes alinearlo más con tus acciones diarias.', 'Crecimiento Personal', 7, TRUE),
('Cultiva Relaciones Significativas', 'Conecta de manera más profunda con una persona diferente cada día de la semana.', 'Relaciones', 7, TRUE),
('Practica la Atención Plena', 'Dedica 10 minutos diarios a estar presente en el momento, sin distracciones.', 'Bienestar Emocional', 7, TRUE),
('Celebra tus Logros', 'Reconoce y celebra un logro, por pequeño que sea, cada día de la semana.', 'Empoderamiento', 7, TRUE);

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

SELECT 'Datos iniciales insertados correctamente' as mensaje;
SELECT COUNT(*) as total_temas FROM catalogo_colores_temas;
SELECT COUNT(*) as total_sentimientos FROM catalogo_sentimientos;
SELECT COUNT(*) as total_logros FROM catalogo_logros;
SELECT COUNT(*) as total_frases FROM catalogo_frases;
SELECT COUNT(*) as total_retos FROM catalogo_retos; 