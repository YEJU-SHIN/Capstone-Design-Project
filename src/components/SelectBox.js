function SelectBox({ label, options, onChange }) {
  return (
    <div className="">
      <select onChange={onChange}
        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        
      >
        <option value="" >{label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      
      



    </div>
  );
}
export default SelectBox;