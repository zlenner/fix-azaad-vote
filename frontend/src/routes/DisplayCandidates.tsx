import { Constituency } from './models'

const DisplayCandidates = ({
  constituency
}: {
  constituency: Constituency
}) => {
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
          style={{ fontSize: 10 }}
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
            {constituency.Candidates.map((candidate, index) => (
              <tr key={index} className="bg-white border-b">
                {Object.entries(candidate).map(([key, value]) => (
                  <td className="py-2 px-1" key={key}>
                    {key === 'pti_backed' ? (
                      <strong>{!!value ? 'TRUE' : 'FALSE'}</strong>
                    ) : key === 'symbol_url' ? (
                      <a href={value} className="text-blue-500 hover:underline">
                        {value.substring(30)}
                      </a>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisplayCandidates
