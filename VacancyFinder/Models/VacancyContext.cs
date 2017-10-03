using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VacancyFinder.Models
{
    public class VacancyContext : DbContext
    {
        public DbSet<Vacancy> Vacancies { get; set; }
        public VacancyContext(DbContextOptions<VacancyContext> options)
            : base(options)
        {
        }

        public VacancyContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=vacancyfinderdb;Trusted_Connection=True;");
        }
    }
}
