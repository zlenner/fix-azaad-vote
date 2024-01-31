import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Constituency, Provinces } from './models'
import Fuse from 'fuse.js'
import { Popover } from 'react-tiny-popover'
import MenuItem from './MenuItem'
import { RiArrowDropDownLine } from 'react-icons/ri'

const SearchConstituency = ({
  selected,
  constituencies
}: {
  selected: Constituency | undefined
  constituencies: {
    [key: string]: Constituency
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const fuse = useMemo(() => {
    return new Fuse(Object.values(constituencies), {
      keys: ['Constituency No', 'Constituency Name']
    })
  }, [JSON.stringify(constituencies)])

  const [searchValue, setSearchValue] = useState<string>('')

  const searchResults = useMemo(() => {
    if (searchValue.length > 0) {
      return fuse
        .search(searchValue)
        .slice(0, 20)
        .map((result) => result.item)
    } else {
      return Object.values(constituencies).sort((a, b) => {
        const aNo = parseInt(a['Constituency No'].slice(3))
        const bNo = parseInt(b['Constituency No'].slice(3))
        return aNo - bNo
      })
    }
  }, [searchValue])

  const navigate = useNavigate()

  const PROVINCE_COLORS: {
    [key in Provinces]: string
  } = {
    Balochistan: '#3b82f6', // purple

    Punjab: '#a855f7', // blue
    Sindh: '#fbbf24', // yellow
    KPK: '#14b8a6' // green
  }

  return (
    <Popover
      isOpen={open}
      onClickOutside={() => setOpen(false)}
      positions={['bottom', 'left']}
      containerClassName="flex w-full px-4 py-4"
      containerStyle={{
        maxWidth: '800px'
      }}
      content={
        <div
          className="flex flex-col w-full rounded bg-white mt-3 !shadow !shadow-gray-400"
          style={{
            maxHeight: 'calc(100vh - 100px)',
            overflow: 'auto'
          }}
        >
          <div className="flex sticky top-0 left-0 bg-white px-3 py-4">
            <input
              onInput={(e) => setSearchValue(e.currentTarget.value)}
              placeholder="Search Constituency"
              value={searchValue}
              className="flex w-full py-2 bg-white !ring-0 !shadow !shadow-gray-300 rounded-md px-3 py-1 font-bold text-red-600 font-mono tracking-tighter !border !border-transparent active:shadow-none active:border-gray-100 transition"
            ></input>
          </div>
          <div className="flex flex-col w-full px-3 mb-3">
            {searchResults?.map((result) => (
              <div
                key={result['Constituency No']}
                className="flex font-mono py-1 hover:bg-red-50 px-2 cursor-pointer text-gray-700 hover:border-l-8 border-red-500"
                onClick={() => {
                  setOpen(false)
                  navigate('/' + result['Constituency No'])
                }}
              >
                <div
                  className="font-bold min-w-fit mr-4 text-white px-2"
                  style={{
                    backgroundColor: PROVINCE_COLORS[result.province]
                  }}
                >
                  {result['Constituency No']}
                </div>
                <div className="text-right">{result['Constituency Name']}</div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="flex min-w-max h-full">
        <MenuItem
          className="cursor-pointer hover:bg-emerald-200 pr-1"
          onClick={() => setOpen(true)}
        >
          <div>{selected?.['Constituency No'] ?? 'SELECT'}</div>
          <RiArrowDropDownLine className="w-8 h-8 ml-1" />
        </MenuItem>
      </div>
    </Popover>
  )
}

export default SearchConstituency
