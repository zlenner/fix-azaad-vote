import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Fuse from 'fuse.js'
import { Popover } from 'react-tiny-popover'
import MenuItem from './MenuItem'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { Seat } from '../hooks/useData/useLoadData'
import { Province } from '../hooks/useData/loadForm33'
import { useData } from '../hooks/useData'

const SearchConstituency = ({
  selected,
  constituencies
}: {
  selected: Seat | undefined
  constituencies: {
    [key: string]: Seat
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [data] = useData()
  const fuse = useMemo(() => {
    const fuseOptions = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: [
        'seat',
        'pti_data.constituency_name',
        'pti_data.candidate_name',
        'form33_data.constituency_name'
      ]
    }

    return new Fuse(
      Object.values(data.seats).filter((seat) => seat.form33_data),
      fuseOptions
    )
  }, [data.seats === undefined])

  const [searchValue, setSearchValue] = useState<string>('')

  const searchResults = useMemo(() => {
    if (searchValue.length > 0) {
      const exact = Object.values(data.seats).find((seat) => {
        const isMatchingCode =
          seat.seat.toLowerCase().replaceAll('-', '') ===
          searchValue.toLowerCase().replaceAll('-', '')
        const isMatchingNumber = parseInt(seat.seat) === parseInt(searchValue)

        return isMatchingCode || isMatchingNumber
      })

      const results: {
        item: Seat
      }[] = []
      if (exact) {
        results.push({
          item: exact
        })
      }

      results.push(
        ...fuse
          .search(searchValue)
          .filter((result) => result.item.seat !== exact?.seat)
      )

      return results
    } else {
      return Object.values(data.seats)
        .filter((seat) => seat.form33_data)
        .map((seat) => {
          return {
            item: seat
          }
        })
    }
  }, [searchValue])

  const navigate = useNavigate()

  const PROVINCE_COLORS: {
    [key in Province]: string
  } = {
    balochistan: '#3b82f6', // purple
    punjab: '#a855f7', // blue
    sindh: '#fbbf24', // yellow
    kpk: '#14b8a6' // green
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
            {searchResults?.map((result) => {
              return (
                <div
                  key={result.item.seat}
                  className="flex font-mono py-1 hover:bg-red-50 px-2 cursor-pointer text-gray-700 hover:border-l-8 border-red-500"
                  onClick={() => {
                    setOpen(false)
                    navigate('/' + result.item.seat)
                  }}
                >
                  <div
                    className="font-bold min-w-fit mr-4 text-white px-2"
                    style={{
                      backgroundColor:
                        PROVINCE_COLORS[result.item.province as Province]
                    }}
                  >
                    {result.item.seat}
                  </div>
                  <div className="text-right">
                    {result.item.form33_data.constituency_name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      }
    >
      <div className="flex min-w-max h-full">
        <MenuItem
          className="cursor-pointer hover:bg-emerald-200 pr-1"
          onClick={() => setOpen(true)}
        >
          {selected ? (
            <div className="flex">
              <div
                className="font-bold min-w-fit mr-3 text-white px-2"
                style={{
                  backgroundColor:
                    PROVINCE_COLORS[selected.province as Province]
                }}
              >
                {selected.seat}
              </div>
              <div>{selected.form33_data.constituency_name}</div>
            </div>
          ) : (
            'SELECT'
          )}
          <RiArrowDropDownLine className="w-8 h-8 ml-1" />
        </MenuItem>
      </div>
    </Popover>
  )
}

export default SearchConstituency
