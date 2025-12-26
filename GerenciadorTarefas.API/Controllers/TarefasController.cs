using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using GerenciadorTarefas.Application.Services;
using GerenciadorTarefas.Domain.Entities;







namespace GerenciadorTarefas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefasController : ControllerBase
    {
        private readonly ITarefaService _tarefaService;

        public TarefasController(ITarefaService tarefaService)
        {
            _tarefaService = tarefaService;
        }

        // GET: api/tarefas
        [HttpGet]
        public async Task<IActionResult> ObterTodas()
        {
            var tarefas = await _tarefaService.ObterTodasAsync();
            return Ok(tarefas);
        }

        // GET: api/tarefas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var tarefa = await _tarefaService.ObterPorIdAsync(id);

            if (tarefa == null)
                return NotFound();

            return Ok(tarefa);
        }

        // POST: api/tarefas
        [HttpPost]
        public async Task<IActionResult> Criar(Tarefa tarefa)
        {
            await _tarefaService.CriarAsync(tarefa);
            return CreatedAtAction(nameof(ObterPorId), new { id = tarefa.Id }, tarefa);
        }

        // PUT: api/tarefas/5
        [HttpPut("{id}")]
public async Task<IActionResult> Atualizar(int id, Tarefa tarefaAtualizada)
{
    var tarefa = await _tarefaService.ObterPorIdAsync(id);
    if (tarefa == null)
        return NotFound();

    tarefa.Titulo = tarefaAtualizada.Titulo;
    tarefa.Descricao = tarefaAtualizada.Descricao;

    if (tarefaAtualizada.Status == StatusTarefa.Concluida)
        tarefa.Concluir();
    else
        tarefa.Reabrir();

    await _tarefaService.AtualizarAsync(tarefa);

    return NoContent();
}
       
        // DELETE: api/tarefas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _tarefaService.DeletarAsync(id);
            return NoContent();
        }
    }
}