using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VacancyFinder.Models
{
    public class VacanciesRequestResult
    {
        public IEnumerable<Vacancy> Vacancies { get; set; }
        
        public bool HasMorePages { get; set; }
    }
}
