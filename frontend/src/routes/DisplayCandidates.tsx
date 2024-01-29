import { Constituency } from './models'

const DisplayCandidates = ({
  constituency
}: {
  constituency: Constituency
}) => {
  return (
    <div className="flex overflow-x-auto relative h-full">
      <table
        className="w-full text-left text-gray-500"
        style={{ fontSize: 10 }}
      >
        <thead className="w-full text-gray-700 uppercase bg-gray-50">
          <tr>
            {Object.keys(constituency.Candidates[0]).map((key) => (
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
                  {key === 'pti_backed' ? (!!value ? 'TRUE' : 'FALSE') : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DisplayCandidates
