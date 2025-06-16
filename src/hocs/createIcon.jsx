const createIcon = (src) => {
  const defaultSize = 24;

  // Define a React component that handles size and additional styles internally
  const IconComponent = ({ size = defaultSize, style = {}, ...props }) => {
    // Apply the styles to the wrapper div
    return (
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
        {...props}
      >
        <img
          src={src}
          alt="Icon"
          // layout="fill"
          // objectFit="cover"
          style={{ position: "absolute", left: 0, right: 0 }}
        />
      </div>
    );
  };

  // Enhance the component to be callable, with optional size and style parameters
  function Icon({ size, style = {}, ...props } = {}) {
    return <IconComponent size={size} style={style} {...props} />;
  }

  return Icon;
};

export default createIcon;
