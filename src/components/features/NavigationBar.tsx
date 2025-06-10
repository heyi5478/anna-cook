import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type NavigationBarProps = {
  recipeId: number;
  currentTime: number;
};

/**
 * 上方導航欄元件
 */
export const NavigationBar = ({
  recipeId,
  currentTime,
}: NavigationBarProps) => {
  return (
    <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center z-20">
      <Link
        href={`/recipe-page/${recipeId}`}
        className="flex items-center text-white hover:text-gray-300 transition"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        <span className="underline">回到食譜</span>
      </Link>
      <div className="ml-auto text-white">
        {Math.floor(currentTime / 60)}:
        {(currentTime % 60).toFixed(0).padStart(2, '0')}
      </div>
    </div>
  );
};
