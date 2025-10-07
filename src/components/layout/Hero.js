import Image from "next/image";
import Right from "../icons/Right";

export default function Hero(){
    return(
        <section className="hero mt-4">
            <div className="py-8 md:py-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold dark:text-slate-100 leading-tight">
                    Everything<br></br> is better<br></br> with a&nbsp; 
                    <span className="text-primary">Pizza</span>
                </h1>
                <p className="my-4 md:my-6 text-gray-500 dark:text-slate-400 text-sm md:text-base max-w-md">
                    Pizza is the missing piece that makes every day complete, a simple yet delicious joy in life
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
                    <button className="bg-primary justify-center uppercase items-center flex gap-2 text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
                        Order now
                        <Right></Right>
                    </button>
                    <button className="flex border-0 items-center justify-center gap-2 py-3 text-gray-600 dark:text-slate-400 font-semibold hover:text-primary dark:hover:text-primary transition-colors">
                        Learn more
                        <Right></Right>
                    </button>
                </div>
            </div>
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
                <Image src={'/pizza.png'} alt={'pizza'} fill className="object-contain"></Image>
            </div>
        </section>
    )
}