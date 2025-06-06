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
import { contactFormSchema, type ContactFormValues } from './schema';

/**
 * 聯絡我們表單元件，提供使用者留言功能
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

  /**
   * 處理表單提交
   */
  const atSubmit = (data: ContactFormValues) => {
    console.log('表單資料:', data);
    // 這裡可以加入 API 呼叫來處理表單提交
    alert('留言已送出！我們會盡快回覆您。');
    form.reset();
  };

  /**
   * 處理取消留言
   */
  const atCancel = () => {
    form.reset();
  };

  return (
    <>
      {/* 麵包屑導航 */}
      <Breadcrumb className="p-4">
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

      {/* 主要內容 */}
      <main className="px-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">聯絡我們</h1>

        {/* Logo 區塊 */}
        <div className="flex justify-center my-6">
          <div className="bg-gray-100 px-8 py-3 rounded">Logo</div>
        </div>

        {/* 介紹文字 */}
        <div className="text-gray-700 mb-6">
          <p>感謝您使用我們的食譜平台。</p>
          <p>如有任何問題、建議或合作機會，請填寫以下表單，我們將盡快回覆。</p>
        </div>

        {/* 聯絡表單 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(atSubmit)} className="space-y-4">
            {/* 姓名欄位 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="會員名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 電子信箱欄位 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子信箱</FormLabel>
                  <FormControl>
                    <Input placeholder="會員電子信箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 問題類型欄位 */}
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>問題類型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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

            {/* 留言內容欄位 */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>留言內容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="請詳細描述您的問題或建議..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 按鈕區域 */}
            <div className="space-y-2 pt-4">
              <Button
                type="submit"
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                送出留言
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={atCancel}
              >
                取消留言
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
