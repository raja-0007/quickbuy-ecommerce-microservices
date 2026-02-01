
const roleCheck = (allowedRoles=[]) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.'});
        } else {
            next();
        }
    }
}
module.exports = roleCheck;