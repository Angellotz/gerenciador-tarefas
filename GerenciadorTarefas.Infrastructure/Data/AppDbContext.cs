using System;
using GerenciadorTarefas.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefas.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tarefa> Tarefas { get; set; }
}
