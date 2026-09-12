import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useQuery } from 'convex/react'
import { Route } from './students_.$id_.edit'
import type * as StudentFormModule from '~/components/forms/student-form'
import { useAuth } from '~/lib/auth'

const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: 'student-1' })))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  createFileRoute: vi.fn(() => (options: any) => ({
    options,
    useParams: mockUseParams,
  })),
}))

vi.mock(
  '~/components/forms/student-form',
  async (importOriginal: () => Promise<typeof StudentFormModule>) => {
    const actual = await importOriginal()
    return {
      ...actual,
      StudentForm: () => <div data-testid="student-form" />,
    }
  },
)

vi.mock('~/components/custom/student-photo-upload', () => ({
  StudentPhotoUpload: () => <div data-testid="student-photo-upload" />,
}))

const baseStudentDetail = {
  _id: 'student-1',
  studentCode: '1001',
  fullName: 'Nguyễn Thị A',
  saintName: 'Maria',
  dateOfBirth: '2015-05-01',
  gender: 'female',
  isActive: true,
  isDeleted: false,
  previousParish: '',
  previousDiocese: '',
  address: null,
  sacraments: [],
  guardians: [],
  siblings: [],
  enrollments: [],
}

const baseGuardianData = {
  guardians: [],
}

describe('EditStudentPage / EditStudentForm', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      user: {
        _id: 'user-1',
        userDocId: 'catechist-1',
        role: 'user',
      } as any,
    })
  })

  test('renders contactAdmin message when student is not editable', () => {
    vi.mocked(useQuery).mockImplementation((queryRef: any, _args?: any) => {
      const path = queryRef?.[Symbol.for('functionName')]
      if (path === 'students:getStudentDetail') {
        return { ...baseStudentDetail, isEditable: false }
      }
      if (path === 'students:get') {
        return baseGuardianData
      }
      return undefined
    })

    const Component = (Route as any).options.component
    render(<Component />)

    expect(screen.getByText('common.contactAdmin')).toBeInTheDocument()
    expect(screen.queryByTestId('student-form')).not.toBeInTheDocument()
  })

  test('renders edit form when student is editable', () => {
    vi.mocked(useQuery).mockImplementation((queryRef: any, _args?: any) => {
      const path = queryRef?.[Symbol.for('functionName')]
      if (path === 'students:getStudentDetail') {
        return { ...baseStudentDetail, isEditable: true }
      }
      if (path === 'students:get') {
        return baseGuardianData
      }
      return undefined
    })

    const Component = (Route as any).options.component
    render(<Component />)

    expect(screen.queryByText('common.contactAdmin')).not.toBeInTheDocument()
    expect(screen.getByTestId('student-form')).toBeInTheDocument()
    expect(screen.getByTestId('student-photo-upload')).toBeInTheDocument()
  })
})
