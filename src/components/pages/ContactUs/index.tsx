import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ISSUE_TYPES } from '@/lib/constants';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { contactFormSchema, type ContactFormValues } from './schema';
// 導入 CVA 樣式系統
import {
  contactPageVariants,
  contactFormVariants,
  contactFieldVariants,
  contactButtonVariants,
  contactStyles,
} from './styles';

/**
 * 聯絡我們表單元件，提供使用者留言功能
 * 使用 CVA 樣式系統統一管理所有視覺樣式
 * 保持完整的表單驗證和提交功能
 */
export default function ContactUs() {
  // 初始化表單
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // 監聽表單狀態以應用對應樣式
  const { isSubmitting } = form.formState;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  /**
   * 處理表單提交 - 保持原有邏輯不變
   */
  const atSubmit = (data: ContactFormValues) => {
    console.log('表單資料:', data);
    // 這裡可以加入 API 呼叫來處理表單提交
    alert('留言已送出！我們會盡快回覆您。');
    form.reset();
  };

  /**
   * 處理取消留言 - 重置表單到初始狀態
   */
  const atCancel = () => {
    form.reset();
  };

  // 計算表單狀態樣式
  const getFormState = () => {
    if (isSubmitting) return 'submitting';
    if (hasErrors) return 'error';
    return 'default';
  };

  // 計算頁面狀態樣式
  const getPageState = () => {
    return isSubmitting ? 'loading' : 'default';
  };

  return (
    <>
      {/* 麵包屑導航區域 - 使用 CVA 麵包屑樣式 */}
      <Breadcrumb className={contactStyles.breadcrumb.default}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>聯絡我們</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主要內容區域 - 使用 CVA 頁面容器樣式 */}
      <main
        className={contactPageVariants({
          spacing: 'default',
          state: getPageState(),
        })}
      >
        {/* 頁面標題 - 使用 CVA 區塊樣式 */}
        <h1 className={contactStyles.section.title}>聯絡我們</h1>

        {/* Logo 區塊 - 使用 CVA Logo 樣式變體 */}
        <div className={contactStyles.section.logo}>
          <div className={contactStyles.section.logoBox}>Logo</div>
        </div>

        {/* 介紹文字區塊 - 使用 CVA 描述樣式 */}
        <div className={contactStyles.section.description}>
          <p>感謝您使用我們的食譜平台。</p>
          <p>如有任何問題、建議或合作機會，請填寫以下表單，我們將盡快回覆。</p>
        </div>

        {/* 聯絡表單 - 使用 CVA 表單容器樣式 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(atSubmit)}
            className={contactFormVariants({
              state: getFormState(),
            })}
          >
            {/* 姓名欄位 - 使用 CVA 表單欄位樣式 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="會員名稱"
                      className={contactFieldVariants({
                        type: 'input',
                        state: fieldState.error ? 'error' : 'default',
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 電子信箱欄位 - 使用 CVA 表單欄位樣式 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>電子信箱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="會員電子信箱"
                      className={contactFieldVariants({
                        type: 'input',
                        state: fieldState.error ? 'error' : 'default',
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 問題類型欄位 - 使用 CVA 選擇框樣式 */}
            <FormField
              control={form.control}
              name="issueType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>問題類型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={contactFieldVariants({
                          type: 'select',
                          state: fieldState.error ? 'error' : 'default',
                        })}
                      >
                        <SelectValue
                          placeholder={VALIDATION_MESSAGES.SELECT_ISSUE_TYPE}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ISSUE_TYPES.map((issueType) => (
                        <SelectItem key={issueType} value={issueType}>
                          {issueType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 留言內容欄位 - 使用 CVA Textarea 樣式 */}
            <FormField
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>留言內容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="請詳細描述您的問題或建議..."
                      className={contactFieldVariants({
                        type: 'textarea',
                        state: fieldState.error ? 'error' : 'default',
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 按鈕區域 - 使用 CVA 按鈕群組和按鈕樣式 */}
            <div className={contactStyles.section.buttonGroup}>
              <Button
                type="submit"
                className={contactButtonVariants({
                  variant: 'primary',
                  size: 'full',
                  state: isSubmitting ? 'submitting' : 'default',
                })}
                disabled={isSubmitting}
              >
                {isSubmitting ? '送出中...' : '送出留言'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className={contactStyles.button.cancel}
                onClick={atCancel}
                disabled={isSubmitting}
              >
                {COMMON_TEXTS.CANCEL}留言
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
