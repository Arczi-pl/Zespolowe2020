using API2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace API2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var files = ModelContr.GetAllFiles();
            return View(files);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}