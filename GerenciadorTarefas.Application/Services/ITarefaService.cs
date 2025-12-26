using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorTarefas.Domain.Entities;


namespace GerenciadorTarefas.Application.Services;

public interface ITarefaService
{
    Task<IEnumerable<Tarefa>> ObterTodasAsync();
    Task<Tarefa?> ObterPorIdAsync(int id);
    Task CriarAsync(Tarefa tarefa);
    Task AtualizarAsync(Tarefa tarefa);
    Task DeletarAsync(int id);
}