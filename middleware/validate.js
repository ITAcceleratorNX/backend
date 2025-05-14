export const validateBody = (schema) => (req, res, next) => {
    try {
        console.log("🚨 [validateBody] Raw req.body:", req.body);
        req.body = schema.parse(req.body);
        console.log("✅ [validateBody] After parse:", req.body);
        next();
    } catch (error) {
        console.error("❌ [validateBody] Zod error:", error);
        return res.status(400).json({
            error: 'Validation error',
            details: error.errors?.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })) || [],
        });
    }
};
