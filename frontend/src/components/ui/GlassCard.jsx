import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = false, as: Tag = "div", ...rest }) => {
  const MotionTag = motion(Tag);
  return (
    <MotionTag
      className={`glass-card p-5 ${hover ? "hover:bg-white/[0.07] transition-colors" : ""} ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default GlassCard;
