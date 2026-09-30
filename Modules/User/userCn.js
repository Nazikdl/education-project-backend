import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./userMd.js";
import bcrypt from "bcrypt";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .sort()
    .search(["phoneNumber", "fullName"])
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role == "instructor" || req.role == "student"
      ? { _id: req.userId }
      : { _id: req.params.id };
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      {
        path: "favoriteCourseIds",
        select: "title image price",
      },
      {
        path: "boughtCourseIds",
        select: "title image price",
      },
      {
        path: "ratedCourseIds",
        select: "title image price",
      },
      {
        path: "progress",
        populate: { path: "courseId", select: "title image price" },
      },
      {
        path: "lastLessonId",
        select: "title image ",
      },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    birthYear = null,
    fullName = null,
    role = null,
    isActive = "unknown",
  } = req.body;
  if (req.role == "student" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("دسترسی شما مجاز نیست", 401));
  }
  if (req.role == "instructor" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("دسترسی شما مجاز نیست", 401));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }
  if (
    req.role === "admin" &&
    (user.role === "superAdmin" || user.role === "admin")
  ) {
    return next(new HandleERROR("دسترسی شما مجاز نیست", 401));
  }

  user.fullName = fullName || user.fullName;
  user.birthYear = birthYear || user.birthYear;
  if (req.role == "superAdmin") {
    user.role = role || user.role;
  }
  if (req.role == "superAdmin" || req.role == "admin") {
    user.isActive = isActive != "unknown" ? isActive : user.isActive;
  }
  const newUser = await user.save();
  return res.status(200).json({
    success: true,
    message: "اطلاعات کاربر با موفقیت به روزرسانی شد",
    data: newUser,
  });
});
export const changePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.role == "student" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("دسترسی شما مجاز نیست", 401));
  }
  if (req.role == "instructor" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("دسترسی شما مجاز نیست", 401));
  }
  const { oldPassword = null, newPassword = null } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }
  if (user.password && !oldPassword) {
    return next(new HandleERROR("لطفا رمز قبلی را وارد کنید", 400));
  }
  if (user.password && oldPassword) {
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return next(new HandleERROR("رمز قبلی اشتباه است", 400));
    }
  }
  if (!newPassword) {
    return next(new HandleERROR("رمز جدید الزامی است", 400));
  }
  const passReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!passReg.test(newPassword)) {
    return next(
      new HandleERROR(
        "رمز باید شامل حروف A-Z , a-z , 0-9 باشد و با حداقل 8 کاراکتر",
        400,
      ),
    );
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
  return res.status(200).json({
    success: true,
    message: "رمزعبور با موفقیت تغییر کرد",
  });
});
export const getMyProgress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId)
    .select("progress")
    .populate("progress.courseId", "title image slug lessonCount");

  const data = user.progress
    .filter((p) => p.courseId)
    .map((p) => {
      const totalLessons = p.courseId?.lessonCount || 0;
      const completedLessons =
        p.lessons?.filter((l) => l.isCompleted).length || 0;
      const percentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      const totalWatchedSeconds = p.lessons.reduce(
        (sum, l) => sum + (l.watchedSeconds || 0),
        0
      );

      return {
        courseId: p.courseId._id,
        title: p.courseId.title,
        image: p.courseId.image,
        slug: p.courseId.slug,
        percentage,
        completedLessons,
        totalLessons,
        totalWatchedSeconds,
        lastWatchedAt: p.lastWatchedAt,
      };
    });

  return res.status(200).json({
    success: true,
    results: data.length,
    data,
  });
});