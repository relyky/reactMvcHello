using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace reactMvcHello.Controllers
{
    public class RetrievalController : Controller
    {
        // GET: Retrieval
        public ActionResult Index()
        {
            return View();
        }

        // GET: Retrieval/VueIndex
        public ActionResult VueIndex()
        {
            return View();
        }

        public JsonResult GetEmployeeData()
        {
            using (MyDatabaseEntities ctx = new MyDatabaseEntities())
            {
                var data = ctx.Employees.OrderBy(c => c.FirstName).ToArray();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
    }
}