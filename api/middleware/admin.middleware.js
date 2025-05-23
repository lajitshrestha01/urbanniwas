const isAdmin = (req, res, next) => {
    if (req.user.role === 'ADMIN') {
        return next();
    }
    res.status(403).json({ message: "Admin access required" });
};

export default isAdmin; 