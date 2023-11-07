import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Image src="/main-icon.png" alt="game icon" width={200} height={200} />
        <h2 className="text-2xl mt-3 font-mono uppercase">
          Jogo da velha 3          
        </h2>
        <span className="mt-2 uppercase text-sm align-text-top bg-black text-white rounded px-1">
            2.0 beta
          </span>
        <div className="flex flex-col px-8 py-4 mt-5 gap-5 text-2xl text-stone-800 font-mono">
          <Link href="/classic" className="px-6 py-3 rounded-sm text-center border-2 hover:bg-orange-500 hover:text-white  border-orange-500">
            Modo clássico
          </Link>
          <Link href="/quick-game" className="px-6 py-3 rounded-sm text-center border-2 hover:bg-orange-500 hover:text-white  border-orange-500 ">
            Modo rápido
          </Link>
          <Link href="/online" className="px-6 py-3 rounded-sm text-center border-2 hover:bg-orange-500 hover:text-white  border-orange-500 ">
            Online Clássico
          </Link>
        </div>
      </div>
    </div>
  );
}
