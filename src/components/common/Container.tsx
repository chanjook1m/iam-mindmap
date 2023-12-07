import "./container.styles.css";

type ContainerType = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerType) {
  return <div className="container">{children}</div>;
}
