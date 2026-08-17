// Lightweight request validator: pass a schema of { field: { required, type, min, max, enum } }
const validateBody = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value === undefined || value === null) continue;

    if (rules.type === "number" && typeof value !== "number") {
      errors.push(`${field} must be a number`);
    }
    if (rules.min !== undefined && typeof value === "number" && value < rules.min) {
      errors.push(`${field} must be >= ${rules.min}`);
    }
    if (rules.max !== undefined && typeof value === "number" && value > rules.max) {
      errors.push(`${field} must be <= ${rules.max}`);
    }
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
    }
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join("; ") });
  }
  next();
};

module.exports = { validateBody };
