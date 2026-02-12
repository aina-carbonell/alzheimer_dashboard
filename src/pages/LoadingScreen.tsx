import { motion } from "framer-motion";
import { Loader2, Brain } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="inline-block"
        >
          <Brain className="w-16 h-16 text-purple-600" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Carregant dades...
          </h2>
          <p className="text-gray-600">
            Analitzant el dataset OASIS
          </p>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-purple-600"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Processant...</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ErrorScreen = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4"
      >
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">
          Error al carregar les dades
        </h2>
        <p className="text-gray-600">
          {message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tornar a intentar
        </button>
      </motion.div>
    </div>
  );
};