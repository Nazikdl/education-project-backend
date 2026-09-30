import { catchAsync, HandleERROR } from "vanta-api"
const isInstructor=catchAsync(async (req,res,next) => {
    if(req.role !== 'instructor' || !req.userId){
        return next(new HandleERROR('You do not have a permission',401))
    }
    next()
})
export default isInstructor