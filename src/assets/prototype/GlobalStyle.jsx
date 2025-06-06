const GlobalStyle = {
  
  // General Font Settings
  fontPoppins: "font-poppins",

  // Text Styles
  headingLarge: "text-[40px] font-semibold",
  headingMedium: "text-[18px]",
  headingSmall: "text-[16px]",
  paragraph: "text-gray-700",
  remarkTopic: "block font-medium mb-2",

  // Button Styles
  buttonPrimary: "px-5 py-1 text-[#00256A] border-2 border-[#00256A] rounded-full hover:bg-[#00256A] hover:text-white transition-all",
  buttonRemove: "px-5 py-1 text-[#950606] border-2 border-[#950606] rounded-full hover:bg-[#950606] hover:text-white transition-all",

  // Input Styles
  inputText: "px-5 py-1 opacity-80 border-2 border-[#0056A2] border-opacity-30 rounded-lg bg-white text-gray-600",
  remark: "px-5 py-1 opacity-80 border-2 border-[#0056A2] border-opacity-30 rounded-lg bg-white text-gray-600 w-2/4",
  inputSearch: "px-4 py-2 pl-10 w-64 rounded-full border border-blue-400 bg-blue-200 text-sm text-blue-900 placeholder:text-blue-600 outline-none focus:ring focus:ring-blue-400 focus:border-blue-500 opacity-80",

  // Select/Dropdown Styles
  selectBox: "py-1 border-2 border-[#0056A2] border-opacity-30 rounded-lg bg-white text-left w-full max-w-40 sm:max-w-48 md:max-w-56 lg:max-w-64",

  // Card Styles
  cardContainer: "p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 w-6/12",

  // case count bar
  caseCountBar: "flex flex-col space-y-4 p-4 bg-[#E1E4F5] border-2 border-[#b1c4e9] rounded-3xl mb-4 shadow-lg bg-opacity-40",
  countBarTopic: "text-xl font-semibold",
  countBarSubTopicContainer: "flex flex-wrap gap-16 justify-center items-center",
  countBarMainBox: "shadow-md py-3 px-8 rounded-3xl flex flex-col items-center bg-[#00256A] text-white w-full sm:w-auto",
  countBarMainTopic: "text-xl font-bold",
  countBarSubBox: "shadow-md py-3 px-8 rounded-3xl flex flex-col items-center bg-gray-300 border w-full sm:w-auto",
  countBarSubTopic: "font-bold",

  // mini case count bar
  miniCaseCountBar: "flex flex-col space-y-4 p-4 bg-[#E1E4F5] border-2 border-[#b1c4e9] rounded-3xl mb-4 shadow-lg bg-opacity-40 w-fit",
  miniCountBarTopic: "text-xl font-semibold",
  miniCountBarSubTopicContainer: "flex flex-wrap gap-16 justify-center items-center",
  miniCountBarMainBox: "shadow-md py-3 px-8 rounded-3xl flex flex-col items-center justify-center bg-[#00256A] text-white w-[250px] h-[100px] bg-cover",
  miniCountBarMainTopic: "text-xl font-bold",
  miniCountBarSubBox: "shadow-md py-3 px-8 rounded-3xl flex flex-col items-center justify-center bg-gray-300 border w-[250px] h-[100px] bg-cover",
  miniCountBarSubTopic: "font-bold",
  


  // Date Picker
  datePickerContainer: "flex gap-4 items-center p-2  w-fit",
  dataPickerDate: "text-gray-600 font-medium",

  // SearchBar
  searchBarContainer: "relative bg-blue-50 bg-opasity-60 rounded-full",
  searchBarIcon: "absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400",

  // Table Styles
  tableContainer: "overflow-hidden rounded-lg shadow-md bg-[#77BFFF] bg-opacity-25 table-auto", // No outer border
  table: "min-w-full text-sm text-left text-gray-500", // No outer border
  thead: "text-xs text-[#718EBF] uppercase bg-gray-500 bg-opacity-75", // No border in the header
  tableHeader: "text-[18px] text-[#3B5E99] uppercase bg-gray-50 bg-opacity-75 px-6 py-3 text-center border-r border-white", // Border only between columns
  tableRowEven: "bg-white bg-opacity-75 py-6", // No border on the outer edges, only between columns
  tableRowOdd: "bg-gray-50 bg-opacity-50 py-6", // No border on the outer edges, only between columns
  tableData: "text-[16px] text-left py-4 text-black pl-2 border-r border-white", // Border between columns
  tableCurrency: "text-[16px] text-right py-4 text-red-500 pr-2 border-r border-white", // Border between columns

  // Miscellaneous
  errorText: "text-red-500 mt-2 text-[16px] text-center",
  flexCenter: "flex justify-center items-center gap-6",
  shadowBox: "shadow-md py-3 px-8 rounded-3xl flex flex-col items-center",

  // Navigation Buttons
  navButtonContainer: "flex justify-center space-x-4 mt-4",
  navButton: "flex items-center gap-2 px-2 py-2 text-[#00256A] border-2 border-[#00256A] rounded-full hover:bg-blue-100 transition-all",

  // Month Counter
  monthCounterContainer: "flex items-center border border-gray-500 rounded-md w-24",
  monthCounterNumber: "text-center w-full border-none outline-none bg-transparent",
  monthCounterButton: "flex flex-col border-l border-gray-500",
  monthCounterButtonIcon: "px-2 text-xs hover:bg-gray-200",

  // Pop_up box
  popupBoxContainer: "fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center",
  popupBoxBody: "bg-white p-6 rounded-md shadow-lg w-3/4",
  popupBox: "flex justify-between items-center mb-4",
  popupBoxTitle: "text-xl font-bold flex-grow text-center",
  popupBoxCloseButton: "text-red-500 text-lg font-bold",

};

export default GlobalStyle;