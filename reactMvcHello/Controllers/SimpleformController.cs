using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace reactMvcHello.Controllers
{
    public class SimpleformController : Controller
    {
        // GET: Simpleform
        public ActionResult Index()
        {
            return View();
        }

        // GET: Simpleform/VueIndex
        public ActionResult VueIndex()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SaveContactData(ContactData model)
        {
            bool status = false;
            string message = "";
            if(ModelState.IsValid)
            {
                using (MyDatabaseEntities ctx = new MyDatabaseEntities())
                {
                    ctx.ContactData.Add(model);
                    ctx.SaveChanges();
                    status = true;
                    message = "Thank you for submit your query.";
                }
            }
            else
            {
                message = "Failed! Please try again.";
            }

            var Data = new { status = status, message = message };
            return Json(Data, JsonRequestBehavior.DenyGet);
        }

    }
}