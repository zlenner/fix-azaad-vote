import { useEffect, useRef, useState } from 'react'
import { RiArrowDropLeftLine, RiArrowDropRightLine } from 'react-icons/ri'
import clsx from 'clsx'
import ImageZoom from 'react-image-zoom'
import useEvent from 'react-use/lib/useEvent'
import { Seat } from '../hooks/useData/useLoadData'

const DisplayPage = ({ constituency }: { constituency: Seat }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [imageHeight, setImageHeight] = useState<number>(0)

  useEffect(() => {
    setImageHeight(imageContainerRef.current?.clientHeight ?? 0)
  }, [])

  useEffect(() => {
    setSelectedPage(1)
  }, [constituency.seat])

  useEvent('resize', () => {
    setImageHeight(imageContainerRef.current?.clientHeight ?? 0)
  })

  if (!constituency.form33_data) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-red-500 text-white px-4 py-2 font-bold">
        Scanned ECP-Form 33
      </div>
      <div className="flex flex-col w-full flex-1 h-0">
        <div
          className="flex flex-1 h-0 file-container justify-center"
          ref={imageContainerRef}
        >
          <ImageZoom
            img={
              'https://files.azaadvote.com/' +
              constituency.form33_data.page_files[selectedPage - 1]
            }
            height={imageHeight}
            zoomPosition="original"
          />
        </div>
        <div className="flex flex-col">
          {constituency.form33_data.page_files.length > 1 ? (
            <div className="flex w-fit mb-4 mx-auto bg-gray-50 font-bold shadow rounded shadow-gray-300 px-3 py-2 relative bottom-6 items-center">
              <RiArrowDropLeftLine
                className={clsx(
                  'w-8 h-8 cursor-pointer hover:bg-gray-100 rounded active:bg-gray-200',
                  selectedPage === 1 && 'opacity-40 pointer-events-none'
                )}
                onClick={() => {
                  setSelectedPage((selectedPage) =>
                    Math.max(selectedPage - 1, 1)
                  )
                }}
              />
              <div className="mx-4">
                PAGE {selectedPage}/
                {constituency.form33_data?.page_files.length}
              </div>
              <RiArrowDropRightLine
                className={clsx(
                  'w-8 h-8 cursor-pointer hover:bg-gray-100 rounded active:bg-gray-200',
                  selectedPage ===
                    constituency.form33_data?.page_files.length &&
                    'opacity-40 pointer-events-none'
                )}
                onClick={() => {
                  setSelectedPage((selectedPage) =>
                    !constituency.form33_data
                      ? 0
                      : Math.min(
                          selectedPage + 1,
                          constituency.form33_data.page_files.length
                        )
                  )
                }}
              />
            </div>
          ) : (
            <div className="flex w-fit mb-4 mx-auto bg-gray-50 font-bold shadow rounded shadow-gray-300 px-3 py-2 relative bottom-6 items-center">
              <div className="mx-2">
                PAGE 1/{constituency.form33_data.page_files.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DisplayPage
