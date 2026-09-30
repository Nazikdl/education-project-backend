import { catchAsync, HandleERROR } from "vanta-api";
import mongoose from "mongoose";
import User from "../User/userMd.js";
import Course from "../Course/courseMd.js";
import Category from "../Category/categoryMd.js";
import Comment from "../Comment/commentMd.js";
import Order from "../Order/orderMd.js";
import Lesson from "../Lesson/lessonMd.js";

// ============================================================
// 1. آمار کلی داشبورد ادمین (Overview)
// ============================================================
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const [
    usersStats,
    coursesStats,
    ordersStats,
    commentsStats,
    revenueStats,
  ] = await Promise.all([
    // آمار کاربران
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),

    // آمار دوره‌ها
    Course.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // آمار سفارش‌ها
    Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // آمار نظرات
    Comment.aggregate([
      { $match: { isReply: false } },
      {
        $group: {
          _id: "$isPublished",
          count: { $sum: 1 },
        },
      },
    ]),

    // درآمد کل
    Order.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalPriceAfterDiscount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$finalPriceAfterDiscount" },
        },
      },
    ]),
  ]);

  // تبدیل آرایه به آبجکت
  const userCounts = {
    student: 0,
    instructor: 0,
    admin: 0,
    superAdmin: 0,
  };
  usersStats.forEach((s) => (userCounts[s._id] = s.count));

  const courseCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  coursesStats.forEach((s) => (courseCounts[s._id] = s.count));

  const orderCounts = {
    pending: 0,
    success: 0,
    failed: 0,
    canceled: 0,
  };
  ordersStats.forEach((s) => (orderCounts[s._id] = s.count));

  const commentCounts = {
    published: 0,
    unpublished: 0,
  };
  commentsStats.forEach((s) => {
    if (s._id === true) commentCounts.published = s.count;
    else commentCounts.unpublished = s.count;
  });

  const revenue = revenueStats[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  };

  return res.status(200).json({
    success: true,
    data: {
      users: {
        ...userCounts,
        total:
          userCounts.student +
          userCounts.instructor +
          userCounts.admin +
          userCounts.superAdmin,
      },
      courses: {
        ...courseCounts,
        total:
          courseCounts.pending +
          courseCounts.approved +
          courseCounts.rejected,
      },
      orders: {
        ...orderCounts,
        total:
          orderCounts.pending +
          orderCounts.success +
          orderCounts.failed +
          orderCounts.canceled,
      },
      comments: {
        ...commentCounts,
        total: commentCounts.published + commentCounts.unpublished,
      },
      revenue: {
        totalRevenue: +revenue.totalRevenue.toFixed(2),
        totalOrders: revenue.totalOrders,
        avgOrderValue: +revenue.avgOrderValue.toFixed(2),
      },
    },
  });
});

// ============================================================
// 2. فروش ماهانه (برای نمودار خطی)
// ============================================================
export const getMonthlySales = catchAsync(async (req, res, next) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthlySales = await Order.aggregate([
    {
      $match: {
        status: "success",
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$finalPriceAfterDiscount" },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // پُر کردن ماه‌های خالی
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const fullData = months.map((name, index) => {
    const found = monthlySales.find((m) => m._id === index + 1);
    return {
      month: index + 1,
      name,
      revenue: found ? +found.revenue.toFixed(2) : 0,
      ordersCount: found ? found.ordersCount : 0,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      year,
      monthly: fullData,
      totalRevenue: fullData.reduce((sum, m) => sum + m.revenue, 0),
      totalOrders: fullData.reduce((sum, m) => sum + m.ordersCount, 0),
    },
  });
});

// ============================================================
// 3. کاربران جدید (برای نمودار ستونی)
// ============================================================
export const getNewUsers = catchAsync(async (req, res, next) => {
  const days = parseInt(req.query.days) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const newUsers = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  const data = newUsers.map((u) => ({
    date: `${u._id.year}-${String(u._id.month).padStart(2, "0")}-${String(
      u._id.day
    ).padStart(2, "0")}`,
    count: u.count,
  }));

  return res.status(200).json({
    success: true,
    data: {
      days,
      users: data,
      total: data.reduce((sum, u) => sum + u.count, 0),
    },
  });
});

// ============================================================
// 4. پرفروش‌ترین دوره‌ها (برای داشبورد)
// ============================================================
export const getTopSellingCourses = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const courses = await Course.find({ status: "approved" })
    .sort({ boughtCount: -1 })
    .limit(limit)
    .select(
      "title image slug price finalPrice boughtCount avgRating ratingCount lessonCount totalDuration"
    )
    .lean();

  return res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});

// ============================================================
// 5. پرامتیازترین دوره‌ها
// ============================================================
export const getTopRatedCourses = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const courses = await Course.find({
    status: "approved",
    ratingCount: { $gte: 3 },
  })
    .sort({ avgRating: -1, ratingCount: -1 })
    .limit(limit)
    .select(
      "title image slug price finalPrice avgRating ratingCount boughtCount"
    )
    .lean();

  return res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});

// ============================================================
// 6. جدیدترین دوره‌ها (برای سایت اصلی)
// ============================================================
export const getLatestCourses = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const courses = await Course.find({
    status: "approved",
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(
      "title image slug price finalPrice avgRating ratingCount boughtCount level instructorId categoryIds"
    )
    .populate([
      { path: "instructorId", select: "fullName" },
      { path: "categoryIds", select: "title" },
    ])
    .lean();

  return res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});

