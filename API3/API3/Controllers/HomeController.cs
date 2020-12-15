using API2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace API3.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var files = ModelContr.GetAllFiles();
            return View(files);
        }
    }
}
