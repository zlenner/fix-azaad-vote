import { RiArrowDropRightLine } from 'react-icons/ri'
import { RiArrowDropLeftLine } from 'react-icons/ri'
import useAsyncRefresh from '../hooks/useAsyncRefresh'
import { useEffect, useMemo, useState } from 'react'
import { Constituency } from './models'
import MenuItem from './MenuItem'
import SearchConstituency from './SearchConstituency'
import { Link, useParams } from 'react-router-dom'
import DisplayCandidates from './DisplayCandidates'
import DisplayPage from './DisplayPage'
import { FaGithub } from 'react-icons/fa6'

function App() {
  const { value } = useAsyncRefresh(async () => {
    const [balochistan, kpk, punjab, sindh] = await Promise.all([
      fetch('https://elections-data.vercel.app/NA/balochistan.json').then((r) =>
        r.json()
      ),
      fetch('https://elections-data.vercel.app/NA/kpk.json').then((r) =>
        r.json()
      ),
      fetch('https://elections-data.vercel.app/NA/punjab.json').then((r) =>
        r.json()
      ),
      fetch('https://elections-data.vercel.app/NA/sindh.json').then((r) =>
        r.json()
      )
    ])

    const combined = {
      ...balochistan,
      ...kpk,
      ...punjab,
      ...sindh
    } as {
      [key: string]: Constituency
    }

    return combined
  }, [])

  const { constituency_code } = useParams()

  const selected = useMemo(() => {
    if (!value || !constituency_code) {
      return
    }

    return value[constituency_code]
  }, [constituency_code, value === undefined])

  if (value === undefined) {
    return <div>Loading...</div>
  }

  const next =
    selected &&
    value[
      'NA-' + (parseInt(selected['Constituency No'].slice(3)) + 1).toString()
    ]
  const prev =
    selected &&
    value[
      'NA-' + (parseInt(selected['Constituency No'].slice(3)) - 1).toString()
    ]

  console.log(selected, next, prev)

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex bg-emerald-100 h-14 w-full">
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
          href="https://github.com/zlenner/elections-data/tree/main/NA"
          target="_blank"
          className="flex w-full"
        >
          <MenuItem className="flex hover:bg-green-200 cursor-pointer w-16 text-gray-700 items-center justify-center text-2xl ml-auto">
            <FaGithub />
          </MenuItem>
        </a>
        <MenuItem
          className="cursor-pointer hover:bg-green-200 pl-1"
          disabled={!prev}
        >
          <Link
            to={`/${prev?.['Constituency No']}`}
            className="flex items-center"
          >
            <RiArrowDropLeftLine className="w-8 h-8" />
            <div className="hidden sm:block">BACK</div>
          </Link>
        </MenuItem>
        <SearchConstituency selected={selected} constituencies={value} />
        <MenuItem
          className="cursor-pointer hover:bg-green-200 pr-1"
          disabled={!next}
        >
          <Link
            to={`/${next?.['Constituency No']}`}
            className="flex items-center"
          >
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
          <div className="w-7/12 p-4">
            <DisplayCandidates constituency={selected} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