// ============================================================
// 7. دوره‌های در انتظار تأیید (فقط ادمین)
// ============================================================
export const getPendingCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .populate([
      { path: "instructorId", select: "fullName phoneNumber" },
      { path: "categoryIds", select: "title" },
    ])
    .select(
      "title image slug price description instructorId categoryIds createdAt"
    )
    .lean();

  return res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});

// ============================================================
// 8. آمار فروش هر دوره (برای گزارش دقیق)
// ============================================================
export const getCourseSalesStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $match: { status: "success" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.courseId",
        title: { $first: "$items.title" },
        image: { $first: "$items.image" },
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$items.finalPrice" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 20 },
  ]);

  return res.status(200).json({
    success: true,
    results: stats.length,
    data: stats,
  });
});

// ============================================================
// 9. آمار درآمد بر اساس دسته‌بندی
// ============================================================
export const getCategorySales = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $match: { status: "success" } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "courses",
        localField: "items.courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    { $unwind: "$course.categoryIds" },
    {
      $group: {
        _id: "$course.categoryIds",
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$items.finalPrice" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 1,
        categoryTitle: "$category.title",
        categoryImage: "$category.image",
        totalSales: 1,
        totalRevenue: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return res.status(200).json({
    success: true,
    results: stats.length,
    data: stats,
  });
});

// ============================================================
// 10. آمار کلی سایت (برای صفحه اصلی - عمومی)
// ============================================================
export const getPublicStats = catchAsync(async (req, res, next) => {
  const [studentsCount, coursesCount, instructorsCount, totalHours] =
    await Promise.all([
      User.countDocuments({ role: "student", isActive: true }),
      Course.countDocuments({ status: "approved", isPublished: true }),
      User.countDocuments({ role: "instructor", isActive: true }),
      Course.aggregate([
        { $match: { status: "approved", isPublished: true } },
        { $group: { _id: null, total: { $sum: "$totalDuration" } } },
      ]),
    ]);

  return res.status(200).json({
    success: true,
    data: {
      students: studentsCount,
      courses: coursesCount,
      instructors: instructorsCount,
      totalHours: Math.round((totalHours[0]?.total || 0) / 60),
    },
  });
});

// ============================================================
// 11. آمار فعالیت کاربر (برای داشبورد کاربر)
// ============================================================
export const getUserStats = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  const user = await User.findById(userId).select(
    "boughtCourseIds favoriteCourseIds progress"
  );

  // تعداد دوره‌های خریداری‌شده
  const boughtCount = user.boughtCourseIds.length;

  // تعداد دوره‌های تکمیل‌شده (100%)
  const completedCourses = user.progress.filter(
    (p) => p.percentage === 100
  ).length;

  // تعداد دوره‌های در حال یادگیری
  const inProgressCourses = user.progress.filter(
    (p) => p.percentage > 0 && p.percentage < 100
  ).length;

  // مجموع زمان تماشا (به دقیقه)
  const totalWatchedSeconds = user.progress.reduce((total, p) => {
    const lessonsWatched = (p.lessons || []).reduce(
      (sum, l) => sum + (l.watchedSeconds || 0),
      0
    );
    return total + lessonsWatched;
  }, 0);

  return res.status(200).json({
    success: true,
    data: {
      boughtCourses: boughtCount,
      completedCourses,
      inProgressCourses,
      favoriteCourses: user.favoriteCourseIds.length,
      totalWatchedMinutes: Math.round(totalWatchedSeconds / 60),
      totalWatchedHours: +(totalWatchedSeconds / 3600).toFixed(1),
    },
  });
});

// ============================================================
// 12. دوره‌های محبوب (بر اساس favoriteCourseIds)
// ============================================================
export const getPopularCourses = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const popular = await User.aggregate([
    { $unwind: "$favoriteCourseIds" },
    {
      $group: {
        _id: "$favoriteCourseIds",
        favoriteCount: { $sum: 1 },
      },
    },
    { $sort: { favoriteCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    {
      $match: {
        "course.status": "approved",
        "course.isPublished": true,
      },
    },
    {
      $project: {
        _id: 1,
        favoriteCount: 1,
        title: "$course.title",
        image: "$course.image",
        slug: "$course.slug",
        price: "$course.price",
        finalPrice: "$course.finalPrice",
        avgRating: "$course.avgRating",
        boughtCount: "$course.boughtCount",
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    results: popular.length,
    data: popular,
  });
});

// ============================================================
// 13. نمودار رشد فروش (Revenue Growth)
// ============================================================
export const getRevenueGrowth = catchAsync(async (req, res, next) => {
  const months = parseInt(req.query.months) || 6;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const growth = await Order.aggregate([
    {
      $match: {
        status: "success",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$finalPriceAfterDiscount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const data = growth.map((g) => ({
    year: g._id.year,
    month: g._id.month,
    label: `${g._id.year}-${String(g._id.month).padStart(2, "0")}`,
    revenue: +g.revenue.toFixed(2),
    orders: g.orders,
  }));

  return res.status(200).json({
    success: true,
    data,
  });
});

// ============================================================
// 14. دوره‌های رایگان و پرفروش
// ============================================================
export const getFreeCourses = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const courses = await Course.find({
    isFree: true,
    status: "approved",
    isPublished: true,
  })
    .sort({ boughtCount: -1 })
    .limit(limit)
    .select(
      "title image slug avgRating ratingCount boughtCount lessonCount totalDuration"
    )
    .lean();

  return res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});