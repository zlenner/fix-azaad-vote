import { Seat } from '../hooks/useData/useLoadData'

const DisplayCandidates = ({ constituency }: { constituency: Seat }) => {
  const keys = [
    'NO',
    'Name (English)',
    'Name (URDU)',
    'Address',
    'Symbol',
    'Party',
    'Symbol No',
    'Symbol File',
    'PTI Backed'
  ]
  return (
    <div className="flex flex-col h-full">
      <div className="bg-emerald-600 text-white px-4 py-2 font-bold">
        Digital Format (used for sample ballot papers)
      </div>
      <div className="flex overflow-x-auto relative h-full p-2">
        <table
          className="w-full text-left text-gray-500"
          style={{ fontSize: 14 }}
        >
          <thead className="w-full text-gray-700 uppercase bg-gray-50">
            <tr>
              {keys.map((key) => (
                <th scope="col" className="py-2 px-2" key={key}>
                  {key.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {constituency.candidates?.map((candidate, index) => {
              console.log(candidate.pti_backed)
              return (
                <tr key={index} className="bg-white border-b">
                  <td className="py-2 px-1">{candidate.serial_no}</td>
                  <td className="py-2 px-1">
                    {candidate.candidate_english_name}
                  </td>
                  <td className="py-2 px-1">{candidate.candidate_urdu_name}</td>
                  <td className="py-2 px-1">{candidate.address}</td>
                  <td className="py-2 px-1">{candidate.symbol_name}</td>
                  <td className="py-2 px-1">{candidate.party}</td>
                  <td className="py-2 px-1">{candidate.symbol_no}</td>
                  <td className="py-2 px-1">
                    <a
                      href={candidate.symbol_url}
                      className="text-blue-500 hover:underline"
                    >
                      {candidate.symbol_url.substring(30)}
                    </a>
                  </td>
                  <td className="py-2 px-1 font-bold">
                    {candidate.pti_backed ? 'TRUE' : ''}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisplayCandidates
