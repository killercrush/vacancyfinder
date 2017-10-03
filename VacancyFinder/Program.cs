using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VacancyFinder.Models;

namespace VacancyFinder
{
    public class Program
    {
        public static void Main(string[] args)
        {
            InitDb();

            BuildWebHost(args).Run();
        }

        public static async void InitDb()
        {
            var db = new VacancyContext();

            var vacanciesRequestResult = await HhApiHelper.GetVacancies("", 0, 50);

            if (vacanciesRequestResult != null)
            {
                foreach (var vacancy in vacanciesRequestResult.Vacancies)
                {
                    var vacancyInDb = db.Vacancies.Find(vacancy.Id);
                    if (vacancyInDb == null)
                    {
                        db.Vacancies.Add(vacancy);
                    }
                    else
                    {
                        vacancyInDb.Salary = vacancy.Salary;
                        vacancyInDb.Title = vacancy.Title;
                        vacancyInDb.Url = vacancy.Url;
                        vacancyInDb.Description = vacancy.Description;
                        vacancyInDb.EmployerName = vacancy.EmployerName;
                    }
                }

                await db.SaveChangesAsync();
            }
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
