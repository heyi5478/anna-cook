import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { AuthorRecipesResponse } from '@/types/api';
import {
  draftTabContainerVariants,
  statusMessageVariants,
  countTextVariants,
  loadingStateVariants,
  draftCardInteractionVariants,
  checkboxVariants,
  itemListContainerVariants,
  itemContentVariants,
  dialogVariants,
  dialogIconVariants,
  dialogButtonContainerVariants,
  dialogActionButtonVariants,
} from '@/styles/cva/user-center';
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
    return (
      <div
        className={cn(
          loadingStateVariants({ state: 'loading', size: 'relaxed' }),
        )}
      >
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          loadingStateVariants({ state: 'error', size: 'relaxed' }),
        )}
      >
        {error}
      </div>
    );
  }

  if (draftRecipes.length === 0) {
    return (
      <div
        className={cn(
          loadingStateVariants({ state: 'empty', size: 'relaxed' }),
        )}
      >
        目前沒有草稿
      </div>
    );
  }

  return (
    <div className={cn(draftTabContainerVariants())}>
      {deleteSuccess && (
        <div className={cn(statusMessageVariants({ variant: 'success' }))}>
          {deleteSuccess}
        </div>
      )}

      {deleteError && (
        <div className={cn(statusMessageVariants({ variant: 'error' }))}>
          {deleteError}
        </div>
      )}

      <p className={cn(countTextVariants())}>
        共{draftRecipes.length || 0}篇食譜
      </p>

      {draftRecipes.map((recipe: AuthorRecipesResponse['data'][0]) => {
        return (
          <div
            key={recipe.recipeId}
            className={cn(itemListContainerVariants())}
          >
            {isDeleteMode && (
              <div
                className={cn(
                  checkboxVariants({
                    state: selectedDrafts.includes(recipe.recipeId)
                      ? 'checked'
                      : 'unchecked',
                  }),
                )}
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
            <div
              className={cn(itemContentVariants({ withMargin: isDeleteMode }))}
            >
              <div
                onClick={() => {
                  if (isDeleteMode) {
                    atToggleDraftSelection(recipe.recipeId);
                  } else {
                    atDraftCardClick(recipe.recipeId);
                  }
                }}
                className={cn(
                  draftCardInteractionVariants({
                    state:
                      isDeleteMode && selectedDrafts.includes(recipe.recipeId)
                        ? 'selected'
                        : 'normal',
                  }),
                )}
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
        <div
          className={cn(
            dialogButtonContainerVariants({ direction: 'horizontal' }),
          )}
        >
          <Button
            variant="outline"
            onClick={atToggleDeleteMode}
            className={cn(dialogActionButtonVariants({ variant: 'cancel' }))}
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
                className={cn(
                  dialogActionButtonVariants({ variant: 'confirm' }),
                )}
                disabled={selectedDrafts.length === 0}
              >
                {COMMON_TEXTS.CONFIRM}
                {COMMON_TEXTS.DELETE}
                {selectedDrafts.length > 0 ? `(${selectedDrafts.length})` : ''}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={cn(
                dialogVariants({ size: 'default', withBorder: true }),
              )}
              style={{ maxWidth: '400px' }}
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className={cn(dialogIconVariants())}>
                  <AlertCircle className="h-6 w-6 text-neutral-500" />
                </div>
                <h2 className="text-lg font-medium text-center mb-6">
                  是否{COMMON_TEXTS.DELETE}所選食譜?
                </h2>
                <div
                  className={cn(
                    dialogButtonContainerVariants({ fullWidth: true }),
                  )}
                >
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className={cn(
                        dialogActionButtonVariants({ variant: 'cancelGray' }),
                      )}
                    >
                      {COMMON_TEXTS.CANCEL}
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={atConfirmDelete}
                    className={cn(
                      dialogActionButtonVariants({ variant: 'delete' }),
                    )}
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
