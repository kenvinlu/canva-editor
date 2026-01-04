import moment from "moment";
export const cx = (...classNames) => classNames.filter(Boolean).join(" ");

export const sortBlogs = (blogs) => {
  return blogs
    .slice()
    .sort((a, b) =>
      moment(a.publishedAt).diff(moment(b.publishedAt))
    );
};
