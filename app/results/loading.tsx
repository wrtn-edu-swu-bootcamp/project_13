import { Loading } from '@/components/ui/loading'

export default function ResultsLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <Loading />
      <p className="mt-6 text-body text-text-secondary">
        도서관 정보를 불러오는 중...
      </p>
    </div>
  )
}
