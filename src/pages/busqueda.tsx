// import algoliasearch from 'algoliasearch/lite';
// import {
//     InstantSearch,
//     SearchBox,
//     Hits,
// } from 'react-instantsearch-dom';

// const searchClient = algoliasearch(
//     'P7ILDN8BXE',             // APP ID
//     '211b2e615635e2fbb6695b8196c8b8b4'      // ← API Key
// );


// import { ManualCard } from "../components/ManualCard";



// // src/pages/BusquedaPage.tsx
// import  { useState, useRef, useEffect } from "react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Link } from "react-router-dom";

// export default function BusquedaPage() {
//     const [setQuery] = useState("");
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [codigo, setCodigo] = useState("");
//     const menuRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
//                 setIsMenuOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="min-h-screen bg-[#F6F6F6] text-[#202020]">
//             {/* Navbar */}
//             <nav className="bg-white shadow px-6 py-5 flex items-center justify-between relative">
//                 <div className="flex items-center gap-4">
//                     <div
//                         className="w-8 h-8 cursor-pointer z-20"
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     >
//                         <Menu className="text-[#127C82] w-full h-full" />
//                     </div>
//                 </div>

//                 <div className="text-2xl font-bold text-[#127C82] tracking-tight">
//                     GuíaClick
//                 </div>

//                 <div className="w-8" />

//                 <AnimatePresence>
//                     {isMenuOpen && (
//                         <motion.div
//                             ref={menuRef}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -20 }}
//                             className="absolute top-16 left-6 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-30"
//                         >
//                             <ul className="py-2">
//                                 <li><Link to="/registro" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Registro</Link></li>
//                                 <li><Link to="/login" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Iniciar sesión</Link></li>
//                                 <li><Link to="/configuracion" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Configuración</Link></li>
//                                 <li><Link to="/empresas" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Sección empresas</Link></li>
//                             </ul>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </nav>

//             <div className="px-6 py-12 max-w-6xl mx-auto">
//                 <div className="flex justify-center mb-12">
//                     <img
//                         src="/libro-icono.svg"
//                         alt="Icono manual"
//                         className="w-40 h-40 rounded-full bg-[#E0E0E0] p-5 shadow-md"
//                     />
//                 </div>



//                 <InstantSearch searchClient={searchClient} indexName="manuales_index">
//                     <div className="relative mb-14 max-w-2xl mx-auto">
//                         <SearchBox
//                             className="w-full rounded-full px-55 py-5 bg-[#64C1C1] text-white placeholder-white text-lg shadow focus:ring-4 focus:ring-[#90DFDF]"
//                             translations={{ placeholder: "Buscar manual..." }}
//                         />

//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <Hits hitComponent={ManualCard} />
//                     </div>
//                 </InstantSearch>












//                 <div className="flex justify-center mt-16">
//                     <Button
//                         onClick={() => setShowModal(true)}
//                         className="bg-[#127C82] text-white px-6 py-3 rounded-full text-lg hover:bg-[#0F5F66]"
//                     >
//                         Código empresarial
//                     </Button>
//                 </div>

//                 <AnimatePresence>
//                     {showModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-40"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white p-6 rounded-xl shadow-lg w-80 text-center"
//                             >
//                                 <h2 className="text-lg font-semibold mb-4">Introduce el código de empresa</h2>
//                                 <Input
//                                     value={codigo}
//                                     onChange={(e) => setCodigo(e.target.value)}
//                                     placeholder="3FK3OD"
//                                     className="text-center mb-4 text-[#127C82] font-semibold"
//                                 />
//                                 <div className="flex justify-between gap-4">
//                                     <button
//                                         onClick={() => setShowModal(false)}
//                                         className="flex-1 py-2 rounded bg-red-500 text-white hover:bg-red-600"
//                                     >
//                                         Cancelar
//                                     </button>
//                                     <button
//                                         onClick={() => alert(`Código ingresado: ${codigo}`)}
//                                         className="flex-1 py-2 rounded bg-green-500 text-white hover:bg-green-600"
//                                     >
//                                         Aceptar
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>

//             <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
//                 © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
//             </footer>
//         </div>
//     );
// }
