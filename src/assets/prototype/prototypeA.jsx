import GlobalStyle from "./GlobalStyle";

const PrototypeA = () => {
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div>
        {/* font type */}
        <h1>font type = poppins</h1>
        {/* topic font size */}
        <h1 className={GlobalStyle.headingLarge}>Topic</h1>
        {/* text font size */}
        <h1 className={GlobalStyle.headingSmall}>Text</h1>
      </div>
      <br />
      {/* button */}
      <div className="flex gap-4">
        <h1>Button 01</h1>
        <button className={GlobalStyle.buttonPrimary}>Submit</button>
      </div>
      <br />
      {/* textbox */}
      <div className="flex gap-4">
        <h1>Textbox</h1>
        <input
          type="text"
          placeholder="Text here"
          className={GlobalStyle.inputText}
        />
      </div>
      <br />
      {/* dropdown */}
      <div className="flex gap-4">
        <h1>Select Box</h1>
        <select className={GlobalStyle.selectBox}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
    </div>
  );
};

export default PrototypeA;
