using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyTour.Controllers
{
    using System.Configuration;

    public class TourController : Controller
    {
        //
        // GET: /Tour/

        public ActionResult Index()
        {
            var a = ConfigurationManager.AppSettings["tourAppBaseUrl"];
            return View();
        }

    }
}
