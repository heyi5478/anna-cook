import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
import { DraftRecipeCard } from './DraftRecipeCard';

interface DraftTabContentProps {
  isLoadingDrafts: boolean;
  error: string | null;
  draftRecipes: AuthorRecipesResponse['data'];
  isDeleteMode: boolean;
  selectedDrafts: number[];
  deleteDialogOpen: boolean;
  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;
  getFullImageUrl: (url: string) => string;
  loadDraftRecipes: () => void;
  atToggleDraftSelection: (recipeId: number) => void;
  atDraftCardClick: (recipeId: number) => void;
  atToggleDeleteMode: () => void;
  atShowDeleteConfirm: () => void;
  atConfirmDelete: () => void;
  setDeleteDialogOpen: (open: boolean) => void;
}

/**
 * 草稿標籤頁內容元件
 */
export function DraftTabContent({
  isLoadingDrafts,
  error,
  draftRecipes,
  isDeleteMode,
  selectedDrafts,
  deleteDialogOpen,
  deleteLoading,
  deleteSuccess,
  deleteError,
  getFullImageUrl,
  loadDraftRecipes,
  atToggleDraftSelection,
  atDraftCardClick,
  atToggleDeleteMode,
  atShowDeleteConfirm,
  atConfirmDelete,
  setDeleteDialogOpen,
}: DraftTabContentProps) {
  if (isLoadingDrafts) {
    return <div className="text-center py-8">{COMMON_TEXTS.LOADING}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (draftRecipes.length === 0) {
    return <div className="text-center py-8">目前沒有草稿</div>;
  }

  return (
    <div className="space-y-4">
      {deleteSuccess && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 mb-4">
          {deleteSuccess}
        </div>
      )}

      {deleteError && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4">
          {deleteError}
        </div>
      )}

      <p className="text-neutral-500 mb-2">
        共{draftRecipes.length || 0}篇食譜
      </p>

      {draftRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => {
        // 計算卡片的 className
        let cardClassName =
          'hover:bg-gray-50 active:bg-gray-100 cursor-pointer rounded-md transition-all';
        if (isDeleteMode && selectedDrafts.includes(recipe.recipeId)) {
          cardClassName =
            'bg-orange-50 border border-orange-200 rounded-md cursor-pointer transition-all';
        }

        return (
          <div key={recipe.recipeId} className="flex items-center">
            {isDeleteMode && (
              <div
                className={`mr-2 w-6 h-6 flex-shrink-0 border rounded flex items-center justify-center cursor-pointer ${
                  selectedDrafts.includes(recipe.recipeId)
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-neutral-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  atToggleDraftSelection(recipe.recipeId);
                }}
              >
                {selectedDrafts.includes(recipe.recipeId) && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            )}
            <div className={`flex-1 ${isDeleteMode ? 'ml-1' : ''}`}>
              <div
                onClick={() => {
                  if (isDeleteMode) {
                    atToggleDraftSelection(recipe.recipeId);
                  } else {
                    atDraftCardClick(recipe.recipeId);
                  }
                }}
                className={cardClassName}
              >
                <DraftRecipeCard
                  title={recipe.title}
                  description={recipe.description}
                  imageSrc={getFullImageUrl(recipe.coverPhoto)}
                  recipeId={recipe.recipeId}
                  isDeleteMode={isDeleteMode}
                  onStatusChanged={loadDraftRecipes}
                />
              </div>
            </div>
          </div>
        );
      })}

      {isDeleteMode && (
        <div className="flex justify-between mt-6 space-x-4">
          <Button
            variant="outline"
            onClick={atToggleDeleteMode}
            className="flex-1 border border-neutral-200"
          >
            {COMMON_TEXTS.CANCEL}刪除
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedDrafts.length > 0) {
                    atShowDeleteConfirm();
                  }
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={selectedDrafts.length === 0}
              >
                {COMMON_TEXTS.CONFIRM}
                {COMMON_TEXTS.DELETE}
                {selectedDrafts.length > 0 ? `(${selectedDrafts.length})` : ''}
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-md bg-white rounded-lg p-6 border border-gray-200 shadow-lg"
              style={{ maxWidth: '400px' }}
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-neutral-500" />
                </div>
                <h2 className="text-lg font-medium text-center mb-6">
                  是否{COMMON_TEXTS.DELETE}所選食譜?
                </h2>
                <div className="flex justify-between w-full gap-4">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="flex-1 border border-neutral-300 text-black font-normal"
                    >
                      {COMMON_TEXTS.CANCEL}
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={atConfirmDelete}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-normal"
                    disabled={deleteLoading}
                  >
                    {deleteLoading
                      ? COMMON_TEXTS.SUBMITTING
                      : COMMON_TEXTS.CONFIRM}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
