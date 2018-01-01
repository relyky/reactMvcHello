using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;

namespace reactMvcHello.Controllers
{
    public class RetrievalPagingController : Controller
    {
        // GET: RetrievalPaging
        public ActionResult Index()
        {
            return View();
        }

        // GET: RetrievalPaging/VueIndex
        public ActionResult VueIndex()
        {
            return View();
        }

        // GET: RetrievalPaging/VueComIndex
        public ActionResult VueComIndex()
        {
            return View();
        }

        public JsonResult GetEmployeeList(string sortColumnName = "FirstName", string sortOrder = "asc", int pageSize=3, int currentPage = 1)
        {
            // @* view model *@
            //Data : {
            //    List : [],
            //    totalPage : 0,
            //    sortColumnName : null,
            //    sortOrder : null,
            //    currentPage : 1,
            //    pageSize : 3
            //}

            // init result 
            List<Employees> List = new List<Employees>();
            int totalPage = 0;
            int totalRecord = 0;

            // fill result
            using (MyDatabaseEntities ctx = new MyDatabaseEntities())
            {
                totalRecord = ctx.Employees.Count();

                if(pageSize > 0)
                {
                    totalPage = totalRecord / pageSize + ((totalRecord / pageSize) > 0 ? 1 : 0);
                    List = ctx.Employees.OrderBy(sortColumnName + " " + sortOrder).Skip(pageSize * (currentPage - 1)).Take(pageSize).ToList();
                }
                else
                {
                    List = ctx.Employees.ToList();
                }
            }

            // view model
            var Data = new
            {
                List = List,
                totalPage = totalPage,
                sortColumnName = sortColumnName,
                sortOrder = sortOrder,
                currentPage = currentPage,
                pageSize = pageSize
            };

            return Json(Data, JsonRequestBehavior.AllowGet);
        }

    }
}