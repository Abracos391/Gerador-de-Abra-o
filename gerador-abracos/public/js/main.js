document.getElementById('geradorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const mensagem = e.target.mensagem.value;
  const estilo = e.target.estilo.value;
  const tema = e.target.tema.value;
  const corPredominante = e.target.corPredominante.value;
  const corTexto = e.target.corTexto.value;
  const posicaoTexto = e.target.posicaoTexto.value;

  // Aqui você pode fazer a integração com sua API backend, por exemplo
  // Para demonstração, vamos exibir uma imagem placeholder

  const resultadoDiv = document.getElementById('resultado');
  const img = document.getElementById('imagemGerada');
  img.src = 'https://via.placeholder.com/400x200.png?text=Imagem+Criada!';
  img.alt = 'Imagem gerada';

  // Atualizar o link de download
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = img.src; // Pode ser a URL gerada pela sua API
  downloadLink.style.display = 'inline-block';

});
