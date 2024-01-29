import { useState } from 'react'
import { Constituency } from './models'
import { RiArrowDropLeftLine, RiArrowDropRightLine } from 'react-icons/ri'
import clsx from 'clsx'

const DisplayPage = ({ constituency }: { constituency: Constituency }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-red-500 text-white px-4 py-2 font-bold">
        Scanned ECP-Form 33
      </div>
      <img
        className="w-full flex-1 h-0"
        src={
          'https://files.azaadvote.com/' +
          constituency.PageFiles[selectedPage - 1]
        }
        style={{
          objectFit: 'contain'
        }}
      ></img>
      {constituency.PageFiles.length > 1 ? (
        <div className="flex w-fit mb-4 mx-auto bg-gray-50 font-bold shadow rounded shadow-gray-300 px-3 py-2 relative bottom-6 items-center">
          <RiArrowDropLeftLine
            className={clsx(
              'w-8 h-8 cursor-pointer hover:bg-gray-100 rounded active:bg-gray-200',
              selectedPage === 1 && 'opacity-40 pointer-events-none'
            )}
            onClick={() => {
              setSelectedPage((selectedPage) => Math.max(selectedPage - 1, 1))
            }}
          />
          <div className="mx-4">
            PAGE {selectedPage}/{constituency.PageFiles.length}
          </div>
          <RiArrowDropRightLine
            className={clsx(
              'w-8 h-8 cursor-pointer hover:bg-gray-100 rounded active:bg-gray-200',
              selectedPage === constituency.PageFiles.length &&
                'opacity-40 pointer-events-none'
            )}
            onClick={() => {
              setSelectedPage((selectedPage) =>
                Math.min(selectedPage + 1, constituency.PageFiles.length)
              )
            }}
          />
        </div>
      ) : (
        <div className="flex w-fit mb-4 mx-auto bg-gray-50 font-bold shadow rounded shadow-gray-300 px-3 py-2 relative bottom-6 items-center">
          <div className="mx-2">PAGE 1/{constituency.PageFiles.length}</div>
        </div>
      )}
    </div>
  )
}

export default DisplayPage
