// 风景导航
export const scenicSpotNavList = [
  {
    src: "/images/scenic-spot-nav/natural.svg",
    key: "Natural",
    path: "/pages/list/list?type=自然风光",
    label: "自然风光",
  },
  {
    src: "/images/scenic-spot-nav/humanities.svg",
    key: "Humanities",
    path: "/pages/list/list?type=人文",
    label: "人文",
  },
  {
    src: "/images/scenic-spot-nav/patriotic.svg",
    key: "Patriotic",
    path: "/pages/list/list?type=爱国基地",
    label: "爱国基地",
  },
  {
    src: "/images/scenic-spot-nav/science.svg",
    key: "Science",
    path: "/pages/list/list?type=科技馆",
    label: "科技馆",
  },
  {
    src: "/images/scenic-spot-nav/university.svg",
    key: "University",
    path: "/pages/list/list?type=大学",
    label: "大学",
  },
].map((item) => {
  item.path += "&cloudName=scenic-spot";
  return item;
});

// 美食导航
export const cateNavList = [
  {
    src: "/images/cate-nav/hot-pot.svg",
    key: "Natural",
    path: "/pages/list/list?type=火锅",
    label: "火锅",
  },
  {
    src: "/images/cate-nav/counter-meal.svg",
    key: "Humanities",
    path: "/pages/list/list?type=其他",
    label: "其他",
  },
  {
    src: "/images/cate-nav/quick-meal.svg",
    key: "Patriotic",
    path: "/pages/list/list?type=快餐",
    label: "快餐",
  },
  {
    src: "/images/cate-nav/beverage.svg",
    key: "Science",
    path: "/pages/list/list?type=饮品",
    label: "饮品",
  },
  {
    src: "/images/cate-nav/bread.svg",
    key: "University",
    path: "/pages/list/list?type=面包",
    label: "面包",
  },
].map((item) => {
  item.path += "&cloudName=cate";
  return item;
});

// 控制台tab
export const doashboardTabs = [
  {
    title: "景点信息",
    index: 0,
  },
  {
    title: "餐厅信息",
    index: 1,
  },
  {
    title: "评论",
    index: 2,
  },
];

// 审核状态
export const EnumCommentStatus = {
  ALL: "ALL",
  NOT_AUDIT: "NOT_AUDIT",
  AUDIT: "AUDIT",
};
