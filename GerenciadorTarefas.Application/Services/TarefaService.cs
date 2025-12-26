using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorTarefas.Domain.Entities;
using GerenciadorTarefas.Domain.Interfaces;


namespace GerenciadorTarefas.Application.Services;

public class TarefaService : ITarefaService
{
    private readonly ITarefaRepository _repository;

    public TarefaService(ITarefaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Tarefa>> ObterTodasAsync()
    {
        return await _repository.ObterTodasAsync();
    }

    public async Task<Tarefa?> ObterPorIdAsync(int id)
    {
        return await _repository.ObterPorIdAsync(id);
    }

    public async Task CriarAsync(Tarefa tarefa)
    {
        await _repository.AdicionarAsync(tarefa);
    }

    public async Task AtualizarAsync(Tarefa tarefa)
    {
        await _repository.AtualizarAsync(tarefa);
    }

    public async Task DeletarAsync(int id)
    {
        var tarefa = await _repository.ObterPorIdAsync(id);
        if (tarefa is null)
            throw new Exception("Tarefa não encontrada");

        await _repository.RemoverAsync(tarefa);
    }
}