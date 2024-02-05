import { RiArrowDropRightLine } from 'react-icons/ri'
import { RiArrowDropLeftLine } from 'react-icons/ri'
import useAsyncRefresh from '../hooks/useAsyncRefresh'
import { useMemo } from 'react'
import MenuItem from './MenuItem'
import SearchConstituency from './SearchConstituency'
import { Link, useParams } from 'react-router-dom'
import DisplayCandidates from './DisplayCandidates'
import DisplayPage from './DisplayPage'
import { FaGithub } from 'react-icons/fa6'
import { DataProvider, useData } from '../hooks/useData'
import { useLoadData } from '../hooks/useData/useLoadData'

function AddProvinceName(province: string) {
  return (data: any) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        {
          ...(value as any),
          province: province
        }
      ])
    )
  }
}

function App() {
  const data = useLoadData()

  const { constituency_code } = useParams()

  const selected = useMemo(() => {
    if (!data || !constituency_code) {
      return
    }

    return data.seats[constituency_code]
  }, [constituency_code, data === undefined])

  if (data === undefined) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        Loading...
      </div>
    )
  }

  const next =
    selected &&
    data.seats['NA-' + (parseInt(selected.seat.slice(3)) + 1).toString()]
  const prev =
    selected &&
    data.seats['NA-' + (parseInt(selected.seat.slice(3)) - 1).toString()]

  return (
    <DataProvider initialValue={data}>
      <div className="flex flex-col w-full h-full">
        <div className="flex h-14 w-full">
          <MenuItem className="whitespace-break-spaces font-bold">
            FIX{' '}
            <a
              href="https://azaadvote.com"
              className="text-blue-400 hover:underline"
            >
              azaadvote.com
            </a>
          </MenuItem>
          <a
            href="https://github.com/zlenner/elections-data"
            target="_blank"
            className="flex w-full"
          >
            <MenuItem className="flex hover:bg-emerald-200 cursor-pointer w-16 text-gray-700 items-center justify-center text-2xl ml-auto">
              <FaGithub />
            </MenuItem>
          </a>
          <MenuItem
            className="cursor-pointer hover:bg-emerald-200 pl-1"
            disabled={!prev}
          >
            <Link to={`/${prev?.seat}`} className="flex items-center">
              <RiArrowDropLeftLine className="w-8 h-8" />
              <div className="hidden sm:block">BACK</div>
            </Link>
          </MenuItem>
          <SearchConstituency selected={selected} constituencies={data.seats} />
          <MenuItem
            className="cursor-pointer hover:bg-emerald-200 pr-1"
            disabled={!next}
          >
            <Link to={`/${next?.seat}`} className="flex items-center">
              <div className="hidden sm:block">NEXT</div>
              <RiArrowDropRightLine className="w-8 h-8" />
            </Link>
          </MenuItem>
        </div>
        {selected ? (
          <div className="flex" style={{ height: 'calc(100% - 3.5rem)' }}>
            <div className="flex flex-col w-5/12 h-full border-r-4 border-dashed">
              <DisplayPage constituency={selected} />
            </div>
            <div className="w-7/12">
              <DisplayCandidates constituency={selected} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full p-4 text-2xl text-gray-500">
            <div className="flex text-center" style={{ width: 600 }}>
              Select a constituency from the dropdown in the top-right corner.
            </div>
          </div>
        )}
      </div>
    </DataProvider>
  )
}

export default App
