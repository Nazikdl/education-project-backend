import { catchAsync, HandleERROR } from "vanta-api"
const isLogin=catchAsync(async (req,res,next) => {
    if(!req.role || !req.userId){
        return next(new HandleERROR('You do not have a permission',401))
    }
    next()
})
export default isLogin