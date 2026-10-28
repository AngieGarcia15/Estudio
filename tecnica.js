document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MENSAJE MOTIVACIONAL Y PERFIL
     ========================================================================== */
  const btnGuardarNombre = document.getElementById('btn-guardar-nombre');
  const inputNombre = document.getElementById('nombre-usuario');
  const saludoUsuario = document.getElementById('saludo-usuario');

  btnGuardarNombre.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();
    if (nombre) {
      saludoUsuario.textContent = `¡Hola, ${nombre}! Tus datos e historial de sesión han sido guardados.`;
      inputNombre.value = '';
    } else {
      alert('Por favor, ingresa tu nombre.');
    }
  });

  /* ==========================================================================
     2. GESTIÓN DE DEBERES / TAREAS
     ========================================================================== */
  const btnAgregarTarea = document.getElementById('btn-agregar-tarea');
  const inputTarea = document.getElementById('input-tarea');
  const listaTareas = document.getElementById('lista-tareas');

  btnAgregarTarea.addEventListener('click', agregarTarea);

  function agregarTarea() {
    const texto = inputTarea.value.trim();
    if (!texto) return alert('Escribe una tarea válida.');

    const li = document.createElement('li');

    const divLeft = document.createElement('div');
    divLeft.className = 'tarea-item-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      li.classList.toggle('completada', checkbox.checked);
    });

    const spanTexto = document.createElement('span');
    spanTexto.textContent = texto;

    divLeft.appendChild(checkbox);
    divLeft.appendChild(spanTexto);

    const btnBorrar = document.createElement('button');
    btnBorrar.className = 'btn-sparky btn-danger';
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.addEventListener('click', () => {
      listaTareas.removeChild(li);
    });

    li.appendChild(divLeft);
    li.appendChild(btnBorrar);
    listaTareas.appendChild(li);

    inputTarea.value = '';
  }

  /* ==========================================================================
     3. CONTROLADOR DE HERRAMIENTAS Y TEMA
     ========================================================================== */
  const inputTema = document.getElementById('input-tema');
  const selectHerramienta = document.getElementById('select-herramienta');
  const contenedorHerramienta = document.getElementById('contenedor-herramienta');
  const subHerramientas = document.querySelectorAll('.sub-herramienta');
  const temasActivos = document.querySelectorAll('.tema-activo');

  // Actualizar tema dinámicamente en las herramientas
  inputTema.addEventListener('input', () => {
    const tema = inputTema.value.trim() || 'General';
    temasActivos.forEach(el => el.textContent = tema);
    if (diagramaGoJS) actualizarNodoRaiz(tema);
  });

  // Mostrar herramienta elegida
  selectHerramienta.addEventListener('change', () => {
    const seleccion = selectHerramienta.value;

    subHerramientas.forEach(el => el.classList.add('oculto'));

    if (seleccion) {
      contenedorHerramienta.classList.remove('oculto');
      const herramientaActiva = document.getElementById(`herramienta-${seleccion}`);
      if (herramientaActiva) herramientaActiva.classList.remove('oculto');

      // Inicializaciones especiales
      if (seleccion === 'mapamental' && !diagramaGoJS) {
        initGoJS();
      }
    } else {
      contenedorHerramienta.classList.add('oculto');
    }
  });

  /* ==========================================================================
     HERRAMIENTA 1: SUBRAYADO
     ========================================================================== */
  let colorMarcadorActual = '#ffeb3b';
  const botonesColor = document.querySelectorAll('.btn-color');
  const btnSubrayar = document.getElementById('btn-subrayar');
  const btnBorrarSubrayado = document.getElementById('btn-borrar-subrayado');

  botonesColor.forEach(btn => {
    btn.addEventListener('click', () => {
      botonesColor.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      colorMarcadorActual = btn.getAttribute('data-color');
    });
  });

  btnSubrayar.addEventListener('click', () => {
    const seleccion = window.getSelection();
    if (!seleccion.rangeCount || seleccion.isCollapsed) return alert('Selecciona primero un texto dentro del cuadro.');

    const rango = seleccion.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = colorMarcadorActual;
    span.className = 'texto-resaltado';

    try {
      rango.surroundContents(span);
    } catch (e) {
      alert('Por favor selecciona únicamente texto simple dentro de la misma línea.');
    }
  });

  btnBorrarSubrayado.addEventListener('click', () => {
    const seleccion = window.getSelection();
    if (!seleccion.rangeCount) return;

    const elPadre = seleccion.anchorNode.parentElement;
    if (elPadre && elPadre.classList.contains('texto-resaltado')) {
      const texto = elPadre.textContent;
      elPadre.replaceWith(document.createTextNode(texto));
    } else {
      alert('Haz clic o selecciona sobre un texto que esté subrayado para quitarle el resaltado.');
    }
  });

  /* ==========================================================================
     HERRAMIENTA 2: FLASHCARDS
     ========================================================================== */
  const fcPregunta = document.getElementById('fc-pregunta');
  const fcRespuesta = document.getElementById('fc-respuesta');
  const btnCrearCard = document.getElementById('btn-crear-card');
  const gridFlashcards = document.getElementById('grid-flashcards');

  btnCrearCard.addEventListener('click', () => {
    const preg = fcPregunta.value.trim();
    const resp = fcRespuesta.value.trim();

    if (!preg || !resp) return alert('Escribe tanto la pregunta como la respuesta.');

    const card = document.createElement('div');
    card.className = 'card-item';

    card.innerHTML = `
      <div class="card-pregunta">${preg}</div>
      <div class="card-respuesta">${resp}</div>
      <div class="card-acciones">
        <button class="btn-sparky btn-ver">Ver Respuesta</button>
        <button class="btn-sparky btn-danger btn-eliminar">Eliminar</button>
      </div>
    `;

    const btnVer = card.querySelector('.btn-ver');
    const respDiv = card.querySelector('.card-respuesta');
    btnVer.addEventListener('click', () => {
      const oculto = respDiv.style.display === '' || respDiv.style.display === 'none';
      respDiv.style.display = oculto ? 'block' : 'none';
      btnVer.textContent = oculto ? 'Ocultar' : 'Ver Respuesta';
    });

    const btnEliminar = card.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => {
      gridFlashcards.removeChild(card);
    });

    gridFlashcards.appendChild(card);
    fcPregunta.value = '';
    fcRespuesta.value = '';
  });

  /* ==========================================================================
     HERRAMIENTA 3: MAPA MENTAL CON GoJS
     ========================================================================== */
  let diagramaGoJS = null;
  let nodosData = [{ key: 0, text: 'Tema Principal' }];
  let enlacesData = [];

  function initGoJS() {
    const $ = go.GraphObject.make;

    diagramaGoJS = $(go.Diagram, "gojs-diagrama", {
      "undoManager.isEnabled": true,
      layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
    });

    diagramaGoJS.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "#0056b3", strokeWidth: 0 }),
        $(go.TextBlock, { margin: 8, stroke: "white", font: "bold 12pt sans-serif" },
          new go.Binding("text", "text"))
      );

    diagramaGoJS.linkTemplate =
      $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape, { strokeWidth: 2, stroke: "#0056b3" })
      );

    actualizarDiagrama();
  }

  function actualizarNodoRaiz(nuevoTema) {
    nodosData[0].text = nuevoTema;
    actualizarDiagrama();
  }

  function actualizarDiagrama() {
    if (diagramaGoJS) {
      diagramaGoJS.model = new go.GraphLinksModel(nodosData, enlacesData);
      actualizarSelectorPadre();
    }
  }

  const btnAgregarNodo = document.getElementById('btn-agregar-nodo');
  const nodoTextoInput = document.getElementById('nodo-texto');
  const nodoPadreSelect = document.getElementById('nodo-padre');

  btnAgregarNodo.addEventListener('click', () => {
    const texto = nodoTextoInput.value.trim();
    const idPadre = parseInt(nodoPadreSelect.value);

    if (!texto) return alert('Ingresa un texto para el nodo.');

    const nuevoId = nodosData.length;
    nodosData.push({ key: nuevoId, text: texto });
    enlacesData.push({ from: idPadre, to: nuevoId });

    nodoTextoInput.value = '';
    actualizarDiagrama();
  });

  function actualizarSelectorPadre() {
    nodoPadreSelect.innerHTML = '';
    nodosData.forEach(nodo => {
      const opt = document.createElement('option');
      opt.value = nodo.key;
      opt.textContent = nodo.text;
      nodoPadreSelect.appendChild(opt);
    });
  }

  /* ==========================================================================
     HERRAMIENTA 4: POMODORO
     ========================================================================== */
  let tiempoRestante = 25 * 60; // 25 Minutos
  let timerInterval = null;

  const pomoDisplay = document.getElementById('pomo-display');
  const btnPomoStart = document.getElementById('btn-pomo-start');
  const btnPomoPause = document.getElementById('btn-pomo-pause');
  const btnPomoReset = document.getElementById('btn-pomo-reset');

  function renderTimer() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    pomoDisplay.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

  btnPomoStart.addEventListener('click', () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      if (tiempoRestante > 0) {
        tiempoRestante--;
        renderTimer();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('¡Tiempo Pomodoro completado! Tómate un descanso de 5 minutos.');
      }
    }, 1000);
  });

  btnPomoPause.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  btnPomoReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    tiempoRestante = 25 * 60;
    renderTimer();
  });

});