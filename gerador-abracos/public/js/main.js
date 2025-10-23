const form = document.getElementById("geradorForm");
const imagemGerada = document.getElementById("imagemGerada");
const downloadLink = document.getElementById("downloadLink");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  imagemGerada.src = "";
  downloadLink.href = "";
  downloadLink.style.display = "none";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success && result.image) {
      imagemGerada.src = `data:image/png;base64,${result.image}`;
      downloadLink.href = `data:image/png;base64,${result.image}`;
      downloadLink.style.display = "inline-block";
    } else {
      alert("Erro ao gerar imagem.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao gerar imagem.");
  }
});
