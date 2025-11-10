import Image from "next/image";
import Button from "./Button";

const Footer = () => {
    return (
      <section className="w-full ">
        <div className="relative bg-[#4977E6] pt-50 pb-20 text-white text-[1rem] ">
           <div className="w-[90%]  mx-auto flex flex-col md:flex-row items-top justify-between gap-10">
               <div className="flex flex-col  gap-6">
                <Image src="/logo2.svg" alt="logo" width={80.45} height={26}/>
                <p className="w-full md:w-[45%]">A digital learning management system designed to help independent instructors and creators build, brand, and scale their online academies. </p>
                <nav className="flex items-center gap-4">
                    <Image src="/socialicons1.svg" alt="icon" width={16} height={16} />
                    <Image src="/socialicons2.svg" alt="icon" width={16} height={16} />
                    <Image src="/socialicons3.svg" alt="icon" width={16} height={16} />
                    <Image src="/socialicons4.svg" alt="icon" width={16} height={16} />
                    
                </nav>
               </div>

               <div className="flex items-top gap-10 ">
               <div className="flex flex-col gap-2" >
               <p className="text-[1.25rem]" >Navigations</p>
               <p>Features</p>
               <p>Pricing</p>
               <p>Contact Us</p>
               </div>

               <div className="flex flex-col gap-2" >
                <p className="text-[1.25rem]">Countact Us</p>
                <p>Features</p>
                <p>tuteraafrica@gmail.com</p>
               </div>
               </div>
            </div>

            <div className="absolute bg-white w-[90%] md:w-[60%] top-[-45%] left-[50%] translate-x-[-50%]  rounded-[24px] py-14">
              <div className=" w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row item-center gap-6">
              <Image src="/footerimg.svg" alt="footer-bg" width={400} height={189}/>

            
             <div className=" flex flex-col gap-6 justify-center items-center md:items-start">
                <p className="text-[1.2rem] md:text-[1.2rem] font-semibold text-[#101A33]">Join the next generation of African knowledge entrepreneurs scaling their income.</p>
                 <Button variant="primary" className="w-[65%] md:w-[57%] py-3 rounded-[8px] text-[1rem] font-bold">Start Your Academy Today</Button>
                </div>
              </div>
            </div>

        </div>




           <div className="bg-[#ffffff]">
            <div className="w-[90%] lg:max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between py-8 text-[#1A1A1A]">
            <p className="text-[1.25rem]"> © {new Date().getFullYear()} Tutera. All Rights Reserved.</p>
            <div>
                <ul className="flex items-center gap-4 text-[0.75rem] font-semibold">
                    <li>privacy policy</li>
                    <li>Terma Use</li>
                    <li>legal</li>
                    <li>site map</li>
                </ul>
            </div>

            </div>
           
           </div>
       
      </section>
    );
  };
  
  export default Footer;