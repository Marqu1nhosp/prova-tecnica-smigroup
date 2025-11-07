import SmiLogo from '../assets/SMi.svg';

export function Header(){
  return (
    <header className="flex items-center justify-between bg-[#232120] text-[#F1F3F4] px-6 py-3 h-[60px]">
     
      <div className="flex items-center">
      
        <div className="text-2xl mr-4 cursor-pointer">
          &#9776;
        </div>
        <div>
         <img 
          src={SmiLogo} 
          alt="Smi Group" 
          className="h-8"
        />
        </div>
      </div>
      <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#F05123] text-sm font-bold text-white">
        LM
      </div>
    </header>
  );
};