using System.Threading.Tasks;
using GerenciadorTarefas.Domain.Entities;

namespace GerenciadorTarefas.Application.Services;

public interface ITarefaService
{
    Task<IEnumerable<Tarefa>> ObterTodasAsync();
    Task<Tarefa?> ObterPorIdAsync(int id);
    Task CriarAsync(Tarefa tarefa);
    Task AtualizarAsync(int id, string titulo, string descricao, StatusTarefa status);
    Task DeletarAsync(int id);
}