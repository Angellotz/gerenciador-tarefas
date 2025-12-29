using System.ComponentModel.DataAnnotations;
using GerenciadorTarefas.Domain.Entities;

namespace GerenciadorTarefas.Domain.Entities
{
  public class Tarefa
  {
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public DateTime DataCriacao { get; private set; } = DateTime.Now;

    public DateTime? DataConclusao { get; private set; }

    public StatusTarefa Status { get; set; } = StatusTarefa.Pendente;

    public void AlterarStatus(StatusTarefa novoStatus)
    {
      if (novoStatus == StatusTarefa.Concluida)
      {
        Status = StatusTarefa.Concluida;
        DataConclusao = DateTime.Now;
        return;
      }

      if (novoStatus == StatusTarefa.EmProgresso)
      {
        Status = StatusTarefa.EmProgresso;
        DataConclusao = null;
        return;
      }

        Status = StatusTarefa.Pendente;
        DataConclusao = null;
    }

    public void DefinirDataConclusao(DateTime? dataConclusao)
    {
      if (dataConclusao.HasValue && dataConclusao < DataCriacao)
        throw new InvalidOperationException(
          "A data de conclusão não pode ser anterior à data de criação.");

      DataConclusao = dataConclusao;
    }
  }
}
