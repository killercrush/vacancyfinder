using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Newtonsoft.Json;
using VacancyFinder.Models;

namespace VacancyFinder.Controllers
{
    [Route("api/[controller]")]
    public class VacancyController : Controller
    {
        private const int vacancyPerPage = 5;

        private VacancyContext db;

        public VacancyController(VacancyContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public async Task<VacanciesRequestResult> GetVacancies(string searchText = "", int startPage = 0)
        {
            if (startPage < 0)
            {
                startPage = 0;
            }

            var vacanciesRequestResult = await HhApiHelper.GetVacancies(searchText, startPage, vacancyPerPage);

            if (vacanciesRequestResult == null)
            {
                var vacanciesFromDb = db.Vacancies.Select(t => t);

                if (!String.IsNullOrEmpty(searchText))
                {
                    vacanciesFromDb = vacanciesFromDb
                        .Where(t => t.Description.Contains(searchText) || t.Title.Contains(searchText));
                }

                int pagesTotal = (int)Math.Ceiling(vacanciesFromDb.Count() / (double)vacancyPerPage);

                vacanciesFromDb = vacanciesFromDb
                    .OrderBy(t => t.Id)
                    .Skip(vacancyPerPage * startPage)
                    .Take(vacancyPerPage);
                
                return new VacanciesRequestResult
                {
                    Vacancies = vacanciesFromDb.ToArray(),
                    HasMorePages = startPage < pagesTotal - 1
                };
            }
            else
            {
                return vacanciesRequestResult;
            }
        }
    }
}
