import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LIBRARY_STATS } from '@/lib/constants/libraries'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="container-responsive py-12">
        {/* 헤더 */}
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-h1 font-bold text-primary">
            책크 📚
          </h1>
          <p className="text-h2 text-text-primary">
            송파구 도서관 통합 검색
          </p>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            송파구 내 {LIBRARY_STATS.total}개 도서관의 도서 소장 및 대출 가능 여부를
            한 번에 검색하세요
          </p>
        </header>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>공공도서관</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="library-public">공공</Badge>
                <p className="text-h2 font-bold text-primary">
                  {LIBRARY_STATS.public}개
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>스마트도서관</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="library-smart">스마트</Badge>
                <p className="text-h2 font-bold text-primary">
                  {LIBRARY_STATS.smart}개
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>교육청도서관</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="library-education">교육청</Badge>
                <p className="text-h2 font-bold text-primary">
                  {LIBRARY_STATS.education}개
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주요 기능 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>주요 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary text-h3">✓</span>
                <div>
                  <p className="text-body font-semibold text-text-primary">
                    통합 도서 검색
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    제목, 저자, 출판사로 24개 도서관을 한 번에 검색
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-h3">✓</span>
                <div>
                  <p className="text-body font-semibold text-text-primary">
                    실시간 대출 가능 여부
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    각 도서관의 실시간 대출 상태를 즉시 확인
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-h3">✓</span>
                <div>
                  <p className="text-body font-semibold text-text-primary">
                    위치 기반 정렬
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    가까운 도서관 순으로 자동 정렬
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-h3">✓</span>
                <div>
                  <p className="text-body font-semibold text-text-primary">
                    접근성 우선 디자인
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    모든 연령대가 쉽게 사용할 수 있는 UI
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-body text-text-secondary mb-6">
            Phase 1 환경 구축이 완료되었습니다! 🎉
            <br />
            Phase 2에서 검색 기능을 구현하겠습니다.
          </p>
          <Button variant="primary" disabled>
            도서 검색하기 (Phase 2에서 구현 예정)
          </Button>
        </div>
      </div>
    </main>
  )
}
