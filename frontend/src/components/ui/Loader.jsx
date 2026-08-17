import { motion } from "framer-motion";

const Loader = ({ fullScreen = false, label = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-lavender-400 to-mint-400"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-900">
      {content}
    </div>
  );
};

export default Loader;
