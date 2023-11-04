
export default function Home() {
  return <div className='flex items-center justify-center h-screen'>
    
    <div className="flex flex-col items-center px-8 py-4 rounded gap-2 bg-gray-200">
        <a href="/classic" className="px-3 py-2 hover:bg-black/5"> Modo clássico</a>
        <a href="/quick-game" className="px-3 py-2 hover:bg-black/5"> Modo rápido</a>
    </div>
  </div>;
}
