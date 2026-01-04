import styles from "./Skeleton.module.scss";

const BaseSkeleton = ({ className = "", style = {} }) => {
  return <span className={`${styles["base-skeleton"]} ${className || ""}`} style={{ ...style }} />;
};

export default BaseSkeleton;
