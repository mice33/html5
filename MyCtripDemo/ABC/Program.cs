using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ABC
{
    class Program
    {
        static void Main(string[] args)
        {
            List<string> listPrice = new List<string>() { "11", "22", "33", "44", "55" };
            List<string> listB=new List<string>() {"aa","bb","cc"};
            List<string> listC = new List<string>() { "tag1", "tag2", "tag3", "tag4" };

            List<string> result = new List<string>();

            //价格
            foreach (var price in listPrice)
            {
                result.Add(price);//=A
                //品牌
                foreach (var pp in listB)
                {
                    result.Add(pp);//=B
                    result.Add(price + "-" + pp);//=AB

                    //标签
                    foreach (var tag in listC)
                    {
                        result.Add(tag);//=C
                        result.Add(price + "-" + tag);//==AC
                        result.Add(pp+"_"+tag);//=BC
                        result.Add(price + "_" + pp + "_" + tag);//=ABC
                        //result.Add();
                    }
                }
            }

            Console.WriteLine("总个数"+result.Count);
            foreach (var item in result)
            {
                Console.WriteLine(item);
            }

            Console.ReadKey();

        }
    }
}
