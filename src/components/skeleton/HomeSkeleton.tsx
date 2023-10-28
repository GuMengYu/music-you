import { Skeleton } from '@mui/material'
import GridRow from '@/components/GridRow'
import { GridType } from '@/hooks/useResponsiveGrid'

export default function HomePageSkeleton() {
  return (<div className='flex flex-col gap-4'>
    <div>
      <div className='mb-3'>
        <Skeleton variant="text" className='w-24' sx={{ fontSize: '1.5rem', lineHeight: 1.334 }}/>
      </div>
      <GridRow rowType={GridType.B}>
        <Skeleton variant="rectangular" height={76} sx={{ borderRadius: 4 }}/>
        <Skeleton variant="rectangular" height={76} sx={{ borderRadius: 4 }}/>
        <Skeleton variant="rectangular" height={76} sx={{ borderRadius: 4 }}/>
      </GridRow>
    </div>
    <div>
      <div className='mb-3'>
        <Skeleton variant="text" className='w-24' sx={{ fontSize: '1.5rem', lineHeight: 1.334 }}/>
      </div>
      <GridRow rowType={GridType.A}>
        {[1, 2, 3, 4].map(i => (<div key={i}>
          <div className='aspect-square'>
            <Skeleton className='h-full' height='100%' variant="rectangular" sx={{ borderRadius: 4 }}/>
          </div>
          <div className='px-3 pt-4 pb-6'>
            <Skeleton variant="text" className='w-full' sx={{ fontSize: '0.875rem', lineHeight: 1.57 }}/>
          </div>
        </div>))}

      </GridRow>
    </div>
    <div>
      <div className='mb-3'>
        <Skeleton variant="text" className='w-24' sx={{ fontSize: '1.5rem', lineHeight: 1.334 }}/>
      </div>
      <GridRow rowType={GridType.A}>
        {[1, 2, 3, 4].map(i => (<div key={i}>
          <div className='aspect-square'>
            <Skeleton className='h-full' height='100%' variant="rectangular" sx={{ borderRadius: 4 }}/>
          </div>
          <div className='px-3 pt-4 pb-6'>
            <Skeleton variant="text" className='w-full' sx={{ fontSize: '0.875rem', lineHeight: 1.57 }}/>
          </div>
        </div>))}

      </GridRow>
    </div>
    </div>)
}
