document.addEventListener("DOMContentLoaded", () => {
  const csvFileInput = document.getElementById("csvFile");
  const loadButton = document.getElementById("loadButton");
  const drawButton = document.getElementById("drawButton");
  const participantsList = document.getElementById("participantsList");
  const winnerDisplay = document.getElementById("winner");
  const resultTitle = document.getElementById("resultTitle");
  const bgMusic = document.getElementById("bgMusic");

  let participants = [];
  let countdownInterval = null;

  loadButton.addEventListener("click", () => {
    const file = csvFileInput.files[0];
    if (!file) {
      alert("Por favor, selecciona un archivo CSV antes de cargar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      participants = content
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p);

      displayParticipants();
      if (participants.length > 0) {
        drawButton.disabled = false;
        // Reproducir música de fondo (se intentará tras la interacción del usuario)
        bgMusic.play().catch((err) => {
          console.log(
            "Autoplay bloqueado, el usuario deberá interactuar de nuevo:",
            err
          );
        });
      }
    };
    reader.readAsText(file, "UTF-8");
  });

  drawButton.addEventListener("click", () => {
    if (participants.length === 0) {
      alert("No hay participantes para sortear.");
      return;
    }

    // Resetear el display
    winnerDisplay.textContent = "";
    resultTitle.textContent = "Cuenta regresiva...";

    // Añadir animación al texto
    winnerDisplay.classList.add("countdown-animate");

    // Deshabilitar el botón mientras corre la cuenta regresiva
    drawButton.disabled = true;

    let countdown = 5;
    winnerDisplay.textContent = `El ganador se mostrará en ${countdown}...`;

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        winnerDisplay.textContent = `El ganador se mostrará en ${countdown}...`;
      } else {
        clearInterval(countdownInterval);
        mostrarGanador();
      }
    }, 1000);
  });

  function mostrarGanador() {
    winnerDisplay.classList.remove("countdown-animate"); // quitar animación de la cuenta regresiva

    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];
    resultTitle.textContent = "Ganador/a";
    winnerDisplay.textContent = winner;
    drawButton.disabled = false;

    lanzarConfeti();
  }

  function displayParticipants() {
    participantsList.innerHTML = "";
    participants.forEach((part) => {
      const li = document.createElement("li");
      li.textContent = part;
      participantsList.appendChild(li);
    });
  }

  function lanzarConfeti() {
    const confettiContainer = document.getElementById("confetti-container");
    // Limpiar confeti anterior
    confettiContainer.innerHTML = "";

    const cantidad = 50; // número de confetis
    for (let i = 0; i < cantidad; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      // Posición y rotación aleatorias
      const x =
        Math.random() * window.innerWidth * 2 - window.innerWidth + "px";
      const y = Math.random() * window.innerHeight * 1.5 + "px";
      const r = Math.random() * 360 + "deg";

      confetti.style.setProperty("--x", x);
      confetti.style.setProperty("--y", y);
      confetti.style.setProperty("--r", r);

      // Colores alternativos
      confetti.style.backgroundColor =
        Math.random() < 0.5 ? "#ED323D" : "#2B233B";

      confettiContainer.appendChild(confetti);
    }

    // Opcional: remover confeti después de cierto tiempo
    setTimeout(() => {
      confettiContainer.innerHTML = "";
    }, 5000);
  }
});
