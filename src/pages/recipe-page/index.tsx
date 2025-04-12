import { NextPage } from 'next';
import { ProductCard } from '@/components/ui/adCard';

const RecipePage: NextPage = () => {
  return (
    <div className="grid gap-6">
      <ProductCard
        id="1"
        name="金蘭醬油"
        description="廣告敘述廣告敘述，廣告敘述廣告敘述，廣告敘述廣告敘述，廣告敘述廣告敘述，廣告敘述廣告敘述"
        price={120}
        imageUrl="/Rectangle 70.png"
      />
    </div>
  );
};

export default RecipePage;
