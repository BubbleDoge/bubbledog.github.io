
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ShieldXIcon, TrashIcon, PlusIcon, LoaderIcon } from './components/Icons';

const App: React.FC = () => {
    const [blacklist, setBlacklist] = useLocalStorage<string[]>('werk-blacklist', []);
    const [newNumber, setNewNumber] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);

    const handleAddNumber = useCallback(() => {
        const trimmedNumber = newNumber.trim();
        if (trimmedNumber && !blacklist.includes(trimmedNumber)) {
            setBlacklist(prev => [...prev, trimmedNumber].sort());
            setNewNumber('');
            setMessage(`'${trimmedNumber}' añadido a la lista negra.`);
        } else if (blacklist.includes(trimmedNumber)) {
            setMessage(`'${trimmedNumber}' ya está en la lista.`);
        }
    }, [newNumber, blacklist, setBlacklist]);

    const handleRemoveNumber = (numberToRemove: string) => {
        setBlacklist(blacklist.filter(num => num !== numberToRemove));
        setMessage(`'${numberToRemove}' eliminado de la lista negra.`);
    };

    const handleSimulateCleanup = () => {
        setIsSimulating(true);
        setMessage('Iniciando simulación de limpieza...');
        setTimeout(() => {
            setIsSimulating(false);
            setMessage(`Simulación completada. Se habrían eliminado ${blacklist.length} contactos si esto fuera una app nativa.`);
        }, 2500);
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex items-center justify-center space-x-3 mb-8">
                    <ShieldXIcon className="h-8 w-8 text-red-500" />
                    <h1 className="text-4xl font-bold tracking-tighter text-gray-100">Werk</h1>
                </header>

                {message && (
                    <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 rounded-lg relative mb-6 text-center transition-opacity duration-300">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                
                <main className="space-y-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Añadir Número a la Lista Negra</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="tel"
                                value={newNumber}
                                onChange={(e) => setNewNumber(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddNumber()}
                                placeholder="Escriba un número de teléfono..."
                                className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-shadow"
                            />
                            <button
                                onClick={handleAddNumber}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>Añadir</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Lista Negra ({blacklist.length})</h2>
                        <div className="max-h-64 overflow-y-auto pr-2">
                            {blacklist.length > 0 ? (
                                <ul className="space-y-3">
                                    {blacklist.map(number => (
                                        <li key={number} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg animate-fade-in">
                                            <span className="font-mono text-lg text-gray-300">{number}</span>
                                            <button onClick={() => handleRemoveNumber(number)} className="p-2 rounded-full hover:bg-red-500/20 transition-colors">
                                                <TrashIcon className="h-5 w-5 text-red-500" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-center py-8">La lista negra está vacía.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Acción Principal</h2>
                        <button
                            onClick={handleSimulateCleanup}
                            disabled={isSimulating || blacklist.length === 0}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                        >
                            {isSimulating ? (
                                <>
                                    <LoaderIcon className="h-5 w-5 animate-spin" />
                                    <span>Simulando...</span>
                                </>
                            ) : (
                                <span>Simular Limpieza de Agenda</span>
                            )}
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                            * Esta es una simulación. Las aplicaciones web no pueden leer ni eliminar contactos de su dispositivo.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
