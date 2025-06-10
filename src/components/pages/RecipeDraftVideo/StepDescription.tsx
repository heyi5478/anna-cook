type StepDescriptionProps = {
  currentStep: number;
  currentDescription: string;
  onUpdateDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

/**
 * 步驟說明編輯元件
 */
export const StepDescription: React.FC<StepDescriptionProps> = ({
  currentStep,
  currentDescription,
  onUpdateDescription,
}) => (
  <div className="px-4 py-2">
    <div className="text-sm mb-2">步驟 {currentStep} 說明文字</div>
    <textarea
      value={currentDescription}
      onChange={onUpdateDescription}
      className="w-full bg-gray-100 p-3 rounded-md text-sm min-h-[100px] border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none"
      placeholder="請輸入此步驟的說明文字..."
    />
  </div>
);
