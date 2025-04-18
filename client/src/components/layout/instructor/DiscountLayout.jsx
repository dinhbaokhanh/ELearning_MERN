import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreateDiscount from '@/pages/instructor/Discount/CreateDiscount'
import Discount from '@/pages/instructor/Discount/Discount'
import React from 'react'

const DiscountLayout = () => {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="discount" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discount">Your Discounts</TabsTrigger>
          <TabsTrigger value="create-discount">Create Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="discount">
          <Discount />
        </TabsContent>

        <TabsContent value="create-discount">
          <CreateDiscount />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DiscountLayout
