function SelectBox({ label, options, onChange }) {
  return (
    <div className="text-sm" >
      <select onChange={onChange}
        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        
      >
        <option value="" className = "text-sm text-gray-500" >
          {label}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt} className="text-sm">{opt}</option>
        ))}
      </select>
    </div>
  );
}
export default SelectBox;