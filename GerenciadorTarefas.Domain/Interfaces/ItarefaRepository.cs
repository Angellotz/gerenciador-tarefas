using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorTarefas.Domain.Entities;

namespace GerenciadorTarefas.Domain.Interfaces;

public interface ITarefaRepository
{
    Task<IEnumerable<Tarefa>> ObterTodasAsync();
    Task<Tarefa?> ObterPorIdAsync(int id);
    Task AdicionarAsync(Tarefa tarefa);
    Task AtualizarAsync(Tarefa tarefa);
    Task RemoverAsync(Tarefa tarefa);
}