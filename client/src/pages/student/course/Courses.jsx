import { Button } from '@/components/ui/button'
import { filterOptions, sortOptions } from '@/config/config'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  ArrowUpDownIcon,
  BookOpen,
  GraduationCap,
  LayoutGridIcon,
  ListIcon,
} from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { StudentContext } from '@/context/student/studentContext'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { fetchStudentCoursesService } from '@/services/service'
import { createSearchParams, useSearchParams } from 'react-router-dom'

const Courses = () => {
  const [sort, setSort] = useState('price-lowtohigh')
  const [filters, setFilters] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')

  const {
    studentCourseList,
    setStudentCourseList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const createSearchParamsHelper = (filterParams) => {
    const queryParams = []
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(',')
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
    }
    return queryParams.join('&')
  }

  const handleFilter = (getSectionId, getCurrentOption) => {
    const current = filters[getSectionId] || []
    const isExist = current.includes(getCurrentOption.id)
    const updatedSection = isExist
      ? current.filter((id) => id !== getCurrentOption.id)
      : [...current, getCurrentOption.id]

    const updatedFilters = {
      ...filters,
      [getSectionId]: updatedSection,
    }

    setFilters(updatedFilters)
    sessionStorage.setItem('filters', JSON.stringify(updatedFilters))
  }

  const fetchAllStudentCourse = async (filters, sort) => {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    })
    const response = await fetchStudentCoursesService(query)
    if (response?.success) {
      setStudentCourseList(response?.data)
      setLoadingState(false)
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters)
    setSearchParams(new URLSearchParams(buildQueryStringForFilters))
  }, [filters])

  useEffect(() => {
    if (filters !== null && sort !== null) fetchAllStudentCourse(filters, sort)
  }, [filters, sort])

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('filters')
    }
  }, [])

  const filteredCourses = studentCourseList
    .filter((course) => {
      if (!filters || Object.keys(filters).length === 0) return true
      for (const key in filters) {
        if (filters[key].length > 0 && !filters[key].includes(course[key])) {
          return false
        }
      }
      return true
    })
    .filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const paginatedCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mt-5 mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-1 gap-4">
              <input
                type="text"
                className="border p-2 rounded-md w-full sm:w-auto"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 p-5 cursor-pointer"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span className="text-[16px] font-medium">Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value)}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        className="cursor-pointer"
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2">
              <Button
                className={
                  viewMode === 'list'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    : 'text-orange-500 border-orange-500 hover:bg-orange-50 cursor-pointer'
                }
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
              <Button
                className={
                  viewMode === 'grid'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    : 'text-orange-500 border-orange-500 hover:bg-orange-50 cursor-pointer'
                }
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGridIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {paginatedCourses.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-4">
                {paginatedCourses.map((courseItem) => (
                  <Card
                    key={courseItem?._id}
                    className="hover:shadow-md transition-shadow cursor-pointer rounded-lg overflow-hidden border border-gray-200"
                  >
                    <CardContent className="flex gap-4 p-4">
                      <div className="w-40 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={courseItem?.image}
                          alt={courseItem?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                            {courseItem?.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mb-1">
                            Created by{' '}
                            <span className="font-medium text-foreground">
                              {courseItem?.instructorName}
                            </span>
                          </p>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {courseItem?.outline?.length}{' '}
                              {courseItem?.outline?.length <= 1
                                ? 'Lecture'
                                : 'Lectures'}
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-1" />
                              {courseItem?.level?.toUpperCase()} Level
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-primary">
                              {courseItem?.pricing === 0
                                ? 'Free'
                                : `${courseItem?.pricing} VND`}
                            </p>
                            <button className="cursor-pointer text-sm font-bold px-3 py-1 rounded-md text-primary hover:bg-primary/10 transition-colors">
                              View More
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((courseItem) => (
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="w-full h-40 mb-4 overflow-hidden rounded-md">
                        <img
                          src={courseItem?.image}
                          alt="Course"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {courseItem?.outline?.length}{' '}
                        {courseItem?.outline?.length <= 1
                          ? 'Lecture'
                          : 'Lectures'}{' '}
                        · {courseItem?.level.toUpperCase()} Level
                      </p>
                      <p className="text-sm mt-1 text-muted-foreground">
                        By{' '}
                        <span className="font-semibold text-foreground">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3">
                        <p className="text-lg font-bold text-primary">
                          {courseItem?.pricing === 0
                            ? 'Free'
                            : `${courseItem?.pricing} VND`}
                        </p>
                        <button className="cursor-pointer text-sm font-bold px-3 py-1 rounded-md text-primary hover:bg-primary/10 transition-colors">
                          View More
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <p className="text-center text-muted-foreground">
              No courses found
            </p>
          )}
        </main>

        <aside className="w-full md:w-64 space-y-4">
          <div className="space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <div className="p-4 space-y-4" key={keyItem}>
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      className="flex font-medium items-center gap-3"
                      key={option.id}
                    >
                      <Checkbox
                        checked={filters[keyItem]?.includes(option.id) || false}
                        onCheckedChange={() => handleFilter(keyItem, option)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default Courses
