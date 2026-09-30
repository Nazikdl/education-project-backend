import { catchAsync, HandleERROR } from "vanta-api";

const isAdmin=catchAsync(async (req,res,next) => {
    if(req.role!='admin' && req.role!='superAdmin'){
        return next(new HandleERROR('You do not have a permission',401))
    }
    next()
})
export default isAdmin