import { motion } from "framer-motion";

function TextAssistant({ message, options = [], onSelectOption }) {
  return (
    <motion.div
      className="text-assistant"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bubble">
        <p>{message}</p>
        <div className="choices">
          {options.map((opt) => (
            <button key={opt} onClick={() => onSelectOption(opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default TextAssistant;
