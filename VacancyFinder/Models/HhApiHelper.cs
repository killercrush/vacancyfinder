using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace VacancyFinder.Models
{
    public static class HhApiHelper
    {
        public static async Task<VacanciesRequestResult> GetVacancies(string searchText, int page, int perPage)
        {
            var client = new HttpClient();

            var uri = String.Format("https://api.hh.ru/vacancies/?per_page={0}&page={1}&text={2}",
                perPage, page, searchText);
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            request.Headers.Add("User-Agent", "api-test-agent");

            HttpResponseMessage response;
            try
            {
                response = await client.SendAsync(request);
            }
            catch (Exception)
            {
                return null;
            }

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                dynamic jsonContent = JsonConvert.DeserializeObject(content);

                var vacancies = new List<Vacancy>();

                foreach (var item in jsonContent.items)
                {
                    var salaryInfo = item.salary;
                    string salary = "";
                    if (salaryInfo != null)
                    {
                        var from = salaryInfo["from"];
                        var to = salaryInfo["to"];
                        if (from == to)
                        {
                            salary = from;
                        }
                        else
                        {
                            salary += from == null ? "" : "от " + from;
                            salary += to == null ? "" : " до " + to;
                        }
                    }

                    vacancies.Add(new Vacancy
                    {
                        Id = item.id,
                        Title = item.name,
                        Salary = salary,
                        EmployerName = item.employer.name,
                        Url = item.alternate_url,
                        Description = $"Требования: {item.snippet.requirement}.\n Обязанности: {item.snippet.responsibility}"
                    });
                }

                int totalPages = (int)jsonContent.pages;
                return new VacanciesRequestResult
                {
                    Vacancies = vacancies,
                    HasMorePages = page < (totalPages - 1)
                };
            }

            return null;
        }
    }
}
