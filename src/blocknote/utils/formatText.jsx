export const formatText = (text) =>
  text
    ?.split("<br>")
    ?.map((line, index) => (
      <p
        key={index}
        style={{ margin: "0.1em 0" }}
        dangerouslySetInnerHTML={{ __html: line }}
      ></p>
    ));
