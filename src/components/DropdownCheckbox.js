import React, { useState, useRef } from "react";

/**
 * DropdownCheckbox 컴포넌트
 * - 드롭다운 형식으로 다중 선택 가능한 체크박스 목록을 렌더링.
 * - 선택된 옵션들을 상위 컴포넌트에서 관리.
 *
 * props:
 * - label: 드롭다운 라벨 텍스트
 * - options: 선택 가능한 옵션 목록 (배열)
 * - selectedOptions: 현재 선택된 옵션 목록
 * - setSelectedOptions: 선택된 옵션을 업데이트하는 함수
 * - onConfirm: 사용자가 '선택 완료'를 눌렀을 때 호출되는 함수
 */
function DropdownCheckbox({ label, options, selectedOptions, setSelectedOptions, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 여부 상태
  const dropdownRef = useRef(null); // 드롭다운 영역 참조 (현재는 사용되지 않음)

  // 옵션을 토글(선택/해제)하는 함수
  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      // 이미 선택된 옵션이면 제거
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      // 선택되지 않은 옵션이면 추가
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 선택 완료 버튼 클릭 시
  const handleConfirm = () => {
    setIsOpen(false); // 드롭다운 닫기
    onConfirm();      // 상위 컴포넌트로 콜백 전달
  };

  return (
    <div className="relative mb-4">
      {/* 라벨 표시 */}
      <label className="block font-semibold mb-2">{label}</label>

      {/* 선택된 옵션을 보여주는 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)} // 클릭 시 드롭다운 열기/닫기
        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-left shadow-sm"
      >
        {/* 선택된 항목이 있으면 표시, 없으면 '선택하세요' */}
        {selectedOptions.length > 0 ? selectedOptions.join(", ") : "선택하세요"}
      </button>

      {/* 드롭다운 영역 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-64 overflow-y-auto p-3 shadow-md"
        >
          {/* 각 옵션을 체크박스로 렌더링 */}
          {options.map((option) => (
            <div key={option} className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)} // 체크 여부
                  onChange={() => toggleOption(option)}     // 토글 동작
                  className="mr-2"
                />
                {option}
              </label>
            </div>
          ))}

          {/* 선택 완료 버튼 */}
          <button
            className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
            onClick={handleConfirm}
          >
            선택 완료
          </button>
        </div>
      )}
    </div>
  );
}

export default DropdownCheckbox;