import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { COMMON_TEXTS } from '@/lib/constants/messages';

type SubmitButtonProps = {
  onSubmit: () => void;
  submitting: boolean;
};

/**
 * 提交按鈕元件
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  submitting,
}) => (
  <div className="px-4 py-2">
    <Button
      variant="default"
      className="w-full bg-gray-500 text-white rounded-md py-2 flex items-center justify-center"
      onClick={onSubmit}
      disabled={submitting}
    >
      <Check className="h-4 w-4 mr-2" />
      {submitting ? COMMON_TEXTS.SUBMITTING : '完成草稿'}
    </Button>
  </div>
);
