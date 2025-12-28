using System.Threading.Tasks;
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

        [HttpGet]
        public async Task<IActionResult> ObterTodas()
        {
            var tarefas = await _tarefaService.ObterTodasAsync();
            return Ok(tarefas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var tarefa = await _tarefaService.ObterPorIdAsync(id);
            return tarefa == null ? NotFound() : Ok(tarefa);
        }

        [HttpPost]
        public async Task<IActionResult> Criar(Tarefa tarefa)
        {
            await _tarefaService.CriarAsync(tarefa);
            return CreatedAtAction(nameof(ObterPorId), new { id = tarefa.Id }, tarefa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, Tarefa tarefaAtualizada)
        {
            await _tarefaService.AtualizarAsync(
                id,
                tarefaAtualizada.Titulo,
                tarefaAtualizada.Descricao,
                tarefaAtualizada.Status
            );

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _tarefaService.DeletarAsync(id);
            return NoContent();
        }
    }
}