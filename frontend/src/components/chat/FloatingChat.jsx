import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { ChatAPI } from "../../api/endpoints";

const STARTER_PROMPTS = [
  "I'm feeling stressed",
  "I can't sleep well",
  "I feel unmotivated today",
  "Give me a breathing exercise",
];

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi, I'm your MindMate wellness assistant 🌿 I can suggest breathing exercises, mindfulness, sleep tips, or a quick check-in. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await ChatAPI.send(trimmed, nextMessages.slice(-8));
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "I'm having trouble responding right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-lavender-500 to-mint-400 shadow-glow flex items-center justify-center text-base-950"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open wellness chat assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] glass-card flex flex-col overflow-hidden bg-base-950/90"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender-400 to-mint-400 flex items-center justify-center">
                <Sparkles size={16} className="text-base-950" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">MindMate Assistant</p>
                <p className="text-[10px] text-slate-500">General wellness support, not therapy</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-lavender-500 to-bloom-500 text-white rounded-br-sm"
                        : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-lavender-300"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 p-3 border-t border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type how you're feeling..."
                className="glass-input flex-1 text-sm"
              />
              <button type="submit" className="btn-primary !px-3 !py-2.5" disabled={loading} aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
